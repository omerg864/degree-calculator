import { Box, Divider, IconButton, TextField, Typography } from '@mui/material';
import React from 'react'
import { calculateCourse } from '../utils/generalFunctions';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function CourseSummaryForm({form, changeForm, simulation, disableGrade, index}) {
  
  const { t }= useTranslation('translation', { keyPrefix: 'CourseSummary' });

  return (
    <Box className='space' sx={{width: "100%"}}>
        <div className='row'>
            {!simulation ? <TextField
            label={t("name")}
            name="name"
            value={form.name}
            size="small"
            onChange={changeForm}
            onClick={(e) => {e.stopPropagation();}}
            /> : <Typography>{form.name}</Typography>}
        </div>
        <div className='row'>
        {!simulation ? <TextField
            sx={{width: "5rem"}}
            label={t("credits")}
            name="points"
            type='number'
            inputProps={{ min: 0.1 }}
            disabled={simulation}
            value={form.points}
            onChange={changeForm}
            size="small"
            onClick={(e) => {e.stopPropagation();}}
            /> : <Typography>{form.points} {t('credits')}</Typography>}
            <Divider orientation='vertical' sx={{height: "70%"}}/>
            {disableGrade !== undefined ? !disableGrade  && simulation ? <IconButton onClick={(e) => changeForm(e, index, "minus")}>
                <RemoveCircleOutlineIcon sx={{color: "red"}} />
            </IconButton> : null : !form.assignments.length !== 0  && simulation ? <IconButton onClick={(e) => changeForm(e, index,"minus")}>
                <RemoveCircleOutlineIcon sx={{color: "red"}} />
            </IconButton> : null}
            <TextField
            sx={{width: "5rem"}}
            label={t("grade")}
            name="grade"
            type='number'
            inputProps={{ min: 0, max: 100 }}
            onChange={(e) => changeForm(e, index)}
            onClick={(e) => {e.stopPropagation();}}
            disabled={disableGrade !== undefined ? disableGrade : form.assignments.length !== 0}
            value={form.grade ? form.grade : calculateCourse(form.assignments)}
            size="small"
            />
            {disableGrade !== undefined ? !disableGrade && simulation ?<IconButton onClick={(e) => changeForm(e, index,"plus")}>
                <AddCircleOutlineIcon sx={{color: "green"}} />
            </IconButton> : null : !form.assignments.length !== 0  && simulation ?<IconButton onClick={(e) => changeForm(e, index,"plus")}>
                <AddCircleOutlineIcon sx={{color: "green"}} />
            </IconButton> : null}
        <div style={{width: "1.5rem", height: "1.9rem"}}>
            <CircularProgressbar value={form.grade ? form.grade : calculateCourse(form.assignments)}/>
        </div>
        </div>
    </Box>
  )
}

export default CourseSummaryForm