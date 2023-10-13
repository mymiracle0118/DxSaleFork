/*eslint-disable*/
//Default
import React from "react";
import { useState, useEffect } from 'react';

//Style
import { makeStyles } from "@material-ui/core/styles";
// import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";

//Group
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";

//Icon
import Accessibility from "@material-ui/icons/Accessibility";
import CardIcon from "../../components/Card/CardIcon.js";
import Warning from "@material-ui/icons/Warning";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SecurityUpdateWarningIcon from '@mui/icons-material/SecurityUpdateWarning';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Checkbox from '@mui/material/Checkbox';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

//Typography
import Danger from "../../components/Typography/Danger.js";
import Success from "../../components/Typography/Success.js";
import Primary from "../../components/Typography/Primary.js";
import Info from "../../components/Typography/Info.js";

//Component
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import AlertDialog from "../../components/AlertDlg/Alert.js";
import ProgressDlg from "../../components/AlertDlg/ProgressDlg.js";
import FeeInfo from "../../components/CreateToken/FeeInfo.js";
import CreateToken from "../../components/CreateToken/CreateToken.js";
import LoadTokens from "../../components/CreateToken/LoadTokens.js";

//Input
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

//Constant ABI
import { CREATE_TOKEN_ABI } from '../../Config/config.js';

//Constant Address
import { CREATE_TOKEN_MANAGE_ADDRESS } from '../../Config/config.js';

//Web3
//Web3 Interface
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, BigNumber as EthersBigNumber } from 'ethers';
import coinAddressValidator from 'coin-address-validator';
import { hexZeroPad } from "@ethersproject/bytes";
import BigNumber from 'bignumber.js'
import { utils } from "ethers";

import { getDefaultProvider } from "../../components/WalletConnector.js";
import isValidAddress from "../../components/AddressValidator.js";  

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

let managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.bsc;

