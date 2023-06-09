const express = require("express");
const router = express.Router();
const Product = require("../model/product.js");

router.post("/", async (req, res) => {
  const { name, serialNumbers, modelNumbers, date } = req.body;
  try {
    const product = new Product({
      name,
      compDetails: serialNumbers.map((serialNumber, index) => ({
        serialNumber,
        modelNumber: modelNumbers[index],
      })),
      date,
    });
    if (!product) {
      res.status(401).json({ message: "Enter fields correctly" });
    }
    await product.save();
    res.status(200).json({ message: "Added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:serialNumber", async (req, res) => {
  const { serialNumber } = req.params;
  try {
    const products = await Product.find({
      "compDetails.serialNumber": { $regex: `.*${serialNumber}.*` },
      // compDetails: { $elemMatch: { serialNumber } },
    });
    console.log(products);
    if (!products[0]) {
      return res.status(404).json({
        message: `Compressor with serial number ${serialNumber} not found`,
      });
    } else {
      const formattedProducts = products.map(
        ({ _id, name, date, compDetails }) => ({
          _id: _id,
          name: name,
          date: date,
          compDetails: compDetails.filter((compDetail) => {
            const regExp = new RegExp(serialNumber);
            return regExp.test(compDetail.serialNumber.toString());
          }),
        })
      );
      res.status(200).json(formattedProducts);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:newSerialNumber", async (req, res) => {
  const { selectedName, selectedSerialNumber } = req.body;
  const { newSerialNumber } = req.params;
  const name = selectedName;
  const serialNumber = selectedSerialNumber;
  try {
    const product = await Product.findOneAndUpdate(
      { name, "compDetails.serialNumber": serialNumber },
      {
        $set: {
          "compDetails.$.serialNumber": newSerialNumber,
          "compDetails.$.isReplace": true,
        },
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Compressor not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
