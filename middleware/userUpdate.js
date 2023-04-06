const { ImageService } = require("../services/imageService");

const uploadUserAvatar = ImageService.upload("avatarURL");
// exports.uploadUserAvatar = ImageService.upload("avatarURL");

module.exports = {
  uploadUserAvatar,
};

// Multer modelware without Class Service
// const multer = require("multer");
// const uuid = require("uuid").v4;

// const storage = multer.diskStorage({
//   destination: (req, file, cbk) => {
//     cbk(null, "tmp");
//   },
//   filename: (req, file, cbk) => {
//     const extention = file.mimetype.split("/")[1];
//     cbk(null, `${req.user.id}_${uuid()}.${extention}`);
//   },
//   limits: {
//     //   5mb
//     fileSize: 5 * 1024 * 1024,
//   },
// });

// const multerFilter = (req, file, cbk) => {
//   if (file.mimetype.startsWith("image")) {
//     cbk(null, true);
//   } else {
//     cbk(new Error("Only image is alowed to download!"), false);
//     // send error!!!!!!!!!!!
//   }
// };

// const uploadUserAvatar = multer({
//   storage: storage,
//   fileFilter: multerFilter,
// }).single("avatarURL");

// module.exports = {
//   uploadUserAvatar,
// };
