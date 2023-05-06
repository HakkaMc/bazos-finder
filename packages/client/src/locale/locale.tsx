import React, { Fragment } from 'react'
import {
  FormattedDate as FormattedDateComponent,
  FormattedNumber as FormattedNumberComponent,
} from 'react-intl'

type FormattedNumberProps = Omit<
  Parameters<typeof FormattedNumberComponent>[0],
  'value'
> & {
  value?: number | bigint | string | null
}

type FormattedDateProps = Omit<
  Parameters<typeof FormattedDateComponent>[0],
  'value'
> & {
  value?: number | bigint | string | null
}

export const FormattedNumber = (props: FormattedNumberProps) => {
  const number = parseFloat(`${props.value}`)

  if (Number.isNaN(number)) {
    return <Fragment>N/A</Fragment>
  }

  const enhancedProps: any = { ...props, value: number }

  return <FormattedNumberComponent {...enhancedProps} />
}

export const FormattedCurrency = (props: FormattedNumberProps) => (
  <FormattedNumber
    {...props}
    currency="CZK"
    maximumFractionDigits={0}
    style="currency"
  />
)

export const FormattedDate = (props: FormattedDateProps) => {
  const value = props.value as any
  let number = parseFloat(`${props.value}`)

  if (value instanceof Date) {
    number = value.getTime()
  }

  if (Number.isNaN(number)) {
    return <Fragment>N/A</Fragment>
  }

  const enhancedProps: any = { ...props, value: number }

  return <FormattedDateComponent {...enhancedProps} />
}
