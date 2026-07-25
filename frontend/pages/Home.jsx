import { useRef, useState } from "react";
import { FaCamera, FaImage } from "react-icons/fa";
import logo from "../assets/logo.png";
import api from "../services/api";

export default function Home() {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [sheetDate, setSheetDate] = useState("");
  const [rows, setRows] = useState([]);

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

      setSheetDate(res.data.date);
      setRows(res.data.rows);

    } catch (err) {
      console.error(err);
      alert("Failed to process delivery sheet.");
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
  };

  const handleConfirm = () => {
    console.log(rows);

    alert("Next step: Send data to Excel.");
  };

  const totalShipments = rows.length;

  const totalAmount = rows.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-5xl p-4 md:p-6">

        <div className="flex flex-col items-center mt-6">

          <img
            src={logo}
            alt="logo"
            className="w-24"
          />

          <h1 className="text-3xl font-bold mt-4">
            Delivery Automation
          </h1>

          <p className="text-gray-500 mt-2">
            Upload Delivery Sheet
          </p>

        </div>

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

          <div className="mt-8 bg-white rounded-xl shadow-lg p-5">

            <div className="flex justify-between items-center mb-5">

              <div className="w-full">

                <h2 className="text-xl font-bold text-green-600">
                  ✓ Delivery Sheet Processed
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">

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

              </div>

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

                  </tr>

                </thead>

                <tbody>

                  {rows.map((row, index) => (

                    <tr key={index}>

                      <td className="border p-2">

                        <input
                          value={row.awb}
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
                          value={row.pieces}
                          onChange={(e) =>
                            handleChange(index, "pieces", e.target.value)
                          }
                          className="w-full text-center outline-none bg-transparent"
                        />

                      </td>

                      <td className="border p-2">

                        <input
                          value={row.weight}
                          onChange={(e) =>
                            handleChange(index, "weight", e.target.value)
                          }
                          className="w-full text-center outline-none bg-transparent"
                        />

                      </td>

                      <td className="border p-2">

                        <input
                          value={row.amount}
                          onChange={(e) =>
                            handleChange(index, "amount", e.target.value)
                          }
                          className="w-full text-center outline-none bg-transparent"
                        />

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <button
              onClick={handleConfirm}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
            >
              Confirm & Add to Excel
            </button>

          </div>

        )}

      </div>
    </div>
  );
}