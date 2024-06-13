const express = require("express");
const mongoose = require("mongoose");
const quotesModel = require("./models/quoteModel");

const app = express();

app.get("/getQuotes", async (req, res) => {
    console.log("HTTP request from", req.url);
    const quote = await quotesModel.aggregate([{ $sample: { size: 10 } }]);
    res.header("Access-Control-Allow-Origin", "http://localhost:5173").json(
        quote
    );
});

mongoose
    .connect("mongodb://localhost:27017/MCU" /*process.env.MONGO_URI*/)
    .then(() => {
        // listen for requests
        app.listen(3000 /*process.env.PORT*/, () => {
            console.log(
                "connected to db & listening on port",
                process.env.PORT
            );
        });
    })
    .catch((error) => {
        console.log(error);
    });
