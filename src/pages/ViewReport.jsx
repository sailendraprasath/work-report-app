import { useEffect, useState, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Hooks must run first
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const ref = doc(db, "workReports", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setReport(snap.data());
        }
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // ✅ Now do role check AFTER hooks
  if (role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
   <Loader/>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <p className="mb-4">Report not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white p-6 sm:p-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Full Work Report</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-purple-600 text-left">
          <thead className="bg-purple-800/40">
            <tr>
              <th className="p-3 border border-purple-600">Field</th>
              <th className="p-3 border border-purple-600">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border border-purple-600 font-semibold">
                Employee Email
              </td>
              <td className="p-3 border border-purple-600">{report.name}</td>
            </tr>
            <tr>
              <td className="p-3 border border-purple-600 font-semibold">
                Date & Time
              </td>
              <td className="p-3 border border-purple-600">{report.date}</td>
            </tr>
            <tr>
              <td className="p-3 border border-purple-600 font-semibold align-top">
                Work Report
              </td>
              <td className="p-3 border border-purple-600 whitespace-pre-wrap">
                {report.work}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
