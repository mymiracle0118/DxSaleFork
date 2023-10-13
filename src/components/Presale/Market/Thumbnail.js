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
import Button from '@mui/material/Button';

// import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from "../../Table/Table.js";
import CircularProgressWithLabel from "../../Progress/CircleProgress.js"

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
import { Warning } from "@material-ui/icons";


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

export default function Thumbnail(props) {

    const classes = useStyles();

    const {percent, raised, hardcap, mincap, maxcap, softcap, liquidity, flagstr, timestr, time, timechangeflag, tokenname, tokensymbol, index, personalShow} = props;

    const MoreInfo = () => {
        personalShow(index);
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <Info><b>{tokensymbol}</b></Info>
                    <Info>{tokenname}</Info>
                </CardHeader>
                <Divider textAlign="center"></Divider>
                <CardBody>
                    <GridContainer justifyContent="center">
                        <CircularProgressWithLabel color="success" size={140} thickness={3.5} value={percent} />
                    </GridContainer>
                    <GridContainer justifyContent="center">
                        <Primary>Raised:&nbsp;{raised}/{hardcap}</Primary>
                    </GridContainer>
                    <GridContainer justifyContent="center">
                        <Info>Soft Cap:&nbsp;{softcap}</Info>
                    </GridContainer>
                    <GridContainer justifyContent="center">
                        <Success>Min:&nbsp;{mincap}/Max:&nbsp;{maxcap}</Success>
                    </GridContainer>
                    <GridContainer justifyContent="center">
                        <Info>Liquidity:&nbsp;{liquidity}%</Info>
                    </GridContainer>
                    <GridContainer justifyContent="center">
                        <Danger><b>{flagstr}</b></Danger>
                    </GridContainer>
                </CardBody>
                <GridContainer justifyContent="center">
                    <Button color="info" variant="contained" onClick={(e) => MoreInfo()}>
                        More
                    </Button>
                </GridContainer>
                <Divider textAlign="center"></Divider>
                <GridContainer justifyContent="center">
                    <Info><p><b>{timestr}</b></p></Info>
                </GridContainer>
                <GridContainer justifyContent="center">
                    <Info><b>{time}</b></Info>
                </GridContainer>
            </Card>
        </div>
    );
}

