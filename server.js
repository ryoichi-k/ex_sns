const express = require('express');

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("aiueo")
})

// ポート番号を付与したアクセスURLを実行
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})