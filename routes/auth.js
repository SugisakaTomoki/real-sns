const router = require("express").Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    // reqのbodyからusername,email,passwordを取得して、これらの情報を持つ新しい"User"インスタンスを作成する
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    // 新しく作成されたユーザー情報をデータベースに保存する。"save"メソッドはユーザーオブジェクトをMongoDBに挿入する
    const user = await newUser.save();
    // ユーザーが正常に登録された場合、HTTPステータスコード200(成功)と共に、
    // 登録されたユーザーの情報をjson形式でクライアントに送信する
    return res.status(200).json(user);
    // 何らかの理由でユーザー登録に失敗した場合、エラーオブジェクトが"catch"ブロックで
    // 受け取られ、HTTPステータスコード500(内部サーバーエラー)と共にエラー詳細情報がクライアントに
    // 送信される。
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ログイン
// ハンドラは、/loginエンドポイントに対してPOSTメソッドでリクエストを受け付ける
router.post("/login", async (req, res) => {
  try {
    // リクエストのボディから送信されたメアドを使用して、データベース内で対応するユーザーを検索する
    // もしユーザーが見つからない場合は404 Not foundと共にレスポンスを送信し、関数を終了する
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("ユーザーが見つかりません。");
    // ユーザーが見つかった場合、リクエストのボディから送信されたパスワードを、データベース内のユーザーのパスワードと比較する
    const vailedPassword = req.body.password === user.password;
    // もしパスワードが一致しない場合、パスワードが違いますというメッセージを含むJSOnレスポンスを送信し、関数を終了する
    if (!vailedPassword) return res.status(400).json("パスワードが違います");
    // ユーザーが見つかり、且つパスワードも一致する場合、200 OKステータスコードと共にユーザーオブジェクトをJSONレスポンスとして送信する
    return res.status(200).json(user);
    // 何らかのエラーが発生した場合、500 Internal Server Error ステータスコードと共にエラーメッセージを含むJSONレスポンスを送信します。
  } catch (err) {
    return res.status(500).json(err);
  }
});

// router.get("/", (req, res) => {
//   res.send("auth route");
// });

module.exports = router;
