// Router():取得したexpressモジュールからRouterオブジェクトを取得している。
const router = require("express").Router();

const User = require("../models/User");
// CRUD操作
// ユーザー情報更新
router.put("/:id", async (req, res) => {
  // リクエストのボディから送信されたuserIdとリクエストパラメーターのidを比較
  // または、isAdminがtrueの場合、またはisAdinが存在する場合
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // MongoDBのUserモデルを使用して、指定されたidのユーザー情報を更新
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザー情報が更新されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます");
  }
});

// ユーザー情報削除
// ユーザー情報取得

// ユーザー登録
// HTTPのPOSTメソッドで、"/register"パスにアクセスされた時に実行する。
// "async(req,res)=>{....}"ルートハンドラ関数を非同期関数として宣言する。

// router.get("/", (req, res) => {
//   res.send("user route");
// });

module.exports = router;
