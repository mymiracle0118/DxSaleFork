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
import Link from '@mui/material/Link';

//Component
import CustomInput from "../../CustomInput/CustomInput.js";
import Button from '@mui/material/Button';
import AlertDialog from "../../AlertDlg/Alert.js";

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
import axios from 'axios';

import { red, pink, purple, deepPurple, indigo, blue, green, lightGreen, deepOrange } from '@mui/material/colors';

//Icon
import ErrorIcon from '@material-ui/icons/Error';
import GetAppIcon from '@mui/icons-material/GetApp';

//Variable
import { GetCoinPriceURL } from "../../../Config/config.js";
import { CRYPTCOMPARE_API_KEY } from "../../../Config/config.js";

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
  tableUpgradeWrapper: {
    display: "block",
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    MsOverflowStyle: "-ms-autohiding-scrollbar",
  },
  table: {
    width: "100%",
    maxWidth: "100%",
    marginBottom: "1rem",
    backgroundColor: "transparent",
    borderCollapse: "collapse",
    display: "table",
    borderSpacing: "2px",
    borderColor: "grey",
    "& thdead tr th": {
      fontSize: "1.063rem",
      padding: "12px 8px",
      verticalAlign: "middle",
      fontWeight: "300",
      borderTopWidth: "0",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      textAlign: "inherit",
    },
    "& tbody tr td": {
      padding: "12px 8px",
      verticalAlign: "middle",
      borderTop: "1px solid rgba(0, 0, 0, 0.06)",
    },
    "& td, & th": {
      display: "table-cell",
    },
  },
  center: {
    textAlign: "center",
  },
};

const useStyles = makeStyles(styles);

