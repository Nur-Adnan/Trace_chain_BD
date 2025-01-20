import React from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import backgroundImage from "../img/homeBG2.png"; // Ensure you have this image in the correct path

function Error404() {
  const goBack = () => {
    window.history.back();
  };

  return (
    <Box
      className="flex justify-center items-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Box className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        <Heading as="h1" size="xl" mb={4} textAlign="center" color="red">
          ! Access Denied
        </Heading>
        <Text fontSize="lg" mb={8} textAlign="center">
          Check your Login Status and Select your appropriate role.
        </Text>
        <Box display="flex" justifyContent="center">
          <Button
            onClick={goBack}
            bg="#5160be"
            color="white"
            _hover={{ bg: "#7db6f9" }} // Hover background color
            fontWeight="bold"
            leftIcon={<ArrowLeftIcon />}
            rounded="md"
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Error404;
