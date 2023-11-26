// require関数を使用して、expressを呼ぶ
const express = require("express");
// app変数にexpress関数を格納する
const app = express();

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
// ポート番号を指定する。何番でもいい
const PORT = 3000;

// ミドルウェアの設定
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// アプリケーション(app)が"/"へのGETリクエストを受け取った時に、クライアントに対して文字列を返すというエンドポイントの設定
// app.get("/", (req, res) => {
//   res.send("hello express");
// });
// app.get("/users", (req, res) => {
//   res.send("users express");
// });

// app.listenでサーバーを立ち上げる
app.listen(PORT, () => console.log("サーバーが起動しました。"));
