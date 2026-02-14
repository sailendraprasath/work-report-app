import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function ReportForm() {
  const [work, setWork] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {
    if (!work.trim()) {
      toast.error("Please enter some work before submitting!");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "workReports"), {
        userId: auth.currentUser.uid,
        name: auth.currentUser.email,
        work,
        date: new Date().toLocaleString(),
        createdAt: serverTimestamp(),
      });

      setWork("");
      toast.success("Report submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-purple-800/30 to-black/20 p-6 sm:p-8 rounded-2xl shadow-lg w-full sm:max-w-lg mx-auto mb-6 border border-purple-600/40"
    >
      <Toaster position="top-right" reverseOrder={false} />

      <textarea
        className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
        rows="5"
        placeholder="Enter today's work..."
        value={work}
        onChange={(e) => setWork(e.target.value)}
      />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={submitReport}
        disabled={loading}
        className={`mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Submitting..." : "Submit Report"}
      </motion.button>
    </motion.div>
  );
}
