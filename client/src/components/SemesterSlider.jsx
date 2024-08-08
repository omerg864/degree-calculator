import { IconButton, Typography } from '@mui/material';
import React from 'react';
import ArrowIcon from './ArrowIcon.jsx';
import { useTranslation } from "react-i18next";
import NumberCounter from './NumberCounter.jsx';
import { motion } from 'framer-motion';
import useWindowDimensions from '../hooks/useWindowDimensions.js';
import i18next from 'i18next';

function SemesterSlider({semester, minusSemester, plusSemester, avg, plus }) {

  const { t }= useTranslation('translation', { keyPrefix: 'SemesterSlider' });

  const dimensions = useWindowDimensions();


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
            {semester !== 1 && <IconButton onClick={minusSemester}>
                <ArrowIcon direction={"backward"}/>
            </IconButton>}
        </div>
        <motion.div key={avg} initial={{ x }} animate={{ x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{display: 'flex', justifyContent: 'center', textAlign: 'center', alignItems: 'center'}}>
          <Typography sx={{ paddingInlineEnd: '5px'}}>{semester !== 4 ? `${t("semester")} ${semester}:` : `${t("yearlyCourses")} :`}</Typography>
          <NumberCounter from={0} to={avg} />
        </motion.div>
        <div style={{minWidth: "40px"}}>
          {semester !== 4 && <IconButton onClick={plusSemester}>
                  <ArrowIcon direction={"forward"}/>
              </IconButton>}
        </div>
    </div>
  )
}

export default SemesterSlider;