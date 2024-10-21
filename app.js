const express = require("express");
const app = express();
const port = process.env.port || 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require("cors")
app.use(cors());
require("./models/model");
require("./models/post")
app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))
const path = require("path")
// mongoose.connect(mongoUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

mongoose.connect(mongoUrl);
mongoose.connection.on("connected", () => {
    console.log("successfully connected to mongoose")
})
mongoose.connection.on("error", () => {
    console.log("not connected successfully to mongoose")
})
// Serving the frontend
app.use(express.static(path.join(__dirname, "./frontend/build")))
app.use("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "./frontend/build/index.html"),
        function (err) {
            res.status(500).send(err)
        }

    )
})
app.listen(port, () => {
    console.log("server is running on" + " " + port)
})