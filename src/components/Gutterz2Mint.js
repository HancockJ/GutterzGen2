import * as s from "../styles/globalStyles";
import {StyledButton, StyledRoundButton} from "../App";
import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchData} from "../redux/data/dataActions";


function GutterzMint(){
    const dispatch = useDispatch();
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

    const [feedback, setFeedback] = useState("No feedback.");
    const [claimingNft, setClaimingNft] = useState(false);
    const [mintAmount, setMintAmount] = useState(1);
    const [paused, setPaused] = useState(true);
    const [publicMint, setPublicMint] = useState(true);
    const [publicCost, setPublicCost] = useState(70000000000000000)


    const getConfig = async () => {
        blockchain.smartContract.methods.checkWalletEligibility(blockchain.account).call({from: blockchain.account}).then(function (res) {
            if(!res[0] || res[1] < 1){
                setEligibleCount(0)
            }else{
                setEligibleCount(res[1])
            }
        }).catch(function (err) {
            console.log(err);
        });
        blockchain.smartContract.methods.paused().call().then((isPaused) => {
            setPaused(isPaused)
        });
        blockchain.smartContract.methods.PUBLIC_MINT_ON().call().then((status) => {
            setPublicMint(status)
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
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalGasLimit = String(gasLimit * mintAmount);
        /*`Sit tight while we mint your ${CONFIG.NFT_NAME}...`)*/
        setClaimingNft(true);
        if(publicMint){
            mintPublic(totalGasLimit);
        }else{
            mintHolders(totalGasLimit);
        }
    }

    const mintPublic = (totalGasLimit) => {
        const totalCostWei = (publicCost * mintAmount);
        blockchain.smartContract.methods.publicMint(mintAmount).send({
            gasLimit: String(totalGasLimit),
            to: CONFIG.CONTRACT_ADDRESS,
            from: blockchain.account,
            value: totalCostWei,
        }).once("error", (err) => {
            console.log(err);
            /* "Sorry, something went wrong please try again later.") */
        }).then(() => {
            /* `Huzzah! Your ${CONFIG.NFT_NAME} have been minted. Your Gutterz will instant reveal on OpenSea in a few minutes.` */
        });
    };

    const mintHolders = (totalGasLimit) => {
        blockchain.smartContract.methods.holdersMint(mintAmount).send({
            gasLimit: String(totalGasLimit),
            to: CONFIG.CONTRACT_ADDRESS,
            from: blockchain.account,
        }).once("error", (err) => {
            console.log(err);
            /* "Sorry, something went wrong please try again later.") */
        }).then(() => {
            /* `Huzzah! Your ${CONFIG.NFT_NAME} have been minted. Your Gutterz will instant reveal on OpenSea in a few minutes.` */
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
                fontSize: "36px",
                paddingTop: "22px",
                paddingBottom: "16px",
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
                // claimNFTs();
            }}
        >
            Mint
        </StyledButton>
        </>
        )
    }


    /** Views **/

    const eligibleView = () => {
        console.log("Eligible View")
        return (
            <>
                {supplyView()}
                {/*{setFeedback("You're eligible to mint up to " + eligibleCount + " Gutterz Species 2 NFTs for free!")}*/}
                {feedbackView()}
                {mintModule()}
            </>
        )
    }

    const publicView = () => {
        console.log("Public View")
        if(publicMint){
            setFeedback("You don't have X for any free mints. You can still mint as many as you like for .07 ETH each")
            return (<>
                {supplyView()}
                {feedbackView()}
                {mintModule()}
            </>)
        } else {
            // setFeedback("Public Mint is currently closed. Follow @GutterzNFT on twitter for updates.")
            return feedbackView();
        }
    }

    const pausedView = () => {
        console.log("Paused View")
        return (
            <>
                {/*{setFeedback("Contract is currently paused. Follow @GutterzNFT on twitter for updates")}*/}
                {feedbackView()}
            </>
        )

    }

    const supplyView = () => {
        return (
            <>
                <s.TextTitle
                    style={{
                        textAlign: "center",
                        fontSize: 50,
                        fontFamily: "PxGrotesk Bold",
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

    const feedbackView = () => {
        return (
            <s.TextDescription
                style={{
                    textAlign: "center",
                    color: "var(--primary-text)",
                    marginBottom: "10px",
                    fontFamily: "PxGrotesk Regular, sans-serif"
                }}
            >
                <span style={{fontSize: "18px" ,fontWeight: "bold"}}>{feedback}</span>
            </s.TextDescription>
        )
    }

    return(
        <s.Container className="claim-window"
                     flex={2}
                     jc={"center"}
                     ai={"center"}
                     style={{
                         paddingRight: 20,
                         paddingLeft: 20,
                         paddingTop: 0,
                         borderRadius: 0,
                     }}
        >
            {
                paused ?
                (
                    pausedView()
                ) : (
                    eligibleCount > 0 ?
                    (
                       eligibleView()
                    ) : (
                            publicView()
                    )
                )
            }
        </s.Container>
    )
}


export default GutterzMint;