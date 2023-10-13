//Default
import React from "react";
import { useState, useEffect } from 'react';

//Style
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../../components/Loader/Loader.js";
import CircularProgress from '@mui/material/CircularProgress';

//Group
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";

import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import CardAvatar from "../../components/Card/CardAvatar.js";
import CardFooter from "../../components/Card/CardFooter.js";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

//Input
import TextField from '@mui/material/TextField';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import { Label, Input } from 'reactstrap';
import Button from '@mui/material/Button';

//Component
import CustomInput from "../../components/CustomInput/CustomInput.js";
import InputPresaleInfo from "../../components/Presale/Input/InputPresaleInfo.js";
import ConfirmDlg from "../../components/Presale/Input/Confirm.js";
import Divider from '@mui/material/Divider';
import AlertDialog from "../../components/AlertDlg/Alert.js";
import ProgressDlg from "../../components/AlertDlg/ProgressDlg.js";
import PresaleList from "../../components/Presale/Market/PresaleList.js";
import PersonalPresale from "../../components/Presale/Market/PersonalPresale.js";

//Color
import Danger from "../../components/Typography/Danger.js";
import Success from "../../components/Typography/Success.js";
import Primary from "../../components/Typography/Primary.js";
import Info from "../../components/Typography/Info.js";

//Icon
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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

//Constant ABI
import { STANDARD_TOKEN_ABI } from '../../Config/config.js';
import { TOKEN_LOCK_ABI } from '../../Config/config.js';
import { PRESALE_ABI } from '../../Config/config.js';

//Constant Address
import { PRESALE_MANAGE_ADDRESS } from '../../Config/config.js';
import { listClasses } from "@mui/material";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

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

let managecontractAddr = PRESALE_MANAGE_ADDRESS.bsc;//Metamask

let tokenaddr;
let loadflag = false;
let filter_count_global = 0;

