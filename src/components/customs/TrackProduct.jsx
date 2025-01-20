import React, { useState } from "react";
import { Box, Center, Divider, Text, useToast } from "@chakra-ui/react";
import { etherContract } from "../../contants";
import backgroundImage from "../../img/homeBG3.png";
import ProductDetails from "../../pages/ProductDetails";
import useAuth from "../../hooks/userAuth";
import { AiOutlineBarcode } from "react-icons/ai";

function TrackProduct() {
  const [pId, setPid] = useState("");
  const [trackingInfo, setTrackingInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const { account } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const toast = useToast();

  const handleTrackBtn = async () => {
    if (!pId) {
      toast({
        title: "Warning",
        description: "Please enter a product ID",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setTrackingInfo([]); // Clear previous tracking info
    setShowDetails(false); // Reset showDetails

    try {
      const events = await etherContract.queryFilter("ProductDispatched");

      // Process events
      const trackingList = events
        .map((event) => {
          const { dispatchId, productId, from, to, dispatchedOn, quantity } =
            event.args || {};
          if (
            from === account &&
            productId.toString() === pId &&
            quantity > 0
          ) {
            return {
              dispatchId: dispatchId.toString(),
              productId: productId.toString(),
              from,
              to,
              timestamp: dispatchedOn.toNumber(),
              quantity: quantity.toString(),
            };
          }
          return null;
        })
        .filter((event) => event !== null); // Filter out null values

      setTrackingInfo(trackingList);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-bold md:text-5xl tracking-wide flex items-center justify-center">
          Track Product
        </h1>
      </div>
      <p className="text-lg mb-4 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8">
        Track the step-by-step dispatch history of a product
      </p>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-4 w-96 mt-5">
          <div className="relative w-full max-w-md">
            <AiOutlineBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
            <input
              type="number"
              className="pl-10 pr-4 py-2 w-full bg-white border-2 border-zinc-600 rounded-lg text-gray-700 transition duration-300 ease-in-out placeholder-gray-400"
              placeholder="Enter product ID to get details"
              value={pId}
              onChange={(e) => setPid(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleTrackBtn}
            className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out tracking-wider uppercase"
          >
            {loading ? "Tracking..." : "Track Product"}
          </button>
        </div>

        {showDetails && <ProductDetails pid={pId} role={"Customs"} />}
      </div>
    </div>
  );
}

export default TrackProduct;
