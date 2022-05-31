import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    items: [],
    conversations: [],
    loggedInUser: null,
    tabValue: 0
  }); 

  const setItems = items => setState(prev => ({...prev, items}));
  const setConversations = conversations => setState(prev => ({...prev, conversations}));
  const setLoggedInUser = loggedInUser => setState(prev => ({...prev, loggedInUser}));
  const setTabValue = tabValue => setState(prev => ({...prev, tabValue}));

  useEffect(() => {
    Promise.all([
      axios.get(`/api/items`),
      axios.get(`/api/conversations/by/user/1`) // TODO: add check for existence of state.loggedInUser; TODO: make userId dynamic
    ]).then(all => {
      console.log('here is everything:', all)
      setItems(all[0].data);
      setConversations(all[1].data);
    })
    .catch(err => console.log(err))
  }, [state.loggedInUser]);  

  // REGISTER
  const registerUser = async (registrationFormData) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/api/users',
        data: registrationFormData,
        // headers: { "Content-Type": "multipart/form-data" },
      });
      setLoggedInUser(response.data);
      localStorage.clear();
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch(error) {
      console.log(error)
    }
  };

  // LOGIN
  const loginUser = async (loginFormData) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/api/users/login',
        data: loginFormData,
        // headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.clear();
      localStorage.setItem('user', JSON.stringify(response.data));
      setLoggedInUser(response.data);
      setTabValue(0);
    } catch(error) {
      const message = error.response.data;
      return message;
    }
  };

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
    // handleTransition("Logging Out...");
    setTabValue(0);
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
      setItems([newItem, ...state.items]);
      setTabValue(2);
    } catch(error) {
      console.log(error);
    }
  };

  // EDIT ITEM
  const editItem = async (editItemFormData, id) => {
    try {
      const response = await axios({
        method: 'put',
        url: `/api/items/${id}`,
        data: editItemFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedItem = response.data;
      const filteredItems = state.items.filter(item => item.id !== updatedItem.id)
      setItems([ updatedItem, ...filteredItems]);
      // handleTransition("Updating Item...");
      setTabValue(2);
    } catch(err) {
      console.log(err);
    } 
  };

  // DELETE ITEM
  const deleteItem = async (itemId, offered) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      // if (tabValue === 2) {
      //   setTabbedItems(tabbedItems.filter((tabbedItem) => tabbedItem.id !== itemId));
      // }
      setItems(state.items.filter((item) => item.id !== itemId));
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
      const returnedConversation = response.data;
      const filteredConversations= state.conversations.filter(conversation => conversation.id !== returnedConversation.id);
      setConversations([returnedConversation, ...filteredConversations]);
      return returnedConversation;
    } catch(err) {
      console.log(err);
    };
  };

  //MARK CONVO AS READ
  const markAsRead =  async (conversationId, readByWhom) => {
    try {
       await axios.put(`/api/conversations/${conversationId}`, {readByWhom: readByWhom});
    } catch(err) {
      console.log(err);
    }
  };

  // const checkLoggedInUser = async () => {
  //   try {
  //     const response = await axios({
  //       method: 'post',
  //       url: '/api/users/logged_in',
  //     });
  //     setLoggedInUser(response.data);
  //   } catch (error) {
  //       console.log('POST /api/users/logged_in', error.response.data)
  //       console.log(error);
  //   }
  // };
          
  return { 
    state,
    setItems,
    setConversations,
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
  };
};
