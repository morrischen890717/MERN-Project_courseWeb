const Joi = require("joi");

function registerValidation(data) {
  const schema = Joi.object({
    // 自定義錯誤訊息: https://juejin.cn/s/node%20js%20joi%20custom%20error%20message
    username: Joi.string()
      .min(2)
      .max(30)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.min") {
            err.message = "[使用者名稱] 至少需有 2 個字";
          } else if (err.code == "string.max") {
            err.message = "[使用者名稱] 最多只能有 30 個字";
          } else if (err.code == "string.empty") {
            err.message = "[使用者名稱] 為必填欄位";
          } else {
            err.message = "[使用者名稱] 格式錯誤";
          }
        });
        return errors;
      }),
    email: Joi.string()
      .min(6)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.min") {
            err.message = "[電子信箱] 至少需有 6 個英文或數字";
          } else if (err.code == "string.max") {
            err.message = "[電子信箱] 最多只能有 50 個英文或數字";
          } else if (err.code == "string.empty") {
            err.message = "[電子信箱] 為必填欄位";
          } else {
            err.message = "[電子信箱] 格式錯誤";
          }
        });
        return errors;
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.min") {
            err.message = "[密碼] 至少需有 6 個英文或數字";
          } else if (err.code == "string.max") {
            err.message = "[密碼] 最多只能有 100 個英文或數字";
          } else if (err.code == "string.empty") {
            err.message = "[密碼] 為必填欄位";
          } else {
            err.message = "[密碼] 格式錯誤";
          }
        });
        return errors;
      }),
    role: Joi.string()
      .required()
      .valid("student", "instructor")
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.empty") {
            err.message = "[身份] 為必填欄位";
          } else if (err.code == "any.only") {
            err.message = '[身份] 欄位只能為 "student" 或 "instructor" ';
          } else {
            err.message = "[身份] 格式錯誤";
          }
        });
        return errors;
      }),
  });
  return schema.validate(data);
}

function loginValidation(data) {
  const schema = Joi.object({
    // 自定義錯誤訊息: https://juejin.cn/s/node%20js%20joi%20custom%20error%20message
    email: Joi.string()
      .min(6)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.min") {
            err.message = "[電子信箱] 至少需有 6 個英文或數字";
          } else if (err.code == "string.max") {
            err.message = "[電子信箱] 最多只能有 50 個英文或數字";
          } else if (err.code == "string.empty") {
            err.message = "[電子信箱] 為必填欄位";
          } else {
            err.message = "[電子信箱] 格式錯誤";
          }
        });
        return errors;
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.min") {
            err.message = "[密碼] 至少需有 6 個英文或數字";
          } else if (err.code == "string.max") {
            err.message = "[密碼] 最多只能有 100 個英文或數字";
          } else if (err.code == "string.empty") {
            err.message = "[密碼] 為必填欄位";
          } else {
            err.message = "[密碼] 格式錯誤";
          }
        });
        return errors;
      }),
  });
  return schema.validate(data);
}

function courseValidation(data) {
  const schema = Joi.object({
    title: Joi.string()
      .min(2)
      .max(30)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.min") {
            err.message = "課程名稱至少需有 2 個字";
          } else if (err.code == "string.max") {
            err.message = "課程名稱最多只能有 30 個字";
          } else if (err.code == "string.empty") {
            err.message = "課程名稱為必填欄位";
          } else {
            err.message = "課程名稱格式錯誤";
          }
        });
        return errors;
      }),
    description: Joi.string()
      .min(6)
      .max(500)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.min") {
            err.message = "課程說明至少需有 6 個字";
          } else if (err.code == "string.max") {
            err.message = "課程說明最多只能有 500 個字";
          } else if (err.code == "string.empty") {
            err.message = "課程說明為必填欄位";
          } else {
            err.message = "課程說明格式錯誤";
          }
        });
        return errors;
      }),
    price: Joi.number()
      .min(1)
      .max(99999)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "number.min") {
            err.message = "課程費用只能介於 1 ~ 99999 之間";
          } else if (err.code == "number.max") {
            err.message = "課程費用只能介於 1 ~ 99999 之間";
          } else if (err.code == "number.empty") {
            err.message = "課程費用為必填欄位";
          } else if (err.code == "number.base") {
            err.message = "課程費用須設定為一組 1 ~ 99999 之間的數字";
          } else {
            err.message = "課程說明格式錯誤";
          }
        });
        return errors;
      }),
  });
  return schema.validate(data);
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
