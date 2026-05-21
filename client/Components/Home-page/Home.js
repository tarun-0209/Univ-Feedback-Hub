import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from "./logo.png";
import Login from "./login";
import "./home.css";

const HomePage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 15000,
  };

  const studentContent = {
    title: "For Students",
    description:
      "Students, your feedback is crucial for improving the quality of our courses. Participate in our anonymous feedback process to share your thoughts and suggestions. Your input helps us enhance the learning experience for everyone. Submit feedback after mid-term and final exams. Answer questions on course content, teaching methods, and overall experience. Your responses are confidential and cannot be edited once submitted.",
  };

  const professorContent = {
    title: "For Professors",
    description:
      "Professors, gain valuable insights into your teaching effectiveness by reviewing student feedback. Use this information to refine your teaching methods and course materials. Request student identities in case of abusive language. Respond to feedback anonymously and engage with students to address concerns. View visual representations of feedback to identify areas for improvement.",
  };

  return (
    <div className="home-screen bg-cyan-50 min-h-screen">
      <header className="header flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-pink-100 shadow-md md:justify-start md:gap-6 md:px-12 border-b-2 border-pink-200">
        <img src={logo} alt="LOGO-IMG" className="logo w-40 sm:w-48 mb-2 sm:mb-0"></img>
        <p className="university-info text-sm sm:text-md text-center sm:text-start font-semibold md:w-64">
          Graphic Era Hill University Dehradun, Uttarakhand
        </p>
      </header>
      <main className="main-content flex flex-col md:flex-row justify-between p-4 md:p-8 md:mt-10 md:items-center lg:mt-14 lg:px-20">
        <div className="login-section w-full md:w-5/12 mb-10 md:mb-0 flex justify-center">
          <div className="w-full max-w-md">
            <Login />
          </div>
        </div>
        <article className="content-text px-6 sm:px-10 text-justify text-md sm:text-lg md:w-6/12">
          <Slider {...sliderSettings}>
            <div className="px-4">
              <h2 className="font-semibold text-2xl sm:text-3xl my-2 text-indigo-400">
                {studentContent.title}
              </h2>
              <p className="leading-relaxed">{studentContent.description}</p>
            </div>
            <div className="px-4">
              <h2 className="font-semibold text-2xl sm:text-3xl my-2 text-indigo-400">
                {professorContent.title}
              </h2>
              <p className="leading-relaxed">{professorContent.description}</p>
            </div>
          </Slider>
        </article>
      </main>
    </div>
  );
};

export default HomePage;
