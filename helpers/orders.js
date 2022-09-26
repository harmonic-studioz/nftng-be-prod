const { Op } = require("sequelize");
const db = require("../models");
const Merchandise = require("./merchandise");

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
    const newOrder = await db.orders.create({ ...data, totalAmount });

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
}

module.exports = Orders;
