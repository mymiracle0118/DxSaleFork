import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

//Typography
import Danger from "../Typography/Danger.js";
import Success from "../Typography/Success.js";
import Primary from "../Typography/Primary.js";
import Info from "../Typography/Info.js";

export default function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
            <h3>{props.value}</h3>
          </Typography> */}
          <Primary>
              <h1><b>{`${Math.round(props.value)}%`}</b></h1>
          </Primary>
        </Box>
      </Box>
    );
  }
  
  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
  };