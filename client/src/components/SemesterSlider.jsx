import { IconButton, Typography } from '@mui/material';
import React from 'react';
import ArrowIcon from './ArrowIcon.jsx';
import { useTranslation } from "react-i18next";

function SemesterSlider({semester, minusSemester, plusSemester, avg}) {

  const { t }= useTranslation('translation', { keyPrefix: 'SemesterSlider' });

  return (
    <div className='avgRow space'>
        <div style={{minWidth: "40px"}}>
            {semester !== 1 ? <IconButton onClick={minusSemester}>
                <ArrowIcon direction={"backward"}/>
            </IconButton> : <></>}
        </div>
        <Typography>{semester !== 4 ? `${t("semester")} ${semester}: ${avg}` : `${t("yearlyCourses")} : ${avg}`}</Typography>
        <div style={{minWidth: "40px"}}>
        {semester !== 4 ? <IconButton onClick={plusSemester}>
                <ArrowIcon direction={"forward"}/>
            </IconButton> : <></>}
        </div>
    </div>
  )
}

export default SemesterSlider;