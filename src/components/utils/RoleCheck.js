import { ABI } from "../../contractABI";
import { TraceChainContract } from "../../contants";
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  "https://vercel-blockchain-proxy.vercel.app/"
);
const contract = new ethers.Contract(TraceChainContract, ABI, provider);

const isAdmin = async (_account) => {
  if (contract && _account) {
    const data = await contract.isAdmin(_account);
    return data;
  }
};

const isCustoms = async (_account) => {
  if (contract && _account) {
    const data = await contract.isCustoms(_account);
    return data;
  }
};

const isDistributor = async (_account) => {
  if (contract && _account) {
    const data = await contract.isDistributor(_account);
    return data;
  }
};

const isRetailer = async (_account) => {
  if (contract && _account) {
    const data = await contract.isRetailer(_account);
    return data;
  }
};

const isImporter = async (_account) => {
  if (contract && _account) {
    const data = await contract.isImporter(_account);
    return data;
  }
};

export { isAdmin, isCustoms, isDistributor, isRetailer, isImporter };
