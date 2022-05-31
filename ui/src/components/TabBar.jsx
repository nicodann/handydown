import {
  Box,
  Tabs,
  Tab
} from '@mui/material';

export default function TabBar(props) {

  const {
    // ITEMS,
    loggedInUser,
    // setTabbedItems,
    tabValue,
    // setTabValue,
    setSearchText
  } = props;

  const handleClick = (_event, newValue) => {
    // const currentTab = newValue;
    setSearchText('');

    // if (currentTab === 0) {
    //   setTabbedItems(ITEMS.filter((item) => { 
    //     if (loggedInUser) {
    //       return item.offered === true && item.userId !== loggedInUser.id; 
    //     } else {
    //       return item.offered === true
    //     }
    //   }));
    // } else if (currentTab === 1) {
    //   setTabbedItems(ITEMS.filter((item) => {
    //     if (loggedInUser) {
    //       return !item.offered && item.userId !== loggedInUser.id; 
    //     } else {
    //       return !item.offered
    //     }
    //   }));
    // } else if (currentTab === 2) {
    //   if (loggedInUser) {
    //     setTabbedItems(ITEMS.filter((item) => item.userId === loggedInUser.id));
    //   } else {
    //     setTabbedItems([]);
    //   }
    // }
    // setTabValue(currentTab);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ pt: 1, borderBottom: 1, borderColor: 'divider', background: '#42A5F5' }}>
      <Tabs value={tabValue} onChange={handleClick}>
        <Tab label="Offers" sx={{color: 'white'}}/>
        <Tab label="Wanted" sx={{color: 'white'}}/>
        <Tab 
          label="My Items"
          sx={{color: 'white'}} 
          style={
            loggedInUser ? { display: "inline-flex" } : {display: "none"} 
          } 
        />
        <Tab 
          label="My Messages"
          sx={{color: 'white'}} 
          style={
            loggedInUser ? { display: "inline-flex" } : {display: "none"} 
          } 
        />
      </Tabs>
    </Box>
    )
  
};