export default function CreateTokenMain() {

    const {account, library} = useWeb3React();   
    
    //Alert Dlg
    const [dlgshow, setDlgshow] = useState(false);
    const [errorstr, setErrorStr] = useState("Error");

    //Progress Dlg
    const [progressdlg_flag, setProgressDlgFlag] = useState(false);
    const [progress_str, setProgressDlgStr] = useState("Starting");

    const [tokenList, setTokenList] = useState([]);

    const [coin, setCoin] = useState("");

    const [dashboard, setDashboard] = useState(false);

    const [outlinflag_create, setOutlineCreate] = useState('contained');
    const [outlinflag_dashboard, setOutlineDashboard] = useState('outlined');

    const classes = useStyles();

    const [feeInfo, setFeeInfo] = useState({
      normal:"NAN",
      mint:"NAN",
      burn:"NAN",
      pause:"NAN",
      blacklist:"NAN",
      deflation:"NAN",
      curfee:"NAN",
    })

    const ErrorDlgShow = (flag, alertstr) => {
      setErrorStr(alertstr);
      setDlgshow(flag);
    }

    const ProgressDlgShow = (flag, alertstr) => {
      setProgressDlgStr(alertstr);
      setProgressDlgFlag(flag);
    }

    const onClose = () => {
      ErrorDlgShow(false, "");
    }

    useEffect( () => {

      // async function getFee() {
      //   await getFeeInfo();
      // }

      if(!library) {
        return;
      }

      if(!library._network) {
        return
      }

      if(library._network.chainId === 3) {
        setCoin('ETH');
        managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.eth;
      } else if(library._network.chainId === 97) {
        setCoin('BNB');
        managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.bsc;
      }

      if (account !== undefined) {
        // getFee();
        return;
      }
      // getPrice();
    }, [account, library])

    useEffect(()=> {

      async function getFee() {
        await getFeeInfo();
      }

      if(!library) {
        return;
      }

      if(!library._network) {
        return
      }

      if(library._network.chainId === 3) {
        setCoin('ETH');
        managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.eth;
      } else if(library._network.chainId === 97) {
        setCoin('BNB');
        managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.bsc;
      }

      if(!account) {
        ErrorDlgShow(true, "Wallet is unconnected");
      } else {
        getFee();
      }
      
    }, [])

    const connectContract = async (tokenabi, tokenaddr) => {

      let provider  =  await getDefaultProvider();
      let tempcontract;
  
      if(!library) {
        ErrorDlgShow(true, "Wallet is unconnected");
        return;
      }
  
      if(!library._network) {
        ErrorDlgShow(true, "Wallet is unconnected");
        return;
      }
  
      const isEthAddress = coinAddressValidator.validate(tokenaddr, 'eth', 'prod');
  
      if( !isEthAddress ) {
        // setErrLabel("Token address is invalied");
        ErrorDlgShow(true, "Address is invalid");
        return null
      }
  
      try {
        tempcontract = new Contract(tokenaddr, tokenabi, provider);
      } catch (error) {
        // console.log(error)
        // setErrLabel("Contract connect error");
        return null
      }

      return tempcontract;
    }
  
    const CreateManageContract = async () => {
      let manageContract;
  
      if(!library || !account)
      {
        ErrorDlgShow(true, "Wallet is unconnected");
        return null
      }
  
      manageContract = await connectContract(CREATE_TOKEN_ABI.manage, managecontractAddr);
  
      if(!manageContract)
      {
        ErrorDlgShow(true, "Manage Contract connect error");
        ProgressDlgShow(false, "");
        return null
      }
        
      let signer = await library.getSigner();
   
      if (signer) {
        try {
          manageContract = await manageContract.connect(signer);
          return manageContract
        } catch (error) {
          ErrorDlgShow(true, "Manage Contract signer connect error");
          ProgressDlgShow(false, "");
        }
      }
      else {
        return null
      }
    }

    const createStandardToken = async (standard_info) => {

      let manage_contract;
  
      if(!account) {
        ErrorDlgShow(true, "Wallet is unconnected");
        ProgressDlgShow(false, "");
        return
      }

      ProgressDlgShow(true, "Creating");

      manage_contract = await CreateManageContract();
  
      if(!manage_contract) {
        ErrorDlgShow(true, "Manage contract connect error");
        ProgressDlgShow(false, "");
        return 
      }

      let overrid = {
        value:ethers.utils.parseUnits (feeInfo.curfee, 18),
      }

      // console.log("info", standard_info);
      //Set Create Fee & Address
      try {
          await manage_contract.createStandard(standard_info.owner, 
          standard_info.name, 
          standard_info.symbol, 
          parseInt(standard_info.decimal), 
          ethers.utils.parseUnits(standard_info.totalsupply.toString(), parseInt(standard_info.decimal)),
          parseInt(standard_info.mint),  
          parseInt(standard_info.burn), 
          parseInt(standard_info.pause), 
          parseInt(standard_info.blacklist), 
          overrid);
  
          await manage_contract.on("CreateStandardSuccess", (tokenaddr) => {
              // setProgressFlag(false);
              // getStandardTokenBalance(erctokenaddr);
              // console.log(tokenaddr);
              ErrorDlgShow(true, "Your New Contract Address\n" + tokenaddr);
              ProgressDlgShow(false, "");
              // getInfo();
          });
  
      } catch (error) {
        // console.log("Creatiing error", error)
        ErrorDlgShow(true, "Create token Error");
        ProgressDlgShow(false, "");
        return;
      }
    }

    const createLiqudityToken = async (standard_info, deflation_info) => {

      let manage_contract;
  
      if(!account) {
        ErrorDlgShow(true, "Wallet is unconnected");
        ProgressDlgShow(false, "");
        return
      }

      ProgressDlgShow(true, "Creating");

      manage_contract = await CreateManageContract();
  
      if(!manage_contract) {
        ErrorDlgShow(true, "Manage contract connect error");
        ProgressDlgShow(false, "");
        return 
      }

      let overrid = {
        value:ethers.utils.parseUnits (feeInfo.curfee, 18),
      }

      // console.log("overrid", overrid)
      // console.log("info", standard_info, deflation_info);
      // ProgressDlgShow(false, "");
      // return;
      //Set Create Fee & Address
      try {
          await manage_contract.createLiuidity(standard_info.owner,
          deflation_info.tax_address, 
          standard_info.name, 
          standard_info.symbol, 
          parseInt(standard_info.decimal), 
          ethers.utils.parseUnits(standard_info.totalsupply.toString(), parseInt(standard_info.decimal)),
          parseInt(deflation_info.flag), 
          [parseInt(deflation_info.tax_fee), 
          parseInt(deflation_info.burn_fee), 
          parseInt(deflation_info.hold_fee), 
          parseInt(deflation_info.lp_fee)],
          parseInt(standard_info.mint),  
          parseInt(standard_info.burn), 
          parseInt(standard_info.pause), 
          parseInt(standard_info.blacklist),
          overrid);
  
          await manage_contract.on("createLiquditySuccess", (tokenaddr) => {
              // setProgressFlag(false);
              // getStandardTokenBalance(erctokenaddr);
              // console.log(tokenaddr);
              ErrorDlgShow(true, "Your New Contract Address\n" + tokenaddr);
              ProgressDlgShow(false, "");
              // getInfo();
          });
  
      } catch (error) {
        console.log("Creatiing error", error)
        ErrorDlgShow(true, "Create token Error");
        ProgressDlgShow(false, "");
        return;
      }
    }

    const getFeeInfo = async () => {

      let manage_contract;

      if(!account) {
        ErrorDlgShow(true, "Wallet is unconnected");
        ProgressDlgShow(false, "");
        return
      }

      manage_contract = await CreateManageContract();

      if(!manage_contract) {
        ErrorDlgShow(true, "manage contract connect error");
        ProgressDlgShow(false, "");
        return 
      }

      let fee;

      try {
        fee = await manage_contract.fee();
        // console.log("fee",fee);
      } catch (error) {
        console.log(error)
        ErrorDlgShow(true, "Get Fee Information Error");
        ProgressDlgShow(false, "");
        return;
      }

      setFeeInfo(previousInputs => ({ ...previousInputs,
        normal:ethers.utils.formatUnits ( fee.normal , 18 ),
        mint:ethers.utils.formatUnits ( fee.mint , 18 ),
        burn:ethers.utils.formatUnits ( fee.burn , 18 ),
        pause:ethers.utils.formatUnits ( fee.pause , 18 ),
        blacklist:ethers.utils.formatUnits ( fee.blacklist , 18 ),
        deflation:ethers.utils.formatUnits ( fee.deflation , 18 ),
      }));
      
      // console.log("normal fee", feeInfo.curfee);
      if(feeInfo.curfee === "NAN" ) {
        setFeeInfo(previousInputs => ({ ...previousInputs,
          curfee:ethers.utils.formatUnits ( fee.normal , 18 )
        }));
      }
    }

    const createStandardContract = async (addr) => {
      let tokenContract;

      if(!library || !account)
      {
        return null
      }

      tokenContract = await connectContract(CREATE_TOKEN_ABI.standard, addr);

      if(!tokenContract)
      {
        return null
      }

      let signer = await library.getSigner();
  
      if (signer) {
        try {
          tokenContract = await tokenContract.connect(signer);
        } catch (error) {
          console.log(error)
          return null;
        }
      }
      else {
        return null
      }
      return tokenContract
    }

    const createLiquidityContract = async (addr) => {
      let tokenContract;

      if(!library || !account)
      {
        return null
      }

      tokenContract = await connectContract(CREATE_TOKEN_ABI.liquidity, addr);

      if(!tokenContract)
      {
        return null
      }

      let signer = await library.getSigner();
  
      if (signer) {
        try {
          tokenContract = await tokenContract.connect(signer);
        } catch (error) {
          console.log(error)
          return null;
        }
      }
      else {
        return null
      }
      return tokenContract
    }

    const getTokenInfo = async (address) => {
      // debugger
      let tokencontract;
      if(!account) {
        ErrorDlgShow(true, "Wallet is unconnected");
        ProgressDlgShow(false, "");
        return null
      }

      tokencontract = await createStandardContract(address);

      if(!tokencontract) {
        ErrorDlgShow(true, "token contract connect error");
        ProgressDlgShow(false, "");
        return null
      }

      let name, symbol, supply, balance, decimal, type;
      let state;

      try {
        type = await tokencontract.isstandard();
        name = await tokencontract.name();
        decimal = await tokencontract.decimals();
        symbol = await tokencontract.symbol();
        supply = await tokencontract.totalSupply();
        balance = await tokencontract.balanceOf(account);
        // if(parseInt(type) === 1) {
        state = await tokencontract.state();
        // }
        // type = await tokencontract.isstandard();
        // console.log("info", name, decimal, symbol, supply, balance, state, type);
        return {address, name, symbol, decimal, supply, balance, type, state};
      } catch (error) {
        console.log(error)
        ErrorDlgShow(true, "Get Token Information Error");
        ProgressDlgShow(false, "");
        return null;
      }
    }

    const getTokenAdresses = async (address) => {

      let manage_contract;

      if(!account) {
        ErrorDlgShow(true, "Wallet is unconnected");
        ProgressDlgShow(false, "");
        return
      }

      manage_contract = await CreateManageContract();

      if(!manage_contract) {
        ErrorDlgShow(true, "manage contract connect error");
        ProgressDlgShow(false, "");
        return 
      }

      let tokenlists;

      try {
        tokenlists = await manage_contract.getCreatedToken(address);
        // console.log("tokens",tokens);
        // console.log(tokenlists.length);
        setTokenList([]);
        let tokens = [];
        for(let i = 0; i < tokenlists.length; i++) {
          let token = await getTokenInfo(tokenlists[i]);
          if(token) {
            tokens.push(token);
          } else {
            return;
          }
        }
        setTokenList(tokens);
        ProgressDlgShow(false, "");
        // console.log(item);
      } catch (error) {
        console.log(error)
        ErrorDlgShow(true, "Get Token Information Error");
        ProgressDlgShow(false, "");
        return;
      }
    }

    const getTokens = () => {
      ProgressDlgShow(true, "Loading");
      getTokenAdresses(account);
    }

    const changeFeeInfo = (name, flag) => {

      let select_fee, prev_fee;
      if(feeInfo[name] === "NAN" ) {
        ErrorDlgShow(true, "You should know " + name + " fee");
        return false;
      }      
      select_fee = ethers.utils.parseUnits (feeInfo[name], 18);
      prev_fee = ethers.utils.parseUnits (feeInfo.curfee, 18);

      if(flag) {
        setFeeInfo({
          ...feeInfo,
          curfee: ethers.utils.formatUnits(prev_fee.add(select_fee)),
        });
      } else {
        setFeeInfo({
          ...feeInfo,
          curfee: ethers.utils.formatUnits(prev_fee.sub(select_fee)),
        });
      }

      return true;
    }

    const CreateButtonClick = () => {
      setOutlineCreate('contained');
      setOutlineDashboard("outlined");
      setDashboard(false);
    }

    const DashboardButtonClick = () => {
      setOutlineCreate('outlined');
      setOutlineDashboard("contained");
      setDashboard(true);
      getTokens();
    }

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={2}>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            {/* <Info></Info> */}
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Stack direction="row" spacing={1}>
              <Button color="secondary" variant={outlinflag_create} onClick={(e) => CreateButtonClick()} startIcon={<AddCircleIcon />}>
                Create
              </Button>
              <Button color="secondary" variant={outlinflag_dashboard} onClick={(e) => DashboardButtonClick()} endIcon={<SendIcon />}>
                Load
              </Button>
            </Stack>
          </GridItem>
        </GridContainer>
        <p />
        <Divider textAlign="center"></Divider>
        <GridContainer justifyContent="center">
          {!dashboard && 
            <GridItem xs={12} sm={12} md={8}>
              <CreateToken createStandardToken={createStandardToken} createLiqudityToken={createLiqudityToken} changeFeeInfo={changeFeeInfo} user_addr={account}/>
            </GridItem>
          }
          {dashboard && 
            <GridItem xs={12} sm={12} md={12}>
              <LoadTokens getTokens={getTokens} tokenListInfo={tokenList} />
            </GridItem>
          }
          {!dashboard && 
            <GridItem xs={12} sm={6} md={3}>
            <FeeInfo fee={feeInfo} cur_coin={coin} getFeeInfo={getFeeInfo}/>
            </GridItem>
          }
          <AlertDialog open={dlgshow} onClose={onClose} alerttext={errorstr}/>
          <ProgressDlg open={progressdlg_flag} alerttext={progress_str} />
        </GridContainer>
      </div>
    );
}

