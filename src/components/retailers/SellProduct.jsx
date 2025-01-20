import React, { useState, useRef, useEffect } from "react";
import { Box, Text, useToast, Spinner, Icon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import useWallet from "../../hooks/userWallet";
import { AiOutlineBarcode, AiOutlineDollarCircle } from "react-icons/ai";

function SellProduct() {
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for the button
  const { traceChainBDContract, zeroGas } = useWallet();
  const [productDetails, setProductDetails] = useState(null);
  const toast = useToast();
  const sellAddr = "0x0000000000000000000000000000000000000000"; // burn address

  const printRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  const getProductDetails = async (productId) => {
    try {
      const productDetails = await traceChainBDContract.products(productId);
      setProductDetails(productDetails);
      return productDetails;
    } catch (error) {
      console.error("Error getting product details:", error);
      return null;
    }
  };

  const handleSellProduct = async () => {
    if (productId === "" || price === "") {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true); // Start loading
      const details = await getProductDetails(productId);
      if (!details) {
        throw new Error("Failed to fetch product details");
      }

      const tx = await traceChainBDContract.dispatch(
        productId,
        productId,
        sellAddr,
        price,
        zeroGas
      );
      await tx.wait();

      toast({
        title: "Success",
        description: "Product sold successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        icon: <CheckCircleIcon />,
      });
      setProductId("");
      setPrice("");

      // Automatically print after successful transaction
      handlePrint();
    } catch (error) {
      console.error("Error selling product:", error);
      toast({
        title: "Error",
        description: "An error occurred while selling the product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // To reload the page after printing
  };

  return (
    <div className="flex flex-col items-center mt-64 max-h-screen bg-cover bg-center text-center h-[100rem]">
      <div
        className={`transform transition-all duration-700 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h1 className="mb-4 text-4xl font-bold md:text-6xl tracking-wide flex items-center justify-center">
          Sell Product by Retailer
        </h1>

        <div className="flex flex-row items-center space-x-10 p-6">
          {/* Product ID Input */}
          <div className="relative w-full max-w-md">
            <AiOutlineBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              type="number"
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <div className="relative w-full max-w-md">
            <AiOutlineDollarCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              type="number"
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <button
          className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out tracking-wider uppercase"
          onClick={handleSellProduct}
          disabled={loading}
        >
          {loading ? (
            <div className="loader"></div> // Add your spinner animation here
          ) : (
            "Print Slip & Sell"
          )}
        </button>
      </div>

      {/* Section to print */}
      <div
        ref={printRef}
        className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8 font-inter tracking-wider uppercase w-[50rem] hidden"
      >
        <h1 className="font-bold text-2xl my-4 text-center text-blue-600 tracking-wider">
          Product Sale Slip
        </h1>
        <hr className="mb-2" />
        <div className="flex justify-between mb-6">
          <h1 className="text-lg font-semibold">Imported</h1>
          <div className="text-gray-700">
            <div>
              Date:
              <span className="ml-2">
                {new Date(
                  (productDetails?.importedDate ||
                    new Date("2023-09-15").getTime() / 1000) * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Product ID:</h1>
            <p>- {productId || "12345"}</p>
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Price:</h1>
            <p>- {price || "500"}</p> {/* Default Price */}
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Box ID:</h1>
            <p>- {productDetails?.boxId?.toString() || "BX-001"}</p>
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Name:</h1>
            <p>- {productDetails?.name || "Sample Product"}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-lg font-semibold">Description:</h1>
            <p className="text-right max-w-xs ml-4">
              {productDetails?.description || "A high-quality sample product"}
            </p>
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Category:</h1>
            <p>{productDetails?.category || "Electronics"}</p>
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Country of Origin:</h1>
            <p>{productDetails?.countryOfOrigin || "USA"}</p>
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Manufacturer:</h1>
            <p>{productDetails?.manufacturer || "TechCorp"}</p>
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Quantity:</h1>
            <p>{productDetails?.quantity?.toString() || "100"}</p>
          </div>

          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Billing Date:</h1>
            <p>{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellProduct;
