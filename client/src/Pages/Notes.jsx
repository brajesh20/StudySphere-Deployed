import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoMdDownload, IoMdShare, IoMdArchive, IoMdEye } from "react-icons/io";
import {
  FaEdit,
  FaTrash,
  FaHeart,
  FaComment,
  FaCheckCircle,
  FaCalendarAlt,
  FaBook,
  FaClipboardList,
} from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});

const Notes = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState(false);
  const [notes, setNotes] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [commentsExpanded, setCommentsExpanded] = useState(true);
  const [commentText, setCommentText] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleArchive = async (noteId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/archive/${noteId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Note archived successfully ✅");
      } else {
        showToast(data.message || "Failed to archive the note ❌", "error");
      }
    } catch (error) {
      console.error("Error archiving note:", error);
      showToast("Something went wrong while archiving 🚨", "error");
    }
  };

  // Toast notification helper
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`;
    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.replace("opacity-100", "opacity-0");
      toast.classList.add("translate-y-4");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const startEditComment = (commentId, commentText) => {
    //console.log("Editing comment:", commentId, commentText);
    setEditingCommentId(commentId);
    setEditedCommentText(commentText);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const saveEditedComment = async (commentId) => {
    if (!editedCommentText.trim()) return;
    //console.log("Saving edited comment:", commentId, editedCommentText);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/comments/${notes._id}/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text: editedCommentText }),
        }
      );

      const data = await res.json();
      //console.log("Response data:", data);

      if (res.ok && data.success) {
        setNotes({
          ...notes,
          comments: notes.comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, text: editedCommentText }
              : comment
          ),
        });
        setEditingCommentId(null);
        setEditedCommentText("");
        showToast("Comment updated successfully");
        //fetchNotes(); // Refresh notes to get the latest comments
      } else {
        showToast(data.message || "Failed to update comment ❌", "error");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      showToast("Something went wrong while updating comment 🚨", "error");
    }
  };

  // console.log(currentUser._id, "currentUser.id");

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/comments/${notes._id}/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setNotes({
          ...notes,
          comments: notes.comments.filter(
            (comment) => comment._id !== commentId
          ),
        });
        showToast("Comment deleted successfully");
      } else {
        showToast(data.message || "Failed to delete comment ❌", "error");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Something went wrong while deleting comment 🚨", "error");
    }
  };

  //console.log(currentUser, "currentUser.id");

  const addComment = async () => {
    if (!commentText.trim()) return; // Do nothing if comment is empty
    try {
      const res = await api.post(`/notes/${params.notesId}/comment`, {
        text: commentText,
      });

      // Update notes state with the new comment from response
      if (res.data) {
        // Ensure comments is an array before updating
        const currentComments = Array.isArray(notes.comments)
          ? notes.comments
          : [];

        // If the API returns the updated comments array
        if (Array.isArray(res.data.comments)) {
          setNotes({
            ...notes,
            comments: res.data.comments,
          });
        } else if (res.data.comment) {
          // If the API returns just the new comment
          setNotes({
            ...notes,
            comments: [...currentComments, res.data.comment],
          });
        } else if (typeof res.data === "object") {
          // If the API returns the comment directly
          const newComment = {
            _id: res.data._id || Date.now().toString(),
            text: commentText,
            username: res.data.username || "You",
            commentedAt: res.data.commentedAt || new Date().toISOString(),
          };

          setNotes({
            ...notes,
            comments: [...currentComments, newComment],
          });
        }
        showToast("Comment added successfully ✅");
        fetchNotes(); // Refresh notes to get the latest comments
      }
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      showToast("Failed to add comment ❌", "error");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.put(`/notes/${params.notesId}/download`);
      if (res.data.success) {
        //console.log("Download count incremented successfully ✅");
        setNotes({ ...notes, downloadCount: notes.downloadCount + 1 });
        fetchNotes(); // Refresh notes to get the latest download count
      }
    } catch (error) {
      console.error("Error downloading notes:", error);
      showToast("Something went wrong while downloading 🚨", "error");
    }
  };

  const fetchNotes = async () => {
    try {
      //console.log("Fetching notes for ID:", params.notesId);

      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/uploading/get/${params.notesId}`
      );
      const data = await res.json();

      if (data.success === false) {
        setError(true);
        return;
      }
      setNotes(data.note);
      //console.log(notes);

      setError(false);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    //console.log("Fetching notes on mount:", params.notesId);
  }, [params.notesId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center p-8 rounded-xl bg-white shadow-xl">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1 right-1 bottom-1 left-1 w-18 h-18 border-4 border-purple-500 border-b-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-medium text-indigo-700">
            Loading Your Notes...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we retrieve your content
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 rounded-xl bg-white shadow-xl max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-4xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the notes you requested. The connection may be
            unstable or the resource might not exist anymore.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition duration-300 shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!notes) return null;

  return (
    <main className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 transform transition-all hover:shadow-2xl">
          {/* Top colored banner */}
          <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
            </div>
          </div>

          {/* Title area with overlapping effect */}
          <div className="relative px-6 py-6 sm:px-10 sm:pb-8">
            <div className="absolute -top-12 left-10 bg-white p-4 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <FaBook className="w-6 h-6" />
              </div>
            </div>

            <div className="ml-24">
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                {notes.title}
              </h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
                <span className="flex items-center px-3 py-1 bg-indigo-50 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                  {notes.subjectName}
                </span>
                <span className="px-3 py-1 bg-blue-50 rounded-full">
                  {notes.courseName}
                </span>
                <span className="flex items-center px-3 py-1 bg-purple-50 rounded-full">
                  <FaCalendarAlt className="mr-1 text-purple-500" size={12} />
                  {new Date(notes.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 transition-all hover:shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <FaClipboardList />
                </div>
                Description
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-2xl mb-6 border border-indigo-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {notes.description}
                </p>
              </div>

              {notes.fileUrl && (
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-8">
                  <a
                    href={notes.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    <IoMdEye className="mr-2" /> View Notes
                  </a>
                  <a
                    href={notes.fileUrl}
                    target="_blank"
                    download
                    onClick={handleDownload}
                    className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    <IoMdDownload className="mr-2" /> Download
                  </a>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-5 py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    <IoMdShare className="mr-2" />{" "}
                    {copied ? "Copied!" : "Share"}
                  </button>
                  <button
                    onClick={() => handleArchive(notes._id)}
                    className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-5 py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    <IoMdArchive className="mr-2" /> Save
                  </button>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 transition-all hover:shadow-lg">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setCommentsExpanded(!commentsExpanded)}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mr-3">
                    <FaComment />
                  </div>
                  Comments ({notes.comments.length})
                </h2>
                <button className="text-gray-500">
                  {commentsExpanded ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                  )}
                </button>
              </div>

              {commentsExpanded && (
                <>
                  {notes.comments.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl mt-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaComment className="text-purple-500" size={24} />
                      </div>
                      <p className="text-gray-600">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-5 mt-5">
                      {notes.comments.map((comment) => (
                        <li
                          key={
                            comment._id ||
                            comment.id ||
                            Math.random().toString()
                          }
                          className="bg-gradient-to-r from-gray-50 to-indigo-50 p-5 rounded-2xl border border-indigo-100 transition-all hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium mr-3">
                                {(comment.username || "User")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium text-gray-800">
                                  {`${comment.username
                                    .slice(0, 1)
                                    .toUpperCase()}${comment.username.slice(
                                    1
                                  )}` || "Anonymous User"}
                                </span>
                                <p className="text-xs text-gray-500">
                                  {new Date(comment.commentedAt).toLocaleString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            {comment.user == currentUser._id &&
                              comment.username != "Anonymous" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      startEditComment(
                                        comment._id,
                                        comment.text
                                      )
                                    }
                                    className="text-gray-500 hover:text-indigo-600 transition-colors p-1 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => deleteComment(comment._id)}
                                    className="text-gray-500 hover:text-red-600 transition-colors p-1 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              )}
                          </div>

                          {editingCommentId === comment._id ? (
                            <div className="mt-3">
                              <textarea
                                value={editedCommentText}
                                onChange={(e) =>
                                  setEditedCommentText(e.target.value)
                                }
                                className="w-full p-4 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                rows="3"
                                placeholder="Edit your comment..."
                              />
                              <div className="flex justify-end gap-3 mt-3">
                                <button
                                  onClick={cancelEditComment}
                                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveEditedComment(comment._id)}
                                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-colors shadow-md"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700 mt-2 pl-13">
                              {comment.text}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Add new comment section */}
                  <div className="mt-8 bg-white rounded-xl border border-indigo-100 p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Add your comment
                    </h3>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts about these notes..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={addComment}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-colors shadow-md"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right column - Info cards */}
          <div className="space-y-8">
            {/* Stats card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 transition-all hover:shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl text-center border border-indigo-100 shadow-sm">
                  <div className="flex items-center justify-center text-indigo-600 mb-2">
                    <FaHeart size={24} />
                  </div>
                  <p className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                    {notes.likes?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Likes</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl text-center border border-green-100 shadow-sm">
                  <div className="flex items-center justify-center text-green-600 mb-2">
                    <IoMdDownload size={24} />
                  </div>
                  <p className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                    {notes.downloadCount || 0}
                  </p>
                  <p className="text-sm text-gray-600">Downloads</p>
                </div>
              </div>
              {notes.approved ? (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                  <FaCheckCircle className="text-blue-600 mr-2" />
                  <span className="text-blue-700 font-medium">
                    Approved by Administrator
                  </span>
                </div>
              ) : (
                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-2xl flex items-center justify-center border border-yellow-100 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-500 mr-2"
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
                  <span className="text-amber-700 font-medium">
                    Pending Admin Approval
                  </span>
                </div>
              )}
            </div>

            {/* Details card */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg">
                <span className="text-gray-600 text-sm flex items-center">
                  <svg
                    className="h-3 w-3 mr-1 text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Subject
                </span>
                <span className="font-medium text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm text-sm">
                  {notes.subjectName}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                <span className="text-gray-600 text-sm flex items-center">
                  <svg
                    className="h-3 w-3 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Course
                </span>
                <span className="font-medium text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm text-sm">
                  {notes.courseName}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg">
                <span className="text-gray-600 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Semester
                </span>
                <span className="font-medium text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm text-sm">
                  {notes.semester}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg">
                <span className="text-gray-600 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Batch
                </span>
                <span className="font-medium text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm text-sm">
                  {notes.batch}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-gray-50 to-pink-50 rounded-lg">
                <span className="text-gray-600 text-sm flex items-center">
                  <svg
                    className="h-3 w-3 mr-1 text-pink-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  College
                </span>
                <span className="font-medium text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm text-sm truncate max-w-32">
                  {notes.collegeName}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-gray-50 to-amber-50 rounded-lg">
                <span className="text-gray-600 text-sm flex items-center">
                  <svg
                    className="h-3 w-3 mr-1 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Uploaded
                </span>
                <span className="font-medium text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm text-sm">
                  {new Date(notes.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </main>
  );
};

export default Notes;
