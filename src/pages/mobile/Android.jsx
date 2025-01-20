import React, { useEffect } from 'react'
import useAuth from '../../hooks/userAuth'
import QRScan from '../../components/QRScan';

function Android() {
    const { account, isConnected } = useAuth();

    if (!isConnected && account == null) {
        return (
            <div className='w-full h-40 flex justify-center items-center'>
                <p className='text-orange-600 font-bold text-2xl'>
                    Please Login
                </p>
            </div>
        )
    }

    return (
        <div className='h-[90vh] flex flex-col justify-between'>
            <QRScan />

            <footer className='bottom-0 text-center font-bold'>
                &copy; TraceChainBD 2024 
            </footer>
        </div>
    )
}

export default Android