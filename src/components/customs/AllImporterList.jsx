import React, { useState, useEffect } from "react";
import { Text, Spinner, Image, keyframes } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import blinkingImage from "../../img/svg.png"; // Replace with your image path
import { etherContract } from "../../contants";

// Define the vanish animation
const vanishAnimation = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.9);
  }
`;

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

function AllImporterList() {
  const [importers, setImporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImporter, setSelectedImporter] = useState(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isCrossed, setIsCrossed] = useState(false);

  const fetchData = async () => {
    try {
      const allImporters = await etherContract.getOthersParty();
      const importerDetailsPromises = allImporters.map((importer) =>
        etherContract.rolesData(importer)
      );
      const importerDetails = await Promise.all(importerDetailsPromises);
      setImporters(importerDetails);
    } catch (error) {
      console.error("Error fetching importers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMoreDetailsBtn = (importer) => {
    setSelectedImporter(importer);
    setIsHidden(false); // Ensure the details box is shown
    setIsCrossed(false); // Reset the cross state
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          All Importer List
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8">
        List of all the importers whom you can send products
      </p>
      {importers.length > 0 ? (
        <div className="container w-full mx-auto px-2">
          <div
            id="recipients"
            className="p-4 mt-6 lg:mt-0 rounded shadow bg-white"
          >
            <table className="w-full bg-white rounded-lg">
              <thead className="border-b border-gray-300 bg-gray-100 ">
                <tr className="text-black text-sm font-inter uppercase tracking-wider">
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    SL
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Name
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Address
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Country of Origin
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {importers
                  .filter((importer) => importer.role === "IMPORTER")
                  .map((importer, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } hover:bg-blue-100 transition-colors duration-300`}
                    >
                      <td className="p-4 text-left border-r border-gray-200">
                        {index + 1}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {importer.name}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {importer.address_registered.slice(0, 6) +
                          "..." +
                          importer.address_registered.slice(-4)}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {importer.countryOfOrigin}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] w-20 h-8 bg-[#0070f3] rounded-md text-white font-medium transition duration-200 ease-linear text-xs"
                          onClick={() => getMoreDetailsBtn(importer)}
                        >
                          More
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
          No importers found.
        </p>
      )}

      {selectedImporter && !isCrossed && (
        <div
          className={`bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8 font-inter tracking-wider uppercase overflow-hidden transition-all duration-700 ease-in-out ${
            isCrossed ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-2xl text-center text-blue-600 tracking-wider">
              Importer Details
            </h1>
            <button
              aria-label="Close"
              className="shadow-[0_4px_14px_0_rgb(239,68,68,39%)] hover:shadow-[0_6px_20px_rgba(239,68,68,23%)] hover:bg-[rgba(239,68,68,0.9)] w-10 h-10 bg-red-500 text-white font-medium transition duration-300 ease-linear rounded-full flex items-center justify-center"
              onClick={() => setIsCrossed(true)}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="space-y-4">
            <p className="mt-4">
              <strong>Name:</strong> {selectedImporter.name}
            </p>
            <p className="mt-4">
              <strong>Address:</strong> {selectedImporter.address_registered}
            </p>
            <p className="mt-4">
              <strong>Location:</strong> {selectedImporter.locAddress}
            </p>
            <p className="mt-4">
              <strong>Contract Number:</strong>{" "}
              {selectedImporter.contractNumber}
            </p>
            <p className="mt-4">
              <strong>Country of Origin:</strong>{" "}
              {selectedImporter.countryOfOrigin}
            </p>
            <p className="mt-4">
              <strong>TIN Number:</strong> {selectedImporter.tinNumber}
            </p>
            <p className="mt-4">
              <strong>VAT Registration Number:</strong>{" "}
              {selectedImporter.vatRegNumber}
            </p>
            <p className="mt-4">
              <strong>IPFS Document Hash:</strong>{" "}
              {selectedImporter.ipfsDocHash}
            </p>
            <p className="mt-4">
              <strong>Role:</strong> {selectedImporter.role}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllImporterList;
