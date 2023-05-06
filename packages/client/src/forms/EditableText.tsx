import { Box, TextField as TextFieldComponent } from '@mui/material'
import { Buffer } from 'buffer'
import React, { useCallback, useRef, useState } from 'react'

import { useUpdateFieldMutation } from '../graphql'

type Props = {
  carId?: string
  children: any
  name: string
  type: 'string' | 'number' | 'boolean'
  value: undefined | null | string | number | bigint
}

export const EditableText = ({ children, value, name, type, carId }: Props) => {
  const [isEdit, setIsEdit] = useState(false)

  const [updateField] = useUpdateFieldMutation({
    refetchQueries: ['getCars'],
  })

  const onKeyUp = useCallback(
    (event: any) => {
      if (event.key === 'Enter') {
        const value = event.target.value
        // console.log(event.target.value)
        setIsEdit(false)

        if (carId) {
          let enhancedValue

          switch (type) {
            case 'number':
              enhancedValue = parseFloat(value) || -1
              break
            case 'string':
              enhancedValue = value || ''
              break
            case 'boolean':
              enhancedValue = !!value
              break
          }

          // const encodedValue = Buffer.from(value, 'utf8').toString('base64');
          const encodedValue = JSON.stringify(value)

          updateField({
            variables: { carId, field: name, value: encodedValue },
          })
        }
      } else if (event.key === 'Escape') {
        setIsEdit(false)
      }
    },
    [setIsEdit, type, updateField, name, carId]
  )

  const onBlur = useCallback(() => {
    setIsEdit(false)
  }, [setIsEdit])

  const gotoEditable = useCallback(() => {
    setIsEdit(true)
    // const inputRef = ref?.current as any
    // if(inputRef && inputRef?.focus) {
    //   inputRef.focus()
    // }
  }, [setIsEdit])

  if (isEdit) {
    return (
      <TextFieldComponent
        autoFocus
        defaultValue={`${value}`}
        variant="outlined"
        onBlur={onBlur}
        onKeyUp={onKeyUp}
      />
    )
  }

  return <Box onClick={gotoEditable}>{children}</Box>
}
