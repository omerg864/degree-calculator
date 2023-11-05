import { Box, Checkbox, Divider, Typography } from '@mui/material'
import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import { calculateCourse } from '../utils/generalFunctions';
import { useTranslation } from "react-i18next";

function CourseSummaryView({course, select, toggleCourse, checked, disabled}) {

    const { t }= useTranslation('translation', { keyPrefix: 'CourseSummary' });

  return (
    <Box className='space' sx={{width: "100%"}}>
        <div className='row' style={{flex: 1, justifyContent: "flex-start", textAlign: "start"}}>
        {select ? <Checkbox disabled={disabled} checked={checked} sx={{padding: 0}} onClick={(e) => toggleCourse(e, course)} color="success" /> : null}
            <Typography>
                {course.name}
            </Typography>
        </div>
        <div className='row'>
            <Typography>
                {course.points} {t("credits")}
            </Typography>
            <Divider orientation='vertical' sx={{height: "70%"}}/>
            <Typography sx={{textAlign: "center", minWidth: "2rem"}}>
                {course.grade ? course.grade : calculateCourse(course.assignments)}
            </Typography>
        <div style={{width: "1.5rem", height: "1.9rem"}}>
            <CircularProgressbar value={course.grade ? course.grade : calculateCourse(course.assignments)}/>
        </div>
        </div>
    </Box>
  )
}

export default CourseSummaryView