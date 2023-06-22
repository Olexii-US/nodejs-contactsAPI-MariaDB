const swaggerJSDoc = require("swagger-jsdoc");

const swaggerSetups = () => {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "ContactsBook API",
      version: "1.0.0",
      description:
        "This is a REST API application made with Express. It's convenient daily contacts book on MariaDB with loginization.",
      license: {
        name: 'Licensed Under: "Ja Tebe Najdy Inc. :)"',
      },
      contact: {
        name: "Olexii Usatiuk",
        url: "https://github.com/Olexii-US/nodejs-contactsAPI-MariaDB",
      },
    },
    servers: [
      {
        url: process.env.DEV_URL,
        description: "Development server",
      },
    ],
  };

  const options = {
    swaggerDefinition,
    apis: ["./routes/api/*.js", "./services/swaggerDocs/*.yaml"],
    // apis: ["./routes/api/*.js", "./service/swaggerDocs/*.yaml"],
  };

  const swaggerSpec = swaggerJSDoc(options);
  return swaggerSpec;
};

module.exports = {
  swaggerSetups,
};