//Web3 Deply
// Deployment is asynchronous, so we use an async IIFE
// const CreateERC20 = async (tokeninfo) => {

//     // Load the wallet to deploy the contract without wallet app
//     // let provider  =  getDefaultProvider();
//     // let privateKey = 'ada937d7ed1f699e53ce59a5ce50c3f74f7e40390993ffd065bfe6bd8e5ba3df';
//     // let wallet = new ethers.Wallet(privateKey, provider);

//     // console.log("create token");

//     setProgressFlag(true);

//     let factory, contract;

//     try {
//       // Create an instance of a Contract Factory
//       factory = new ethers.ContractFactory(CreateERC20TokenABI, CreateERC20TokenBytecode, library.getSigner());

//       // Notice we pass in "Hello World" as the parameter to the constructor

//       let temp = EthersBi
// gNumber.from(tokeninfo.totalsupply)
//       if(tokeninfo.decimal > 9) {
//         let count = tokeninfo.decimal / 9;
//         // console.log(count);
//         for (let index = 0; index < Math.floor(count); index++) {
//           // console.log(index);
//           temp = temp.mul(EthersBigNumber.from(1e9));              
//         }
//         temp = temp.mul(EthersBigNumber.from(10 ** (tokeninfo.decimal % 9)));
//       }
//       // console.log(temp.toString());
//       contract = await factory.deploy(tokeninfo.owneraddr, tokeninfo.name, tokeninfo.symbol, tokeninfo.decimal, temp);

//       // Done! The contract is deployed.
//       await contract.on("Transfer", (address1, address2, num) => {
//         // setProgressFlag(false);
//         // getLpBalance(lptokenaddr);
//         console.log("token created");

//         setProgressFlag(false);
//         setState("Token Create succeed.");
//         setStateflag(true);
//         setTokenAddr(contract.address);
//         setAddrShow(true);
        

//         if(library._network.chainId === 3) {
//           setScanUrl("https://ropsten.etherscan.io/address/" + contract.address);
//         } else if(library._network.chainId === 97) {
//           // console.log("bsc chain id")
//           setScanUrl("https://testnet.bscscan.com/address/" + contract.address);
//         }
        
//         // The address the Contract WILL have once mined
//         // console.log(contract.address);

//         // The transaction that was sent to the network to deploy the Contract
//         // console.log(contract.deployTransaction.hash);

//       });

//     } catch (error) {
//       // console.log("Token create error");
//       console.log(error);
//       setProgressFlag(false);
//       setState("Token Create Error");
//       setStateflag(true);
//     }
// };
