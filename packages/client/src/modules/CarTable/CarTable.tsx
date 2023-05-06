import {
  CarFilterAndOrderType,
  CarSortByEnum,
  carSortByList,
} from '@bf2/shared'
import { yupResolver } from '@hookform/resolvers/yup'
import ReplayIcon from '@mui/icons-material/Replay'
import { Box, Grid, IconButton } from "@mui/material";
import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import {GetCarsQuery, useGetCarsQuery} from "../../graphql";
import { CarTableItem } from '../CarTableItem/CarTableItem'
import { Filter } from '../Filter/Filter'
import styles from './styles.module.scss'
import { LoadMoreButton } from "./modules/LoadMoreButton";
import cx from 'classnames'
import {Checkbox} from "../../forms";

const validationSchema: yup.SchemaOf<CarFilterAndOrderType> = yup
  .object()
  .shape({
    engine: yup.string(),
    favourite: yup.boolean().required(),
    narrowMode: yup.boolean().required(),
    powerFrom: yup.number().required(),
    powerTo: yup.number().required(),
    priceFrom: yup.number().required(),
    priceTo: yup.number().required(),
    sortBy: yup
      .mixed()
      .oneOf(carSortByList.map((item) => item.value))
      .required(),
    yearFrom: yup.number().required(),
    yearTo: yup.number().required(),
    tachoTo: yup.number().required(),
    textFilter: yup.string()
  })

// const numberCompare = (numberA: number, numberB: number) => {
//   if (Number.isNaN(numberA) && Number.isNaN(numberB)) {
//     return 0
//   } else if (!Number.isNaN(numberA) && Number.isNaN(numberB)) {
//     return -1
//   } else if (Number.isNaN(numberA) && !Number.isNaN(numberB)) {
//     return 1
//   } else if (numberA > numberB) {
//     return -1
//   } else if (numberA < numberB) {
//     return 1
//   }
//
//   return 0
// }

const FILTER_AND_ORDER_STORAGE_NAME = 'filterAndOrder'

const getFilterAndOrderFromStorage = (): CarFilterAndOrderType => {
  const ret: CarFilterAndOrderType = {
    engine: '',
    favourite: false,
    powerFrom: 0,
    powerTo: 1_000,
    priceFrom: 0,
    priceTo: 300_000,
    sortBy: CarSortByEnum.PublishedAt,
    yearFrom: 0,
    yearTo: new Date().getFullYear(),
    narrowMode: true,
    tachoTo: 500_000
  }

  const rawData = localStorage.getItem(FILTER_AND_ORDER_STORAGE_NAME)

  if (rawData) {
    const data = JSON.parse(rawData) as CarFilterAndOrderType

    if (data) {
      if ('engine' in data) {
        ret.engine = data.engine
      }

      if ('favourite' in data) {
        ret.favourite = !!data.favourite
      }

      if ('priceFrom' in data) {
        ret.priceFrom = data.priceFrom
      }

      if ('priceTo' in data) {
        ret.priceTo = data.priceTo
      }

      if ('powerFrom' in data) {
        ret.powerFrom = data.powerFrom
      }

      if ('powerTo' in data) {
        ret.powerTo = data.powerTo
      }

      if ('yearFrom' in data) {
        ret.yearFrom = data.yearFrom
      }

      if ('yearTo' in data && data.yearTo) {
        ret.yearTo = data.yearTo
      }

      if ('tachoTo' in data && data.tachoTo) {
        ret.tachoTo = data.tachoTo
      }

      if ('sortBy' in data) {
        ret.sortBy = data.sortBy
      }

      if ('narrowMode' in data) {
        ret.narrowMode = !!data.narrowMode
      }
    }
  }

  return ret
}

const saveFilterAndOrderToStorage = (values: CarFilterAndOrderType) => {
  localStorage.setItem(FILTER_AND_ORDER_STORAGE_NAME, JSON.stringify(values))
}

export const CarTable = () => {
  const [listLimit, setListLimit] = useState(30)
  const [filterAndOrder, setFilterAndOrder] = useState<CarFilterAndOrderType>(
    () => getFilterAndOrderFromStorage()  )
  const [textFilter, setTextFilter] = useState('')

  const { loading, data, refetch } = useGetCarsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: (() => {
        const {narrowMode, ...filter} = filterAndOrder
        return filter
      })()
    }
  })

  const form = useForm<CarFilterAndOrderType>({
    defaultValues: filterAndOrder,
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  })

  const updateFilterAndOrder = useCallback(() => {
    validationSchema.validate(form.getValues()).then(response=>{
      setFilterAndOrder(response)
      saveFilterAndOrderToStorage(response)
    })
  }, [form.getValues, setFilterAndOrder, saveFilterAndOrderToStorage])


  const onSubmit = form.handleSubmit((values) => {
    // setFilterAndOrder(values)
    // saveFilterAndOrderToStorage(values)
    setTextFilter(values.textFilter || '')
    updateFilterAndOrder()
    setListLimit(30)
  })

  const refetchWrapper = useCallback(() => {
    const {narrowMode, ...filter} = filterAndOrder
    refetch({filter})
  }, [refetch, filterAndOrder])


  const {cars, carsCount} = useMemo(()=>{
    const ret: {carsCount: number, cars: Array<NonNullable<GetCarsQuery['getCars']>>[number]} = {
      cars: [],
      carsCount: 0
    }

    if(data?.getCars){
      let filteredCars = data?.getCars || []

      if(textFilter){
        filteredCars = data?.getCars.filter(carObj => `${carObj?.title}${carObj?.description}`.toLowerCase().includes(textFilter.toLowerCase()))
      }

      ret.cars = filteredCars.slice(0, listLimit) || []
      ret.carsCount = filteredCars.length
    }

    return ret
  }, [listLimit, data?.getCars, textFilter])

  const loadMore = useCallback(()=>{
    if(listLimit < carsCount){
      setListLimit(listLimit+30)
    }
  }, [listLimit, setListLimit, carsCount])

  return (
    <Grid
      container
      direction="row"
      flexWrap="nowrap"
      sx={{ maxHeight: '100%', overflow: 'auto' }}
    >
      <Grid
        item
        pb={2}
        pl={2}
        pt={2}
        sx={{ maxWidth: '150px !important', overflow: 'auto' }}
        xs="auto"
      >
        <Filter
          form={form}
          handleSubmit={onSubmit}
          sortByItems={carSortByList}
        />
      </Grid>
      <Grid item p={2} sx={{ overflow: 'auto', flexGrow: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Box component="span" pr={1}>
              <IconButton disabled={loading} onClick={refetchWrapper}>
                <ReplayIcon />
              </IconButton>
            </Box>
          <Box component="span">
            Results: {loading ? 'Loading...' : `${cars?.length} / ${carsCount}`}
          </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <Box justifySelf="flex-end">
              <Checkbox form={form} name="narrowMode" label="Narrow mode" onChange={updateFilterAndOrder}/>
            </Box>
          </Box>
        </Box>
        <Box className={cx(styles.container, {[styles.narrowMode]: filterAndOrder.narrowMode})} pt={2}>
          {cars.map((car) => {
            if (car) {
              return <CarTableItem key={car?.id} car={car} refetch={refetch} narrowMode={filterAndOrder.narrowMode} />
            }
          })}
        </Box>
        <Box>
          {carsCount>30 && (cars?.length || 0) < carsCount && <LoadMoreButton loadMore={loadMore}/>}
        </Box>
      </Grid>
    </Grid>
  )
}
