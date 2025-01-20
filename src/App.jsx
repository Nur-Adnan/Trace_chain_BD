import { ThirdwebProvider } from "thirdweb/react";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <ThirdwebProvider>
        <ChakraProvider>
          <Navbar />
        </ChakraProvider>
      </ThirdwebProvider>
    </>
  );
}
