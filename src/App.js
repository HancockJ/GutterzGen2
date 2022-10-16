import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import GutterzMint from "./components/Gutterz2Mint";


export const StyledButton = styled.button`
  padding-top: 22px;
  padding-bottom: 22px;
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
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Archivo";
  font-weight: bold;
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
    SHOW_BACKGROUND: true,
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
    <s.Screen
    className={"main"}>
      <s.Container
      
        ai={"center"}
        style={{
          justifyContent: "space-between",
        }}
      >
          {/* BANNER */}
          <ResponsiveWrapper 
          flex={1}
          className={"nav"}
          >
              <s.Container flex={1} className={"logo-container"}>
                <a href="https://twitter.com/GutterzNFT">
                    <img className="logo" src="/setup/images/gutterz-logo.svg" alt="Gutterz Free Mint for Gutter Cat Gang Holders"/>
                </a>
              </s.Container>
              <s.TextDescription flex={2} style={{ textAlign: "center", alignItems: "center", color: "white", paddingRight: "50px", overflow: "hidden"}} >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK} style={{color: "white"}}>CONTRACT</StyledLink>
              </s.TextDescription>
              <s.TextDescription flex={3} style={{justifyContent: "right"}}>
                <StyledLink style={{fill: "white"}} target={"_blank"} href="https://twitter.com/GutterzNFT">
                <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 32 32"><title>twitter</title><path d="M32,6.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6C25.7,3.8,24,3,22.2,3 c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5C10.3,10.8,5.5,8.2,2.2,4.2c-0.6,1-0.9,2.1-0.9,3.3c0,2.3,1.2,4.3,2.9,5.5 c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1C2.9,27.9,6.4,29,10.1,29c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C30,8.5,31.1,7.4,32,6.1z"></path></svg>
                </StyledLink>
                <StyledLink style={{fill: "white", marginLeft: "16px"}} target={"_blank"} href="https://discord.gg/4E6P44KGgZ">
                <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 32 32"><title>discord</title>
                  <path d="M13.1,13.424a1.782,1.782,0,0,0,0,3.552A1.7,1.7,0,0,0,14.736,15.2,1.694,1.694,0,0,0,13.1,13.424Zm5.84,0A1.782,1.782,0,1,0,20.576,15.2,1.7,1.7,0,0,0,18.944,13.424Z" data-color="color-2"></path> 
                  <path d="M26.72,0H5.28A3.288,3.288,0,0,0,2,3.3V24.928a3.288,3.288,0,0,0,3.28,3.3H23.424l-.848-2.96,2.048,1.9L26.56,28.96,30,32V3.3A3.288,3.288,0,0,0,26.72,0ZM20.544,20.9s-.576-.688-1.056-1.3a5.049,5.049,0,0,0,2.9-1.9,9.156,9.156,0,0,1-1.84.944,10.531,10.531,0,0,1-2.32.688,11.208,11.208,0,0,1-4.144-.016,13.431,13.431,0,0,1-2.352-.688A9.6,9.6,0,0,1,9.9,17.68a4.976,4.976,0,0,0,2.8,1.888c-.48.608-1.072,1.328-1.072,1.328a5.8,5.8,0,0,1-4.88-2.432,21.426,21.426,0,0,1,2.3-9.328,7.912,7.912,0,0,1,4.5-1.68l.16.192A10.794,10.794,0,0,0,9.5,9.744s.352-.192.944-.464A12.015,12.015,0,0,1,14.08,8.272a1.576,1.576,0,0,1,.272-.032,13.538,13.538,0,0,1,3.232-.032A13.043,13.043,0,0,1,22.4,9.744a10.648,10.648,0,0,0-3.984-2.032l.224-.256a7.912,7.912,0,0,1,4.5,1.68,21.426,21.426,0,0,1,2.3,9.328A5.849,5.849,0,0,1,20.544,20.9Z"></path>
                </svg>
                </StyledLink>
              </s.TextDescription>
        </ResponsiveWrapper>

      {/* GUTTERZ ART */}
      <div className="splash-image">
          <img className="img-fluid" src="/setup/images/gutterzSplash.jpg" alt="Gutterz NFT" />
      </div>

      <s.Container className="mint-window"
        flex={2}
        jc={"center"}
        ai={"center"}
        style={{
            background: "transparent",
        }}
      >
        {blockchain.account === "" ||
          blockchain.smartContract === null ? (
          <s.TextTitle style={{textAlign: "center", fontSize: 44, marginTop: 20, marginBottom: 20, lineHeight: 1.2, fontFamily: "Archivo", fontWeight: "bold", color: "var(--accent-text)"}}>
            GUTTERZ SPECIES 2
            <s.TextDescription style={{ textAlign: "center", fontFamily:"Archivo", marginTop:6, color: "var(--accent-text)" }}>
              CONNECT WALLET FOR ELIGIBILITY
            </s.TextDescription>
          </s.TextTitle>
          ) : <GutterzMint />}

        {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
          <>
            <s.TextTitle
              style={{ textAlign: "center", color: "var(--accent-text)" }}
            >
              All Gutterz have been minted.
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

      <div className="flex-container footer">
          <p>
              &copy; 2022 Karmic Labs. Art by <a
              href="https://twitter.com/KeepItKarmelo" target="_blank">Karmelo</a>, founder/creator of the <a
              href="https://karmeleonsnft.com" target="_blank">Karmeleons</a> (minting now). Not affiliated with Gutter Cat Gang.
          </p>
      </div>
      </s.Container>
        <s.SpacerLarge />
        <s.SpacerLarge />
    </s.Screen>
  );
}

export default App;
