const { ImageService } = require("../services/imageService");

const uploadUserAvatar = ImageService.upload("avatarURL");

module.exports = {
  uploadUserAvatar,
};
