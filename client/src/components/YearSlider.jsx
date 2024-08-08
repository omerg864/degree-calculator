import { IconButton, Typography } from '@mui/material'
import React from 'react';
import { useTranslation } from "react-i18next";
import ArrowIcon from './ArrowIcon.jsx';
import NumberCounter from './NumberCounter.jsx';

function YearSlider({year, yearAvgs, plusYear, minusYear}) {

    const { t }= useTranslation('translation', { keyPrefix: 'YearSlider' });

    const yearAvg = yearAvgs[year - 1];

  return (
    <div className='avgRow space'>
        <div style={{minWidth: "40px"}}>
            {year !== 1 ? <IconButton onClick={minusYear}>
                <ArrowIcon direction={"backward"}/>
            </IconButton> : <></>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <Typography sx={{ paddingInlineEnd: '5px'}}>{t("year")} {year}:</Typography>
            {yearAvg ? <NumberCounter from={0} to={yearAvg} /> : <span>0</span>}
        </div>
        <div style={{minWidth: "40px"}}>
            <IconButton onClick={plusYear}>
                <ArrowIcon direction={"forward"}/>
            </IconButton>
        </div>
    </div>
  )
}

export default YearSlider