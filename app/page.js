'use client'; // Add this directive at the top

import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '../firebase';
import { collection, doc, setDoc, getDocs, query, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  position: 'relative',
  color: 'white',
  zIndex: 1,
};

const backgroundStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark shaded background
  zIndex: 0,
};

const headerStyle = {
  width: '800px',
  height: '100px',
  backgroundColor: '#4757ed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const titleStyle = {
  color: '#ffff',
  textAlign: 'center',
};

const itemBoxStyle = {
  width: '100%',
  minHeight: '150px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(135, 144, 232, 0.9)', 
  color: 'white',
  paddingX: 5,
  borderBottom: '1px solid #ccc',
};

const buttonStyle = {
  backgroundColor: '#444ead',
  color: '#fff',
};

const addButtonStyle = {
  backgroundColor: '#3933b0',
  color: '#fff',
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: (count || 0) + 1 }); // Default to 0 if count is undefined
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const { count } = docSnap.data();
        if (count > 1) {
          await setDoc(docRef, { count: (count || 1) - 1 });
        } else {
          await deleteDoc(docRef);
        }
      } else {
        console.error(`Item ${item} does not exist in the pantry.`);
      }
  
      await updatePantry();
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  return (
    <Box sx={containerStyle}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              sx={addButtonStyle}
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button sx={addButtonStyle} onClick={handleOpen}>
        ADD
      </Button>
      <Box border={'1px solid #333'}>
        <Box sx={headerStyle}>
          <Typography variant={'h2'} sx={titleStyle} fontFamily={'inital'} fontStyle={'normal'}>
            Pantry Tracker
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow={'auto'}
          border={'1px solid #333'}
        >
          {pantry.map(({ name, count }) => (
            <Box key={name} sx={itemBoxStyle}>
              <Typography variant={'h3'} color={'white'} textAlign={'center'} fontFamily={'initial'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'white'} textAlign={'center'} fontFamily={'initial'}>
              Quantity: {count || 0} {/* Display 0 if count is undefined */}
              </Typography>
              <Button sx={buttonStyle} onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}