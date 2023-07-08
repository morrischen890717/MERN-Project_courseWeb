const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route 正在接收 request");
  next();
});

// 獲得所有課程
router.get("/", async (req, res) => {
  try {
    let foundCourses = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(foundCourses);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用講師 id 尋找其所開設的課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let foundCourses = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(foundCourses);
});

// 用學生 id 尋找其所註冊的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let foundCourses = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(foundCourses);
});

// 用課程 id 尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    if (foundCourse) {
      return res.send(foundCourse);
    } else {
      return res.status(400).send("您所找的課程不存在。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程名稱尋找課程
router.get("/searchByName/:name", async (req, res) => {
  let { name } = req.params;
  console.log(name);
  try {
    let foundCourse = await Course.find({ title: name })
      .populate("instructor", ["username", "email"])
      .exec();
    if (foundCourse) {
      return res.send(foundCourse);
    } else {
      return res.status(400).send("您所找的課程不存在。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 新增課程
router.post("/", async (req, res) => {
  // 驗證課程符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send(
        "只有講師才能設定新課程，如果您為講師，請使用講師帳號登入再進行操作。"
      );
  }
  let { title, description, price } = req.body;
  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });
  await newCourse.save();
  return res.send("成功設定新課程。");
});

// 學生註冊課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  course.students.push(req.user._id);
  await course.save();
  return res.send("註冊課程成功");
});

// 更新課程
router.patch("/:_id", async (req, res) => {
  // 驗證課程符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let { _id } = req.params;
  // 確認課程存在
  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("此課程不存在。");
    }

    // 使用者必須為此課程的講師才能更新課程
    if (foundCourse.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      }).exec();
      return res.send({
        msg: "更新課程成功。",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程的講師才能更新此課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除課程
router.delete("/:_id", async (req, res) => {
  // 驗證課程符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let { _id } = req.params;
  // 確認課程存在
  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("此課程不存在。");
    }

    // 使用者必須為此課程的講師才能更新課程
    if (foundCourse.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("刪除課程成功。");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除此課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
