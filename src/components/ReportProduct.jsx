import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Spinner,
  Heading,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { FaExclamationTriangle } from "react-icons/fa";
import { create } from "ipfs-http-client";
import useAuth from "../hooks/userAuth";
import useWallet from "../hooks/userWallet";
import "./ReportProduct.css";

// IPFS client setup
const ipfs = create({ url: "http://127.0.0.1:5001/api/v0/add" });

function ReportProduct() {
  const [productId, setProductId] = useState("");
  const [role, setRole] = useState("");
  const [comment, setComment] = useState("");
  const [reportee, setReportee] = useState("");
  const [reporteeAddr, setReporteeAddr] = useState("");
  const [proof, setProof] = useState(null);
  const [ipfsProofHash, setIpfsProofHash] = useState("");
  const { account } = useAuth();
  const { traceChainBDContract, zeroGas } = useWallet();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const checkProductOwner = async () => {
    try {
      const product = await traceChainBDContract.productLifeCycles(productId);
      if (product.owner === account) {
        return true;
      } else {
        toast({
          title: "Error",
          description: "You are not the owner of the product",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error while fetching product owner",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    }
  };

  const uploadProofToIPFS = async (file) => {
    try {
      const addedFile = await ipfs.add(file);
      setIpfsProofHash(addedFile.cid.toString());
      toast({
        title: "Success",
        description: "Proof uploaded to IPFS successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error uploading proof to IPFS.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error uploading proof to IPFS:", error);
    }
  };

  const handleReport = async () => {
    if (
      !productId ||
      !role ||
      !comment ||
      !reportee ||
      !reporteeAddr ||
      !ipfsProofHash
    ) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    const isOwner = await checkProductOwner();
    if (!isOwner) return;

    try {
      if (proof) {
        const proofFile = await fetch(proof).then((r) => r.blob());
        await uploadProofToIPFS(proofFile);
      }

      const tx = await traceChainBDContract.reportProduct(
        productId,
        comment,
        reporteeAddr,
        ipfsProofHash,
        zeroGas
      );
      await tx.wait();

      toast({
        title: "Success",
        description: "Product reported successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      // Clear form fields after success
      setProductId("");
      setRole("");
      setComment("");
      setReportee("");
      setReporteeAddr("");
      setProof(null);
      setIpfsProofHash("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Error while reporting product",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error("Error while reporting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex justify-center">
      <div className="p-10 mt-10 w-full max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold md:text-5xl tracking-wide flex items-center justify-center relative overflow-hidden hProduct">
          Report Portal
        </h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Product ID and Reportee Address */}
          <div>
            <label className="block font-medium mb-1">Product ID</label>
            <input
              type="number"
              className="p-2 border border-gray-300 w-full rounded-lg shadow-sm"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Reportee Address</label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
              placeholder="Enter Reportee Address"
              value={reporteeAddr}
              onChange={(e) => setReporteeAddr(e.target.value)}
            />
          </div>

          {/* Your Role and Against Role */}
          <div>
            <label className="block font-medium mb-1">Your Role</label>
            <select
              className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
              placeholder="Select your role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Importer">Importer</option>
              <option value="Distributor">Distributor</option>
              <option value="Retailer">Retailer</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Against Role</label>
            <select
              className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
              placeholder="Select the role you are reporting against"
              value={reportee}
              onChange={(e) => setReportee(e.target.value)}
            >
              <option value="Importer">Importer</option>
              <option value="Distributor">Distributor</option>
              <option value="Retailer">Retailer</option>
            </select>
          </div>

          {/* Your Comment */}
          <div className="col-span-1 md:col-span-2">
            <label className="block font-medium mb-1">Your Comment</label>
            <textarea
              className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
              placeholder="Enter your report details"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Proof (if Any) */}
          <div className="col-span-1 md:col-span-2">
            <label className="block font-medium mb-1">Proof (if Any)</label>
            <div className="flex items-center p-2 border border-gray-300 rounded-lg shadow-sm w-full bg-white hover:bg-gray-50 transition duration-300">
              <input
                type="file"
                className="w-full text-gray-600 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setProof(e.target.files[0])}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-5">
            <button
              onClick={handleReport}
              disabled={loading}
              className="w-36 px-6 py-2 bg-red-500 text-white border border-red-600 rounded-lg font-bold transform hover:-translate-y-1 hover:bg-red-600 transition duration-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <Icon as={FaExclamationTriangle} />
              )}
              <span>{loading ? "Reporting..." : "Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportProduct;
