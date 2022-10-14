// create Server
// require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const connectDB = require("./config/db");
connectDB();

//cors

const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
  //['https://localhost:3000', 'https://localhost:5000',https://localhost:3300]
};

//" use "because it is a middleware
app.use(cors(corsOptions));

// if applicaion get any JSON data then they parse it
app.use(express.json());

//static middle ware so that the know where is css
app.use(express.static("public"));

//Template engine
// in this way our application know
//  ki sari template joh html files hai voh kon seh
// folder keh andar hai
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//Routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
// for active download button
app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

//user Name = shareMe
// password =123456789shareMe
// 27.255.205.26/32

//
