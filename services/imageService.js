const multer = require("multer");
const uuid = require("uuid").v4;
const path = require("path");
const fsPromises = require("fs/promises");
const fsExt = require("fs-extra");
const Jimp = require("jimp");
const { emptyFolder } = require("../utils/emptyFolder");

class ImageService {
  static upload(name) {
    const multerStorage = multer.diskStorage({
      destination: (req, file, cbk) => {
        cbk(null, "tmp");
      },
      filename: (req, file, cbk) => {
        const extention = file.mimetype.split("/")[1];
        cbk(null, `${req.user.id}.${extention}`);
      },
      limits: {
        //   5mb
        fileSize: 5 * 1024 * 1024,
      },
    });

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith("image")) {
        cbk(null, true);
      } else {
        cbk(new Error("Only image is alowed to download!"), false);
      }
    };
    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(tmpPath, userId, width, height, ...pathParts) {
    const tmpAvatarPath = path.resolve(tmpPath);

    const avatarFileName = await fsPromises.readdir(tmpAvatarPath);

    const userAvatar = avatarFileName.find((item) => {
      return path.parse(item).name === `${userId}`;
    });

    const fileName = `${uuid()}.jpg`;

    // const filePath = path.join(process.cwd(), "public", ...pathParts);
    const filePath = path.join(process.cwd(), "public\\avatars");

    await fsExt.ensureDir(filePath);

    const imgWidth = width || 300;
    const imgHeight = height || 300;

    await Jimp.read(`${tmpAvatarPath}/${userAvatar}`)
      .then((img) => {
        console.log("imgWidth, imgHeight", imgWidth, imgHeight);

        return img
          .resize(imgWidth, imgHeight)
          .quality(60)
          .write(path.join(filePath, fileName));
      })
      .catch((err) => {
        console.error(err);
      });

    emptyFolder(tmpAvatarPath);

    return path.join(...pathParts, fileName);
  }
}

// Class without /tmp
// Avatar is saving on memoryStorage and Jimp saves into /public
// class ImageService {
//   static upload(name) {
//     const multerStorage = multer.memoryStorage();

//     const multerFilter = (req, file, cbk) => {
//       if (file.mimetype.startsWith("image")) {
//         cbk(null, true);
//       } else {
//         cbk(new Error("Only image is alowed to download!"), false);
//       }
//     };
//     return multer({
//       storage: multerStorage,
//       fileFilter: multerFilter,
//     }).single(name);
//   }

//   static async save(file, width, height, ...pathParts) {
//     const fileName = `${uuid()}.jpg`;

//     const filePath = path.join(process.cwd(), "public", ...pathParts);

//     await fsExt.ensureDir(filePath);

//     const imgWidth = width || 300;
//     const imgHeight = height || 300;

//     await Jimp.read(file.buffer)
//       .then((img) => {
//         return img
//           .resize(imgWidth, imgHeight)
//           .quality(60)
//           .write(path.join(filePath, fileName));
//       })
//       .catch((err) => {
//         console.error(err);
//       });

//     return path.join(...pathParts, fileName);
//   }
// }

module.exports = { ImageService };
