const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

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

// 投稿を更新する
// Expressのrouterを使って新しいエンドポイントを定義
router.put("/:id", async (req, res) => {
  try {
    // 投稿IDを使ってデータベースから該当の投稿を取得
    const post = await Post.findById(req.params.id);
    // ユーザ認証：取得したユーザーIDがリクエストボディのユーザーIDと一致しているか確認
    if (post.userId === req.body.userId) {
      // 投稿の更新：$set演算子を使用して新しいデータで投稿を更新
      await post.updateOne({
        $set: req.body,
      });
      // HTTPステータスコード200と成功メッセージをクライアントに返す
      return res.status(200).json("投稿編集に成功しました！");
    } else {
      // ユーザーが他の人の投稿を編集使用としている場合のエラー処理
      return res.status(200).json("あなたは他の人の投稿を編集できません");
    }
  } catch (err) {
    // エラーが発生した場合、HTTPステータス403とエラーメッセージをクライアントに返す
    return res.status(403).json(err);
  }
});

// 投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("投稿削除に成功しました！");
    } else {
      return res.status(403).json("あなたは他の人の投稿を削除できません");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 特定の投稿を取得する
router.get("/id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // まだ投稿にいいねが押されていなかったら
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿にいいねを押しました！");
      // 投稿にすでにいいねが押されていたら
    } else {
      // いいねしているユーザーIDを取り除く
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(403).json("投稿にいいねを外しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// プロフィール専用のタイムラインの取得
router.get("/profile/:username", async (req, res) => {
  try {
    // paramsは、特定のユーザー情報等を取得したいときに使用する
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//特定のタイムラインの投稿を取得
router.get("/timeline/:userId", async (req, res) => {
  try {
    // paramsは、特定のユーザー情報等を取得したいときに使用する
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    // 自分がフォローしている友達の投稿内容をすべて取得する
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", (req, res) => {
  console.log("post page");
});

module.exports = router;
