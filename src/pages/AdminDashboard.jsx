
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "workReports"),
      (snapshot) => {
        setReports(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      },
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };
const handleEditDate = async (report) => {
  const newDate = prompt("Enter new date & time", report.date);
  if (!newDate) return;

  await updateDoc(doc(db, "workReports", report.id), {
    date: newDate,
  });
};

const filteredReports = reports.filter((r) => {
  const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase());

  let matchDate = true;

  if (dateFilter && r.date) {
    const selected = new Date(dateFilter).toDateString();
    const reportDate = new Date(r.date).toDateString();

    matchDate = selected === reportDate;
  }

  return matchSearch && matchDate;
});



  const totalReports = reports.length;
  const today = new Date().toLocaleDateString();
  const todayReports = reports.filter((r) => r.date?.includes(today)).length;

  const exportAllPDF = () => {
    const docPDF = new jsPDF("p", "mm", "a4");

    docPDF.setFontSize(16);
    docPDF.text("All Work Reports", 14, 15);

    const tableData = filteredReports.map((r) => [
      r.name || "-",
      r.date || "-",
      r.work || "-",
    ]);

    autoTable(docPDF, {
      startY: 22,
      head: [["Employee", "Date", "Work"]],
      body: tableData,

      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
        valign: "top",
      },

      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },

      alternateRowStyles: {
        fillColor: [240, 240, 240], // 🔥 light gray for 2nd row
      },

      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 90 },
      },
    });

    docPDF.save("All_Work_Reports.pdf");
  };

  const downloadSinglePDF = (report) => {
    const docPDF = new jsPDF();
    docPDF.text("Work Report", 14, 20);
    docPDF.text(`Employee: ${report.name}`, 14, 40);
    docPDF.text(`Date: ${report.date}`, 14, 50);

    const text = docPDF.splitTextToSize(report.work, 170);
    docPDF.text(text, 14, 70);

    docPDF.save(`${report.name}.pdf`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    await deleteDoc(doc(db, "workReports", id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white px-4 sm:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center md:text-left">
          Admin Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={exportAllPDF}
            className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Export All PDF
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-purple-800/40 p-5 rounded-xl text-center sm:text-left">
          <p className="text-gray-300 text-sm sm:text-base">Total Reports</p>
          <h2 className="text-2xl sm:text-3xl font-bold">{totalReports}</h2>
        </div>

        <div className="bg-purple-800/40 p-5 rounded-xl text-center sm:text-left">
          <p className="text-gray-300 text-sm sm:text-base">Today's Reports</p>
          <h2 className="text-2xl sm:text-3xl font-bold">{todayReports}</h2>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by employee email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded bg-black/30 border border-purple-600 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-3 rounded bg-black/30 border border-purple-600 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-purple-600">
        <table className="min-w-full text-sm sm:text-base">
          <thead className="bg-purple-800/40">
            <tr>
              <th className="p-3 border border-purple-600">Employee</th>
              <th className="p-3 border border-purple-600">Date</th>
              <th className="p-3 border border-purple-600">Work</th>
              <th className="p-3 border border-purple-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-purple-900/20 transition">
                <td className="p-3 border border-purple-600 break-words">
                  {report.name}
                </td>

                <td className="p-3 border border-purple-600">{report.date}</td>

                <td className="p-3 border border-purple-600 max-w-xs truncate">
                  {report.work}
                </td>

                <td className="p-3 border border-purple-600">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate(`/report/${report.id}`)}
                      className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>

                    <button
                      onClick={() => downloadSinglePDF(report)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      PDF
                    </button>

                    <button
                      onClick={() => handleDelete(report.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditDate(report)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
                    >
                      Edit Date
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
