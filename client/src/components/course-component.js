import React, { useState, useEffect } from "react";
import courseService from "../services/course-service";

const CourseComponent = ({ currentUser }) => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    let foundCourses;
    if (currentUser) {
      if (currentUser.user.role == "instructor") {
        courseService
          .getInstructorCourses(currentUser.user._id)
          .then((foundCourses) => {
            setCourseData(foundCourses.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role == "student") {
        courseService
          .getStudentCourses(currentUser.user._id)
          .then((foundCourses) => {
            setCourseData(foundCourses.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>
            您必須先 <a href="/login">登入</a> 才能看到課程。
          </p>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面。</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面。</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱：{course.title}</h5>
                  <p className="card-text" style={{ margin: "0.5rem 0rem" }}>
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數：{course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程費用：{course.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
