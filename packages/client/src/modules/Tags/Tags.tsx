import React from 'react'
import { Box, Chip } from "@mui/material";

type Props = {
  tags: Array<string>
}

export const Tags = ({tags}: Props) =>{
  return <Box display="flex" flexDirection="row" flexWrap="wrap">
    {tags?.map((tag) => (
      <Box key={tag} mb={1} mr={1}>
        <Chip label={tag} />
      </Box>
    ))}
  </Box>
}
