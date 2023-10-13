//Default
import React from "react";
import { useState, useEffect } from 'react';

//Style
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../../Loader/Loader.js";
import CircularProgress from '@mui/material/CircularProgress';

//Group
import GridItem from "../../Grid/GridItem.js";
import GridContainer from "../../Grid/GridContainer.js";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

//Input
import TextField from '@mui/material/TextField';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import CustomInput from "../../CustomInput/CustomInput.js";
import Button from '@mui/material/Button';
import { Label, Input } from 'reactstrap';
import Checkbox from '@mui/material/Checkbox';

//Typography
import Danger from "../../Typography/Danger.js";
import Success from "../../Typography/Success.js";
import Primary from "../../Typography/Primary.js";
import Info from "../../Typography/Info.js";

import { red, pink, purple, deepPurple, indigo, blue, green, lightGreen, deepOrange } from '@mui/material/colors';

//Icon
import ErrorIcon from '@material-ui/icons/Error';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

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

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function ConfirmDlg(props) {

    const classes = useStyles();

    //Props
    const { movefirststep, movedashboard } = props;

    const [checkflag, setCheckFlag] = useState({
        check1:false, 
        check2:false, 
        check3:false, 
        check4:false, 
        check5:false, 
        check6:false, 
        check7:false, 
        check8:false, 
        check9:false});
    
    const [confirm_disable, setConfirmED] = useState(true);

    const data = [
        { id: 1, name: "check1", text: "I have tested my token with the TKREV app on a test network.(Ex Ropsten or BSC testnet)" },
        { id: 2, name: "check2", text: "My token has a function to disable special transfers or has no special transfers" },
        { id: 3, name: "check3", text: "My token is not already listed on the target DEX and I have not given out any tokens to users" },
        { id: 4, name: "check4", text: "I understand that TKREV is not responsible for any issues or loss of funds caused due to errors or exploits of code." },
        { id: 5, name: "check5", text: "I understand fees paid to launch a SALE are non-recoverable" },
        { id: 6, name: "check6", text: "I understand that I have to finalize my sale within 48 hours of hitting the hardcap!" },
        { id: 7, name: "check7", text: "I am using TKREV as a software tool only and am responsible for anything I create on it" },
        { id: 8, name: "check8", text: "I understand that I am responsible for following my local laws and regulations including KYC and AML practices." },
        { id: 9, name: "check9", text: "I have read and agree to the terms and conditions" },
    ];

    //State Variable
    // const [tokenstaddr, setTokenStAddr] = useState('');

    const okclick = async () => {
        movefirststep(false);
    }

    const cancelclick = async () => {
        movedashboard(false);
    }

    const handleChange = (event) => {
        let flag = true;

        setCheckFlag({
          ...checkflag,
          [event.target.name]: event.target.checked,
        });

        data.map((str) => {
            if(str.name == event.target.name) {
                if(!event.target.checked)
                    flag = false;
            } else if(!checkflag[str.name]) {
                flag = false;
            }
        });

        if(flag) {
            setConfirmED(false);
        } else {
            setConfirmED(true);
        }
    };

    const checkAll = (event) => {
        data.map((str) => {
            // console.log(str.name);
            setCheckFlag(previousInputs => ({ ...previousInputs, [str.name]: event.target.checked }))
        });
        
        if(event.target.checked) {
            setConfirmED(false);
        } else {
            setConfirmED(true);
        }
        
    }

    return (
        <div>
            <GridContainer justifyContent="center">
                <FormGroup>
                    {data.map((str) => (
                        <FormControlLabel key={str.name} control={<Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />}  />} checked={checkflag[str.name]} onChange={handleChange} name={str.name} label={str.text} />
                    ))}
                </FormGroup>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={1}>
                </GridItem>
                 <GridItem xs={12} sm={12} md={2}>
                    <FormControlLabel control={<Checkbox {...label} onChange={checkAll} icon={<FavoriteBorder />} checkedIcon={<Favorite />}  />} label={"Agree all"} />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    <Button color="warning" variant={'outlined'} onClick={(e) => okclick()} disabled={confirm_disable}>
                            Confirm
                    </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    <Button color="warning" variant={'outlined'} onClick={(e) => cancelclick()}>
                            Cancel
                    </Button>
                </GridItem>
            </GridContainer>
        </div>
    );
}