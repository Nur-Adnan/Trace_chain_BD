import React, { useState } from "react";
import { Box, Button, Heading, VStack, Icon, Text } from "@chakra-ui/react";
import { FiPackage, FiLayers } from "react-icons/fi";
import SingleProductDispatch from "../importers/SingleProductDispatch";
import MultipleProductDispatch from "../importers/MultipleProductDispatch";

function DispatchToRetailer() {
  // Set the default selectedOption to 'single'
  const [selectedOption, setSelectedOption] = useState("single");

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-bold md:text-5xl tracking-wide flex items-center justify-center">
          Distributor to Retailer Dispatch{" "}
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8 font-medium">
        Please choose your option:{" "}
      </p>
      <div className="flex flex-col items-center space-y-4">
        <button
          className={`font-normal flex items-center justify-center w-full max-w-xs py-2 px-8 rounded-md transition duration-200 ease-linear shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] ${
            selectedOption === "single"
              ? "bg-[#0070f3] text-white hover:bg-[rgba(0,118,255,0.9)]"
              : "bg-white border border-gray-300 text-gray-700"
          }`}
          onClick={() => setSelectedOption("single")}
        >
          <FiPackage className="mr-2 text-lg" />
          Single Product Dispatch
        </button>
        <button
          className={`font-normal flex items-center justify-center w-full max-w-xs py-2 px-8 rounded-md transition duration-200 ease-linear shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] ${
            selectedOption === "multiple"
              ? "bg-[#0070f3] text-white hover:bg-[rgba(0,118,255,0.9)]"
              : "bg-white border border-gray-300 text-gray-700"
          }`}
          onClick={() => setSelectedOption("multiple")}
        >
          <FiLayers className="mr-2 text-lg" />
          Multiple Product Dispatch
        </button>
      </div>

      <div className="w-full mt-8">
        {selectedOption === "single" && <SingleProductDispatch />}
        {selectedOption === "multiple" && <MultipleProductDispatch />}
      </div>
    </div>
  );
}

export default DispatchToRetailer;
