import { useEffect, useState } from 'react';
import useAuth from '../../hooks/userAuth';
import { isCustoms } from '../utils/RoleCheck';
import backgroundImage from "../../img/homeBG2.png";

function CustomsDashboard({ setActiveComponent }) {
    const { account, isConnected } = useAuth();
    const [checkCustoms, setCheckCustoms] = useState(false);

    useEffect(() => {
        const checkIfCustoms = async () => {
            if (account) {
                const result = await isCustoms(account); 
                console.log(result);
                setCheckCustoms(result);
            }
        };

        checkIfCustoms();
    }, [account]);

    if (!isConnected) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>Please login to account</p>
                <button className='bg-[#5160be] hover:bg-[#7db6f9] text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        );
    }

    if (isConnected && !checkCustoms) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>You are not a customs officer</p>
                <button className='bg-[#5160be] hover:bg-[#7db6f9] text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1 className='text-3xl font-bold text-black-500'>Customs Panel</h1>
            <br />
            <div className='grid grid-cols-4 gap-4'>
                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('add-product') }}>
                    <h1 className='text-2xl font-bold'>Entry and Accept Product</h1>
                    <p>Manage all customs accepted products</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('importer-list') }}>
                    <h1 className='text-2xl font-bold'>Manage Importer</h1>
                    <p>List of all importers and their details</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('products-list') }}>
                    <h1 className='text-2xl font-bold'>Manage Products</h1>
                    <p>Manage accepted products and their details</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('dispatch-to-importer') }}>
                    <h1 className='text-2xl font-bold'>Dispatch Product</h1>
                    <p>Dispatch accepted product to Importer</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('dispatch-history') }}>
                    <h1 className='text-2xl font-bold'>Dispatch History</h1>
                    <p>Dispatch history of product to Importer</p>
                </div>

                <div className='bg-[#5160be] hover:bg-[#7db6f9] text-white p-5 rounded-lg hover:cursor-pointer'
                    onClick={() => { setActiveComponent('track-product') }}>
                    <h1 className='text-2xl font-bold'>Track Product</h1>
                    <p>Get current state of a product</p>
                </div>
            </div>
        </div>
    );
}

export default CustomsDashboard;
