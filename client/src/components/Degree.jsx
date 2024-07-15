import { Box, Button, FormControl, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select } from '@mui/material'
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Degree({ user, degrees, handleDegreeSubmit, handleSelectChange, changeTab, t, dialog }) {
  return (
    <Box className='box-container' component={Paper} >
        <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleDegreeSubmit}>
        <FormControl fullWidth>
          <InputLabel id="degree-label">{t('currentDegree')}</InputLabel>
          <Select
            labelId="degree-label"
            id="degree"
            value={user.degree._id}
            label={t('currentDegree')}
            onChange={handleSelectChange}
          >
            {degrees.map(degree => <MenuItem value={degree._id}>{degree.name} ({degree.school})</MenuItem>)}
          </Select>
        </FormControl>
        <List>
        {degrees.map(degree => 
          <ListItem
          key={degree._id}
          secondaryAction={
            <IconButton edge="end" disabled={degrees.length === 1} aria-label="delete" onClick={() => dialog(degree)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <IconButton edge="start" aria-label="edit" onClick={() => changeTab('degreeChange', degree)}>
            <EditIcon />
          </IconButton>
          <ListItemText
            primary={`${degree.name} (${degree.school})`}
          />
        </ListItem>
        )}
        </List>
        <div className='space' style={{alignItems: 'center'}}>
          <Button aria-label="open new Course" sx={{width: "fit-content", margin: "0.7rem 0"}} onClick={() => changeTab('degreeChange')}>
            {t("newDegree")}
          </Button>
          <Button style={{height: 'fit-content'}} aria-label="save" id='btn-primary' variant="contained" color="primary" type="submit" >{t("save")}</Button>
          </div>
        </form>
      </Box>
  )
}

export default Degree