let adminProvider;
let adminSigner;

if (typeof window !== "undefined" && window.ethereum) {
  import("ethers")
    .then(({ ethers }) => {
      adminProvider = new ethers.providers.Web3Provider(window.ethereum);
      adminSigner = adminProvider.getSigner();

      // Optionally, you can now export or use these variables here
      // This code runs asynchronously and sets up the provider and signer
      console.log(
        "Ethers.js has been imported and provider/signer are set up."
      );
    })
    .catch((error) => {
      console.error("Failed to import ethers.js:", error);
    });
} else {
  console.error("MetaMask (or any Ethereum provider) is not detected.");
}

export { adminProvider, adminSigner };
