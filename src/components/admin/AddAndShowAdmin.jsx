import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Divider,
    Center,
    useToast,
    Spinner,
    Text
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ArrowLeftIcon } from '@chakra-ui/icons';
import { contract } from "../../chain";
import { adminProvider, adminSigner } from '../utils/adminWallet';
import { etherContract } from '../../contants';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../img/homeBG3.png";

function AddAndShowAdmin({ isAdmin }) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [adminAddr, setAdminAddr] = useState('');
    const [adminList, setAdminList] = useState([]);
    const [customsList, setCustomsList] = useState([]);
    const navigate = useNavigate();
    
    // use to add admins and customs role
    const addRole = async () => {
        setLoading(true);
        try {
            if (adminAddr !== '' && isAdmin) {
                const _account = adminAddr;
                const connectedWallet = etherContract.connect(adminSigner);
                const tx = await connectedWallet.addAdmins(_account);
                await tx.wait();
                setAdminAddr('');
                toast({
                    title: "Admin added successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            } else if (adminAddr !== '' && !isAdmin) {
                const _account = adminAddr;
                const connectedWallet = etherContract.connect(adminSigner);
                const tx = await connectedWallet.addCustoms(_account);
                await tx.wait();
                setAdminAddr('');
                toast({
                    title: "Customs added successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Address is required",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error adding role:", error);
            toast({
                title: "Error adding role",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (_account) => {
        setLoading(true);
        try {
            const connectedWallet = etherContract.connect(adminSigner);
            if (isAdmin) {
                const tx = await connectedWallet.deleteAdmins(_account);
                await tx.wait();
                toast({
                    title: "Admin deleted successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                const tx = await connectedWallet.deleteCustoms(_account);
                await tx.wait();
                toast({
                    title: "Customs deleted successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            toast({
                title: "Error deleting role",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAdminsNCustoms = async () => {
            setTableLoading(true);
            try {
                const admins = await etherContract.getAllAdmins();
                const customs = await etherContract.getAllCustoms();
                setAdminList(admins);
                setCustomsList(customs);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTableLoading(false);
            }
        };
        fetchAdminsNCustoms();
    }, [loading]);

    return (
        <div className='px-20 pt-4 w-full min-h-screen bg-cover bg-center flex flex-col ' style={{ backgroundImage: `url(${backgroundImage})` }}>

            <div className='flex justify-between'>
                <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} />
                <h1 className='text-center font-bold text-4xl'>
                    {isAdmin ? 'Admin Management' : 'Customs Management'}
                </h1>
                <p></p>
            </div>

            <div className="flex flex-col lg:flex-row p-6 gap-6">
                {/* Role Adding Feature */}
                <Box className="w-1/4 bg-white p-6 shadow-md rounded-lg h-full">
                    <FormControl id="adminName" mb={4}>
                        <FormLabel>{isAdmin ? 'Admin Address' : 'Customs Address'}</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter address start with 0x"
                            value={adminAddr}
                            onChange={(e) => setAdminAddr(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        className='w-full '
                        leftIcon={<AddIcon />}
                        onClick={addRole}
                        bg="#5160be"
                        color="white"
                        _hover={{ bg: "#7db6f9" }}
                        variant="solid"
                        isLoading={loading}
                    >
                        {loading ? "Adding..." : "Add to Ledger"}
                    </Button>
                </Box>

                <Center className='h-screen'>
                    <Divider orientation='vertical' />
                </Center>

                {/* Role Table */}
                <Box className="flex-1 bg-white p-6 shadow-md rounded-lg">
                    {tableLoading ? (
                        <Center flexDirection="column">
                            <Spinner size="xl" color="#5160be" />
                            <Text mt={4} fontSize="xl" color="#gray-600" fontWeight="bold">Please hold on, we're processing your request...</Text>
                        </Center>
                    ) : (
                        <Table variant="simple" colorScheme="gray" size="md" className="hover-table">
                            <Thead className="bg-[#5160be]">
                                <Tr>
                                    <Th color="white" fontSize="lg" textAlign="left">
                                        Sl No
                                    </Th>
                                    <Th color="white" fontSize="lg" textAlign="left">
                                        ID
                                    </Th>
                                    <Th color="white" fontSize="lg" textAlign="left">
                                        Address
                                    </Th>
                                    <Th color="white" fontSize="lg" textAlign="left">
                                        Actions
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {isAdmin
                                    ? adminList
                                        .filter(admin => admin !== '0x0000000000000000000000000000000000000000')
                                        .map((admin, index) => (
                                            <Tr key={index} _hover={{ bg: "gray.100" }}>
                                                <Td>{index + 1}</Td>
                                                <Td>admin@tracechain</Td>
                                                <Td>{admin}</Td>
                                                <Td>
                                                    <IconButton
                                                        aria-label="Delete Admin"
                                                        icon={<DeleteIcon />}
                                                        colorScheme="red"
                                                        onClick={() => handleDelete(admin)}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))
                                    : customsList
                                        .filter(customs => customs !== '0x0000000000000000000000000000000000000000')
                                        .map((customs, index) => (
                                            <Tr key={index} _hover={{ bg: "gray.100" }}>
                                                <Td>{index + 1}</Td>
                                                <Td>customs@tracechain</Td>
                                                <Td>{customs}</Td>
                                                <Td>
                                                    <IconButton
                                                        aria-label="Delete Customs"
                                                        icon={<DeleteIcon />}
                                                        colorScheme="red"
                                                        onClick={() => handleDelete(customs)}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>

            </div>
        </div>
    );
}

export default AddAndShowAdmin;
