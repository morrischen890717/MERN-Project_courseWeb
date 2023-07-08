import React, { useState } from "react";
import authService from "../services/auth-service";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");
  let [message, setMessage] = useState("");
  function handleUsername(e) {
    setUsername(e.target.value);
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }
  function handleRole(e) {
    setRole(e.target.value);
  }
  async function handleRegister() {
    try {
      await authService.register(username, email, password, role);
      window.alert("註冊成功，將重新導向您至登入頁面。");
      navigate("/login");
    } catch (e) {
      setMessage(e.response.data);
    }
  }
  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div>
          <label htmlFor="username">用戶名稱:</label>
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={handleUsername}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">電子信箱：</label>
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
            placeholder="長度至少超過6個英文或數字"
            onChange={handlePassword}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">身份：</label>
          <input
            type="text"
            className="form-control"
            name="role"
            placeholder="只能填入student或是instructor這兩個選項其一"
            onChange={handleRole}
          />
        </div>
        <br />
        <button className="btn btn-primary" onClick={handleRegister}>
          <span>註冊會員</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
