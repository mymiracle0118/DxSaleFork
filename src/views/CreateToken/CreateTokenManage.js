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

//Constant ABI
import { CREATE_TOKEN_ABI } from '../../Config/config.js';

//Constant Address
import { CREATE_TOKEN_MANAGE_ADDRESS } from '../../Config/config.js';

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
let managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.bsc;//Metamask

export default function CreateTokenManage() {
  const classes = useStyles();

  const [balance, setBalance] = useState(0);
  const [coin, setCoin] = useState("ETH");

  //Alert Dlg
  const [dlgshow, setDlgshow] = useState(false);
  const [errorstr, setErrorStr] = useState("Error");

  //Progress Dlg
  const [progressdlg_flag, setProgressDlgFlag] = useState(false);
  const [progress_str, setProgressDlgStr] = useState("Starting");

  const [owneraddr, setOwner] = useState(""); 

  const {account, library} = useWeb3React();

  const [FeeInfo, setFeeInfo] = useState([
      {
          category:"Normal Fee",
          fee:0,
          enableflag:false,
      },
      {
          category:"Mint Fee",
          fee:0,
          enableflag:false,
      },
      {
          category:"Burn Fee",
          fee:0,
          enableflag:false,
      },
      {
          category:"Pause Fee",
          fee:0,
          enableflag:false,
      },
      {
          category:"Blacklist Fee",
          fee:0,
          enableflag:false,
      },
      {
          category:"Reflection Fee",
          fee:0,
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
      managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.eth;
    } else if(library._network.chainId === 97) {
      setCoin('BNB');
      managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.bsc;
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
      managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.eth;
    } else if(library._network.chainId === 97) {
      setCoin('BNB');
      managecontractAddr = CREATE_TOKEN_MANAGE_ADDRESS.bsc;
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
        
      let signer = library.getSigner();
   
      if (signer) {
        try {
          manageContract = await manageContract.connect(signer);
          return manageContract;
        } catch (error) {
          ErrorDlgShow(true, "Manage Contract signer connect error");
          ProgressDlgShow(false, "");
        }
      }
      else {
        return null
      }
    }

  const SetFee = async () => {

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

    //Set Create Fee & Address
    try {
        await manage_contract.initFee(ethers.utils.parseUnits(FeeInfo[0].fee.toString(), 18),
        ethers.utils.parseUnits(FeeInfo[1].fee.toString(), 18),
        ethers.utils.parseUnits(FeeInfo[2].fee.toString(), 18),
        ethers.utils.parseUnits(FeeInfo[3].fee.toString(), 18),
        ethers.utils.parseUnits(FeeInfo[4].fee.toString(), 18),
        ethers.utils.parseUnits(FeeInfo[4].fee.toString(), 18));

        await manage_contract.on("InitFeeSuccess", () => {
            // setProgressFlag(false);
            // getStandardTokenBalance(erctokenaddr);
            //ErrorDlgShow(true, "Approve Success!");
            ProgressDlgShow(false, "");
            getInfo();
        });

    } catch (error) {
        console.log(error)
        // console.log("seeting error", error)
      ErrorDlgShow(true, "Setting Error");
      ProgressDlgShow(false, "");
      return;
    }
  }

  const getOwner = async () => {
    let manage_contract;
 
    // ProgressDlgShow(true, "Getting Count");

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      // ProgressDlgShow(false, "Getting Count");
      ErrorDlgShow(true, "Manage Contract Connect Error");
      ProgressDlgShow(false, "");
      return 
    }

    let owner_addr;

    try {
      owner_addr = await manage_contract.owner();
      // ProgressDlgShow(false, "Getting Count");  
      // ErrorDlgShow(true, );
      // console.log("count", count);
      setOwner(owner_addr);
    } catch (err) {
      // ProgressDlgShow(false, "Getting Count");
    //   console.log(err)
      ErrorDlgShow(true, "Getting Owner Address Error");
      ProgressDlgShow(false, "");
      return;
    }
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
        // console.log("balance", balance);
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
    array[0] = { ...array[0], fee: ethers.utils.formatUnits ( newfee.normal , 18 )};
    array[1] = { ...array[1], fee: ethers.utils.formatUnits ( newfee.mint , 18 )};
    array[2] = { ...array[2], fee: ethers.utils.formatUnits ( newfee.burn , 18 )};
    array[3] = { ...array[3], fee: ethers.utils.formatUnits ( newfee.pause , 18 )};
    array[4] = { ...array[4], fee: ethers.utils.formatUnits ( newfee.blacklist , 18 )};
    array[5] = { ...array[5], fee: ethers.utils.formatUnits ( newfee.deflation , 18 )};

    setFeeInfo( array );

    await getBalance();

    await getOwner();

  }

  const getFeeInfo = async () => {

    let manage_contract;

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
      ProgressDlgShow(false, "");
      return null;
    }

    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      ErrorDlgShow(true, "manage contract connect error");
      ProgressDlgShow(false, "");
      return null;
    }

    let feeinfo;

    try {
      feeinfo = await manage_contract.fee();
      return feeinfo;
    } catch (error) {
      ErrorDlgShow(true, "Get Fee Information Error");
      ProgressDlgShow(false, "");
      return null;
    }
    
  }

  const ValidateData = async (address) => {

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
      ProgressDlgShow(false, "");
      return false;
    }

    if(!await validateAddress(address)) {
        ErrorDlgShow(true, "Address is Invalid");
        ProgressDlgShow(false, "");
        return false;
    }

    return true;
  }

  const SetOwnerAddress = async (address) => {
      let manage_contract;

    if(!account) {
      ErrorDlgShow(true, "Wallet is unconnected");
      ProgressDlgShow(false, "");
      return null;
    }
    
    ProgressDlgShow(true, "Setting");
    
    manage_contract = await CreateManageContract();

    if(!manage_contract) {
      ErrorDlgShow(true, "manage contract connect error");
      ProgressDlgShow(false, "");
      return null;
    }

    try {
      await manage_contract.setOwner(address);
      await manage_contract.on("setOwnerSucess", () => {
            // setProgressFlag(false);
            // getStandardTokenBalance(erctokenaddr);
            //ErrorDlgShow(true, "Approve Success!");
            ProgressDlgShow(false, "");
            getInfo();
        });
    } catch (error) {
        console.log(error)
      ErrorDlgShow(true, "Set Owner Address Error");
      ProgressDlgShow(false, "");
      return null;
    }
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

  const SettingButtonClick = async () => {
    ProgressDlgShow(true, "Setting");
    if(true)    {
        await SetFee();
        // console.log("valid")
    }
    // ProgressDlgShow(false, "");
  }

  const WithdrawButtonClick = () => {
    ProgressDlgShow(true, "Withdrawing");
    withDraw();
  }

  const changeowner = async () => {
      let address = document.getElementById("newaddr").value;
      if(await ValidateData(address)) {
        await SetOwnerAddress(address);
        // console.log("valid")
    }
  }

  return (
    <GridContainer justifyContent="center">
      <GridItem xs={12} sm={12} md={9}>
        <Card>
          <CardHeader color="danger">
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
                    </tr>
                    </thead>

                    <tbody>
                        {FeeInfo.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {/* <td /> */}
                                    <td><Info>{item.category}</Info></td>
                                    <td><TextField fullWidth value={item.fee} type="Number" size="small" variant="outlined" onChange={(e) => feeChange(index, e.target.value)}/></td>
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
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
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
        <Card>
          <CardHeader color="primary" stats icon>
            <CardIcon color="primary">
              <Accessibility />
            </CardIcon>
              <p className={classes.cardCategory}>Manage Owner</p>
              <Success>
                <h4>Change Address</h4>
              </Success>     
          </CardHeader>
          <CardBody>
            <Info><small>Current Address:</small></Info><Primary>{owneraddr}</Primary  >
            <Info><small>New Address:</small></Info>
            <TextField fullWidth id="input-with-sx" id="newaddr" label="Input New Owner address" variant="standard" />
          </CardBody>
          <CardFooter>
            <div className={classes.stats}>
              <Danger>
                <Warning />
              </Danger>
              <Danger>
                Only contract owner can do it.
              </Danger>
            </div>
            <Button variant="outlined" onClick={(e) => changeowner()} color="info">Change</Button>
          </CardFooter>
        </Card>
       </GridItem>

        <AlertDialog open={dlgshow} onClose={onClose} alerttext={errorstr}/>
        <ProgressDlg open={progressdlg_flag} alerttext={progress_str} />

    </GridContainer>
  );
}