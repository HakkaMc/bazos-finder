import { Grid } from '@mui/material'
import React  from "react";

import { CarTable, Header } from '../'

export const App = () => {
  return (
    <Grid
      container
      direction="column"
      flexWrap="nowrap"
      sx={{ height: '100%', maxHeight: '100%' }}
    >
      <Grid item xs="auto">
        <Header />
      </Grid>
      <Grid item sx={{ overflow: 'auto' }}>
        <CarTable />
      </Grid>
    </Grid>
  )
}
