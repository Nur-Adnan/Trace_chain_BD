import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  useToast,
  Spinner,
  FormControl,
  FormLabel,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import useWallet from "../../hooks/userWallet";
import backgroundImage from "../../img/homeBG3.png"; // Adjust the path if necessary
import { AiOutlineBarcode, AiOutlineDollarCircle } from "react-icons/ai";

function UpdateProductPrice() {
  const { traceChainBDContract, zeroGas } = useWallet();
  const [boxId, setBoxId] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for the button

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  const handleUpdateProduct = async () => {
    setIsLoading(true);
    try {
      const tx =
        await traceChainBDContract.updateMultipleProductPriceByImporter(
          boxId,
          price,
          zeroGas
        );
      await tx.wait();

      toast({
        title: "Price updated.",
        description: `Box ID ${boxId} price updated successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setBoxId("");
      setPrice("");
    } catch (error) {
      console.error("Error updating product price:", error);
      toast({
        title: "Error occurred.",
        description: "Failed to update the product price.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-64 max-h-screen bg-cover bg-center text-center h-[100rem]">
      <div
        className={`transform transition-all duration-700 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h1 className="mb-4 text-4xl font-bold md:text-6xl tracking-wide flex items-center justify-center">
          Update Product Price by Importer
        </h1>

        <div className="flex flex-row items-center space-x-10 p-6">
          {/* Product ID Input */}
          <div className="relative w-full max-w-md">
            <AiOutlineBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              type="number"
              placeholder="Enter Box ID"
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              value={boxId}
              onChange={(e) => setBoxId(e.target.value)}
              required
            />
          </div>
          <div className="relative w-full max-w-md">
            <AiOutlineDollarCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              type="number"
              placeholder="Enter Updated Price"
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out tracking-wider uppercase"
          onClick={handleUpdateProduct}
          disabled={loading}
        >
          {loading ? (
            <div className="loader"></div> // Add your spinner animation here
          ) : (
            "Print Slip & Sell"
          )}
        </button>
      </div>
    </div>
  );
}

export default UpdateProductPrice;
