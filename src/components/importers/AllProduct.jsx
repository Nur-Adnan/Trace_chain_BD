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
  keyframes,
} from "@chakra-ui/react";
import { etherContract } from "../../contants";
import useAuth from "../../hooks/userAuth";
import backgroundImage from "../../img/homeBG3.png";
import blinkingImage from "../../img/svg.png"; // Replace with your image path

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

function AllProduct() {
  const [deliveredProducts, setDeliveredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account } = useAuth();

  const fetchDeliveredProducts = async () => {
    try {
      const filter = etherContract.filters.ProductAccepted(null, null, account);
      const events = await etherContract.queryFilter(filter);

      const parsedEvents = await Promise.all(
        events.map(async (event) => {
          const dispatchId = event.args.dispatchId.toString();
          const productId = event.args.productId.toString();
          const acceptedBy = event.args.acceptedBy;
          const acceptedOn = event.args.acceptedOn.toNumber();
          const status = event.args.status;

          const _dispatchLen = await etherContract.getDispatchLength(
            dispatchId
          );

          for (let i = 0; i < _dispatchLen; i++) {
            const details = await etherContract.dispatches(dispatchId, i);
            const product = await etherContract.products(productId);
            const owner = await etherContract.productLifeCycles(productId);

            return {
              dispatchId,
              productId,
              acceptedBy,
              acceptedOn,
              status,
              ipfsDocHash: details.ipfsDocHash,
              quantity: details.quantity.toString(),
              boxId: product.boxId.toString(),
              name: product.name,
              description: product.description,
              category: product.category,
              countryOfOrigin: product.countryOfOrigin,
              manufacturer: product.manufacturer,
              price: product.price.toString(),
              importedDate: product.importedDate.toNumber(),
              importerAddr: product.importerAddr,
              customsAddr: product.customsAddr,
              owner: owner.owner,
            };
          }
        })
      );

      setDeliveredProducts(parsedEvents);
    } catch (error) {
      console.error("Error fetching delivered products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveredProducts();

    const handleProductAccepted = async (
      dispatchId,
      productId,
      acceptedBy,
      acceptedOn,
      status
    ) => {
      if (acceptedBy === account) {
        try {
          const _dispatchLen = await etherContract.getDispatchLength(
            dispatchId.toString()
          );

          for (let i = 0; i < _dispatchLen; i++) {
            const details = await etherContract.dispatches(
              dispatchId.toString(),
              i
            );
            const product = await etherContract.products(productId);
            const owner = await etherContract.productLifeCycles(productId);

            setDeliveredProducts((prev) => [
              ...prev,
              {
                dispatchId: dispatchId.toString(),
                productId: productId.toString(),
                acceptedBy,
                acceptedOn: acceptedOn.toNumber(),
                status: status.toNumber(),
                ipfsDocHash: details.ipfsDocHash,
                quantity: details.quantity.toString(),
                boxId: product.boxId.toString(),
                name: product.name,
                description: product.description,
                category: product.category,
                countryOfOrigin: product.countryOfOrigin,
                manufacturer: product.manufacturer,
                price: product.price.toString(),
                importedDate: product.importedDate.toNumber(),
                importerAddr: product.importerAddr,
                customsAddr: product.customsAddr,
                owner: owner.owner,
              },
            ]);
          }
        } catch (error) {
          console.error("Error handling ProductAccepted event:", error);
        }
      }
    };

    etherContract.on("ProductAccepted", handleProductAccepted);

    return () => {
      etherContract.off("ProductAccepted", handleProductAccepted);
    };
  }, [account]);

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
            animation={`${spinAround} 0.9s linear infinite`}
            position="relative"
            zIndex="0" // Ensures the spinner stays behind the image
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
          Accepted Products
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8 text-center">
        List of all the product accepted by you and their distribution status
      </p>
      {deliveredProducts.length > 0 ? (
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
                    Product ID
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Product Name
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Category
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Country of Origin
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Manufacturer
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Price
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Recipient
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Timestamp
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Quantity
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Distribution Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {deliveredProducts
                  .filter((product) => product.acceptedBy === account)
                  .map((product, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } hover:bg-blue-100 transition-colors duration-300`}
                    >
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.dispatchId}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.productId}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.name}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.category}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.countryOfOrigin}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.manufacturer}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.price}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        Self
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {new Date(product.acceptedOn * 1000).toLocaleString()}
                      </td>
                      <td className="p-4 text-left border-r border-gray-200">
                        {product.quantity}
                      </td>
                      <td className="p-4 text-center">
                        {product.owner !== account ? (
                          <button className="shadow-[0_4px_14px_0_rgb(34,197,94,39%)] hover:shadow-[0_6px_20px_rgba(34,197,94,23%)] hover:bg-[rgba(34,197,94,0.9)] w-20 h-8 bg-green-500 rounded-md text-white font-medium transition duration-200 ease-linear text-xs">
                            Send{" "}
                          </button>
                        ) : (
                          <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] w-20 h-8 bg-[#0070f3] rounded-md text-white font-medium transition duration-200 ease-linear text-xs">
                            In House{" "}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center mt-6 text-gray-500 tracking-wider">
          No products delivered yet.
        </p>
      )}
    </div>
  );
}

export default AllProduct;
