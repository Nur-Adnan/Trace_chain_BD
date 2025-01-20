import React, { useState } from 'react';
import { Box, Center, Divider, Text, Input, Button, Spinner, useToast, IconButton } from '@chakra-ui/react';
import backgroundImage from "../../img/homeBG3.png";
import ProductDetails from '../../pages/ProductDetails';
import { SearchIcon, ArrowLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

function TraceProduct() {
    const [showDetails, setShowDetails] = useState(false);
    const [productId, setProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleTraceProduct = () => {
        if (!productId) {
            toast({
                title: "Warning",
                description: "Please enter a product ID",
                status: "warning",
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        setLoading(true);
        setShowDetails(false);

        setTimeout(() => { // Simulate loading time
            setShowDetails(true);
            setLoading(false);
        }, 1000); // Adjust the timeout as needed
    };

    return (
        <Box
            className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col'
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <Box p={10}>
                <div className='flex justify-between'>
                    <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} /> {/* Go back to the previous page */}
                    <h1 className='text-center font-bold text-4xl'>Trace Product</h1>
                    <p></p>
                </div>
                <Divider my={4} />

                <Text className='text-center mt-4'>
                    Search for product trace information using the product ID
                </Text>
                <Center className='flex flex-col gap-4'>
                    <Box className='flex flex-col gap-4 w-96 mt-5'>
                        <input
                            placeholder='Enter Product ID'
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            type="number"
                            className='p-3 bg-white border-2 border-[#5160be] rounded-lg'
                            required
                        />
                        <button
                            onClick={handleTraceProduct}
                            className="bg-[#5160be] hover:bg-[#7db6f9] text-white font-bold py-2 px-4 rounded"
                            rightIcon={<SearchIcon />}
                        >
                            {loading ? 'Tracing...' : 'Trace Product'}
                        </button>
                    </Box>

                    {loading && (
                        <Box textAlign="center">
                            <Spinner size="xl" />
                        </Box>
                    )}

                    {
                        showDetails && <ProductDetails pid={productId} />
                    }
                </Center>
            </Box>
        </Box>
    );
}

export default TraceProduct;
