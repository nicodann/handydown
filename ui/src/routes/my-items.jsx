import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
} from '@mui/material';
import useApplicationData from '../hooks/useApplicationData';
import Item from '../components/Item';
import SingleItemModal from '../components/Modals/SingleItemModal';

export default function MyItems() {
  const {
    state,
    addMessage
  } = useApplicationData();

  const [open, setOpen] = useState(false);
  const [modalProps, setModalProps] = useState(
    { 
      id: null,
      name: '', 
      description: '', 
      image: '', 
      offered: true,
      createdAt: '',
      user: { id: null, username: '', location: ''} 
    }
  )

  const openModal = (props) => {
    setModalProps(props)
    setOpen(true)
  }

  return (
    <div>
      { state.items && state.items.length > 0 ? (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={6}>
            {state.items
              .filter((item) => state.loggedInUser && item.userId === state.loggedInUser.id )
              .map((item) => (
                <Item
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  offered={item.offered}
                  image={item.image}
                  createdAt={item.createdAt}
                  username={item.user && item.user.username}
                  location={item.user && item.user.location}
                  onClick={() => openModal(item)}
                />
              ))
            }
            <SingleItemModal
              key={modalProps.id}
              itemId={modalProps.id}
              name={modalProps.name}
              description={modalProps.description}
              image={modalProps.image}
              offered={modalProps.offered}
              createdAt={modalProps.createdAt}
              creatorId={modalProps.user.id}
              location={modalProps.user.location}
              loggedInUser={state.loggedInUser}
              open={open}
              handleClose={() => setOpen(false)}
              addMessage={addMessage}
              item={modalProps}
            />
          </Grid>
        </Box>
      ) : (
        <Box display='flex' justifyContent='center'>
            <Card variant="outlined" sx={{padding: 4}}>
              <Typography variant="h5" sx={{display:'inline'}}>No results found!</Typography>
            </Card>
        </Box>
      )
      }
    </div>
  );
}
      
