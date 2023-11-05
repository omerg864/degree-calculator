import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import i18next from 'i18next';


function ArrowIcon({direction}) {
  return (
    <>
    {direction === 'forward' ? i18next.dir(i18next.language) === 'ltr' ? <ArrowForwardIosIcon/> : <ArrowBackIosNewIcon/> : i18next.dir(i18next.language) === 'ltr' ? <ArrowBackIosNewIcon/> : <ArrowForwardIosIcon/>}
    </>
  )
}

export default ArrowIcon