export default function Presale() {

  const classes = useStyles();

  //State Var

  //Get Token Info
  const [progressflag, setProgressFlag] = useState(false);
  const [erroflag, setErroShow] = useState(false);
  const [errlabel, setErrLabel] = useState("Some errors were emerged!");
  const [nextactive, setNextActiveFlag] = useState(false);
  const [outlinflag_create, setOutlineCreate] = useState('outlined');
  const [outlinflag_dashboard, setOutlineDashboard] = useState('contained');
  const [panelflag, setPanelFalg] = useState(false);
  const [confirmflag, setConfirmflag] = useState(false);
  const [tokeninfo, setTokenInfo] = useState({
        name:"none", 
        symbol:"none", 
        decimal:0, 
        balance:0,
        userbalance:0, 
        });
  const [fee_info, setFeeInfo] = useState({});
  const [lock_fee, setLockFee] = useState(0);

  const {account, library} = useWeb3React();

      
  //Alert Dlg
  const [dlgshow, setDlgshow] = useState(false);
  const [errorstr, setErrorStr] = useState("Error");

  //Progress Dlg
  const [progressdlg_flag, setProgressDlgFlag] = useState(false);
  const [progress_str, setProgressDlgStr] = useState("Starting");

  const [submitactive, setSubmitActive] = useState(true);
  const [dashboardflag, setDashBoardFlag] = useState(true);
  const [presale_count, setPresaleCount] = useState(0);
  const [presale_info, setPresaleInfo] = useState([]);
  const [list_index, setListIndex] = useState(0);
  const [personalflag, setPersonalFlag] = useState(false);
  const [personal_data, setPersonData] = useState({});
  const [listfiltercount, setListFilterCount] = useState(0);

  const [coin, setCoin] = useState("ETH");

  // const [coin, setCoin] = useState("Ropsten");

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

    filter_count_global = 0;

    if(!library) {
      return;
    }
    if(!library._network) {
      return
    }
    if(library._network.chainId === 3) {
      setCoin('ETH');
      managecontractAddr = PRESALE_MANAGE_ADDRESS.eth;
    } else if(library._network.chainId === 97) {
      setCoin('BNB');
      managecontractAddr = PRESALE_MANAGE_ADDRESS.bsc;
    }

    if (account !== undefined) {
      // getPresales();
      return;
    }

    // getPrice();
  }, [account, library])

  useEffect(()=> {

    // async function getPresales() {
    //   await loadPresales(4);
    // }
    filter_count_global = 0;
    
    if(!library) {
      return;
    }
    
    if(!library._network) {
      return
    }

    if(library._network.chainId === 3) {
      setCoin('ETH');
      managecontractAddr = PRESALE_MANAGE_ADDRESS.eth;
    } else if(library._network.chainId === 97) {
      setCoin('BNB');
      managecontractAddr = PRESALE_MANAGE_ADDRESS.bsc;
    }

    async function getPresales() {
      await loadPresales(0, 4, 0);
    }

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
    } else {
      getPresales();
    }   
  }, [])

  const connectContract = async (tokenabi, tokenaddr) => {

    let provider  =  await getDefaultProvider();
    let tempcontract;

    // console.log("default provier", provider);

    if(!library) {
      ErrorDlgShow(true, "Wallet is unconnected");
      return;
    }

    // console.log("library", library);

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
      // setErrLabel("Contract connect error");
      return null
    }
    return tempcontract;
  }

  const createStandardContract = async (addr) => {
    let tokenContract;

    if(!library || !account)
    {
      return null
    }

    tokenContract = await connectContract(STANDARD_TOKEN_ABI, addr);

    if(!tokenContract)
    {
      setErrLabel("Standard Contract connect error");
      return null
    }

    let signer = await library.getSigner();
 
    if (signer) {
      try {
        tokenContract = await tokenContract.connect(signer);
      } catch (error) {
        setErrLabel("Standard Contract Signer connect error");
        return null;
      }
    }
    else {
      return null
    }
    return tokenContract
  }

  const CreateManageContract = async () => {
    let manageContract;

    if(!library || !account)
    {
      ErrorDlgShow(true, "Wallet is unconnected");
      return null
    }

    manageContract = await connectContract(PRESALE_ABI.manage, managecontractAddr);

    // console.log("defuult provider contract", manageContract);

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

   const CreateSettingContract = async () => {
    
    let manage_contract; 
    let setting_contract;
    let setting_contract_addr;
    
    if(!library || !account)
    {
      ErrorDlgShow(true, "Wallet is unconnected");
      return null
    }

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      ErrorDlgShow(true, "Manage Contract Create Error");
      ProgressDlgShow(false, "");
      return 
    }

    // try {
    setting_contract_addr = await manage_contract.presale_setting_addr();
    if(setting_contract_addr) {
      setting_contract = await connectContract(PRESALE_ABI.setting, setting_contract_addr);
    };
    
    // } catch (err) {
    //   // console.log('Lock token error');
    //   ErrorDlgShow(true, "Get Token Fee Info error");
    //   ProgressDlgShow(false, "");
    //   return;
    //   // console.log(err);
    // }

    if(!setting_contract) {
      ErrorDlgShow(true, "Setting Contract Connect Error");
      ProgressDlgShow(false, "");
      return 
    }
      
    let signer = await library.getSigner();
 
    if (signer) {
      try {
        setting_contract = await setting_contract.connect(signer);
        return setting_contract
      } catch (error) {
        ErrorDlgShow(true, "Setting Contract Signer connect error");
        ProgressDlgShow(false, "");
      }
    }
    else {
      return null
    }
  }

  const CreateLockforwarderContract = async () => {
    
    let manage_contract; 
    let lock_contract;
    let lock_contract_addr;
    
    if(!library || !account)
    {
      ErrorDlgShow(true, "Wallet is unconnected");
      return null
    }

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      ErrorDlgShow(true, "Manage Contract Create Error");
      ProgressDlgShow(false, "");
      return 
    }

    try {
      lock_contract_addr = await manage_contract.presale_setting_addr();
      lock_contract = connectContract(PRESALE_ABI.lockforwarder, lock_contract_addr);
    } catch (err) {
      // console.log('Lock token error');
      ErrorDlgShow(true, "Lockforder contract connect error");
      ProgressDlgShow(false, "");
      return;
      // console.log(err);
    }

    if(!lock_contract) {
      ErrorDlgShow(true, "Lockforwarder Contract Connect Error");
      ProgressDlgShow(false, "");
      return 
    }
      
    let signer = library.getSigner();
 
    if (signer) {
      try {
        lock_contract = lock_contract.connect(signer);
        return lock_contract
      } catch (error) {
        ErrorDlgShow(true, "Lockforwarder Contract Signer connect error");
        ProgressDlgShow(false, "");
      }
    }
    else {
      return null
    }
  }

   const CreatePresaleContract = async (address) => {
    
    let presale_contract; 
    
    if(!library || !account)
    {
      ErrorDlgShow(true, "Wallet is unconnected");
      ProgressDlgShow(false, "");
      return null
    }

    try {
      presale_contract = await connectContract(PRESALE_ABI.presale, address);
    } catch (err) {
      // consolg('Lock token error');
      ErrorDlgShow(true, "Create Presale Contrace connect Error");
      ProgressDlgShow(false, "");
      return;
      // console.log(err);
    }

    if(!presale_contract) {
      ErrorDlgShow(true, "Presale Connect connect Error");
      ProgressDlgShow(false, "");
      return 
    }
      
    let signer = await library.getSigner();
 
    if (signer) {
      try {
        presale_contract = await presale_contract.connect(signer);
        return presale_contract
      } catch (error) {
        ErrorDlgShow(true, "Presale Contract signer connect error");
        ProgressDlgShow(false, "");
      }
    }
    else {
      return null
    }
  }

  const getStandardTokenBalance = async (address) => {
    // let web3 = new Web3(window.web3.currentProvider);

    setProgressFlag(true)
    setNextActiveFlag(false)
    setErroShow(false)

    let token;
    let res;

    setTokenInfo(previousInputs => ({ ...previousInputs, name: "none" }))
    setTokenInfo(previousInputs => ({ ...previousInputs, symbol: "none" }))
    setTokenInfo(previousInputs => ({ ...previousInputs, decimal: 0 }))
    setTokenInfo(previousInputs => ({ ...previousInputs, balance: 0 }))
    setTokenInfo(previousInputs => ({ ...previousInputs, userbalance: 0 }))

    if(!account) {
      setErrLabel("Wallet is unconnected");
      setProgressFlag(false)
      setErroShow(true)
      return
    }
    
    try {
      res = await library.getCode(address)
    } catch (error) {
      res = '';
      // console.log("token address invalid");
      setErrLabel("token address invalid");
      // console.log(error);
      setProgressFlag(false)
      setErroShow(true)
      return
    }

    if (res !== '0x') {
    } else {
      setErrLabel("token address invalid");
      setProgressFlag(false)
      setErroShow(false)
    }

    token = await createStandardContract(address);

    if(!token) {
      setProgressFlag(false)
      setErroShow(true)
      return 
    }

    let tsymbol, tname, tdecimals, tbalance;

    let userbalance = await library.getBalance(account);

    try {
      tdecimals = await token.decimals();
      tbalance = await token.balanceOf(account);
      tsymbol = await token.symbol();
      tname = await token.name();
    } catch (error) {
      // console.log('Get Information Error');
      setErrLabel("Get Standard Token Information Error");
      // console.log(error);
      setProgressFlag(false)
      setNextActiveFlag(false)
      setErroShow(true)
      return;
    }

    setTokenInfo(previousInputs => ({ ...previousInputs, name: tname }))
    setTokenInfo(previousInputs => ({ ...previousInputs, symbol: tsymbol }))
    setTokenInfo(previousInputs => ({ ...previousInputs, decimal: tdecimals }))
    setTokenInfo(previousInputs => ({ ...previousInputs, balance: ethers.utils.formatUnits ( tbalance , tdecimals ) }))
    setTokenInfo(previousInputs => ({ ...previousInputs, userbalance: ethers.utils.formatUnits ( userbalance , 18 ) }))

    setProgressFlag(false)
    setNextActiveFlag(true)
  };

  const getTokenInfo = async (address) => {
    tokenaddr = address;
    getStandardTokenBalance(address);
  }

  const getPair = async (tokenaddress) => {

    let lock_contract;

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
      ProgressDlgShow(false, "");
      return
    }

    lock_contract = await CreateLockforwarderContract();

    if(!lock_contract) {
      ErrorDlgShow(true, "Lockforwarder contract connect error");
      ProgressDlgShow(false, "");
      return 
    }

    let pairaddress;

    try {
      pairaddress = await lock_contract.locked_lp_tokens(tokenaddress);
      ErrorDlgShow(true, pairaddress);
      ProgressDlgShow(false, "");
    } catch (error) {
      console.log(error)
      ErrorDlgShow(true, "Get Pair Address Error");
      ProgressDlgShow(false, "");
      return;
    } 
  }

  const getFeeInfo = async () => {

    let setting_contract;

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
      ProgressDlgShow(false, "");
      return
    }

    setting_contract = await CreateSettingContract();

    if(!setting_contract) {
      ErrorDlgShow(true, "setting contract connect error");
      ProgressDlgShow(false, "");
      return 
    }

    let feeinfo, lockfee;

    try {
      feeinfo = await setting_contract.info();
      setFeeInfo(feeinfo);
    } catch (error) {
      ErrorDlgShow(true, "Get Fee Information Error");
      ProgressDlgShow(false, "");
      return;
    }

    try {
      lockfee = await setting_contract.getLockFee();
      setLockFee(lockfee);
    } catch (error) {
      ErrorDlgShow(true, "Get Lock Fee Information Error");
      ProgressDlgShow(false, "");
      return;
    }
  }

  const approveToken = async (taddress, amount) => {

    let token;

    setSubmitActive(true);

    ProgressDlgShow(true, "Approving");

    token = await createStandardContract(taddress);

    if(!token) {
      ErrorDlgShow(true, "Standard Contract Connect Error");
      ProgressDlgShow(false, "");
      return 
    }

    try {
      await token.approve(managecontractAddr, ethers.utils.parseUnits(amount.toString(), tokeninfo.decimal));
      await token.on("Approval", (address1, address2, num) => {
        // setProgressFlag(false);
        // getStandardTokenBalance(erctokenaddr);
        //ErrorDlgShow(true, "Approve Success!");
        ProgressDlgShow(false, "");
        setSubmitActive(false);
      });
    } catch (err) {
      // console.log(err)
      ErrorDlgShow(true, "Approve Error");
      ProgressDlgShow(false, "");
      return;
    }
  };

  // const ConvertExplorerLink = async (address) => {
  //   if(!library) {
  //     return address;
  //   }

  //   if(!library._network) {
  //     return address;
  //   }

  //   if(library._network.chainId === 3) {
  //     return "https://ropsten.etherscan.io/address/" + address.toString();
  //   } else if(library._network.chainId === 97) {
  //     // console.log("bsc chain id")
  //     return "https://testnet.bscscan.com/address/" + address.toString();
  //   }
  // }

  const getPresaleCount = async () => {
    let manage_contract;
    let count;

    // ProgressDlgShow(true, "Getting Count");

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      // ProgressDlgShow(false, "Getting Count");
      ErrorDlgShow(true, "Manage Contract Connect Error");
      ProgressDlgShow(false, "");
      return -1;
    }

    // console.log("cpntract", manage_contract)

    try {
      count = await manage_contract.getCount();
      // ProgressDlgShow(false, "Getting Count");  
      // ErrorDlgShow(true, );
      // console.log("count", count);
      // setPresaleCount(count);
      return count;
    } catch (err) {
      // ProgressDlgShow(false, "Getting Count");
      console.log("get count error", err)
      ErrorDlgShow(true, "Getting Count Error");
      ProgressDlgShow(false, "");
      return -1;
    }
  }

  const getPresaleState = async (address, pindex, filter) => {
    let presale_contract;
    let available_flag;

    presale_contract = await CreatePresaleContract(address);

    if(!presale_contract) {
      // ProgressDlgShow(false, "");
      ErrorDlgShow(true, "Presale Contract Connect Error");
      ProgressDlgShow(false, "");
      return -1;
    }

    try {
      available_flag = await presale_contract.presaleStatus();
      return available_flag;
    } catch (err) {
      // console.log(err)
      // ProgressDlgShow(false, "");
      ErrorDlgShow(true, "Getting Presale Info Error");
      ProgressDlgShow(false, "");
      return -1;
    }
  }

  const getPresaleInfo = async (address, pindex) => {
    let presale_contract;

    let info;
    let status;
    let link;
    let available_flag;
    let tokeninfo;
    // let tokensymbol;
    let buyerinfo;

    // ProgressDlgShow(true, "Getting Info");
    // console.log(address)
    presale_contract = await CreatePresaleContract(address);

    // console.log(presale_contract)

    if(!presale_contract) {
      // ProgressDlgShow(false, "");
      ErrorDlgShow(true, "Presale Contract Connect Error");
      ProgressDlgShow(false, "");
      return null;
    }

    try {
      available_flag = await presale_contract.presaleStatus();
      status = await presale_contract.status();
      info = await presale_contract.presale_info();
      link = await presale_contract.link();
      tokeninfo = await presale_contract.tokeninfo();
      // tokensymbol = await presale_contract.getTokenSymbol();
      buyerinfo = await presale_contract.buyers(account);

      let tempPresaleInfoArray = {
        index:pindex,
        info:info,
        status:status,
        link:link,
        available_flag: available_flag,
        address:address,
        buyerinfo:buyerinfo,
        tokeninfo,
        link
      }
      // console.log("getinfo", tempPresaleInfoArray);
      // console.log(tempPresaleInfoArray);
      if(pindex >= 0) {
        setPresaleInfo( (prevState) => [...prevState, tempPresaleInfoArray] );
        return tempPresaleInfoArray;
      }
      // console.log("getinfo", tempPresaleInfoArray);
      return tempPresaleInfoArray;

      // console.log("--------------");

    } catch (err) {
      // console.log(err)
      // ProgressDlgShow(false, "");
      ErrorDlgShow(true, "Getting Presale Info Error");
      ProgressDlgShow(false, "");
      return null;
    }
  }

  const getListCount = async (filter) => {
    let listcount = 0;
    let presale_address = "";
    let filtercount = 0;
    let index;
    let state;

    listcount = await getPresaleCount();

    for (index = 0; index < listcount; index++) {

      presale_address = await getPresaleAddress(index);

      state = await getPresaleState(presale_address);

      if(parseInt(state) === -1)
        return -1;
      if(filter === 0 || parseInt(state) === filter)
        filtercount++;
    }

    return filtercount;
  }

  const getPresaleAddress = async (index) => {
    let manage_contract;
    let address;
    // console.log(index)
    // ProgressDlgShow(true, "Getting Presale Address");

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      ErrorDlgShow(true, "Manage Contact Connect Error");
      ProgressDlgShow(false, "");
      return null;
    }

    try {
      address = await manage_contract.getPresaleAt(index);
    } catch (err) {
      ErrorDlgShow(true, "Getting Presale Address Error");
      ProgressDlgShow(false, "");
      return null;
    }
     return address;
  }

  const loadPresales = async (listindex, count, filter) => {
    // console.log("count filter", count, filter)
    let presale_address;
    let index;
    let listcount = 0;
    let state;
    let filterindex = 0;
    let filtercount = 0;

    if(loadflag) {
      ProgressDlgShow(false, "");
      return;
    }

    loadflag = true;

    ProgressDlgShow(true, "Getting Presales");

    //Get count
    listcount = await getPresaleCount();
    filtercount = await getListCount(filter);
    
    setPresaleCount(filtercount);

    // list_index = 0;
    //Load Presales
    for (index = listindex; index < listcount; index++) {
      if(filterindex >= count || index >= listcount) {
        setListIndex(index);
        setListFilterCount(filter_count_global + filterindex);
        filter_count_global += filterindex;
        ProgressDlgShow(false, "");
        loadflag = false;
        return;
      }
      presale_address = await getPresaleAddress(index);
      state = await getPresaleState(presale_address);
      if(filter === 0 || parseInt(state) === filter) {
        await getPresaleInfo(presale_address, index);
        filterindex++;
      }
    }
    ProgressDlgShow(false, "");
    setListIndex(index);
    setListFilterCount(filter_count_global + filterindex);
    filter_count_global += filterindex;
    loadflag = false;
  }

  const CreatePresale = async (info) => {

    let manage_contract;

    ProgressDlgShow(true, "Creating");

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      ErrorDlgShow(true, "Manage Contract Connect Error");
      ProgressDlgShow(false, "");
      return 
    }

    let infoarray=[];

    //Insert uint data to array
    infoarray.push(ethers.utils.parseUnits(info.presale_rate.toString(), tokeninfo.decimal));
    infoarray.push(ethers.utils.parseUnits(info.mincap.toString(), 18));
    infoarray.push(ethers.utils.parseUnits(info.maxcap.toString(), 18));
    infoarray.push(ethers.utils.parseUnits(info.softcap.toString(), 18));
    infoarray.push(ethers.utils.parseUnits(info.hardcap.toString(), 18));
    infoarray.push(info.lq_percent);
    infoarray.push(ethers.utils.parseUnits(info.listing_rate.toString(), tokeninfo.decimal));
    infoarray.push(Date.parse(info.presale_start)/1000);
    infoarray.push(Date.parse(info.presale_end)/1000);
    infoarray.push(Date.parse(info.presale_end)/1000);
    infoarray.push(Date.parse(info.lock_end)/1000);

    let crete_fee_temp = ethers.utils.formatUnits ( fee_info.presale_create_fee , 18 );
    let lock_fee_temp = ethers.utils.formatUnits ( lock_fee , 18 );
    let all_fee = parseFloat(lock_fee_temp) + parseFloat(crete_fee_temp);
    // console.log(all_fee);
    // console.log("create fee + lock fee")
    //Inser Value
    let overrides = {
      // gasLimit: 1000000,
      value:ethers.utils.parseUnits(all_fee.toString(), 18),
    };

    try {
      await manage_contract.createPresale(account, info.token_address, infoarray, info.site_link, info.github_link, info.twitter_link, info.reddit_link, info.telegram_link, overrides);
      await manage_contract.on("CreatePreslaeSuccess", (presale_address, owner) => {
        // setProgressFlag(false);
        // getStandardTokenBalance(erctokenaddr);        
        ErrorDlgShow(true, "Your Presale Address" + "\n" + presale_address);
        ProgressDlgShow(false, "");
        setSubmitActive(true);
      });
    } catch (err) {
      console.log(err)
      ErrorDlgShow(true, "Create Error");
      ProgressDlgShow(false, "");
      return;
    }
  };

  const IndividualShow = async (address) => {

    ProgressDlgShow(true, "Waiting");
    let data = await getPresaleInfo(address, -1);
    if(!data) {
      ErrorDlgShow(true, "Some Errors are emerged");
      return ;
    }
    ProgressDlgShow(false, "Waiting");

    setPersonData(data);
    setDashBoardFlag(false);
    setPersonalFlag(true);
  }

  
  const DepositAmount = async (address, amount) => {
      let presale_contract;
      let coinval;

      presale_contract = await CreatePresaleContract(address);

      ProgressDlgShow(true, "Depositing");

      if(!presale_contract) {
        // ProgressDlgShow(false, "");
        ErrorDlgShow(true, "Presale Contract Connect Error");
        ProgressDlgShow(false, "");
        return null;
      }

      let overrides = {
        // gasLimit: 1000000,
        value : ethers.utils.parseUnits( amount.toString(), 18),
      };
  
      try {
        await presale_contract.userDeposit(overrides);
        await presale_contract.on("UserDepsitedSuccess", (address0, value) => {
          // presale_contract(false);
          // getStandardTokenBalance(erctokenaddr);
          // ErrorDlgShow(true, "Deposit Success");
          // console.log("address", address);
          ProgressDlgShow(false, "");
          IndividualShow(address);
          // ErrorDlgShow(true, "Deposit Success");
          // setSubmitActive(false);
        });
      } catch (err) {
        // console.log(err)
        ProgressDlgShow(false, "");
        ErrorDlgShow(true, "Deposit Error");
        return;
      }
  }

  const claimToken = async (address) => {
      let presale_contract;
      let coinval;

      ProgressDlgShow(true, "Claiming");

      presale_contract = await CreatePresaleContract(address);

      if(!presale_contract) {
        // ProgressDlgShow(false, "");
        ErrorDlgShow(true, "Presale Contract Connect Error");
        ProgressDlgShow(false, "");
        return null;
      }

      // let overrides = {
      //   // gasLimit: 1000000,
      //   value : ethers.utils.parseUnits( amount.toString(), 18),
      // };
  
      try {
        await presale_contract.userWithdrawTokens();
        await presale_contract.on("UserWithdrawTokensSuccess", (value) => {
          // presale_contract(false);
          // getStandardTokenBalance(erctokenaddr);
          // ErrorDlgShow(true, "Claim Success");
          // ProgressDlgShow(false, "");

          ProgressDlgShow(false, "");
          IndividualShow(address);
          
          // ErrorDlgShow(true, "Deposit Success");
          // setSubmitActive(false);
        });
      } catch (err) {
        // console.log(err)
        ErrorDlgShow(true, "Claim Error");
        ProgressDlgShow(false, "");
        return;
      }
  }

  const withdraowCoin = async (address) => {
      let presale_contract;
      let coinval;

      ProgressDlgShow(true, "Withdrawing");

      presale_contract = await CreatePresaleContract(address);

      if(!presale_contract) {
        // ProgressDlgShow(false, "");
        ErrorDlgShow(true, "Presale Contract Connect Error");
        ProgressDlgShow(false, "");
        return null;
      }

      // let overrides = {
      //   // gasLimit: 1000000,
      //   value : ethers.utils.parseUnits( amount.toString(), 18),
      // };
  
      try {
        await presale_contract.userWithdrawBaseTokens();
        await presale_contract.on("UserWithdrawSuccess", (value) => {
          // presale_contract(false);
          // getStandardTokenBalance(erctokenaddr);
          // ErrorDlgShow(true, "Withdraw Success");
          ProgressDlgShow(false, "");

          IndividualShow(address);
          
          // ErrorDlgShow(true, "Deposit Success");
          // setSubmitActive(false);
        });
      } catch (err) {
        // console.log(err)
        ErrorDlgShow(true, "Withdraw Error");
        ProgressDlgShow(false, "");
        return;
      }
  }

  const addLiquidity = async (address, tokenaddress) => {
      let presale_contract;
      let coinval;

      ProgressDlgShow(true, "Liqudity Locking");

      presale_contract = await CreatePresaleContract(address);

      if(!presale_contract) {
        // ProgressDlgShow(false, "");
        ErrorDlgShow(true, "Presale Contract Connect Error");
        ProgressDlgShow(false, "");
        return null;
      }

      // let overrides = {
      //   // gasLimit: 1000000,
      //   value : ethers.utils.parseUnits( amount.toString(), 18),
      // };
  
      try {
        await presale_contract.addLiquidity();
        // console.log(flag)
        await presale_contract.on("AddLiquidtySuccess", (flag) => {
          // presale_contract(false);
          // getStandardTokenBalance(erctokenaddr)
          // ErrorDlgShow(true, "Add Liqudity Success");
          // console.log("result flag", flag);
          // if(flag === 1) {
          //   ProgressDlgShow(false, "");
          //   IndividualShow(address);
          //   // getPair(tokenaddress);
          // } else {
          //   ProgressDlgShow(false, "");
          //   IndividualShow(address);
          //   ErrorDlgShow(true, "Liqudity Add Failed");
          // }
  
          ProgressDlgShow(false, "");
          IndividualShow(address);
          // ErrorDlgShow(true, "Deposit Success");
          // setSubmitActive(false);
        });

        // await presale_contract.on("AddLiquidtyFailed", () => {
        //   ProgressDlgShow(false, "");
        //   IndividualShow(address);
        //   ErrorDlgShow(true, "Liqudity Already Exist");
        //   // getPair(tokenaddress);
        // });
      } catch (err) {
        console.log(err)
        ErrorDlgShow(true, "Add Liquidity Error");
        ProgressDlgShow(false, "");
        return;
      }
  }


  // const teststatus = async (address) => {
  //     let presale_contract;
  //     let coinval;

  //     presale_contract = await CreatePresaleContract(address);
  //     ProgressDlgShow(true, "converting");
  //     if(!presale_contract) {
  //       // ProgressDlgShow(false, "");
  //       ErrorDlgShow(true, "Presale Contract Connect Error");
  //       ProgressDlgShow(false, "");
  //       return null;
  //     }

  //     // let overrides = {
  //     //   // gasLimit: 1000000,
  //     //   value : ethers.utils.parseUnits( amount.toString(), 18),
  //     // };
  
  //     try {
  //       await presale_contract.setTempStatus(2);
  //       ProgressDlgShow(false, "");
  //       // ErrorDlgShow(true, "Success");

  //     } catch (err) {
  //       // console.log(err)
  //       // ErrorDlgShow(true, "Add Liquidity Error");
  //       ProgressDlgShow(false, "");
  //       return;
  //     }
  // }

  const InitPresaleData = () => {
    setListIndex(0);
    setPresaleCount(0);
    setListFilterCount(0);
    filter_count_global = 0;
    setPresaleInfo([]);
  }

  const getPersonalData = (index) => {
    return presale_info.find(element => element.index == index);
  }

  const CreateButtonClick = () => {
    setOutlineCreate('contained');
    setOutlineDashboard("outlined");
    setPersonalFlag(false);
    setDashBoardFlag(false);
    setConfirmflag(true);
    setNextActiveFlag(false);

    InitPresaleData();
  }

  const DashboardButtonClick = async () => { 
    setOutlineCreate('outlined');
    setOutlineDashboard("contained");
    setPersonalFlag(false);
    setDashBoardFlag(true);
    setPanelFalg(false);
    setConfirmflag(false);

    InitPresaleData();

    // load4presale(0);
    await loadPresales(0, 4, 0);

    // console.log("presaleinfo", presale_info);
    // console.log("listindex", list_index);
  }

  const load4presale = async(filter) => {
    await loadPresales(list_index, 4, filter);
  }

  const load20presale = async(filter) => {
    await loadPresales(list_index, 20, filter);
  }

  const movefirststep = () => {
    setErroShow(false);
    setPanelFalg(true);
    setConfirmflag(false);
    getFee();
  }

  const getFee = async () => {
    await getFeeInfo();
  }

  const movedashboard = () => {
      DashboardButtonClick();
  }

  const approve_presale = async (taddress, amount) => {
    // console.log("approve");
    await approveToken(taddress, amount);
  }

  const create_presale = async (info) => {
    await CreatePresale(info);
  }

  const personalShow = (index) => {
    // console.log("personal index", index);
    const data = getPersonalData(index);
    // console.log("personal", data);
    IndividualShow(data.address);
    // setPersonData(data);
    
    // setDashBoardFlag(false);
    // setPersonalFlag(true);
  }

  const validateAddress = async (address) => {
    // console.log("validate", address);
    let res;

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
      return false;
    }

    // const isEthAddress = coinAddressValidator.validate(tokenaddr, 'eth', 'prod');

    // if( !isEthAddress ) {
    //   // setErrLabel("Token address is invalied");
    //   ErrorDlgShow(true, "Address is invalid");
    //   return null
    // }
    
    try {
      res = await library.getCode(address)
    } catch (error) {
      res = '';
      ErrorDlgShow(true, "Address is invalid");
      return false;
    }

    if (res !== '0x') {
    } else {
      ErrorDlgShow(true, "Address is invalid");
      return false;
    }
    // console.log("address is valid")
    return true;
  }

  const deposit = (data) => {
    if(data.amount <= 0) {
      ErrorDlgShow(true, "Only Positive Nmber");
      return;
    }
    DepositAmount(data.address, data.amount);
  }

  const claimtoken = (address) => {
    // console.log("claim token");
    claimToken(address);
  }

  const withdraw = (address) => {
    // console.log("withdraw");
    withdraowCoin(address);
  }

  const lockliqudity = (address) => {
    // addLiquidity(address);
    addLiquidity(address);
  }

  const search = async (address) => {
    // console.log("val",validateAddress(address));
    if(await validateAddress(address)) {
      IndividualShow(address);
    }
  }

  const filter_presale = async (state) => {
    InitPresaleData();
    // load4presale(state);
    // console.log(state);
    await loadPresales(0, 4, state);
  }

  // const testbutton = (address) => {
  //   teststatus(address);
  // }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="info"> 
            <h4 className={classes.cardTitleWhite}>Presale</h4>
            <p className={classes.cardCategoryWhite}>
              Presale
            </p>                                         
          </CardHeader>
          <CardBody>
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
                    Dashboard
                  </Button>
                </Stack>
              </GridItem>
            </GridContainer>
            <div>
              {panelflag && <InputPresaleInfo progressflag={progressflag} erroflag={erroflag} errlabel={errlabel} nextactive={nextactive} getInfo={getTokenInfo} getFee={getFee} feeinfo={fee_info} lockfee={lock_fee} tokeninfo={tokeninfo} create_presale={create_presale} approve_presale={approve_presale} submitactive={submitactive} chain={coin}/>}
              {confirmflag && <ConfirmDlg movedashboard={movedashboard} movefirststep={movefirststep}/>}
            </div>
            <div>
              {dashboardflag && <PresaleList filter_presale={filter_presale} presalecount={presale_count} presaleinfo={presale_info} load4presale={load4presale} load20presale={load20presale} listcount={listfiltercount} personalShow={personalShow} search={search}/>}
              {/* {personalflag && <PersonalPresale data={personal_data} deposit={deposit} claimtoken={claimtoken} withdraw={withdraw} lockliqudity={lockliqudity} testbutton={testbutton}/>} */}
              {personalflag && <PersonalPresale user={account} data={personal_data} deposit={deposit} claimtoken={claimtoken} withdraw={withdraw} lockliqudity={lockliqudity} coin={coin}/>}
            </div>

            <AlertDialog open={dlgshow} onClose={onClose} alerttext={errorstr}/>
            <ProgressDlg open={progressdlg_flag} alerttext={progress_str} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
