import { Divider, IconButton, Button } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TraceChainContract } from '../../contants';
import { ABI } from '../../contractABI';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../img/homeBG3.png";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

const gatewayBaseUrl = 'http://127.0.0.1:8080/ipfs/';

function DeniedApplications() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [alreadyRole, setAlreadyRole] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllApplications = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(TraceChainContract, ABI, signer);

        const otherRoles = await contract.getOthersParty();
        setAlreadyRole(otherRoles);
        const data = await contract.getApplictions();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    getAllApplications();
  }, []);

  const handleViewDocuments = (application) => {
    setSelectedApplication(application);
    onOpen();
  };

  const getUniqueApplications = () => {
    const normalizedRoles = alreadyRole.map(role => role.toLowerCase());

    const uniqueApplications = applications.filter(application => 
      !normalizedRoles.includes(application.address_registered.toLowerCase())
    );

    return uniqueApplications;
  };

  const uniqueApplications = getUniqueApplications();

  return (
    <>
      <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className='flex justify-between'>
          <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} /> {/* Add onClick handler */}
          <h1 className='text-center font-bold text-4xl'>Denied Applications</h1>
          <p></p>
        </div>
        <Divider className='mt-5' />
        <div className='mt-5 border'>
          <TableContainer className="rounded-md shadow-lg bg-white">
            <Table variant="simple" size="md">
              <TableCaption placement="top" fontSize="lg" fontWeight="bold" color="#5160be">
                List of All Denied Applications
              </TableCaption>
              <Thead bg="#5160be">
                <Tr>
                  <Th color="white" fontSize="md" textAlign="center">
                    SL No
                  </Th>
                  <Th color="white" fontSize="md" textAlign="center">
                    Applied By
                  </Th>
                  <Th color="white" fontSize="md" textAlign="center">
                    Name
                  </Th>
                  <Th color="white" fontSize="md" textAlign="center">
                    Contact
                  </Th>
                  <Th color="white" fontSize="md" textAlign="center">
                    Country of Origin
                  </Th>
                  <Th color="white" fontSize="md" textAlign="center">
                    Tin Number
                  </Th>
                  <Th color="white" fontSize="md" textAlign="center">
                    Role
                  </Th>
                  <Th color="white" fontSize="md" textAlign="center">
                    Documents
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {uniqueApplications.map((application, index) => (
                  <Tr key={application.address_registered} _hover={{ bg: "gray.100" }}>
                    <Td textAlign="center">{index + 1}</Td>
                    <Td textAlign="center">{application.address_registered}</Td>
                    <Td textAlign="center">{application.name}</Td>
                    <Td textAlign="center">{application.contractNumber}</Td>
                    <Td textAlign="center">{application.countryOfOrigin}</Td>
                    <Td textAlign="center">{application.tinNumber}</Td>
                    <Td textAlign="center">{application.role}</Td>
                    <Td textAlign="center">
                      <Button
                        colorScheme="blue"
                        onClick={() => handleViewDocuments(application)}
                      >
                        View Documents
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

        </div>
      </div>

      {selectedApplication && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Details of Company: {selectedApplication.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Applied By: {selectedApplication.address_registered}</p>
              <p>Company Name: {selectedApplication.name}</p>
              <p>Contact: {selectedApplication.contractNumber}</p>
              <p>Location: {selectedApplication.location}</p>
              <p>Country of Origin: {selectedApplication.countryOfOrigin}</p>
              <p>Tin Number: {selectedApplication.tinNumber}</p>
              <p>VAT Reg Number: {selectedApplication.vatRegNumber}</p>
              <p>Applied for Role: {selectedApplication.role}</p>
              <p>
                Document TIN: <a className='p-2 rounded-lg text-blue-600 underline' target='_blank' rel="noopener noreferrer" href={`${gatewayBaseUrl}${selectedApplication.ipfsDocHash}/doc-${selectedApplication.address_registered}/doc1.jpg`}>View TIN</a>
              </p>
              <p>
                Document Trade Licence: <a className='p-2 rounded-lg text-blue-600 underline' target='_blank' rel="noopener noreferrer" href={`${gatewayBaseUrl}${selectedApplication.ipfsDocHash}/doc-${selectedApplication.address_registered}/doc2.jpg`}>View Trade Licence</a>
              </p>
              <p>
                Document VAT REG: <a className='p-2 rounded-lg text-blue-600 underline' target='_blank' rel="noopener noreferrer" href={`${gatewayBaseUrl}${selectedApplication.ipfsDocHash}/doc-${selectedApplication.address_registered}/doc3.jpg`}>View VAT REG</a>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default DeniedApplications;
