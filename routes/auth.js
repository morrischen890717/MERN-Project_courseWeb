const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const courseValidation = require("../validation").courseValidation;
const user = require("../models").user;
const jwt = require("jsonwebtoken");

// middleware
router.use((req, res, next) => {
  console.log("正在接收一個與 auth 有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結至 testAPI");
});

router.post("/register", async (req, res) => {
  console.log("register...");
  // 確認註冊資料是否符合規範
  let { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // 用信箱確認是否已註冊過
  const foundUser = await user.findOne({ email: req.body.email });
  if (foundUser) {
    return res.status(400).send("此信箱已被註冊過，請使用其他信箱或嘗試登入。");
  }
  let { username, email, password, role } = req.body;
  let newUser = new user({ username, email, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "註冊成功",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("儲存使用者時發生錯誤。");
  }
});

router.post("/login", async (req, res) => {
  console.log("login");
  // 確認登入資料是否符合規範
  let { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // 該使用者是否存在
  const foundUser = await user.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("查無使用者，請確認信箱是否輸入正確。");
  }
  foundUser.comparePassword(req.body.password, (e, isMatch) => {
    if (e) {
      return res.status(500).send(e);
    }
    if (isMatch) {
      // 製作 json web token (jwt)
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
