import { IconButton, Typography } from '@mui/material'
import React from 'react';
import { useTranslation } from "react-i18next";
import ArrowIcon from './ArrowIcon.jsx';

function YearSlider({year, yearAvgs, plusYear, minusYear}) {

    const { t }= useTranslation('translation', { keyPrefix: 'YearSlider' });

  return (
    <div className='avgRow space'>
        <div style={{minWidth: "40px"}}>
            {year !== 1 ? <IconButton onClick={minusYear}>
                <ArrowIcon direction={"backward"}/>
            </IconButton> : <></>}
        </div>
        <Typography>{t("year")} {year}: {yearAvgs[year - 1] ? yearAvgs[year - 1] : 0}</Typography>
        <div style={{minWidth: "40px"}}>
            <IconButton onClick={plusYear}>
                <ArrowIcon direction={"forward"}/>
            </IconButton>
        </div>
    </div>
  )
}

export default YearSlider