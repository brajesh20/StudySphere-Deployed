import { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Filter,
  FileText,
  School,
  User,
  ChevronDown,
  X,
  Check,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const NotesManagement = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [colleges, setColleges] = useState([]);
  const [viewingNote, setViewingNote] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/notes`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);

      // Extract unique colleges
      const uniqueColleges = [
        ...new Set(data.map((note) => note.collegeName)),
      ].filter(Boolean);
      setColleges(uniqueColleges);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/notes/${noteId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete note");
        }

        setNotes(notes.filter((note) => note._id !== noteId));
        if (viewingNote?._id === noteId) setViewingNote(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleApproveReject = async (noteId, approved) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/notes/${noteId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ approved }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note status");
      }

      const updatedNote = await response.json();
      setNotes(notes.map((note) => (note._id === noteId ? updatedNote : note)));
      if (viewingNote?._id === noteId) setViewingNote(updatedNote);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredNotes = sortedNotes.filter((note) => {
    const matchesSearch =
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.uploader?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCollege = collegeFilter
      ? note.collegeName === collegeFilter
      : true;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "approved"
        ? note.approved
        : !note.approved;

    return matchesSearch && matchesCollege && matchesStatus;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Notes Management
            </h1>
            <p className="text-gray-500">
              Review and manage all submitted notes
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <School className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
            >
              <option value="">All Colleges</option>
              {colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Notes</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {notes.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Approved Notes
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {notes.filter((n) => n.approved).length}
                </p>
                <p className="mt-2 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="ml-1">
                    {notes.length > 0
                      ? `${Math.round(
                          (notes.filter((n) => n.approved).length /
                            notes.length) *
                            100
                        )}% approval rate`
                      : "0% approval rate"}
                  </span>
                </p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Notes
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {notes.filter((n) => !n.approved).length}
                </p>
                <p className="mt-2 flex items-center text-sm text-yellow-600">
                  <Clock className="h-4 w-4" />
                  <span className="ml-1">Needs review</span>
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Note Detail Modal */}
        {viewingNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {viewingNote.title}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {viewingNote.subjectName}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewingNote(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">College</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {viewingNote.collegeName || "Not specified"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Uploaded By</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {viewingNote.uploader?.username || "Unknown"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Download className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Downloads</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {viewingNote.downloadCount || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Uploaded</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {new Date(viewingNote.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Description
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {viewingNote.description || "No description provided"}
                    </p>
                  </div>
                </div>

                {viewingNote.fileUrl && (
                  <div className="mt-6">
                    <a
                      href={viewingNote.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Note
                    </a>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  {!viewingNote.approved ? (
                    <button
                      onClick={() => {
                        handleApproveReject(viewingNote._id, true);
                        setViewingNote({ ...viewingNote, approved: true });
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Approve Note
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleApproveReject(viewingNote._id, false);
                        setViewingNote({ ...viewingNote, approved: false });
                      }}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      Set to Pending
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleDeleteNote(viewingNote._id);
                      setViewingNote(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Title
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          sortConfig.key === "title" &&
                          sortConfig.direction === "desc"
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("subject")}
                  >
                    <div className="flex items-center">
                      Subject
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          sortConfig.key === "subject" &&
                          sortConfig.direction === "desc"
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("collegeName")}
                  >
                    <div className="flex items-center">
                      College
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          sortConfig.key === "collegeName" &&
                          sortConfig.direction === "desc"
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("approved")}
                  >
                    <div className="flex items-center">
                      Status
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          sortConfig.key === "approved" &&
                          sortConfig.direction === "desc"
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("downloadCount")}
                  >
                    <div className="flex items-center">
                      Downloads
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          sortConfig.key === "downloadCount" &&
                          sortConfig.direction === "desc"
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <tr
                      key={note._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {note.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {note.subjectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {note.collegeName || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            note.approved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {note.approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {note.downloadCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setViewingNote(note)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          {!note.approved ? (
                            <button
                              onClick={() =>
                                handleApproveReject(note._id, true)
                              }
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleApproveReject(note._id, false)
                              }
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                              title="Set to Pending"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="text-gray-500 py-8">
                        <Search className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No notes found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm || collegeFilter || statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "No notes available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesManagement;
