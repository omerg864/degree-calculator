import { Box, Divider, IconButton, TextField } from '@mui/material'
import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useTranslation } from "react-i18next";

function AssignmentForm({assignment, changeAssignments, deleteAssignment, index, simulation, indexCourse}) {

    const { t }= useTranslation('translation', { keyPrefix: 'Assignment' });

  return (
    <>
        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
            <div className='row'>
                <IconButton onClick={(e) => deleteAssignment(e, index)}>
                    <DeleteForeverIcon sx={{color: "red"}} />
                </IconButton>
            <TextField
                label={t("name")}
                name='name'
                value={assignment.name}
                size="small"
                disabled={simulation}
                onChange={(e) => changeAssignments(e, index)}
                />
            </div>
            <div className='row'>
                <TextField
                sx={{width: "5rem"}}
                    label={t("weight")}
                    name='percent'
                    value={assignment.percent}
                    size="small"
                    type='number'
                    disabled={simulation}
                    onChange={(e) => changeAssignments(e, index)}
                />%
                <Divider orientation='vertical' sx={{height: "70%"}}/>
                <TextField
                sx={{width: "5rem"}}
                    label={t("grade")}
                    value={assignment.grade ? assignment.grade : 0}
                    size="small"
                    name='grade'
                    type='number'
                    onChange={(e) => changeAssignments(e, index, indexCourse)}
                />
            <div style={{width: "1.5rem", height: "1.9rem"}}>
                <CircularProgressbar value={assignment.grade ? assignment.grade : 0}/>
            </div>
            </div>
        </Box>
        <Divider orientation='horizontal'/>
    </>
  )
}

export default AssignmentForm