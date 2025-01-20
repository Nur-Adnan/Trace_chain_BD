import { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  TableContainer,
  Button,
  useToast,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import backgroundImage from "../../img/homeBG3.png";
import { etherContract } from "../../contants";

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

function EntryHistory({ fromDispatch }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesData, setRolesData] = useState([]);
  const [printBoxId, setPrintBoxId] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [base64Logo, setBase64Logo] = useState("");
  const qrRef = useRef([]);
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

  useEffect(() => {
    fetchRolesData();

    const fetchProductHistory = async () => {
      try {
        // Fetch the 'ProductAdded' events
        const events = await etherContract.queryFilter("ProductAdded");

        // Group products by boxId
        const groupedProducts = events.reduce((acc, event) => {
          const {
            boxId,
            id,
            name,
            description,
            category,
            countryOfOrigin,
            manufacturer,
            price,
            quantity,
            importedDate,
            importerAddr,
            customsAddr,
          } = event.args;

          if (!acc[boxId]) {
            acc[boxId] = {
              boxId: boxId.toString(),
              name,
              description,
              category,
              countryOfOrigin,
              manufacturer,
              price: Number(price), // Assuming price is in wei or some other unit
              quantity: quantity.toString(),
              importedDate: new Date(
                importedDate.toNumber() * 1000
              ).toLocaleString(), // Convert timestamp to date
              importerAddr,
              customsAddr,
              ids: [], // Initialize the ids array
              status: null, // Initialize status as null
            };
          }

          acc[boxId].ids.push(id.toString());

          return acc;
        }, {});

        // Convert the object into an array of products
        const productData = Object.values(groupedProducts);

        // Fetch the status for the first product's first ID
        if (productData.length > 0 && productData[0].ids.length > 0) {
          const firstProductId = productData[0].ids[0];
          const status = await etherContract.productLifeCycles(firstProductId);
          productData[0].status = status;
        }

        // Update state with the grouped data and status
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching ProductAdded events or status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductHistory();
  }, []);

  const handleGeneratePdf = async () => {
    setQrLoading(true);
    try {
      // Ensure qrRef elements exist
      if (!qrRef.current || qrRef.current.length === 0) {
        toast({
          title: "Error",
          description: "No QR codes to generate.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setQrLoading(false);
        return;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      let x = 10;
      let y = 10;
      const maxX = 580;
      const maxY = 800;
      const padding = 10;
      const width = 200;
      const height = 200;

      for (let i = 0; i < qrRef.current.length; i++) {
        const qrElement = qrRef.current[i];
        if (!qrElement) continue;

        const canvas = await html2canvas(qrElement);
        const qrImage = canvas.toDataURL("image/png");

        if (x + width > maxX) {
          x = 10;
          y += height + padding;
        }

        if (y + height > maxY) {
          pdf.addPage();
          x = 10;
          y = 10;
        }

        pdf.addImage(qrImage, "PNG", x, y, width, height);
        x += width + padding;
      }

      pdf.save(`QRCode_${printBoxId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-semibold md:text-4xl tracking-wider flex items-center justify-center">
          {fromDispatch ? "Pending Product Dispatch" : "Product Entry History"}
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8">
        {fromDispatch
          ? "List of products pending for dispatch."
          : "View the history of all products added to the system."}
      </p>
      <div className="flex justify-center h-screen">
        {loading ? (
          <Spinner size="xl" thickness="4px" color="blue.500" />
        ) : (
          <div className="container w-full mx-auto px-2">
            <div
              id="recipients"
              className="p-4 mt-6 lg:mt-0 rounded shadow bg-white"
            >
              <table className="w-full bg-white rounded-lg">
                <thead className="border-b border-gray-300 bg-gray-100 ">
                  <tr className="text-black text-sm font-inter uppercase tracking-wider">
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Box ID
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      IDs
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Name
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Description
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Category
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Country of Origin
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Manufacturer
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Price
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Imported Date
                    </th>
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Importer Address
                    </th>
                    {!fromDispatch && (
                      <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                        Actions
                      </th>
                    )}
                    <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {products.map((product, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } hover:bg-blue-100 transition-colors duration-300`}
                    >
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.boxId}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.ids.join(", ")}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.name}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.description}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.category}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.countryOfOrigin}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.manufacturer}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.price} TAKA
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.importedDate}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {getRoleData(product.importerAddr)}
                      </td>
                      {!fromDispatch && (
                        <td className="p-4 text-center">
                          <button
                            className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] w-20 h-8 bg-[#0070f3] rounded-md text-white font-medium transition duration-200 ease-linear text-xs"
                            onClick={() => setPrintBoxId(product.boxId)}
                          >
                            Print QR Code
                          </button>
                        </td>
                      )}
                      <td className="p-4 text-center">
                        {Number(product.status) === 0 ? (
                          <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] w-20 h-8 bg-[#0070f3] rounded-md text-white font-medium transition duration-200 ease-linear text-xs">
                            In House
                          </button>
                        ) : (
                          <button className="shadow-[0_4px_14px_0_rgb(34,197,94,39%)] hover:shadow-[0_6px_20px_rgba(34,197,94,23%)] hover:bg-[rgba(34,197,94,0.9)] w-20 h-8 bg-green-500 rounded-md text-white font-medium transition duration-200 ease-linear text-xs">
                            Done
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {printBoxId && (
        <div className="flex flex-col items-center mt-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4">
            {products
              .find((product) => product.boxId === printBoxId)
              ?.ids.map((id, index) => (
                <div
                  key={index}
                  ref={(el) => (qrRef.current[index] = el)}
                  className="mb-4"
                >
                  <QRCode
                    value={`URL: https://localhost:5173/check-product/${id}`}
                    size={200}
                    fgColor="#0e57af"
                    bgColor="#fbfffe"
                    logoImage={base64Logo}
                    logoWidth={50}
                    logoHeight={50}
                    removeQrCodeBehindLogo={true}
                    eyeRadius={10}
                  />
                  <Text textAlign="center" mt={2}>
                    Product ID: {id}
                  </Text>
                </div>
              ))}
          </div>
          <button
            onClick={handleGeneratePdf}
            disabled={qrLoading}
            className={`w-48 h-12 text-white font-bold rounded-xl mt-4 transition duration-200 ease-linear text-xs shadow-[0_4px_14px_0_rgb(34,197,94,39%)] ${
              qrLoading
                ? "bg-[rgba(34,197,94,0.9)] cursor-not-allowed"
                : "bg-green-500 hover:bg-[rgba(34,197,94,0.9)] hover:shadow-[0_6px_20px_rgba(34,197,94,23%)]"
            }`}
          >
            {qrLoading ? "Generating PDF..." : "Download QR Codes as PDF"}
          </button>
        </div>
      )}
    </div>
  );
}

export default EntryHistory;
