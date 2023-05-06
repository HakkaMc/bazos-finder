import React, { useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useInView } from "react-intersection-observer";

type Props = {
  loadMore: ()=>void
}

export const LoadMoreButton = ({loadMore}: Props)=>{
  const { ref, inView, entry } = useInView()

  useEffect(()=>{
    let ref: any
    if(inView){
      ref = setTimeout(loadMore, 500)
    }

    return ()=>{
      clearTimeout(ref)
    }
  }, [inView, loadMore])

  return <Box ref={ref} display="flex" alignItems="center" justifyContent="center"><Button variant="contained" onClick={loadMore}>Load More</Button></Box>
}
