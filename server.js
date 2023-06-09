const express = require("express");
const mongoose = require("mongoose");
const productRouter = require("./routes/product.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.use("/api/products", productRouter);
app.use("/api/products/:serialNumber", productRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for request");
  });
});
