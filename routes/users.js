// Router():取得したexpressモジュールからRouterオブジェクトを取得している。
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("user route");
});

module.exports = router;
