import { FormGroup, TextField, TextFieldProps, Tooltip } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

import { handleEnter } from './utils'

type Props = {
  form: UseFormReturn<any>
  isDisabled?: boolean
  label?: string
  name: string
  onEnter?: () => void
  sx?: TextFieldProps['sx']
}

export const Input = ({
  form,
  label = '',
  name,
  isDisabled = false,
  sx = {},
  onEnter,
}: Props) => {
  const error = form.formState.errors[name]

  const errorMessage = error?.message?.toString() || ''

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => {
        const handleKeyUp: TextFieldProps['onKeyUp'] = (event: any) => {
          handleEnter(event, onEnter)
        }

        return (
          <FormGroup>
            <Tooltip title={errorMessage}>
              <TextField
                disabled={isDisabled}
                error={!!error}
                label={label}
                sx={sx}
                value={field.value}
                onChange={field.onChange}
                onKeyUp={handleKeyUp}
              />
            </Tooltip>
          </FormGroup>
        )
      }}
    />
  )
}
