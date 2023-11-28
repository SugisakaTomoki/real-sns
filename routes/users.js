// Router():取得したexpressモジュールからRouterオブジェクトを取得している。
const router = require("express").Router();

const User = require("../models/User");
// CRUD操作
// ユーザー情報更新
router.put("/:id", async (req, res) => {
  // リクエストのボディから送信されたuserIdとリクエストパラメーターのidを比較
  // または、isAdminがtrueの場合、またはisAdin(管理者である場合)が存在する場合
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // MongoDBのUserモデルを使用して、指定されたidのユーザー情報を更新
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body, //リクエストのボディで受け取った情報で更新
      });
      //   更新が成功した場合、ステータスコード200とともにメッセージを返す
      res.status(200).json("ユーザー情報が更新されました");
      //   更新中にエラーが発生した場合、ステータスコード500とエラーメッセージを返す
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    // ユーザーが自分のアカウント以外を更新使用とした場合、ステータスコード403とメッセージを返す
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます");
  }
});

// ユーザー情報削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      res.status(200).json("ユーザー情報が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を削除できます");
  }
});
// ユーザー情報取得
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // 取得したユーザー情報から、特定のプロパティ(password,update)を取り除く
    const { password, updatedAt, ...other } = user._doc;
    // passwordやupdateAtを含まない形でユーザー情報をクライアントに返す
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  // 自分自身をフォローしようとしている場合はエラーを返す
  if (req.body.userId !== req.params.id) {
    try {
      // フォローされるユーザーとフォローするユーザーを取得
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // フォローされるユーザーのフォロワーリストに、フォローするユーザーが含まれていない場合
      if (!user.followers.includes(req.body.userId)) {
        // フォローするユーザーのfollowersリストに、フォローされるユーザーを追加
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        // フォローされるユーザーのfollowingsリストに、フォローするユーザーを追加
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローに成功しました！");
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーをフォローしています。");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません。");
  }
});

// ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  // 自分自身をフォロー解除しようとしている場合はエラーを返す
  if (req.body.userId !== req.params.id) {
    try {
      // フォロー解除対象のユーザーとフォロー解除するユーザーを取得
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // フォロワーリストにフォロー解除するユーザーが存在する場合
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
        return res.status(200).json("フォロー解除しました！");
      } else {
        return res.status(403).json("このユーザーはフォロー解除できません。");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォロー解除できません。");
  }
});

// ユーザー登録
// HTTPのPOSTメソッドで、"/register"パスにアクセスされた時に実行する。
// "async(req,res)=>{....}"ルートハンドラ関数を非同期関数として宣言する。

// router.get("/", (req, res) => {
//   res.send("user route");
// });

module.exports = router;
