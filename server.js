const app = require("./app");

// module.exports Need only for Jest Test
module.exports = app.listen(process.env.PORT, () => {
  console.log(`Server running. Use our API on port: ${process.env.PORT}`);
});
