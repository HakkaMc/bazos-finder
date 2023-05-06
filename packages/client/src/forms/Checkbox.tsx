import {
  Checkbox as CheckboxComponent,
  CheckboxProps,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

type Props = {
  form: UseFormReturn<any>
  isDisabled?: boolean
  label?: string
  name: string
  onChange?: () => void
}

export const Checkbox = ({
  form,
  label = '',
  name,
  isDisabled,
  onChange,
}: Props) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field }) => {
      const handleOnChange: CheckboxProps['onChange'] = (event) => {
        field.onChange(event)

        onChange?.()
      }

      return (
        <FormGroup>
          <FormControlLabel
            control={
              <CheckboxComponent
                checked={field.value}
                value={field.value}
                onChange={handleOnChange}
              />
            }
            disabled={isDisabled}
            label={label}
          />
        </FormGroup>
      )
    }}
  />
)
