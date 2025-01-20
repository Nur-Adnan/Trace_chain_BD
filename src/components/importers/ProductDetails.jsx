import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { etherContract } from '../../contants';

function ProductDetails({ productID }) {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const result = await etherContract.products(productID);
                setDetails(result);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, [productID]);

    if (!details) {
        return <Text>Loading details...</Text>;
    }

    return (
        <Box mt={4} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Text fontSize='2xl' fontWeight='bold'>Product Details</Text>
            <Text><strong>Product ID:</strong> {productID}</Text>
            <Text><strong>Name:</strong> {details.name}</Text>
            <Text><strong>Description:</strong> {details.description}</Text>
            <Text><strong>Category:</strong> {details.category}</Text>
            <Text><strong>Country of Origin:</strong> {details.countryOfOrigin}</Text>
            <Text><strong>Manufacturer:</strong> {details.manufacturer}</Text>
            <Text><strong>Price:</strong> {details.price.toString()} (in USD)</Text>
            <Text><strong>Quantity:</strong> {details.quantity.toString()}</Text>
            <Text><strong>Imported Date:</strong> {new Date(details.importedDate.toNumber() * 1000).toLocaleString()}</Text>
            <Text><strong>Importer Address:</strong> {details.importerAddr}</Text>
            <Text><strong>Customs Address:</strong> {details.customsAddr}</Text>
        </Box>
    );
}

export default ProductDetails;
