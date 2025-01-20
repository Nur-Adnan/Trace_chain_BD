import React, { useState, useEffect } from "react";
import SingleProductEntry from "./SingleProductEntry";
import BoxWiseEntry from "./BoxWiseEntry";
import useAuth from "../../hooks/userAuth";
import { Divider, IconButton, Button } from "@chakra-ui/react";
import backgroundImage from "../../img/homeBG3.png";

function AddProduct() {
  const { account } = useAuth();
  console.log(account);
  // product entry option
  const [option, setOption] = useState("");
  const [selected, setSelected] = useState("");

  // const renderComponent = () => {
  //     switch (option) {
  //         case 'single':
  //             return <SingleProductEntry customsAddr={account} />
  //         case 'box':
  //             return <BoxWiseEntry customsAddr={account} />
  //     }
  // }

  return (
    <div className="px-2 py-5 w-full min-h-screen bg-cover bg-center flex flex-col mt-4">
      <div className="flex justify-center">
        <h1 className="mb-4 text-2xl font-bold md:text-5xl tracking-wide flex items-center justify-center">
          Product Entry by Customs Officer
        </h1>
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        {/* <button type="button" className='bg-orange-500 hover:bg-orange-600 p-2 rounded-lg text-white font-bold'
                    onClick={() => {
                        setSelected('single')
                        setOption('single')
                    }}
                >Product Entry</button> */}
        {/* <button type="button" className='bg-orange-500 hover:bg-orange-600 p-2 rounded-lg text-white font-bold'
                    onClick={() => {
                        setSelected('box')
                        setOption('box')
                    }}>Box Entry</button> */}
      </div>

      <div>
        {/* {renderComponent()} */}
        <SingleProductEntry customsAddr={account} />
      </div>
    </div>
  );
}

export default AddProduct;
