//pass = l2OK0toTZ8QTTZ9Z

const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./Route/UserRoute");
const farmerRouter = require("./routes/farmerRoutes");
const farmerDataRouter = require("./routes/farmerDataRoutes");

const app = express();
const cors = require("cors")

//middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", userRouter);
app.use("/api/farmers", farmerRouter);
app.use("/api/farmer-data", farmerDataRouter);

mongoose.connect("mongodb+srv://cropsync:l2OK0toTZ8QTTZ9Z@cluster0.undec.mongodb.net/")
.then(() => console.log("connected to mongo"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log((err)));