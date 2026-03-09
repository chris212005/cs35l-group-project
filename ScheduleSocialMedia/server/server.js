const server = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

require("./config/dbConfig");

const port = process.env.PORT || process.env.PORT_NUMBER || 3000;

server.listen(port, () => {
  console.log("Listening to requests on PORT: " + port);
});