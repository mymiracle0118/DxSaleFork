    //Default
import React from "react";
import { useState, useEffect } from 'react';

//Style
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../../Loader/Loader.js";
import CircularProgress from '@mui/material/CircularProgress';

// import Chip from '@mui/material/Chip';

//Group
import GridItem from "../../Grid/GridItem.js";
import GridContainer from "../../Grid/GridContainer.js";

import Card from "../../Card/Card.js";
import CardHeader from "../../Card/CardHeader.js";
import CardBody from "../../Card/CardBody.js";
import CardAvatar from "../../Card/CardAvatar.js";
import CardFooter from "../../Card/CardFooter.js";

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

//Component
import CustomInput from "../../CustomInput/CustomInput.js";
import Button from "../../CustomButtons/Button.js";
import Thumbnail from "./Thumbnail.js";

// import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from "../../Table/Table.js";

//Color
import Danger from "../../Typography/Danger.js";
import Success from "../../Typography/Success.js";
import Primary from "../../Typography/Primary.js";
import Info from "../../Typography/Info.js";

//Utility
import { ethers, BigNumber as EthersBigNumber } from 'ethers';

import { red, pink, purple, deepPurple, indigo, blue, green, lightGreen, deepOrange } from '@mui/material/colors';

//Icon
import ErrorIcon from '@material-ui/icons/Error';
import GetAppIcon from '@mui/icons-material/GetApp';

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

