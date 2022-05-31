import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css'
import Navbar from './Navbar';
import TabBar from './TabBar';
import ItemList from './ItemList';
import ConversationList from './ConversationList';
import AddItemForm from './Modals/AddItemForm';
import LoginForm from './Modals/LoginForm';
import RegistrationForm from './Modals/RegistrationForm';
import useApplicationData from '../hooks/useApplicationData';

export default function App() {

  // STATE
  const [searchedItems, setSearchedItems] = useState([])
  const [searchText, setSearchText] = useState("");
  const [transition, setTransition] = useState(false);
  const [transitionPhrase, setTransitionPhrase] = useState('Loading...')

  const {
    state,
    // setITEMS,
    // setConversations,
    setLoggedInUser,
    setTabValue,
    registerUser,
    loginUser,
    logoutUser,
    addItem,
    editItem,
    deleteItem,
    addMessage,
    markAsRead
  } = useApplicationData();

  useEffect(() => {
    // 👇️ set style on body element
    // document.body.style.backgroundColor = '#bbdefb';
    document.body.style.backgroundColor = '#f5f5f5';
  }, []);
          
  // CHECK IF USER HAS PREVIOUSLY LOGGED IN
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setLoggedInUser(foundUser);
    }
  }, [])

  const handleTransition = (phrase) => {
    setTransitionPhrase(phrase)
    setTransition(true);
          setTimeout(() => {
            setTransition(false);
            setTransitionPhrase('Loading...')
          }, 1000);
  };

  // const handleSearchInput = (event) => {
  //   const keyword = event.target.value;

  //   if (keyword !== '') {
  //     setSearchedItems(tabbedItems.filter((item) => item.name.toLowerCase().startsWith(keyword.toLowerCase())));
  //   } else {
  //     setSearchedItems(tabbedItems);
  //   }

  //   setSearchText(keyword);
  // };

  // RENDER

  if ((state.ITEMS === null) || (state.ITEMS && transition)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
      <CircularProgress size={80} />
      <Typography sx={{mt: 2}}>{transitionPhrase}</Typography>
    </Box>
    )
  } else {

    return (
    <>
      <CssBaseline />
      <Navbar 
        LoginForm={LoginForm}
        RegistrationForm={RegistrationForm}
        AddItemForm={AddItemForm}
        loggedInUser={state.loggedInUser}
        setTransition={setTransition}
        setTransitionPhrase={setTransitionPhrase}
        registerUser={registerUser}
        loginUser={loginUser}
        logoutUser={logoutUser}
        addItem={addItem}
      />
      
      <TabBar 
        ITEMS={state.ITEMS}
        loggedInUser={state.loggedInUser}
        tabValue={state.tabValue}
        setTabValue={setTabValue}
        setSearchText={setSearchText}
      />
      {/* <Box display="flex" justifyContent="center" alignItems="center" sx={{ pt: 4 }}>
        <TextField
          type="search"
          value={searchText}
          onChange={handleSearchInput}
          id="outlined-search"
          label="Search by item name..."
          sx={{ background: "white", visibility: (state.tabValue === 3 || tabbedItems.length === 0) ? 'hidden' : 'visible'}}
        />
      </Box> */}
      <Container maxWidth="lg" sx={{ py: 4}}>
        <ItemList 
          // items={searchText !== '' ? searchedItems : tabbedItems}
          tabIndex={0}
          items={state.ITEMS}
          tabValue={state.tabValue}
          loggedInUser={state.loggedInUser}
          deleteItem={deleteItem}
          addMessage={addMessage}
          setTabValue={setTabValue}
        />
        <ItemList
          tabIndex={1}
          items={state.ITEMS}
          tabValue={state.tabValue}
          loggedInUser={state.loggedInUser} // for ReplyForm, among others
          deleteItem={deleteItem}
          addMessage={addMessage} // for ReplyForm
          setTabValue={setTabValue}
        />
        <ItemList
          tabIndex={2}
          items={state.ITEMS}
          tabValue={state.tabValue}
          loggedInUser={state.loggedInUser} // for ReplyForm, among others
          deleteItem={deleteItem}
          editItem={editItem}
          addMessage={addMessage}
          setTabValue={setTabValue}
        />
        <ConversationList
          tabIndex={3}
          conversations={state.conversations}
          tabValue={state.tabValue}
          loggedInUser={state.loggedInUser} // for ReplyForm, among others
          addMessage={addMessage} // for ReplyForm
          setTabValue={setTabValue}
          markAsRead={markAsRead}
        />
      </Container>
    </>
  ); 
}
}
