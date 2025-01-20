import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  IconButton,
  Spinner,
  Center,
  Image,
  useToast,
  keyframes,
} from "@chakra-ui/react";
import { etherContract } from "../../contants";
import useAuth from "../../hooks/userAuth";
import { ethers } from "ethers";
import useWallet from "../../hooks/userWallet";
import { ProductStatus } from "../../utils/ProductStatus";
import backgroundImage from "../../img/homeBG5.png";
import blinkingImage from "../../img/svg.png"; // Ensure this is the correct path for your image

// Define the blinking animation for the image
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

function PendingProduct() {
  const [dispatches, setDispatches] = useState([
    {
      dispatchId: "D123",
      startId: 1,
      endId: 5,
      from: "0x123",
      to: "0x456",
      timestamp: 1696112130,
      quantity: "50",
      type: "Multi",
    },
    {
      dispatchId: "D124",
      startId: 6,
      endId: 10,
      from: "0x123",
      to: "0x456",
      timestamp: 1696112130,
      quantity: "30",
      type: "Multi",
    },
    {
      dispatchId: "D125",
      startId: 11,
      endId: "N/A",
      from: "0x123",
      to: "0x456",
      timestamp: 1696112130,
      quantity: "20",
      type: "Single",
    },
  ]); // Dummy data for testing
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const { account } = useAuth();
  const { traceChainBDContract, zeroGas } = useWallet();
  const toast = useToast();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        // Uncomment the below code to fetch actual data
        /*
        const multiProductEvents = await etherContract.queryFilter(
          "MultiProductDispatched"
        );
        const singleProductEvents = await etherContract.queryFilter(
          "ProductDispatched"
        );

        const multiProductDispatches = multiProductEvents.map((event) => {
          const {
            dispatchId,
            dispatchedOn,
            endId,
            quantity,
            from,
            startId,
            to,
          } = event.args;

          return {
            dispatchId: dispatchId.toString(),
            startId: Number(startId.toString()),
            endId: Number(endId.toString()),
            from: from,
            to: to,
            timestamp: Number(dispatchedOn.toString()),
            quantity: quantity.toString(),
            type: "Multi",
          };
        });

        const singleProductDispatches = singleProductEvents.map((event) => {
          const { dispatchId, dispatchedOn, productId, quantity, from, to } =
            event.args;

          return {
            dispatchId: dispatchId.toString(),
            startId: Number(productId.toString()),
            endId: "N/A",
            from: from,
            to: to,
            timestamp: Number(dispatchedOn.toString()),
            quantity: quantity.toString(),
            type: "Single",
          };
        });

        const allDispatches = [
          ...multiProductDispatches,
          ...singleProductDispatches,
        ];
        console.log(allDispatches);

        const filteredDispatches = await Promise.all(
          allDispatches
            .filter(
              (dispatch) => dispatch.to.toLowerCase() === account.toLowerCase()
            )
            .map(async (dispatch) => {
              const checkOwner = await etherContract.productLifeCycles(
                dispatch.startId
              );
              console.log(Number(checkOwner.status));

              // Check the conditions and return the dispatch or null
              return checkOwner.status === ProductStatus.Dispatched &&
                checkOwner.owner === account
                ? dispatch
                : null;
            })
        );

        // Filter out any null values (those that didn't meet the status condition)
        const validDispatches = filteredDispatches.filter(
          (dispatch) => dispatch !== null
        );

        console.log(validDispatches);
        setDispatches(validDispatches);
        */
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [account]);

  const handleAccept = async (_dispatchId) => {
    setLoadingStates((prev) => ({ ...prev, [_dispatchId]: true }));

    try {
      const tx = await traceChainBDContract.confirmDelivery(_dispatchId, {
        gasLimit: 3000000,
        ...zeroGas,
      });
      const response = await tx.wait();

      if (response) {
        toast({
          title: "Dispatch accepted successfully",
          description: `Dispatch ${_dispatchId} accepted successfully`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Not Accepted",
          description: `Something went wrong`,
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error accepting dispatch:", error);
      toast({
        title: "Error accepting dispatch",
        description: `Something went wrong`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [_dispatchId]: false }));
    }
  };

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

          {/* Spinner surrounding the image */}
          <Spinner
            width="60px"
            height="60px"
            color="#5160be"
            position="relative"
            zIndex="0"
          />

          <Text mt={4} fontSize="xl" fontWeight="bold">
            Please wait while we load the pending products. This won't take
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
          Pending Products
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8">
        List of all pending products to accept
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
                    Dispatch ID
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Start ID
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    End ID
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Receiver
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Timestamp
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Quantity
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {dispatches.map((dispatch, index) => (
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
                      {dispatch.endId}
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
                    <td className="p-4 text-center">
                      <button
                        className="shadow-[0_4px_14px_0_rgb(34,197,94,39%)] hover:shadow-[0_6px_20px_rgba(34,197,94,23%)] hover:bg-[rgba(34,197,94,0.9)] w-20 h-8 bg-green-500 rounded-md text-white font-medium transition duration-200 ease-linear text-xs"
                        disabled={loadingStates[dispatch.dispatchId]}
                        onClick={() => handleAccept(dispatch.dispatchId)}
                      >
                        {loadingStates[dispatch.dispatchId] ? (
                          <span className="loader"></span> // Include a loading indicator if desired
                        ) : (
                          "Accept"
                        )}
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
          No pending products.
        </p>
      )}
    </div>
  );
}

export default PendingProduct;
