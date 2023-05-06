import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import {
  Avatar,
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  Popover,
} from '@mui/material'
import React, { useCallback, useState } from 'react'

import { ParseDetailsButton } from './modules/ParseDetailsButton'
import { ReinitButton } from './modules/ReinitButton'
import { ReinitForceButton } from './modules/ReinitForceButton'

export const HeaderMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | undefined>(
    undefined
  )

  const handleMenuClick = useCallback(
    (event: any) => {
      if (anchorEl) {
        setAnchorEl(undefined)
      } else {
        setAnchorEl(event.currentTarget)
      }
    },
    [anchorEl, setAnchorEl]
  )

  const hideMenu = useCallback(() => {
    setAnchorEl(undefined)
  }, [setAnchorEl])

  return (
    <>
      <IconButton onClick={handleMenuClick}>
        <AccountCircleIcon fontSize="large" sx={{ color: 'white' }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={hideMenu}>
        <ParseDetailsButton onClick={hideMenu} />
        <ReinitButton onClick={hideMenu} />
        <ReinitForceButton onClick={hideMenu} />
      </Menu>
    </>
  )
}
