'use client'
import {Image} from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import { Box, Typography } from "@mui/material";
import { query } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
 }
  
  return(
    <Box>
      <Typography variant='h1'>Inventory Management</Typography>
      
    </Box>
  )
}