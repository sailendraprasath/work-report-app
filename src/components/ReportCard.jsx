import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ReportCard({ report, isAdmin }) {
  const [visible, setVisible] = useState(true);
  const [workContent, setWorkContent] = useState(report.work);
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${report.name}"?`)) return;

    try {
      setVisible(false);

      setTimeout(async () => {
        await deleteDoc(doc(db, "workReports", report.id));
        toast.success("Report deleted successfully!");
      }, 300);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete report.");
      setVisible(true);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true); // start loading
      await updateDoc(doc(db, "workReports", report.id), {
        work: workContent,
      });
      toast.success("Report saved successfully!"); // ✅ toast on save
    } catch (err) {
      console.error(err);
      toast.error("Failed to save report.");
    } finally {
      setSaving(false); // end loading
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-br from-purple-800/30 to-black/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow w-full sm:max-w-md mx-auto mb-6 border border-purple-600/40 flex flex-col"
          style={{ maxHeight: "400px" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg sm:text-xl text-white tracking-wide">
              {report.name}
            </h3>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Delete
              </button>
            )}
          </div>

          <p className="text-sm text-gray-400 mt-1">{report.date}</p>

          {/* Scrollable textarea */}
          <textarea
            value={workContent}
            onChange={(e) => setWorkContent(e.target.value)}
            className="mt-4 flex-1 w-full resize-none bg-black/30 text-gray-200 p-2 rounded-lg border border-purple-600/40 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ maxHeight: "250px" }}
          />

          {/* Save button */}
          <button
            onClick={handleUpdate}
            disabled={saving}
            className={`mt-3 px-4 py-2 rounded-lg shadow-sm self-end transition-colors ${
              saving
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
