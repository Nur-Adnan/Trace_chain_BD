import React, { useEffect, useState } from 'react';
import { Button, Box, Text, VStack, Icon, HStack, useToast } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import Html5QrcodePlugin from './Html5QrcodePlugin';
import useWallet from '../hooks/userWallet';
import useAuth from '../hooks/userAuth';
import { etherContract } from '../contants';

function QRScan() {
  const [decodedResults, setDecodedResults] = useState([]);
  const { traceChainBDContract, zeroGas } = useWallet();
  const { account } = useAuth();
  const toast = useToast();
  const [id, setId] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [events, setEvents] = useState([]);

  const onNewScanResult = (decodedText, decodedResult) => {
    const url = decodedResult.decodedText;
    const decodeId = url.split('/').pop();
    setId(decodeId);
    setDecodedResults(prev => [...prev, decodedResult]);
  };

  useEffect(() => {
    if (id) {
      fetchHistoryData();
    }
  }, [id]);

  const fetchHistoryData = async () => {
    try {
      const multiEvents = await etherContract.queryFilter('MultiProductDispatched');
      const singleEvents = await etherContract.queryFilter('ProductDispatched');
      const acceptedEvents = await etherContract.queryFilter('ProductAccepted');

      const allDispatches = [
        ...multiEvents.map(event => ({
          type: 'Multi Dispatch',
          dispatchId: event.args.dispatchId.toString(),
          to: event.args.to,
        })),
        ...singleEvents.map(event => ({
          type: 'Single Dispatch',
          dispatchId: event.args.dispatchId.toString(),
          to: event.args.to,
        })),
      ];

      const acceptedDispatches = acceptedEvents.map(event => event.args.dispatchId.toString());

      console.log(acceptedDispatches)

      // Filter out dispatches that have already been accepted
      const filteredDispatches = allDispatches.filter(dispatch => !acceptedDispatches.includes(dispatch.dispatchId) && dispatch.to === account);

      console.log(filteredDispatches)

      setEvents(filteredDispatches);
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  console.log(events)

  // const checkOwner = async () => {
  //   try {
  //     await fetchHistoryData();
  //     const owner = await traceChainBDContract.checkOwner(id);
  //     setOwner(owner);
  //   } catch (error) {
  //     toast({
  //       title: "Error checking owner",
  //       description: `Something went wrong: ${error.message}`,
  //       status: "error",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleAccept = async (_dispatchId) => {
    setLoadingStates(prev => ({ ...prev, [_dispatchId]: true }));

    try {
      const tx = await traceChainBDContract.confirmDelivery(_dispatchId, {
        gasLimit: 3000000,
        ...zeroGas,
      });
      const response = await tx.wait();

      if (response) {
        toast({
          title: "Dispatch accepted successfully",
          description: `Dispatch ${_dispatchId} accepted successfully`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Not Accepted",
          description: `Something went wrong`,
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error accepting dispatch:', error);
      toast({
        title: "Error accepting dispatch",
        description: "Something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [_dispatchId]: false }));
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="center">
        <Box border="1px" borderColor="gray.200" p={4} borderRadius="md" boxShadow="md" w="100%" maxW="400px">
          <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
          />
        </Box>

        <VStack spacing={3} align="stretch" w="100%" maxW="400px">
          {decodedResults.length > 0 ? (
            decodedResults.map((result, index) => {
              const resultId = result.decodedText.split('/').pop();
              const event = events.find(e => e.dispatchId === resultId);
              return (
                <HStack key={index} p={3} bg="green.100" borderRadius="md" boxShadow="sm">
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text fontWeight="bold">{result.decodedText}</Text>
                  {
                    !event ? (
                      <Button
                        colorScheme="green"
                        isLoading={loadingStates[resultId]}
                        onClick={() => handleAccept(resultId)}
                      >
                        Accept
                      </Button>
                    ) : (
                      <Text>Not your product or already accepted</Text>
                    )
                  }
                </HStack>
              );
            })
          ) : (
            <Text>No QR code scanned yet.</Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}

export default QRScan;
