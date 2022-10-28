const { Op } = require("sequelize");
const db = require("../models");

class Merchandise {
  constructor(merchandiseId) {
    this.id = merchandiseId;
  }
  createMerchandise = async (data = {}) => {
    const merchandise = await db.merchandise.create(data);
    const { merchandiseImages } = data;
    await db.images.update(
      {
        merchandiseId: merchandise.id,
      },
      {
        where: {
          id: merchandiseImages,
        },
      }
    );
    return this.getSingleMerchandise(merchandise.id);
  };

  updateMerchandise = async (data = {}) => {
    await db.merchandise.update(data, {
      where: {
        id: data.id || this.id,
      },
    });
    if (data.images?.length) {
      //update image
      await db.images.destroy({
        where: {
          merchandiseId: data.id || this.id,
        },
      });
      await db.images.update(
        {
          merchandiseId: data.id || this.id,
        },
        {
          where: {
            id: {
              [Op.in]: data.images,
            },
          },
        }
      );
    }

    return this.getSingleMerchandise(data.id || this.id);
  };

  getSingleMerchandise = async (merchandiseId = this.id) => {
    return await db.merchandise.findOne({
      where: {
        id: merchandiseId,
      },
      include: {
        model: db.images,
      },
    });
  };

  deleteMerchandise = async (merchandiseId = this.id) => {
    return await db.merchandise.destroy({
      where: {
        id: merchandiseId,
      },
    });
  };

  getMerchandise = async (fields = {}) => {
    console.log(fields.name);
    const options = {
      ...(!fields.all && {
        quantity: {
          [Op.gt]: 0,
        },
      }),
      ...(fields.name && {
        name: { [Op.like]: `%${fields.name}%` },
      }),
    };
    const totalMerchandise = await db.merchandise.count({
      where: options,
    });
    const offset = (fields.page - 1) * fields.limit;
    const totalPages = Math.ceil(totalMerchandise / fields.limit);

    const merchandise = await db.merchandise.findAll({
      where: options,
      include: {
        model: db.images,
      },
      limit: fields.limit,
      offset,
      order: [["createdAt", "desc"]],
    });
    return {
      results: merchandise,
      totalMerchandise,
      totalPages,
      page: fields.page,
      limit: fields.limit,
    };
  };
}

module.exports = Merchandise;
