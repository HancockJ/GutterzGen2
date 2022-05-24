import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import ReactGA from 'react-ga';
ReactGA.initialize('G-9BDLBFDQN8');
ReactGA.pageview(window.location.pathname + window.location.search);

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding-top: 22px;
  padding-bottom: 16px;
  padding-right: 30px;
  padding-left: 30px;
  border-radius: 6px;
  border: none;
  font-size: 32px;
  background-color: var(--secondary);
  /*font-weight: bold;*/
  color: #094074;
  /*width: 100px;*/
  cursor: pointer;
  /*box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);*/
  :active {
    /*box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;*/
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #222;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "PxGrotesk Bold";
  /*box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);*/
  :active {
    /*box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;*/
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 320px;
  @media (min-width: 767px) {
    width: 520px;
  }

`;

export const StyledImg = styled.img`
  /*box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);*/
  //border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  //border: 8px solid #333;
  display: none;
  @media (min-width: 900px) {
    display: flex;
    width: 250px;
  }
  @media (min-width: 1000px) {
    display: flex;
    width: 300px;
  }
  
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Claim your free (+ gas) Karmz`);
  const [mintAmount, setMintAmount] = useState(0);
  const [karmID, setKarmID] = useState(0);
  const [karmCheckFeedback, setKarmCheckFeedback] = useState("");
  const [contractPaused, setContractPaused] = useState(true);
  const [karmeleonInfo, setKarmeleonInfo] = useState({
    viewing: false,
    totalCount: 0,
    eligibleCount: 0
  });
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
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });


  const viewKarmeleonInfo = () => {
    blockchain.smartContract.methods.karmeleonCount(blockchain.account).call({from: blockchain.account}).then(function (res) {
      setKarmeleonInfo({
        viewing: true,
        totalCount: res[0],
        eligibleCount: res[1]
      });
    }).catch(function (err) {
      console.log(err);
    });
  }
  

  const handleKarmIDChange = (e) => {
    setKarmID(e.target.value);
  }

  const checkKarmeleonClaim = () => {
      if(karmID < 1 || karmID > 3333){
          setKarmCheckFeedback("You must enter a valid token ID.")
      }else{
          blockchain.smartContract.methods.CLAIMED(karmID).call().then(function (res) {
              if(res){
                  setKarmCheckFeedback("Sorry, Karmeleon #" + karmID + " was already used to claim a Karmz.")
              } else{
                  setKarmCheckFeedback("Karmeleon #" + karmID + " can still claim a free Karmz!")
              }

          }).catch(function (err) {
              console.log(err);
          });
      }
  }


  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Dope. Your ${CONFIG.NFT_NAME} is yours! View your wallet on Opensea.io for instant reveal.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    if(karmeleonInfo.eligibleCount >= mintAmount + 1){
      setMintAmount(mintAmount + 1);
    }
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getPaused = () => {
      blockchain.smartContract.methods.paused().call().then(function (res) {
          setContractPaused(res);
      });
  };



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

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/setup/images/bg.png" : null}
      >
        <a href="https://karmeleonsnft.com">
        <img className="logo" src="/setup/images/logo.png" alt="Karmeleons NFT" />
        </a>
       
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 0 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/setup/images/karmz-left.png"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container className="mint-window"
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              // backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              //border: "4px dashed var(--secondary)",
              //boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
          <StyledLogo style={{
                width: "90px",
                height: "90px"
              }}
              alt={"logo"} src={"/setup/images/logo512.png"} />
          <s.SpacerSmall />
            {blockchain.account === "" ||
              blockchain.smartContract === null ? (
                <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 34,
                marginBottom: 8,
                lineHeight: 1.2,
                fontFamily: "PxGrotesk Bold",
                color: "var(--accent-text)",
              }}
              >
                Connect for eligibility
              </s.TextTitle>
              ) : ( 
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
              )}
              {blockchain.account === "" || 
                blockchain.smartContract === null ? (
                  ""
                  ) : ( 
                  <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--primary-text)",
                    marginBottom: "10px"
                  }}
                  >
                  <p>&hellip;total Karmz have been claimed</p>
                  </s.TextDescription>
              )}

            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  All Karmz have been claimed.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>

                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        fontSize: 20
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network to see if you're eligible to claim free Karmz.
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                      {getPaused()}
                      {console.log(contractPaused)}
                    {karmeleonInfo.eligibleCount != 0 ? (
                        contractPaused ? (
                            <div>
                                <s.TextTitle
                                    style={{ textAlign: "center", color: "#f1f1f1", fontFamily: "PxGrotesk Bold", textTransform: "uppercase",
                                        borderRadius: "100px", backgroundColor: "#222", fontSize: "18px", color: "#888",
                                        paddingTop: "16px",
                                        paddingBottom: "16px",
                                        paddingLeft: "16px",
                                        paddingRight: "16px"
                                    }}
                                > {karmeleonInfo.viewing ? null : viewKarmeleonInfo()}
                                    The contract is currently paused
                                </s.TextTitle>
                                <s.SpacerSmall />
                                <s.TextDescription
                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)",
                                    }}
                                >
                                    Mint a Karmeleon at <a href="https://mint.karmeleonsnft.com">https://mint.karmeleonsnft.com</a>
                                </s.TextDescription>
                            </div>
                        ):(
                        <s.TextTitle
                            style={{ textAlign: "center", color: "#f1f1f1", fontFamily: "PxGrotesk Bold", textTransform: "uppercase",
                              borderRadius: "0", backgroundColor: "#222", fontSize: "18px", color: "#888", 
                              paddingTop: "16px",
                              paddingBottom: "16px",
                              paddingLeft: "16px",
                              paddingRight: "16px"
                            }}
                        > {karmeleonInfo.viewing ? null : viewKarmeleonInfo()}
                          <span class="eligible-count">{karmeleonInfo.eligibleCount}/{karmeleonInfo.totalCount}</span><br/>of your Karmeleons are eligible to claim free Karmz
                        </s.TextTitle>
                        )
                    ):(
                        contractPaused ? (
                            <div>
                                <s.TextTitle
                                    style={{ textAlign: "center", color: "#f1f1f1", fontFamily: "PxGrotesk Bold", textTransform: "uppercase",
                                        borderRadius: "100px", backgroundColor: "#222", fontSize: "18px", color: "#888",
                                        paddingTop: "16px",
                                        paddingBottom: "16px",
                                        paddingLeft: "16px",
                                        paddingRight: "16px"
                                    }}
                                > {karmeleonInfo.viewing ? null : viewKarmeleonInfo()}
                                    The contract is currently paused
                                </s.TextTitle>
                                <s.SpacerSmall />
                                <s.TextDescription
                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)",
                                    }}
                                >
                                    Mint a Karmeleon at <a href="https://mint.karmeleonsnft.com">https://mint.karmeleonsnft.com</a>
                                </s.TextDescription>
                            </div>
                        ):(
                            <div>
                                <s.TextTitle
                                    style={{ textAlign: "center", color: "#f1f1f1", fontFamily: "PxGrotesk Bold", textTransform: "uppercase",
                                        borderRadius: "100px", backgroundColor: "#222", fontSize: "18px", color: "#888",
                                        paddingTop: "16px",
                                        paddingBottom: "16px",
                                        paddingLeft: "16px",
                                        paddingRight: "16px"
                                    }}
                                > {karmeleonInfo.viewing ? null : viewKarmeleonInfo()}
                                    You don't have any eligible Karmeleons in your wallet
                                </s.TextTitle>
                                <s.SpacerSmall />
                                <s.TextDescription
                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)",
                                    }}
                                >
                                    Mint a Karmeleon at <a href="https://mint.karmeleonsnft.com">https://mint.karmeleonsnft.com</a>
                                </s.TextDescription>
                            </div>
                            )

                    )}
                    {karmeleonInfo.eligibleCount == 0 ? (null):(
                        <div>
                          <s.SpacerMedium />
                          <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                          >
                            {feedback}
                          </s.TextDescription>
                          <s.SpacerMedium />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledRoundButton
                                style={{ lineHeight: 0.4 }}
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
                                }}
                            >
                              {mintAmount}
                            </s.TextDescription>
                            <s.SpacerMedium />
                            <StyledRoundButton
                                disabled={claimingNft ? 1 : 0}
                                onClick={(e) => {
                                  e.preventDefault();
                                  incrementMintAmount();
                                }}
                            >
                              +
                            </StyledRoundButton>
                          </s.Container>
                          <s.SpacerSmall />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledButton
                                disabled={claimingNft ? 1 : 0}
                                onClick={(e) => {
                                  e.preventDefault();;
                                  claimNFTs();
                                  getData();
                                }}
                            >
                              {claimingNft ? "CONNECTING..." : "CLAIM"}
                            </StyledButton>
                          </s.Container>
                        </div>
                    )}
                  </>
                )}
              </>
            )}
            
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/setup/images/karmz-right.png"}
              // style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>


        <s.SpacerMedium />

<hr class="divider" />
    <s.Container className="claim-window"
                 flex={2}
                 jc={"center"}
                 ai={"center"}
                 style={{
                     // backgroundColor: "var(--accent)",
                     paddingRight: 20,
                     paddingLeft: 20,
                     borderRadius: 0,
                     //border: "4px dashed var(--secondary)",
                     //boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                 }}
    >
        <s.SpacerSmall />
        <s.TextTitle
            style={{
                textAlign: "center",
                fontSize: 28,
                marginBottom: 8,
                lineHeight: 1.2,
                fontFamily: "PxGrotesk Bold",
                color: "var(--accent-text)",
            }}
        >

            KARMZ CLAIM CHECK
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
                    <p>Enter the ID of any Karmeleon to see if it's been used to claim a Karmz.</p>
                    <div className="flex-container claim-check-wrapper">Karmeleon #&nbsp;
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
                                color: "#243b1f"
                            }
                            }
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                                e.preventDefault();
                                checkKarmeleonClaim();
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
                {karmCheckFeedback}
            </s.TextDescription>

        </s.TextDescription>
        <s.SpacerMedium />
    </s.Container>

        <s.SpacerLarge />
        <s.Container jc={"center"} ai={"center"} style={{ width: "90%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#777"
            }}
          >
            Please connect to {CONFIG.NETWORK.NAME} Mainnet with a wallet that holds a Karmeleon NFT. Once you claim your free Karmz, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
