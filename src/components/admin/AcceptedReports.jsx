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
    Center,
    Text,
    Divider
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { ethers } from 'ethers';
import { adminSigner } from '../utils/adminWallet';
import { TraceChainContract } from '../../contants';
import { ABI } from '../../contractABI';
import backgroundImage from "../../img/homeBG3.png"; // Import the background image

function AcceptedReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) {
        return (
            <Center height="100vh" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Box textAlign="center">
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="#5160be"
                        size="xl"
                    />
                    <Text mt={4} fontSize="xl" fontWeight="bold">
                        Please wait while we load the accepted reports.
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
                <Heading as='h1' size='xl' mb={5} textAlign='center'>
                    <Icon as={FiAlertCircle} mr={2} />
                    Accepted Report History
                </Heading>
            </Box>
            <Text textAlign='center' mb={4}>List of accepted reports for products.</Text>
            <Divider className='mt-5 mb-5' borderWidth='1px' borderColor='#5160be' />
            {reports.length > 0 ? (
                <TableContainer bg="white" borderRadius="md" boxShadow="md" p={4}>
                    <Table variant='simple'>
                        <Thead bg="#5160be">
                            <Tr>
                                <Th color="white" textAlign="center">SL No</Th>
                                <Th color="white" textAlign="center">Product ID</Th>
                                <Th color="white" textAlign="center">Description</Th>
                                <Th color="white" textAlign="center">Reported By</Th>
                                <Th color="white" textAlign="center">Reported For</Th>
                                <Th color="white" textAlign="center">Proof</Th>
                                <Th color="white" textAlign="center">Reported On</Th>
                                <Th color="white" textAlign="center">Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {reports
                                .filter(item => item.status !== 0 && item.status !== 2)
                                .map((item, index) => (
                                    <Tr key={index} _hover={{ bg: "gray.100" }}>
                                        <Td textAlign="center">{index + 1}</Td>
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

export default AcceptedReports;
