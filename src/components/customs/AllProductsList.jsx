import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  SimpleGrid,
  Collapse,
} from "@chakra-ui/react";
import { useState } from "react";

function AllProductsList() {
  const [expandedProductIds, setExpandedProductIds] = useState({});

  // Dummy data for immediate display
  const products = [
    {
      proId: 1,
      name: "Product 1",
      description: "High-quality product",
      category: "Electronics",
      countryOfOrigin: "USA",
      manufacturer: "TechCorp",
      price: 150,
      quantity: 100,
      importedDate: new Date("2023-09-15").getTime() / 1000,
      importerAddr: "0x123...456",
      customsAddr: "0x789...012",
    },
    {
      proId: 2,
      name: "Product 2",
      description: "Reliable and durable",
      category: "Automotive",
      countryOfOrigin: "Germany",
      manufacturer: "AutoMakers",
      price: 200,
      quantity: 50,
      importedDate: new Date("2023-08-10").getTime() / 1000,
      importerAddr: "0x123...456",
      customsAddr: "0x789...012",
    },
    {
      proId: 3,
      name: "Product 3",
      description: "Best quality product",
      category: "Home Appliances",
      countryOfOrigin: "Japan",
      manufacturer: "HomeTech",
      price: 300,
      quantity: 70,
      importedDate: new Date("2023-07-20").getTime() / 1000,
      importerAddr: "0x123...456",
      customsAddr: "0x789...012",
    },
    {
      proId: 4,
      name: "Product 4",
      description: "High performance and efficiency",
      category: "Electronics",
      countryOfOrigin: "South Korea",
      manufacturer: "ElectroMax",
      price: 400,
      quantity: 120,
      importedDate: new Date("2023-06-18").getTime() / 1000,
      importerAddr: "0x123...456",
      customsAddr: "0x789...012",
    },
    {
      proId: 5,
      name: "Product 5",
      description: "Eco-friendly and sustainable",
      category: "Furniture",
      countryOfOrigin: "Sweden",
      manufacturer: "GreenFurniture",
      price: 250,
      quantity: 80,
      importedDate: new Date("2023-05-25").getTime() / 1000,
      importerAddr: "0x123...456",
      customsAddr: "0x789...012",
    },
    {
      proId: 6,
      name: "Product 6",
      description: "Energy-efficient and durable",
      category: "Electronics",
      countryOfOrigin: "China",
      manufacturer: "EcoElectro",
      price: 500,
      quantity: 60,
      importedDate: new Date("2023-04-12").getTime() / 1000,
      importerAddr: "0x123...456",
      customsAddr: "0x789...012",
    },
    {
      proId: 7,
      name: "Product 7",
      description: "Compact and powerful",
      category: "Tools",
      countryOfOrigin: "USA",
      manufacturer: "PowerTools",
      price: 350,
      quantity: 150,
      importedDate: new Date("2023-03-18").getTime() / 1000,
      importerAddr: "0x123...456",
      customsAddr: "0x789...012",
    },
    {
      proId: 8,
      name: "Product 8",
      description: "Comfort and style combined",
      category: "Apparel",
      countryOfOrigin: "Italy",
      manufacturer: "FashionWear",
      price: 90,
      quantity: 200,
      importedDate: new Date("2023-02-28").getTime() / 1000,
      importerAddr: "0x123...456",
      customsAddr: "0x789...012",
    },
  ];

  const toggleExpand = (productId) => {
    setExpandedProductIds((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-bold md:text-5xl tracking-wide flex items-center justify-center">
          All Products List
        </h1>
      </div>
      <p className="text-lg mb-8 max-w-xl mx-auto drop-shadow-md tracking-widest leading-8 text-center">
        View detailed information for all the products added to the system.
      </p>
      {/* Commented out loading condition */}
      {/* {loading ? (
        <Spinner size="xl" />
      ) : */}
      <div className="flex justify-center mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
          {products.map((product, index) => (
            <div
              key={index}
              className="w-[300px] min-h-[300px] bg-white rounded-2xl border-2 border-transparent shadow-lg transition duration-500 ease-out relative p-6 hover:border-blue-500 overflow-visible"
              style={{
                boxShadow: "15px 15px 30px #bebebe, -15px -15px 30px #ffffff",
              }}
            >
              <div className="text-center h-full grid place-content-center gap-2">
                <h3 className="mb-4 font-semibold md:text-xl tracking-widest flex items-center justify-center font-inter">
                  {product.name} (ID: {product.proId})
                </h3>
                <p className="text-xs mb-8 max-w-xl mx-auto drop-shadow-md tracking-wide leading-8 text-center font-inter">
                  {product.description}
                </p>
              </div>

              {/* Expand/Collapse Button */}
              <button
                className={`absolute ${
                  expandedProductIds[product.proId]
                    ? "top-[17.5rem] z-20"
                    : "bottom-4"
                } left-1/2 transform -translate-x-1/2 w-[45%] py-2 text-white bg-[#008bf8] rounded-full shadow-md transition-all duration-500 ease-in-out hover:bg-blue-600 font-inter text-sm tracking-widest`}
                onClick={() => toggleExpand(product.proId)}
              >
                {expandedProductIds[product.proId] ? "Collapse" : "Expand"}
              </button>

              {/* Expanded Details - Positioned Outside Card */}
              {expandedProductIds[product.proId] && (
                <div className="absolute left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-lg p-6 text-gray-700 text-sm overflow-y-auto w-[320px] max-h-[500px] mt-6 z-10 space-y-3">
                  <div className="grid grid-cols-2 gap-4 font-inter tracking-wide uppercase text-sm pt-4">
                    <p className="font-semibold text-left bg-white py-1">
                      Category:
                    </p>
                    <p className="text-right bg-white py-1">
                      {product.category}
                    </p>

                    <p className="font-semibold text-left bg-white py-1">
                      Country of Origin:
                    </p>
                    <p className="text-right bg-white py-1">
                      {product.countryOfOrigin}
                    </p>

                    <p className="font-semibold text-left bg-white py-1">
                      Manufacturer:
                    </p>
                    <p className="text-right bg-white py-1">
                      {product.manufacturer}
                    </p>

                    <p className="font-semibold text-left bg-white py-1">
                      Price:
                    </p>
                    <p className="text-right bg-white py-1">${product.price}</p>

                    <p className="font-semibold text-left bg-white py-1">
                      Quantity:
                    </p>
                    <p className="text-right bg-white py-1">
                      {product.quantity}
                    </p>

                    <p className="font-semibold text-left bg-white py-1">
                      Imported Date:
                    </p>
                    <p className="text-right bg-white py-1">
                      {new Date(
                        product.importedDate * 1000
                      ).toLocaleDateString()}
                    </p>

                    <p className="font-semibold text-left bg-white py-1">
                      Importer Address:
                    </p>
                    <p className="text-right bg-white py-1">
                      {product.importerAddr}
                    </p>

                    <p className="font-semibold text-left bg-white py-1">
                      Customs Address:
                    </p>
                    <p className="text-right bg-white py-1">
                      {product.customsAddr}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 

      {/* } */}
    </div>
  );
}

export default AllProductsList;
