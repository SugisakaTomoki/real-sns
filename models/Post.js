// 投稿に関するデータスキーマ
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 200,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// PostSchemaをPostという変数でエクスポートする
module.exports = mongoose.model("Post", PostSchema);
