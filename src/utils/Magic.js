import { Magic } from "magic-sdk";

const customNodeOptions = {
    rpcUrl: "https://vercel-blockchain-proxy.vercel.app/",
    chainId: 148460,
};

// Initialize Magic instance
const magic = new Magic("pk_live_BA90BC86AC0FA212", {
    network: customNodeOptions,
});

export { magic };