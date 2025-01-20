import { useEffect, useState } from 'react';
import useAuth from '../../hooks/userAuth';
import { isImporter } from '../utils/RoleCheck';
import backgroundImage from "../../img/homeBG2.png";

function ImporterDashboard({ setActiveComponent }) {
    const { account, isConnected } = useAuth();
    const [checkImporter, setCheckImporter] = useState(false);

    useEffect(() => {
        const checkIfImporter = async () => {
            if (account) {
                const result = await isImporter(account);
                console.log(result);
                setCheckImporter(result);
            }
        };

        checkIfImporter();
    }, [account]);

    if (!isConnected) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>Please Login</p>
                <button className='bg-[#5160be] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        );
    }

    if (isConnected && !checkImporter) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>You are not an importer</p>
                <p className='text-red-400'>Please apply for registration</p>
                <button className='bg-[#5160be] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1 className='text-3xl font-bold text-black-500'>Importer Panel</h1>
            <br />
            <div className='grid grid-cols-3 gap-4'>
                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('all-product') }}>
                    <h1 className='text-2xl font-bold'>All Products</h1>
                    <p>Manage all of accepted products</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('pending-product') }}>
                    <h1 className='text-2xl font-bold'>Pending Product</h1>
                    <p>Manage all of pending products to accept</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('distributor-list') }}>
                    <h1 className='text-2xl font-bold'>Manage Distributors</h1>
                    <p>Manage distributors and their details</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('dispatch-to-distributor') }}>
                    <h1 className='text-2xl font-bold'>Dispatch Product</h1>
                    <p>Dispatch accepted product to distributor</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('update-price') }}>
                    <h1 className='text-2xl font-bold'>Update Product Price</h1>
                    <p>Update product price according to the rate</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('dispatch-history') }}>
                    <h1 className='text-2xl font-bold'>Dispatch History</h1>
                    <p>Dispatch history of product to distributor</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('track-product') }}>
                    <h1 className='text-2xl font-bold'>Track Product</h1>
                    <p>Get the current state of a product</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('report-product') }}>
                    <h1 className='text-2xl font-bold'>Report Product</h1>
                    <p>Report any product to Govt./Respective Entity</p>
                </div>
            </div>
        </div>
    );
}

export default ImporterDashboard;
