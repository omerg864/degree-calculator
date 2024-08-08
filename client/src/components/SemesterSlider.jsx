import { IconButton, Typography } from '@mui/material';
import React from 'react';
import ArrowIcon from './ArrowIcon.jsx';
import { useTranslation } from "react-i18next";
import NumberCounter from './NumberCounter.jsx';

function SemesterSlider({semester, minusSemester, plusSemester, avg}) {

  const { t }= useTranslation('translation', { keyPrefix: 'SemesterSlider' });

  return (
    <div className='avgRow space'>
        <div style={{minWidth: "40px"}}>
            {semester !== 1 && <IconButton onClick={minusSemester}>
                <ArrowIcon direction={"backward"}/>
            </IconButton>}
        </div>
        <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center', alignItems: 'center'}}>
          <Typography sx={{ paddingInlineEnd: '5px'}}>{semester !== 4 ? `${t("semester")} ${semester}:` : `${t("yearlyCourses")} :`}</Typography>
          <NumberCounter from={0} to={avg} />
        </div>
        <div style={{minWidth: "40px"}}>
          {semester !== 4 && <IconButton onClick={plusSemester}>
                  <ArrowIcon direction={"forward"}/>
              </IconButton>}
        </div>
    </div>
  )
}

export default SemesterSlider;