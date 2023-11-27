// mongooseライブラリを使用する
const mongoose = require("mongoose");

// 新しいスキーマオブジェクトを作成
const UserSchema = new mongoose.Schema(
  {
    username: {
      // 文字列なのでstring型
      type: String,
      // これが存在しないと、データスキーマとして成立しないという宣言
      required: true,
      min: 5,
      max: 25,
      // 他のユーザーと重複する名前ではいけない
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 50,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      // 配列型
      type: Array,
      // ユーザーの情報を次々に格納する必要があるため、配列
      default: [],
    },
    followings: {
      // 配列型
      type: Array,
      // ユーザーの情報を次々に格納する必要があるため、配列
      default: [],
    },
    //   権限
    isAdmin: {
      // trueかfolseか
      type: Boolean,
      default: false,
    },
    //   description。概要
    desc: {
      type: String,
      max: 70,
    },
    city: {
      type: String,
      max: 50,
    },
  },
  // データを格納した日付を自動的に格納
  { timestamps: true }
);
// UserSchemaをUserという変数で宣言している
module.exports = mongoose.model("User", UserSchema);
