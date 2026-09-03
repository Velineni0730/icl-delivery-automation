import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Package,
  CalendarDays,
  Clock,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
  try {
    setLoading(true);

    const res = await api.get("/upload/logs");

    setLogs(res.data.logs);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const toggleLog = (id) => {
    setExpandedLog((current) => (current === id ? null : id));
  };

  const formatUploadTime = (date) => {
    if (!date) return "Time unavailable";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow hover:bg-gray-100 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold">Upload Logs</h1>

            <div className="w-[80px] sm:w-[100px]"></div>
          </div>


          <div className="space-y-3">
            {loading && (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

                <p className="mt-3 text-gray-500">Loading logs...</p>
              </div>
            )}

            {!loading && logs.length === 0 && (
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                No upload logs found.
              </div>
            )}

            {logs.map((log) => {
              const isExpanded = expandedLog === log._id;

              return (
                <div
                  key={log._id}
                  className="bg-white rounded-xl shadow overflow-hidden"
                >

                  <button
                    onClick={() => toggleLog(log._id)}
                    className="w-full text-left p-4 sm:p-5 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={18} className="text-gray-500" />

                          <p className="font-bold text-lg">{log.sheetDate}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Package size={15} />
                            {log.totalShipments} Shipments
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock size={15} />
                            {formatUploadTime(log.uploadedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-green-600 font-bold">
                            ₹ {Number(log.totalAmount || 0).toFixed(2)}
                          </p>

                          <p className="text-xs text-green-600 font-semibold mt-1">
                            {log.status}
                          </p>
                        </div>

                        {isExpanded ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </div>
                  </button>


                  {isExpanded && (
                    <div className="border-t bg-slate-50 p-3 sm:p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Package size={18} />
                        <h2 className="font-semibold">Shipment Details</h2>
                      </div>

                      <div className="overflow-x-auto rounded-lg border bg-white">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="p-3 text-center text-sm font-semibold">
                                AWB
                              </th>

                              <th className="p-3 text-center text-sm font-semibold">
                                Pieces
                              </th>

                              <th className="p-3 text-center text-sm font-semibold">
                                Weight
                              </th>

                              <th className="p-3 text-center text-sm font-semibold">
                                Amount
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {log.rows?.map((row, index) => (
                              <tr key={row._id || index} className="border-t">
                                <td className="p-3 text-center font-medium">
                                  {row.awb}
                                </td>

                                <td className="p-3 text-center">
                                  {row.pieces}
                                </td>

                                <td className="p-3 text-center">
                                  {row.weight}
                                </td>

                                <td className="p-3 text-center font-semibold text-green-600">
                                  ₹ {Number(row.amount || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>


                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-white rounded-lg border p-3">
                          <p className="text-xs text-gray-500">
                            Total Shipments
                          </p>

                          <p className="text-lg font-semibold mt-1">
                            {log.totalShipments}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg border p-3">
                          <p className="text-xs text-gray-500">Total Amount</p>

                          <p className="text-lg font-semibold text-green-600 mt-1">
                            ₹ {Number(log.totalAmount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
}