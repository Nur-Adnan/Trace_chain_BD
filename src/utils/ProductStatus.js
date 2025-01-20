const ProductStatus = Object.freeze({
    Default: 0,
    Dispatched: 1,
    Sold: 2, // only for retailer
    Verified: 3, // only for consumer (once they buy and verify)
    AcceptedByCustoms: 4,
    RejectedByCustoms: 5,
    AcceptedByImporter: 6,
    RejectedByImporter: 7,
    AcceptedByDistributor: 8,
    RejectedByDistributor: 9,
    AcceptedByRetailer: 10,
    RejectedByRetailer: 11
});

export { ProductStatus };