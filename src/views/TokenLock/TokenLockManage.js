/*eslint-disable*/
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import Accessibility from "@material-ui/icons/Accessibility";
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import CardBody from "../../components/Card/CardBody.js";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Danger from "../../components/Typography/Danger.js";
import Success from "../../components/Typography/Success.js";
import CardFooter from "../../components/Card/CardFooter.js";
import Button from "../../components/CustomButtons/Button.js";
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, BigNumber as EthersBigNumber } from 'ethers';
import { getDefaultProvider } from "../../components/WalletConnector.js";
import coinAddressValidator from 'coin-address-validator';
import CardIcon from "../../components/Card/CardIcon.js";
import Warning from "@material-ui/icons/Warning";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Primary from "../../components/Typography/Primary.js";
import Info from "../../components/Typography/Info.js";
import SecurityUpdateWarningIcon from '@mui/icons-material/SecurityUpdateWarning';

import { TOKEN_LOCK_ABI } from '../../Config/config.js';
import { TOKENLOCK_ADDRESS } from '../../Config/config.js'

let contractAddr = TOKENLOCK_ADDRESS.eth;//Metamask

const useStyles = makeStyles(styles);
let decimals, balance, available, lockedamount, accountbalance;

export default function TokenLock() {
  const classes = useStyles();

  const [progressflag, setProgressFlag] = useState(false);
  const [erroflag, setErroShow] = useState(false);
  const [errlabel, setErrLabel] = useState('Error! Some problems happend. You should fix error.');
  const [price, setPrice] = React.useState('Unconnected');
  const [penalfee, setPenalFee] = React.useState('0');
  const [owneraddr, SetOwnerAddr] = useState('Unconnected');
  const [contractbalance, SetContractBalance] = useState('Unconnected');
  const [progress_bal, setProgress_bal] = useState(false);
  const [errorshow_bal, setErrorShow_bal] = useState(false);
  const [errorstr_bal, setErrorStr_bal] = useState('Error! Some problems happend. You should fix error.');

  const [progress_price, setProgress_price] = useState(false);
  const [errorshow_price, setErrorShow_price] = useState(false);
  const [errorstr_price, setErrorStr_price] = useState('Error! Some problems happend. You should fix error.');

  const [progress_fee, setProgress_fee] = useState(false);
  const [errorshow_fee, setErrorShow_fee] = useState(false);
  const [errorstr_fee, setErrorStr_fee] = useState('Error! Some problems happend. You should fix error.');

  const [coin, setCoin] = useState('');


  // let erctokencontract, tokenlockcontract;

  const {account, library} = useWeb3React();

  useEffect(() => {
    if(library) {
      if(!library._network) {
        return
      }
      if(library._network.chainId === 3) {
        setCoin('ETH');
      } else if(library._network.chainId === 97) {
        setCoin('BNB');
      }
    }
    getInfo();
  }, [account, library])

  useEffect(() => {
    if(library) {
      if(!library._network) {
        return
      }
      if(library._network.chainId === 3) {
        setCoin('ETH');
      } else if(library._network.chainId === 97) {
        setCoin('BNB');
      }
    }
    getInfo();
  },[])

  const checkvalidate = (amount) => {
    let tokenbalance = ethers.utils.formatUnits ( balance , decimals );
    let accountbal = ethers.utils.formatUnits ( accountbalance , decimals );

    if(!amount) {
      setErrLabel("Please input amount");
      setProgressFlag(false)
      setErroShow(true)
      return false;
    }

    if( parseFloat(amount) > parseFloat(tokenbalance) ) {
      setErrLabel("Please input correct amount");
      setProgressFlag(false)
      setErroShow(true)
      return false;
    }

    if( parseFloat(price) > parseFloat(accountbal) ) {
      setErrLabel("Your balance is in sufficient");
      setProgressFlag(false)
      setErroShow(true)
      return false;
    }

    return true;
  }

  const connectContract = (tokenabi, tokenaddr) => {

    let provider  =  getDefaultProvider();
    let tempcontract;

    //Ropsten
    if(library._network.chainId == 3) {
      // console.log("ethereum chain id")
      contractAddr = TOKENLOCK_ADDRESS.eth;
    } else if(library._network.chainId == 97) {
      // console.log("bsc chain id")
      contractAddr = TOKENLOCK_ADDRESS.bsc;
    }

    const isEthAddress = coinAddressValidator.validate(tokenaddr, 'eth', 'prod');

    if( !isEthAddress ) {
      // console.log("Wallet address is invalid");
      setErrLabel("Token address is invalied");
      return null
    }

    try {
      tempcontract = new Contract(tokenaddr, tokenabi, provider);
    } catch (error) {
      // console.log("Contract new Error")
      setErrLabel("Contract connect error");
      // console.log(error)
      return null
    }
  
    return tempcontract;
  }

  const CreateLockContract = () => {
    let tokenContract;

    if(!library || !account)
    {
      return null
    }

    tokenContract = connectContract(TOKEN_LOCK_ABI, contractAddr);

    if(!tokenContract)
    {
      return null
    }
      

    let signer = library.getSigner();
 
    if (signer) {
      try {
        tokenContract = tokenContract.connect(signer);
      } catch (error) {
        // console.log("token lock connect error")
        setErrLabel("Contract connect error");
      }
    }
    else {
      return null
    }
    
    return tokenContract
  }

  const CheckAddrValidate = async (addr) => {
    let res;

    const isEthAddress = coinAddressValidator.validate(addr, 'eth', 'prod');

    if( !isEthAddress ) {
      // console.log("etheraddr")
      return false
    }
    return true;
  }

  const changeowner = async () => {

    setProgressFlag(true)
    setErroShow(false)

    let addr = document.getElementById("newaddr").value;
    let flag = await CheckAddrValidate(addr);

    if(!flag) {
      setErrLabel("Address is invalid");
      setProgressFlag(false)
      setErroShow(true)
      return;
    }

    let lock = CreateLockContract();

    if(!lock) {
      setProgressFlag(false)
      setErroShow(true)
      setErrLabel('Contract Connect failed');
      return 
    }

    try {
      await lock.SetOwner(addr);
      await lock.on("SetOwnerSuccess", (address1) => {
        setProgressFlag(false);
        getInfo();
      });
    } catch (err) {
      // console.log('Approve Error');
      setErrLabel("Change fail");
      setProgressFlag(false)
      setErroShow(true)
      return;
    }
  }

  const wintdraw = async () => {
    setProgress_bal(true)
    setErrorShow_bal(false)

    let lock = CreateLockContract();

    if(!lock) {
      setProgress_bal(false)
      setErrorShow_bal(true)
      setErrorStr_bal('Contract Connect failed');
      return 
    }

    try {
      await lock.OwnerWithdraw();
      await lock.on("OwnerWithdrawSuccess", (amount) => {
        setProgress_bal(false);
        getInfo();
      });
    } catch (err) {
      // console.log('Approve Error');
      setProgress_bal(false)
      setErrorShow_bal(true)
      setErrorStr_bal('Withdraw failed');
      return;
    }
  }

  const SetPrice = async () => {
    setProgress_price(true)
    setErrorShow_price(false)

    let price_value = document.getElementById("price_val").value;

    if( price_value <= 0) {
      setProgress_price(false)
      setErrorShow_price(true)
      setErrorStr_price('Please input correct amount');
      return;
    }

    let lock = CreateLockContract();

    if(!lock) {
      setProgress_price(false)
      setErrorShow_price(true)
      setErrorStr_price('Contract Connect failed');
      return 
    }

    try {
      await lock.SetPrice(ethers.utils.parseUnits(price_value, 18));
      await lock.on("SetPriceSuccess", (amount) => {
        setProgress_price(false);
        getInfo();
      });
    } catch (err) {
      // console.log('Approve Error');
      setProgress_price(false)
      setErrorShow_price(true)
      setErrorStr_price('Set Price failed');
      return;
    }
  }

  const SetFee = async () => {
    setProgress_fee(true)
    setErrorShow_fee(false)

    let fee_value = document.getElementById("fee_val").value;

    if( fee_value <= 0) {
      setProgress_fee(false)
      setErrorShow_fee(true)
      setErrorStr_fee('Please input correct amount');
      return;
    }

    let lock = CreateLockContract();

    if(!lock) {
      setProgress_fee(false)
      setErrorShow_fee(true)
      setErrorStr_fee('Contract Connect failed');
      return 
    }

    try {
      await lock.SetPenaltyFee(fee_value);
      await lock.on("SetPenaltyFeeSuccess", (amount) => {
        setProgress_fee(false);
        getInfo();
      });
    } catch (err) {
      // console.log('Approve Error');
      setProgress_fee(false)
      setErrorShow_fee(true)
      setErrorStr_fee('Set Fee failed');
      console.log(err);
      return;
    }
  }

  const getInfo = async () => {

    let lock;
    let res;

    let accountbalance;

    SetOwnerAddr('Unconnected');
    SetContractBalance("Unconnected");
    setPrice("Unconnected");
    setPenalFee("Unconnected");

    setProgressFlag(true)
    setProgress_bal(true);
    setProgress_price(true);
    setProgress_fee(true);

    setErrorShow_bal(false);
    setErroShow(false);
    setErrorShow_fee(false);
    setErrorShow_price(false);

    if(!account) {
      setErrLabel("Wallet is unconnected");
      setErrorStr_bal("Wallet is unconnected");
      setErrorStr_price("Wallet is unconnected");
      setErrorStr_fee("Wallet is unconnected");

      setProgressFlag(false)
      setProgress_bal(false);
      setProgress_price(false);
      setProgress_fee(false);

      setErroShow(true)
      setErrorShow_bal(true);
      setErrorShow_price(true);
      setErrorShow_fee(true);
      // console.log("Wallet is unconnected");
      return
    }

    try {
      accountbalance = await library.getBalance(contractAddr);
    } catch (error) {
      setErrLabel("Check account status");
      setErrorStr_bal("Check account status");
      setErrorStr_price("Check account status");
      setErrorStr_fee("Check account status");
      // // console.log(error);
      setProgressFlag(false)
      setProgress_bal(false);
      setProgress_price(false);
      setProgress_fee(false);

      setErroShow(true)
      setErrorShow_bal(true);
      setErrorShow_price(true);
      setErrorShow_fee(true);
      return
    }
    
    lock = CreateLockContract();

    if(!lock) {
      setErrLabel("Conncet contract fail");
      setErrorStr_bal("Conncet contract fail");
      setErrorStr_price("Conncet contract fail");
      setErrorStr_fee("Conncet contract fail");

      setProgressFlag(false)
      setProgress_bal(false);
      setProgress_price(false);
      setProgress_fee(false);

      setErroShow(true)
      setErrorShow_bal(true);
      setErrorShow_price(true);
      setErrorShow_fee(true);

      return 
    }

    let tpenaltyfee, tprice, towneraddr;

    try {
      tpenaltyfee = await lock.penaltyfee();
      tprice = await lock.price();
      towneraddr = await lock.owner();
    } catch (error) {
      setErrLabel("Get Info fail");
      setErrorStr_bal("Get Info fail");
      setErrorStr_price("Get Info fail");
      setErrorStr_fee("Get Info fail");

      setProgressFlag(false)
      setProgress_bal(false);
      setProgress_price(false);
      setProgress_fee(false);

      setErroShow(true)
      setErrorShow_bal(true);
      setErrorShow_price(true);
      setErrorShow_fee(true);
      return;
    }

    setPenalFee(tpenaltyfee.toString());
    setPrice(ethers.utils.formatUnits ( tprice, 18 ));
    SetOwnerAddr(towneraddr);

    SetContractBalance(ethers.utils.formatUnits ( accountbalance, 18 ));

    setProgressFlag(false)
    setProgress_bal(false);
    setProgress_price(false);
    setProgress_fee(false);

    setErrorShow_bal(false);
    setErroShow(false);
    setErrorShow_fee(false);
    setErrorShow_price(false);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={6} md={6}>
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
            { progressflag && 
              <GridContainer justifyContent="center">
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              </GridContainer>
            }
            {erroflag && (
              <GridContainer justifyContent="center">
                <Danger>
                  <Warning />
                  {errlabel}
                </Danger>
              </GridContainer>
            )}
            <Info><small>Current Address:</small></Info><Primary><h4>{owneraddr}</h4></Primary  >
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
      <GridItem xs={12} sm={6} md={5}>
        <Card>
          <CardHeader color="success" stats icon>
            <CardIcon color="success">
              <AttachMoneyIcon />
            </CardIcon>
            <p className={classes.cardCategory}>Withdraw</p>
            <h3 className={classes.cardTitle}>{coin}</h3>
          </CardHeader>
          <CardBody>
          { progress_bal && 
              <GridContainer justifyContent="center">
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              </GridContainer>
            }
            {errorshow_bal && (
              <GridContainer justifyContent="center">
                <Danger>
                  <Warning />
                  {errorstr_bal}
                </Danger>
              </GridContainer>
            )}
            <Info><small>Saved balance:</small></Info><Primary><h4>{contractbalance}</h4></Primary  >
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
            <Button variant="outlined" onClick={(e) => wintdraw()} color="warning">Withdraw</Button>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={5}>
        <Card>
          <CardHeader color="success" stats icon>
            <CardIcon color="info">
              <AttachMoneyIcon />
            </CardIcon>
            <p className={classes.cardCategory}>Set Price</p>
            <h3 className={classes.cardTitle}>{coin}</h3>
          </CardHeader>
          <CardBody>
          { progress_price && 
              <GridContainer justifyContent="center">
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              </GridContainer>
            }
            {errorshow_price && (
              <GridContainer justifyContent="center">
                <Danger>
                  <Warning />
                  {errorstr_price}
                </Danger>
              </GridContainer>
            )}
            <Info><small>Current Price:</small></Info><Primary><h4>{price}</h4></Primary  >
            <Info><small>Set Price:</small></Info>
              <TextField fullWidth id="input-with-sx" id="price_val" label="Input price" variant="standard" />
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
            <Button variant="outlined" onClick={(e) => SetPrice()} color="warning">Set Price</Button>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={5}>
        <Card>
          <CardHeader color="success" stats icon>
            <CardIcon color="danger">
              <SecurityUpdateWarningIcon />
            </CardIcon>
            <p className={classes.cardCategory}>Set Fee</p>
            <h3 className={classes.cardTitle}>{coin}</h3>
          </CardHeader>
          <CardBody>
          { progress_fee && 
              <GridContainer justifyContent="center">
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              </GridContainer>
            }
            {errorshow_fee && (
              <GridContainer justifyContent="center">
                <Danger>
                  <Warning />
                  {errorstr_fee}
                </Danger>
              </GridContainer>
            )}
            <Info><small>Current Fee:</small></Info><Primary><h4>{penalfee}</h4></Primary  >
            <Info><small>Set Fee:</small></Info>
              <TextField fullWidth id="input-with-sx" id="fee_val" label="Input price" variant="standard" />
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
            <Button variant="outlined" onClick={(e) => SetFee()} color="warning">Set Fee</Button>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}