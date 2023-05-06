import { MenuItem } from '@mui/material'
import React, { useCallback } from 'react'

import {
  useIsRefreshingSubscription,
  useReinitCarsMutation,
} from '../../../graphql'

type Props = {
  onClick: () => void
}

export const ReinitForceButton = ({ onClick }: Props) => {
  const { data } = useIsRefreshingSubscription()
  const [reinitCars] = useReinitCarsMutation({
    variables: {
      force: true,
    },
  })

  const onClickWrapper = useCallback(() => {
    reinitCars()
    onClick()
  }, [reinitCars, onClick])

  return (
    <MenuItem disabled={!!data?.isRefreshing} onClick={onClickWrapper}>
      Reinit force
    </MenuItem>
  )
}
