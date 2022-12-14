import * as s from "../styles/globalStyles";
import {StyledButton, StyledRoundButton} from "../App";
import React, { useEffect, useState} from "react";
import { useSelector } from "react-redux";

function GutterzMint(){
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: false,
    });

    const [eligibleCount, setEligibleCount] = useState(0);

    const [feedback, setFeedback] = useState("");
    const [claimingNft, setClaimingNft] = useState(false);
    const [mintAmount, setMintAmount] = useState(1);
    const [paused, setPaused] = useState(true);
    const [publicCost, setPublicCost] = useState(70000000000000000)
    const [karmID, setKarmID] = useState(0)
    const [status, setStatus] = useState("")


    const handleKarmIDChange = (e) => {
        setKarmID(e.target.value);
    }
    const getConfig = async () => {
        blockchain.smartContract.methods.checkWalletEligibility(blockchain.account).call({from: blockchain.account}).then(function (res) {
            if(!res[0] || res[1] < 1){
                setEligibleCount(0)
            }else{
                setEligibleCount(res[1])
            }
        }).catch(function (err) {
            // console.log(err);
        });
        blockchain.smartContract.methods.paused().call().then((isPaused) => {
            setPaused(isPaused)
            if(isPaused){
                setFeedback("Contract is currently paused. Follow @GutterzNFT on twitter for updates")
            }
        });
        blockchain.smartContract.methods.PUBLIC_COST().call().then((cost) => {
            setPublicCost(cost)
        });

        const configResponse = await fetch("/setup/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig()
    }, []);


    const decrementMintAmount = () => {
        if(mintAmount > 1){
            setMintAmount(mintAmount - 1)
        }
    };

    const incrementMintAmount = () => {
        if(eligibleCount > 0){
            if(mintAmount < eligibleCount){
                setMintAmount(mintAmount + 1);
            }
        } else {
            setMintAmount(mintAmount + 1);
        }
    };

    const mint = () => {
        setFeedback(`Sit tight while we mint your ${CONFIG.NFT_NAME}...`)
        setClaimingNft(true);
        if(eligibleCount < 1){
            mintPublic();
        }else{
            mintHolders();
        }
    }

    const mintPublic = () => {
        const totalCostWei = (publicCost * mintAmount);
        blockchain.smartContract.methods.publicMint(mintAmount).send({
            to: CONFIG.CONTRACT_ADDRESS,
            from: blockchain.account,
            value: totalCostWei,
        }).once("error", (err) => {
            // console.log(err);
            setFeedback("Sorry, something went wrong please try again later.")
        }).then(() => {
            setFeedback(`Huzzah! Your ${CONFIG.NFT_NAME} have been minted. Your Gutterz will instant reveal on OpenSea in a few minutes.`)
        });
    };

    const mintHolders = () => {
        blockchain.smartContract.methods.holdersMint(mintAmount).send({
            to: CONFIG.CONTRACT_ADDRESS,
            from: blockchain.account,
        }).once("error", (err) => {
            // console.log(err);
            setFeedback("Sorry, something went wrong please try again later.")
        }).then(() => {
            setFeedback(`Huzzah! Your ${CONFIG.NFT_NAME} have been minted. Your Gutterz will instant reveal on OpenSea in a few minutes.`)
        });
    };

    const mintModule = () => {
        return(
            <>
            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                <StyledRoundButton
                    style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        fontSize: "36px",
                    }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                        e.preventDefault();
                        decrementMintAmount();
                    }}
                >
                    -
                </StyledRoundButton>
                <s.SpacerMedium/>
                <s.TextDescription
                    style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        fontSize: "36px",
                        fontWeight: "bold",
                    }}
                >
                    {mintAmount}
                </s.TextDescription>
                <s.SpacerMedium/>
                <StyledRoundButton
                    style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        fontSize: "36px"
                    }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                        e.preventDefault();
                        incrementMintAmount();
                    }}
                >
                    +
                </StyledRoundButton>
            </s.Container>
            <StyledButton
            className="claim-button"
            style={{
                padding: 10,
                margin: 20,
                fontSize: "30px",
                paddingTop: "22px",
                paddingBottom: "22px",
                paddingRight: "30px",
                paddingLeft: "30px",
                borderRadius: "6px",
                border: "none",
                lineHeight: 1,
                textTransform: "uppercase",
                backgroundColor: "#72ab65",
                color: "white"
            }
            }
            onClick={(e) => {
                e.preventDefault();
                mint();
            }}
        >
            Mint for .07 ETH
        </StyledButton>
        <hr class="hr-rule"/>
        </>


        )
    }

    const checkKarmeleonStatus = () => {
        if(karmID < 1 || karmID > 2000){
            setStatus("You must enter a valid Karmeleon ID.")
        }else{
            blockchain.smartContract.methods.CLAIMED(karmID).call({from: blockchain.account}).then((claimed) => {
                if(claimed){
                    setStatus("Karmeleon #" + karmID + " has already been used for a free mint.")
                } else{
                    setStatus("Karmeleon #" + karmID + " is still eligible for a free mint!")
                }
            });
        }
    }


    /** Views **/

    const eligibleView = () => {
        return (
            <>
                {supplyView()}
                <s.TextDescription
                    style={{
                        textAlign: "center",
                        color: "var(--primary-text)",
                        marginBottom: "10px",
                        fontFamily: "Archivo"
                    }}
                >
                    <span style={{fontSize: "18px" ,fontWeight: "bold"}}>You're eligible to mint up to {eligibleCount} Gutterz Species 2 NFTs for free!</span>
                </s.TextDescription>
                {mintModule()}
            </>
        )
    }

    const publicView = () => {
            return (<>
                {supplyView()}
                <s.TextDescription
                    style={{
                        textAlign: "center",
                        color: "var(--primary-text)",
                        marginBottom: "10px",
                        fontFamily: "Archivo"
                    }}
                >
                     <span style={{fontSize: "28px" ,fontWeight: "bold", textTransform: "uppercase", display: "flex", justifyContent: "center", padding: "20px", backgroundColor: "#000000"}}>Public mint of .07 ETH</span><br/>
                        <span style={{fontSize: "16px" ,fontWeight: "bold"}}>
                        To mint free, you must hold a <a href="https://opensea.io/collection/gutterz" target="_blank">Gutterz NFT</a> &amp; at least 1 unused <a href="https://mint.karmeleonsnft.com" target="_blank">Karmeleon NFT</a>.</span>
                </s.TextDescription>
                {mintModule()}
            </>)
    }

    const supplyView = () => {
        return (
            <>
                <s.TextTitle
                    style={{
                        textAlign: "center",
                        fontSize: 50,
                        fontWeight: "bold",
                        fontFamily: "Archivo",
                        color: "var(--accent-text)",
                    }}
                >
                    {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                </s.TextTitle>
                <s.TextDescription
                    style={{
                        textAlign: "center",
                        color: "var(--primary-text)",
                        marginBottom: "10px",
                        paddingBottom: "20px",
                    }}
                >
                    ...total Gutterz Species 2 have been claimed
                </s.TextDescription>
            </>
        )

    };

    return(
        
        <s.Container className="claim-window"
                     flex={2}
                     jc={"center"}
                     ai={"center"}
        >
            {
                claimingNft || paused ?
                    (
                        // Paused contract or claiming NFT view
                        <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "var(--primary-text)",
                                marginBottom: "10px",
                                fontFamily: "Archivo"
                            }}
                        >
                            <span style={{fontSize: "18px" ,fontWeight: "bold"}}>{feedback}</span>
                        </s.TextDescription>
                    ) : (
                        <>
                            {
                                eligibleCount > 0 ?
                                    (
                                        // Eligible Holder view
                                        eligibleView()
                                    ) : (
                                        // Public view
                                        publicView()
                                    )
                            }
                            <s.TextTitle
                                style={{
                                    textAlign: "center",
                                    fontSize: 28,
                                    marginBottom: 8,
                                    lineHeight: 1.2,
                                    fontWeight: "bold",
                                    fontFamily: "Archivo",
                                    color: "var(--accent-text)",
                                    borderRadius: 0
                                }}
                            >
                                Karmeleon Claim Check
                            </s.TextTitle>
                            <s.TextDescription
                                style={{
                                    textAlign: "center",
                                    color: "var(--primary-text)",
                                    marginBottom: "10px"
                                }}
                            >
                                {blockchain.account === "" ||
                                blockchain.smartContract === null ? (
                                        <p>You must be connected to the network to use this feature.</p>
                                    )
                                    :
                                    (
                                        <div>
                                            <p>Enter the ID of any Karmeleon to see if it's been used to claim a Gutterz Species 2.</p>
                                            <div className="flex-container claim-check-wrapper">KARMELEON #&nbsp;&nbsp;
                                                <input
                                                    type="text"
                                                    maxLength={4}
                                                    pattern="[0-9]*"
                                                    id="karmID"
                                                    name="karmID"
                                                    className="claim-input"
                                                    onChange={handleKarmIDChange}
                                                    value={karmID}
                                                    onKeyPress={(event) => {
                                                        if (!/\d/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <StyledButton
                                                    className="claim-button"
                                                    style={{
                                                        paddingTop: 21,
                                                        paddingBottom: 18,
                                                        paddingLeft: 20,
                                                        paddingRight: 20,
                                                        fontSize: 23,
                                                        lineHeight: 1,
                                                        textTransform: "uppercase",
                                                        backgroundColor: "#6c3aad",
                                                        color: "#fff"
                                                    }
                                                    }
                                                    disabled={claimingNft ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        checkKarmeleonStatus();
                                                    }}
                                                >
                                                    Check Status
                                                </StyledButton>
                                            </div>
                                        </div>
                                    )
                                }
                                <s.TextDescription
                                    style={{
                                        textAlign: "center",
                                        color: "#cbdb70",
                                    }}
                                >
                                    {status}
                                </s.TextDescription>
                            </s.TextDescription>
                        </>
                    )
            }

        <s.SpacerMedium />
            {/* BOTTOM TEXT */}
            <s.TextDescription
                style={{
                    textAlign: "center",
                    color: "#777",
                }}
            >{blockchain.account === "" ||
            blockchain.smartContract === null ? "Please connect to Ethereum " + CONFIG.NETWORK.NAME + " with a wallet that holds an OG  Gutter Cat Gang Species. Once you claim your free Gutterz, you cannot undo this action.\n" : "You are connected with address " + blockchain.account}
            </s.TextDescription>
            <s.SpacerMedium />
    </s.Container>
    )
}


export default GutterzMint;