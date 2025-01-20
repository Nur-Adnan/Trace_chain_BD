import React, { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";
import { contract } from '../../chain';
import PendingProduct from './PendingProduct';


function AcceptProduct() {
    const activeAccount = useActiveAccount();
    const [_dispatchId, setdispatchId] = useState('');
    const { mutate: sendTransaction } = useSendTransaction();

    const handleAcceptProduct = async () => {
        if (_dispatchId !== '') {
            const transaction = prepareContractCall({
                contract,
                method: "function confirmDelivery(uint256 _dispatchId)",
                params: [_dispatchId]
            });
            sendTransaction(transaction);
        }
    }

    return (
        <>
            <div className='flex justify-center'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-4xl font-bold mb-5'>Accept Product by Distributor</h1>
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Product Id' value={_dispatchId} onChange={(e) => setdispatchId(e.target.value)} />

                    <div className='flex justify-center'>
                        <button className='bg-blue-600 p-4 text-white rounded-xl w-[300px] font-bold'
                            onClick={handleAcceptProduct}
                        >Add Product to Ledger</button>
                    </div>
                </div>
            </div>

            <div>
                <PendingProduct />
            </div>
        </>
    )
}

export default AcceptProduct