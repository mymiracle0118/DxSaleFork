/*eslint-disable*/
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import CardAvatar from "../../components/Card/CardAvatar.js";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Label, Input } from 'reactstrap';
import Danger from "../../components/Typography/Danger.js";
import Success from "../../components/Typography/Success.js";
import avatar from "../../assets/img/faces/marc.jpg";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import CardFooter from "../../components/Card/CardFooter.js";
import Loader from "../../components/Loader/Loader.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import BigNumber from 'bignumber.js'
import { utils } from "ethers";
import InputLabel from "@material-ui/core/InputLabel";
import isValidAddress from "../../components/AddressValidator.js";
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, BigNumber as EthersBigNumber } from 'ethers';
import { getDefaultProvider } from "../../components/WalletConnector.js";
import coinAddressValidator from 'coin-address-validator';
import { hexZeroPad } from "@ethersproject/bytes";
import { AutoScaleAxis } from "chartist";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CardIcon from "../../components/Card/CardIcon.js";
import Warning from "@material-ui/icons/Warning";
import Icon from "@material-ui/core/Icon";
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Primary from "../../components/Typography/Primary.js";
import Info from "../../components/Typography/Info.js";

import { LIQUIDITY_LOCK_ABI } from '../../Config/config.js';
import { LIQUIDITYLOCK_ADDRESS } from '../../Config/config.js';

let contractAddr = LIQUIDITYLOCK_ADDRESS.eth;//Metamask
// const contractAddr = '0xE6D2B6D7AD8956AF24e4d890574F1F42ebcfC4f9';//BSC

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
let lptokenaddr;
let decimals, balance, available, lockedamount, accountbalance;

