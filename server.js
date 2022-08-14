const express = require('express');

const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();

//mongodb接続
mongoose.connect(
    process.env.MONGOURL
).then(() => {
    console.log("db connect");
}).catch((err) => {
    console.log(err);
});

//ミドルウェア
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
    res.send("aiueo")
})

// ポート番号を付与したアクセスURLを実行
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})