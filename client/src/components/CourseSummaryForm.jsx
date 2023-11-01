import { Box, Divider, TextField } from '@mui/material';
import React from 'react'
import { calculateCourse } from '../utils/generalFunctions';
import { CircularProgressbar } from 'react-circular-progressbar';

function CourseSummaryForm({form, changeForm}) {
  return (
    <Box className='space' sx={{width: "100%"}}>
        <div className='row'>
            <TextField
            label="Name"
            name="name"
            value={form.name}
            size="small"
            onChange={changeForm}
            onClick={(e) => {e.stopPropagation();}}
            />
        </div>
        <div className='row'>
            <TextField
            sx={{width: "5rem"}}
            label="Points"
            name="points"
            type='number'
            value={form.points}
            onChange={changeForm}
            size="small"
            onClick={(e) => {e.stopPropagation();}}
            /> Points
            <Divider orientation='vertical' sx={{height: "70%"}}/>
            <TextField
            sx={{width: "5rem"}}
            label="Grade"
            name="grade"
            type='number'
            onChange={changeForm}
            onClick={(e) => {e.stopPropagation();}}
            disabled={form.assignments.length !== 0}
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