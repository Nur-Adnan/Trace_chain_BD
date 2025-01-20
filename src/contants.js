/* 
1. Importer 
2. Distributor 
3. Retailers
4. Consumers
5. Government 
6. Admin
*/
import { inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient, defineChain } from "thirdweb";
import { ABI } from "./contractABI";
import { ethers } from "ethers";

// we need to use env variables to store the client id
const client = createThirdwebClient({
  clientId: "556f2fc16f1a66b07065b18bf962cbd1", // PC
});

const AAFactory = "0x7607132B9d67414E7DCdC411aAD9A78bB87Eb337" // PC
const adminAddr = "0x776f5b481881DF6A0d32930118Bbcc52D313485B"
const TraceChainContract = "0x1009368Dc2537A23429Bb1E0434111caf1732DF5";

const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "phone", "google"],
    },
    smartAccount: {
      chain: defineChain({
        id: 148460,
        rpc: "https://vercel-blockchain-proxy.vercel.app/",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
      }),
      // sponsorGas: true
    }
  }),
];


const provider = new ethers.providers.JsonRpcProvider("https://vercel-blockchain-proxy.vercel.app/");
const etherContract = new ethers.Contract(TraceChainContract, ABI, provider);

export { client, wallets, AAFactory, adminAddr, TraceChainContract, etherContract };