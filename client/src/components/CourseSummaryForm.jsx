import { Box, Divider, TextField } from '@mui/material';
import React from 'react'
import { calculateCourse } from '../utils/generalFunctions';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useTranslation } from "react-i18next";

function CourseSummaryForm({form, changeForm, simulation, disableGrade, index}) {
  
  const { t }= useTranslation('translation', { keyPrefix: 'CourseSummary' });

  return (
    <Box className='space' sx={{width: "100%"}}>
        <div className='row'>
            <TextField
            label={t("name")}
            name="name"
            disabled={simulation}
            value={form.name}
            size="small"
            onChange={changeForm}
            onClick={(e) => {e.stopPropagation();}}
            />
        </div>
        <div className='row'>
            <TextField
            sx={{width: "5rem"}}
            label={t("credits")}
            name="points"
            type='number'
            disabled={simulation}
            value={form.points}
            onChange={changeForm}
            size="small"
            onClick={(e) => {e.stopPropagation();}}
            /> Points
            <Divider orientation='vertical' sx={{height: "70%"}}/>
            <TextField
            sx={{width: "5rem"}}
            label={t("grade")}
            name="grade"
            type='number'
            onChange={(e) => changeForm(e, index)}
            onClick={(e) => {e.stopPropagation();}}
            disabled={disableGrade !== undefined ? disableGrade : form.assignments.length !== 0}
            value={form.grade ? form.grade : calculateCourse(form.assignments)}
            size="small"
            />
        <div style={{width: "1.5rem", height: "1.9rem"}}>
            <CircularProgressbar value={form.grade ? form.grade : calculateCourse(form.assignments)}/>
        </div>
        </div>
    </Box>
  )
}

export default CourseSummaryForm