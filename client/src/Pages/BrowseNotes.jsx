/* Enhanced BrowseNotes.jsx */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import { FiEye } from "react-icons/fi";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});

// Custom Autocomplete Dropdown Component
const AutocompleteDropdown = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update filtered options when input changes
  useEffect(() => {
    if (inputValue === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [inputValue, options]);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelectOption = (option) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          className="border w-full p-2 pr-10 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        {inputValue && ( // x-button to clear input
          <button
            className="absolute right-8 top-2 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <button // ^ symbol
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className="p-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No matches found</div>
          )}
        </div>
      )}
    </div>
  );
};

const BrowseNotes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const suggestionRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  // Added filter states
  const [filters, setFilters] = useState({
    subject: "",
    course: "",
    semester: "",
    college: "",
  });

  // Fetch unique filter options
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    courses: [],
    semesters: [],
    colleges: [],
  });

  // Handle clicks outside of suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch Notes from the backend with filters
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, {
        params: {
          search: search || "",
          subject: filters.subject,
          course: filters.course,
          semester: filters.semester,
          college: filters.college,
        },
      });

      // console.log(response);

      setNotes(response.data.notes); // Update state with fetched notes

      // Extract unique filter options from data if not already populated
      if (filterOptions.subjects.length === 0) {
        extractFilterOptions(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
  };

  // Extract unique filter options from notes
  const extractFilterOptions = (notesData) => {
    const subjects = [
      ...new Set(notesData.map((note) => note.subjectName).filter(Boolean)),
    ];
    const courses = [
      ...new Set(notesData.map((note) => note.courseName).filter(Boolean)),
    ];
    const semesters = [
      ...new Set(notesData.map((note) => note.semester).filter(Boolean)),
    ];
    const colleges = [
      ...new Set(notesData.map((note) => note.collegeName).filter(Boolean)),
    ];

    setFilterOptions({
      subjects,
      courses,
      semesters,
      colleges,
    });
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      subject: "",
      course: "",
      semester: "",
      college: "",
    });
    setSearch("");
  };

  // Like Note
  const likeNote = async (id) => {
    try {
      await api.put(`/notes/${id}/like`);
      fetchNotes(); // Refresh the notes list after like/unlike action
    } catch (err) {
      console.error("Error liking note:", err);
    }
  };

  const downloadFile = async (url, filename) => {
    if (!url) {
      console.error("File URL is invalid");
      return;
    }

    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || "download.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  // Open Comments Section for a Note
  const openComments = (note) => {
    setSelectedNote(note);
    setCommentText(""); // Clear the previous comment
  };

  const commentsRef = useRef(null);

  // Add Comment
  const addComment = async () => {
    if (!commentText.trim()) return; // Do nothing if comment is empty
    try {
      const res = await api.post(`/notes/${selectedNote._id}/comment`, {
        text: commentText,
      });
      //const updated = await api.get(`/notes?search=${selectedNote._id}`);
      //console.log(updated.data);
      //console.log(res.data.comments);

      setSelectedNote(res.data.comments);
      setCommentText("");
      //fetchNotes(); // Refresh the list to sync comments count
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [
    search,
    filters.subject,
    filters.course,
    filters.semester,
    filters.college,
  ]);

  const handleDownload = async (note) => {
    currentUser ? downloadFile(note.fileUrl, note.title) : navigate("/sign-in");
    try {
      const res = await api.put(`/notes/${note._id}/download`);
      if (res.data.success) {
        showToast("Download count incremented successfully ✅");
        setNotes({ ...notes, downloadCount: notes.downloadCount + 1 });
      }
    } catch (error) {
      console.error("Error downloading notes:", error);
      showToast("Something went wrong while downloading 🚨", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
          <h1 className="text-4xl font-bold text-center tracking-wide">
            Discover and Access Shared Academic Notes
          </h1>
        </div>

        <div className="p-8">
          <div className="relative mb-8" ref={suggestionRef}>
            <div className="flex items-center border rounded-full overflow-hidden shadow-md bg-white">
              <div className="p-3 text-indigo-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-transparent"
                placeholder="Search for subjects, courses, or specific notes..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <AutocompleteDropdown
              label="Filter by Subject"
              value={filters.subject}
              onChange={(value) => handleFilterChange("subject", value)}
              options={filterOptions.subjects}
              placeholder="e.g.,  OOPS"
            />
            <AutocompleteDropdown
              label="Filter by Course"
              value={filters.course}
              onChange={(value) => handleFilterChange("course", value)}
              options={filterOptions.courses}
              placeholder="e.g.,  MCA"
            />
            <AutocompleteDropdown
              label="Filter by Semester"
              value={filters.semester}
              onChange={(value) => handleFilterChange("semester", value)}
              options={filterOptions.semesters}
              placeholder="e.g.,  4th Semester"
            />
            <AutocompleteDropdown
              label="Filter by College"
              value={filters.college}
              onChange={(value) => handleFilterChange("college", value)}
              options={filterOptions.colleges}
              placeholder="e.g.,  NIT Warangal"
            />
          </div>
          <div className="flex justify-end mb-8">
            <button
              onClick={resetFilters}
              className="cursor-pointer bg-gradient-to-r from-pink-400 to-red-400 text-white py-2 px-6 rounded-full shadow hover:from-pink-500 hover:to-red-500 transition-all"
            >
              Clear All Filters
            </button>
          </div>

          {!selectedNote && !isLoading ? (
            notes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl p-6 cursor-pointer transition-all"
                  >
                    <h2 className="font-bold text-xl text-indigo-700 mb-2">
                      {note.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {note.description}
                    </p>
                    <div className="text-gray-500 text-xs space-y-1 mb-4">
                      <p>
                        <strong>Subject Area:</strong>{" "}
                        {note.subjectName || "N/A"}
                      </p>
                      <p>
                        <strong>Academic Course:</strong>{" "}
                        {note.courseName || "N/A"}
                      </p>
                      <p>
                        <strong>Institution:</strong>{" "}
                        {note.collegeName || "N/A"}
                      </p>
                      <p>
                        <strong>Semester:</strong> {note.semester || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t">
                      <button
                        onClick={() => likeNote(note._id)}
                        className="flex ml-3 cursor-pointer items-center gap-1 text-red-500 hover:text-red-600"
                      >
                        <span>❤</span>
                        <span>{note?.likes?.length || 0}</span>
                        <span className="sr-only">Likes</span>
                      </button>

                      <button
                        onClick={() => openComments(note)}
                        className="flex cursor-pointer items-center gap-1 text-indigo-500 hover:text-indigo-600"
                      >
                        <FaRegCommentDots className="w-4 h-4" />
                        <span>{note.comments?.length || 0}</span>
                        <span className="sr-only">Comments</span>
                      </button>

                      <button
                        onClick={() => handleDownload(note)}
                        className="flex cursor-pointer items-center gap-1 text-green-500 hover:text-green-600"
                      >
                        <IoMdDownload className="w-4 h-4" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={() => navigate(`/notes/${note._id}`)}
                        className="flex cursor-pointer items-center gap-1 text-blue-500 hover:text-blue-600"
                      >
                        <FiEye className="w-4 h-4" />
                        <span className="sr-only">View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl font-semibold text-gray-500">
                  No matching notes found. Try different filters or search
                  terms.
                </p>
              </div>
            )
          ) : null}

          {isLoading && (
            <div className="flex justify-center my-16">
              <div className="w-12 h-12 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {selectedNote && (
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
              <button
                onClick={() => setSelectedNote(null)}
                className="mb-4 text-indigo-500 hover:underline flex items-center"
              >
                ← Back to Notes Overview
              </button>
              <h2 className="text-3xl font-bold text-indigo-700 mb-4">
                {selectedNote.title}
              </h2>
              <p className="text-gray-700 mb-6">{selectedNote.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                <p>
                  <strong>Subject Area:</strong>{" "}
                  {selectedNote.subjectName || "N/A"}
                </p>
                <p>
                  <strong>Course Enrolled:</strong>{" "}
                  {selectedNote.courseName || "N/A"}
                </p>
                <p>
                  <strong>Institution Name:</strong>{" "}
                  {selectedNote.collegeName || "N/A"}
                </p>
                <p>
                  <strong>Semester:</strong> {selectedNote.semester || "N/A"}
                </p>
              </div>

              <textarea
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 mb-4"
                placeholder="Share your feedback or thoughts about these notes..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="4"
              />
              <button
                onClick={addComment}
                className="bg-gradient-to-r from-indigo-400 to-blue-400 text-white px-6 py-2 rounded-full shadow hover:from-indigo-500 hover:to-blue-500"
              >
                Post Your Comment
              </button>

              <div ref={commentsRef} className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Community Feedback ({selectedNote.comments.length} comments)
                </h3>
                {selectedNote.comments.length === 0 && (
                  <p className="text-center text-gray-500">
                    There are no comments yet. Be the first to contribute!
                  </p>
                )}
                {selectedNote.comments.map((comment, idx) => (
                  <div key={idx} className="border-b py-4">
                    <h4 className="text-indigo-600 flex items-center">
                      <CgProfile className="mr-1" />
                      {comment.username}
                    </h4>
                    <p className="text-gray-700 mt-2">{comment.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(comment.commentedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseNotes;
