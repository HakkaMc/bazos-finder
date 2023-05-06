import { Box } from '@mui/material'
import React from 'react'

import { theme } from '../../styles'
import { HeaderMenu } from '../'

export const Header = () => {
  return (
    <Box
      alignItems="center"
      bgcolor={theme.palette.primary.light}
      display="flex"
      justifyContent="flex-end"
      p={2}
    >
      <HeaderMenu />
    </Box>
  )
}
