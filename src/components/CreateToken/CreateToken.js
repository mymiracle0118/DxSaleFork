//Default
import React from "react";
import { useState, useEffect } from 'react';

//Style
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../Loader/Loader.js";
import CircularProgress from '@mui/material/CircularProgress';

// import Chip from '@mui/material/Chip';

//Group
import GridItem from "../Grid/GridItem.js";
import GridContainer from "../Grid/GridContainer.js";

import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";
import CardAvatar from "../Card/CardAvatar.js";
import CardFooter from "../Card/CardFooter.js";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

//Input
import TextField from '@mui/material/TextField';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import { Label, Input } from 'reactstrap';
import Radio from '@mui/material/Radio';
// import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Search from "@material-ui/icons/Search";
import Link from '@mui/material/Link';
import Switch from '@mui/material/Switch';

//Component
import CustomInput from "../CustomInput/CustomInput.js";
import Button from '@mui/material/Button';
import AlertDialog from "..//AlertDlg/Alert.js";
import ProgressDlg from "../AlertDlg/ProgressDlg.js";

// import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from "../Table/Table.js";
import CircularProgressWithLabel from "../Progress/CircleProgress.js"

//Color
import Danger from "../Typography/Danger.js";
import Success from "../Typography/Success.js";
import Primary from "../Typography/Primary.js";
import Info from "../Typography/Info.js";

//Icon
import ErrorIcon from '@material-ui/icons/Error';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import CardIcon from "../../components/Card/CardIcon.js";
import Checkbox from '@mui/material/Checkbox';

//color
import { red, pink, purple, deepPurple, indigo, blue, green, lightGreen, deepOrange } from '@mui/material/colors';

//Web3
import { Contract, ethers, BigNumber as EthersBigNumber } from 'ethers';
import coinAddressValidator from 'coin-address-validator';
import isValidAddress from "../AddressValidator.js";  

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

const col_step1 = red.A400; 
const col_step2 = pink.A100; 
const col_step3 = purple.A400; 
const col_step4 = deepPurple[500]; 
const col_step5 = indigo.A200; 
const col_step6 = blue.A200;
const col_step7 = green.A400; 
const col_step8 = lightGreen.A400; 
const col_step9 = deepPurple.A400;

const standard_info = {
  name:"",
  symbol:"",
  decimal:0,
  totalsupply:0,
  owner:"",
  burn:0,
  mint:0,
  pause:0,
  blacklist:0,
  def_flag:0,
};

const deflation_info = {
  tax_fee:0,
  tax_address:"",
  burn_fee:0,
  buyback_fee:0,
  hold_fee:0,
  lp_fee:0,
  flag:0,
};

