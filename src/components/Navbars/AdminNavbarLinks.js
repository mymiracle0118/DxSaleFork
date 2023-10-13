import React, { useEffect } from "react";
// import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// import MenuItem from "@material-ui/core/MenuItem";
// import MenuList from "@material-ui/core/MenuList";
// import Grow from "@material-ui/core/Grow";
// import Paper from "@material-ui/core/Paper";
// import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
// import Poppers from "@material-ui/core/Popper";
// import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// import Notifications from "@material-ui/icons/Notifications";
// import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
// import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import styles from "../../assets/jss/material-dashboard-react/components/headerLinksStyle.js";

// import Typography from "@material-ui/core/Typography";
// import { blue } from "@material-ui/core/colors";

import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import IconButton from '@material-ui/core/IconButton';

import { useWalletConnector, setNet } from "../WalletConnector.js"
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles(styles);

const wallets = ["MetaMask", "BSCWallet", "Wallet Connect"];
const netlists = ["Ethereum", "Bsc"];

const usedlgStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function DisconDialog(props) {
  const { logoutWalletConnector} = useWalletConnector();
  const {account} = useWeb3React();
  const { onClose, open, setAccount } = props;

  const handleClose = () => {
    if (account === undefined) {
      setAccount("Wallet");
    }
    onClose();
  };

  const handleDiscon = () => {
    logoutWalletConnector();
    setAccount("Wallet");
    onClose();
  }

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Account Address"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {account}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscon} color="primary">
            Disconnect
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}

function WalletSelect(props) {
  const classes = usedlgStyles();

  const { onClose, open, setWallet } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    setWallet(value);
    onClose();
  };
  
  return (
    <Dialog onClose={handleClose} aria-labelledby="select-dialog-title" open={open}>
      <DialogTitle id="select-dialog-title">Connect Wallet</DialogTitle>
      <List>
        {wallets.map((dwallet) => (
          <ListItem button onClick={() => handleListItemClick(dwallet)} key={dwallet}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={dwallet} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

function NetSelect(props) {
  const classes = usedlgStyles();
  const { loginMetamask, 
    loginWalletConnect, 
    loginBSC} = useWalletConnector();
  const {account} = useWeb3React();
  // console.log("child", account)
  const { onClose, open, setAccount, wallet } = props;

  useEffect(() => {
    if (account !== undefined) {
      setAccount("Connected");
    }
  }, [account])

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {

    if(value === 'Ethereum') {
      setNet(0);
      // console.log(value);
    } 
    else if(value === 'Bsc') {
      setNet(1);
      // console.log(value);
    }
      
    if(wallet === "MetaMask")
      loginMetamask();
    else if(wallet === "BSCWallet")
      loginBSC();
    else if(wallet === "Wallet Connect")
      loginWalletConnect();
    // console.log(window.localStorage.getItem('walletconnect'))
    onClose();
    // console.log(account)
    // console.log("account info")
    // console.log(web3info)
  };
  
  return (
    <Dialog onClose={handleClose} aria-labelledby="select-dialog-title" open={open}>
      <DialogTitle id="select-dialog-title">Network Select</DialogTitle>
      <List>
        {netlists.map((netitem) => (
          <ListItem button onClick={() => handleListItemClick(netitem)} key={netitem}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={netitem} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

const buttonuseStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function AdminNFavbarLinks() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [netopen, setNetOpen] = React.useState(false);
  const [opendis, setDisOpen] = React.useState(false);
  const [accountAddr, setAccountAddr] = React.useState("Wallet");
  const buttonstyle = buttonuseStyles();
  const [selwallet, setSelWallet] = React.useState('');

  useEffect(() => {
    if(window.ethereum)
    {
      window.ethereum.on('chainChanged', (chainId) => {
        console.log('Chain Id changed!');
      });

      window.ethereum.on('accountsChanged', (accountad) => {
        console.log('account changed!');
      });
    }
  }, [window.ethereum]);

  // useEffect(() => {
    
  // }, [accountAddr]);

  const handleClickOpen = () => {

    if(accountAddr === "Wallet") {
      setDisOpen(false);
      setOpen(true);
    }
    else {
      setDisOpen(true);
      setOpen(false);
    }
      
  };

  const handleClose = (value) => {
    setOpen(false);
    setNetOpen(true);
  };

  const handleDisconClose = () => {
    setDisOpen(false);
  }

  const handleNetClose = (value) => {
    setNetOpen(false);
  }

  const setWallet = (value) => {
    setSelWallet(value);
  }

  // useEffect(() => {
  //   console.log("parent", accountAddr)
  // }, [accountAddr])
  // console.log(accountAddr)
  return (
    <div>
      <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search,
          }}
          inputProps={{
            placeholder: "Search",
            inputProps: {
              "aria-label": "Search",
            },
          }}
        />
        <Button color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div>
 
      <Button
        variant="contained"
        color="info"
        className={buttonstyle.margin}
        startIcon={<Person />}
        onClick={handleClickOpen}
      >
        {accountAddr}
      </Button>

      <WalletSelect open={open} onClose={handleClose} setWallet={setWallet} />
      <NetSelect open={netopen} wallet={selwallet} setAccount={setAccountAddr} onClose={handleNetClose} />
      <DisconDialog open={opendis} onClose={handleDisconClose} setAccount={setAccountAddr} />    
    </div>
  );
}
