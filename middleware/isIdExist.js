const pool = require("../dbConnection");

const isContactIdExist = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    const isIdExist = await conn.query(
      `SELECT id FROM contacts WHERE id='${req.params.contactId}'`
    );
    conn.close();

    if (isIdExist.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  isContactIdExist,
};
