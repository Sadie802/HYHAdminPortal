//-----BOILER PLATE -- CONNECTING TO EXPRESS SERVER ------//
const express = require("express");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const port = process.env.PORT || 8003;
require("dotenv").config();
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//-------END BOILER PLATE----------------------//

//bringing in schema
const requestSchema = require("./data.js");
const { response } = require("express");
const { send } = require("express/lib/response");

//model for schema instances
const Request = mongoose.model("RequestItem", requestSchema);

//creating API route for the front end to access ALL NOT FUNDED entries from the database
app.get("/", async (request, response) => {
  //assigning the result of a find on our Model to a variable
  let notFunded = await Request.find({ isFunded: false });
  // logging all requestItems
  response.json(notFunded);
});

//creating API route for the front end to access ALL FUNDED entries from the database
app.get("/funded-requests", async (request, response) => {
  //assigning the result of a find on our Model to a variable
  let isFunded = await Request.find({ isFunded: true });
  // logging all requestItems
  response.json(isFunded);
});

app.post("/", async (request, response) => {
  try {
    let itemName = request.body.itemName;
    let itemPrice = request.body.itemPrice;
    let donationDescription = request.body.donationDescription;
    let isFunded = request.body.isFunded;
    let recipientName = request.body.recipientName;
    let recipientUSLocation = request.body.recipientUSLocation;
    let dateCreated = request.body.dateCreated;
    let comments = request.body.comments;
    let recipientState = request.body.recipientState;
    let itemCategory = request.body.itemCategory;

    const requestItem = new Request({
      itemName: itemName,
      itemPrice: itemPrice,
      donationDescription: donationDescription,
      isFunded: isFunded,
      recipientName: recipientName,
      recipientUSLocation: recipientUSLocation,
      dateCreated: dateCreated,
      comments: comments,
      recipientState: recipientState,
      itemCategory: itemCategory,
    });

    requestItem.save();

    response.status(200);
  } catch (error) {
    response.status(404);
    send("Request not found");
  }
});

app.post("/edit", async (request, response) => {
  try {
  let itemId = request.body.itemId;
  itemId = ObjectId(itemId);
  let itemName = request.body.itemName;
  let itemPrice = request.body.itemPrice;
  let donationDescription = request.body.donationDescription;
  let isFunded = request.body.isFunded;
  let recipientName = request.body.recipientName;
  let recipientUSLocation = request.body.recipientUSLocation;
  let dateCreated = request.body.dateCreated;
  let comments = request.body.comments;
  let recipientState = request.body.recipientState;
  let itemCategory = request.body.itemCategory;
  let updateTarget = itemId;
  await Request.updateOne(
    { _id: updateTarget },
    {
      $set: {
        itemName: itemName,
        itemPrice: itemPrice,
        donationDescription: donationDescription,
        isFunded: isFunded,
        recipientName: recipientName,
        recipientUSLocation: recipientUSLocation,
        dateCreated: dateCreated,
        comments: comments,
        recipientState: recipientState,
        itemCategory: itemCategory,
      },
    }
  );
  response.json("/");
  }catch (error) {
    response.status(404)
    send("Request not found")
  }
});

app.post("/delete", async (req, res) => {
  try {
  let itemId = req.body.itemId;
  itemId = ObjectId(itemId);
  await Request.findOneAndDelete({ _id: itemId });
  res.json("/");
  } catch (error) {
    res.status(404)
    send("Request not found")
  }
});

app.listen(port, () => {
  console.log("listening on port: " + port);
});
