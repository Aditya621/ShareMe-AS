require("dotenv").config();
const mongoose = require("mongoose");
function connectDB() {
  // Database connection 🥳
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log("DataBase connected ");
    })
    .catch((err) => {
      console.log("not connectd");
    });
}
module.exports = connectDB;
