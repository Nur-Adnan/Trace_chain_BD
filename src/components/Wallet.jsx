import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { client } from "../contants"; // Assuming `client` is correctly imported
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import { FaWallet } from "react-icons/fa";

function Wallet() {
  const { isConnected, connectWallet } = useAuth();

  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  const adminWallets = [createWallet("io.metamask"), walletConnect()];

  return (
    <>
      {isAdmin ? (
        <>
          <ConnectButton
            client={client}
            wallets={adminWallets}
            theme={"dark"}
            connectModal={{
              size: "compact",
              showThirdwebBranding: false,
            }}
          />
        </>
      ) : (
        <>
          {!isConnected && (
            <>
              {/* <button
                onClick={connectWallet}
                className="bg-[#5160be] hover:bg-[#7db6f9] text-white font-bold py-2 px-4 rounded"
              >
                Login / Register
              </button> */}
              <button
                onClick={connectWallet}
                className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border bg-[linear-gradient(110deg,#0077ff,45%,#1e40af,55%,#0077ff)] bg-[length:200%_100%] px-4 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                <FaWallet className="mr-2 text-lg" />{" "}
                {/* Adjust the margin and size as needed */}
                Connect Now
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Wallet;
