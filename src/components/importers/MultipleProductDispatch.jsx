import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { FiHash, FiMapPin, FiPackage, FiSend } from "react-icons/fi";
import useWallet from "../../hooks/userWallet";
import { AiOutlineBarcode } from "react-icons/ai";

function MultipleProductDispatch() {
  const { traceChainBDContract, zeroGas } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [startProductId, setStartProductId] = useState("");
  const [endProductId, setEndProductId] = useState("");
  const [distributorAddress, setDistributorAddress] = useState("");
  const [memoDocumentHash, setMemoDocumentHash] = useState("");
  const toast = useToast();

  const handleDispatch = async () => {
    try {
      setIsLoading(true);
      const tx = await traceChainBDContract.dispatch(
        startProductId,
        endProductId,
        distributorAddress,
        memoDocumentHash,
        zeroGas
      );
      const response = await tx.wait();
      if (response) {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Products dispatched successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setStartProductId("");
        setEndProductId("");
        setDistributorAddress("");
        setMemoDocumentHash("");
      } else {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "An error occurred while dispatching the products",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while dispatching the products",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-12 text-2xl font-bold md:text-4xl tracking-wider flex items-center justify-center">
          Multiple Product Dispatch
        </h1>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Product ID Input */}
          <div className="relative w-full">
            <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              placeholder="Enter Start Product ID"
              type="number"
              value={startProductId}
              onChange={(e) => setStartProductId(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              required
            />
          </div>
          <div className="relative w-full">
            <AiOutlineBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              placeholder="Enter End Product ID"
              type="number"
              value={endProductId}
              onChange={(e) => setEndProductId(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              required
            />
          </div>
          <div className="relative w-full">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              placeholder="Distributor Address"
              type="text"
              value={distributorAddress}
              onChange={(e) => setDistributorAddress(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              required
            />
          </div>
          {/* Memo Document Hash Input */}
          <div className="relative w-full">
            <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              placeholder="Memo Document Hash"
              type="text"
              value={memoDocumentHash}
              onChange={(e) => setMemoDocumentHash(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              required
            />
          </div>
        </div>
        <button
          onClick={handleDispatch}
          disabled={isLoading}
          className="flex items-center justify-center w-96 py-2 px-8 rounded-md font-normal bg-[#0070f3] text-white shadow-[0_4px_14px_0_rgb(0,118,255,39%)] transition duration-200 ease-linear hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)]"
        >
          {isLoading ? (
            <span className="loader mr-2"></span> // Add spinner animation if desired
          ) : (
            <FiSend className="mr-2" />
          )}
          {isLoading ? "Dispatching" : "Dispatch"}
        </button>
      </div>
    </div>
  );
}

export default MultipleProductDispatch;
