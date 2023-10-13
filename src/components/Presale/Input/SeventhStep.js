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

export default function LinkInfo(props) {

    const classes = useStyles();

    //Props
    const { sitelink, githublink, twitterlink, redditlink, telegramlink, nextstep, prevstep, changestepvalue } = props;

    //State Variable
    const [site_link, setSiteLink] = useState('');
    const [gitbub_link, setGithubLink] = useState('');
    const [twitter_link, setTwitterLink] = useState('');
    const [reddit_link, setRedditLink] = useState('');
    const [telegram_link, setTelegramLink] = useState('');
    const [erroflag,  setErrorFlag] = useState(false);
    const [errlabel, setErrorLabel] = useState("Error");

    useEffect(()=> {
        setSiteLink(sitelink);
        setGithubLink(githublink);
        setTwitterLink(twitterlink);
        setRedditLink(redditlink);
        setTelegramLink(telegramlink);
    })

    const errorShow = (flag, label) => {
        setErrorFlag(flag);
        setErrorLabel(label);
    } 

    const siteLinkChange = async (val) => {
        changestepvalue('linkinfo', {site_link:val, github_link:gitbub_link, twitter_link:twitter_link, reddit_link:reddit_link, telegram_link:telegram_link});
        errorShow(false, "");
    }

    const githubChange = async (val) => {
        changestepvalue('linkinfo', {site_link:site_link, github_link:val, twitter_link:twitter_link, reddit_link:reddit_link, telegram_link:telegram_link});
        errorShow(false, "");
    }

    const twitterChange = async (val) => {
        changestepvalue('linkinfo', {site_link:site_link, github_link:gitbub_link, twitter_link:val, reddit_link:reddit_link, telegram_link:telegram_link});
        errorShow(false, "");
    }

    const redditChange = async (val) => {
        changestepvalue('linkinfo', {site_link:site_link, github_link:gitbub_link, twitter_link:twitter_link, reddit_link:val, telegram_link:telegram_link});
        errorShow(false, "");
    }

    const telegramChange = async (val) => {
        changestepvalue('linkinfo', {site_link:site_link, github_link:gitbub_link, twitter_link:twitter_link, reddit_link:reddit_link, telegram_link:telegram_link, telegram_link:val});
        errorShow(false, "");
    }

    const NextButtonClick = () => {
        // if(validate(linkinfo_array))
        nextstep('timings');
    }

    const PrevButtonClick = () => {
        prevstep('listingrate');
    }

    // const validate = (softcap, hardcap) => {
    //     if( parseFloat(softcap) <= 0 || parseFloat(hardcap) <= 0) {
    //         errorShow(true, "The number should be greater than zero");
    //         return false;
    //     } else if(parseFloat(softcap) >= parseFloat(hardcap)) {
    //         errorShow(true, "Hardcap should be greater than Softcap");
    //         return false;
    //     }
    //     errorShow(false, "");
    //     return true;
    // }

    return (
        <div>
            {/* <GridContainer justifyContent="center"> */}
                <h4>Please fill out the additional information below to display it on your presale. (Information in this section is optional, but a description and logo link is recommended)
                <br /><br />
Note the information in this section can be updated at any time by the presale creator while the presale is active. Any links left blank will not be displayed on your sale.</h4>

                <Label>Website Link:
                    <TextField fullWidth id="input-with-sx" value = {site_link} onChange={(e) => siteLinkChange(e.target.value)} label="" variant="outlined" />
                </Label>
                
                <Label>Github Link:
                    <TextField fullWidth id="input-with-sx" value = {gitbub_link} onChange={(e) => githubChange(e.target.value)} label="" variant="outlined" />
                </Label>

                <Label>Twitter Link:
                    <TextField fullWidth id="input-with-sx" value = {twitter_link} onChange={(e) => twitterChange(e.target.value)} label="" variant="outlined" />
                </Label>
                
                <Label>Reddit Link:
                    <TextField fullWidth id="input-with-sx" value = {reddit_link} onChange={(e) => redditChange(e.target.value)} label="" variant="outlined" />
                </Label>

                <Label>Telegram Link:
                    <TextField fullWidth id="input-with-sx" value = {telegram_link} onChange={(e) => telegramChange(e.target.value)} label="" variant="outlined" />
                </Label>
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