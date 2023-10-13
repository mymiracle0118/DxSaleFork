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

//Component
import CustomInput from "../../CustomInput/CustomInput.js";
import Button from '@mui/material/Button';
import TokenInput from "./FirstStep.js";
import PresaleRate from "./SecondStep.js";
import SHCap from "./ThirdStep.js";
import MinMaxCap from "./FourthStep.js";
import LiqudityPercent from "./FifthStep.js";
import ListingRate from "./SixthStep.js";
import LinkInfo from "./SeventhStep.js";
import Timings from "./EighthStep.js";
import Final from "./FinalStep.js";

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
  step1: {

  }
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

// let createfee = "none";
// let raisefee = "none";
// let soldFee = "none";

export default function InputPresaleInfo(props) {

    const classes = useStyles();

    //Props
    const { progressflag, erroflag, errlabel, nextactive, getInfo, tokeninfo, feeinfo, lockfee, getFee, create_presale, approve_presale, submitactive, chain } = props;

    //State Var
    const [selectedValue, setSelectedValue] = React.useState('address');

    const [cratefee, setCreateFee] = React.useState("none");
    const [raisefee, setRaiseFee] = React.useState("none");
    const [soldfee, setSoldFee] = React.useState("none");
    const [lock_fee, setLockFee] = React.useState("none");

    const [presale_info, setPresaleInfo] = React.useState({
      token_address:"",
      presale_rate:0,
      softcap:0,
      hardcap:0,
      mincap:0,
      maxcap:0,
      lq_percent:0,
      listing_rate:0,
      site_link:"",
      github_link:"",
      twitter_link:"",
      reddit_link:"",
      telegram_link:"",
      presale_start:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16),
      presale_end:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16),
      lock_end:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
    })

    // console.log(feeinfo);
    useEffect(()=> {
      // getPrice();
      // getFeeInfo();
      if(feeinfo.length > 0) {
        // console.log(lockfee);
        getFeeInfo();
      }
    },[feeinfo])

    const getFeeInfo = () => {
      //console.log(ethers.utils.formatUnits ( lockfee , 18 ));
      setCreateFee(ethers.utils.formatUnits ( feeinfo.presale_create_fee , 18 ));
      setRaiseFee(feeinfo.raised_fee.toString());
      setSoldFee(feeinfo.sold_fee.toString());
      setLockFee(ethers.utils.formatUnits ( lockfee , 18 ));
    }
    //get standard token info
    const getinfo = async (address) => {
        getInfo(address);
    }

    //Step select
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
      getFee();
    };

    const controlProps = (item) => ({
      checked: selectedValue === item,
      onChange: handleChange,
      value: item,
      name: 'color-radio-button-demo',
      inputProps: { 'aria-label': item },
    });

    const changestepvalue = (id, data) => {
      if(id === "address") {
        setPresaleInfo({
          ...presale_info,
          token_address: data.tokenaddress,
        });
      } else if(id === "presale_rate") {
        setPresaleInfo({
          ...presale_info,
          presale_rate: data.presale_rate,
        });
      } else if(id === "shcap") {
        setPresaleInfo({
          ...presale_info,
          softcap: data.softcap,
          hardcap: data.hardcap,
        });
      } else if(id === "contributionlimits") {
        setPresaleInfo({
          ...presale_info,
          mincap: data.mincap,
          maxcap: data.maxcap,
        });
      } else if(id === "liquiditypercent") {
        setPresaleInfo({
          ...presale_info,
          lq_percent: data.liqudity_percent,
        });
      } else if(id === "listingrate") {
        setPresaleInfo({
          ...presale_info,
          listing_rate: data.listing_rate,
        });
      } else if(id === "linkinfo") {
        setPresaleInfo({
          ...presale_info,
          site_link: data.site_link,
          github_link:data.github_link,
          twitter_link:data.twitter_link,
          reddit_link:data.reddit_link,
          telegram_link:data.telegram_link,
        });
      } else if(id === "timings") {
        setPresaleInfo({
          ...presale_info,
          presale_start: data.presale_start,
          presale_end:data.presale_end,
          lock_end:data.lock_end,
        });
      }

      getFee();

    }

    const nextstep = (id) => {
      setSelectedValue(id);
    }

    const prevstep = (id) => {
      setSelectedValue(id);
    }

    const getFeeButtonClick = () => {
      getFee();
    }

    return (
        <div>
          <GridContainer justifyContent="center">
            <FormControl component="fieldset">
              {/* <FormLabel component="legend">labelPlacement</FormLabel> */}
              <RadioGroup row aria-label="position" name="position" defaultValue="top">
                <FormControlLabel
                  value="step1"
                  control={<Radio size="small" {...controlProps('address')} 
                  sx={{'&.Mui-checked': {color: col_step1,},}}
                  />}
                  label="Address"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="step2"
                  control={<Radio size="small" {...controlProps('presale_rate')}
                  sx={{'&.Mui-checked': {color: col_step2,},}}
                  />}
                  label="Price"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="step3"
                  control={<Radio size="small" {...controlProps('shcap')}
                  sx={{'&.Mui-checked': {color: col_step3,},}}
                  />}
                  label="S/H Cap"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="step4"
                  control={<Radio size="small" {...controlProps('contributionlimits')}
                  sx={{'&.Mui-checked': {color: col_step4,},}}
                  />}
                  label="Min/Max"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="step5"
                  control={<Radio size="small" {...controlProps('liquiditypercent')}
                  sx={{'&.Mui-checked': {color: col_step5,},}}
                  />}
                  label="Liqudity"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="step6"
                  control={<Radio size="small" {...controlProps('listingrate')}
                  sx={{'&.Mui-checked': {color: col_step6,},}}
                  />}
                  label="Listing Rate"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="step7"
                  control={<Radio size="small" {...controlProps('linkinfo')}
                  sx={{'&.Mui-checked': {color: col_step7,},}}
                  />}
                  label="Link Info"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="step8"
                  control={<Radio size="small" {...controlProps('timings')}
                  sx={{'&.Mui-checked': {color: col_step8,},}}
                  />}
                  label="Timings"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="step9"
                  control={<Radio size="small" {...controlProps('final')}
                  sx={{
                    color: pink[800],
                    '&.Mui-checked': {
                      color: col_step9,
                    },
                  }}/>}
                  label="Finish"
                  labelPlacement="end"
                />
              </RadioGroup>
            </FormControl>
          </GridContainer>
          <Divider textAlign="center">Step by Step</Divider>
          <GridContainer justifyContent="center">
            <IconButton color="secondary" onClick={(e) => getFeeButtonClick()} aria-label="add an alarm">
              <GetAppIcon />
            </IconButton>
            <Primary><p>Creation Fee:&nbsp;{cratefee},&nbsp;Raised Fee:&nbsp;{raisefee},&nbsp;Sold Fee:&nbsp;{soldfee},&nbsp;Lock Fee:&nbsp;{lock_fee}</p></Primary>
          </GridContainer>
          <Divider textAlign="center"></Divider>
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={12} md={10}>
              <Card>
                <CardBody>
                  {selectedValue === 'address' && <TokenInput tokenaddress={presale_info.token_address} progressflag={progressflag} erroflag={erroflag} errlabel={errlabel} nextactive={!nextactive} getInfo={getinfo} tokeninfo={tokeninfo} nextstep={nextstep} changestepvalue={changestepvalue}/>}

                  {selectedValue === 'presale_rate' && <PresaleRate chain={chain} presalerate={presale_info.presale_rate} nextstep={nextstep} prevstep={prevstep} changestepvalue={changestepvalue}/>}

                  {selectedValue === 'shcap' && <SHCap softcap={presale_info.softcap} hardcap={presale_info.hardcap} nextstep={nextstep} prevstep={prevstep} changestepvalue={changestepvalue}/>}

                  {selectedValue === 'contributionlimits' && <MinMaxCap mincap={presale_info.mincap} maxcap={presale_info.maxcap} nextstep={nextstep} prevstep={prevstep} changestepvalue={changestepvalue}/>}

                  {selectedValue === 'liquiditypercent' && <LiqudityPercent chain={chain} liqudity_percent={presale_info.lq_percent} nextstep={nextstep} prevstep={prevstep} changestepvalue={changestepvalue}/>}

                  {selectedValue === 'listingrate' && <ListingRate chain={chain} listing_rate={presale_info.listing_rate} nextstep={nextstep} prevstep={prevstep} changestepvalue={changestepvalue}/>}

                  {selectedValue === 'linkinfo' && <LinkInfo sitelink={presale_info.site_link} githublink={presale_info.github_link} twitterlink={presale_info.twitter_link} redditlink={presale_info.reddit_link} telegramlink={presale_info.telegram_link} nextstep={nextstep} prevstep={prevstep} changestepvalue={changestepvalue}/>}

                  {selectedValue === 'timings' && <Timings presalestart={presale_info.presale_start} presaleend={presale_info.presale_end} lockend={presale_info.lock_end} nextstep={nextstep} prevstep={prevstep} changestepvalue={changestepvalue}/>}

                  {selectedValue === 'final' && <Final create_fee={cratefee} lock_fee={lock_fee} chain={chain} presaleInfo={presale_info} tokeninfo={tokeninfo} nextstep={nextstep} tokenfee={soldfee} create_presale={create_presale} approve_presale={approve_presale} submitactive={submitactive}/>}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
    );
}