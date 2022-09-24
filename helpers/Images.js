const sharp = require("sharp");
const AWS = require("aws-sdk");
const rm = require("randomstring");
const db = require("../models");
const config = require("../config.json")[process.env.NODE_ENV];
const s3 = new AWS.S3({
  accessKeyId: config.spaces.accessKey,
  secretAccessKey: config.spaces.secretKey,
  endpoint: config.spaces.endPoint,
});
class Images {
  compressImages = async (images = []) => {
    const compressed = await Promise.all(
      images.map(async (image) => {
        return await sharp(image).jpeg({ quality: 20 }).toBuffer();
      })
    );
    this.compressed = compressed;
    return compressed;
  };

  uploadImages = async (
    imageBlobs = this.compressed,
    path = "nft-ng/" + process.env.NODE_ENV
  ) => {
    const uploaded = await Promise.all(
      imageBlobs.map(async (image) => {
        const upload = await s3
          .upload({
            Bucket: config.spaces.spacesName,
            Key: `${path}/${rm.generate(16)}.jpeg`,
            ACL: "public-read",
            Body: image,
          })
          .promise();

        return upload.Location;
      })
    );
    this.uploaded = await db.images.bulkCreate(
      uploaded.map((imageUrl) => {
        return {
          url: imageUrl,
        };
      })
    );
    return this.uploaded;
  };
}
module.exports = Images;
