import { useEffect, useRef, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { etherContract } from "../../contants";
import useAuth from "../../hooks/userAuth";
import { QRCode } from "react-qrcode-logo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Utility function to convert an image to base64
const convertImageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
  });
};

function CustomsDispatchHistory() {
  const [dispatches, setDispatches] = useState([]);
  const { account } = useAuth();
  const [printId, setPrintId] = useState(null);
  const [base64Logo, setBase64Logo] = useState("");
  const qrRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Load the logo as base64 when the component mounts
  useEffect(() => {
    const logoUrl =
      "https://res.cloudinary.com/dnmehw2un/image/upload/v1724790010/josm1wowxjneee0c3fva.png";
    convertImageToBase64(logoUrl)
      .then(setBase64Logo)
      .catch((error) =>
        console.error("Error converting logo to base64:", error)
      );
  }, []);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const events = await etherContract.queryFilter(
          "MultiProductDispatched"
        );
        const dispatchesList = events.map((event) => {
          const {
            dispatchId,
            dispatchedOn,
            endId,
            quantity,
            from,
            startId,
            to,
          } = event.args;
          return {
            dispatchId: dispatchId.toString(),
            startId: startId.toString(),
            endId: endId.toString(),
            from: from,
            to: to,
            timestamp: Number(dispatchedOn.toString()),
            quantity: quantity.toString(),
          };
        });
        setDispatches(dispatchesList);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    // Fetch history data on component mount or when etherContract changes
    if (etherContract) {
      fetchHistoryData();
    }
  }, [etherContract]);

  // Helper function to format address
  const formatAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-7)}`;
  };

  // Function to handle PDF generation and download
  const handleGeneratePdf = async () => {
    setLoading(true);
    try {
      const canvas = await html2canvas(qrRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save(`QRCode_${printId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-semibold md:text-5xl tracking-wider flex items-center justify-center">
          Customs to Importer Dispatch History
        </h1>
      </div>
      <p className="text-lg mb-4 max-w-xl mx-auto drop-shadow-md tracking-wider leading-10 text-center">
        Here you can find the history of all dispatches made by customs to
        importers.
      </p>
      <div className="container w-full mx-auto px-2">
        <div
          id="recipients"
          className="p-4 mt-6 lg:mt-0 rounded shadow bg-white"
        >
          <table className="w-full bg-white rounded-lg">
            <thead className="border-b border-gray-300 bg-gray-100 ">
              <tr className="text-black text-sm font-inter uppercase tracking-wider">
                <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                  Dispatch ID
                </th>
                <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                  Start PID
                </th>
                <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                  End PID
                </th>
                <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                  From
                </th>
                <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                  Importer
                </th>
                <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                  Timestamp
                </th>
                <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                  Quantity
                </th>
                <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {dispatches
                .filter(
                  (dispatch) =>
                    dispatch.quantity > 0 && dispatch.from === account
                )
                .map((dispatch, index) => (
                  <tr
                    key={dispatch.dispatchId}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } hover:bg-blue-100 transition-colors duration-300`}
                  >
                    <td className="p-4 text-left border-r border-gray-200">
                      {dispatch.dispatchId}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {dispatch.startId}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {dispatch.endId}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      Self
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {formatAddress(dispatch.to)}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {new Date(dispatch.timestamp * 1000).toLocaleString()}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {dispatch.quantity}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setPrintId(dispatch.dispatchId)}
                        className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] w-20 h-8 bg-[#0070f3] rounded-md text-white font-medium transition duration-200 ease-linear text-xs"
                      >
                        Show QR Codes
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {printId && (
        <div className="flex flex-col items-center mt-8">
          <div ref={qrRef} className="flex justify-center gap-4">
            <QRCode
              value={`URL: https://localhost:5173/accept-product/${printId}`}
              size={200}
              fgColor="#0e57af"
              bgColor="#fbfffe"
              logoImage={base64Logo}
              logoWidth={50}
              logoHeight={50}
              removeQrCodeBehindLogo={true}
              eyeRadius={10}
            />
          </div>
          <button
            onClick={handleGeneratePdf}
            disabled={loading}
            className={`w-48 h-12 text-white font-bold rounded-xl mt-4 transition duration-200 ease-linear text-xs shadow-[0_4px_14px_0_rgb(34,197,94,39%)] ${
              loading
                ? "bg-[rgba(34,197,94,0.9)] cursor-not-allowed"
                : "bg-green-500 hover:bg-[rgba(34,197,94,0.9)] hover:shadow-[0_6px_20px_rgba(34,197,94,23%)]"
            }`}
          >
            {loading ? "Generating PDF..." : "Download QR Codes as PDF"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomsDispatchHistory;
