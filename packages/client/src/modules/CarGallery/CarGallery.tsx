import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import cx from 'classnames'

import { useGetCarPreviewGalleryLazyQuery } from '../../graphql'
import styles from './styles.module.scss'

type Props = {
  canRenderGallery?: boolean
  carId: string
  onClick: () => void
  previewBase64?: string
  narrowMode: boolean
}

export const CarGallery = ({
  carId,
  previewBase64,
  canRenderGallery,
  onClick,
                             narrowMode
}: Props) => {
  const [fetchGallery, { loading, data }] = useGetCarPreviewGalleryLazyQuery({
    fetchPolicy: 'cache-first',
    variables: {
      carId,
    },
  })

  useEffect(() => {
    if (canRenderGallery) {
      fetchGallery()
    }
  }, [canRenderGallery, fetchGallery])

  if (
    loading ||
    !data?.getCarGallery ||
    data?.getCarGallery?.length === 0 ||
    !canRenderGallery
  ) {
    return (
      <>
        {!!previewBase64 && (
          <img src={`data:image/jpeg;base64,${previewBase64}`} />
        )}
      </>
    )
  }

  if (canRenderGallery) {
    return (
      <Box className={cx(styles.gallery, {[styles.narrowMode]: narrowMode})} onClick={onClick}>
        {data?.getCarGallery?.map((gallery) => {
          let src = gallery?.previewUrl || ''
          if (gallery?.previewBase64) {
            src = `data:image/jpeg;base64,${gallery?.previewBase64}`
          }

          return (
            <Box key={gallery?.previewUrl}>
              <img key={gallery?.previewUrl} src={src} />
            </Box>
          )
        })}
      </Box>
    )
  }

  return <></>
}
