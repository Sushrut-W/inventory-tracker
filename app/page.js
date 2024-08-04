'use client'
import {Image} from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import { Box, Modal, Button, Stack, TextField, Typography } from "@mui/material";
// import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { query, collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchName, setSearchName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList);
  }

  const searchFor = async (item) => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const searchList = [];
    docs.forEach((doc) => {
      if ((doc.id).includes(item)){
        searchList.push({
          name: doc.id,
          ...doc.data(),
        })
      }
    })
    setInventory(searchList);
  }

  const addItem = async (item) => {
    const lowerCaseItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'inventory'), lowerCaseItem);
    const docSnap = await getDoc(docRef);
    
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  /* Use colors:
   *  Red   - #E61031
   *  Blue  - #005BAD
   *  White - #FFFFFF
   *  Grey  - #F2F2F2
  */
  return(
    <Box width='100vw' height='100vh' display='flex' flexDirection={'column'} justifyContent='center' alignItems='center' gap='2' bgcolor='#f2f2f2'>
      <Modal open={open} onClose={handleClose}>
        <Box
          position='absolute' top='50%' left='50%' width={400}
          bgcolor='#f2f2f2' border='2px solid black' boxShadow={24}
          p={4} display={"flex"} flexDirection={"column"} gap={3}
          sx={{
            transform:'translate(-50%, -50%)',
          }}
        >
          <Typography variant='h6' color='#E61031'>Add Item</Typography>
          <Stack width='100%' direction='row' spacing={2}>
            <TextField 
              variant='outlined'
              fullWidth
              value={itemName}
              onKeyDown={(k)=>{
                if (k.key === 'Enter'){
                  k.preventDefault();
                  addItem(itemName.toLowerCase());
                  setItemName('');
                  handleClose();
                }
              }}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />
            <Button
              variant='outlined'
              onClick={()=>{
                addItem(itemName.toLowerCase())
                setItemName('')
                handleClose()
              }} 
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      
      <Box width='800px' height='50px' bgcolor='#170B3B' alignItems='center' justifyContent='space-between' display='flex'>
        <Button variant='contained'
          onClick={()=>{
            handleOpen();
          }}
          >
          Add New Item
        </Button>
        <Stack direction='row' spacing={1}>
          <TextField width='200px' size='small' variant='outlined' placeholder='Item name' type='search'
            onChange={(e)=>{
              setSearchName((e.target.value).toLowerCase());
            }}
          />
          <Button variant='contained'
            onClick={()=>{
              searchFor(searchName.toLowerCase());
            }}
          >
            Search
          </Button>
          <Button variant='contained' sx={{m:2}} startIcon={<FormatListBulletedIcon/>}
            onClick={() => {
              updateInventory();
            }}
          > Show all
          </Button>
        </Stack>
      </Box>

      <Box border='1px solid red'>
        <Box width='800px' height='100px' bgcolor='#170B3B' alignItems={'center'} justifyContent={'center'} display={'flex'}>
          <Typography variant='h2' color='#9388A2'>
            Inventory Items
          </Typography>
        </Box>
      
        <Stack width='800px' height='300px' spacing={2} overflow='auto'>
          {
            inventory.map(({name, quantity})=>(
              <Box
              key={name}
              width='100%'
              minHeight='150px'
              display='flex'
              alignItems={'center'}
              justifyContent={'space-between'}
              bgcolor='#9388A2'
              padding={5}
              >
                <Typography variant='h3' color='purple' textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Stack direction='row' spacing={5}>
                <Typography variant='h3' color='black' textAlign={'center'}>
                  {quantity}
                </Typography>
                  <Button variant='contained' color='success'
                    onClick={()=>{
                      addItem(name)
                    }}
                  >
                    Add
                  </Button>
                  <Button variant='contained' color='error'
                    onClick={()=>{
                      removeItem(name)
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  )
}