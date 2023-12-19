// 必要なモジュールを読み込む
const router = require("express").Router(); // ExpressのRouterを利用するためのモジュール
const multer = require("multer"); // ファイルアップロード用のミドルウェア

// ファイルの保存先と保存ファイル名を指定するためのmulterのストレージ設定
const storage = multer.diskStorage({
  // ファイルの保存先を指定
  destination: (req, file, cb) => {
    // "public/images" ディレクトリに保存
    cb(null, "public/images");
  },
  // ファイル名を指定
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
// multerを使用してアップロード処理を行うミドルウェアの設定
const upload = multer({ storage });
// 画像アップロード用APIのルートハンドラー "/"="/api/upload"
router.post("/", upload.single("file"), (req, res) => {
  try {
    // アップロード成功時のレスポンス
    return res.status(200).json("画像アップロードに成功しました！");
  } catch (err) {
    // エラーハンドリング
    console.log(err);
  }
});

module.exports = router;
