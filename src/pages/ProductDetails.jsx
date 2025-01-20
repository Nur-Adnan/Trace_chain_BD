import { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineLocalShipping } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { etherContract } from '../contants';
import { useParams } from 'react-router-dom';
import { ProductStatus } from '../utils/ProductStatus';

function ProductDetails({ pid, role = 'Admin' }) {
    const { id: routeId } = useParams();
    const [productId, setProductId] = useState(pid || routeId);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rolesData, setRolesData] = useState([]);
    const [product, setProduct] = useState({});

    const checkForStatus = (status) => {
        switch (Number(status)) {
            case ProductStatus.Default:
                return 'Default';
            case ProductStatus.Dispatched:
                return 'Dispatched';
            case ProductStatus.Sold:
                return 'Sold';
            case ProductStatus.Verified:
                return 'Verified';
            case ProductStatus.AcceptedByCustoms:
                return 'Accepted by Customs';
            case ProductStatus.RejectedByCustoms:
                return 'Rejected by Customs';
            case ProductStatus.AcceptedByImporter:
                return 'Accepted by Importer';
            case ProductStatus.RejectedByImporter:
                return 'Rejected by Importer';
            case ProductStatus.AcceptedByDistributor:
                return 'Accepted by Distributor';
            case ProductStatus.RejectedByDistributor:
                return 'Rejected by Distributor';
            case ProductStatus.AcceptedByRetailer:
                return 'Accepted by Retailer';
            case ProductStatus.RejectedByRetailer:
                return 'Rejected by Retailer';
            default:
                return 'Unknown Status';
        }
    };

    const fetchRolesData = async () => {
        try {
            const response = await fetch('https://tracechainbd-backend.onrender.com/api/roles');
            const data = await response.json();
            setRolesData(data);
            console.log(data);  // Log the data directly
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    }

    const getRoleData = (address) => {
        try {
            // Assuming `rolesData` is an array of roles you have fetched earlier
            const role = rolesData.find(role => role.address_registered === address);

            if (role) {
                // Return the formatted string directly
                return `${role.name} (${role.role}) - ${role.locAddress}`;
            }
            // else {
            //     console.error("Role not found for the provided address.");
            //     return "Unknown Role"; // or an appropriate fallback value
            // }
        } catch (error) {
            console.error("Error getting role data:", error);
            return "Error Fetching Role"; // or an appropriate fallback value
        }
    };

    useEffect(() => {
        fetchRolesData();

        const fetchHistoryData = async () => {
            try {
                setLoading(true);

                const product = await etherContract.products(productId);
                setProduct(product);

                const multiEvents = await etherContract.queryFilter('MultiProductDispatched');
                const singleEvents = await etherContract.queryFilter('ProductDispatched');
                const acceptedEvents = await etherContract.queryFilter('ProductAccepted');

                const multiDispatchesList = multiEvents
                    .filter(event => {
                        const startId = Number(event.args.startId.toString());
                        const endId = Number(event.args.endId.toString());
                        const productIdNum = Number(productId);
                        return productIdNum >= startId && productIdNum <= endId;
                    })
                    .map(event => ({
                        type: 'Multi Dispatch',
                        dispatchId: event.args.dispatchId.toString(),
                        productId: productId,
                        from: event.args.from,
                        to: event.args.to,
                        timestamp: Number(event.args.dispatchedOn.toString()),
                        quantity: event.args.quantity.toString(),
                        status: checkForStatus(event.args.status.toString()),
                        icon: <MdOutlineLocalShipping />,
                        background: 'rgb(33, 150, 243)',
                    }));

                const singleDispatchesList = singleEvents.map(event => ({
                    type: 'Single Dispatch',
                    dispatchId: event.args.dispatchId.toString(),
                    productId: event.args.productId.toString(),
                    from: event.args.from,
                    to: event.args.to,
                    timestamp: Number(event.args.dispatchedOn.toString()),
                    quantity: event.args.quantity.toString(),
                    status: event.args.to !== "0x0000000000000000000000000000000000000000" ? checkForStatus(event.args.status.toString()) : 'Sold',
                    icon: event.args.to !== "0x0000000000000000000000000000000000000000" ? <MdOutlineLocalShipping /> : <IoMdCheckmarkCircleOutline />,
                    background: 'rgb(33, 150, 243)',
                }));

                const productAcceptedList = acceptedEvents.map(event => ({
                    type: 'Product Accepted',
                    dispatchId: event.args.dispatchId.toString(),
                    productId: event.args.productId.toString(),
                    acceptedBy: event.args.acceptedBy,
                    timestamp: Number(event.args.acceptedOn.toString()),
                    status: checkForStatus(event.args.status.toString()),
                    icon: <AiOutlineFileDone />,
                    background: 'rgb(16, 204, 82)',
                }));

                const allEvents = [...multiDispatchesList, ...singleDispatchesList, ...productAcceptedList];
                const sortedEvents = allEvents
                    .filter(event => event.productId === productId)
                    .sort((a, b) => b.timestamp - a.timestamp);

                setEvents(sortedEvents);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching history data:', error);
                setLoading(false);
            }
        };
        fetchHistoryData();
    }, [productId]);

    console.log(events);

    if (loading) {
        return <div>Loading...</div>;
    }

    const eventLength = events.length;
    let importerLength;
    if (eventLength === 2) {
        importerLength = 2;
    } else if (eventLength === 3) {
        importerLength = 3;
    } else {
        importerLength = 4;
    }


    let distLength;
    if (eventLength === 4) {
        distLength = 4;
    } else if (eventLength === 5) {
        distLength = 5;
    } else {
        distLength = 6;
    }


    let retLength;
    if (eventLength === 6) {
        retLength = 6;
    } else if (eventLength === 7) {
        retLength = 7;
    } else {
        retLength = 8;
    }
    console.log(eventLength);



    return (
        <div className='w-full '>
            <div className="flex justify-center">
                <div className="bg-white rounded-lg p-6 shadow-md w-96">
                    <h1 className="text-center font-bold text-xl pb-4">Product ID: {productId}</h1>
                    <p className="text-left text-xl">Product Name: {product.name}</p>
                    <p className="text-left text-xl">Product Originated From: {product.countryOfOrigin}</p>
                </div>
            </div>



            {
                role === 'Admin' && (
                    <VerticalTimeline>
                        {events.map((event, index) => (
                            <VerticalTimelineElement
                                key={index}
                                date={new Date(event.timestamp * 1000).toLocaleString()}
                                iconStyle={{ background: event.background, color: '#fff' }}
                                icon={event.icon}
                            >
                                <h3 className="vertical-timeline-element-title">
                                    {event.type === 'Multi Dispatch' || event.type === 'Single Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                                        event.type === 'Product Accepted' ? `Accepted By: ${getRoleData(event.acceptedBy)}` : ''}
                                </h3>
                                <h4 className="vertical-timeline-element-subtitle">{getRoleData(event.from)} → {getRoleData(event.to)}</h4>
                                <p>Quantity: {event.quantity} {event.status && `, Status: ${event.status}`}</p>
                            </VerticalTimelineElement>
                        ))}
                    </VerticalTimeline>
                )
            }

            {
                role === 'Customs' && (
                    <VerticalTimeline>
                        {events.slice(eventLength-2, eventLength).map((event, index) => (
                            <VerticalTimelineElement
                                key={index}
                                date={new Date(event.timestamp * 1000).toLocaleString()}
                                iconStyle={{ background: event.background, color: '#fff' }}
                                icon={event.icon}
                            >
                                <h3 className="vertical-timeline-element-title">
                                    {event.type === 'Multi Dispatch' || event.type === 'Single Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                                        event.type === 'Product Accepted' ? `Accepted By: ${getRoleData(event.acceptedBy)}` : ''}
                                </h3>
                                <h4 className="vertical-timeline-element-subtitle">{getRoleData(event.from)} → {getRoleData(event.to)}</h4>
                                <p>Quantity: {event.quantity} {event.status && `, Status: ${event.status}`}</p>
                            </VerticalTimelineElement>
                        ))}
                    </VerticalTimeline>

                )
            }

            {
                role === 'Importer' && (
                    <VerticalTimeline>
                        {events.slice((eventLength)-importerLength, events.length).map((event, index) => (
                            <VerticalTimelineElement
                                key={index}
                                date={new Date(event.timestamp * 1000).toLocaleString()}
                                iconStyle={{ background: event.background, color: '#fff' }}
                                icon={event.icon}
                            >
                                <h3 className="vertical-timeline-element-title">
                                    {event.type === 'Multi Dispatch' || event.type === 'Single Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                                        event.type === 'Product Accepted' ? `Accepted By: ${getRoleData(event.acceptedBy)}` : ''}
                                </h3>
                                <h4 className="vertical-timeline-element-subtitle">{getRoleData(event.from)} → {getRoleData(event.to)}</h4>
                                <p>Quantity: {event.quantity} {event.status && `, Status: ${event.status}`}</p>
                            </VerticalTimelineElement>
                        ))}
                    </VerticalTimeline>

                )
            }

            {
                role === 'Distributor' && (
                    <VerticalTimeline>
                        {events.slice(eventLength-distLength, eventLength-2).map((event, index) => (
                            <VerticalTimelineElement
                                key={index}
                                date={new Date(event.timestamp * 1000).toLocaleString()}
                                iconStyle={{ background: event.background, color: '#fff' }}
                                icon={event.icon}
                            >
                                <h3 className="vertical-timeline-element-title">
                                    {event.type === 'Multi Dispatch' || event.type === 'Single Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                                        event.type === 'Product Accepted' ? `Accepted By: ${getRoleData(event.acceptedBy)}` : ''}
                                </h3>
                                <h4 className="vertical-timeline-element-subtitle">{getRoleData(event.from)} → {getRoleData(event.to)}</h4>
                                <p>Quantity: {event.quantity} {event.status && `, Status: ${event.status}`}</p>
                            </VerticalTimelineElement>
                        ))}
                    </VerticalTimeline>

                )
            }

            {
                role === 'Retailer' && (
                    <VerticalTimeline>
                        {events.slice(eventLength-retLength, eventLength-4).map((event, index) => (
                            <VerticalTimelineElement
                                key={index}
                                date={new Date(event.timestamp * 1000).toLocaleString()}
                                iconStyle={{ background: event.background, color: '#fff' }}
                                icon={event.icon}
                            >
                                <h3 className="vertical-timeline-element-title">
                                    {event.type === 'Multi Dispatch' || event.type === 'Single Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                                        event.type === 'Product Accepted' ? `Accepted By: ${getRoleData(event.acceptedBy)}` : ''}
                                </h3>
                                <h4 className="vertical-timeline-element-subtitle">{getRoleData(event.from)} → {getRoleData(event.to)}</h4>
                                <p>Quantity: {event.quantity} {event.status && `, Status: ${event.status}`}</p>
                            </VerticalTimelineElement>
                        ))}
                    </VerticalTimeline>

                )
            }
        </div>
    );
}

export default ProductDetails;
