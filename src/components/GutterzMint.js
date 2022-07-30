import * as s from "../styles/globalStyles";
import {StyledButton, StyledRoundButton} from "../App";
import React, { useEffect, useState, useRef } from "react";
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

    const [verified, setVerified] = useState(false);
    const [gutterGangID, setGutterGangID] = useState(0);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [mintAmount, setMintAmount] = useState(1);
    const [mintMax, setMintMax] = useState(0);

    const handleGutterGangIDChange = (e) => {
        setGutterGangID(e.target.value);
    }

    const getConfig = async () => {
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
        getConfig();
    }, []);

    const claimNFTs = () => {
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalGasLimit = String(gasLimit * mintAmount);
        setFeedback(`Sit tight while we mint your ${CONFIG.NFT_NAME}...`);
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint(mintAmount, gutterGangID)
            .send({
                gasLimit: String(totalGasLimit),
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setMintMax(0);
                setGutterGangID(null)
            })
            .then((receipt) => {
                setFeedback(
                    `Huzzah! Your ${CONFIG.NFT_NAME} have been minted. Visit OpenSea to view your NFTs`
                );
                setMintMax(0);
                setGutterGangID(-1);
                dispatch(fetchData(blockchain.account));
            });
    };

    const verifyGutterGang = () => {
        if(gutterGangID < 1 || gutterGangID > 3000){
            setFeedback("You must enter a valid Gutter Species ID.")
        }else{
            blockchain.smartContract.methods.hasGutterID(blockchain.account, gutterGangID).call({from: blockchain.account}).then(function (hasGutterID) {
                if(hasGutterID){
                    blockchain.smartContract.methods.balanceOf(blockchain.account).call({from: blockchain.account}).then(function (res) {
                        setMintMax(3 - parseInt(res));
                        if(parseInt(res) >= 3){
                            setFeedback("You've already minted all of your eligible Gutterz for this wallet.")
                        } else {
                            setFeedback(null)
                            setVerified(true)
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                }else{
                    setMintMax(0);
                    setFeedback("There is no Gutter Species owned by this address at ID #" + gutterGangID);
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
    }

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const incrementMintAmount = () => {
        if(mintAmount < mintMax){
            setMintAmount(mintAmount + 1);
        }
    };

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
            <s.SpacerSmall />
                { /* VERIFY GUTTER SCREEN */
                    !verified ? (
                        <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "var(--primary-text)",
                                marginBottom: "10px",
                                fontFamily: "Comic Sans MS, Comic Sans, cursive"
                            }}
                        >
                            Enter an ID of a Gutter Species you own
                            <div className="flex-container claim-check-wrapper">Gutter ID #&nbsp;
                                <input
                                    type="text"
                                    maxLength={4}
                                    pattern="[0-9]*"
                                    id="gutterGangID"
                                    name="gutterGangID"
                                    className="claim-input"
                                    onChange={handleGutterGangIDChange}
                                    value={gutterGangID}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
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
                                        backgroundColor: "#72ab65",
                                        color: "white"
                                    }
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        verifyGutterGang();
                                    }}
                                >
                                    Verify Ownership
                                </StyledButton>
                            </div>
                        </s.TextDescription>
                    ) : null}
            <s.SpacerMedium />
            { /* MINT MENU */
                verified && !claimingNft ? (
                <>
                <s.Container ai={"center"} jc={"center"} fd={"column"}>
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
                            ...total Gutterz have been claimed
                        </s.TextDescription>
                    <s.TextDescription
                        style={{
                            textAlign: "center",
                            color: "var(--primary-text)",
                            marginBottom: "10px",
                            fontFamily: "Comic Sans MS, Comic Sans, cursive"
                        }}
                    >
                        <span style={{fontSize: "18px" ,fontWeight: "bold"}}>Gang gang! You can mint up to {mintMax} Gutterz from this wallet.</span>
                    </s.TextDescription>
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                            style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                                fontSize: "36px" ,
                            }}
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                            }}
                        >
                            -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                                fontSize: "36px" ,
                                fontWeight: "bold",
                            }}
                        >
                            {mintAmount}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <StyledRoundButton
                            style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                                fontSize: "36px" ,
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
                </s.Container>
                    <StyledButton
                        className="claim-button"
                        style={{
                            padding: 10,
                            margin: 20,
                            fontSize: 27,
                            lineHeight: 1,
                            textTransform: "uppercase",
                            backgroundColor: "#72ab65",
                            color: "white"
                        }
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                        }}
                    >
                        Mint
                    </StyledButton>
                </>
            ): null}
            { /* FEEDBACK */
                feedback === null ? null : (
                    <s.TextDescription
                        style={{
                            textAlign: "center",
                            color: "var(--primary-text)",
                            marginBottom: "10px",
                            fontFamily: "Comic Sans MS, Comic Sans, cursive"
                        }}
                    >
                        <span style={{fontSize: "18px" ,fontWeight: "bold"}}>{feedback}</span>
                    </s.TextDescription>
                )
            }
        </s.Container>
    )
};


export default GutterzMint;