import React, { useState, useEffect } from "react";
import courseService from "../services/course-service";
import { useNavigate } from "react-router-dom";

const EnrollComponent = ({ currentUser }) => {
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [message, setMessage] = useState("");
  function handleChangeInput(e) {
    setSearchInput(e.target.value);
  }

  function handleSearch() {
    courseService
      .getCourseByName(searchInput)
      .then((foundCourses) => {
        setSearchResult(foundCourses.data);
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  }

  function handleEnroll(e) {
    courseService
      .enroll(e.target.id)
      .then(() => {
        window.alert("註冊課程成功，將重新導向至課程頁面。");
        navigate("/course");
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  }

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>
            您必須先 <a href="/login">登入</a> 才能註冊課程。
          </p>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <p>只有學生才能註冊課程。</p>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            onChange={handleChangeInput}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            搜尋課程
          </button>
        </div>
      )}
      {currentUser && message && (
        <div className="alert alert-danger">{message}</div>
      )}
      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          {searchResult.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱：{course.title}</h5>
                  <p className="card-text" style={{ margin: "0.5rem 0rem" }}>
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師：{course.instructor.username}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師電子信箱：{course.instructor.email}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數：{course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程費用：{course.price}
                  </p>
                  <a
                    href="#"
                    id={course._id}
                    className="card-text btn btn-primary"
                    onClick={handleEnroll}
                  >
                    註冊課程
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
