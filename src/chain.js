import { getContract, defineChain } from "thirdweb";
import { client } from "./contants";
import { ABI } from "./contractABI";


export const contract = getContract({
  client,
  chain: defineChain({
    id: 148460,
    rpc: "https://vercel-blockchain-proxy.vercel.app/",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  }),
  address: "0x1009368Dc2537A23429Bb1E0434111caf1732DF5",
  // abi: ABI
});
