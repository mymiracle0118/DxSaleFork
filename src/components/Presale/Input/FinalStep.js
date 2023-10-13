//Default
import React from "react";
import { useState, useEffect } from 'react';

//Style
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../../Loader/Loader.js";
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

//Group
import GridItem from "../../Grid/GridItem.js";
import GridContainer from "../../Grid/GridContainer.js";

import Box from '@mui/material/Box';

//Input
import TextField from '@mui/material/TextField';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import CustomInput from "../../CustomInput/CustomInput.js";
import Button from '@mui/material/Button';
import { Label, Input } from 'reactstrap';

//Typography
import Danger from "../../Typography/Danger.js";
import Success from "../../Typography/Success.js";
import Primary from "../../Typography/Primary.js";
import Info from "../../Typography/Info.js";

//Icon
import ErrorIcon from '@material-ui/icons/Error';

//Dlg
import AlertDialog from "../../AlertDlg/Alert.js";

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

export default function Final(props) {

    const classes = useStyles();

    //Props
    const { chain, presaleInfo, tokenfee, tokeninfo, nextstep, create_presale, approve_presale, submitactive, create_fee, lock_fee} = props;

    const [dlgshow, setDlgshow] = useState(false);
    const [errorstr, setErrorStr] = useState(false);
    const [tokenrequire,  setTokenRequire] = useState(0);
    const [tokenforpresale, setTokenForPresale] = useState(0);
    const [tokenforliqudity, setTokenForLiqudity] = useState(0);
    const [tokenFee, setTokenFee] = useState(0);
    const [swapstr, setSwapString] = useState("Uniswap");

    const ErrorDlgShow = (flag, alertstr) => {
      setErrorStr(alertstr);
      setDlgshow(flag);
    }

    useEffect(()=> {
      calcAmount();
      if(chain === "ETH") {
            setSwapString("Uniswap");
        } else if(chain === "BNB") {
            setSwapString("PancakeSwap");
        }
    },[chain])

    const calcAmount = () => {
      let tokenamount = parseFloat(presaleInfo.hardcap) * parseFloat(presaleInfo.presale_rate);
      let _tokenfee = (parseFloat(presaleInfo.hardcap) * parseFloat(tokenfee)) / 100 * presaleInfo.presale_rate;
      let liqudityrateamount = (parseFloat(presaleInfo.hardcap) * parseFloat(presaleInfo.listing_rate));
      
      let liquiditytoken = (liqudityrateamount * parseFloat(presaleInfo.lq_percent)) / 100;
      let tokensRequiredForPresale = tokenamount + liquiditytoken + _tokenfee;

      setTokenRequire(tokensRequiredForPresale);
      setTokenForPresale(tokenamount);
      setTokenForLiqudity(liquiditytoken);
      setTokenFee(_tokenfee);
      
      return tokensRequiredForPresale;
    }

    const onClose = () => {
      ErrorDlgShow(false, "");
    }

    const EditButtonClick = () => {
        nextstep('address');
    }

    const Validate = () => {

      let curtime = Date().toLocaleString();
      let curtimenum, prestartnum, preendnum, lockendnum;
      curtimenum = Date.parse(curtime);
      prestartnum = Date.parse(presaleInfo.presale_start);
      preendnum = Date.parse(presaleInfo.presale_end);
      lockendnum = Date.parse(presaleInfo.lock_end);
      let presale_fee = parseFloat(create_fee) + parseFloat(lock_fee);

      console.log("presale fee", presale_fee);
      
      if(tokeninfo.name === "none") {
        ErrorDlgShow(true, "Your Token address is an invalid Address!");
        return false;
      } else if(parseFloat(presaleInfo.presale_rate) <= 0) {
        ErrorDlgShow(true, "The presale rate should be greater than zero");
        return false;
      } else if(parseFloat(presaleInfo.softcap) <= 0 || parseFloat(presaleInfo.hardcap) <= 0) {
        ErrorDlgShow(true, "The softcap & hardcap should be greater than zero");
        return false;
      } else if(parseFloat(presaleInfo.softcap) >= parseFloat(presaleInfo.hardcap)) {
        ErrorDlgShow(true, "Hardcap should be greater than Softcap");
        return false;
      } else if(parseFloat(presaleInfo.softcap) >= parseFloat(presaleInfo.hardcap)) {
        ErrorDlgShow(true, "Hardcap should be greater than Softcap");
        return false;
      } else if(parseFloat(presaleInfo.mincap) <= 0 || parseFloat(presaleInfo.maxcap) <= 0) {
        ErrorDlgShow(true, "The min/max cap should be greater than zero");
        return false;
      } else if(parseFloat(presaleInfo.mincap) >= parseFloat(presaleInfo.maxcap)) {
        ErrorDlgShow(true, "Maxcap should be greater than Mincap");
        return false;
      } else if(parseFloat(presaleInfo.lq_percent) < 51 || parseFloat(presaleInfo.lq_percent) > 100) {
        ErrorDlgShow(true, "The Liquidity Percent should be between 51% & 100%");
        return false;
      } else if(parseFloat(presaleInfo.listing_rate) <= 0) {
        ErrorDlgShow(true, "The Listing Rate should be greater than zero");
        return false;
      } else if( curtimenum > prestartnum ) {
          ErrorDlgShow(true, "Start time should be later than current time");
          return false;
      // } else if((preendnum - prestartnum) < 604800000 || (preendnum - prestartnum) <= 0) {
      } else if((preendnum - prestartnum) <= 0) {
        ErrorDlgShow(true, "Presale end time should be later than presale start time!");
        return false;
      } else if((lockendnum - prestartnum) < 2678400000 || (lockendnum - prestartnum) <= 0) {
          ErrorDlgShow(true, "Liquidity Lock time must be at least 1 month after Presale End Time!");
          return false;
      } else if(tokenfee === "none") {
        ErrorDlgShow(true, "You should know some fees!");
        return false;
      } else if(tokenrequire < 1000) {
        ErrorDlgShow(true, "Token require amount for presale is very small!");
        return false;
      }else if(tokenrequire > parseInt(tokeninfo.balance)) {
        ErrorDlgShow(true, "Your token balance is insufficent");
        return false;
      } else if(tokenforliqudity < 300) {
        ErrorDlgShow(true, "Token require amount for liquidity is very small!");
        return false;
      } else if(parseFloat(tokeninfo.userbalance) < parseFloat(presale_fee)) {
        ErrorDlgShow(true, "Your balance is in sufficent!");
        return false;
      }

      return true;
    }

    const SubmitButtonClick = () => {
      if(!Validate()) {
        return;
      }
      create_presale(presaleInfo);
    }

    const ApproveButtonClick = () => {
      if(!Validate()) {
        return;
      }
      approve_presale(presaleInfo.token_address, tokenrequire);
    }

    return (
        <div>
            <h4>Review your details below then press submit to create your presale on the TKREV deployer! Or press edit to go back and edit information. Warning: once submitted this information can never be changed!</h4>
            {/* <br />
            <br /> */}
            <p>
            Note: You will need atleast <b>{tokenrequire}&nbsp;{tokeninfo.symbol} ({tokenforpresale} {tokeninfo.symbol} for presale, {tokenforliqudity} {tokeninfo.symbol} for liqudity, {tokenFee} {tokeninfo.symbol} for sold fee)</b> in your wallet to start this sale.
            <br />
            - You can adjust your total number of tokens required by adjusting the presale rate, {swapstr} rate or your hardcap!
            <br />
            - Tokens that are not used will remain locked in the presale contract (consider them burned)!</p>
            <div className={classes.tableUpgradeWrapper}>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th />
                    <th />
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Info>Token Name</Info></td>
                    <td>{tokeninfo.name}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><Info>Token Symbol</Info></td>
                    <td>{tokeninfo.symbol}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><Info>Presale Rate</Info></td>
                    <td>{presaleInfo.presale_rate}&nbsp;{tokeninfo.symbol}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><Info>Soft/Hard Caps</Info></td>
                    <td>{presaleInfo.softcap}</td>
                    <td>{presaleInfo.hardcap}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><Info>Contribution Limits</Info></td>
                    <td>{presaleInfo.mincap}</td>
                    <td>{presaleInfo.maxcap}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><Info>Presale Timings</Info></td>
                    <td></td>
                    <td>Start:&nbsp;&nbsp;{presaleInfo.presale_start}</td>
                    <td>End:&nbsp;&nbsp;{presaleInfo.presale_end}</td>
                  </tr>
                  <tr>
                    <td><Info>Uniswap Liquidity</Info></td>
                    <td>{presaleInfo.lq_percent}%</td>
                    <td></td>
                    <td>Unlock:&nbsp;&nbsp;{presaleInfo.lock_end}</td>
                  </tr>
                  <tr>
                    <td><Info>Uniswap Rate</Info></td>
                    <td>{presaleInfo.listing_rate}&nbsp;{tokeninfo.symbol}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={2}>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <Button color="secondary" variant="outlined" onClick={() => EditButtonClick()}>
                    Edit
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <Button color="secondary" variant="outlined" onClick={() => ApproveButtonClick()}>
                    Approve
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                <Button color="secondary" disabled={submitactive} variant="outlined" onClick={() => SubmitButtonClick()}>
                    Submit
                </Button>
                </GridItem>
            </GridContainer>
            <AlertDialog open={dlgshow} onClose={onClose} alerttext={errorstr}/>
        </div>
    );
}