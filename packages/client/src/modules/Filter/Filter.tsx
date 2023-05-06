import {
  Box,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

import { Checkbox, Input, Select } from '../../forms'

type Props = {
  form: UseFormReturn<any>
  handleSubmit: () => void
  sortByItems: Array<{ label: string; value: number | string | undefined }>
}

export const Filter = ({ form, handleSubmit, sortByItems }: Props) => {
  return (
    <>
      <Box>
        <Select
          form={form}
          items={sortByItems}
          name="sortBy"
          onChange={handleSubmit}
        />
      </Box>

      <Box>
        <Checkbox
          form={form}
          label={'Favourite'}
          name="favourite"
          onChange={handleSubmit}
        />
      </Box>

    <Box pt={2}>
        <Input
            form={form}
            label="Text filter"
            name="textFilter"
            onEnter={handleSubmit}
        />
    </Box>

      <Box pt={2}>
        <Input
          form={form}
          label="Price from"
          name="priceFrom"
          onEnter={handleSubmit}
        />
      </Box>

      <Box pt={2}>
        <Input
          form={form}
          label="Price to"
          name="priceTo"
          onEnter={handleSubmit}
        />
      </Box>

      <Box pt={2}>
        <Input
          form={form}
          label="Year from"
          name="yearFrom"
          onEnter={handleSubmit}
        />
      </Box>

      <Box pt={2}>
        <Input
          form={form}
          label="Year to"
          name="yearTo"
          onEnter={handleSubmit}
        />
      </Box>

      <Box pt={2}>
        <Input
          form={form}
          label="Tacho to"
          name="tachoTo"
          onEnter={handleSubmit}
        />
      </Box>

      <Box pt={2}>
        <Input
          form={form}
          label="Power from"
          name="powerFrom"
          onEnter={handleSubmit}
        />
      </Box>

      <Box pt={2}>
        <Input
          form={form}
          label="Power to"
          name="powerTo"
          onEnter={handleSubmit}
        />
      </Box>

      <Box pt={2}>
        <Input
          form={form}
          label="Engine"
          name="engine"
          onEnter={handleSubmit}
        />
      </Box>
    </>
  )
}
