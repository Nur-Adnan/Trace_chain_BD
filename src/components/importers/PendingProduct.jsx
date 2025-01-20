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
  Spinner,
  Center,
  Image,
  useToast,
  keyframes,
} from "@chakra-ui/react";
import { etherContract } from "../../contants";
import useAuth from "../../hooks/userAuth";
import useWallet from "../../hooks/userWallet";
import backgroundImage from "../../img/homeBG3.png";
import blinkingImage from "../../img/svg.png"; // Replace with your image path
import { ProductStatus } from "../../utils/ProductStatus";
import { ethers } from "ethers";

// Define the blinking animation
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

function PendingProduct() {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const { account } = useAuth();
  const { signer, traceChainBDContract, zeroGas } = useWallet();
  const toast = useToast();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const events = await etherContract.queryFilter(
          "MultiProductDispatched"
        );
        const dispatchesList = events.map((event) => {
          const { dispatchId, startId, endId, to, dispatchedOn, quantity } =
            event.args;
          return {
            dispatchId: Number(dispatchId.toString()),
            startId: Number(startId.toString()),
            endId: Number(endId.toString()),
            receiver: to,
            quantity: Number(quantity.toString()),
            timestamp: dispatchedOn.toNumber(),
          };
        });

        const validDispatches = [];

        for (const dispatch of dispatchesList) {
          const confirmed1st = await etherContract.productLifeCycles(
            ethers.BigNumber.from(dispatch.startId)
          );
          const confirmedLast = await etherContract.productLifeCycles(
            ethers.BigNumber.from(dispatch.endId)
          );

          if (
            Number(confirmed1st.importerDispatchId.toString()) === 0 &&
            Number(confirmedLast.importerDispatchId.toString()) === 0 &&
            confirmed1st.owner === account &&
            confirmed1st.status != ProductStatus.AcceptedByImporter
          ) {
            validDispatches.push(dispatch);
          }
        }

        setDispatches(validDispatches);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history data:", error);
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [loading]);

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
        setDispatches(
          dispatches.filter((dispatch) => dispatch.dispatchId !== _dispatchId)
        );
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
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8 text-center">
        List of products send by customs and pending for your acceptance{" "}
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
