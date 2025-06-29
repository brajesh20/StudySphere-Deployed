import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    // const isLoggedIn = !!localStorage.getItem("token");
    // console.log(currentUser);
    if (currentUser) {
      navigate("/uploading-notes");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-500 to-cyan-700 text-white py-24 sm:py-36 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-emerald-400"></div>
          <div className="absolute top-24 right-12 w-72 h-72 rounded-full bg-sky-400"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 rounded-full bg-violet-500"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Unlock Knowledge with{" "}
              <span className="text-yellow-300">StudySphere</span>
            </h1>
            <p className="text-lg sm:text-xl mb-10 font-light leading-relaxed">
              Upload, explore, and download premium academic notes from top
              students across India.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <button
                onClick={handleUploadClick}
                className="w-full sm:w-auto bg-yellow-400 text-gray-900 py-4 px-8 rounded-xl hover:bg-yellow-300 transition transform hover:-translate-y-1 shadow-md font-semibold text-lg"
              >
                Upload Your Notes
              </button>
              <Link to="/browse">
                <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white py-4 px-8 rounded-xl hover:bg-white hover:text-cyan-700 transition transform hover:-translate-y-1 shadow-md font-semibold text-lg">
                  Browse Notes
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 sm:h-16 text-white fill-current"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,150.5,82.93,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-cyan-700">
              How It Works
            </h2>
            <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Upload Your Notes",
                desc: "Share your study material easily with thousands of learners.",
              },
              {
                step: 2,
                title: "Quality Review",
                desc: "Every upload is checked for quality and relevance.",
              },
              {
                step: 3,
                title: "Gain Reach",
                desc: "Make your notes visible to a national community.",
              },
              {
                step: 4,
                title: "Download & Learn",
                desc: "Access the best notes from top students for free.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition"
              >
                <div className="w-12 h-12 mx-auto flex items-center justify-center bg-cyan-500 text-white text-xl rounded-full mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-teal-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why StudySphere?</h2>
            <div className="h-1 w-20 bg-yellow-300 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✓",
                title: "Verified Content",
                desc: "Every note goes through quality screening.",
              },
              {
                icon: "💬",
                title: "Community Feedback",
                desc: "Users can review, rate, and recommend notes.",
              },
              {
                icon: "🚀",
                title: "Completely Free",
                desc: "No charges, no hidden fees — ever.",
              },
              {
                icon: "👨‍🎓",
                title: "By Students, For Students",
                desc: "Real resources created by real learners.",
              },
              {
                icon: "🔒",
                title: "Data Security",
                desc: "Your uploads and downloads stay safe and protected.",
              },
              {
                icon: "🌍",
                title: "Widespread Network",
                desc: "Students from over 20+ colleges sharing notes together.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center"
              >
                <div className="w-12 h-12 mx-auto flex items-center justify-center bg-cyan-100 text-cyan-600 text-2xl rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Community at a Glance */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-cyan-700">
              Our Community at a Glance
            </h2>
            <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Notes Uploaded" },
              { number: "350+", label: "Students Helped" },
              { number: "20+", label: "Colleges Connected" },
              { number: "1200+", label: "Notes Downloaded" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-4xl font-bold text-teal-600 mb-2">
                  {item.number}
                </h3>
                <p className="text-gray-600 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-cyan-700">
              Student Experiences
            </h2>
            <div className="h-1 w-24 bg-emerald-400 mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                name: "Ishita Sharma",
                course: "MCA, NIT Warangal",
                feedback:
                  "StudySphere is my go-to resource! Amazing quality and easy to find notes.",
              },
              {
                name: "Aditya Verma",
                course: "B.Tech, IIT Delhi",
                feedback:
                  "Uploading my notes here gave me a chance to help hundreds of students.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-lg max-w-sm"
              >
                <p className="text-gray-700 italic mb-6">"{item.feedback}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500 text-white flex items-center justify-center rounded-full font-bold">
                    {item.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.course}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Bold and attractive */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Join the Movement!
          </h2>
          <p className="text-xl mb-10 max-w-xl mx-auto">
            Help 10,000+ students across India by sharing your notes today!
          </p>
          <Link to="/uploading-notes">
            <button
              onClick={handleUploadClick}
              className="cursor-pointer bg-yellow-400 text-gray-900 py-4 px-10 rounded-lg hover:bg-yellow-300 transition duration-300 font-bold text-lg shadow-xl transform hover:-translate-y-1"
            >
              Start Sharing
            </button>
          </Link>
        </div>
      </section>

      {/* Stay Connected - Modern social links */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Stay Connected With Us</h2>

          <div className="flex flex-wrap justify-center items-center gap-8">
            <a
              href="#"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition duration-300"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </div>
              <span className="font-medium">Facebook</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition duration-300"
            >
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM12 7.5c1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7zM12 14c2.34 0 4.34 1.66 5.12 3.96-1.47 1.25-3.38 2.04-5.12 2.04s-3.65-.79-5.12-2.04C7.66 15.66 9.66 14 12 14z" />
                </svg>
              </div>
              <span className="font-medium">Instagram</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition duration-300"
            >
              <div className="bg-blue-50 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </div>
              <span className="font-medium">Twitter</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-red-600 hover:text-red-800 transition duration-300"
            >
              <div className="bg-red-50 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <span className="font-medium">Email Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
