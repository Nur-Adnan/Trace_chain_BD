import { useState, useEffect } from "react";
import { magic } from "../utils/Magic";
import userAuth from "./userAuth";
import { ethers } from "ethers";
import { TraceChainContract } from "../contants";
import { ABI } from "../contractABI";

const useWallet = () => {
  const { isConnected, account } = userAuth();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [traceChainBDContract, setTraceChainBDContract] = useState(null);
  const zeroGas = {
    gasPrice: ethers.BigNumber.from(0),
  };

  useEffect(() => {
    const checkWalletProvider = async () => {
      if (isConnected && account !== null) {
        // Initialize provider and signer
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const signer = provider.getSigner();

        // Update state
        setProvider(provider);
        setSigner(signer);

        // Initialize contract
        const contract = new ethers.Contract(TraceChainContract, ABI, signer);
        setTraceChainBDContract(contract);
      }
    };

    checkWalletProvider();
  }, [isConnected, account]); // Only re-run when `isConnected` or `account` changes

  return { provider, signer, traceChainBDContract, zeroGas };
};

export default useWallet;
