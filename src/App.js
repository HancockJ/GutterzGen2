import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import GutterzMint from "./components/GutterzMint";


export const StyledButton = styled.button`
  padding-top: 22px;
  padding-bottom: 16px;
  padding-right: 30px;
  padding-left: 30px;
  border-radius: 6px;
  border: none;
  font-size: 32px;
  backgroundColor: "#72ab65",
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
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  width: 100%;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;


function App() {

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

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
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
        style={{backgroundColor: "var(--primary)"}}
      >
          {/* BANNER */}
          <ResponsiveWrapper flex={1} style={{ padding: 10}}>
              <s.Container flex={1}>
                <a href="https://karmeleonsnft.com">
                    <svg xmlns="http://www.w3.org/2000/svg">
                        <g fill="#fff">
                            <path className="st0"
                                  d="M0 13.9V71h45.3V14.7H23.4v43.6h-1.5V14.9c0-.9.5-1.7 1.5-1.7h21.9V0H14.1C5.1 0 0 5.6 0 13.9zM70.2 58.3h-1.5V0H46.8v71h45.3V0H70.2zM115.4 0H93.6v71h31c8.1 0 13.8-6 13.8-13.6V19.1H117v37.8c0 .7-.3 1.3-.7 1.3h-.9V17.6h22.9V4.7h-22.9V0zM161.8 0h-21.9v71h31c8.1 0 13.8-6 13.8-13.6V19.1h-21.4v37.8c0 .7-.3 1.3-.7 1.3h-.9V17.6h22.9V4.7h-22.9V0zM186.2 71H231V57.9h-22.9v-1.6H231V43.5h-22.9V12.7h1.5V42H231V0h-44.8zM277.8 39V0h-45.3v71h21.9V56.8h1.6V71h21.9V49.2h-4.5c2.7-2.4 4.4-6 4.4-10.2zm-21.9 3.7c0 .7-.3 1.3-.7 1.3h-.9V12.7h1.5v30zM324.6 27.6V0h-45.2v13.2h23.4v1.5h-23.4V71h45.2V29.1h-21.8v29.2h-1.6V27.6z"/>
                        </g>
                    </svg>
                </a>
              </s.Container>
              <s.TextDescription flex={2} style={{ textAlign: "center", alignItems: "center", color: "white", paddingRight: "50px", overflow: "hidden"}} >
                VERIFIED SMART CONTRACT ADDRESS: <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK} style={{textDecoration: "underline", color: "white"}}>{CONFIG.CONTRACT_ADDRESS}</StyledLink>
              </s.TextDescription>
              <s.TextDescription flex={3} style={{justifyContent: "right"}}>
                <StyledLink style={{color: "white"}} target={"_blank"} href="https://twitter.com/GutterzNFT">TWITTER</StyledLink>
              </s.TextDescription>
        </ResponsiveWrapper>

      {/* GUTTERZ ART */}
      <a href="https://karmeleonsnft.com">
          <img className="logo" src="/setup/images/gutterzPreview.jpeg" alt="Karmeleons NFT" />
      </a>

        <ResponsiveWrapper flex={2} style={{ padding: 0 }}>
          <s.Container className="mint-window"
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--primary)",
              padding: 10,
              paddingBottom: 100,
              borderRadius: 100,
            }}
          >
            {blockchain.account === "" ||
              blockchain.smartContract === null ? (
              <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 34,
                marginBottom: 10,
                lineHeight: 1.2,
                fontFamily: "PxGrotesk Bold",
                color: "var(--accent-text)",
              }}
              >
                FREE MINT FOR OG GUTTER CAT GANG HOLDERS
              </s.TextTitle>
              ) :
                <GutterzMint />}

            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  All Gutterz have been claimed.
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
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                      style={{
                      color: "white",
                      backgroundColor: "#72ab65",
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
                ) : null
                }
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>

          {/* BOTTOM TEXT */}
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#777",
            }}
          >{blockchain.account === "" ||
          blockchain.smartContract === null ? "Please connect to the Mainnet with a wallet that holds a Gutterz Species. Once you claim your free Gutterz, you cannot undo this action.\n" : "You are connected. Make sure you enter the ID of a Gutter Species you own. You cannot undo this."}
          </s.TextDescription>

      </s.Container>
    </s.Screen>
  );
}

export default App;
