import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Heading,
  VStack,
  Icon,
  Link,
  useToast,
} from "@chakra-ui/react";
import { FiSend, FiSearch } from "react-icons/fi";
import useWallet from "../../hooks/userWallet";
import { FiPackage, FiMapPin, FiHash } from "react-icons/fi";



function SingleProductDispatch() {
  const { traceChainBDContract, zeroGas } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [distributorAddress, setDistributorAddress] = useState("");
  const [memoDocumentHash, setMemoDocumentHash] = useState("");
  const toast = useToast();

  const handleDispatch = async () => {
    try {
      setIsLoading(true);
      const tx = await traceChainBDContract.dispatch(
        productId,
        productId,
        distributorAddress,
        memoDocumentHash,
        zeroGas
      );
      const response = await tx.wait();
      if (response) {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Product dispatched successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setProductId("");
        setDistributorAddress("");
        setMemoDocumentHash("");
      } else {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "An error occurred while dispatching the product",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while dispatching the product",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-12 text-2xl font-bold md:text-4xl tracking-wider flex items-center justify-center">
          Single Product Dispatch
        </h1>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Product ID Input */}
          <div className="relative w-full">
            <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              placeholder="Enter Product ID"
              type="number"
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
          </div>

          {/* Distributor Address Input */}
          <div className="relative w-full">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              placeholder="Distributor Address"
              type="text"
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              value={distributorAddress}
              onChange={(e) => setDistributorAddress(e.target.value)}
              required
            />
          </div>

          {/* Memo Document Hash Input */}
          <div className="relative w-full md:col-span-2">
            <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              placeholder="Memo Document Hash"
              type="text"
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              value={memoDocumentHash}
              onChange={(e) => setMemoDocumentHash(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Dispatch Button */}
        <button
          onClick={handleDispatch}
          disabled={isLoading}
          className="flex items-center justify-center w-full max-w-xs py-2 px-8 rounded-md font-normal bg-[#0070f3] text-white shadow-[0_4px_14px_0_rgb(0,118,255,39%)] transition duration-200 ease-linear hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)]"
        >
          {isLoading ? (
            <span className="loader mr-2"></span> // Add spinner animation here if needed
          ) : (
            <FiSend className="mr-2" />
          )}
          {isLoading ? "Dispatching" : "Dispatch"}
        </button>
      </div>
    </div>
  );
}

export default SingleProductDispatch;
