import { IconButton, Typography } from '@mui/material';
import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function SemesterSlider({semester, minusSemester, plusSemester, avg}) {
  return (
    <div className='avgRow space'>
        <div style={{minWidth: "40px"}}>
            {semester !== 1 ? <IconButton onClick={minusSemester}>
                <ArrowBackIosNewIcon/>
            </IconButton> : <></>}
        </div>
        <Typography>{semester !== 4 ? `Semester ${semester}: ${avg}` : `Yearly Courses : ${avg}`}</Typography>
        <div style={{minWidth: "40px"}}>
        {semester !== 4 ? <IconButton onClick={plusSemester}>
                <ArrowForwardIosIcon/>
            </IconButton> : <></>}
        </div>
    </div>
  )
}

export default SemesterSlider;