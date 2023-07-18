const cloudinaryConfig = require("../utils/cloudinary");

const imageUpload = async (req) => {
  const result = [];
  await Promise.all(
    req.files.map(async (file) => {
      const imgInfo = await cloudinaryConfig.uploader.upload(file.path, {
        folder: "findFurniture",
        quality: "auto",
      });

      result.push({
        url: imgInfo?.secure_url,
        publicId: imgInfo?.public_id,
      });
    })
  );
  return result;
};

module.exports = imageUpload;
