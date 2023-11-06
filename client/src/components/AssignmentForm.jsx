import { Box, Divider, IconButton, TextField, Typography } from '@mui/material'
import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function AssignmentForm({assignment, changeAssignments, deleteAssignment, index, simulation, indexCourse}) {

    const { t }= useTranslation('translation', { keyPrefix: 'Assignment' });

  return (
    <>
        <Box className='space' sx={{width: "100%", padding: "0.5rem 1rem", boxSizing: "border-box"}}>
            <div className='row'>
                {!simulation ? <IconButton onClick={(e) => deleteAssignment(e, index)}>
                    <DeleteForeverIcon sx={{color: "red"}} />
                </IconButton> : null}
            {!simulation ? <TextField
                label={t("name")}
                name='name'
                value={assignment.name}
                size="small"
                disabled={simulation}
                onChange={(e) => changeAssignments(e, index)}
                /> : <Typography>{assignment.name}</Typography>}
            </div>
            <div className='row'>
            {!simulation ? <TextField
                sx={{width: "5rem"}}
                    label={t("weight")}
                    name='percent'
                    inputProps={{ min: 0, max: 100 }}
                    value={assignment.percent}
                    size="small"
                    type='number'
                    disabled={simulation}
                    onChange={(e) => changeAssignments(e, index)}
                /> : <Typography>{assignment.percent} %</Typography>}
                {!simulation ? '%' : null}
                <Divider orientation='vertical' sx={{height: "70%"}}/>
                {simulation ? <IconButton onClick={(e) => changeAssignments(e, index, indexCourse, "minus")}>
                    <RemoveCircleOutlineIcon sx={{color: "red"}} />
                </IconButton> : null}
                <TextField
                sx={{width: "5rem"}}
                    label={t("grade")}
                    value={assignment.grade ? assignment.grade : 0}
                    size="small"
                    inputProps={{ min: 0, max: 100 }}
                    name='grade'
                    type='number'
                    onChange={(e) => changeAssignments(e, index, indexCourse)}
                />
                {simulation ? <IconButton onClick={(e) => changeAssignments(e, index, indexCourse, "plus")}>
                    <AddCircleOutlineIcon sx={{color: "green"}} />
                </IconButton> : null}
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