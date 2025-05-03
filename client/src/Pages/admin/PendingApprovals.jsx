import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, Trash2, Clock, FileText, School, User, Download, ChevronDown } from "lucide-react";

const PendingApprovals = () => {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");

  useEffect(() => {
    fetchPendingNotes();
  }, []);

  const fetchPendingNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/notes/pending`,
        {
          credentials: "include",
        }
      );  

      if (!response.ok) {
        throw new Error("Failed to fetch pending notes");
      }

      const data = await response.json();
      setPendingNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (noteId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/notes/${noteId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ approved: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve note");
      }

      setPendingNotes(pendingNotes.filter((note) => note._id !== noteId));
      if (viewingNote?._id === noteId) setViewingNote(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (noteId) => {
    if (window.confirm("Are you sure you want to reject this note?")) {
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

        setPendingNotes(pendingNotes.filter((note) => note._id !== noteId));
        if (viewingNote?._id === noteId) setViewingNote(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredNotes = pendingNotes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = collegeFilter ? note.collegeName === collegeFilter : true;
    return matchesSearch && matchesCollege;
  });

  const uniqueColleges = [...new Set(pendingNotes.map(note => note.collegeName).filter(Boolean))];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
            <p className="text-gray-500">Review and approve submitted notes</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {pendingNotes.length} Pending Notes
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="relative w-full md:w-64">
            <select
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
            >
              <option value="">All Colleges</option>
              {uniqueColleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
            <School className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Note Detail Modal */}
        {viewingNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{viewingNote.title}</h3>
                    <p className="text-gray-500 mt-1">{viewingNote.subject}</p>
                  </div>
                  <button
                    onClick={() => setViewingNote(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">College</span>
                    </div>
                    <p className="mt-1 font-medium">{viewingNote.collegeName || "Not specified"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Uploaded By</span>
                    </div>
                    <p className="mt-1 font-medium">{viewingNote.uploader?.username || "Unknown"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Uploaded</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {new Date(viewingNote.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
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
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Note
                    </a>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => handleApprove(viewingNote._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(viewingNote._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <Clock className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No pending notes</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || collegeFilter 
                ? "No notes match your filters" 
                : "All notes have been approved!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg text-gray-900">{note.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {note.subject} • {note.collegeName}
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                    {note.description || "No description provided"}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{note.uploader?.username || "Unknown"}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => setViewingNote(note)}
                      className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleApprove(note._id)}
                      className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                      title="Approve"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReject(note._id)}
                      className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                      title="Reject"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;