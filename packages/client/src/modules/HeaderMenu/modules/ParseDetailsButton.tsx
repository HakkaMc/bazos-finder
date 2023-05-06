import { MenuItem } from '@mui/material'
import React, { useCallback } from 'react'

import {
  useIsRefreshingSubscription,
  useParseCarDetailsMutation,
  useReinitCarsMutation,
} from '../../../graphql'

type Props = {
  onClick: () => void
}

export const ParseDetailsButton = ({ onClick }: Props) => {
  const { data } = useIsRefreshingSubscription()

  const [parseDetails] = useParseCarDetailsMutation()

  const onClickWrapper = useCallback(() => {
    parseDetails()
    onClick()
  }, [parseDetails, onClick])

  return (
    <MenuItem disabled={!!data?.isRefreshing} onClick={onClickWrapper}>
      Parse Details
    </MenuItem>
  )
}
