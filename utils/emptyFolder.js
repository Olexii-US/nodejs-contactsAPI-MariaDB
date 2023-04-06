const fsPromises = require("fs/promises");
const path = require("path");

const emptyFolder = async (folderPath) => {
  try {
    const files = await fsPromises.readdir(folderPath);
    for (const file of files) {
      await fsPromises.unlink(path.resolve(folderPath, file));
      console.log(`${folderPath}/${file} has been removed successfully`);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { emptyFolder };
