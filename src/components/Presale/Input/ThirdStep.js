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

export default function SHCap(props) {

    const classes = useStyles();

    //Props
    const { softcap, hardcap, nextstep, prevstep, changestepvalue } = props;

    //State Variable
    const [softcapnum, setPresaleSoftCap] = useState(0);
    const [hardcapnum, setPresaleHardCap] = useState(0);
    const [erroflag,  setErrorFlag] = useState(false);
    const [errlabel, setErrorLabel] = useState("Error");

    useEffect(()=> {
        setPresaleSoftCap(softcap);
        setPresaleHardCap(hardcap);
    })

    const errorShow = (flag, label) => {
        setErrorFlag(flag);
        setErrorLabel(label);
    } 

    const softCapChange = async (val) => {
        changestepvalue('shcap', {softcap:val, hardcap:hardcap});
        errorShow(false, "");
    }

    const hardCapChange = async (val) => {
        changestepvalue('shcap', {softcap:softcap, hardcap:val});
        errorShow(false, "");
    }

    const NextButtonClick = () => {
        if(validate(softcap, hardcap))
            nextstep('contributionlimits');
    }

    const PrevButtonClick = () => {
        prevstep('presale_rate');
    }

    const validate = (softcap, hardcap) => {
        if( parseFloat(softcap) <= 0 || parseFloat(hardcap) <= 0) {
            errorShow(true, "The number should be greater than zero");
            return false;
        } else if(parseFloat(softcap) >= parseFloat(hardcap)) {
            errorShow(true, "Hardcap should be greater than Softcap");
            return false;
        }
        errorShow(false, "");
        return true;
    }

    return (
        <div>
            <GridContainer justifyContent="center">
                <h4>Enter presale caps: (Must be whole numbers with no decimal places) Softcap must be >= Hardcap!</h4>
                <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
                    <Label>SoftCap:
                    <TextField fullWidth type="number" id="input-with-sx" value = {softcapnum} onChange={(e) => softCapChange(e.target.value)} label="" variant="outlined" />
                    </Label>
                    
                    <Label>HardCap:
                    <TextField fullWidth type="number" id="input-with-sx" value = {hardcapnum} onChange={(e) => hardCapChange(e.target.value)} label="" variant="outlined" />
                    </Label>
                </Box>
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