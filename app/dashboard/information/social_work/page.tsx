"use client";

import { useState, ChangeEvent, useEffect } from "react";

// Types
interface SocialWork {
  id: number;
  image: string;
  description: {
    en: string;
    ta: string;
    si: string;
  };
  date: string; // YYYY-MM-DD
  active: boolean;
}

type Language = "en" | "ta" | "si";

// Dummy Data
const dummyData: SocialWork[] = [
  {
    id: 1,
    image: "https://via.placeholder.com/300x200.png?text=Social+Work+1",
    description: {
      en: "Cleaning the beach initiative",
      ta: "கடற்கரை சுத்தம் செய்தல் முயற்சி",
      si: "වෙරළ පිරිසිදු කිරීමේ මුලපිරීම"
    },
    date: "2025-10-01",
    active: true,
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300x200.png?text=Social+Work+2",
    description: {
      en: "Tree plantation drive",
      ta: "மரம் நடும் பயணம்",
      si: "ගස් වැවීමේ ව්‍යාපාරය"
    },
    date: "2025-09-15",
    active: true,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300x200.png?text=Social+Work+3",
    description: {
      en: "Helping elderly people",
      ta: "முதியவர்களுக்கு உதவுதல்",
      si: "වයස්ගත පුද්ගලයන්ට උදව් කිරීම"
    },
    date: "2025-08-20",
    active: false,
  },
];

const LANGUAGE_NAMES = {
  en: "English",
  ta: "Tamil", 
  si: "Sinhala"
};

