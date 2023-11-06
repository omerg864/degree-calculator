import { Box, Checkbox, Divider, Typography } from '@mui/material';
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';

function AssignmentView({assignment, select, toggleCourseAssignment, course, checked, disabled}) {
  return (
    <>
    <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
        <div className='row'>
        {select ? <Checkbox checked={checked} disabled={disabled} sx={{padding: 0}} onClick={(e) => toggleCourseAssignment(e, assignment._id, course)} color="success" /> : null}
            <Typography>
                {assignment.name}
            </Typography>
        </div>
        <div className='row'>
            <Typography>
                {assignment.percent} %
            </Typography>
            <Divider orientation='vertical' sx={{height: "70%"}}/>
            <Typography sx={{textAlign: "center", minWidth: "2rem"}}>
                {assignment.grade ? assignment.grade : 0}
            </Typography>
        <div style={{width: "1.5rem", height: "1.9rem"}}>
            <CircularProgressbar value={assignment.grade ? assignment.grade : 0}/>
        </div>
        </div>
    </Box>
    <Divider orientation='horizontal'/>
    </>
  )
}

export default AssignmentView;