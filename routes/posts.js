const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

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
//投稿を更新する
router.put("/:id", async (req, res) => {
    try {
        //postには更新したい投稿が入る
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("投稿編集に成功！");
        } else {
            return res.status(403).json("他の人の投稿を編集できません。");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});
//投稿を削除する
router.delete("/:id", async (req, res) => {
    try {
        //postには削除したい投稿１つが入る
        const post = await Post.findById(req.params.id);
        //投稿した本人のみが削除できる
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("投稿削除に成功！");
        } else {
            return res.status(403).json("他の人の投稿を削除できません。");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});
//特定の投稿を取得する
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(403).json(err);
    }
});

//特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        //いいねが押されていない場合のみいいね可能
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });

            return res.status(200).json("いいね success");
            //投稿に既にいいねされていたとき
        } else {
            //いいねしているuseridを取り除く
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                },
            });
            return res.status(403).json("いいね外しました");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//タイムラインの投稿取得
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        //_idはcurrentUserのuseridのこと
        const userPosts = await Post.find({ userId: currentUser._id });
        //自分がフォローしている友達の投稿内容を全て取得する
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        //mapで一つづつ取り出しているため、...friendPostsと記述
        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        return res.status(500).json(err);
    }
});


//自分の投稿したもののみ取得（プロフィール用）
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        //_idはuserのuseridのこと
        const posts = await Post.find({ userId: user._id });
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;