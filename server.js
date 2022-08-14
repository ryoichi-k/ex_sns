const express = require('express');

const app = express();
const userRoute = require("./routes/users");
const port = 3000;

//ミドルウェア
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
    res.send("aiueo")
})

// ポート番号を付与したアクセスURLを実行
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})