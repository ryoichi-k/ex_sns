const router = require("express").Router();
const User = require("../models/User");

//crud操作
//ユーザー情報更新
router.put("/:id", async (req, res) => {
    //user id の照合
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                //$setの意味は「全てのパラメータを指定」
                $set: req.body,
            });
            res.status(200).json("update success");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("sorry you cannnot change others information");
    }
});
//ユーザー情報削除
//ユーザー情報取得





// router.get("/", (req, res) => {
//     res.send("user router");
// });

module.exports = router;