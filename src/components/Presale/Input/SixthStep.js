//Default
import React from "react";
import { useState, useEffect } from 'react';

//Style
import { makeStyles } from "@material-ui/core/styles";

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

//Color
import Danger from "../../Typography/Danger.js";
import Success from "../../Typography/Success.js";
import Primary from "../../Typography/Primary.js";
import Info from "../../Typography/Info.js";

//Icon
import ErrorIcon from '@material-ui/icons/Error';

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

export default function ListingRate(props) {

    const classes = useStyles();

    //Props
    const { listing_rate, nextstep, prevstep, changestepvalue, chain } = props;

    //State Variable
    const [listingrate, setLitingRate] = useState(0);
    const [erroflag,  setErrorFlag] = useState(false);
    const [errlabel, setErrorLabel] = useState("Error");
    const [swapstr, setSwapString] = useState("Uniswap");

    useEffect(()=> {
        setLitingRate(listing_rate);
        if(chain === "ETH") {
            setSwapString("Uniswap");
        } else if(chain === "BNB") {
            setSwapString("PancakeSwap");
        }
    }, [chain, listing_rate])

    const errorShow = (flag, label) => {
        setErrorFlag(flag);
        setErrorLabel(label);
    } 

    const listingRateChange = async (listingrate) => {
        changestepvalue('listingrate', {listing_rate:listingrate});
        errorShow(false, "");
    }

    const NextButtonClick = () => {
        if(validate(listingrate))
            nextstep('linkinfo');
    }

    const PrevButtonClick = () => {
        prevstep('liquiditypercent');
    }

    const validate = (val) => {
        if( parseFloat(val) <= 0) {
            errorShow(true, "The number should be greater than zero");
            return false;
        }
        errorShow(false, "");
        return true;
    }

    return (
        <div>
            <GridContainer>
            <h4>Enter the {swapstr} listing price: (If I buy 1 {chain} worth on {swapstr} how many tokens do I get? Usually this amount is lower than presale rate to allow for a higher listing price on {swapstr})</h4>
            {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }}> */}
                
                {/* <ForwardToInboxIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
                <TextField fullWidth type="number" id="input-with-sx" value = {listingrate} onChange={(e) => listingRateChange(e.target.value)} label="Input Listing Rate" variant="outlined" />
            {/* </Box> */}
                {erroflag && (
                <Danger>
                    <ErrorIcon />
                    {errlabel}
                </Danger>
                )}
            </GridContainer>
            <GridContainer>
                
                <GridItem xs={12} sm={12} md={2}>
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                    <Button color="secondary" variant="outlined" onClick={(e) => PrevButtonClick()}>
                    Prev
                </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                <Button color="secondary" variant="outlined" onClick={(e) => NextButtonClick()}>
                    Next
                </Button>
                </GridItem>
            </GridContainer>
        </div>
    );
}