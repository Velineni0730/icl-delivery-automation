import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Logs() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {

    try {

      const res = await api.get("/upload/logs");

      setLogs(res.data.logs);

    } catch (err) {
      console.error(err);
    }

  };
    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-slate-100 p-6">

            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between mb-6">

                    <button
                        onClick={() => navigate("/home")}
                        className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 transition"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <h1 className="text-3xl font-bold">
                        Upload Logs
                    </h1>

                    <div></div>

                </div>

                <h1 className="text-3xl font-bold mb-6">
                    Upload Logs
        </h1>

        <div className="overflow-x-auto rounded-xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-slate-200">

              <tr>

                <th className="p-3">Date</th>

                <th className="p-3">Shipments</th>

                <th className="p-3">Amount</th>

                <th className="p-3">Status</th>

              </tr>

            </thead>

            <tbody>

              {logs.map((log) => (

                <tr
                  key={log._id}
                  className="border-t text-center"
                >

                  <td className="p-3">
                    {log.sheetDate}
                  </td>

                  <td className="p-3">
                    {log.totalShipments}
                  </td>

                  <td className="p-3">
                    ₹ {log.totalAmount}
                  </td>

                  <td className="p-3 text-green-600 font-semibold">
                    {log.status}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}