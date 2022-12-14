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
router.delete("/:id", async (req, res) => {
    //user id の照合
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("delete success");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("sorry you cannnot delete others information");
    }
});
//ユーザー情報取得
// router.get("/:id", async (req, res) => {
//     //user id の照合

//     try {
//         const user = await User.findById(req.params.id);
//         //passwordとupdatedAt情報を抜いた情報であるotherを返すように分割代入
//         const { password, updatedAt, ...other } = user._doc;
//         return res.status(200).json(other);
//     } catch (err) {
//         return res.status(500).json(err);
//     }

// });

//クエリでユーザー情報取得
router.get("/", async (req, res) => {

    const userId = req.query.userId;
    const username = req.query.username;

    try {

        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });

        //passwordとupdatedAt情報を抜いた情報であるotherを返すように分割代入
        const { password, updatedAt, ...other } = user._doc;
        return res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }

});

//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            //user→フォローする対象ユーザー
            const user = await User.findById(req.params.id);
            //currentUser→自身
            const currentUser = await User.findById(req.body.userId);
            //既にフォローしているか
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    },
                });
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("follow success");
            } else {
                return res.status(403).json("あなたは既にこのユーザーをフォローしています。");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("cannnot follow yourself");
    }
});

//ユーザーのアンフォロー
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            //user→フォローする対象ユーザー
            const user = await User.findById(req.params.id);
            //currentUser→自身
            const currentUser = await User.findById(req.body.userId);
            //既にフォローしている場合のみフォローを外せる
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    },
                });
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォローを解除しました。");
            } else {
                return res.status(403).json("フォロー解除できません。");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("cannnot unfollow yourself");
    }
});

module.exports = router;