// We want to make this a client side app
'use client'
import React, { useState, useEffect, useCallback } from 'react' // State variables and client side functions from React
import { Box, Typography, Modal, Stack, TextField, Button, Paper, InputBase } from "@mui/material"
import { styled, alpha } from '@mui/material/styles';
import { firestore } from "@/firebase"
import { collection, deleteDoc, doc, getDoc, setDoc, getDocs, query, where } from "firebase/firestore"
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const rootStyle = {
  backgroundColor: 'lightgray',
  palette: {
    primary: "#1a3b33",
  },
  fontFamily: "Arial",
};

export default function Home() {
  const [inventory, setInventory] = useState([])  // State variable for storing inventory
  const [filteredInventory, setFilteredInventory] = useState([])  // State variable for storing inventory
  const [open, setOpen] = useState(false)         // State variable for modal, used for adding/removing stuff
  const [itemName, setItemName] = useState('')    // State variable for item name
  const [quantity, setItemQuantity] = useState(1) // State variable for item quantity
  const [searchQuery, setSearchQuery] = useState(""); // State variable for search query

  const SearchBar = ({searchQuery}) => (
    <form>
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => {
          //setSearchQuery(e.target.value);
          searchQuery = e.target.value;
          //setSearchQuery(e.target.value);
          //filterData(searchQuery);
        }}
        label="Search Inventory"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </form>
  );

  const filterData = async (query) => {
    if (!query) {
      return inventory;
    } else {
      console.log("Searching for: " + query)
      return setFilteredInventory(inventory.filter((d) => d.name.toLowerCase().includes(query)));
    }
  };
  
  //const filteredInventory = filterData(searchQuery, inventory) // Filtered inventory based on search query

  // Fetch inventory from firestore. Async is important here, otherwise website will freeze when fetching
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  // Helper function to add an item from the inventory
  const addItem = async (item, num) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    // Check if the item exists
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + num })
    } else {
      await setDoc(docRef, { quantity: num })
    }

    await updateInventory()
  }

  // Helper function to remove an item from the inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    // Check if the item exists
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()

      // If the quantity is 1, delete the item
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  // Helper function to update the quantity of an item
  /*const handleQuantity = async (e) => {
    setItemQuantity(e.target.value)
    if (value === '' || /^\d+$/.test(value)) {
      setItemQuantity(value === '' ? '' : Number(value))
    }
  }*/
    const handleQuantity = (value) => {
      if (isNaN(value) || value === '' || value < 1) {
        // Handle the case when the input is not a number
        console.log('Input is not a number');
      } else {
        setItemQuantity(value);
      }
    };

  /*
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
  
  
  // Filter inventory based on search query
  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);

    // Filter inventory based on search query
    //const filteredInventory = inventory.filter((item) =>
    //  item.name.toLowerCase().includes(searchQuery.toLowerCase())
    //);
  
    // Update filtered inventory state
    //setFilteredInventory(filteredInventory);
  }, [setSearchQuery]);


  <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
  */

  // Update inventory when the page loads
  useEffect(() => {updateInventory()}, [])

  // Modal functions
  const handleOpen = () => {setOpen(true)}

  const handleClose = () => {setOpen(false)}

  // Increment and decrement functions
  const incrementQuantity = () => {setItemQuantity(quantity + 1)}

  const decrementQuantity = () => {setItemQuantity(quantity => Math.max(1, quantity - 1))}

  const serviceList = ["Service 1", "Service 2", "Service 3"]

  // Boxes are the most basic starting block in material UI
  return (
    <div style={rootStyle}>
    
    <Box // Pop up modal for adding items
      width="100vw" 
      height="100vh" 
      display="flex"
      flexDirection={"column"}
      justifyContent="center" 
      alignItems="center"
      gap = {2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          sx={(
            {transform: 'translate(-50%, -50%)'}
          )} 
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h4" display="flex" justifyContent={"center"}>Add Item</Typography>
          <Stack width="100%" direction="row" alignItems={"center"} justifyContent={"space-between"} spacing="2px">
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e)=>setItemName(e.target.value)}
              placeholder="Item Name"
            />
            <TextField
              variant="outlined"
              type="text" // Accepting text to allow empty state
              value={quantity}
              //onChange={handleQuantity}
              onChange={(e)=>handleQuantity(e.target.value)}
              style={{ width: '80px' }} // Fixed width for quantity field
            ></TextField>
            <Stack direction="column" spacing="2px">
              <Button 
                variant="outlined" 
                onClick={incrementQuantity}
                style={{padding: '2px', minWidth: '30px'}} 
              ><ArrowDropUpIcon color="primary"/></Button>
              <Button 
                variant="outlined" 
                onClick={decrementQuantity}
                style={{padding: '2px', minWidth: '30px'}}  
              ><ArrowDropDownIcon color="primary"/></Button>
            </Stack>
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName, quantity);
                setItemName('');
                handleClose();
              }}
            ><AddCircleIcon fontSize="large"/></Button>
          </Stack>  
        </Box>
      </Modal>
      <Paper elevation={3} borderRadius={5}>
        <Typography 
          paddingLeft={5}
          paddingRight={5}
          variant='h1'
          sx={{my: 1, textAlign: "center"}}
          color="textPrimary"
        >FoodFolio</Typography>
        <Typography variant="h6" display="flex" justifyContent="center">Your daily inventory!</Typography>
      </Paper>
      
      
      <Box>
        <Typography 
          variant='h5' 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          color="textSecondary"
        >Begin by adding an item from your pantry.</Typography>
      </Box>

              
      <Stack justifyContent={"space-around"} alignItems="center" direction={{sm: "column", md: "row"}} spacing={{xs:2, sm: 2, md: 40 }}>
        <Box bgcolor="lightgray">
          <SearchBar value={searchQuery} onChange={(event) => filterData(event.target.value)}/>
        </Box>

        <Button variant="contained" color="primary" display="flex" justifyContent="right" onClick={() => {
          handleOpen()
        }}>Add New Item</Button>
      </Stack>

      <Box border='1px solid #333'>
        <Box
          width="800px"
          height="100px"
          //bgcolor="#bcf0d3"
          bgcolor="#0d314b"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="lightgray">Pantry Items</Typography>
        </Box>
        <Stack width="800px" height="300px" bgcolor="white" spacing={2} overflow="auto">
          {
              filteredInventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgColor="#f0f0f0"
                  padding={3}
                >
                  <Typography variant="h4" color="#333" textAlign="center">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Box>
                    <Typography variant="h4" color="#333" textAlign="center">
                      {quantity}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={() => addItem(name, 1)}
                      ><AddIcon/></Button>
                      <Button
                        variant="contained"
                        onClick={() => removeItem(name)}
                      ><RemoveIcon/></Button>
                    </Stack>
                  </Box>
                  
                </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
    </div>
  )
}
