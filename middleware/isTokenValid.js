const { asyncWrapper } = require("../helpers/tryCatchHelper");
const { tokenDecoder } = require("../services/getToken");
const pool = require("../dbConnection");

const protectedWithToken = asyncWrapper(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  let decodedToken;

  try {
    decodedToken = tokenDecoder(token);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Not authorized" });
  }

  const conn = await pool.getConnection();

  const currentUser = await conn.query(
    `SELECT * FROM users WHERE id = ${decodedToken.id}`
  );
  conn.close();

  if (!currentUser[0])
    return res.status(401).json({ message: "Not authorized" });

  req.user = currentUser[0];

  next();
});

module.exports = {
  protectedWithToken,
};
