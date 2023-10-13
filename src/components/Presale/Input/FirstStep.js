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

//Utility
import { ethers, BigNumber as EthersBigNumber } from 'ethers';

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

export default function TokenInput(props) {

    const classes = useStyles();

    //Props
    const { tokenaddress, progressflag, erroflag, errlabel, nextactive, getInfo, tokeninfo, nextstep, changestepvalue } = props;

    //State Variable
    const [tokenstaddr, setTokenStAddr] = useState('');

    useEffect(()=> {
        setTokenStAddr(tokenaddress);
    })

    const addrChange = async (address) => {
        getInfo(address);
        changestepvalue('address', {tokenaddress:address});
        setTokenStAddr(address);
    }

    const NextButtonClick = () => {
        nextstep('presale_rate');
    }

    return (
        <div>
            <h4>Enter your token address</h4>
            {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }}> */}
                
                {/* <ForwardToInboxIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
                <TextField fullWidth id="input-with-sx" value = {tokenstaddr} onChange={(e) => addrChange(e.target.value)} label="Input token address" variant="outlined" />
            {/* </Box> */}
            { progressflag && <GridContainer justifyContent="center">
                <Box sx={{ display: 'flex' }}>
                <CircularProgress />
                </Box>
            </GridContainer>}

            {erroflag && (
            <Danger>
                <ErrorIcon />
                {errlabel}
            </Danger>
            )}

            <div>
                <p>Token Name.......................................{tokeninfo.name}</p>
                <p>Token Symbol.....................................{tokeninfo.symbol}</p>
                <p>Token Decimal....................................{tokeninfo.decimal}</p>
                <p>Token Balance....................................{tokeninfo.balance}</p>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={10}>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                    <Button color="secondary" variant="outlined" onClick={(e) => NextButtonClick()} disabled={nextactive}>
                        Next
                    </Button>
                    </GridItem>
                </GridContainer>
            </div>
        </div>
    );
}