export default function CreateToken(props) {

    const classes = useStyles();

    const {createStandardToken, createLiqudityToken, changeFeeInfo, user_addr} = props;

    const [owner_switch, setOwnerSwitch] = React.useState(false);
    const [buyback_switch, setBuybackSwitch] = React.useState(false);
    const [holder_switch, setHolderSwitch] = useState(false);
    const [lp_switch, setLpSwitch] = useState(false);
    const [tax_switch, setTaxSwitch] = useState(true);
    const [deflation, setDeflation] = React.useState(false);

    //Alert Dlg
    const [dlgshow, setDlgshow] = useState(false);
    const [errorstr, setErrorStr] = useState("Error");

    //Progress Dlg
    const [progressdlg_flag, setProgressDlgFlag] = useState(false);
    const [progress_str, setProgressDlgStr] = useState("Starting");

    const [checkflag, setCheckFlag] = useState({
      burn: false,
      mint: false,
      pause: false,
      blacklist: false,
    })

    const ckeckoption = [
        {  name: "mint", text: "Can Mint"},
        {  name: "burn", text: "Can Burn"},
        {  name: "pause", text: "Can Pause"},
        {  name: "blacklist", text: "Can Blacklist"},
    ];

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

    const checkValidate = () => {
      
      //name check
      if(standard_info.name === '') {
        ErrorDlgShow(true, "Please Input token name");
        ProgressDlgShow(false, "");
        return false;
      }

      //symbol check
      if(standard_info.symbol === '') {
        ErrorDlgShow(true, "Please input token symbol");
        ProgressDlgShow(false, "");
        return false;
      }

      //decimal check
      if(!standard_info.decimal) {
        ErrorDlgShow(true, "Please input decimal");
        ProgressDlgShow(false, "");
        return false;
      }

      if(standard_info.decimal <= 0 || standard_info.decimal > 18) {
        ErrorDlgShow(true, "Decimal should be between 1 to 18");
        ProgressDlgShow(false, "");
        return false;
      }

      //total supply check
      if(!standard_info.totalsupply) {
        ErrorDlgShow(true, "Please input totoal supply");
        ProgressDlgShow(false, "");
        return false;
      }


      //total supply check
      if(standard_info.totalsupply <= 0) {
        ErrorDlgShow(true, "Please input connrect token total supply");
        ProgressDlgShow(false, "");
        return false;
      }


      //Owner address check
      if(standard_info.owner === '') {
        ErrorDlgShow(true, "Please input tokne owner address");
        ProgressDlgShow(false, "");
        return false;
      }

      let isEthAddress = coinAddressValidator.validate(standard_info.owner, 'eth', 'prod');

      if( !isEthAddress ) {
        ErrorDlgShow(true, "Token owner address is invalid");
        ProgressDlgShow(false, "");
        return false
      }

      if(!deflation) {
        return true;
      }
      //Deflation Check
      //Tax recive address & tax fee check
      if(deflation_info.flag !== 3) {
        if(deflation_info.tax_address === '') {
          ErrorDlgShow(true, "Please input tax recieve address");
          ProgressDlgShow(false, "");
          return false;
        }
        
        isEthAddress = coinAddressValidator.validate(deflation_info.tax_address, 'eth', 'prod');
        if( !isEthAddress ) {
          ErrorDlgShow(true, "Tax recieve address is invalid");
          ProgressDlgShow(false, "");
          return false
        }

        if(!deflation_info.tax_fee) {
          ErrorDlgShow(true, "Please input tax fee");
          ProgressDlgShow(false, "");
          return false;
        }

        if(deflation_info.tax_fee < 0 || deflation_info.tax_fee > 100) {
          ErrorDlgShow(true, "Tax fee should be between 0 to 100");
          ProgressDlgShow(false, "");
          return false;
        }
      }
      
      //burn fee check
      if(deflation_info.flag === 0 || deflation_info.flag === 1) {
        if(!deflation_info.burn_fee) {
          ErrorDlgShow(true, "Please input burn fee");
          ProgressDlgShow(false, "");
          return false;
        }

        if(deflation_info.burn_fee < 0 || deflation_info.burn_fee > 100) {
          ErrorDlgShow(true, "Burn fee should be between 0 to 100");
          ProgressDlgShow(false, "");
          return false;
        }
      }

      //holder fee check
      if(deflation_info.flag !== 0) {
        if(!deflation_info.hold_fee) {
          ErrorDlgShow(true, "Please input holders recieve fee");
          ProgressDlgShow(false, "");
          return false;
        }

        if(deflation_info.hold_fee < 0 || deflation_info.hold_fee > 100) {
          ErrorDlgShow(true, "Holders recieve fee should be between 0 to 100");
          ProgressDlgShow(false, "");
          return false;
        }
      }


      //check buyback fee
      if(deflation_info.flag === 2) {
        if(!deflation_info.buyback_fee) {
          ErrorDlgShow(true, "Please input buyback fee");
          ProgressDlgShow(false, "");
          return false;
        }

        if(deflation_info.buyback_fee < 0 || deflation_info.buyback_fee > 100) {
          ErrorDlgShow(true, "Buyback fee should be between 0 to 100");
          ProgressDlgShow(false, "");
          return false;
        }
      }

      //check lp fee
      if(deflation_info.flag === 3 || deflation_info.flag === 4) {
        if(!deflation_info.lp_fee) {
          ErrorDlgShow(true, "Please input auto lp fee");
          ProgressDlgShow(false, "");
          return false;
        }

        if(deflation_info.lp_fee < 0) {
          ErrorDlgShow(true, "Auto LP fee should be greater than zero");
          ProgressDlgShow(false, "");
          return false;
        }
      }

      return true;
    }

    const handleCreatetoken = () => {

      //Standard info
      standard_info.name = document.getElementById("tokenname").value;
      standard_info.symbol = document.getElementById("tokensymbol").value;
      standard_info.decimal = parseFloat(document.getElementById("tokendecimal").value);
      standard_info.totalsupply = parseFloat(document.getElementById("totalsupply").value);
         
      if(owner_switch) {
        standard_info.owner = document.getElementById("owneraddr").value;
      } else {
        standard_info.owner = user_addr;
      }

      standard_info.burn = checkflag["burn"]?1:0;
      standard_info.mint = checkflag["mint"]?1:0;
      standard_info.pause = checkflag["pause"]?1:0;
      standard_info.blacklist = checkflag["blacklist"]?1:0;
      standard_info.def_flag = deflation;

      // console.log("standard", standard_info);
      // console.log("testinfo", document.getElementById("taxrecieveaddress").value)

      //Deflation Process
      if(deflation) {

        if(tax_switch) {
          deflation_info.tax_address = document.getElementById("taxrecieveaddress").value;
          deflation_info.tax_fee = parseFloat(document.getElementById("transactiontax").value);
        } else {
          deflation_info.tax_address = user_addr;
          deflation_info.tax_fee = 0;
        }

        if(buyback_switch) {
          deflation_info.buyback_fee = parseFloat(document.getElementById("buybackfee").value);
          deflation_info.burn_fee = 0;
        } else {
          deflation_info.buyback_fee = 0;
        }

        if( !buyback_switch && !lp_switch) {
          deflation_info.burn_fee = parseFloat(document.getElementById("burnfee").value);
        } else {
          deflation_info.burn_fee = 0;
        }

        if(holder_switch) {
          deflation_info.hold_fee = parseFloat(document.getElementById("reward_fee").value);
        } else {
          deflation_info.hold_fee = 0;
        }
        
        if(lp_switch) {
          deflation_info.lp_fee = parseFloat(document.getElementById("lp_fee").value);
        } else {
          deflation_info.lp_fee = 0;
        }
        // deflation_info.flag = document.getElementById("transactiontax").value;
        // buyback_switch lp_switch tax_switch holder_switch
        
        if( !buyback_switch && !lp_switch) {
          if(holder_switch) {
            deflation_info.flag = 1;
          } else {
            deflation_info.flag = 0;
          }
        } else if(buyback_switch) {
          deflation_info.flag = 2;
        } else if(lp_switch) {
          if(tax_switch) {
            deflation_info.flag = 4;
          } else {
            deflation_info.flag = 3;
          }  
        }
      }

      if( !checkValidate() ) {
        return;
      }
      if(!deflation) {
        createStandardToken(standard_info);
      } else {
        createLiqudityToken(standard_info, deflation_info);
      }
    }

    const ownerSwitchChange = (event) => {
      setOwnerSwitch(event.target.checked);
    };

    const buyback_change = (event) => {
      setBuybackSwitch(event.target.checked);
      if(event.target.checked) {
        setHolderSwitch(event.target.checked);
      }
    }

    const holder_change = (event) => {
      setHolderSwitch(event.target.checked);
      if(!event.target.checked) {
        setBuybackSwitch(event.target.checked);
        setLpSwitch(event.target.checked);
        setTaxSwitch(true);
      }
    }

    const lp_change = (event) => {
      setLpSwitch(event.target.checked);
      setBuybackSwitch(false);
      if(event.target.checked) {
        setHolderSwitch(event.target.checked);
        setTaxSwitch(false);
      } else {
        setTaxSwitch(true);
      }
    }

    const tax_change = (event) => {
      setTaxSwitch(event.target.checked);
    }

    const selectCheck = (event) => {
      
      let flag;

      if(event.target.checked) {
        flag = changeFeeInfo(event.target.name, true);
      } else {
        flag = changeFeeInfo(event.target.name, false);
      }

      if(flag === false) {
          setCheckFlag({
          ...checkflag,
          [event.target.name]: false,
        });
      } else {
        setCheckFlag({
          ...checkflag,
          [event.target.name]: event.target.checked,
        });
      }
    }

    const deflationChange = (event) => {
      // setDeflation(event.target.checked);
      let flag = true;
      if(event.target.checked) {
        flag = changeFeeInfo(event.target.name, true);
      } else {
        flag = changeFeeInfo(event.target.name, false);
      }

      if(flag === false) {
        setDeflation(false);
      } else {
        setDeflation(event.target.checked);
      }
    }

    return (
        <Card>
            <CardHeader color="danger">
            <h4 className={classes.cardTitleWhite}>Create Token</h4>
            <p className={classes.cardCategoryWhite}>Create your own token</p>
            </CardHeader>
            <CardBody>
            {/* Standard Token Input */}
            <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                <TextField
                    id="tokenname"
                    label="Name"
                    variant="standard"
                />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                <TextField
                    id="tokensymbol"
                    label="Symbol"
                    variant="standard"
                />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                <TextField
                    id="tokendecimal"
                    label="decimal"
                    type="number"
                    variant="standard"
                />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                <TextField
                    id="totalsupply"
                    label="Total Supply"
                    type="number"
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    variant="standard"
                />
                </GridItem>
            </GridContainer>

            <p />

            {/* Input Create/Owner Address */}
            <div>
                <FormControlLabel
                control={
                    <Switch checked={owner_switch} onChange={ownerSwitchChange} color="info" inputProps={{ 'aria-label': 'controlled' }} />
                }
                label="Advanced"
                />
                {/* </GridContainer> */}
                {owner_switch && (<GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={11}>
                    <TextField
                    label="Create/Owner Address"
                    id="owneraddr"
                    variant="standard"
                    fullWidth
                    />
                </GridItem>
                </GridContainer>)}
            </div>

            <p />

            <Divider textAlign="center"></Divider>
            {/* Other Config */}
            <GridContainer justifyContent="center">
                <Stack direction="row" spacing={0}>
                {ckeckoption.map((item) => (
                    <FormControlLabel key={item.name} control={<Checkbox sx={{
                        '&.Mui-checked': {color: col_step5}
                    }} />} checked={checkflag[item.name]} onChange={selectCheck} name={item.name} label={item.text} />
                ))}
                <FormControlLabel control={<Checkbox sx={{
                        '&.Mui-checked': {color: col_step1}
                    }} />} checked={deflation} onChange={deflationChange} name={"deflation"} label="Deflation" label="Deflation" />
                </Stack>
            </GridContainer>

            {/* Deflation */}
            {deflation && <div>
                {/* Trandaction Tax Fee & Address Switch*/}
                {lp_switch && <FormControlLabel
                control={
                    <Switch checked={tax_switch} onChange={tax_change} color="info" inputProps={{ 'aria-label': 'controlled' }} />
                }
                label="Transaction Tax"
                />}

                {/* Trandaction Tax Fee*/}
                {tax_switch && <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={11}>
                    <TextField
                        id="transactiontax"
                        label="Transaction Tax(%)"
                        type="number"
                        fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        variant="standard"
                    />
                </GridItem>
                </GridContainer>}
                {/* Recive Address */}
                {tax_switch && <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={11}>
                    <TextField
                        id="taxrecieveaddress"
                        label="Tax Recieve Address"
                        // type="number"
                        fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        variant="standard"
                    />
                </GridItem>
                </GridContainer>}

                {/* Burn Fee*/}
                {(!buyback_switch && !lp_switch) && <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={11}>
                    <TextField
                        id="burnfee"
                        label="Burn Fee(%)"
                        type="number"
                        fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        variant="standard"
                    />
                </GridItem>
                </GridContainer>}
                
                <p />

                {/* Buyback Switch */}
                {!lp_switch && <FormControlLabel
                control={
                    <Switch checked={buyback_switch} onChange={buyback_change} color="info" inputProps={{ 'aria-label': 'controlled' }} />
                }
                label="Buyback Tax"
                />}

                {/* Buyback Input */}
                {buyback_switch && <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={11}>
                    <TextField
                        id="buybackfee"
                        label="Buyback Fee(%)"
                        type="number"
                        fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        variant="standard"
                    />
                </GridItem>
                </GridContainer>}

                <p />

                {/* Holder switch */}
                <FormControlLabel
                control={
                    <Switch checked={holder_switch} onChange={holder_change} color="info" inputProps={{ 'aria-label': 'controlled' }} />
                }
                label="Holders reward fee"
                />

                {/* Holder reward fee*/}
                {holder_switch && <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={11}>
                    <TextField
                        id="reward_fee"
                        label="Holders reward fee(%)"
                        type="number"
                        fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        variant="standard"
                    />
                </GridItem>
                </GridContainer>}

                <p />

                {/* Automatic LP Switch */}
                <FormControlLabel
                control={
                    <Switch checked={lp_switch} onChange={lp_change} color="info" inputProps={{ 'aria-label': 'controlled' }} />
                }
                label="Automatic LP"
                />

                <p />

                {/* Automatic LP Fee */}
                {lp_switch && <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={11}>
                    <TextField
                        id="lp_fee"
                        label="Automatic LP(%)"
                        type="number"
                        fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        variant="standard"
                    />
                </GridItem>
                </GridContainer>}
            </div>}

            </CardBody>

            {/* <Divider textAlign="center"></Divider> */}

            {/* <CardFooter> */}
            <Info />
            <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={3}>
                <Button color="info" onClick={(e) => handleCreatetoken()} variant="contained" >Create Token</Button>
                </GridItem>
            </GridContainer>
            {/* </CardFooter> */}
            <p />
            <AlertDialog open={dlgshow} onClose={onClose} alerttext={errorstr}/>
            <ProgressDlg open={progressdlg_flag} alerttext={progress_str} />
        </Card>
    )
};