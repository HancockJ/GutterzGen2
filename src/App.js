import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import GutterzMint from "./components/Gutterz2Mint";


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
    <s.Screen>
      <s.Container
        flex={1}
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
                <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 32 32"><title>logo twitter</title><path d="M32,6.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6C25.7,3.8,24,3,22.2,3 c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5C10.3,10.8,5.5,8.2,2.2,4.2c-0.6,1-0.9,2.1-0.9,3.3c0,2.3,1.2,4.3,2.9,5.5 c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1C2.9,27.9,6.4,29,10.1,29c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C30,8.5,31.1,7.4,32,6.1z"></path></svg>
                </StyledLink>
              </s.TextDescription>
        </ResponsiveWrapper>

      {/* GUTTERZ ART */}
      <div className="splash-image">
          <img className="img-fluid" src="/setup/images/gutterzSplash.jpg" alt="Gutterz NFT" />
      </div>

        <ResponsiveWrapper flex={2} style={{ padding: 0 }}>
          <s.Container className="mint-window"
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "transparent",
              padding: 10,
              paddingBottom: 100,
              //borderRadius: 100,
            }}
          >
            {blockchain.account === "" ||
              blockchain.smartContract === null ? (
              <s.TextTitle style={{textAlign: "center", fontSize: 44, marginTop: 20, marginBottom: 20, lineHeight: 1.2, fontFamily: "PxGrotesk Bold", color: "var(--accent-text)"}}>
                GUTTERZ SPECIES 2
                <s.TextDescription style={{ textAlign: "center", fontFamily:"PxGrotesk Regular", marginTop:6, color: "var(--accent-text)" }}>
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
        </ResponsiveWrapper>

          {/* BOTTOM TEXT */}
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#777",
              paddingBottom: "44px"
            }}
          >{blockchain.account === "" ||
          blockchain.smartContract === null ? "Please connect to Ethereum " + CONFIG.NETWORK.NAME + " with a wallet that holds an OG  Gutter Cat Gang Species. Once you claim your free Gutterz, you cannot undo this action.\n" : "You are connected with address " + blockchain.account}
          </s.TextDescription>
          <div className="flex-container footer"><p>&copy; 2022 Karmic Labs. Art by <a
              href="https://twitter.com/KeepItKarmelo" target="_blank">Karmelo</a>, founder/creator of the <a
              href="https://karmeleonsnft.com" target="_blank">Karmeleons</a> (minting now). Not affiliated with Gutter Cat Gang.</p></div>

      </s.Container>
    </s.Screen>
  );
}

export default App;
