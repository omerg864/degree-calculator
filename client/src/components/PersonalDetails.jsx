import { Box, Button, Paper, TextField } from '@mui/material'
import React from 'react'

function PersonalDetails({user, handleChange, handleUserSubmit, t}) {
  return (
    <Box className='box-container' component={Paper} >
        <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleUserSubmit}>
          <TextField fullWidth id="name" value={user.name} label={t('name')} name='name' required variant="outlined" onChange={handleChange} />
          <TextField fullWidth id="email" value={user.email} label={t('email')} name='email' type="email" required variant="outlined" onChange={handleChange} />
            <Button aria-label="save" id='btn-primary' variant="contained" color="primary" type="submit" >{t("save")}</Button>
        </form>
      </Box>
  )
}

export default PersonalDetails