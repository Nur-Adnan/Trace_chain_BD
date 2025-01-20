import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { etherContract } from "../../contants";
import useAuth from "../../hooks/userAuth";
import blinkingImage from "../../img/svg.png"; // Replace with your image path

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

function RetailerSoldHistory() {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account } = useAuth();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const singleProductEvents = await etherContract.queryFilter(
          "ProductDispatched"
        );

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

        setDispatches(singleProductDispatches);
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
          {/* Image in the center */}
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

          {/* Spinner surrounding the image */}
          <Spinner
            width="60px"
            height="60px"
            color="#5160be"
            animation={`${spinAround} 0.9s linear infinite`}
            position="relative"
            zIndex="0"
          />
          <Text mt={4} fontSize="xl" fontWeight="bold">
            Please wait while we load the selling history. This won't take long.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-bold md:text-5xl tracking-wide flex items-center justify-center">
          Retailer Selling History
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8">
        List of all the products you have sold.
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
                    Sell(Dispatch) ID
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Product ID
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    From
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
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {dispatches
                  .filter(
                    (dispatch) =>
                      dispatch.quantity > 0 &&
                      dispatch.from === account &&
                      dispatch.to ===
                        "0x0000000000000000000000000000000000000000"
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
                        Self
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
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center mt-6 text-gray-500 tracking-wider">
          No selling history available.
        </p>
      )}
    </div>
  );
}

export default RetailerSoldHistory;
