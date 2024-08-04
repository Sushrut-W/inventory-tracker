'use client'
import {Image} from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import { Box, Modal, Button, Stack, TextField, Typography } from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { query, collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Roboto_Condensed } from "next/font/google";

const rob = Roboto_Condensed({
  subsets: ["latin"]
});

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
  
  let RED = '#E61031';
  let BLUE = '#005BAD';
  let WHITE = '#FFFFFF';
  let GREY = '#D9D9D9';
  let DGREY = '#8A8A8A';
  let totWidth = '80%'
  let totHeight = '80%'
  
  /* Use colors:
   *  Red   - #E61031
   *  Blue  - #005BAD
   *  White - #FFFFFF
   *  Grey  - #F2F2F2
   *  dGray - #8A8A8A
  */
  return(
    <Box width='100vw' height='90vh' display='flex' flexDirection={'column'} justifyContent='center'
    alignItems='center' gap={0} bgcolor={RED} className={rob.className}>
      <Modal open={open} onClose={handleClose}>
        <Box
          position='absolute' top='50%' left='50%' width={400}
          bgcolor='white' border='2px solid black' boxShadow={24}
          p={4} display={"flex"} flexDirection={"column"} gap={3}
          sx={{
            transform:'translate(-50%, -50%)',
          }}
        >
          <Typography variant='h6' color={RED} className={rob.className}>Add Item</Typography>
          <Stack width='100%' direction='row' spacing={2}>
            <TextField 
              variant='outlined'
              className={rob.className}
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
              className={rob.className}
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
      
      <Box width='80%' height='60px' bgcolor={GREY} alignItems='center'
      justifyContent='space-between' display='flex' border={2} borderBottom={0}
      padding={2}>
        <Button variant='contained'
        className={rob.className}
          onClick={()=>{
            handleOpen();
          }}
          >
          Add New Item
        </Button>
        <Stack direction='row' spacing={1}>
          <TextField width='100px' size='small' variant='outlined' placeholder='Item name' type='search'
            style={{width: 200}}
            onChange={(e)=>{
              setSearchName((e.target.value).toLowerCase());
            }}
          />
          <Button variant='contained' className={rob.className}
            onClick={()=>{
              searchFor(searchName.toLowerCase());
            }}
          >
            Search
          </Button>
          <Button variant='contained' className={rob.className} sx={{m:2}} startIcon={<FormatListBulletedIcon/>}
            onClick={() => {
              updateInventory();
            }}
          > Show all
          </Button>
        </Stack>
      </Box>

      <Box border='2px solid black' bgcolor={GREY} width={totWidth}>
        <Box width="100%" height='60px' bgcolor={DGREY} alignItems={'center'} justifyContent={'center'} display={'flex'}>
          <Typography variant='h3' className={rob.className} color='black'>
            Inventory Items
          </Typography>
        </Box>
      
        <Stack fullWidth height="600px" spacing={0} overflow='auto'>
          {
            inventory.map(({name, quantity})=>(
              <Box
              key={name}
              width='100%'
              minHeight='50px'
              display='flex'
              alignItems={'center'}
              justifyContent={'space-between'}
              bgcolor={GREY}
              padding={3}
              paddingLeft={2}
              borderTop={1}
              >
                <Typography variant='h4' className={rob.className} color={BLUE} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Stack direction='row' spacing={5}>
                <Typography variant='h5' className={rob.className} color='black' textAlign={'center'}>
                  {quantity}
                </Typography>
                  <Button variant='contained' color='success' className={rob.className}
                    onClick={()=>{
                      addItem(name)
                    }}
                  >
                    Add
                  </Button>
                  <Button variant='contained' color='error' className={rob.className}
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