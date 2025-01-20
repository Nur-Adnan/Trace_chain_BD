import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Heading,
  Icon,
  Center,
  Text,
  Image,
  keyframes,
  Divider,
} from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";
import useAuth from "../hooks/userAuth";
import { etherContract } from "../contants";
import backgroundImage from "../img/homeBG3.png"; // Import the background image
import blinkingImage from "../img/svg.png"; // Replace with your image path

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

function ReportHistory() {
  const { account } = useAuth();
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesData, setRolesData] = useState([]);

  const fetchRolesData = async () => {
    try {
      const response = await fetch(
        "https://tracechainbd-backend.onrender.com/api/roles"
      );
      const data = await response.json();
      setRolesData(data);
    } catch (error) {
      console.error("Error fetching roles data:", error);
    }
  };

  const getRoleData = (address) => {
    try {
      const role = rolesData.find(
        (role) => role.address_registered === address
      );
      return role ? `${role.name} (${role.role})` : "Unknown Role";
    } catch (error) {
      console.error("Error getting role data:", error);
      return "Error Fetching Role";
    }
  };

  const fetchHistoryData = async () => {
    try {
      const events = await etherContract.queryFilter("ReportForProduct");
      const list = events.map((event) => {
        const { productID, reportDesc, reportBy, reportFor, reportedOn } =
          event.args;
        return {
          productID: productID.toString(),
          reportDesc: reportDesc.toString(),
          reportBy: reportBy,
          reportFor: reportFor,
          timestamp: Number(reportedOn.toString()),
        };
      });

      const filteredList = list.filter((report) => report.reportBy === account);
      setReport(filteredList);
    } catch (error) {
      console.error("Error fetching history data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData();
    fetchHistoryData();
  }, [loading]);

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
            Please wait while we load the report history. This won't take long.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-bold md:text-5xl tracking-wide flex items-center justify-center">
          <FiAlertCircle className="mr-4 mt-2" />
          Report History
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider leading-8">
        List of reports created for products.
      </p>
      {report.length > 0 ? (
        <div className="container w-full mx-auto px-2">
          <div
            id="recipients"
            className="p-4 mt-6 lg:mt-0 rounded shadow bg-white"
          >
            <table className="w-full bg-white rounded-lg">
              <thead className="border-b border-gray-300 bg-gray-100 ">
                <tr className="text-black text-sm font-inter uppercase tracking-wider">
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    SL No
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Product ID
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Description
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Reported For
                  </th>
                  <th className="p-4 text-center border-r border-gray-200 text-gray-800 font-semibold">
                    Reported On
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {report.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } hover:bg-blue-100 transition-colors duration-300`}
                  >
                    <td className="p-4 text-left border-r border-gray-200">
                      {index + 1}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {item.productID}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {item.reportDesc}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {getRoleData(item.reportFor)}
                    </td>
                    <td className="p-4 text-left border-r border-gray-200">
                      {new Date(item.timestamp * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center mt-6 tracking-wider text-gray-500">
          No reports found.
        </p>
      )}
    </div>
  );
}

export default ReportHistory;
