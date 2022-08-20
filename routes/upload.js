const router = require("express").Router();
const User = require("../models/User");

const multer = require("multer");


const storage = multer.diskStorage({
    //保存先
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      // cb(null, file.filename + "-" + Date.now());
      cb(null, req.body.name);
    },
  });

const upload = multer({storage});

//画像アップロード
router.post("/", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("画像のアップロードに成功しました");
    } catch (err) {
      console.log(err);
    }
});

module.exports = router;