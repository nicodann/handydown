import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Typography,
} from '@mui/material';
import { VolunteerActivism } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircularProgress from '@mui/material/CircularProgress';
import ItemList from './ItemList';
import ConversationList from './ConversationList';
import AddItemForm from './Modals/AddItemForm';
import LoginForm from './Modals/LoginForm';
import RegistrationForm from './Modals/RegistrationForm';

function App() {

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
    // }, [loggedInUser && loggedInUser.id]);
    }, [loggedInUser]);
  
  // 
  // useEffect(() => {
  //   console.log("tabbedItems.length:",tabbedItems.length)
  //   console.log("tabValue:", tabValue)
  // });

  // LOGIN
  const loginUser = async (loginFormData) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/api/users/login',
        data: loginFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoggedInUser(response.data);
      localStorage.setItem('user', response.data);
    } catch(error) {
      console.log(error);
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
      localStorage.setItem('user', response.data);
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
      if ((tabValue === 0 && newItem.offered) ||
          (tabValue === 1 && !newItem.offered) ||
          (tabValue === 2 && newItem.userId === loggedInUser.id)) {
        setTabbedItems([newItem, ...tabbedItems]);
      } 
      setITEMS([newItem, ...ITEMS]);
    } catch(error) {
      console.log(error);
    }
  };

  // DELETE ITEM
  const deleteItem = async (itemId, offered) => {
    try {
      const response = await axios.delete(`/api/items/${itemId}`);
      console.log("AXIOS DELETE RESPONSE", response);
      if ((tabValue === 0 && offered) ||
          (tabValue === 1 && !offered) ||
          (tabValue === 2)) {
        setTabbedItems(tabbedItems.filter((tabbedItem) => tabbedItem.id !== itemId));
      }
      setITEMS(ITEMS.filter((item) => item.id !== itemId));
    } catch(err) {
      console.log(err);
    }
  };

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
    } catch(err) {
      console.log(err);
    };
  };

  const handleTabClick = (_event, newTabValue) => {
    const currentTab = newTabValue;
    setSearchText('');

    if (currentTab === 0) {
      setTabbedItems(ITEMS.filter((item) => { 
        if (loggedInUser) {
          return item.offered === true && item.userId !== loggedInUser.id; 
        } else {
          return item.offered === true
        }
      }));
    } else if (currentTab === 1) {
      setTabbedItems(ITEMS.filter((item) => {
        if (loggedInUser) {
          return !item.offered && item.userId !== loggedInUser.id; 
        } else {
          return !item.offered
        }
      }));
    } else if (currentTab === 2) {
      if (loggedInUser) {
        setTabbedItems(ITEMS.filter((item) => item.userId === loggedInUser.id));
      } else {
        setTabbedItems([]);
      }
    }
    setTabValue(currentTab);
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

  if (ITEMS === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={80} />
    </Box>
    )
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <VolunteerActivism />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HandyDown
          </Typography>
            
          {!loggedInUser ?
            <>
              <Button 
                color="inherit"
                variant="text"
                onClick={() => setLoginFormOpen(true)}
              >
                Login
              </Button>
              <LoginForm 
                loginFormOpen={loginFormOpen}
                setLoginFormOpen={setLoginFormOpen}
                loginUser={loginUser}            
              />
              <Button 
                color="inherit"
                variant="text"
                onClick={() => setRegFormOpen(true)}
              >
                Register
              </Button>
              <RegistrationForm 
                registrationFormOpen={regFormOpen}
                setRegistrationFormOpen={setRegFormOpen}
                registerUser={registerUser}
              />
            </>
          :
            <>
              <IconButton sx={{mr: -1.5}}>
                <AccountCircleIcon style={{fill: "white"}}/>
              </IconButton>
              <Button
                color="inherit"
                component="span"
              >
                {loggedInUser.username}
              </Button>
              <Button
                color="inherit"
                variant="text"
                onClick={logoutUser}
              >
                Logout
              </Button>
            </>
          }

            <Button
              color="warning"
              variant="contained"
              onClick={() => setFormOpen(true)}
              sx={{ml: 1}}
            >
              Post Item
            </Button>
            <AddItemForm 
              color="inherit" 
              formOpen={formOpen} 
              addItem={addItem} 
              loggedInUserID={loggedInUser && loggedInUser.id} 
              handleFormClose={() => setFormOpen(false)} 
            />
        </Toolbar>
       </AppBar>
      
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ pt: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabClick}>
          <Tab label="Offers" />
          <Tab label="Wanted" />
          <Tab label="My Items" />
          <Tab label="My Messages" />
        </Tabs>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ pt: 4 }}>
        <TextField
          type="search"
          value={searchText}
          onChange={handleSearchInput}
          id="outlined-search"
          label="Search by item name..."
          sx={{ visibility: (tabValue === 3 || tabbedItems.length === 0) ? 'hidden' : 'visible'}}
        />
      </Box>
      <Container maxWidth="lg" sx={{ py: 4}}>
        <ItemList 
          items={searchText !== '' ? searchedItems : tabbedItems}
          tabValue={tabValue}
          tabIndex={0}
          loggedInUserID={loggedInUser && loggedInUser.id}
          deleteItem={deleteItem}
          addMessage={addMessage}
          loggedInUser={loggedInUser}
          setTabValue={setTabValue}
        />
        <ItemList
          items={searchText !== '' ? searchedItems : tabbedItems}
          tabValue={tabValue}
          tabIndex={1}
          loggedInUserID={loggedInUser && loggedInUser.id}
          deleteItem={deleteItem}
          addMessage={addMessage} // for ReplyForm
          loggedInUser={loggedInUser} // for ReplyForm, among others
          setTabValue={setTabValue}
        />
        <ItemList
          items={searchText !== '' ? searchedItems : tabbedItems}
          tabValue={tabValue}
          tabIndex={2}
          loggedInUserID={loggedInUser && loggedInUser.id}
          deleteItem={deleteItem}
        />
        <ConversationList
          conversations={conversations}
          tabValue={tabValue}
          tabIndex={3}
          loggedInUserID={loggedInUser && loggedInUser.id}
        />
      </Container>
    </>
  ); 
}

export default App;