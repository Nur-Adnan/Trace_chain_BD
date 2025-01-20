import { useState, useRef, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { QRCode } from "react-qrcode-logo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useWallet from "../../hooks/userWallet";
import {
  FiPackage,
  FiInfo,
  FiTag,
  FiFlag,
  FiTool,
  FiDollarSign,
  FiLayers,
  FiMapPin,
  FiHash,
} from "react-icons/fi";

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

function SingleProductEntry({ customsAddr }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [importerAddr, setImporterAddr] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [loading, setLoading] = useState(false);

  const [oldCounter, setOldCounter] = useState(0);
  const [base64Logo, setBase64Logo] = useState("");

  const qrRef = useRef(null);
  const toast = useToast();
  const { traceChainBDContract } = useWallet();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

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

  const singleProductEntry = async () => {
    if (
      !name ||
      !description ||
      !category ||
      !countryOfOrigin ||
      !manufacturer ||
      !price ||
      !quantity ||
      !importerAddr ||
      !customsAddr
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const _old = await traceChainBDContract.productCounter();
      setOldCounter(_old.toNumber());

      const tx = await traceChainBDContract.bulkProudctEntry(
        name,
        description,
        category,
        countryOfOrigin,
        manufacturer,
        price,
        quantity,
        importerAddr,
        customsAddr,
        { gasPrice: 0, gasLimit: 3000000 }
      );

      toast({
        title: "Processing",
        description: "Adding product to ledger",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });

      const transactionReceipt = await tx.wait();

      if (transactionReceipt !== undefined) {
        toast({
          title: "Product Added",
          description: "Product added successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        setLoading(false);
        // Show QR code after successful transaction
        setShowQr(true);
        setName("");
        setDescription("");
        setCategory("");
        setCountryOfOrigin("");
        setManufacturer("");
        setPrice("");
        setQuantity("");
        setImporterAddr("");
      } else {
        throw new Error("Product not added");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Product not added",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleGeneratePdf = async () => {
    if (!qrRef.current) {
      toast({
        title: "Error",
        description: "QR Code not found.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const qrElements = qrRef.current.querySelectorAll("div"); // Select all QR code elements

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4", // Default A4 size
      });

      let x = 10; // Starting x position
      let y = 10; // Starting y position
      const maxX = 580; // Max x position before moving to next page
      const maxY = 800; // Max y position before moving to next page
      const padding = 10; // Space between QR codes

      for (const element of qrElements) {
        const canvas = await html2canvas(element);
        const qrImage = canvas.toDataURL("image/png");

        const width = 200;
        const height = 200;

        if (x + width > maxX) {
          x = 10; // Reset x position
          y += height + padding; // Move to next row
        }

        if (y + height > maxY) {
          pdf.addPage(); // Add new page if needed
          x = 10; // Reset x position
          y = 10; // Reset y position
        }

        pdf.addImage(qrImage, "PNG", x, y, width, height); // Add QR code image
        x += width + padding; // Update x position for next QR code
      }

      pdf.save(`product_${oldCounter}-qr-codes.pdf`);
      setLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 max-h-screen bg-cover bg-center text-center h-[100rem]">
      <div
        className={`transform transition-all duration-700 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="relative w-full">
              <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="text"
                placeholder="Enter Product Name"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative w-full">
              <FiInfo className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                placeholder="Enter Product Details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                placeholder="Enter Product Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <FiFlag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                placeholder="Enter Product Country of Origin"
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <FiTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                placeholder="Enter Product Manufacturer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="number"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                placeholder="Enter Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <FiLayers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="number"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                placeholder="Enter Product Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                placeholder="Enter Importer Address"
                value={importerAddr}
                onChange={(e) => setImporterAddr(e.target.value)}
              />
            </div>
            <div className="relative w-full md:col-span-2">
              <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
                placeholder="Enter Customs Address"
                value={customsAddr}
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={singleProductEntry}
              className="flex items-center justify-center w-full max-w-xs py-2 px-8 rounded-md font-normal bg-[#0070f3] text-white shadow-[0_4px_14px_0_rgb(0,118,255,39%)] transition duration-200 ease-linear hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)]"
            >
              {loading ? "Processing..." : "Add Product to Ledger"}
            </button>
          </div>
        </div>
        <div>
          {showQr && (
            <div className="flex flex-col items-center mt-8">
              <div ref={qrRef} className="grid grid-cols-5 gap-4">
                {Array.from({ length: quantity }, (_, index) => (
                  <div key={index} className="mb-4">
                    <QRCode
                      value={`URL: https://localhost:5173/check-product/${
                        oldCounter + index
                      }`}
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
                ))}
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
      </div>
    </div>
  );
}

export default SingleProductEntry;
