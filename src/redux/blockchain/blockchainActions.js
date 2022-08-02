import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";


import { fetchData } from "../data/dataActions";



const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const abiResponse = await fetch("/setup/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/setup/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const chainID = CONFIG.NETWORK.ID;
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: CONFIG.INFURA_ID,
          rpc: {
            chainID: "https://" + CONFIG.NETWORK.NAME + ".infura.io/v3/" + CONFIG.INFURA_ID
          },
        },
      },
      walletlink: {
        package: WalletLink,
        options: {
          appName: CONFIG.NFT_NAME,
          infuraId: CONFIG.INFURA_ID,
          rpc: "https://" + CONFIG.NETWORK.NAME + ".infura.io/v3/" + CONFIG.INFURA_ID,
          chainId: chainID,
          appLogoUrl: "https://gutterznft.com/setup/images/logo512.png",
          darkMode: false,
        },
      },
    };

    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        if (networkId == CONFIG.NETWORK.ID) {
          const SmartContractObj = new Web3EthContract(
            abi,
            CONFIG.CONTRACT_ADDRESS
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      //dispatch(connectFailed("Please install MetaMask to mint your NFT."));

      // wallet connect for coinbase wallet
      // adapted from https://github.com/HashLips/hashlips_nft_minting_dapp/issues/69
      try {
        localStorage.removeItem("walletconnect");
        localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
        const web3Modal = new Web3Modal({
          network: "mainnet", // optional
          cacheProvider: false, // optional
          providerOptions, // required
        });
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        //console.log("web", web3);
  
        Web3EthContract.setProvider(provider);
        const accounts = await web3.eth.getAccounts();
        const networkId = await provider.request({
          method: "net_version",
        });
        //console.log("networkId", networkId);
        if (networkId == CONFIG.NETWORK.ID) {
          const SmartContractObj = new Web3EthContract(
            abi,
            CONFIG.CONTRACT_ADDRESS
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          provider.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          provider.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
          
        } else {
          dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`));
        }
      } catch (err) {
        console.log("error", err, " message", err.message);
        if (
          typeof err !== "undefined" &&
          typeof err.message !== "undefined" &&
          err.message.includes("User Rejected")
        ) {
          dispatch(connectFailed("User rejected the request"));
        } else if (
          (typeof err === "string" || err instanceof String) &&
          err.includes("Modal closed by user")
        ) {
          dispatch(connectFailed("Modal closed by user"));
        } else {
          dispatch(connectFailed("Something went wrong."));
        }
      }
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
