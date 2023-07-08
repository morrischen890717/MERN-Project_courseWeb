import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth-service";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }
  async function handleLogin(e) {
    try {
      let response = await authService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data)); // 可在瀏覽器 [F12] > [Application] > [Storage] > [Local Storage] 中看到 Local Storage
      setCurrentUser(authService.getCurrentUser());
      window.alert("登入成功，將重新導向您至個人資訊頁面。");
      navigate("/profile");
    } catch (e) {
      setMessage(e.response.data);
    }
  }
  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
          <input
            type="text"
            className="form-control"
            name="email"
            onChange={handleEmail}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={handlePassword}
          />
        </div>
        <br />
        <div className="form-group">
          <button className="btn btn-primary btn-block" onClick={handleLogin}>
            <span>登入系統</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
