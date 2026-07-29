import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaImage } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LogOut } from "lucide-react";
import { Trash2 } from "lucide-react";
import { X } from "lucide-react";
import logo from "../../assets/logo.png";
import api from "../../services/api";


export default function Home() {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [uploadId, setUploadId] = useState(null);
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const logout = async () => {
    await signOut(auth);
  };
  useEffect(() => {
    loadPendingUploads();
  }, []);

  const closeSheet = () => {
    setUploadId(null);
    setSheetDate("");
    setRows([]);
  };

  const loadPendingUploads = async () => {
    try {
      const res = await api.get("/upload/pending");

      setUploads(res.data.uploads);

    } catch (err) {
      console.error(err);
    }
  };

  const openUpload = async (id) => {
    try {
      const res = await api.get(`/upload/${id}`);

      const upload = res.data.upload;

      setUploadId(upload._id);
      setSheetDate(upload.sheetDate);
      setRows(upload.rows);

    } catch (err) {
      console.error(err);
    }
  };

  const [sheetDate, setSheetDate] = useState("");
  const [rows, setRows] = useState([]);

  const saveTimeout = useRef(null);

  const handleImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      setStatus("Uploading delivery sheet...");

      const res = await api.post("/upload", formData);

      console.log(res.data);

      setStatus("Extracting details...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus("Calculating amounts...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUploadId(res.data.uploadId);
      setSheetDate(res.data.date);
      setRows(res.data.rows);
      loadPendingUploads();

    } catch (err) {
      console.error(err);
      if (err.response?.status === 429) {
        alert("Gemini API rate limit reached.\n\nPlease wait a few minutes and try again.");
      } else {
        alert("Failed to process delivery sheet.");
      }
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const calculateAmount = (awb, pieces, weight) => {

    pieces = Number(pieces);
    weight = Number(weight);

    if (weight <= 5) {

      if (awb.startsWith("9")) {
        return 10;
      }

      return pieces * 5;
    }

    return Math.max(
      pieces * 5,
      weight * 1.5
    );
  };

  const handleChange = (index, field, value) => {

    const updated = [...rows];

    updated[index][field] = value;

    if (
      field === "awb" ||
      field === "pieces" ||
      field === "weight"
    ) {

      updated[index].amount = calculateAmount(
        updated[index].awb,
        updated[index].pieces,
        updated[index].weight
      );

    }

    setRows(updated);
    clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {

      saveChanges(updated);

    }, 1000);
  };

  const saveChanges = async (updatedRows) => {
    if (!uploadId) return;

    const totalShipments = updatedRows.length;

    const totalAmount = updatedRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );

    try {
      const res = await api.patch(`/upload/${uploadId}`, {
        rows: updatedRows,
        totalShipments,
        totalAmount,
      });

      if (res.data.deleted) {
        setUploadId(null);
        setSheetDate("");
        setRows([]);
        loadPendingUploads();
        return;
      }

      setUploads(prev =>
        prev.map(upload =>
          upload._id === uploadId
            ? {
              ...upload,
              totalShipments,
              totalAmount,
            }
            : upload
        )
      );

    } catch (err) {
      console.error("Failed to save changes", err);
    }
  };

  const totalShipments = rows.length;

  const totalAmount = rows.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );

  const addRow = () => {
    const updated = [
      ...rows,
      {
        awb: "",
        pieces: "",
        weight: "",
        amount: calculateAmount("", 0, 0),
      },
    ];

    setRows(updated);
    saveChanges(updated);

  };

  const handleConfirm = async () => {
    if (!uploadId) return;

    const awbs = rows
  .map(r => r.awb.trim())
  .filter(awb => awb !== "");

    const duplicates = awbs.filter(
      (awb, index) => awbs.indexOf(awb) !== index
    );

    if (duplicates.length > 0) {
      alert(
        `Duplicate AWB found.\n\n${[...new Set(duplicates)].join("\n")}`
      );
      return;
    }

    setConfirmLoading(true);

    try {
      await api.patch(`/upload/${uploadId}`, {
        rows,
      });
      console.log("Upload ID:", uploadId);
      window.location.href =
        `${API_URL}/auth/microsoft?uploadId=${uploadId}`;

      return;
    } catch (err) {
      console.error(err);
    }

    finally {
      setConfirmLoading(false);
    }
  };

  const deleteRow = (index) => {
    if (!window.confirm("Are you sure you want to delete this shipment?")) return;

    const updated = rows.filter((_, i) => i !== index);

    setRows(updated);

    saveChanges(updated);

  };

  useEffect(() => {
    return () => clearTimeout(saveTimeout.current);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <button

          onClick={() => navigate("/logs")}

          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow hover:bg-gray-100">
          Logs
        </button>

        <button
          onClick={logout}
          className="absolute top-4 right-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow hover:bg-gray-100"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
      <div className="w-full max-w-6xl px-2 sm:px-4 md:px-6">

        <div className="flex flex-col items-center mt-6">

          <img
            src={logo}
            alt="logo"
            className="w-24"
          />

          <h1 className="text-3xl font-bold mt-4">
            Delivery Automation
          </h1>

          <h2 className="text-lg font-semibold">

            Pending Uploads ({uploads.length})

          </h2>

        </div>

        {uploads.map((upload) => (

          <div
            key={upload._id}
            onClick={() => openUpload(upload._id)}
            className="flex justify-between items-center rounded-lg border p-3 mb-2 cursor-pointer hover:bg-slate-50 transition"
          >

            <div>

              <p className="font-semibold">
                {upload.sheetDate}
              </p>

              <p className="text-sm text-gray-500">
                {upload.totalShipments} Shipments
              </p>

            </div>

            <div className="text-right">

              <p className="text-green-600 font-bold">
                ₹ {upload.totalAmount}
              </p>

              <span className="text-xs text-blue-600">
                {upload.status}
              </span>

            </div>

          </div>

        ))}

        {!loading && rows.length === 0 && (

          <div className="space-y-4 mt-10">

            <button
              onClick={() => cameraRef.current.click()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 flex justify-center items-center gap-3"
            >
              <FaCamera />
              Take Photo
            </button>

            <button
              onClick={() => galleryRef.current.click()}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 flex justify-center items-center gap-3"
            >
              <FaImage />
              Choose From Gallery
            </button>

          </div>

        )}

        <input
          hidden
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImage}
        />

        <input
          hidden
          ref={galleryRef}
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        {loading && (

          <div className="mt-16 text-center">

            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-6 text-lg font-medium">
              {status}
            </p>

          </div>

        )}

        {!loading && rows.length > 0 && (

          <div className="mt-4 md:mt-8 bg-white rounded-xl shadow-lg p-3 md:p-5">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold text-green-600">
                Delivery Sheet
              </h2>

              <button
                onClick={closeSheet}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 transition"
              >
                <X size={18} />
                Close
              </button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">

              <div className="bg-slate-100 rounded-lg p-3">
                <p className="text-xs text-gray-500">
                  Date
                </p>

                <p className="font-semibold">
                  {sheetDate}
                </p>
              </div>

              <div className="bg-slate-100 rounded-lg p-3">
                <p className="text-xs text-gray-500">
                  Total Shipments
                </p>

                <p className="font-semibold">
                  {totalShipments}
                </p>
              </div>

              <div className="bg-slate-100 rounded-lg p-3">
                <p className="text-xs text-gray-500">
                  Total Amount
                </p>

                <p className="font-semibold text-green-600">
                  ₹ {totalAmount.toFixed(2)}
                </p>
              </div>

            </div>
            <div className="flex justify-between items-center mb-4">

              <h3 className="font-semibold text-gray-700">
                Shipments
              </h3>

              <button
                onClick={addRow}
                className="
      rounded-xl
      bg-emerald-600
      px-4
      py-2
      text-sm
      font-semibold
      text-white
      transition
      hover:bg-emerald-700
    "
              >
                + Add Shipment
              </button>

            </div>

            <div className="overflow-x-auto rounded-lg border">



              <table className="min-w-[720px] w-full border-collapse">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="border p-3 min-w-[190px] text-center font-semibold">
                      AWB
                    </th>

                    <th className="border p-3 min-w-[90px] text-center font-semibold">
                      Pieces
                    </th>

                    <th className="border p-3 min-w-[100px] text-center font-semibold">
                      Weight
                    </th>

                    <th className="border p-3 min-w-[120px] text-center font-semibold">
                      Amount
                    </th>
                    <th className="border p-3 min-w-[90px] text-center font-semibold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {rows.map((row, index) => (

                    <tr key={index}>

                      <td className="border p-2">

                        <input
                          value={row.awb ?? ""}
                          autoComplete="off"
                          spellCheck={false}
                          onChange={(e) =>
                            handleChange(index, "awb", e.target.value)
                          }
                          className="w-full min-w-[180px] text-center outline-none bg-transparent"
                        />

                      </td>

                      <td className="border p-2">

                        <input
                          value={row.pieces ?? ""}
                          onChange={(e) =>
                            handleChange(index, "pieces", e.target.value)
                          }
                          className="w-full text-center outline-none bg-transparent"
                        />

                      </td>

                      <td className="border p-2">

                        <input
                          value={row.weight ?? ""}
                          onChange={(e) =>
                            handleChange(index, "weight", e.target.value)
                          }
                          className="w-full text-center outline-none bg-transparent"
                        />

                      </td>

                      <td className="border p-2">

                        <input
                          value={row.amount ?? ""}
                          onChange={(e) =>
                            handleChange(index, "amount", e.target.value)
                          }
                          className="w-full text-center outline-none bg-transparent"
                        />

                      </td>

                      <td className="text-center">

                        <button

                          onClick={() => deleteRow(index)}

                          className="rounded-lg p-2 text-red-500 hover:bg-red-100 transition"

                          title="Delete Shipment"

                        >

                          <Trash2 size={18} />

                        </button>

                      </td>


                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <button
  onClick={handleConfirm}
  disabled={confirmLoading}
  className={`mt-6 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-white ${
    confirmLoading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {confirmLoading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Uploading to Excel...
    </>
  ) : (
    "Confirm & Add to Excel"
  )}
</button>

          </div>

        )}

      </div>
    </div>
  );
}