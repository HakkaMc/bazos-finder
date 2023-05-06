import GradeIcon from '@mui/icons-material/Grade'
import PreviewIcon from '@mui/icons-material/Preview'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Chip, IconButton, Grid } from '@mui/material'
import { Typography } from '@mui/material'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { EditableText } from '../../forms'
import { GetCarsQuery, useUpdateFieldMutation } from '../../graphql'
import {
  FormattedCurrency,
  FormattedDate,
  FormattedNumber,
} from '../../locale/locale'
import { CarGallery } from '../CarGallery/CarGallery'
import { Detail } from '../Detail/Detail'
import styles from './styles.module.scss'
import { Tags } from "../Tags/Tags";
import { grey } from "@mui/material/colors";

type Car = NonNullable<GetCarsQuery['getCars']>[number]

type Props = {
  car?: Car
  refetch: () => any
  narrowMode: boolean
}

export const CarTableItem = ({ car, refetch, narrowMode }: Props) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isDetail, setIsDetail] = useState(false)

  const { ref, inView, entry } = useInView()

  const [updateField] = useUpdateFieldMutation({
    refetchQueries: ['getCars'],
  })

  const hideItem = useCallback(() => {
    setIsVisible(false)

    if (car?.id) {
      // hideCar({ variables: { carId: car.id } })
      updateField({
        variables: {
          carId: car.id,
          field: 'hidden',
          value: JSON.stringify(true),
        },
      })
    }
  }, [updateField, refetch, setIsVisible])

  const toggleFavourite = useCallback(() => {
    if (car?.id) {
      updateField({
        variables: {
          carId: car.id,
          field: 'favourite',
          value: JSON.stringify(!car.favourite),
        },
      })
    }
  }, [updateField, car?.id, car?.favourite])

  const showDetail = useCallback(() => {
    setIsDetail(true)
  }, [setIsDetail])

  const hideDetail = useCallback(() => {
    setIsDetail(false)
  }, [setIsDetail])

  if (!isVisible) {
    return <Fragment key={car?.id}></Fragment>
  }

  return (
    <Fragment key={car?.id}>
      <Box display="flex" alignItems="center" pl={2} color={grey[700]}>
        <FormattedDate value={car?.publishedAt} />
      </Box>
      <Box ref={ref} display="flex" alignItems="center">
        <a href={car?.link} rel="noreferrer" target="_blank">
          {car?.title}
        </a>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <EditableText
          carId={car?.id}
          name="year"
          type="number"
          value={car?.year}
        >
          {car?.year || 'year N/A'}
        </EditableText>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end" fontWeight="bold">
        <EditableText
          carId={car?.id}
          name="tacho"
          type="number"
          value={car?.tacho}
        >
          {car?.tacho ? (
            <FormattedNumber style="unit" unit="kilometer" value={car?.tacho} />
          ) : (
            'tacho N/A'
          )}
        </EditableText>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <EditableText
          carId={car?.id}
          name="engine"
          type="string"
          value={car?.engine}
        >
          {car?.engine || 'engine N/A'}
        </EditableText>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <EditableText
          carId={car?.id}
          name="power"
          type="string"
          value={car?.power}
        >
          {car?.power ? `${car?.power} kw` : 'power N/A'}
        </EditableText>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end" fontWeight="bold">
        <EditableText
          carId={car?.id}
          name="price"
          type="number"
          value={car?.price}
        >
          <FormattedCurrency value={car?.price} />
        </EditableText>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center">
        <a href={`https://maps.google.com/?q=${car?.location}`} target="_blank" rel="noreferrer">{car?.location}</a>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={hideItem}>
          <VisibilityOffIcon />
        </IconButton>
        <IconButton onClick={toggleFavourite}>
          {car?.favourite ? <GradeIcon /> : <StarOutlineIcon />}
        </IconButton>
        <IconButton onClick={showDetail}>
          <PreviewIcon />
        </IconButton>
      </Box>
      {/*<Box>*/}
        <Grid container wrap="nowrap">
          <Grid item xs={12} sm={8} md={6} mr={2} className={styles.detail}>
            <Box>
              <Tags tags={car?.tags || []}/>
                <Typography
                  dangerouslySetInnerHTML={{ __html: car?.description || '' }}
                  mb={1}
                  p={1}
                  variant="body2"
                />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={6}>
            <CarGallery
                canRenderGallery
                carId={car?.id || ''}
                previewBase64={car?.imgBase64}
                onClick={showDetail}
                narrowMode={narrowMode}
            />
          </Grid>
        </Grid>
      {/*</Box>*/}

      {/*<Box className={styles.detail}>*/}
      {/*  <Tags tags={car?.tags || []}/>*/}
      {/*  <Typography*/}
      {/*    dangerouslySetInnerHTML={{ __html: car?.description || '' }}*/}
      {/*    mb={1}*/}
      {/*    p={1}*/}
      {/*    variant="body2"*/}
      {/*  />*/}
      {/*</Box>*/}
      {/*<div className={styles.preview}>*/}
      {/*  <CarGallery*/}
      {/*    canRenderGallery={inView}*/}
      {/*    carId={car?.id || ''}*/}
      {/*    previewBase64={car?.imgBase64}*/}
      {/*    onClick={showDetail}*/}
      {/*  />*/}
      {/*</div>*/}
      {isDetail && <Detail carId={car?.id || ''} onClose={hideDetail} />}
    </Fragment>
  )
}
