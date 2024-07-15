import { Box, Button, Paper, TextField } from '@mui/material'
import React from 'react'

function DegreeChange({ degree, t, handleChange, handleChangeSubmit }) {
  return (
    <Box className='box-container' component={Paper} >
        <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleChangeSubmit}>
          <TextField fullWidth id="name" value={degree.name} label={t('name')} name='name' required variant="outlined" onChange={handleChange} />
          <TextField fullWidth id="school" value={degree.school} label={t('school')} name='school' required variant="outlined" onChange={handleChange} />
            <Button aria-label="save" id='btn-primary' variant="contained" color="primary" type="submit" >{t("save")}</Button>
        </form>
      </Box>
  )
}

export default DegreeChange