export default function SocialWorkDashboard() {
  const [entries, setEntries] = useState<SocialWork[]>([]);
  const [search, setSearch] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [formData, setFormData] = useState({
    id: 0,
    image: "",
    description: {
      en: "",
      ta: "",
      si: ""
    },
    date: "",
  });
  const [formErrors, setFormErrors] = useState<{
    image?: string;
    description?: {
      en?: string;
      ta?: string;
      si?: string;
    };
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
      setFormErrors(prev => ({ ...prev, image: "Please upload an image file" }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, image: "Image size should be less than 10MB" }));
      return;
    }
    const url = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: url }));
    setFormErrors(prev => ({ ...prev, image: undefined }));
    e.target.value = "";
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const validateForm = () => {
    const errors: {
      image?: string;
      description?: {
        en?: string;
        ta?: string;
        si?: string;
      };
      date?: string;
    } = {};

    // Validate image
    if (!formData.image) {
      errors.image = "Image is required";
    }

    // Validate descriptions in all languages
    const descriptionErrors: { en?: string; ta?: string; si?: string } = {};
    if (!formData.description.en?.trim()) {
      descriptionErrors.en = "English description is required";
    }
    if (!formData.description.ta?.trim()) {
      descriptionErrors.ta = "Tamil description is required";
    }
    if (!formData.description.si?.trim()) {
      descriptionErrors.si = "Sinhala description is required";
    }

    if (Object.keys(descriptionErrors).length > 0) {
      errors.description = descriptionErrors;
    }

    // Validate date
    if (!formData.date) {
      errors.date = "Date is required";
    } else if (new Date(formData.date) > new Date()) {
      errors.date = "Date cannot be in the future";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (formData.id) {
      setEntries(prev =>
        prev.map(e =>
          e.id === formData.id
            ? { 
                ...e, 
                image: formData.image, 
                description: formData.description, 
                date: formData.date 
              }
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

    setFormData({ 
      id: 0, 
      image: "", 
      description: { en: "", ta: "", si: "" }, 
      date: "" 
    });
    setShowForm(false);
    setMenuOpenId(null);
    setFormErrors({});
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
    setFormData({ 
      id: entry.id, 
      image: entry.image, 
      description: entry.description, 
      date: entry.date 
    });
    setShowForm(true);
    setMenuOpenId(null);
    setFormErrors({});
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

  const handleDescriptionChange = (language: Language, value: string) => {
    setFormData(prev => ({
      ...prev,
      description: {
        ...prev.description,
        [language]: value
      }
    }));

    // Clear error for this language when user starts typing
    if (formErrors.description?.[language]) {
      setFormErrors(prev => ({
        ...prev,
        description: {
          ...prev.description,
          [language]: undefined
        }
      }));
    }
  };

  const filtered = entries.filter(e =>
    Object.values(e.description).some(desc =>
      desc.toLowerCase().includes(search.toLowerCase())
    )
  );

  const resetForm = () => {
    setFormData({ 
      id: 0, 
      image: "", 
      description: { en: "", ta: "", si: "" }, 
      date: "" 
    });
    setFormErrors({});
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Social Work Dashboard</h1>

      {/* Search + Language + Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Search social work entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 p-3 rounded shadow-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Language:</span>
            <select 
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value as Language)}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="en">English</option>
              <option value="ta">Tamil</option>
              <option value="si">Sinhala</option>
            </select>
          </div>
        </div>

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
            + Add Social Work
          </button>
        </div>
      </div>

      {/* Toast success message */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded shadow-lg z-50 transition-all">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {successMessage}
          </div>
        </div>
      )}

      <div className="mb-3 text-gray-600 font-medium">
        Total: {entries.length} entries • Showing: {filtered.length} entries • 
        Active: {entries.filter(e => e.active).length} • 
        Inactive: {entries.filter(e => !e.active).length}
      </div>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(entry => (
          <div
            key={entry.id}
            className={`relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${
              !entry.active ? "opacity-50 bg-gray-100" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(entry.id)}
              onChange={() => handleSelect(entry.id)}
              className="absolute top-3 left-3 w-5 h-5 z-10"
            />

            <div className="relative">
              <img 
                src={entry.image} 
                alt="social work" 
                className="w-full h-48 object-cover" 
              />
              {!entry.active && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Inactive
                </div>
              )}
            </div>

            <div className="p-4">
              <p className="text-gray-800 font-medium mb-2">
                {entry.description[currentLanguage]}
              </p>
              <p className="text-gray-500 text-sm">Date: {entry.date}</p>
              
              {/* Language badges */}
              <div className="flex gap-1 mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">EN</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">TA</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">SI</span>
              </div>
            </div>

            {/* Menu Button */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() =>
                  setMenuOpenId(menuOpenId === entry.id ? null : entry.id)
                }
                className="bg-white bg-opacity-80 hover:bg-opacity-100 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 hover:text-gray-800 shadow-sm"
              >
                ⋮
              </button>
              {menuOpenId === entry.id && (
                <div className="bg-white border rounded shadow-lg absolute right-0 mt-1 w-48 z-20">
                  <button 
                    onClick={() => handleView(entry)} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                  >
                    👁️ View
                  </button>
                  <button 
                    onClick={() => handleEdit(entry)} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => openDeleteDialog(entry)} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    🗑️ Delete
                  </button>
                  <button 
                    onClick={() => toggleActive(entry.id)} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-orange-600"
                  >
                    {entry.active ? "⏸️ Disable" : "▶️ Enable"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No social work entries found. {search && "Try adjusting your search."}
        </div>
      )}

      {/* Single Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedSocialWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete "{selectedSocialWork.description.en}"? This action cannot be undone.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {isBulkDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">View Social Work</h2>
            <img src={viewEntry.image} alt="view" className="w-full h-48 object-cover rounded mb-4" />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <div className="space-y-2">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">EN</span>
                  {viewEntry.description.en}
                </div>
                <div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">TA</span>
                  {viewEntry.description.ta}
                </div>
                <div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2">SI</span>
                  {viewEntry.description.si}
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              <strong>Date:</strong> {viewEntry.date}
            </p>
            
            <p className="text-sm mb-4">
              <strong>Status:</strong> 
              <span className={`ml-2 ${viewEntry.active ? 'text-green-600' : 'text-red-600'}`}>
                {viewEntry.active ? 'Active' : 'Inactive'}
              </span>
            </p>

            <div className="flex justify-end">
              <button 
                onClick={() => setViewEntry(null)} 
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {formData.id ? 'Edit Social Work' : 'Add New Social Work'}
            </h2>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image *
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formErrors.image && (
                <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
              )}
              {formData.image && (
                <img src={formData.image} alt="preview" className="w-full h-48 object-cover rounded mt-3 border" />
              )}
            </div>

            {/* Language Tabs for Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              
              <div className="flex gap-2 mb-3">
                {(['en', 'ta', 'si'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setCurrentLanguage(lang)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentLanguage === lang 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {LANGUAGE_NAMES[lang]}
                  </button>
                ))}
              </div>

              {/* Description Input for Current Language */}
              <textarea
                placeholder={`Enter description in ${LANGUAGE_NAMES[currentLanguage]}...`}
                value={formData.description[currentLanguage]}
                onChange={e => handleDescriptionChange(currentLanguage, e.target.value)}
                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
              />
              {formErrors.description?.[currentLanguage] && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description[currentLanguage]}</p>
              )}
              
              {/* Character count */}
              <p className="text-xs text-gray-500 mt-1">
                {formData.description[currentLanguage].length} characters
              </p>
            </div>

            {/* Date Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e => {
                  setFormData(prev => ({ ...prev, date: e.target.value }));
                  if (formErrors.date) {
                    setFormErrors(prev => ({ ...prev, date: undefined }));
                  }
                }}
                max={new Date().toISOString().split('T')[0]}
                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formErrors.date && (
                <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
              )}
            </div>

            {/* Validation Summary */}
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
                <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                  {formErrors.image && <li>{formErrors.image}</li>}
                  {formErrors.description?.en && <li>English description is required</li>}
                  {formErrors.description?.ta && <li>Tamil description is required</li>}
                  {formErrors.description?.si && <li>Sinhala description is required</li>}
                  {formErrors.date && <li>{formErrors.date}</li>}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={resetForm} 
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-sm transition"
              >
                {formData.id ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}