export default function LiqudityLock() {
  const classes = useStyles();
  const [tokenbalance, setTokenBalance] = useState('0');
  // const [lockamount, setLockAmount] = useState(0);
  // const [locktime, setLockTime] = useState(0);
  // const [penaltyfee, setPenaltyFee] = useState(0);
  const [lockallowance, setLockallowance] = useState('0');
  const [tokenlockedamount, setLockedAmount] = useState('0');
  const [progressflag, setProgressFlag] = useState(false);
  const [transactiveflag, setTransActiveFlag] = useState(false);
  const [erroflag, setErroShow] = useState(false);
  const [tokenstaddr, setTokenStAddr] = useState('');
  const [errlabel, setErrLabel] = useState('Error! Some problems happend. You should fix error.');

  // let lptokencontract, tokenlockcontract;
  const [open, setOpen] = React.useState(false);
  const [opendis, setDigOpen] = React.useState(false);

  const [price, setPrice] = React.useState('0');
  const [penalfee, setPenalFee] = React.useState('0');
  const [symbol, setSymbol] = React.useState('');
  const [name, setName] = React.useState('');
  const [unlocktime, setUnlockTime] = useState('0');

  const [approve_flag, setApproveFlag] = useState(true);
  const [lock_flag, setLockFlag] = useState(true);
  const [unlock_flag, setUnlockFlag] = useState(true);

  const {account, library} = useWeb3React();

  // useEffect(() => {
  //   if (account !== undefined) {
  //     setAccount("Connected");
  //   }
  // }, [account, ])

  const addrChange = (addr) => {
    // console.log(addr);
    lptokenaddr = addr;
    setTokenStAddr(lptokenaddr);
    getLpBalance(lptokenaddr)
  };

  const handledlgClose = (value) => {
    setDigOpen(false);
  };

  useEffect(() => {
    if (account !== undefined) {
      // setAccount("Connected");
      return;
    }
    getPrice();
  }, [account, library])

  useEffect(()=> {
    getPrice();
  })

  function PanicWithdrawDlg(props) {

    const { onClose, open } = props;
  
    const handleClose = () => {
      onClose();
    };
  
    const handleok = () => {
      withdraw_remove_fee(lptokenaddr);
      onClose();
    }
  
    return (
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Force unlock</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you agree to unlock tokens by removing penalty fee?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleok} color="primary">
              OK
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

  const connectContract = (tokenabi, tokenaddr) => {

    let provider  =  getDefaultProvider();
    let tempcontract;
  
    // contractAddr = 
    // console.log("chainid");
    // console.log(library._network.chainId);
    // console.log(library._network.chainId)
    if(!library) {
      return;
    }

    if(!library._network) {
      return;
    }

    //Ropsten
    if(library._network.chainId === 3) {
       console.log("ethereum chain id")
      contractAddr = LIQUIDITYLOCK_ADDRESS.eth;
    } else if(library._network.chainId === 97) {
      // console.log("bsc chain id")
      contractAddr = LIQUIDITYLOCK_ADDRESS.bsc;
    }
    // const isBtcAddress  = coinAddressValidator.validate('1Gz3SRHzmzV8NwhUe5LQkTy5ysH1aqevAP', 'btc', 'prod');
    const isEthAddress = coinAddressValidator.validate(tokenaddr, 'eth', 'prod');

    if( !isEthAddress ) {
      // console.log("Wallet address is invalid");
      setErrLabel('Address is invalid');
      return null
    }

    try {
      tempcontract = new Contract(tokenaddr, tokenabi, provider);
    } catch (error) {
      // console.log("Contract new Error")
      setErrLabel('Contract connect error');
      // console.log(error)
      return null
    }
  
    return tempcontract;
  }

  const createLpContract = (addr) => {
    let tokenContract;

    if(!library || !account)
    {
      return null
    }

    tokenContract = connectContract(LIQUIDITY_LOCK_ABI.token, addr);

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
        setErrLabel('Contract connect error');
      }
    }
    else {
      return null
    }
    
    return tokenContract
  }

  const CreateLockContract = () => {
    let tokenContract;

    if(!library || !account)
    {
      return null
    }

    tokenContract = connectContract(LIQUIDITY_LOCK_ABI.lock, contractAddr);

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
        setErrLabel('Contract connect error');
      }
    }
    else {
      return null
    }
    
    return tokenContract
  }

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

  const getPrice = async () => {
    let lock;
    let res;
    if(!account) {
      return;
    }

    lock = CreateLockContract();

    if(!lock) {
      // setProgressFlag(false)
      // setErroShow(true)
      return 
    }

    let tpenaltyfee, tprice

    try {
      tpenaltyfee = await lock.penaltyfee();
      tprice = await lock.price();
    } catch (error) {
      return;
    }

    setPenalFee(tpenaltyfee.toString());
    setPrice(ethers.utils.formatUnits ( tprice, 18 ));

  }

  const getLpBalance = async (address) => {
    // let web3 = new Web3(window.web3.currentProvider);

    setProgressFlag(true)
    setTransActiveFlag(false)
    setErroShow(false)

    let lp, lock;

    if(!account) {
      setErrLabel("Wallet is unconnected");
      setProgressFlag(false)
      setErroShow(true)
      return
    }

    try {
      accountbalance = await library.getBalance(account);
    } catch (error) {
      setErrLabel("Check account status");
      // console.log(error);
      setProgressFlag(false)
      setErroShow(true)
      return
    }

    lock = CreateLockContract();

    if(!lock) {
      setProgressFlag(false)
      setErroShow(true)
      return 
    }

    // let checkflag;

    try {
      checkflag = await lock.checkLp(address);
    } catch (error) {
      // console.log("Lp check function error");
      setErrLabel('Lp token address in invalid');
      // console.log(error)
      setProgressFlag(false)
      setErroShow(true)
      return;
    }

    let checkflag = true;

    // console.log("Lp lock contract error")
    
    if(checkflag !== true) {
      // console.log("Lp check error");
      setErrLabel('Lp token address in invalid');
      setProgressFlag(false)
      setErroShow(true)
      return
    }

    lp = createLpContract(address);

    if(!lp) {
      setProgressFlag(false)
      setErroShow(true)
      return 
    }

    let tsymbol, tname, tunlocktime, tpenaltyfee, tprice;
    let calc_lockallow, calc_balance, calc_lockedamount;
    
    try {

    decimals = await lp.decimals();
    balance = await lp.balanceOf(account);
    available = await lp.allowance(account, contractAddr);
    lockedamount = await lock.GetBalance(address);

    tsymbol = await lp.symbol();
    tname = await lp.name();
    tunlocktime = await lock.GetUnlockTime(address);

    setSymbol(tsymbol);
    setName(tname);

    const date = new Date(tunlocktime.toNumber() * 1000);
    setUnlockTime(date.toLocaleString('en-GB'));

    setTokenBalance(ethers.utils.formatUnits ( balance , decimals ));
    setLockallowance(ethers.utils.formatUnits ( available , decimals ));
    setLockedAmount(ethers.utils.formatUnits ( lockedamount , decimals ));

    setProgressFlag(false)
    setTransActiveFlag(true)

      calc_balance = ethers.utils.formatUnits ( balance , decimals );
      calc_lockallow = ethers.utils.formatUnits ( available , decimals );
      calc_lockedamount = ethers.utils.formatUnits ( lockedamount , decimals);

      setTokenBalance(calc_balance);
      setLockallowance(calc_lockallow);
      setLockedAmount(calc_lockedamount);

      if(parseFloat(calc_balance) > 0.0) {
        setApproveFlag(false);
      } else {
        setApproveFlag(true);
      }
      
      if(parseFloat(calc_lockallow) > 0.0) {
        setLockFlag(false);
      } else {
        setLockFlag(true);
      }
      
      if(parseFloat(calc_lockedamount) > 0.0) {
        setUnlockFlag(false);
      } else {
        setUnlockFlag(true);
      }

    } catch (error) {
      setErrLabel('Get Information Error');
      // console.log(error)
      setProgressFlag(false)
      setTransActiveFlag(false)
      setErroShow(true)
      return;
    }
  };

  const approveToken = async () => {

    let tokenContract;

    setProgressFlag(true)
    setErroShow(false)
    // setTransActiveFlag(false)

    let amount = document.getElementById("idamount").value;

    let lp, lock;

    if( !checkvalidate(amount) ) {
      return;
    }

    lp = createLpContract(lptokenaddr);

    if(!lp) {
      setProgressFlag(false)
      setErroShow(true)
      return 
    }

    try {
      await lp.approve(contractAddr, ethers.utils.parseUnits(amount, decimals));
      await lp.on("Approval", (address1, address2, num) => {
        setProgressFlag(false);
        getLpBalance(lptokenaddr);
      });
    } catch (err) {
      // console.log('Approve Error');
      setErrLabel('Approve Error');
      console.log(err)
      setProgressFlag(false)
      setErroShow(true)
      return;
      // console.log(err)
    }

    // Notice this is an array of topic-sets and is identical to
    // using a filter with no address (i.e. match any address)
  };

  const locktoken = async () => {

    setProgressFlag(true)
    setErroShow(false)

    let lock; 

    let amount = document.getElementById("idamount").value;
    let locktime = document.getElementById("idlocktime").value;

    if( !checkvalidate(amount) ) {
      return;
    }

    lock = CreateLockContract();

    if(!lock) {
      setErrLabel("Connect Error");
      setProgressFlag(false)
      setErroShow(true)
      return 
    }

    let overrides = {
      // gasLimit: 1000000,
      value:ethers.utils.parseUnits(price, 18)
    };
    
    try {
      await lock.lpLock(lptokenaddr, ethers.utils.parseUnits(amount, decimals), Date.parse(locktime) / 1000, account, overrides);
      await lock.on("Hold", (address1, address2, num, a, b) => {
        setProgressFlag(false);
        getLpBalance(lptokenaddr);
      });
    } catch (err) {
      // console.log('Lock token error');
      setErrLabel('Lock error');
      // console.log(err)
      setProgressFlag(false)
      setErroShow(true)
      return;
      // console.log(err);
    }
  }

  const withdraw = async () => {

    setProgressFlag(true)
    setErroShow(false)

    let lock;

    lock = CreateLockContract();

    if(!lock) {
      setProgressFlag(false)
      setErroShow(true)
      return 
    }

    let overrides = {

      gasPrice: 0,

      // The maximum units of gas for the transaction to use
      gasLimit: 23000,

    };

    try {
      await lock.withdraw(lptokenaddr);
      await lock.on("Withdrawal", (address1, address2, num) => {
        setProgressFlag(false);
        getLpBalance(lptokenaddr);
      }); 
      // await lock.withdraw(lptokenaddr);
    } catch (err) {
      // console.log('Withdraw token error');
      setErrLabel('Withdraw lp token error');

      if(err.data) {
        if(err.data.message.toString().includes("Unlock time")) {
          setDigOpen(true);
        }
      }
      
      if(err.toString().includes("Unlock time")) {
        setDigOpen(true);
      }

      setProgressFlag(false)
      setErroShow(true)
      return;
      // console.log(err);
    }

    // setProgressFlag(false)
    // getLpBalance(lptokenaddr);
  };

  const withdraw_remove_fee = async (address) => {
    setProgressFlag(true)
    setErroShow(false)

    let lock;

    lock = CreateLockContract();

    if(!lock) {
      setProgressFlag(false)
      setErroShow(true)
      return 
    }

    try {
      await lock.panicWithdraw(lptokenaddr);
      await lock.on("PanicWithdraw", (address1, address2, num, num2) => {
        setProgressFlag(false);
        getLpBalance(lptokenaddr);
      }); 
      // await lock.withdraw(erctokenaddr);
    } catch (err) {
      setErrLabel("Withdraw token error");
      setProgressFlag(false)
      setErroShow(true)
      return;
    }
  };

  const claimtokenfees = async (address) => {

    try {
      await lockconractaddr.claimTokenFees(address);
    } catch (err) {
      // console.log('claimToken fees error');
      return;
      // console.log(err);
    }
  };
  
  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <GridContainer justifyContent="center">
      <GridItem xs={12} sm={12} md={8}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Liqudity Locker</h4>
            <p className={classes.cardCategoryWhite}>
            Use the locker to prove to investors you have locked liquidity. If you are not a token developer, this section is almost definitely not for you.{" "}</p>
          </CardHeader>
          <CardBody>
            {/* <GridContainer> */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <ForwardToInboxIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField fullWidth id="input-with-sx" value = {tokenstaddr} onChange={(e) => addrChange(e.target.value)} label="Input token address" variant="standard" />
            </Box>
            { progressflag && <GridContainer justifyContent="center">
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            </GridContainer>}

            {erroflag && (
            <Danger>
              <ErrorIcon />
              {errlabel}
            </Danger>
            )}

            {transactiveflag && (
            <div>
              <GridContainer justifyContent="center">
                  <GridItem xs={10} sm={10} md={4}>
                      <p>Token Balance:</p><Danger><h3>{tokenbalance}</h3></Danger>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <p>Possible Amount:</p><Danger><h3>{lockallowance}</h3></Danger>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <p>Locked Amount:</p><Danger><h3>{tokenlockedamount}</h3></Danger>
                  </GridItem>
              </GridContainer>
              <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Amount"
                    id="idamount"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                <Label>
                    Input time
                    <TextField
                      id="idlocktime"
                      // label="Unlock time"
                      type="datetime-local"
                      defaultValue={new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                      disabled={lock_flag}
                      sx={{ width: 215 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Label>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                {/* <CustomInput
                    labelText="Penalty Fee : 50"
                    id = "idpenaltyfee"
                    formControlProps={{
                      fullWidth: true,
                      disabled:true
                    }}
                  /> */}
                </GridItem>
              </GridContainer>
            </div>
            )}
            </CardBody>
            {transactiveflag && (
            <CardFooter>
                <Button disabled={approve_flag} onClick={(e) => approveToken()} color="primary">Approve</Button>
                <Button disabled={lock_flag} onClick={(e) => locktoken()} color="primary">Lock</Button>
                <Button disabled={unlock_flag} onClick={(e) => withdraw()} color="primary">unLock</Button>
            </CardFooter>
            )}
        </Card>
      </GridItem>
      {/* {transactiveflag && ( */}
      <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="success">
                {/* <Icon>content_copy</Icon> */}
                <AddAlarmIcon />
              </CardIcon>
            </CardHeader>
            <CardBody>
              <Info><small>Token:</small></Info><Danger>{name}({symbol})</Danger>
              <br />
              <Info><small>Fee:</small></Info><Danger>{price} coin</Danger>
              <br />
              <Info><small>PFee:</small></Info><Danger>{penalfee}</Danger>
              <br />
              <Info><small>Unlock time:</small></Info><Danger>{unlocktime}</Danger>
                
            </CardBody>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  Get more space
                </a>
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
      {/* )} */}
      <PanicWithdrawDlg open={opendis} onClose={handledlgClose} />
    </GridContainer>
  );
}