import React, { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Roles from "../pages/Roles";
import Error404 from "../pages/Error404";
import AvatarButton from "./AvatarButton";
import AdminPanel from "../pages/admin/AdminPanel";
import { adminAddr } from "../contants";
import CustomsPanel from "../pages/customs/CustomsPanel";
import DistributorPanel from "../pages/distributor/DistributorPanel";
import RetailerPanel from "../pages/retailer/RetailerPanel";
import RegApplication from "../pages/RegApplication";
import ImporterPanel from "../pages/importer/ImporterPanel";
import { IoQrCodeOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa"; // Import the icon
import {
  isAdmin,
  isCustoms,
  isImporter,
  isDistributor,
  isRetailer,
} from "./utils/RoleCheck";
import Profile from "../pages/Profile";
import useAuth from "../hooks/userAuth";
import { useActiveAccount } from "thirdweb/react";
import QRScan from "./QRScan";
import ProductDetails from "../pages/ProductDetails";
import Android from "../pages/mobile/Android";
import Logo from "../assets/tracechain_bd.png";
import { GlobeDemo } from "../GlobeDemo";

function Navbar() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { isConnected, account } = useAuth();
  const activeAccount = useActiveAccount();
  const [activeComponent, setActiveComponent] = useState("dashboard");

  useEffect(() => {
    // const checkRole = async () => {
    //   if (isConnected && account !== "") {
    //     let userRole = "";
    //     if (await isAdmin(account)) {
    //       userRole = "admin";
    //     } else if (await isCustoms(account)) {
    //       userRole = "customs";
    //     } else if (await isImporter(account)) {
    //       userRole = "importer";
    //     } else if (await isDistributor(account)) {
    //       userRole = "distributor";
    //     } else if (await isRetailer(account)) {
    //       userRole = "retailer";
    //     }
    //     setRole(userRole);
    //     // navigate("/dashboard");
    //   }
    // };
    // checkRole();
  }, [account]);

  useEffect(() => {
    const checkRole = async () => {
      if (activeAccount?.address) {
        let userRole = "";
        if (await isAdmin(activeAccount?.address)) {
          userRole = "admin";
        }
        setRole(userRole);
      }
    };

    checkRole();
  }, [activeAccount?.address]);

  console.log(account);
  console.log(activeAccount?.address);
  console.log(role);

  return (
    <>
      <nav className="bg-[#f1f2f7] sticky top-0 z-10 px-2 lg:px-0 shadow-lg">
        <div className="mx-auto flex justify-between items-center py-2 lg:pl-16 lg:pr-16">
          <h1 className="text-2xl font-bold text-red-500">
            {role !== "" ? (
              <Link to="/home">
                <img
                  src={Logo}
                  alt="Logo"
                  className="hover:cursor-pointer h-16 w-42"
                />
              </Link>
            ) : (
              <Link to="/home">
                <img
                  src={Logo}
                  alt="Logo"
                  className="hover:cursor-pointer h-16 w-42"
                />
              </Link>
            )}
          </h1>
          <div>
            <ul className="flex items-center gap-x-4 font-semibold">
              {role !== "" ? (
                <>
                  {/* <li>
                <Link to="/dashboard" className="text-black font-semibold">
                  Dashboard
                </Link>
              </li> */}
                  <li className="hidden lg:block">
                    <Link to="/qrscan" className="text-black font-semibold">
                      <div className="flex justify-center items-center border border-black rounded-lg px-4 py-1">
                        <p className="mr-2">Scan QR</p>
                        <IoQrCodeOutline />
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                role !== "admin" &&
                role !== "customs" && (
                  <li>
                    <Link
                      to="/apply"
                      className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-blue-500 px-4 font-medium text-black-800 transition-colors hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                    >
                      Apply Today
                      <FaArrowRight className="ml-2" />{" "}
                      {/* Icon with margin for spacing */}
                    </Link>
                  </li>
                )
              )}
              <li>
                <AvatarButton setRole={setRole} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Roles />} />

        {/* Common routes accessible to all users */}
        <Route path="/android" element={<Android />} />
        <Route path="/qrscan" element={<QRScan />} />
        <Route path="/home" element={<Roles />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/apply" element={<RegApplication />} />
        <Route path="/check-product/:id" element={<ProductDetails />} />
        <Route path="/*" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />

        {/* Previously role-restricted routes now accessible to all users */}
        <Route path="/admin" element={<AdminPanel fromNav={true} />} />
        <Route
          path="/customs"
          element={
            <CustomsPanel
              setActiveComponent={setActiveComponent}
              activeComponent={activeComponent}
            />
          }
        />
        <Route path="/importer" element={<ImporterPanel />} />
        <Route path="/distributor" element={<DistributorPanel />} />
        <Route path="/retailer" element={<RetailerPanel />} />
      </Routes>
    </>
  );
}

export default Navbar;
{
  /* <Routes>
<Route path="/" element={<Roles />} />

{/* common routes */
}
{
  /* <Route path="/android" element={<Android />} />
<Route path="/qrscan" element={<QRScan />} />
<Route path="/home" element={<Roles />} />
<Route path="/profile" element={<Profile />} />
<Route path="/apply" element={<RegApplication />} />
<Route path="/check-product/:id" element={<ProductDetails />} />
<Route path="/*" element={<Error404 />} />
<Route path="*" element={<Error404 />} />

{role === "admin" && (
  <Route path="/admin" element={<AdminPanel fromNav={true} />} />
)}
{role === "customs" && (
  <Route
    path="/customs"
    element={
      <CustomsPanel
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
      />
    }
  />
)}
{role === "importer" && (
  <Route path="/importer" element={<ImporterPanel />} />
)}
{role === "distributor" && (
  <Route path="/distributor" element={<DistributorPanel />} />
)}
{role === "retailer" && (
  <Route path="/retailer" element={<RetailerPanel />} />
)}
</Routes> */
}
