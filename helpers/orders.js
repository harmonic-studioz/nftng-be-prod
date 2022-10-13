const { Op } = require("sequelize");
const db = require("../models");
const Merchandise = require("./merchandise");
const Web3 = require("web3");
const contractFunction = require("../contractFunction");
const rs = require("randomstring");
const https = require("https");
const qs = require("querystring");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://mainnet.infura.io/v3/${process.env.infura_key}`
  )
);
// const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
const pinataGateWay = "https://gateway.pinata.cloud/ipfs/";
class Orders extends Merchandise {
  constructor() {
    super();
  }
  //   create orders
  //   get orders
  //   set orders to paid
  //   get discount token

  createOrder = async (data = {}) => {
    console.log(data);
    let totalAmount = await data.merchandiseItems.reduce(
      async (prevItem, currentItem) => {
        const { price } = await this.getSingleMerchandise(
          currentItem.merchandiseId
        );
        return Number(price) * currentItem.quantity + prevItem;
      },
      0
    );

    if (data.discount) {
      const { amount, type } = data.discount;
      if (type.toLowerCase() === "fixed") {
        totalAmount = totalAmount - Number(amount);
      } else {
        const toBeRemoved = (Number(amount) * totalAmount) / 100;
        totalAmount = totalAmount - toBeRemoved;
      }
    }
    /**
     * TO DO
     * apply delivery charges to totalAmount before creating order
     */
    const { cost } = await this.getDeliveryPrice({
      countryCode: data.countryCode,
      cityName: data.city,
    });
    totalAmount += cost / 100;
    const newOrder = await db.orders.create({
      ...data,
      totalAmount,
      deliveryFee: cost / 100,
    });

    data.discount &&
      (await db.discountToken.update(
        {
          orderId: newOrder.id,
        },
        {
          where: {
            id: data.discount.id,
          },
        }
      ));
    return await db.orders.findOne({
      where: {
        id: newOrder.id,
      },
      include: {
        model: db.discountToken,
      },
    });
  };

  getOrders = async (data = {}) => {
    const options = {
      ...(data.from && {
        createdAt: {
          [Op.gte]: data.from,
        },
      }),
      ...(data.to && {
        createdAt: {
          [Op.lte]: data.to,
        },
      }),
      ...(data.merchandiseName && {}),
      ...(data.reference && {
        reference: {
          [Op.like]: `%${data.reference}%`,
        },
      }),
    };

    const totalOrders = await db.orders.count({
      where: options,
    });
    const offset = (data.page - 1) * data.limit;
    const totalPages = Math.ceil(totalOrders / data.limit);

    const orders = await db.orders.findAll({
      where: options,
      limit: data.limit,
      offset,
      order: [["createdAt", "desc"]],
      include: {
        model: db.discountToken,
      },
    });
    return {
      results: orders,
      page: data.page,
      totalOrders,
      limit: data.limit,
      totalPages,
    };
  };
  checkIfValidAddress = async (address) => {
    const contract = new web3.eth.Contract(
      contractFunction,
      process.env.nft_contract_address
    );
    const hasNft = Number(await contract.methods.balanceOf(address).call());
    if (hasNft <= 0) {
      throw {
        code: 400,
        message: `not eligible`,
      };
    }
    const indexes = [];
    let x = 0;
    while (hasNft > indexes.length) {
      indexes.push(x);
      console.log(indexes);
      x++;
    }

    const data = (
      await Promise.all(
        indexes.map(async (x) => {
          const nft = await contract.methods
            .tokenOfOwnerByIndex(address, x)
            .call();
          const URIData = await contract.methods.tokenURI(nft).call();
          const { data } = await axios.get(
            pinataGateWay + String(URIData).replace("ipfs://", "").trim()
          );
          // console.log(data);
          if (data.properties?.pass.toLowerCase() === "gold pass") {
            return true;
          }
        })
      )
    ).filter((item) => item);

    const amount = data.length
      ? process.env.gold_discount_amount
      : process.env.discount_amount;
    const newDiscountToken = await db.discountToken.create({
      token: rs.generate({ length: 10, capitalization: "uppercase" }),
      type: "PERCENTAGE",
      amount,
    });

    return newDiscountToken;
  };

  getOrdersAndDecrementMerchandiseQuantity = async (orderId) => {
    const { merchandiseItems } = await db.orders.findOne({
      where: {
        id: orderId,
      },
    });
    const transaction = await db.sequelize.transaction();
    try {
      const decrementAll = await Promise.all(
        merchandiseItems.map(async (item) => {
          await db.merchandise.decrement("quantity", {
            by: item.quantity,
            transaction,
            where: {
              id: item.merchandiseId,
            },
          });
        })
      );
      await transaction.commit();
      return decrementAll;
    } catch (err) {
      await transaction.rollback();
    }
  };

  getDeliveryPrice = async (data = {}) => {
    const { cityName, countryCode } = data;
    const { default_city_name, default_country_code } = process.env;
    const toSend = {
      senderDetails: {
        cityName: default_city_name,
        countryCode: default_country_code,
      },
      receiverDetails: {
        cityName,
        countryCode,
      },
      totalWeight: 1,
    };
    try {
      const fetchData = await new Promise(async (resolve, reject) => {
        https.get(
          `https://api-topship.com/api/get-shipment-rate/?shipmentDetail=${JSON.stringify(
            toSend
          )}`,
          (res) => {
            res.on("error", (err) => reject(err));
            res.on("data", (data) => resolve(data));
          }
        );
      });

      return JSON.parse(fetchData)[0];
    } catch (err) {
      // console.log(err.response);
      throw {
        message: "an unknown error occurred",
        code: 500,
      };
    }
  };
}

// new Orders()
//   .checkIfValidAddress("0xd2b507223552e1b21a48b8ca3fc0c43bb80a3ceb")
//   .catch();
module.exports = Orders;
