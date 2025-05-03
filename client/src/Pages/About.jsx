import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100 py-16 px-4 sm:px-6 lg:px-16 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-6 tracking-tight drop-shadow-lg">
            Welcome to StudySphere
          </h1>
          <p className="max-w-2xl mx-auto text-gray-700 text-xl md:text-2xl font-medium">
            Empowering students to connect, collaborate, and excel with the best
            academic resources-shared by students, for students.
          </p>
        </div>

        {/* What is StudySphere */}
        <section className="mb-16 bg-white/90 rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition duration-300 transform hover:-translate-y-1">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-3/4">
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="inline-block p-2 rounded-full bg-blue-200 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </span>
                What is StudySphere?
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">
                <span className="font-semibold text-blue-700">StudySphere</span>{" "}
                is your go-to academic hub for discovering, sharing, and
                accessing high-quality study notes-completely free. Whether
                you’re preparing for exams, catching up on classes, or seeking
                fresh insights, StudySphere connects you with peer-reviewed
                content tailored to your needs.
              </p>
            </div>
            <div className="md:w-1/4 flex justify-center mt-6 md:mt-0">
              <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16 bg-white/90 rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition duration-300 transform hover:-translate-y-1">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-3/4">
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="inline-block p-2 rounded-full bg-blue-200 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </span>
                Our Mission
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">
                Our mission is to democratize access to quality academic
                resources and foster a collaborative learning culture. We
                believe that learning thrives when knowledge is shared openly,
                helping every student reach their potential.
              </p>
            </div>
            <div className="md:w-1/4 flex justify-center mt-6 md:mt-0">
              <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features and Why Choose Us Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Features */}
          <section className="bg-white/90 rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition duration-300 transform hover:-translate-y-1 h-full">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="inline-block p-2 rounded-full bg-blue-200 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </span>
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Upload and download notes instantly</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Filter by college, course, semester, and subject</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Interact with peers through likes and comments</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Quality control through admin approval</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Distraction-free, clean interface</p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-white/90 rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition duration-300 transform hover:-translate-y-1 h-full">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="inline-block p-2 rounded-full bg-blue-200 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </span>
              Why Choose StudySphere?
            </h2>
            <div className="space-y-4 text-gray-800">
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Lightning-fast, intuitive, and mobile-friendly</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Peer-reviewed and admin-approved for top quality</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Modern, responsive design for every device</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Created by students who understand your academic journey</p>
              </div>
            </div>
          </section>
        </div>

        {/* Who is it for */}
        <section className="mb-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition duration-300">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Who Can Benefit from StudySphere?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 text-center">
              <div className="bg-blue-200 p-4 rounded-full inline-flex mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-blue-800">
                College Students
              </h3>
              <p className="text-gray-700 mt-2">
                Across all years and academic streams
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 text-center">
              <div className="bg-blue-200 p-4 rounded-full inline-flex mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-blue-800">Busy Learners</h3>
              <p className="text-gray-700 mt-2">
                Who missed lectures and need quality material
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 text-center">
              <div className="bg-blue-200 p-4 rounded-full inline-flex mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-blue-800">Contributors</h3>
              <p className="text-gray-700 mt-2">
                Passionate about helping others learn
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 text-center">
              <div className="bg-blue-200 p-4 rounded-full inline-flex mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-blue-800">
                Knowledge Seekers
              </h3>
              <p className="text-gray-700 mt-2">
                Looking for verified, concise study content
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-8">
            StudySphere in Numbers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-xl text-white">
              <h3 className="text-5xl font-extrabold mb-2">300+</h3>
              <p className="text-blue-200">Notes Shared</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-2xl shadow-xl text-white">
              <h3 className="text-5xl font-extrabold mb-2">200+</h3>
              <p className="text-green-200">Students Helped</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-2xl shadow-xl text-white">
              <h3 className="text-5xl font-extrabold mb-2">10+</h3>
              <p className="text-purple-200">Colleges</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl shadow-xl text-white">
              <h3 className="text-5xl font-extrabold mb-2">50+</h3>
              <p className="text-indigo-200">Subjects</p>
            </div>
          </div>
        </section>

        {/* Connect With Us */}
        <section className="bg-white/90 p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Connect With Us
          </h2>
          <p className="text-gray-800 text-lg mb-2">
            Have questions, feedback, or just want to say hi?
          </p>
          <p className="text-lg">
            Email us at:{" "}
            <a
              href="mailto:studysphere@email.com"
              className="text-blue-700 font-semibold underline"
            >
              studysphere@email.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
