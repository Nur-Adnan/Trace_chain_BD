import React, { useEffect, useState } from 'react';
import { Box, Button, Text, IconButton, useClipboard, VStack, HStack, Divider } from '@chakra-ui/react';
import { CopyIcon, ArrowLeftIcon } from '@chakra-ui/icons';
import userAuth from '../hooks/userAuth';
import backgroundImage from "../img/homeBG2.png";

function Profile() {
    const { isConnected, account } = userAuth();
    const { onCopy } = useClipboard(account || '');
    const [profile, setProfile] = useState(null);

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://tracechainbd-backend.onrender.com/api/roles');
                const data = await response.json();
                const profile = data.find(profile => profile.address_registered === account);
                setProfile(profile);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        }   
        fetchProfile();
    }, [account]);

    return (
        <div
            className='flex flex-col items-center min-h-screen bg-cover bg-center'
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <IconButton
                aria-label="Go back"
                icon={<ArrowLeftIcon />}
                onClick={goBack}
                colorScheme="gray"
                alignSelf="flex-start"  // Aligns the back button to the top left
                m={4}
            />

            <Box
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="md"
                bg="white"
                bgOpacity="90%"
                className='w-11/12 md:w-1/2 lg:w-1/3'
                mt={4}
            >
                <VStack align="stretch" spacing={4}>
                    <HStack justifyContent="space-between">
                        <Text fontSize="lg" fontWeight="bold">
                            Account Address:
                        </Text>
                        <Text
                            flex="1"
                            isTruncated
                            ml={2}
                            fontSize="md"
                            color="gray.600"
                        >
                            {account}
                        </Text>
                        <Button
                            onClick={onCopy}
                            colorScheme="teal"
                            variant="outline"
                            leftIcon={<CopyIcon />}
                            ml={4}
                        >
                            Copy
                        </Button>
                    </HStack>

                    <Divider />

                    {profile ? (
                        <>
                            <Text fontSize="lg" fontWeight="bold">
                                Profile Details
                            </Text>
                            <Text><strong>Name:</strong> {profile.name}</Text>
                            <Text><strong>Location:</strong> {profile.locAddress}</Text>
                            <Text><strong>Contact Number:</strong> {profile.contractNumber}</Text>
                            <Text><strong>Country of Origin:</strong> {profile.countryOfOrigin}</Text>
                            <Text><strong>TIN Number:</strong> {profile.tinNumber}</Text>
                            <Text><strong>VAT Registration Number:</strong> {profile.vatRegNumber}</Text>
                            <Text><strong>IPFS Document Hash:</strong> {profile.ipfsDocHash}</Text>
                            <Text><strong>Role:</strong> {profile.role}</Text>
                        </>
                    ) : (
                        <Text>Loading profile...</Text>
                    )}
                </VStack>
            </Box>
        </div>
    );
}

export default Profile;
