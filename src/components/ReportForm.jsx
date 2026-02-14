import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ReportForm({ editingReport, cancelEdit }) {
  const [work, setWork] = useState("");

  useEffect(() => {
    if (editingReport) {
      setWork(editingReport.work);
    }
  }, [editingReport]);

  const getDateTime = () => {
    return new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!work.trim()) return;

    const now = getDateTime();

    if (editingReport) {
      // UPDATE → date & time also change
      await updateDoc(doc(db, "workReports", editingReport.id), {
        work: work,
        date: now,
      });
    } else {
      // ADD NEW
      await addDoc(collection(db, "workReports"), {
        userId: auth.currentUser.uid,
        name: auth.currentUser.email,
        work,
        date: now,
      });
    }

    setWork("");
    cancelEdit && cancelEdit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-purple-900/30 p-6 rounded-xl mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">
        {editingReport ? "Edit Work Report" : "Add Work Report"}
      </h2>

      {editingReport && (
        <p className="text-sm text-gray-400 mb-3">
          Last updated: {editingReport.date}
        </p>
      )}

      <textarea
        value={work}
        onChange={(e) => setWork(e.target.value)}
        placeholder="Enter your work..."
        className="w-full p-3 mb-4 rounded bg-black/30 border border-purple-600"
        rows="4"
        required
      />

      <div className="flex gap-3">
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
          {editingReport ? "Update" : "Submit"}
        </button>

        {editingReport && (
          <button
            type="button"
            onClick={() => {
              setWork(""); // 🔥 clear textarea
              cancelEdit(); // 🔥 exit edit mode
            }}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
