import { useState } from 'react';
import { format} from 'timeago.js';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Checkbox,
  Typography
} from '@mui/material';
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import RefreshIcon from '@mui/icons-material/Refresh';
import Conversation from './Conversation';
import SingleConversationModal from './Modals/SingleConversationModal'

export default function ConversationList(props) {

  const {
    conversations,
    loggedInUser,
    addMessage,
    tabValue,
    setTabValue,
    tabIndex,
    markAsRead
  } = props;

  const findLatestMessageBody = (conversation) => {
    return conversation.messages[conversation.messages.length -1].body
  }
  
  const findOtherPartyName = (conversation, loggedInUserID) => {
    return loggedInUserID === conversation.receiver.id ? conversation.creator.username : conversation.receiver.username
  }

  const readByWhom = (conversation, loggedInUserID) => {
    return conversation.creator.id === loggedInUserID ? "readByCreator" : "readByReciever";
  }

  //MODAL STATE LOGIC
  const [open, setOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    creator:{id: null, username: ""},
    receiver: {id: null, username: ""},
    item: {id: null, name: '', offered: true, image: ''},
    messages: [{id: null, createdAt: null, body: ''}],
  })

  const handleClick = (conversation, userID) => {
    setOpen(true)
    setModalProps(conversation)
    markAsRead(conversation.id, readByWhom(conversation, userID))
  }

  const conversationsArray = conversations.map((conversation) => 
    <Conversation
      key={conversation.id}
      id={conversation.id}
      otherPartyName={loggedInUser && findOtherPartyName(conversation, loggedInUser.id)}
      itemName={conversation.item.name}
      messageBody={findLatestMessageBody(conversation)}
      updatedAt={format(conversation.updatedAt)}
      onClick={() => handleClick(conversation, loggedInUser.id)}
      read={loggedInUser && loggedInUser.id === conversation.creatorId ? conversation.readByCreator : conversation.readByReceiver}
    />
  );
  return (
    <div 
      role="tabpanel"
      hidden={tabValue !== tabIndex}
      id={`simple-tabpanel-${tabIndex}`}
    >
      {tabValue === tabIndex && (
        <>
        
        <TableContainer>
          <Table sx={{ pt: 2, minWidth: 650, tableLayout: 'fixed', borderLeft: 'none' }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{background:'#f5f5f5'}}>
              {conversationsArray.length !== 0 && 
              <>
                <TableCell sx={{width: 65}}>
                  <Checkbox color="primary" />
                </TableCell>
                <TableCell sx={{width: 50, paddingTop: 3}}>
                  <RefreshIcon />
                </TableCell>
              
              </>
              }
              <TableCell >
                {conversationsArray.length === 0 && <Typography variant="h5" sx={{display:'inline'}}>No Messages</Typography>}
              </TableCell>
            </TableRow>
          </TableHead>
          </Table>
        </TableContainer>
        <TableContainer component={Paper}>
          <Table sx={{ pt: 2, minWidth: 650, tableLayout: 'fixed' }} aria-label="simple table">
            {/* <TableHead> */}
              {/* <TableRow>
                <TableCell sx={{width: 50}}>
                  <Checkbox color="primary" />
                </TableCell> */}
                {/* <TableCell >Other Party</TableCell>
                <TableCell >Subject/Item</TableCell>
                <TableCell sx={{
                  width: 'auto', 
                  height: 'inherit'
                }}>
                  Message
                </TableCell>
                <TableCell align="right">Latest Message Date/Time</TableCell> */}
                {/* <TableCell >
                  {conversationsArray.length === 0 && <Typography variant="h5" sx={{display:'inline'}}>No communication detected</Typography>}
                </TableCell> */}
                {/* <TableCell ></TableCell>
                <TableCell sx={{
                  width: 'auto', 
                  height: 'inherit'
                }}>
                  
                </TableCell>
                <TableCell align="right"></TableCell> */}
              {/* </TableRow>
            </TableHead> */}
            <TableBody>
              {conversationsArray}
              <SingleConversationModal
                itemId={modalProps.item.id} // ReplyForm
                name={modalProps.item.name} // ReplyForm
                offered={modalProps.item.offered} // ReplyForm
                image={modalProps.item.image}
                messages={modalProps.messages}
                creator={modalProps.creator} // ReplyForm et al.
                receiver={modalProps.receiver} // ReplyForm et al.
                loggedInUser={loggedInUser} // ReplyForm
                addMessage={addMessage} // ReplyForm
                open={open}
                handleClose={() => setOpen(false)} // ReplyForm et al.
                setTabValue={setTabValue} // ReplyForm
                setModalProps={setModalProps}
                modalProps={modalProps}
              /> 
            </TableBody>
          </Table>
        </TableContainer>
        </>
      )}
    </div>
  );
  
};
