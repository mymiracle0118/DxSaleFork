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

export default function LiqudityPercent(props) {

    const classes = useStyles();

    //Props
    const { liqudity_percent, nextstep, prevstep, changestepvalue, chain} = props;

    //State Variable
    const [lq_percent, setLqPercent] = useState(0);
    const [erroflag,  setErrorFlag] = useState(false);
    const [errlabel, setErrorLabel] = useState("Error");
    const [swapstr, setSwapString] = useState("Uniswap");

    useEffect(()=> {
        setLqPercent(liqudity_percent);
        // console.log("chain", chain);
        if(chain === "ETH") {
            setSwapString("Uniswap");
        } else if(chain === "BNB") {
            setSwapString("PancakeSwap");
        }
    }, [chain, liqudity_percent])

    const errorShow = (flag, label) => {
        setErrorFlag(flag);
        setErrorLabel(label);
    } 

    const lqChange = async (lqpercent) => {
        changestepvalue('liquiditypercent', {liqudity_percent:lqpercent});
        errorShow(false, "");
    }

    const NextButtonClick = () => {
        if(validate(lq_percent))
            nextstep('listingrate');
    }

    const PrevButtonClick = () => {
        prevstep('contributionlimits');
    }

    const validate = (val) => {
        if( parseFloat(val) < 51 || parseFloat(val) > 100) {
            errorShow(true, "The number should be between 51% & 100%");
            return false;
        }
        errorShow(false, "");
        return true;
    }

    return (
        <div>
            <GridContainer>
            <h4>Enter the percentage of raised funds that should be allocated to Liquidity on {swapstr} (Min 51%, Max 100%, We recommend > 70%)</h4>
            {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }}> */}
                
                {/* <ForwardToInboxIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
                <TextField fullWidth type="number" id="input-with-sx" value = {lq_percent} onChange={(e) => lqChange(e.target.value)} label="Input Liqudity Percent" variant="outlined" />
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