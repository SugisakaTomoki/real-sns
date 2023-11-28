const router = require("express").Router();
const Post = require("../models/Post");

// 投稿を作成する
// ExpressのRouterを使って新しいエンドポイント"/"を定義
router.post("/", async (req, res) => {
  // req,bodyには新しい投稿のデータが含まれる。
  // 新しい投稿のデータを使って、Postモデルのインスタンスを作成
  const newPost = new Post(req.body);
  try {
    // 新しい投稿をデータベースに保存し、保存された投稿のデータを取得
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
