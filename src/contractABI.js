export const ABI = [
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "locAddress",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contractNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "countryOfOrigin",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tinNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "vatRegNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsDocHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "role",
        "type": "string"
      }
    ],
    "name": "AppliedForReg",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dispatchId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "startId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "endId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dispatchedOn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum TrackUtils.ProductStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "MultiProductDispatched",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedOn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "updatedBy",
        "type": "address"
      }
    ],
    "name": "PriceUpdatedByImporter",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dispatchId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "acceptedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "acceptedOn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum TrackUtils.ProductStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "ProductAccepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "boxId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "countryOfOrigin",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "importedDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "importerAddr",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "customsAddr",
        "type": "address"
      }
    ],
    "name": "ProductAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dispatchId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dispatchedOn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum TrackUtils.ProductStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "ProductDispatched",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum TrackUtils.ProductStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "verifiedOn",
        "type": "uint256"
      }
    ],
    "name": "ProductVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reportId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "acceptedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "acceptedOn",
        "type": "uint256"
      }
    ],
    "name": "ReportAccepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reportId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "deniedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deniedOn",
        "type": "uint256"
      }
    ],
    "name": "ReportDenied",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "productID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reportDesc",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "reportBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "reportFor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reportedOn",
        "type": "uint256"
      }
    ],
    "name": "ReportForProduct",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum RolesUtils.Roles",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "RoleAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_reportId",
        "type": "uint256"
      }
    ],
    "name": "acceptReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "acceptedReports",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "productID",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "reportDesc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "proofHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "reportBy",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "reportFor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "reportedOn",
        "type": "uint256"
      },
      {
        "internalType": "enum TraceChainReport.Status",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "addAdmins",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "addCustoms",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "admins",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_role",
        "type": "string"
      }
    ],
    "name": "approveRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "boxCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "boxes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "boxId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "start_productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "end_productId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "countryOfOrigin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "importedDate",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "importerAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "customsAddr",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_countryOfOrigin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_manufacturer",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_importerAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_customsAddr",
        "type": "address"
      }
    ],
    "name": "bulkProudctEntry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dispatchId",
        "type": "uint256"
      }
    ],
    "name": "confirmDelivery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "customs",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "deleteAdmins",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "deleteCustoms",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_reportId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_reason",
        "type": "string"
      }
    ],
    "name": "deniedReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_startId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_endId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_memo",
        "type": "string"
      }
    ],
    "name": "dispatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "dispatches",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "memo",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "dispatchedOn",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isBox",
        "type": "bool"
      },
      {
        "internalType": "enum TrackUtils.ProductStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllAcceptedReports",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "productID",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "reportDesc",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "proofHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "reportBy",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "reportFor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "reportedOn",
            "type": "uint256"
          },
          {
            "internalType": "enum TraceChainReport.Status",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct TraceChainReport.Report[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllAdmins",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCustoms",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllDeniedReports",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "productID",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "reportDesc",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "proofHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "reportBy",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "reportFor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "reportedOn",
            "type": "uint256"
          },
          {
            "internalType": "enum TraceChainReport.Status",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct TraceChainReport.Report[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllReports",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "productID",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "reportDesc",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "proofHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "reportBy",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "reportFor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "reportedOn",
            "type": "uint256"
          },
          {
            "internalType": "enum TraceChainReport.Status",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct TraceChainReport.Report[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getApplictions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "address_registered",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "locAddress",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "contractNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "countryOfOrigin",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "tinNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "vatRegNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsDocHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          }
        ],
        "internalType": "struct RolesUtils.RegRoles[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dispatchId",
        "type": "uint256"
      }
    ],
    "name": "getDispatchLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOthersParty",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_reportID",
        "type": "uint256"
      }
    ],
    "name": "getSingleReport",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "productID",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "reportDesc",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "proofHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "reportBy",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "reportFor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "reportedOn",
            "type": "uint256"
          },
          {
            "internalType": "enum TraceChainReport.Status",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct TraceChainReport.Report",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_initAdmin",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "isCustoms",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "isDistributor",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "isImporter",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "isRetailer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "others",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "productLifeCycles",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "customDispatchId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "importerDispatchId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "distributorDispatchId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "retailerDispatchId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "soldDispatchId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "enum TrackUtils.ProductStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "boxId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "countryOfOrigin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "importedDate",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "importerAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "customsAddr",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_locAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_contractNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_countryOfOrigin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_tinNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_vatRegNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsDocHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_role",
        "type": "string"
      }
    ],
    "name": "regForRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_reportDesc",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_reportFor",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_proofHash",
        "type": "string"
      }
    ],
    "name": "reportProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "reports",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "productID",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "reportDesc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "proofHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "reportBy",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "reportFor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "reportedOn",
        "type": "uint256"
      },
      {
        "internalType": "enum TraceChainReport.Status",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "roles",
    "outputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "approvedBy",
        "type": "address"
      },
      {
        "internalType": "enum RolesUtils.Roles",
        "name": "role",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "rolesData",
    "outputs": [
      {
        "internalType": "address",
        "name": "address_registered",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "locAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "contractNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "countryOfOrigin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tinNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "vatRegNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsDocHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "role",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_boxId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "updateMultipleProductPriceByImporter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "verifyProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];