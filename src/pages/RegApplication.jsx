import React, { useState } from "react";
import { create } from "ipfs-http-client";
import { useToast } from "@chakra-ui/react";
import useWallet from "../hooks/userWallet";
import useAuth from "../hooks/userAuth";
import { ethers } from "ethers";
import backgroundImage from "../img/homeBG2.png"; // Update this path accordingly

// IPFS client setup
const ipfs = create({ url: "http://127.0.0.1:5001/api/v0/add" });

function RegApplication() {
  const toast = useToast();
  const [compName, setCompName] = useState("");
  const [locAddress, setLocAddress] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [vatRegNumber, setVatRegNumber] = useState("");
  const [ipfsDocHash, setIpfsDocHash] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { account } = useAuth();
  const { traceChainBDContract } = useWallet();

  const [tin, setTin] = useState(null);
  const [tradeLic, setTradeLic] = useState(null);
  const [vat, setVat] = useState(null);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    }
  };

  async function uploadFilesAsDirectory(files) {
    try {
      if (account === "") {
        console.log("No active account found");
        return;
      }

      const directoryName = `doc-${account}`;
      const filesToAdd = files.map((file, index) => ({
        path: `${directoryName}/doc${index + 1}.jpg`,
        content: file,
      }));

      const addedFiles = [];
      for await (const result of ipfs.addAll(filesToAdd, {
        wrapWithDirectory: true,
      })) {
        addedFiles.push(result);
      }

      const directory = addedFiles[addedFiles.length - 1];
      if (directory.cid) {
        setIpfsDocHash(directory.cid.toString());
        toast({
          title: "Success",
          description: "Images uploaded to IPFS successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        console.log(directory.cid.toString());
        console.log(`http://127.0.0.1:8080/ipfs/${directory.cid}`);
      } else {
        toast({
          title: "Error",
          description: "Error uploading images to IPFS.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error uploading directory to IPFS:", error);
      return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!tin || !tradeLic || !vat) {
      toast({
        title: "Error",
        description: "Please upload all required documents.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const tinDoc = await fetch(tin).then((r) => r.blob());
    const tradeDoc = await fetch(tradeLic).then((r) => r.blob());
    const vatDoc = await fetch(vat).then((r) => r.blob());

    await uploadFilesAsDirectory([tinDoc, tradeDoc, vatDoc]);

    if (
      compName === "" ||
      locAddress === "" ||
      contractNumber === "" ||
      countryOfOrigin === "" ||
      tinNumber === "" ||
      vatRegNumber === "" ||
      ipfsDocHash === "" ||
      role === ""
    ) {
      toast({
        title: "Error",
        description: "Please fill all fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const txParams = {
        gasPrice: ethers.BigNumber.from(0),
      };

      const tx = await traceChainBDContract.regForRole(
        compName,
        locAddress,
        contractNumber,
        countryOfOrigin,
        tinNumber,
        vatRegNumber,
        ipfsDocHash,
        role,
        txParams
      );

      const transactionResult = await tx.wait();

      setCompName("");
      setLocAddress("");
      setContractNumber("");
      setCountryOfOrigin("");
      setTinNumber("");
      setVatRegNumber("");
      setIpfsDocHash("");
      setRole("");

      if (transactionResult !== undefined) {
        toast({
          title: "Success",
          description: "Registration application submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Error submitting registration application.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred during the submission.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  if (account === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-semibold">
          Please connect your wallet to continue
        </h1>
      </div>
    );
  }

  return (
    <div className="px-10 pt-5">
      <h1 className="font-semibold text-4xl text-center mt-10 mb-4">
        Registration Application
      </h1>
      <div className="flex justify-center">
        <div
          className="grid grid-cols-2 gap-8 w-full max-w-4xl mt-4 mb-20 p-8 bg-white rounded-xl shadow-lg"
          style={{
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.05)",
          }}
        >
          <label htmlFor="name" className="flex flex-col">
            <input
              type="text"
              placeholder="Enter name of company"
              className="border p-3 rounded-lg w-full"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
            />
          </label>
          <label htmlFor="location" className="flex flex-col">
            <input
              type="text"
              placeholder="Enter location/address of company"
              className="border p-3 rounded-lg w-full"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              value={locAddress}
              onChange={(e) => setLocAddress(e.target.value)}
            />
          </label>
          <label htmlFor="contact" className="flex flex-col">
            <input
              type="text"
              placeholder="Enter contact number of company"
              className="border p-3 rounded-lg w-full"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
            />
          </label>
          <label htmlFor="origin" className="flex flex-col">
            <input
              type="text"
              placeholder="Enter country Of Origin of the company"
              className="border p-3 rounded-lg w-full"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              value={countryOfOrigin}
              onChange={(e) => setCountryOfOrigin(e.target.value)}
            />
          </label>
          <label htmlFor="tinnumber" className="flex flex-col">
            <input
              type="text"
              placeholder="Enter TIN number of the company"
              className="border p-3 rounded-lg w-full"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              value={tinNumber}
              onChange={(e) => setTinNumber(e.target.value)}
            />
          </label>
          <label htmlFor="vatregnumber" className="flex flex-col">
            <input
              type="text"
              placeholder="Enter VAT Reg number of the company"
              className="border p-3 rounded-lg w-full"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              value={vatRegNumber}
              onChange={(e) => setVatRegNumber(e.target.value)}
            />
          </label>
          <label htmlFor="tin" className="flex flex-col">
            <p className="text-lg">Upload TIN Certificate</p>
            <input
              type="file"
              className="border p-3 rounded-lg w-full bg-white"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              onChange={(e) => handleFileChange(e, setTin)}
            />
          </label>
          <label htmlFor="vat" className="flex flex-col">
            <p className="text-lg">Upload Trade License</p>
            <input
              type="file"
              className="border p-3 rounded-lg w-full bg-white"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              onChange={(e) => handleFileChange(e, setTradeLic)}
            />
          </label>
          <label htmlFor="tradelic" className="flex flex-col">
            <p className="text-lg">Upload VAT Registration Certificate</p>
            <input
              type="file"
              className="border p-3 rounded-lg w-full bg-white"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              onChange={(e) => handleFileChange(e, setVat)}
            />
          </label>
          <label htmlFor="role" className="flex flex-col col-span-2">
            <select
              name="role"
              id="role"
              className="border p-3 rounded-lg w-full"
              style={{ borderColor: "#5160be", borderWidth: "2px" }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select a role</option>
              <option value="IMPORTER">Importer</option>
              <option value="DISTRIBUTOR">Distributor</option>
              <option value="RETAILER">Retailer</option>
            </select>
          </label>
          <div className="col-span-2 flex justify-center">
            <button
              className="bg-[#5160be] hover:bg-[#30486c] text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegApplication;
