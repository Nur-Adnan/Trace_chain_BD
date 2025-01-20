import { useState, useEffect } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Spinner,
    Heading,
    Icon,
    Button,
    useToast,
    Text,
    Image,
    keyframes,
    Center,
    Divider
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { adminSigner } from '../utils/adminWallet';
import { ethers } from 'ethers';
import { TraceChainContract } from '../../contants';
import { ABI } from '../../contractABI';
import backgroundImage from "../../img/homeBG3.png"; // Import the background image
import blinkingImage from '../../img/svg.png'; // Replace with your image path

// Define the blinking animation for the image
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

// Define the spinning animation for the spinner
const spinAround = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

function AllReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const etherContract = new ethers.Contract(TraceChainContract, ABI, adminSigner);

    const fetchReports = async () => {
        try {
            const listOfReports = await etherContract.getAllReports();
            setReports(listOfReports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (productId) => {
        try {
            await etherContract.acceptReport(productId);
            toast({
                title: 'Report accepted successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            fetchReports();
        } catch (error) {
            console.error('Error accepting report:', error);
            toast({
                title: 'Error accepting report',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDeny = async (productId) => {
        try {
            const reason = prompt('Enter reason for denial:');
            if (reason) {
                await etherContract.deniedReport(productId, reason);
                toast({
                    title: 'Report denied successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                fetchReports();
            }
        } catch (error) {
            console.error('Error denying report:', error);
            toast({
                title: 'Error denying report',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) {
        return (
            <Center height="100vh" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Box textAlign="center" position="relative" display="inline-block">
                    {/* Image in the center */}
                    <Image 
                        src={blinkingImage} 
                        alt="Loading" 
                        boxSize="50px" 
                        animation={`${blinkAnimation} 1.5s infinite`} 
                        position="absolute" 
                        top="27%" 
                        left="50%" 
                        transform="translate(-50%, -50%)"
                    />

                    {/* Spinner surrounding the image */}
                    <Spinner
                        width="60px" height="60px" color="#5160be"
                        animation={`${spinAround} 0.9s linear infinite`}
                        position="relative"
                        zIndex="0"  // Ensures the spinner stays behind the image
                    />
                    <Text mt={4} fontSize="xl" fontWeight="bold">
                        Please wait while we load the reports. This won't take long.
                    </Text>
                </Box>
            </Center>
        );
    }

    return (
        <Box
            p={5}
            minH="100vh"
            bg={`url(${backgroundImage})`}
            bgSize="cover"
            bgPosition="center"
        >
            <Box className='flex justify-center'>
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                    <Icon as={FiAlertCircle} mr={2} />
                    Report History
                </Heading>
            </Box>
            <Divider className='mt-5 mb-5' borderWidth='1px' borderColor='#5160be' />
            {reports.length > 0 ? (
                <TableContainer bg="white" borderRadius="md" boxShadow="md" p={4}>
                    <Table variant="simple">
                        <Thead bg="#5160be">
                            <Tr>
                                <Th color="white" textAlign="center">SL no</Th>
                                <Th color="white" textAlign="center">Product ID</Th>
                                <Th color="white" textAlign="center">Description</Th>
                                <Th color="white" textAlign="center">Reported By</Th>
                                <Th color="white" textAlign="center">Reported For</Th>
                                <Th color="white" textAlign="center">Proof</Th>
                                <Th color="white" textAlign="center">Reported On</Th>
                                <Th color="white" textAlign="center">Status</Th>
                                <Th color="white" textAlign="center">Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {reports
                            .filter((item, index) => index !== 0)
                            .map((item, index) => (
                                <Tr key={index} _hover={{ bg: "gray.100" }}>
                                    <Td textAlign="center">{index}</Td>
                                    <Td textAlign="center">{item.productID.toString()}</Td>
                                    <Td textAlign="center">{item.reportDesc}</Td>
                                    <Td textAlign="center">{item.reportBy}</Td>
                                    <Td textAlign="center">{item.reportFor}</Td>
                                    <Td textAlign="center">
                                        <a
                                            href={`http://127.0.0.1:8080/ipfs/${item.proofHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View more
                                        </a>
                                    </Td>
                                    <Td textAlign="center">{new Date(item.reportedOn * 1000).toLocaleString()}</Td>
                                    <Td textAlign="center">{["Pending", "Accepted", "Declined"][item.status]}</Td>
                                    <Td textAlign="center">
                                        {item.status === 0 ? (
                                            <Box className='flex gap-4'>
                                                <Button
                                                    colorScheme="green"
                                                    onClick={() => handleAccept(index)}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    colorScheme="red"
                                                    onClick={() => handleDeny(index)}
                                                >
                                                    Deny
                                                </Button>
                                            </Box>
                                        ) :
                                            (
                                                <Button
                                                    colorScheme="gray"
                                                >
                                                    No Action
                                                </Button>
                                            )
                                        }
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            ) : (
                <Box textAlign="center" mt={10}>
                    No reports found.
                </Box>
            )}
        </Box>
    );
}

export default AllReport;
