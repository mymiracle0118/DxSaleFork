//Default
import React, { useEffect } from "react";

//Style
import { makeStyles } from "@material-ui/core/styles";

//Dialog
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

//Input
import Button from '@mui/material/Button';

//Link
import Link from '@mui/material/Link';

//Icon
import AnnouncementIcon from '@mui/icons-material/Announcement';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import Danger from "../Typography/Danger.js";
import Success from "../Typography/Success.js";
import Primary from "../Typography/Primary.js";
import Info from "../Typography/Info.js";

export default function AlertDialog(props) {

  const { onClose, open, alerttext} = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"><NotificationsActiveIcon color="info"/>{"Defi Site Says"}<NotificationsActiveIcon color="info"/></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* <Danger><p>{alerttext}</p></Danger> */}
            {alerttext}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
  );
}