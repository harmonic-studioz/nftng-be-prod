const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Images = require("../../helpers/Images");
const Merchandise = require("../../helpers/merchandise");

const errorTest = async (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw {
      status: 400,
      error: errors.array(),
    };
};

const createMerchandise = asyncHandler(async (req, res) => {
  await errorTest(req);

  const merchandise = await new Merchandise().createMerchandise(req.body);
  res.send(merchandise);
});

const imageUpload = asyncHandler(async (req, res) => {
  const { files } = req;
  const images = new Images();
  await images.compressImages(files.map((file) => file.buffer));
  const uploaded = await images.uploadImages();
  res.send(uploaded);
});

const updateMerchandise = asyncHandler(async (req, res) => {
  await errorTest(req);
  const { merchandiseId } = req.params;
  const updates = await new Merchandise(merchandiseId).updateMerchandise(
    req.body
  );
  res.send(updates);
});

const getMerchandise = asyncHandler(async (req, res) => {
  await errorTest(req);
  const merchandiseData = await new Merchandise().getMerchandise(req.query);
  res.send(merchandiseData);
});

const getSingleMerchandise = asyncHandler(async (req, res) => {
  await errorTest(req);
  const merchandise = await new Merchandise(
    req.params.merchandiseId
  ).getSingleMerchandise();
  res.send(merchandise);
});

const deleteMerchandise = asyncHandler(async (req, res) => {
  await errorTest(req);
  await new Merchandise(req.params.merchandiseId).deleteMerchandise();
  res.status(200).send({
    id: req.params.merchandiseId,
  });
});
module.exports = {
  createMerchandise,
  imageUpload,
  updateMerchandise,
  getMerchandise,
  getSingleMerchandise,
  deleteMerchandise,
};