export default function PersonalPresale(props) {

    const classes = useStyles();

    const [infobj, setInfoObj] = useState({});
    // const [userflag, setUserFlag] = useState(0);
    const [warning_falg, setWarningFlag] = useState({});
    const [depositflag, setDepositFlag] = useState(false);
    const [claimflag, setClaimFlag] = useState(false);
    const [withdrawflag, setWithdrawFlag] = useState(false);
    const [marketcap, setMarketCap] = useState(0);

    const [lockflag, setLockFlag] = useState(false);

    //Alert Dlg
    const [dlgshow, setDlgshow] = useState(false);
    const [errorstr, setErrorStr] = useState("Error");

    const {user, data, deposit, claimtoken, withdraw, lockliqudity, coin } = props;

    useEffect(() => {
        PrecessData();
    }, [data]);

    // console.log("Personal Data", data);

    const ErrorDlgShow = (flag, alertstr) => {
        setErrorStr(alertstr);
        setDlgshow(flag);
    }

    const onClose = () => {
        ErrorDlgShow(false, "");
    }

    // console.log("warning flag", warning_falg);

    const PrecessData = () => {

        let totoalsuppy = ethers.utils.formatUnits(data.tokeninfo.totalsupply.toString(), parseInt(data.tokeninfo.decimal));
        let tokenrate = ethers.utils.formatUnits(data.info.token_rate.toString(), parseInt(data.tokeninfo.decimal));
        let softcap = ethers.utils.formatUnits(data.info.softcap.toString(), 18);
        let hardcap = ethers.utils.formatUnits(data.info.hardcap.toString(), 18);
        let raised = ethers.utils.formatUnits(data.status.raised_amount.toString(), 18);
        // console.log("hardcap", hardcap)
        let mincap = ethers.utils.formatUnits(data.info.raise_min.toString(), 18);
        let maxcap = ethers.utils.formatUnits(data.info.raise_max.toString(), 18);
        let listingrate = ethers.utils.formatUnits(data.info.listing_rate.toString(), parseInt(data.tokeninfo.decimal));

        let tmpa = ethers.utils.parseUnits (hardcap, 18);
        let tmpb = ethers.utils.parseUnits (tokenrate, parseInt(data.tokeninfo.decimal));
        let tmpc = data.info.liqudity_percent;

        let presale_amount = ethers.utils.formatUnits(tmpa.mul(tmpb), 18 + parseInt(data.tokeninfo.decimal));
        
        // console.log("liqudity percent", data.info.liqudity_percent);
        // tmpa = ethers.utils.parseUnits (hardcap, 18);
        tmpb = ethers.utils.parseUnits(listingrate, parseInt(data.tokeninfo.decimal));
        
        // console.log(parseFloat(tmpc));
        let liqudity_amount = ethers.utils.formatUnits(tmpa.mul(tmpb).mul(tmpc), 18 + 2 + parseInt(data.tokeninfo.decimal));
        // let liqudity_amount = 0;

        let liqudity_percent = parseFloat(data.info.liqudity_percent);

        let date = new Date(data.info.presale_start.toNumber() * 1000);
        let starttime = date.toLocaleString('en-GB');

        date = new Date(data.info.presale_end.toNumber() * 1000);
        let endtime = date.toLocaleString('en-GB');
        
        date = new Date(data.info.lock_end.toNumber() * 1000);
        let lqendtime = date.toLocaleString('en-GB');

        let buyamount = ethers.utils.formatUnits(data.buyerinfo.base.toString(), 18);
        let reservetoken = ethers.utils.formatUnits(data.buyerinfo.sale.toString(), parseInt(data.tokeninfo.decimal));

        let flag = parseInt(data.available_flag);

        if(data.status.force_failed) {
            setWithdrawStatus();
        } else if(flag === 0) {
            setPending();
        } else if(flag === 1) {
            setDepositStatus();
        } else if(flag === 2) {
            if(data.status.lp_generation_complete) {
                setLockFlag(false);
                setClaimStatus();
            } else {
                setLockFlag(true);
                setLockStats();
            }
        } else if(flag === 3) {
            setWithdrawStatus();
        }

        let soft_cap, token_dump, liq_percent, sale_endtime, liq_time, max_contribution;

        soft_cap = false;
        token_dump = false;
        liq_percent = false;
        sale_endtime = false;
        liq_time = false;
        max_contribution = false;
        sale_endtime = false;

        if(parseFloat(softcap) < 1.0) {
            soft_cap = true;
        } 

        if(parseFloat(hardcap)/parseFloat(totoalsuppy) < 0.3) {
            token_dump = true;
        }

        if(parseFloat(liqudity_percent) < 60.0) {
            liq_percent = true;
        }

        if((parseFloat(endtime) - parseFloat(starttime)) < 3600000 * 2) {
            sale_endtime = true;
        }

        if((parseFloat(lqendtime) - parseFloat(endtime)) < 2678400000 * 3) {
            liq_time = true;
        }

        if(parseFloat(max_contribution) < 0.1 ) {
            max_contribution = true;
        }
        
        let url = "";
        if(coin == "ETH") {
            url = GetCoinPriceURL.eth;
        } else if(coin == "BNB") {
            url = GetCoinPriceURL.bsc;
        }

        url = url + "&api_key=" + CRYPTCOMPARE_API_KEY;

        axios.get(url)
        .then(res => {
            // console.log("price", res.data);
            let cap = parseFloat(hardcap) * parseFloat(res.data.USD);
            setMarketCap(cap);
        })

        setWarningFlag({
            soft_cap,
            token_dump,
            liq_percent,
            sale_endtime,
            liq_time,
            max_contribution,
        })

        setInfoObj({
            supply:totoalsuppy,
            presale_amount:presale_amount,
            liqudity_amount:liqudity_amount,
            softcap:softcap,
            hardcap:hardcap,
            raised:raised,
            tokenrate:tokenrate,
            listingrate:listingrate,
            liqudity_percent:liqudity_percent,
            mincap:mincap,
            maxcap:maxcap,
            starttime:starttime,
            endtime:endtime,
            lqendtime:lqendtime,
            buyamount:buyamount,
            reservetoken:reservetoken,
        })
    }

    const setPending = () => {
        setDepositFlag(true);
        setClaimFlag(true);
        setWithdrawFlag(true);
    }

    const setDepositStatus = () => {
        setDepositFlag(false);
        setClaimFlag(true);
        setWithdrawFlag(true);
    }

    const setClaimStatus = () => {
        setDepositFlag(true);
        setClaimFlag(false);
        setWithdrawFlag(true);
    }

    const setWithdrawStatus = () => {
        setDepositFlag(true);
        setClaimFlag(true);
        setWithdrawFlag(false);
        setLockFlag(false);
    }

    const setLockStats = () => {
        setDepositFlag(true);
        setClaimFlag(true);
        setWithdrawFlag(true);
    }

    const depositClick = () => {
        let amount = document.getElementById("deposit_amount").value;
        if(parseFloat(amount) < parseFloat(infobj.mincap)) {
            ErrorDlgShow(true, "Your balance should be greater than minimum contribution");
            return;
        } else if(parseFloat(amount) > parseFloat(infobj.maxcap)) {
            ErrorDlgShow(true, "Your balance should be less than maximum contribution");
            return;
        }
        deposit({address:data.address, amount:amount});
    }

    const claimButtonClick = () => {
        claimtoken(data.address);
    }

    const withdrawButtonClick = () => {
        withdraw(data.address);
    }
    
    const addLqButtonClick = () => {
        // console.log(data.info.presale_owner);
        if(data.info.presale_owner !== user) {
            ErrorDlgShow(true, "Only the contract owner can do it");
            return ;
        }
        
        lockliqudity(data.address, data.info.sale_token);
    }
    
    // const testButtonClick = () => {
    //     testbutton(data.address);
    // }
    
    // console.log("infoobj", infobj);

    return (
        <div>
        <GridContainer justifyContent="center">
            <GridItem xs={12} sm={12} md={8}>
            <Card>
                <CardHeader>
                    <Info><b>{data.tokeninfo.name}</b></Info>
                    <Info>{data.tokeninfo.symbol}</Info>
                </CardHeader>
                <Divider textAlign="center"></Divider>
                <CardBody>
                    <GridContainer justifyContent="center">
                        <Danger><p>Presale Address:&nbsp;&nbsp;&nbsp;</p></Danger>
                        <p><b>{data.address}</b></p>
                    </GridContainer>
                    <GridContainer justifyContent="center">
                        <Danger><p>Token Address:&nbsp;&nbsp;&nbsp;</p></Danger>
                        <p><b>{data.info.sale_token}</b></p>
                    </GridContainer>
                    <Divider textAlign="center"></Divider>
                    <GridContainer justifyContent="center">
                        <p><b>{infobj.raised}/{infobj.hardcap} {coin} Raised</b></p>
                    </GridContainer>
                    {/* <Divider textAlign="center"></Divider> */}
                    <GridContainer justifyContent="center">
                       <Stack direction="row" spacing={5}>
                            <TextField type="number" id="deposit_amount" placeholder={"1" + coin + "=" + infobj.tokenrate + " " + data.tokeninfo.symbol} label="" variant="standard" />
                            <Button color="primary" disabled={depositflag} variant="contained" onClick={(e) => depositClick()}>
                                Deposit
                            </Button>
                        </Stack>
                    </GridContainer>

                    <Divider textAlign="center"></Divider>

                    {!lockflag && (
                    <GridContainer justifyContent="center">
                       <p>
                        If you participated in the presale please click the claim button below to claim your tokens!
                       </p>
                    </GridContainer>)}

                    {!lockflag && (<GridContainer justifyContent="center">
                        <Button color="warning" variant="contained" disabled={claimflag} onClick={(e) => claimButtonClick()}>
                            Claim Tokens
                        </Button>
                    </GridContainer>)}

                    {!lockflag && (<GridContainer justifyContent="center">
                        <Stack direction="row" spacing={10}>
                            <Info><p>Your Contributed Amount:</p><Primary>{infobj.buyamount}</Primary></Info>
                            <Info><p>Your Claimable Tokens:</p><Primary>{infobj.reservetoken}&nbsp;{data.tokeninfo.symbol}</Primary></Info>
                        </Stack>
                        
                    </GridContainer>)}

                    <Divider textAlign="center"></Divider>

                    {!lockflag && (<GridContainer justifyContent="center">
                       <p>
                        You can withdraw your coin if the presale is failed.
                       </p>
                    </GridContainer>)}

                    {!lockflag && (<GridContainer justifyContent="center">
                        <Button color="warning" variant="contained" disabled={withdrawflag} onClick={(e) => withdrawButtonClick()}>
                            Withdraw
                        </Button>
                    </GridContainer>
                    )}

                    {/* <Divider textAlign="center"></Divider> */}

                    {lockflag && (<GridContainer justifyContent="center">
                       <p>
                        Presale is successfuly ended. You can claim tokens after liqudity lock has been finished. Only presale owner can do it.
                       </p>
                    </GridContainer> )}

                    {lockflag && (<GridContainer justifyContent="center">
                        <Button color="warning" variant="contained" onClick={(e) => addLqButtonClick()}>
                            Add Liqudity
                        </Button>
                    </GridContainer>)}

                    {/* {(<GridContainer justifyContent="center">
                        <Button color="warning" variant="contained" onClick={(e) => testButtonClick()}>
                            test
                        </Button>
                    </GridContainer>)} */}

                    <Divider textAlign="center"></Divider>
                    {/* <Divider textAlign="center"></Divider> */}
                    <GridContainer justifyContent="center">
                        <div className={classes.tableUpgradeWrapper}>
                            <table className={classes.table}>
                                <thead>
                                    <tr>
                                        <th />
                                        <th />
                                        <th />
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td><Info>Total Supply:</Info></td>    
                                        <td><b>{infobj.supply}</b> {data.tokeninfo.symbol}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Tokens for Presale:</Info></td>    
                                        <td><b>{infobj.presale_amount}</b> {data.tokeninfo.symbol}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Tokens for Liquidity:</Info></td>    
                                        <td><b>{infobj.liqudity_amount}</b> {data.tokeninfo.symbol}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Primary><b>Estimated Initial Marketcap:</b></Primary></td>    
                                        <td><b>${marketcap}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Soft Cap:</Info></td>    
                                        <td><b>{infobj.softcap}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Hard Cap:</Info></td>    
                                        <td><b>{infobj.hardcap}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Presale Rate:</Info></td>    
                                        <td><b>{infobj.tokenrate}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Liqudity Rate:</Info></td>    
                                        <td><b>{infobj.listingrate}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Liqudity Percent:</Info></td>    
                                        <td><b>{infobj.liqudity_percent}</b> {"%"}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Minimum Contribution:</Info></td>    
                                        <td><b>{infobj.mincap}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Maximum Contribution:</Info></td>    
                                        <td><b>{infobj.maxcap}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Presale Start time:</Info></td>    
                                        <td><b>{infobj.starttime}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Presale End time:</Info></td>    
                                        <td><b>{infobj.endtime}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><Info>Liqudity End time:</Info></td>    
                                        <td><b>{infobj.lqendtime}</b></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </GridContainer>
                    <Divider textAlign="center"></Divider>
                    
                </CardBody>

            </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
                <Card>
                    <CardHeader>
                        <Danger><b>Related Links</b></Danger>
                        <Info>Please visit these url for more detail</Info>
                    </CardHeader>
                    <Divider textAlign="center"></Divider>
                    <CardBody>
                        <Success><p>Website Link:</p></Success>
                        {/* <GridContainer> */}
                        <Link href={data.link.website_link} target="_blank" color="success" underline="hover">
                            {data.link.website_link}
                        </Link>
                        <Divider textAlign="center"></Divider>
                        {/* </GridContainer> */}
                        <Success><p>Github Link:</p></Success>
                        {/* <GridContainer> */}
                        <Link href={data.link.github_link} target="_blank" color="success" underline="hover">
                            {data.link.github_link}
                        </Link>
                        <Divider textAlign="center"></Divider>
                        <Success><p>Twitter Link:</p></Success>
                        {/* <GridContainer> */}
                        <Link href={data.link.twitter_link} target="_blank" color="success" underline="hover">
                            {data.link.twitter_link}
                        </Link>
                        <Divider textAlign="center"></Divider>
                        <Success><p>Reddit Link:</p></Success>
                        {/* <GridContainer> */}
                        <Link href={data.link.reddit_link} target="_blank" color="success" underline="hover">
                            {data.link.reddit_link}
                        </Link>
                        <Divider textAlign="center"></Divider>
                        <Success><p>Telegram Link:</p></Success>
                        {/* <GridContainer> */}
                        <Link href={data.link.telegram_link} target="_blank" color="success" underline="hover">
                            {data.link.telegram_link}
                        </Link>
                        <Divider textAlign="center"></Divider>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <Danger><p><b>KREV Warning System</b></p></Danger>
                        {/* <Primary>Please visit these url for more detail</Primary> */}
                    </CardHeader>
                    <Divider textAlign="center"></Divider>
                    <CardBody>
                        {warning_falg.soft_cap && 
                            <div>
                                <Danger>SoftCap Warning</Danger>
                                <p>The sofcap of this sale is very low.</p>
                            </div>
                        }

                        {warning_falg.token_dump && 
                            <div>
                                <Danger>Token Dump Warning</Danger>
                                <p>Too many tokens are held outside this sale. Make sure these tokens are burned, locked or the owner has a valid reason to hold them. Tokens held by teams can be sold to pull out liquidity and should be carefully examined.</p>
                            </div>
                        }

                        {warning_falg.liq_percent && 
                            <div>
                                <Danger>Liquidity Percentage Warning</Danger>
                                <p>This sale has a very low liquidity percentage.</p>
                            </div>
                        }

                        {warning_falg.liq_time && 
                            <div>
                                <Danger>Liquidity Time Warning</Danger>
                                <p>Liquidity of this sale unlocks in a very short timespan.</p>
                            </div>
                        }

                        {warning_falg.sale_endtime && 
                            <div>
                                <Danger>Sale Endtime Warning</Danger>
                                <p>The endtime for this sale is longer than 2 hours</p>
                            </div>
                        }

                        {warning_falg.max_contribution && 
                            <div>
                                <Danger>Max Contribution Warning</Danger>
                                <p>This sale has a very high maximum contribution ratio to hardcap allotment. A few users might be able to buy large portions of the supply</p>
                            </div>
                        }
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <Danger><b>Token Sniffer Scan</b></Danger>
                        <Primary>Please visit these url for details</Primary>
                    </CardHeader>
                    <Divider textAlign="center"></Divider>
                    <CardBody>
                        <GridContainer justifyContent="center">
                            <Link href={"https://tokensniffer.com/token/" + data.info.sale_token} target="_blank" color="success" underline="hover">
                                <b>{"Click Here"}</b>
                            </Link>
                        </GridContainer>
                    </CardBody>
                </Card>
            </GridItem>
            <AlertDialog open={dlgshow} onClose={onClose} alerttext={errorstr}/>
            </GridContainer>
        </div>
    );
}

