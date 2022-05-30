import axios from 'axios';
import { useEffect, useState } from 'react';
import '../App.css'
import {
  Box,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from './Navbar';
import TabBar from './TabBar';
import ItemList from './ItemList';
import ConversationList from './ConversationList';
import AddItemForm from './Modals/AddItemForm';
import LoginForm from './Modals/LoginForm';
import RegistrationForm from './Modals/RegistrationForm';

export default function App() {

  // STATE
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [ITEMS, setITEMS] = useState(null);
  const [tabbedItems, setTabbedItems] = useState([]);
  const [searchedItems, setSearchedItems] = useState([])
  const [conversations, setConversations] = useState([]);
  const [tabValue, setTabValue ] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const [regFormOpen, setRegFormOpen] = useState(false);
  const [transition, setTransition] = useState(false);
  const [transitionPhrase, setTransitionPhrase] = useState('Loading...')

//   useEffect(() => {
//     console.log("tabbedItems:",tabbedItems);
//     console.log("ITEMS:", ITEMS)
// }, [tabbedItems, ITEMS])

  const handleTransition = (phrase) => {
    setTransitionPhrase(phrase)
    setTransition(true);
          setTimeout(() => {
            setTransition(false);
            setTransitionPhrase('Loading...')
          }, 1000);
  }
  // const checkLoggedInUser = async () => {
    //   try {
      //     const response = await axios({
        //       method: 'post',
        //       url: '/api/users/logged_in',
        //     });
        //     setLoggedInUser(response.data);
        //   } catch (error) {
          //     console.log('POST /api/users/logged_in', error.response.data)
          //     console.log(error);
          //   }
          // };
          
  // CHECK IF USER HAS PREVIOUSLY LOGGED IN
  useEffect(() => {

    // 👇️ set style on body element
    // document.body.style.backgroundColor = '#bbdefb';
    document.body.style.backgroundColor = '#f5f5f5';

    
  }, []);
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setLoggedInUser(foundUser);
    }
  }, [])

  // FETCH ALL ITEMS
  useEffect(() => {
    axios.get("/api/items")
    .then((items) => {
      setITEMS(items.data);
      console.log('HERE ARE THE ITEMS', items.data);
      return items.data;
    })
    .then((data) => {
      setTabbedItems(data.filter((item) => {
        if (loggedInUser) {
          return item.offered === true && item.userId !== loggedInUser.id; 
        } else {
          return item.offered === true
        }
      }))
  })
    .catch((error) => console.log(error));
  }, [loggedInUser]);

  // FETCH ALL CONVERSATIONS BELONGING TO LOGGED IN USER
  useEffect(() => {
    if (loggedInUser) {
      axios.get(`/api/conversations/by/user/${loggedInUser.id}`)
        .then((conversations) => {
          setConversations(conversations.data);
          console.log("HERE ARE THE CONVERSATIONS", conversations.data)
        })
        .catch((error) => console.log(error));

    }
    }, [loggedInUser]);

  // LOGIN
  const loginUser = async (loginFormData) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/api/users/login',
        data: loginFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.clear();
      localStorage.setItem('user', JSON.stringify(response.data));
      setLoggedInUser(response.data);
      setTabValue(0);
      setTabbedItems(ITEMS.filter((item) => item.offered && loggedInUser && item.userID !== loggedInUser.id));
    } catch(error) {
      const message = error.response.data;
      return message;
    }
  };

  // REGISTER
  const registerUser = async (registrationFormData) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/api/users',
        data: registrationFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoggedInUser(response.data);
      localStorage.clear();
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch(error) {
      console.log(error)
    }
  }

  // LOGOUT
  const logoutUser = async () => {
    console.log("logging out")
    // try {
    //   await axios({
    //     method: 'post',
    //     url: '/api/users/logout'
    //   })
    // } catch(error) {
    //   console.log(error);
    // }

    setLoggedInUser(null);
    localStorage.clear();
    setConversations([]);
    handleTransition("Logging Out...");
    setTabValue(0);
    setTabbedItems(ITEMS.filter((item) => item.offered))
  };

  // ADD ITEM
  const addItem = async (newItemFormData) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/api/items',
        data: newItemFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newItem = response.data;
      setITEMS([newItem, ...ITEMS]);
      setTabValue(2);
      setTabbedItems([newItem, ...ITEMS.filter((item) => item.userId === loggedInUser.id)]);
    } catch(error) {
      console.log(error);
    }
  };

  // DELETE ITEM
  const deleteItem = async (itemId, offered) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      if (tabValue === 2) {
        setTabbedItems(tabbedItems.filter((tabbedItem) => tabbedItem.id !== itemId));
      }
      setITEMS(ITEMS.filter((item) => item.id !== itemId));
    } catch(err) {
      console.log(err);
    }
  };

  // EDIT ITEM
  const editItem = async (editItemFormData, id) => {
    // try {
    //   await axios.put(`/api/items/${editItemFormData.id}`, {editItemFormData: editItemFormData});
    console.log("editItemFormData.id:", editItemFormData.id)
    try {
      const response = await axios({
        method: 'put',
        url: `/api/items/${id}`,
        data: editItemFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedItem = response.data;
      const filteredItems = ITEMS.filter(item => item.id !== updatedItem.id)
      console.log("filteredItems", filteredItems)
      setITEMS([ updatedItem, ...filteredItems]);
      handleTransition("Updating Item...");
      setTabValue(2);
      setTabbedItems([updatedItem, ...ITEMS.filter((item) => item.userId === loggedInUser.id && item.id !== updatedItem.id)]);
      console.log("tabbedItems:",tabbedItems);
    } catch(err) {
      console.log(err);
    }
   
  }

  // ADD MESSAGE
  const addMessage = async (newMessageFormData) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/api/messages',
        data: newMessageFormData,
      });
      console.log('returned conversation', response.data);
      const returnedConversation = response.data;
      const filteredConversations= conversations.filter(conversation => conversation.id !== returnedConversation.id);
      setConversations([returnedConversation, ...filteredConversations]);
      // console.log('returnedConversation', returnedConversation)
      return returnedConversation;
    } catch(err) {
      console.log(err);
    };
  };

  const handleSearchInput = (event) => {
    const keyword = event.target.value;

    if (keyword !== '') {
      setSearchedItems(tabbedItems.filter((item) => item.name.toLowerCase().startsWith(keyword.toLowerCase())));
    } else {
      setSearchedItems(tabbedItems);
    }

    setSearchText(keyword);
  };

  //MARK CONVO AS READ
  const markAsRead =  async (conversationId, readByWhom) => {
    try {
       await axios.put(`/api/conversations/${conversationId}`, {readByWhom: readByWhom});
    } catch(err) {
      console.log(err);
    }
    
  }

  // RENDER

  if ((ITEMS === null) || (ITEMS && transition)) {
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
        loggedInUser={loggedInUser}
        loginFormOpen={loginFormOpen}
        setLoginFormOpen={setLoginFormOpen}
        RegistrationForm={RegistrationForm}
        regFormOpen={regFormOpen}
        setRegFormOpen={setRegFormOpen}
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        setTransition={setTransition}
        setTransitionPhrase={setTransitionPhrase}
        registerUser={registerUser}
        loginUser={loginUser}
        logoutUser={logoutUser}
        addItem={addItem}
        AddItemForm={AddItemForm}
      />
      
      <TabBar 
        ITEMS={ITEMS}
        loggedInUser={loggedInUser}
        setTabbedItems={setTabbedItems}
        tabValue={tabValue}
        setTabValue={setTabValue}
        setSearchText={setSearchText}
      />
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ pt: 4 }}>
        <TextField
          type="search"
          value={searchText}
          onChange={handleSearchInput}
          id="outlined-search"
          label="Search by item name..."
          sx={{ background: "white", visibility: (tabValue === 3 || tabbedItems.length === 0) ? 'hidden' : 'visible'}}
        />
      </Box>
      <Container maxWidth="lg" sx={{ py: 4}}>
        <ItemList 
          items={searchText !== '' ? searchedItems : tabbedItems}
          tabValue={tabValue}
          tabIndex={0}
          deleteItem={deleteItem}
          addMessage={addMessage}
          loggedInUser={loggedInUser}
          setTabValue={setTabValue}
        />
        <ItemList
          items={searchText !== '' ? searchedItems : tabbedItems}
          tabValue={tabValue}
          tabIndex={1}
          deleteItem={deleteItem}
          addMessage={addMessage} // for ReplyForm
          loggedInUser={loggedInUser} // for ReplyForm, among others
          setTabValue={setTabValue}
        />
        <ItemList
          items={searchText !== '' ? searchedItems : tabbedItems}
          tabValue={tabValue}
          tabIndex={2}
          deleteItem={deleteItem}
          editItem={editItem}
          loggedInUser={loggedInUser} // for ReplyForm, among others
          setTabValue={setTabValue}
        />
        <ConversationList
          conversations={conversations}
          loggedInUser={loggedInUser} // for ReplyForm, among others
          addMessage={addMessage} // for ReplyForm
          tabValue={tabValue}
          setTabValue={setTabValue}
          tabIndex={3}
          markAsRead={markAsRead}
          // loggedInUserID={loggedInUser && loggedInUser.id}
        />
      </Container>
    </>
  ); 
}
}
