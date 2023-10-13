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

//Component
import CustomInput from "../CustomInput/CustomInput.js";
import Button from '@mui/material/Button';
import TokenItem from "./TokenItem.js";

// import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from "../Table/Table.js";
import CircularProgressWithLabel from "../Progress/CircleProgress.js"

//Color
import Danger from "../Typography/Danger.js";
import Success from "../Typography/Success.js";
import Primary from "../Typography/Primary.js";
import Info from "../Typography/Info.js";

//Utility
import { ethers, BigNumber as EthersBigNumber } from 'ethers';

import { red, pink, purple, deepPurple, indigo, blue, green, lightGreen, deepOrange } from '@mui/material/colors';

//Icon
import ErrorIcon from '@material-ui/icons/Error';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import CardIcon from "../../components/Card/CardIcon.js";

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


export default function LoadTokens(props) {

    const classes = useStyles();

    const {getTokens, tokenListInfo} = props;

    // console.log("token list", tokenListInfo);
    const [tokens, setTokens] = useState("");
    const [verifyurl, setVerifyUrl] = useState("https://github.com/webpro2021/Verify-Reflection-Contract");

    useEffect( () => {
        if(tokenListInfo.length > 0) {
            const newlist = tokenListInfo.map((token, index) => {
                return processData(token);
            });
            setTokens(newlist);
        }
    }, [tokenListInfo]);

    const processData = (token) => {
        let decimal = token.decimal.toString();
        let balance = ethers.utils.formatUnits ( token.balance , parseInt(token.decimal) );
        let supply = ethers.utils.formatUnits ( token.supply , parseInt(token.decimal) );
        let name = token.name;
        let address = token.address;
        let symbol = token.symbol;
        let type = parseInt(token.type) === 1 ? "Standard" : "Reflection";
        let state = "";
        let color = "success";
        // if(parseInt(token.type) === 1) {
        if(parseInt(token.type) === 2) {
            color = "danger";
        }
        if( parseInt(token.state.mintflag) === 1) {
            state = state + "mint";
        }
        
        if( parseInt(token.state.burnflag) === 1) {
            state = state + ", burn";
        }

        if( parseInt(token.state.pauseflag) === 1) {
            state = state + ", pause";
        }
        if( parseInt(token.state.blacklistflag) === 1) {
            state = state + ", blacklist";
        }
        
        if(state === "") {
            state = "-";
        }
        
        return {
            name,
            symbol,
            balance,
            decimal,
            supply,
            address,
            type,
            state,
            color,
        };
    }
    
    const LoadTokens = () => {
        getTokens();
    }

    return (
        <Card>
            <CardHeader color="danger">
                <h4 className={classes.cardTitleWhite}>Created Tokens</h4>
                <p className={classes.cardCategoryWhite}>Your created tokens</p>
            </CardHeader>

            {/* <Divider textAlign="center"></Divider> */}
            <GridContainer justifyContent="center">
                <Link href={verifyurl} target="_blank" color="success" underline="hover">
                    <Primary><p><b>For instructions on code verification (Reflection Tokens) click here!</b></p></Primary>
                </Link>
            </GridContainer>
            <Divider textAlign="center"></Divider>
            <CardBody>
                <GridContainer>
                {tokens.length > 0 && tokens.map((token, index) => {
                    // console.log("list item", token);
                    return (
                        <GridItem key={index} xs={12} sm={6} md={3}>
                            <TokenItem itemcolor={token.color} name={token.name} symbol={token.symbol} address={token.address} decimal={token.decimal} balance={token.balance} state={token.state} supply={token.supply} type={token.type}/>
                        </GridItem>
                    );
                })}
                </GridContainer> 
                
            </CardBody>
            <GridContainer justifyContent="center">
                {/* <GridItem xs={12} sm={12} md={3}> */}
                <Button color="primary" onClick={(e) => LoadTokens()} variant="contained" >Load Tokens</Button>
                {/* </GridItem> */}
            </GridContainer>
            <p />
        </Card>
    )
};