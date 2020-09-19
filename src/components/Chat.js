import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import React, { useState, useRef } from "react";
import "./Chat.css";
// import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SentimentVerySatisfiedOutlinedIcon from "@material-ui/icons/SentimentVerySatisfiedOutlined";
import TelegramIcon from "@material-ui/icons/Telegram";
import ChatMessage from "./ChatMessage";
import Picker from "emoji-picker-react";
import { useStateValue } from "../StateProvider";

function Chat() {
  const [emojiPicker, setEmojiPicker] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [message, setMessage] = useState("");
  const filePicker = useRef(null);

  //current room
  //eslint-disable-next-line
  const [{ user, currentRoom }, dispatch] = useStateValue();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onEmojiClick = (event, emojiObject) => {
    const message_ = message + emojiObject.emoji;
    setMessage(message_);
  };

  const handleChangeInput = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    console.log(message);
    dispatch({
      type: "ADD_MESSAGE",
      message: {
        user_email: user.email,
        user_name: user.name,
        text: message,
        created_at: new Date().toDateString(),
      },
    });
    setMessage("");
  };

  const renderMessages = () => {
    return currentRoom?.messages.map((msg, i) => {
      if (msg.user_email === user.email) {
        return (
          <ChatMessage
            name={msg.user_name}
            text={msg.text}
            created_at={msg.created_at}
            isReceiver={true}
            key={i}
          />
        );
      } else {
        return (
          <ChatMessage
            name={msg.user_name}
            text={msg.text}
            created_at={msg.created_at}
          />
        );
      }
    });
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={"http://localhost:4000/" + currentRoom?.room_image} />
        <div className="chat__headerInfo">
          <h4>{currentRoom?.room_name}</h4>
        </div>
        <div className="chat__headerIcons">
          {/* <IconButton>
            <SearchIcon />
          </IconButton> */}
          <IconButton
            onClick={() => {
              filePicker.current.click();
            }}
          >
            <AttachFileIcon />
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Room Info</MenuItem>
          </Menu>
        </div>
        <input hidden type="file" ref={filePicker} />
      </div>
      <div className="chat__body">{renderMessages()}</div>

      <div className="chat__footer">
        <div className="chat__emoji">
          <IconButton
            onClick={() => {
              setEmojiPicker(!emojiPicker);
            }}
          >
            <SentimentVerySatisfiedOutlinedIcon />
          </IconButton>
        </div>

        <form onSubmit={sendMessage}>
          <input value={message} onChange={handleChangeInput} type="text" />
          <IconButton type="submit">
            <TelegramIcon />
          </IconButton>
        </form>
      </div>
      <div className="emoji__picker" hidden={emojiPicker}>
        <Picker onEmojiClick={onEmojiClick} />
      </div>
    </div>
  );
}

export default Chat;
