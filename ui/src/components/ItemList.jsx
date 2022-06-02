// import { useState } from 'react';
import { 
  Box,
  Grid,
  Typography,
  Card
} from '@mui/material';
import Item from './Item';
import { getItems } from '../helpers/selectors';

export default function ItemList(props) {
  const { filter } = props;
  let items = getItems();
  items = items.filter(filter).map((item) => (
    <Item
      key={item.id}
      item={item}
      onClick={() => console.log('Item clicked')}
    />
  ))
  return ({items})

  return (
    <div 
      role="tabpanel"
      hidden={tabValue !== tabIndex}
      id={`simple-tabpanel-${tabIndex}`}
    >
      {tabValue === tabIndex && (
        items && items.length > 0 ? (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={6}>
            {mappedItems}
            {/* { items.map((item) => ( 
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
            ))} */}
            <SingleItemModal
              key={modalProps.id}
              itemId={modalProps.id} // for ReplyForm, among others
              name={modalProps.name}
              description={modalProps.description}
              image={modalProps.image}
              offered={modalProps.offered}
              createdAt={modalProps.createdAt}
              creatorId={modalProps.user.id} // for ReplyForm, among others
              location={modalProps.user.location}
              loggedInUser={loggedInUser} // for ReplyForm, among others
              open={open}
              handleClose={() => setOpen(false)}
              addMessage={addMessage} // for ReplyForm
              deleteItem={deleteItem}
              editItem={editItem}
              tabIndex={tabIndex}
              setTabValue={setTabValue} // for ReplyForm
              item={modalProps}
            />
          </Grid>
        </Box>
      ) : (
        <Box display='flex' justifyContent='center'>
          {tabIndex === 2 ?
            <Card variant="outlined" sx={{padding: 4}}>
              <Typography variant="h5" sx={{display:'inline'}}>You haven't posted anything yet!</Typography> 
            </Card> :
            <Card variant="outlined" sx={{padding: 4}}>
              <Typography variant="h5" sx={{display:'inline'}}>No results found!</Typography>
            </Card>
          }
        </Box>
      )
      )}
    </div>
  );
};
