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

//Input
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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

//ABI
import { PRESALE_ABI } from '../../Config/config.js';

//Constant Address
import { PRESALE_MANAGE_ADDRESS } from '../../Config/config.js';

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
  tableUpgradeWrapper: {
    display: "block",
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    MsOverflowStyle: "-ms-autohiding-scrollbar",
  },
  table: {
    width: "100%",
    maxWidth: "100%",
    marginBottom: "1rem",
    backgroundColor: "transparent",
    borderCollapse: "collapse",
    display: "table",
    borderSpacing: "2px",
    borderColor: "grey",
    "& thdead tr th": {
      fontSize: "1.063rem",
      padding: "12px 8px",
      verticalAlign: "middle",
      fontWeight: "300",
      borderTopWidth: "0",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      textAlign: "inherit",
    },
    "& tbody tr td": {
      padding: "12px 8px",
      verticalAlign: "middle",
      borderTop: "1px solid rgba(0, 0, 0, 0.06)",
    },
    "& td, & th": {
      display: "table-cell",
    },
  },
  center: {
    textAlign: "center",
  },
};

const useStyles = makeStyles(styles);
let managecontractAddr = PRESALE_MANAGE_ADDRESS.bsc;//Metamask

export default function PresaleManage() {
  const classes = useStyles();

  const [balance, setBalance] = useState(0);
  const [coin, setCoin] = useState("ETH");

  //Alert Dlg
  const [dlgshow, setDlgshow] = useState(false);
  const [errorstr, setErrorStr] = useState("Error");

  //Progress Dlg
  const [progressdlg_flag, setProgressDlgFlag] = useState(false);
  const [progress_str, setProgressDlgStr] = useState("Starting");

  const {account, library} = useWeb3React();

  const [FeeInfo, setFeeInfo] = useState([
      {
          category:"Create Fee",
          fee:0,
          address:"",
          enableflag:false,
      },
      {
          category:"Raise Fee",
          fee:0,
          address:"",
          enableflag:false,
      },
      {
          category:"Sold Fee",
          fee:0,
          address:"",
          enableflag:false,
      },
    ]); 

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

  useEffect(() => {
    // console.log("account changed")
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

    getInfo();    
  }, [account, library])

  useEffect(() => {
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

    getInfo();
  },[])

  const validateAddress = async (addr) => {
    let res;

    const isEthAddress = await coinAddressValidator.validate(addr, 'eth', 'prod');

    if( !isEthAddress ) {
      // console.log("etheraddr")
      return false
    }
    return true;
  }
  
//   const validateAddress = async (address) => {
//     // console.log("address type", typeof(address));
//     let res;

//     // debugger

//     // let validaddress = ethers.utils.getAddress(address);
//     // console.log(typeof(address));
    
//     try {
//       res = await library.getCode(address)
//     } catch (error) {
//       res = '';
//       console.log("error eeror ")
//       ErrorDlgShow(true, "Address is invalid");
//       return false;
//     }

//     console.log("result", res);

//     if (res !== '0x') {
//     } else {
//     console.log("0x error eeror ")
//       ErrorDlgShow(true, "Address is invalid");
//       return false;
//     }
//     // console.log("address is valid")
//     return true;
//   }

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

    manageContract = await connectContract(PRESALE_ABI.manage, managecontractAddr);

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

    try {
      setting_contract_addr = await manage_contract.presale_setting_addr();
      setting_contract = await connectContract(PRESALE_ABI.setting, setting_contract_addr);
    } catch (err) {
      // console.log('Lock token error');
      ErrorDlgShow(true, "Get Token Fee Info error");
      ProgressDlgShow(false, "");
      return;
      // console.log(err);
    }

    if(!setting_contract) {
      ErrorDlgShow(true, "Setting Contract Connect Error");
      ProgressDlgShow(false, "");
      return 
    }
      
    let signer = library.getSigner();
 
    if (signer) {
      try {
        setting_contract = setting_contract.connect(signer);
      } catch (error) {
        ErrorDlgShow(true, "Setting Contract Signer connect error");
        ProgressDlgShow(false, "");
      }
    }
    else {
      return null
    }
    
    return setting_contract
  }

   const SetFee = async () => {

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

    //Set Create Fee & Address
    try {
    //   ProgressDlgShow(true, "Setting Create Address");
    //   await setting_contract.setCreateFeeAddress(FeeInfo[0].address);
    //   ProgressDlgShow(true, "Setting Create Fee");
    //   await setting_contract.setSetPresaleCreateFee(ethers.utils.parseUnits(FeeInfo[0].fee.toString(), 18));
    //   ProgressDlgShow(true, "Setting Raised Fee Address");
    //   await setting_contract.setRaisedFeeAddress(FeeInfo[1].address);
    //   ProgressDlgShow(true, "Setting Raised Fee");
    //   await setting_contract.setRaisedFee(parseInt(FeeInfo[1].fee));
    //   ProgressDlgShow(true, "Setting Sold Fee Address");
    //   await setting_contract.setSoleFeeAddress(FeeInfo[2].address);
    //   ProgressDlgShow(true, "Setting Sold Fee");
    //   await setting_contract.setSoldFee(parseInt(FeeInfo[2].fee));
    //   ProgressDlgShow(true, "Waiting");
        await setting_contract.setFeeInfo(FeeInfo[0].address, FeeInfo[1].address, FeeInfo[2].address, ethers.utils.parseUnits(FeeInfo[0].fee.toString(), 18), FeeInfo[1].fee, FeeInfo[2].fee);

        await setting_contract.on("setFeeInfoSuccess", (soldfee) => {
            // setProgressFlag(false);
            // getStandardTokenBalance(erctokenaddr);
            //ErrorDlgShow(true, "Approve Success!");
            ProgressDlgShow(false, "");
            getInfo();
        });

    } catch (error) {
        // console.log("seeting error", error)
      ErrorDlgShow(true, "Setting Error");
      ProgressDlgShow(false, "");
      return;
    }

    //Set Raise Fee & Address
    // try {
    //   await setting_contract.setRaisedFeeAddress(FeeInfo[1].address);
    //   await setting_contract.setRaisedFee(FeeInfo[1].fee)
    // } catch (error) {
    //   ErrorDlgShow(true, "Set Raise Fee & Address Error");
    //   ProgressDlgShow(false, "");
    //   return;
    // }

    // //Set Sold Fee & Address
    // try {
    //   await setting_contract.setSoleFeeAddress(FeeInfo[2].address);
    //   await setting_contract.setSoldFee(FeeInfo[2].fee)
    //   await setting_contract.on()
    // } catch (error) {
    //   ErrorDlgShow(true, "Set Sold Fee & Address Error");
    //   ProgressDlgShow(false, "");
    //   return;
    // }  
  }

  const getBalance = async () => {
    let manage_contract;
 
    // ProgressDlgShow(true, "Getting Count");

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      // ProgressDlgShow(false, "Getting Count");
      ErrorDlgShow(true, "Manage Contract Connect Error");
      ProgressDlgShow(false, "");
      return 
    }

    let bal;

    try {
      bal = await manage_contract.getBalance();
      // ProgressDlgShow(false, "Getting Count");  
      // ErrorDlgShow(true, );
      // console.log("count", count);
      setBalance(ethers.utils.formatUnits ( bal , 18 ));
    } catch (err) {
      // ProgressDlgShow(false, "Getting Count");
    //   console.log(err)
      ErrorDlgShow(true, "Getting Balance Error");
      ProgressDlgShow(false, "");
      return;
    }
  }

  const withDraw = async () => {
    let manage_contract;
 
    // ProgressDlgShow(true, "Getting Count");

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      // ProgressDlgShow(false, "Getting Count");
      ErrorDlgShow(true, "Manage Contract Connect Error");
      ProgressDlgShow(false, "");
      return 
    }

    let bal;

    try {
      await manage_contract.ownerWithdraw();

      await manage_contract.on("OwnerWithdrawSuccess", (balance) => {
        console.log("balance", balance);
        ProgressDlgShow(false, "");
        getInfo();
      });
    } catch (err) {
      // ProgressDlgShow(false, "Getting Count");
    //   console.log(err)
      ErrorDlgShow(true, "Withdraw Error");
      ProgressDlgShow(false, "");
      return;
    }
  }

  const getInfo = async () => {

    const newfee = await getFeeInfo();

    // console.log("fee info", newfee);
    if(newfee == null)
        return;

    const array = [...FeeInfo];
    // debugger;
    array[0] = { ...array[0], fee: parseFloat(ethers.utils.formatUnits ( newfee.presale_create_fee , 18 )), address: newfee.create_fee_address.toString() };
    array[1] = { ...array[1], fee: parseFloat(newfee.raised_fee), address: newfee.raise_fee_address.toString() };
    array[2] = { ...array[2], fee: parseFloat(newfee.sold_fee), address: newfee.sole_fee_address.toString() };
    setFeeInfo( array );

    await getBalance();

  }

  const getFeeInfo = async () => {

    let setting_contract;

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
      ProgressDlgShow(false, "");
      return null;
    }

    setting_contract = await CreateSettingContract();

    if(!setting_contract) {
      ErrorDlgShow(true, "setting contract connect error");
      ProgressDlgShow(false, "");
      return null;
    }

    let feeinfo;

    try {
      feeinfo = await setting_contract.info();
      return feeinfo;
    } catch (error) {
      ErrorDlgShow(true, "Get Fee Information Error");
      ProgressDlgShow(false, "");
      return null;
    }
    
  }

  const ValidateData = async () => {

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
      ProgressDlgShow(false, "");
      return false;
    }

    // FeeInfo.map(async (item, index) => {
    //     if( !await validateAddress(item.address) ) {
    //         // console.log("item", item.category)
    //         ErrorDlgShow(true, item.category + "Address is Invalid");
    //         return false;
    //     }        
    // }); 

    // console.log(FeeInfo);

    if(!await validateAddress(FeeInfo[0].address)) {
        ErrorDlgShow(true, FeeInfo[0].category + "Address is Invalid");
        ProgressDlgShow(false, "");
        return false;
    }

    if(!await validateAddress(FeeInfo[1].address)) {
        ErrorDlgShow(true, FeeInfo[1].category + "Address is Invalid");
        ProgressDlgShow(false, "");
        return false;
    }

    if(!await validateAddress(FeeInfo[2].address)) {
        ErrorDlgShow(true, FeeInfo[2].category + "Address is Invalid");
        ProgressDlgShow(false, "");
        return false;
    }

    return true;
  }

  const feeChange = (idx, value) => {
    // console.log("preslaeinfo", presaleinfo);
    // console.log("fee", value);
    // console.log(idx);
    const newList = FeeInfo.map((item, index) => {
        if(idx == index) {
            if(value < 0)
                item.value=0;
            else
                item.fee = value;
        }
        return item;
    });
    // console.log('newList', newList)
    setFeeInfo(newList);
  }

  const addrChange = (idx, value) => {
    const newList = FeeInfo.map((item, index) => {
        if(idx == index) {
            item.address = value;
        }
        return item;
    });
    // console.log('newList', newList)
    setFeeInfo(newList);
  }

  const SettingButtonClick = async () => {
    ProgressDlgShow(true, "Setting");
    if(await ValidateData()) {
        await SetFee();
        // console.log("valid")
    }
    // ProgressDlgShow(false, "");
  }

  const WithdrawButtonClick = () => {
    ProgressDlgShow(true, "Withdrawing");
    withDraw();
  }

  return (
    <GridContainer justifyContent="center">
      <GridItem xs={12} sm={12} md={9}>
        <Card>
          <CardHeader color="success">
            <Primary><h4 className={classes.cardTitleWhite}>
              Setting Fee
            </h4></Primary>
            <p className={classes.cardCategoryWhite}>
              {/* <Stack direction="row" spacing={5}> */}
                <Warning />You can set some fees for presale. But you should be contract manger.
              {/* </Stack> */}
            </p>
          </CardHeader>
          <CardBody>
            {/* <GridContainer justifyContent="center"> */}
                <div className={classes.tableUpgradeWrapper}>
                <table className={classes.table}>
                    <thead>
                    <tr>
                        {/* <td /> */}
                        <td className={classes.center}><Primary><b>Category</b></Primary></td>
                        <td className={classes.center}><Primary><b>Fee Value</b></Primary></td>
                        <td className={classes.center}><Primary><b>Fee Address</b></Primary></td>
                    </tr>
                    </thead>

                    <tbody>
                        {FeeInfo.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {/* <td /> */}
                                    <td><Info>{item.category}</Info></td>
                                    <td><TextField value={item.fee} type="Number" size="small" variant="outlined" onChange={(e) => feeChange(index, e.target.value)}/></td>
                                    <td><TextField fullWidth id={"fee_addr"+index} value={item.address}disabled={item.enableflag} onChange={(e) => addrChange(index, e.target.value)} size="small" variant="outlined"/></td>
                                </tr>
                                )}
                            )}
                    </tbody>
                </table>
                </div>
            {/* </GridContainer> */}
          </CardBody>
            <GridContainer justifyContent="center">
                <Button variant="outlined" onClick={(e) => SettingButtonClick()} color="info">Setting</Button>
            </GridContainer>
            <p />
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={3}>
        <Card>
          <CardHeader color="success" stats icon>
            <CardIcon color="info">
              <AttachMoneyIcon />
            </CardIcon>
            <Info><p>Withdraw</p></Info>
            <Primary><h3 >{coin}</h3></Primary>
          </CardHeader>
          <CardBody>
            <GridContainer justifyContent="center">
                <Info>Saved Balance:</Info>
            </GridContainer>
            <GridContainer justifyContent="center">
                <Primary><h6><b>{parseFloat(balance)}</b></h6></Primary>
            </GridContainer>
          </CardBody>
          {/* <CardFooter> */}
            <GridContainer justifyContent="center">
                <Button variant="outlined" onClick={(e) => WithdrawButtonClick()} color="info">Withdraw</Button>
            </GridContainer>
            <p></p>
          {/* </CardFooter> */}
        </Card>
       </GridItem>

        <AlertDialog open={dlgshow} onClose={onClose} alerttext={errorstr}/>
        <ProgressDlg open={progressdlg_flag} alerttext={progress_str} />

    </GridContainer>
  );
}