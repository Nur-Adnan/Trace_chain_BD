import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Divider,
  TableContainer,
  Spinner,
  Center,
  Image,
  keyframes,
  Button,
} from "@chakra-ui/react";
import { etherContract } from "../../contants";
import useAuth from "../../hooks/userAuth";
import backgroundImage from "../../img/homeBG3.png";
import blinkingImage from "../../img/svg.png"; // Replace with your image path
import { QRCode } from "react-qrcode-logo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Define the blinking animation for the image
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

// Define the spinning animation for the spinner
const spinAround = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

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

function ImporterDispatchHistory() {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account } = useAuth();
  const [printId, setPrintId] = useState(null);
  const [base64Logo, setBase64Logo] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const qrRef = useRef(null);

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

  const fetchRolesData = async () => {
    try {
      const response = await fetch(
        "https://tracechainbd-backend.onrender.com/api/roles"
      );
      const data = await response.json();
      setRolesData(data);
    } catch (error) {
      console.error("Error fetching roles data:", error);
    }
  };

  const getRoleData = (address) => {
    try {
      const role = rolesData.find(
        (role) => role.address_registered === address
      );
      return role ? `${role.name} (${role.role})` : "Unknown Role";
    } catch (error) {
      console.error("Error getting role data:", error);
      return "Error Fetching Role";
    }
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

  useEffect(() => {
    fetchRolesData();
    const fetchHistoryData = async () => {
      try {
        const multiProductEvents = await etherContract.queryFilter(
          "MultiProductDispatched"
        );
        const singleProductEvents = await etherContract.queryFilter(
          "ProductDispatched"
        );

        const multiProductDispatches = multiProductEvents.map((event) => {
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
            startId: Number(startId.toString()),
            endId: Number(endId.toString()),
            from: from,
            to: to,
            timestamp: Number(dispatchedOn.toString()),
            quantity: quantity.toString(),
            type: "Multi",
          };
        });

        const singleProductDispatches = singleProductEvents.map((event) => {
          const { dispatchId, dispatchedOn, productId, quantity, from, to } =
            event.args;

          return {
            dispatchId: dispatchId.toString(),
            startId: Number(productId.toString()),
            endId: Number(productId.toString()),
            from: from,
            to: to,
            timestamp: Number(dispatchedOn.toString()),
            quantity: quantity.toString(),
            type: "Single",
          };
        });

        const allDispatches = [
          ...multiProductDispatches,
          ...singleProductDispatches,
        ];
        allDispatches.sort((a, b) => b.timestamp - a.timestamp);

        setDispatches(allDispatches);
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (etherContract) {
      fetchHistoryData();
    }
  }, [etherContract, account]);

  const formatAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-7)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cover bg-center">
        <div className="relative text-center inline-block">
          <Image
            src={blinkingImage}
            alt="Loading"
            boxSize="50px"
            animation={`${blinkAnimation} 1.5s infinite`}
            position="absolute"
            top="27%"
            left="50%"
            transform="translate(-50%, -50%)"
          />

          <Spinner
            width="60px"
            height="60px"
            color="#5160be"
            animation={`${spinAround} 0.9s linear infinite`}
            position="relative"
            zIndex="0"
          />
          <Text mt={4} fontSize="xl" fontWeight="bold">
            Please wait while we load the accepted product list. This won't take
            long.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-bold md:text-5xl tracking-wide flex items-center justify-center">
          Importer to Distributor Dispatch History
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8">
        List of all the distributors whom you already send products
      </p>
      {dispatches.length > 0 ? (
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
                    Distributor
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Timestamp
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Quantity
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Type
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    QR Code
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
                        {getRoleData(dispatch.to)}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {new Date(dispatch.timestamp * 1000).toLocaleString()}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {dispatch.quantity}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {dispatch.type}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] w-20 h-8 bg-[#0070f3] rounded-md text-white font-medium transition duration-200 ease-linear text-xs"
                          onClick={() => setPrintId(dispatch.dispatchId)}
                        >
                          QR Code
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center mt-6 text-gray-500 tracking-wider">
          No dispatch history available.
        </p>
      )}

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

export default ImporterDispatchHistory;
