import { IconButton, Typography } from '@mui/material'
import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function YearSlider({year, yearAvgs, plusYear, minusYear}) {
  return (
    <div className='avgRow space'>
        <div style={{minWidth: "40px"}}>
            {year !== 1 ? <IconButton onClick={minusYear}>
                <ArrowBackIosNewIcon/>
            </IconButton> : <></>}
        </div>
        <Typography>Year {year}: {yearAvgs[year - 1] ? yearAvgs[year - 1] : 0}</Typography>
        <div style={{minWidth: "40px"}}>
            <IconButton onClick={plusYear}>
                <ArrowForwardIosIcon/>
            </IconButton>
        </div>
    </div>
  )
}

export default YearSlider