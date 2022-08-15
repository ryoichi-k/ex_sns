const router = require("express").Router();
const Post = require("../models/Post");

//投稿を作成する
router.post("/", async (req, res) => {
    //インスタンス化
    const newPost = new Post(req.body);
    try {
        //DBに保存
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;