export default function PresaleList(props) {

    const classes = useStyles();

    const {presalecount, listcount, presaleinfo, load4presale, load20presale, personalShow, search, filter_presale} = props;

    const [list, setList] = useState([presaleinfo]);

    //State Var
    const [selectedValue, setSelectedValue] = React.useState('entire');

    const SearchButtonClick = () => {
        let str = document.getElementById("presale_address").value;
        search(str);
    }

    useEffect(()=> {
        // console.log("PreslaeInfo", presaleinfo);
        if( presaleinfo.length > 0 ) {
            // console.log("preslaeinfo", presaleinfo);
            const newList = presaleinfo.map((presale) => {
               return processPresaleData(presale);
            });
            // console.log('newList', newList)
            setList(newList);
        } else {
            setList([]);
        }
    },[presaleinfo])

    const calculatePercent = (a, b) => {
        // console.log("percent a", a);
        // console.log("percent b", b);
        return (b/a) * 100;
    }

    const convertFlagtoStr = (flag) => {
        // console.log("flag", flag);
        if(flag === 3) {
            return {status:"Failed", timestr:"Presale Failed", timeshow:-1};
        } else if(flag === 2) {
            return {status:"Success", timestr:"Unlocks On", timeshow:1};
        } else if(flag === 1) {
            return {status:"Active", timestr:"Presale End:", timeshow:1};
        } else if(flag === 0) {
            return {status:"Pending", timestr:"Presale Start:", timeshow:0};
        }
    }

    const processPresaleData = (presale) => {
        // console.log("presale", presale)
        let id = presale.address;
        let raised = ethers.utils.formatUnits (presale.status.raised_amount, 18);
        let softcap = ethers.utils.formatUnits ( presale.info.softcap, 18);
        let hardcap = ethers.utils.formatUnits (presale.info.hardcap, 18);
        let liquidity = parseFloat(presale.info.liqudity_percent);
        let percent = calculatePercent(parseFloat(hardcap), parseFloat(raised));
        let min = ethers.utils.formatUnits (presale.info.raise_min, 18);
        let max = ethers.utils.formatUnits (presale.info.raise_max, 18);
        // console.log("calc percent", percent)
        let flagarray = convertFlagtoStr(presale.available_flag.toNumber());
        let index = presale.index;
        let token_name = presale.tokeninfo.name;
        let token_symbol = presale.tokeninfo.symbol;
        let flagstr = flagarray.status;
        let timestr = flagarray.timestr;
        let time;
        let date;
        // console.log("flagstr", flagstr);
        // console.log("flagarray", flagarray);

        // console.log("timeshow", flagarray.timeshow);
        // flagarray.timeshow = -1;

        if(flagarray.timeshow === -1) {
            time = "-";
        } else if(flagarray.timeshow === 0) {
            date = new Date(presale.info.presale_start.toNumber() * 1000);
            time = date.toLocaleString('en-GB');
        } else if(flagarray.timeshow === 1) {
            date = new Date(presale.info.presale_end.toNumber() * 1000);
            time = date.toLocaleString('en-GB');
        } else if(flagarray.timeshow === 2) {
            date = new Date(presale.info.lock_end.toNumber() * 1000);
            time = date.toLocaleString('en-GB');
        }
        // console.log("flagstr", flagstr)
        return {id,
          index,
          raised,
          hardcap,
          percent,
          min,
          max,
          liquidity,  
          flagstr,
          timestr,
          time:time,
          softcap,
          token_name,
          token_symbol};
    }

    //Step select
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        filter(event.target.value);
    };

    const controlProps = (item) => ({
        checked: selectedValue === item,
        onChange: handleChange,
        value: item,
        name: 'color-radio-button-demo',
        inputProps: { 'aria-label': item },
      });

    const convertStateInt = (state) => {
        let stateint = 0;
        switch(state) {
            case "entire":
                stateint = 0;
            break;
            case "active":
                stateint = 1;
            break;
            case "success":
                stateint = 2;
            break;
            case "failed":
                stateint = 3;
            break;
        }
        return stateint;
    }
    
    const filter = (state) => {
        
        filter_presale(convertStateInt(state));
    }

    const load4Button = () => {
        load4presale(convertStateInt(selectedValue));
    }

    const load20Button = () => {
        load20presale(convertStateInt(selectedValue));
    }

    return (
        <div>
            <div>
                <GridContainer justifyContent="center">
                    <Primary><b>Decentralized Launchpad With Instant Listing And Liquidity Locking</b></Primary>
                </GridContainer>
                {/* <Divider textAlign="center"></Divider> */}
                <GridContainer justifyContent="center">
                    <GridItem xs={12} sm={12} md={3}>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <TextField fullWidth  placeholder="Input Presale Address" id="presale_address" variant="standard" />
                            <Button color="white" aria-label="edit" onClick={(e) => SearchButtonClick()} justIcon round>
                                <Search />
                            </Button>
                        </Box>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                    </GridItem>
                </GridContainer>
                {/* <Divider textAlign="center"></Divider> */}
                <GridContainer justifyContent="center">
                    <FormControl component="fieldset">
                    {/* <FormLabel component="legend">labelPlacement</FormLabel> */}
                    <RadioGroup row aria-label="position" name="position" defaultValue="top">
                        <FormControlLabel
                            value="step1"
                            control={<Radio size="small" {...controlProps('entire')} 
                            sx={{'&.Mui-checked': {color: col_step1,},}}
                            />}
                            label="Entire"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                        value="step1"
                        control={<Radio size="small" {...controlProps('active')} 
                        sx={{'&.Mui-checked': {color: col_step1,},}}
                        />}
                        label="Active"
                        labelPlacement="end"
                        />
                        <FormControlLabel
                        value="step2"
                        control={<Radio size="small" {...controlProps('success')}
                        sx={{'&.Mui-checked': {color: col_step2,},}}
                        />}
                        label="Success"
                        labelPlacement="end"
                        />
                        <FormControlLabel
                        value="step3"
                        control={<Radio size="small" {...controlProps('failed')}
                        sx={{'&.Mui-checked': {color: col_step3,},}}
                        />}
                        label="Failed"
                        labelPlacement="end"
                        />
                    </RadioGroup>
                    </FormControl>
                </GridContainer>
                <Divider textAlign="center"></Divider>
            </div>
            <div>
                <GridContainer>
                    {list.length > 0 && list.map((thumb, index) => {
                        // console.log("list", thumb)
                        return (
                        <GridItem key={index} xs={12} sm={12} md={3}>
                            <Thumbnail percent={thumb.percent} raised={thumb.raised} hardcap={thumb.hardcap} softcap={thumb.softcap} mincap={thumb.min} maxcap={thumb.max} liquidity={thumb.liquidity} flagstr={thumb.flagstr} timestr={thumb.timestr} time={thumb.time} tokenname={thumb.token_name} tokensymbol={thumb.token_symbol} index={thumb.index} personalShow={personalShow}/>
                        </GridItem>
                        )
                    })}
                    {/* <GridItem xs={12} sm={12} md={3}>
                        <Thumbnail percent={30} raised={10} hardcap={10} softcap={1} mincap={10} maxcap={10} flagstr={"Success"} timestr="Presale Ended" time="-"/>        
                    </GridItem> */}
                              
                </GridContainer>
                <Divider textAlign="center"></Divider>
            </div>
            <div>
                <GridContainer justifyContent="center">
                    <GridItem xs={12} sm={12} md={3}>
                        <Button color="info" onClick={(e) => load4Button()} round >
                            Load4
                        </Button>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <h4>{listcount}/{parseInt(presalecount)}</h4>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <Button color="info" onClick={(e) => load20Button()} round >
                            Load20
                        </Button>
                    </GridItem>
                </GridContainer>
            </div>
        </div>
    );
}
