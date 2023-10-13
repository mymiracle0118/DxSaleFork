import { useState, useCallback, useEffect } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { InjectedConnector, NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector,  NoBscProviderError } from '@binance-chain/bsc-connector';
import { ethers } from "ethers";
import Web3 from "web3";

let netid = 0;//0 ropsten, 1 bsc
let provider = null;
let walletconnect, injected, bsc;

const netlist = [
  {
    chaind : 3,
    rpcurl : "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    blockurl : "https://ropsten.etherscan.io/",
    chainname : "Ropsten Test Network",
    chainnetname : "RPS",
    chainsymbol : "ETH",
    chaindecimals : 18
  },
  {
    chaind : 97,
    rpcurl : "https://data-seed-prebsc-1-s1.binance.org:8545",
    blockurl : "https://testnet.bscscan.com/",
    chainname : "Bnb Chain Test net",
    chainnetname : "RPS",
    chainsymbol : "BNB",
    chaindecimals : 18
  },
]

const defaultRopstenconfig = {
  testing: false,
  autoGasMultiplier: 1.5,
  defaultConfirmations: 1,
  defaultGas: "6000000",
  defaultGasPrice: "1000000000000",
  nodetimeout:10000,
};

function web3ProviderFrom(endpoint, config) {
    const ethConfig = Object.assign(defaultRopstenconfig, config || {});
  
    const providerClass = endpoint.includes("wss")
      ? Web3.providers.WebsocketProvider
      : Web3.providers.HttpProvider;

    // console.log(ethConfig)
    // console.log(providerClass)  

    return new providerClass(endpoint, {
      timeout: ethConfig.nodetimeout,
    });
  }

export function getDefaultProvider() {
  if (!provider) {
    provider = new ethers.providers.Web3Provider(
      web3ProviderFrom(netlist[netid].rpcurl),
      netlist[netid].chaind
    );
  }

  return provider;
}

export function setNet(id) {
  netid = id;

  walletconnect = new WalletConnectConnector({
    rpc: { [netlist[netid].chaind]: netlist[netid].rpcurl},
    // http: { [netlist[netid].chaind]: netlist[netid].rpcurl },
    // infuraId:
    qrcode: true,
    pollingInterval: 12000,
  });

  // console.log("wallet connect", walletconnect);

  injected = new InjectedConnector({
    supportedChainIds: [netlist[netid].chaind],
  });

  bsc = new BscConnector({
    supportedChainIds: [netlist[netid].chaind],
  });
}

export function useWalletConnector () {

  const { activate, deactivate} = useWeb3React();
  const [provider, setProvider] = useState({});

  const setupNetwork = async () => {
    // console.log("setup")
    const provider = window.ethereum
    // console.log(provider)
    if (provider) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${netlist[netid].chaind.toString(16)}`,
              // chainName: netlist[netid].chainname,
              // nativeCurrency: {
              //   name: netlist[netid].chainnetname,
              //   symbol: netlist[netid].symbol,
              //   decimals: netlist[netid].decimals,
              // },
              // rpcUrls: [`${netlist[netid].rpcurl}`],
              // blockExplorerUrls: [`${netlist[netid].blockurl}`],
            },
          ],
        })

        setProvider(provider);
        return true
      } catch (error) {
        return false
      }
    } else {
      console.error("Can't setup the Default Network network on metamask because window.ethereum is undefined")
      return false
    }
  }

  const loginMetamask = async () => {
    // console.log("metamask")
    // console.log(account)
    // console.log(injected)
    loginWallet(injected)
    // loginWallet(injected)
  }

  const loginWalletConnect = async () => {
    //   console.log("walletconnector")
    loginWallet(walletconnect)
  }

  const loginBSC = async () => {
    loginWallet(bsc)
  }

  const loginWallet = useCallback( (connector) => {
    // console.log("login wallet")
    // console.log("connector", connector)

    if (connector) {
        // console.log("activate")
      activate(connector, async (error) => {       
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork()
          if (hasSetup) {
            // console.log(hasSetup)
            // console.log("setup error")
            activate(connector)
          }
        } else {
          // window.localStorage.removeItem(connectorLocalStorageKey)
          if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
            alert("Network Provide Error")
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            // if (connector instanceof WalletConnectConnector) {
            //   const walletConnector = connector as WalletConnectConnector
            //   walletConnector.walletConnectProvider = null
            // }
            alert('Authorization Error' + 'Please authorize to access your account')
          } else {
            alert(error.name + error.message)
          }
        }
      })
    } else {
      alert('Unable to find connector' + 'The connector config is wrong')
    }

    // console.log("active connector", provider);

    setProvider(connector);
  })

  const logoutWalletConnector = () => {
    deactivate(provider, async (error) => {
        console.log(error)
        return false
      });
      return true
  }

  const logoutMetamask = () => {
    deactivate(injected, async (error) => {
      console.log(error)
      return false
    });
    return true
  }

  const logoutWalletConnect = () => {
    deactivate(walletconnect, async (error) => {
      console.log(error)
      return false
    });
    return true
  }

  const logoutBSC = () => {
    deactivate(bsc, async (error) => {
    //   console.log(error)
      return false
    });
    return true
  }

  return {loginMetamask, 
    loginWalletConnect, 
    loginBSC, 
    logoutWalletConnector}
}