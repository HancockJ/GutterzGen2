import {ethers} from "ethers";
import React, {useEffect, useState} from 'react'



function GutterCheck() {
    const [address, setAddress] = useState("")
    const [ID, setID] = useState(1);
    const [output, setOutput] = useState(null)

    const checkForGutter = async () => {
        const {ethers} = require("ethers");
        const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/d163401424514af5bd48d03741865114');
        const abiResponse = await fetch("/setup/abi.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const abi = await abiResponse.json();
        const tempContract = new ethers.Contract('0xa88ec798a152c2e51c388bEE53211e21eA5183Ca',abi, provider);
        tempContract.deployed().then((smartContract) => {
            console.log(smartContract)
            smartContract.hasGutterID(address, ID).then((eligible) => {
                console.log(eligible)
                if(eligible){
                    setOutput("Address [" + address.substring(0, 7) + "...] has a Gutter Species at ID " + ID)
                } else{
                    setOutput("it doesn't look like " + address + " has a Gutter cat at ID " + ID)
                }
            })
        });
    }

    // useEffect()

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    }

    const handleIDChange = (e) => {
        setID(e.target.value);
    }
    return (
        <div>
            <h3>Check if your address has a gutter species at a specific ID:</h3>
            <br />
            {output}
            <br />
            <p>Address: </p><input
                type="text"
                id="gutterGangAddress"
                name="gutterGangAddress"
                className="address-input"
                onChange={handleAddressChange}
                value={address}
            />
            <br />
            <p>ID: </p><input
                type="text"
                maxLength={4}
                pattern="[0-9]*"
                id="gutterGangID"
                name="gutterGangID"
                onChange={handleIDChange}
                value={ID}
                onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                    }
                }}
            />
            <br />
            <button onClick={() => checkForGutter()}>Click me!</button>
        </div>
    )

}

export default GutterCheck;