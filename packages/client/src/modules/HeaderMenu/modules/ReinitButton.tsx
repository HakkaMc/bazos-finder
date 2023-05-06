import { ListItemButton } from '@mui/material'
import React, { useCallback } from 'react'

import {
  useIsRefreshingSubscription,
  useReinitCarsMutation,
} from '../../../graphql'

type Props = {
  onClick: () => void
}

export const ReinitButton = ({ onClick }: Props) => {
  const { data } = useIsRefreshingSubscription()
  const [reinitCars] = useReinitCarsMutation({
    variables: {
      force: false,
    },
  })

  const onClickWrapper = useCallback(() => {
    reinitCars()
    onClick()
  }, [reinitCars, onClick])

  return (
    <ListItemButton disabled={!!data?.isRefreshing} onClick={onClickWrapper}>
      Reinit
    </ListItemButton>
  )
}
