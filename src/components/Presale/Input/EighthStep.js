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

export default function Timings(props) {

    const classes = useStyles();

    //Props
    const { presalestart, presaleend, lockend, nextstep, prevstep, changestepvalue } = props;

    //State Variable
    const [presale_start, setPresaleStart] = useState(presalestart);
    const [presale_end, setPresaleEnd] = useState(presaleend);
    const [lock_end, setLockEnd] = useState(lockend);
    const [erroflag,  setErrorFlag] = useState(false);
    const [errlabel, setErrorLabel] = useState("Error");

    useEffect(()=> {
        setPresaleStart(presalestart);
        setPresaleEnd(presaleend);
        setLockEnd(lockend);
    })

    const errorShow = (flag, label) => {
        setErrorFlag(flag);
        setErrorLabel(label);
    } 

    const presaleStartChange = async (val) => {
        changestepvalue('timings', {presale_start:val.target.value, presale_end:presale_end, lock_end:lock_end});
        errorShow(false, "");
    }

    const presaleEndChange = async (val) => {
        changestepvalue('timings', {presale_start:presale_start, presale_end:val.target.value, lock_end:lock_end});
        errorShow(false, "");
    }

    const lockEndChange = async (val) => {
        changestepvalue('timings', {presale_start:presale_start, presale_end:presale_end, lock_end:val.target.value});
        errorShow(false, "");
    }

    const NextButtonClick = () => {
        if(validate(presale_start, presale_end, lock_end))
            nextstep('final');
    }

    const PrevButtonClick = () => {
        prevstep('linkinfo');
    }

    const validate = (presale_start, presale_end, lock_end) => {
        let curtime = Date().toLocaleString();
        let curtimenum, prestartnum, preendnum, lockendnum;
        curtimenum = Date.parse(curtime);
        prestartnum = Date.parse(presale_start);
        preendnum = Date.parse(presale_end);
        lockendnum = Date.parse(lock_end);
        // 604800000 1 week
        // 2678400000 1 month
        if( curtimenum > prestartnum ) {
            errorShow(true, "Start time should be later than current time");
            return false;
        // } else if((preendnum - prestartnum) < 604800000 || (preendnum - prestartnum) <= 0) {
        } else if((preendnum - prestartnum) <= 0) {
            errorShow(true, "Presale end time can should be later than presale start time!");
            return false;
        } else if((lockendnum - prestartnum) < 2678400000 || (lockendnum - prestartnum) <= 0) {
            errorShow(true, "Liquidity Lock time must be at least 1 month after Presale End Time!");
            return false;
        }
        errorShow(false, "");
        // return true;
        return true;
    }

    return (
        <div>
            {/* <GridContainer justifyContent="center"> */}
                <h4>Please set the start and end time for the following parameters!</h4>
                <p>Presale Start/End</p>
                <TextField
                    id="presale_start"
                    label="Presale Start Time"
                    type="datetime-local"
                    onChange={(e) => presaleStartChange(e)}
                    defaultValue={presale_start}
                    sx={{ width: 250 }}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                
                <TextField
                    id="presale_end"
                    label="Presale End Time"
                    type="datetime-local"
                    defaultValue={presale_end}
                    onChange={(e) => presaleEndChange(e)}
                    sx={{ width: 250 }}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                
                <p>Lock End</p>
                <TextField
                    id="lock_end"
                    label="Lock End Time"
                    type="datetime-local"
                    defaultValue={lock_end}
                    onChange={(e) => lockEndChange(e)}
                    sx={{ width: 250 }}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                {/* </Box> */}
                {erroflag && (
                <Danger>
                    <ErrorIcon />
                    {errlabel}
                </Danger>
                )}
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