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

//Icon
import AnnouncementIcon from '@mui/icons-material/Announcement';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

//Typography
import Danger from "../Typography/Danger.js";
import Success from "../Typography/Success.js";
import Primary from "../Typography/Primary.js";
import Info from "../Typography/Info.js";

//Group
import GridItem from "../Grid/GridItem.js";
import GridContainer from "../Grid/GridContainer.js";

import Box from '@mui/material/Box';

//Component
import CircularProgress from '@mui/material/CircularProgress';

export default function ProgressDlg(props) {

  const { open, alerttext} = props;

//   const handleClose = () => {
//     onClose();
//   };

  return (
    <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title"></DialogTitle> */}
        <DialogContent>
            <GridContainer justifyContent="center">
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            </GridContainer>
            <GridContainer justifyContent="center">
                <Primary><p>{alerttext}</p></Primary>
            </GridContainer>
        </DialogContent>
      </Dialog>
  );
}