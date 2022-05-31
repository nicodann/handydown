import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    ITEMS: [],
    conversations: [],
    loggedInUser: null,
    tabValue: 0
  }); 

  const setITEMS = ITEMS => setState(prev => ({...prev, ITEMS}));
  const setConversations = conversations => setState(prev => ({...prev, conversations}));
  const setLoggedInUser = loggedInUser => setState(prev => ({...prev, loggedInUser}));
  const setTabValue = tabValue => setState(prev => ({...prev, tabValue}));

  useEffect(() => {
    Promise.all([
      axios.get(`/api/items`),
      axios.get(`/api/conversations/by/user/1`)
    ]).then(all => {
      console.log('here is everything:', all)
      setITEMS(all[0].data);
      setConversations(all[1].data);
    })
    .catch(err => console.log(err))
  }, [state.loggedInUser]);  

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
      // setTabbedItems(ITEMS.filter((item) => item.offered && loggedInUser && item.userID !== loggedInUser.id));
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

  return { 
    state,
    setITEMS,
    setConversations,
    setLoggedInUser,
    setTabValue,
    loginUser,
    registerUser
  };

//   // FETCH ALL ITEMS
//   useEffect(() => {
//     axios.get("/api/items")
//     .then((items) => {
//       setITEMS(items.data);
//       console.log('HERE ARE THE ITEMS', items.data);
//       return items.data;
//     })
//     .then((data) => {
//       setTabbedItems(data.filter((item) => {
//         if (loggedInUser) {
//           return item.offered === true && item.userId !== loggedInUser.id; 
//         } else {
//           return item.offered === true
//         }
//       }))
//     })
//     .catch((error) => console.log(error));
// }, [loggedInUser]);

// // FETCH ALL CONVERSATIONS BELONGING TO LOGGED IN USER
// useEffect(() => {
//   if (loggedInUser) {
//     axios.get(`/api/conversations/by/user/${loggedInUser.id}`)
//       .then((conversations) => {
//         setConversations(conversations.data);
//         console.log("HERE ARE THE CONVERSATIONS", conversations.data)
//       })
//       .catch((error) => console.log(error));

//   }
//   }, [loggedInUser]);
};
