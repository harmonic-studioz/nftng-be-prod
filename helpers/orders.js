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
}

module.exports = Orders;
