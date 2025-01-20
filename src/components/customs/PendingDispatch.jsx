import React, { useState, useEffect } from 'react';
import { useToast, Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Heading } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';

function PendingDispatch() {
    const { account } = useAuth();
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dispatches, setDispatches] = useState([]);
    const toast = useToast();

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                // Ensure etherContract is available and correctly initialized
                const events = await etherContract.queryFilter('MultiProductDispatched');

                // Process events
                const dispatchesList = events.map(event => {
                    const { dispatchId, dispatchedOn, endId, quantity, from, startId, to } = event.args;
                    return {
                        dispatchId: dispatchId.toString(),
                        startId: startId.toString(),
                        endId: endId.toString(),
                        from,
                        to,
                        timestamp: Number(dispatchedOn.toString()),
                        quantity: quantity.toString(),
                    };
                });

                setDispatches(dispatchesList);
            } catch (error) {
                console.error('Error fetching history data:', error);
                toast({
                    title: "Error",
                    description: `Failed to fetch history data: ${error.message}`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        };

        fetchHistoryData();
    }, [toast]); // Run only once on mount or if toast changes

    useEffect(() => {
        const fetchBoxes = async () => {
            setLoading(true);
            try {
                const totalBoxes = await etherContract.boxCounter();
                const boxCount = Number(totalBoxes.toString());
                const fetchedBoxes = [];

                for (let i = 1; i <= boxCount; i++) {
                    const box = await etherContract.boxes(i);
                    const isInDispatch = dispatches.some(dispatch => dispatch.startId === box.start_productId.toString() && dispatch.endId === box.end_productId.toString() && dispatch.from === account && dispatch.to === box.importerAddr);

                    if (!isInDispatch && box.customsAddr === account) {
                        const formattedBox = {
                            boxId: i,
                            start_productId: Number(box.start_productId.toString()),
                            end_productId: Number(box.end_productId.toString()),
                            productName: box.name,
                            quantity: Number(box.quantity.toString()),
                            importedDate: Number(box.importedDate.toString()),
                            importerAddr: box.importerAddr,
                            customsAddr: box.customsAddr,
                        };
                        fetchedBoxes.push(formattedBox);
                    }
                }

                setBoxes(fetchedBoxes);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching boxes:', error);
                toast({
                    title: "Error",
                    description: `Failed to fetch boxes: ${error.message}`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                setLoading(false);
            }
        };

        // Fetch boxes only after dispatches are fetched
        if (dispatches.length > 0) {
            fetchBoxes();
        }
    }, [dispatches, account]); // Rerun when dispatches or account changes

    return (
        <Box p={4}>
            <Heading mb={4}>Pending Dispatches</Heading>
            {loading ? (
                <Spinner size="xl" />
            ) : (
                boxes.length > 0 ? (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Box ID</Th>
                                <Th>Start Product ID</Th>
                                <Th>End Product ID</Th>
                                <Th>Product Name</Th>
                                <Th>Quantity</Th>
                                <Th>Imported Date</Th>
                                <Th>Importer Address</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {boxes.map(box => (
                                <Tr key={box.boxId}>
                                    <Td>{box.boxId}</Td>
                                    <Td>{box.start_productId}</Td>
                                    <Td>{box.end_productId}</Td>
                                    <Td>{box.productName}</Td>
                                    <Td>{box.quantity}</Td>
                                    <Td>{new Date(box.importedDate * 1000).toLocaleDateString()}</Td>
                                    <Td>{box.importerAddr}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                ) : (
                    <Box textAlign="center" p={4}>
                        <Heading as="h2" size="md">No pending dispatches</Heading>
                    </Box>
                )
            )}
        </Box>
    );
}

export default PendingDispatch;
