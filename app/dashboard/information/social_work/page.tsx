"use client";

import { useState, ChangeEvent, useEffect } from "react";

// Types
interface SocialWork {
  id: number;
  image: string;
  description: string;
  date: string; // YYYY-MM-DD
  active: boolean;
}

// Dummy Data
const dummyData: SocialWork[] = [
  {
    id: 1,
    image: "https://via.placeholder.com/300x200.png?text=Social+Work+1",
    description: "Cleaning the beach initiative",
    date: "2025-10-01",
    active: true,
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300x200.png?text=Social+Work+2",
    description: "Tree plantation drive",
    date: "2025-09-15",
    active: true,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300x200.png?text=Social+Work+3",
    description: "Helping elderly people",
    date: "2025-08-20",
    active: false,
  },
];

export default function SocialWorkDashboard() {
  const [entries, setEntries] = useState<SocialWork[]>([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    id: 0,
    image: "",
    description: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState<{
    image?: string;
    description?: string;
    date?: string;
  }>({});
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [viewEntry, setViewEntry] = useState<SocialWork | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSocialWork, setSelectedSocialWork] = useState<SocialWork | null>(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setEntries(dummyData);
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: url }));
    e.target.value = "";
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSave = () => {
    if (!formData.image || !formData.description || !formData.date) {
      setFormErrors({
        image: formData.image ? undefined : "Image is required",
        description: formData.description ? undefined : "Description is required",
        date: formData.date ? undefined : "Date is required",
      });
      return;
    }

    if (formData.id) {
      setEntries(prev =>
        prev.map(e =>
          e.id === formData.id
            ? { ...e, image: formData.image, description: formData.description, date: formData.date }
            : e
        )
      );
      showToast("Social Work entry updated successfully!");
    } else {
      const newEntry: SocialWork = {
        id: Date.now(),
        image: formData.image,
        description: formData.description,
        date: formData.date,
        active: true,
      };
      setEntries(prev => [...prev, newEntry]);
      showToast("Social Work entry added successfully!");
    }

    setFormData({ id: 0, image: "", description: "", date: "" });
    setShowForm(false);
    setMenuOpenId(null);
  };

  const openDeleteDialog = (entry: SocialWork) => {
    setSelectedSocialWork(entry);
    setIsDeleteDialogOpen(true);
    setMenuOpenId(null);
  };

  const handleDeleteSocialWork = () => {
    if (selectedSocialWork) {
      setEntries(prev => prev.filter(e => e.id !== selectedSocialWork.id));
      setSelectedIds(prev => prev.filter(sid => sid !== selectedSocialWork.id));
      showToast("Social Work entry deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedSocialWork(null);
    }
  };

  const openBulkDeleteDialog = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    setEntries(prev => prev.filter(e => !selectedIds.includes(e.id)));
    setSelectedIds([]);
    showToast("Selected entries deleted successfully!");
    setIsBulkDeleteDialogOpen(false);
  };

  const handleBulkToggle = () => {
    if (selectedIds.length === 0) return;
    setEntries(prev =>
      prev.map(e =>
        selectedIds.includes(e.id) ? { ...e, active: !e.active } : e
      )
    );
    setSelectedIds([]);
    showToast("Selected entries status updated!");
  };

  const handleEdit = (entry: SocialWork) => {
    setFormData({ id: entry.id, image: entry.image, description: entry.description, date: entry.date });
    setShowForm(true);
    setMenuOpenId(null);
  };

  const handleView = (entry: SocialWork) => {
    setViewEntry(entry);
    setMenuOpenId(null);
  };

  const toggleActive = (id: number) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, active: !e.active } : e))
    );
    setMenuOpenId(null);
    showToast("Entry status updated!");
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filtered = entries.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Social Work Dashboard</h1>

      {/* Search + Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded shadow-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={openBulkDeleteDialog}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded shadow-sm transition ${
              selectedIds.length === 0 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Delete Selected ({selectedIds.length})
          </button>
          <button
            onClick={handleBulkToggle}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded shadow-sm transition ${
              selectedIds.length === 0 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            Enable/Disable Selected ({selectedIds.length})
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition"
          >
            + Social Work
          </button>
        </div>
      </div>

      {/* Toast success message */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-100 text-green-800 p-3 rounded shadow-lg z-50 transition-all">
          {successMessage}
        </div>
      )}

      <div className="mb-3 text-gray-600 font-medium">Total: {entries.length} entries</div>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(entry => (
          <div
            key={entry.id}
            className={`relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${!entry.active ? "opacity-50" : ""}`}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(entry.id)}
              onChange={() => handleSelect(entry.id)}
              className="absolute top-3 left-3 w-5 h-5"
            />

            <img src={entry.image} alt="social work" className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-gray-800 font-medium">{entry.description}</p>
              <p className="text-gray-500 text-sm mt-1">Date: {entry.date}</p>
            </div>

            <div className="absolute top-3 right-3">
              <button
                onClick={() =>
                  setMenuOpenId(menuOpenId === entry.id ? null : entry.id)
                }
                className="text-xl font-bold text-gray-600 hover:text-gray-800"
              >
                ⋮
              </button>
              {menuOpenId === entry.id && (
                <div className="bg-white border rounded shadow-md absolute right-0 mt-2 w-40 z-10">
                  <button onClick={() => handleView(entry)} className="block w-full text-left px-3 py-2 hover:bg-gray-100">View</button>
                  <button onClick={() => handleEdit(entry)} className="block w-full text-left px-3 py-2 hover:bg-gray-100">Edit</button>
                  <button onClick={() => openDeleteDialog(entry)} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600">Delete</button>
                  <button onClick={() => toggleActive(entry.id)} className="block w-full text-left px-3 py-2 hover:bg-gray-100">{entry.active ? "Disable" : "Enable"}</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Single Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedSocialWork && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete "{selectedSocialWork.description}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsDeleteDialogOpen(false)} 
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSocialWork} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow-sm transition"
              >
                Delete Social Work
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {isBulkDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Bulk Deletion</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete {selectedIds.length} selected {selectedIds.length === 1 ? 'entry' : 'entries'}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsBulkDeleteDialogOpen(false)} 
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkDelete} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow-sm transition"
              >
                Delete {selectedIds.length} {selectedIds.length === 1 ? 'Entry' : 'Entries'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">View Social Work</h2>
            <img src={viewEntry.image} alt="view" className="w-full h-48 object-cover rounded mb-4" />
            <p className="text-gray-700 mb-2">{viewEntry.description}</p>
            <p className="text-gray-500 text-sm mb-4">Date: {viewEntry.date}</p>
            <div className="flex justify-end">
              <button onClick={() => setViewEntry(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add / Edit Social Work</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-3" />
            {formErrors.image && <p className="text-red-500 mb-2">{formErrors.image}</p>}

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border border-gray-300 p-3 w-full rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formErrors.description && <p className="text-red-500 mb-2">{formErrors.description}</p>}

            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="border border-gray-300 p-3 w-full rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formErrors.date && <p className="text-red-500 mb-2">{formErrors.date}</p>}

            {formData.image && <img src={formData.image} alt="preview" className="w-full h-48 object-cover rounded mb-3" />}

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}