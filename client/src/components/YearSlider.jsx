import { IconButton, Typography } from '@mui/material'
import React from 'react';
import { useTranslation } from "react-i18next";
import ArrowIcon from './ArrowIcon.jsx';
import NumberCounter from './NumberCounter.jsx';
import { motion } from 'framer-motion';
import useWindowDimensions from '../hooks/useWindowDimensions.js';
import i18next from 'i18next';

function YearSlider({year, yearAvgs, plusYear, minusYear, plus }) {

    const { t }= useTranslation('translation', { keyPrefix: 'YearSlider' });
    const dimensions = useWindowDimensions();
    

    const yearAvg = yearAvgs[year - 1];

    // get rtl or ltr
    const direction = i18next.language === 'he' ? 'rtl' : 'ltr';

    let x;
    if (direction === 'rtl') {
      if (plus) {
        x = -dimensions.width - 200;
      } else {
        x = dimensions.width + 200
      }
    } else {
      if (plus) {
        x = dimensions.width + 200;
      } else {
        x = -dimensions.width - 200
      }
    }

  return (
    <div className='avgRow space'>
        <div style={{minWidth: "40px"}}>
            {year !== 1 ? <IconButton onClick={minusYear}>
                <ArrowIcon direction={"backward"}/>
            </IconButton> : <></>}
        </div>
        <motion.div key={year} initial={{ x }} animate={{ x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <Typography sx={{ paddingInlineEnd: '5px'}}>{t("year")} {year}:</Typography>
            {yearAvg ? <NumberCounter from={0} to={yearAvg} /> : <span>0</span>}
        </motion.div>
        <div style={{minWidth: "40px"}}>
            <IconButton onClick={plusYear}>
                <ArrowIcon direction={"forward"}/>
            </IconButton>
        </div>
    </div>
  )
}

export default YearSlider