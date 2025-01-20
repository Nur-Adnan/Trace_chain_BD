import React, { useState } from "react";
import { Box, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiHome,
  FiCompass,
  FiStar,
  FiSettings,
  FiBox,
} from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { AiOutlineProduct } from "react-icons/ai";
import {
  MdOutlineShoppingCart,
  MdHistory,
  MdReportGmailerrorred,
} from "react-icons/md";
import { BsShop } from "react-icons/bs";
import { TbReport } from "react-icons/tb";
import useAuth from "../../hooks/userAuth";
import { isDistributor } from "../../components/utils/RoleCheck";

// Import your components
import TrackProduct from "../../components/distributors/TrackProduct";
import DistributorDashboard from "../../components/distributors/DistributorDashboard";
import AllRetailerList from "../../components/distributors/AllRetailerList";
import DispatchToRetailer from "../../components/distributors/DispatchToRetailer";
import PendingProduct from "../../components/distributors/PendingProduct";
import DistributorDispatchHistory from "../../components/distributors/DistributorDispatchHistory";
import ReportProduct from "../../components/ReportProduct";
import AllProduct from "../../components/distributors/AllProduct";
import Welcome from "../../components/Welcome";
import ReportHistory from "../../components/ReportHistory";
import { Link } from "react-router-dom";
import { FaCertificate } from "react-icons/fa";

const SidebarContent = ({ setActiveComponent, activeComponent }) => {
  const [activeLink, setActiveLink] = useState("Distributor Dashboard");
  const linkItems = [
    {
      name: "Distributor Dashboard",
      component: "welcome",
      icon: LuLayoutDashboard,
    },
    { name: "Pending Product", component: "pending-product", icon: FiBox },
    { name: "All Product", component: "all-product", icon: AiOutlineProduct },
    { name: "Manager Retailers", component: "retailer-list", icon: BsShop },
    {
      name: "Dispatch Product",
      component: "dispatch-to-retailer",
      icon: MdOutlineShoppingCart,
    },
    {
      name: "Dispatch History",
      component: "dispatch-history",
      icon: MdHistory,
    },
    {
      name: "Track Product",
      component: "track-product",
      icon: LiaSearchLocationSolid,
    },
    {
      name: "Report Product",
      component: "report-product",
      icon: MdReportGmailerrorred,
    },
    { name: "Report History", component: "report-history", icon: TbReport },
  ];

  return (
    <div className="flex items-start justify-start h-screen ml-6 mt-6">
      <div className="flex items-center">
        <div className="flex flex-col items-start mb-5">
          {/* User Avatar and Information */}
          <div className="flex items-center space-x-4 p-2 mb-5">
            <img
              className="h-12 rounded-full"
              src="https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"
              alt="Taxpayer"
            />
            <div>
              <h4 className="font-semibold text-lg text-gray-700 capitalize font-poppins tracking-wide">
                {/* {information.taxPayersName} */}
              </h4>
              <span className="text-sm tracking-wide flex items-center space-x-1">
                <FaCertificate className="h-4 text-green-500" />
                <span className="text-gray-600">Verified</span>
              </span>
            </div>
          </div>
          <div className="space-y-2 text-base">
            {linkItems.map((link) => (
              <div
                key={link.name}
                onClick={() => {
                  setActiveComponent(link.component);
                  setActiveLink(link.name);
                }}
                className={`flex items-center space-x-3 p-2 px-3 pr-4 rounded-md font-medium cursor-pointer transition-all duration-300 ${
                  activeLink === link.name
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
              >
                <Icon
                  as={link.icon}
                  className="h-5 w-5 transition-transform duration-300"
                />
                <span>{link.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, children, onClick, isActive }) => {
  return (
    <Link
      to="#"
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 mt-2 rounded-lg cursor-pointer shadow-md transition-all duration-300 ease-out
    bg-white text-gray-700 hover:bg-blue-600 hover:text-white hover:shadow-lg transform hover:-translate-y-1"
    >
      {icon && (
        <Icon
          as={icon}
          className={`text-2xl ${
            isActive ? "text-white" : "text-blue-600"
          } transition-colors duration-300 ease-out`}
        />
      )}
      <span className="ml-2 font-semibold text-lg">{children}</span>
    </Link>
  );
};

function DistributorPanel() {
  const [activeComponent, setActiveComponent] = useState("welcome");
  const { account, isConnected } = useAuth();

  const renderComponent = () => {
    switch (activeComponent) {
      case "welcome":
        return <Welcome />;
      case "all-product":
        return <AllProduct />;
      case "pending-product":
        return <PendingProduct />;
      case "retailer-list":
        return <AllRetailerList />;
      case "dispatch-to-retailer":
        return <DispatchToRetailer />;
      case "dispatch-history":
        return <DistributorDispatchHistory />;
      case "track-product":
        return <TrackProduct />;
      case "report-product":
        return <ReportProduct />;
      case "report-history":
        return <ReportHistory />;
      default:
        return <DistributorDashboard setActiveComponent={setActiveComponent} />;
    }
  };

  // if (account == null && !isConnected) {
  //     return (
  //         <div className='flex flex-col justify-center items-center h-[90vh]'>
  //             <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
  //             <br />
  //             <p className='text-red-400'>Please Login</p>
  //             <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
  //                 Go back
  //             </button>
  //         </div>
  //     );
  // }

  // if (account !== '' && isConnected && !isDistributor(account)) {
  //     return (
  //         <div className='flex flex-col justify-center items-center h-[90vh]'>
  //             <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
  //             <br />
  //             <p className='text-red-400'>You are not a distributor</p>
  //             <p className='text-red-400'>Please apply for registration</p>
  //             <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
  //                 Go back
  //             </button>
  //         </div>
  //     );
  // }

  return (
    <div className="flex justify-center mt-16 border-gray-600 shadow-xl h-[100rem]">
      <div className="flex w-[98%] shadow-lg rounded-md overflow-hidden">
        {/* Sidebar taking 10% width */}
        <div className="w-[16%] text-white bg-white">
          <SidebarContent
            setActiveComponent={setActiveComponent}
            activeComponent={activeComponent}
          />
        </div>
        {/* Main content taking 40% width */}
        <div className="w-full items-center justify-center ">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default DistributorPanel;
