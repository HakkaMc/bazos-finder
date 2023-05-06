import {
  FormGroup,
  MenuItem,
  Select as SelectComponent,
  SelectProps,
} from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

type Props = {
  form: UseFormReturn<any>
  isDisabled?: boolean
  items: Array<{ label: string; value: number | string | undefined }>
  label?: string
  name: string
  onChange?: () => void
  sx?: SelectProps['sx']
}

export const Select = ({
  form,
  label = '',
  name,
  isDisabled = false,
  sx = {},
  onChange,
  items,
}: Props) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field }) => {
      const handleOnChange: SelectProps['onChange'] = (event) => {
        field.onChange(event)

        onChange?.()
      }

      return (
        <FormGroup>
          <SelectComponent
            disabled={isDisabled}
            label={label}
            sx={sx}
            value={field.value}
            onChange={handleOnChange}
          >
            {items.map((item) => (
              <MenuItem key={item.label} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </SelectComponent>
        </FormGroup>
      )
    }}
  />
)
