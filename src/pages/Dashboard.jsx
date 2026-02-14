import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ReportForm from "../components/ReportForm";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "workReports"),
      where("userId", "==", auth.currentUser.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Work Reports</h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <ReportForm
        editingReport={editingReport}
        cancelEdit={() => setEditingReport(null)}
      />

      {/* TABLE */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border border-purple-700 text-sm sm:text-base">
          <thead className="bg-purple-800/40">
            <tr>
              <th className="p-3 border border-purple-700 text-left">
                Date & Time
              </th>
              <th className="p-3 border border-purple-700 text-left">
                Work Done
              </th>
              <th className="p-3 border border-purple-700 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center p-6 text-gray-400 border border-purple-700"
                >
                  No reports submitted yet
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-purple-900/20">
                  <td className="p-3 border border-purple-700 whitespace-nowrap">
                    {report.date}
                  </td>

                  <td className="p-3 border border-purple-700">
                    <div className="max-w-[500px] truncate">{report.work}</div>
                  </td>

                  <td className="p-3 border border-purple-700 text-center">
                    <button
                      onClick={() => setEditingReport(report)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
