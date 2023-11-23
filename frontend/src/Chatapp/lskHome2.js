import React from "react";
import { useState, useEffect, useRef } from "react";
// import { useRouter } from 'next/router'
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import {
  ChatCard,
  Message,
  AddNewChat,
  ModelAlert,
  Loading,
} from "./Components.js";

import Web3 from 'web3';
import axios from "axios";

import { AttachAsset } from "../Common/attachAsset.js";

import {getProfileData, fetchProfile, getBackground} from "../Common/readProfileFn.js";

import { Image } from 'semantic-ui-react'

import InputEmoji from 'react-input-emoji'

import MyHeader from '../Common/header.component';

import {config} from "../Common/config"

const DEFAULT_AVATAR = "logo.svg"

export default function LskHome() {
  const [friends, setFriends] = useState(null);
  const [myName, setMyName] = useState(null);
  const [myAvatar, setMyAvatar] = useState("");
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [myProfile, setMyProfile] = useState({});
  const [ msgText, setMsgText ] = useState('');
  const [ searchText, setSearchText ] = useState('');

  const [ loadingActive, setLoadingActive ] = useState(false);

  const [messagesEnd, setMyMessagesEnd] = useState(null);
  const [showAlert, setShowAlert] = useState({show : false, title: "Error", content: "Error"});
  const [ allUsers, setAllUsers ] = useState([])
  const [effectStep, setEffectStep] = useState(0);

  const [activeChat, setActiveChat] = useState({
    friendname: null,
    publicKey: null,
    userType: 1
  });
  const [activeChatMessages, setActiveChatMessages] = useState(null);
  const [showConnectButton, setShowConnectButton] = useState("block");

  const [myTimer, setMyTimer] = useState(0);

  async function afterStartup() {
    var address = localStorage.getItem("MyAddress");
    if (address) {
      try {        
        let myProfile = await getProfileData(address);
    
        let username;
        
        if (myProfile.name) {
          username = myProfile.name;

        } else {
          console.log("You do not have universal profile yet, please create one");
        }
        
        if (myProfile && myProfile.profileImage && myProfile.profileImage[0]) {
          setMyAvatar((myProfile.profileImage[0].url).replace("ipfs://", "https://ipfs.io/ipfs/"));
        }
        setMyName(username);
        setMyPublicKey(address);
        setShowConnectButton("none");
        
        loadFriends();

      } catch (err) {
        console.log(err);
      }
    }
  }

  async function addChat(publicKey) {
    try {
      setLoadingActive(true);

      try {

        var frProfile = await getProfileData(publicKey);

        if (!frProfile.name) {
          setShowAlert({show: true, title: "WARNING", content: "It seems your friend does not have Universal profile!"});
          setLoadingActive(false);
          return;
        }

        var frnd = { name: frProfile.name, publicKey: publicKey };

        const response = await axios.post(config.DATABASE+'/addfriend', {
          user1 : myPublicKey,
          user2: publicKey
        });

        frnd.profile = frProfile;
        var frAvatar = "";
        if (frProfile && frProfile.profileImage && frProfile.profileImage[0]) {
          frAvatar = (frProfile.profileImage[0].url).replace("ipfs://", "https://ipfs.io/ipfs/");
        }

        frnd.avatar = frAvatar;

        setFriends(friends.concat(frnd));

        setLoadingActive(false);

      } catch (err) {
        console.log(err);

        setLoadingActive(false);

        setShowAlert({show: true, title: "WARNING", content: "Friend already added!"});

      }
    } catch (err) {

      setLoadingActive(false);

      setShowAlert({show: true, title: "ERROR", content: "Your friend address is invalid"});

    }
  }

  // Sends messsage to an user
  async function sendMessage(msg) {
    if (!(activeChat && activeChat.publicKey)) return;
    try{
      setLoadingActive(true);

      const recieverAddress = activeChat.publicKey;
      
      await axios.post(config.DATABASE+'/addmessage', {
        fromUser : myPublicKey,
        toUser: recieverAddress,
        message : msg
      });
    
      await getMessage(activeChat.publicKey);
      setLoadingActive(false);
      scrollToBottom();

    }catch(e) {
      setLoadingActive(false);
      setShowAlert({show: true, title: "WARNING", content: "We can not send your messsage. ERROR:"+e.message});
    }
  }

  function getFriendInfor(friendsPublicKey) {
    for (var i in friends) {
      if (friends[i].publicKey === friendsPublicKey) {
        return friends[i];
      }      
    }

    return {name : "Unknown"};
  }

  // Fetch chat messages with a friend
  async function getMessage(friendsPublicKey) {
 
    if (!friends) {
      return;
    }

    let nickname;
    let avatar;
    let messages = [];
    friends.forEach((item) => {
      if (item.publicKey === friendsPublicKey) {
        nickname = item.name;
        avatar = item.avatar;
      }
    });

    const response = await axios.post(config.DATABASE+'/getallmessages', {
      fromUser : myPublicKey,
      toUser: friendsPublicKey
    });

    var data = response.data;

    data.forEach((item) => {
      const timeStamp = new Date(1000 * parseInt(item.timestamp)).toLocaleString();

      messages.push({
        publicKey: item.fromUser,
        timeStamp,
        data: item.message
      });
    });

    setActiveChat({ friendname: nickname, publicKey: friendsPublicKey, avatar });
    setActiveChatMessages(messages);

  }

  async function loadFriends() {

    let friendList = [];

    if(!myPublicKey) {
      return;
    }

    try {
      
      setLoadingActive(true);

      const response = await axios.post(config.DATABASE+'/getallfriends', {
				userAddress : myPublicKey
			});
      var data = response.data;

      data.forEach((item) => {
        friendList.push({ publicKey: item.fr });
      });

      for (var f in friendList) {
        var frProfile = await getProfileData(friendList[f].publicKey);
        friendList[f].profile = frProfile;
        friendList[f].name = frProfile.name;

        var frAvatar = "";
        if (frProfile && frProfile.profileImage && frProfile.profileImage[0]) {
          frAvatar = (frProfile.profileImage[0].url).replace("ipfs://", "https://ipfs.io/ipfs/");
        }

        friendList[f].avatar = frAvatar;
      }

      setFriends(friendList);
      
      setEffectStep(1);
      
      setLoadingActive(false);

    } catch (err) {
      console.log(err);
      setLoadingActive(false);

      setFriends([]);
    }

  }

  useEffect(() => {
    if (localStorage.getItem("MyAddress")) {
      afterStartup();
    } else {
      setMyName(undefined);
      setMyPublicKey(undefined);
      setShowConnectButton("block");
    }
    
  }, [myPublicKey]);

  const Messages = activeChatMessages
    ? activeChatMessages.map((message, index) => {
        let margin = "5%";
        let sender = activeChat.friendname;
        if (message.publicKey === myPublicKey) {
          margin = "36%";
          sender = "You";
        }
        return (
          <Message
            key={message.publicKey+message.timeStamp}
            marginLeft={margin}
            sender={activeChat.userType==1 || sender == "You" ? sender : getFriendInfor(message.publicKey).name}
            avatar={sender == "You" ? myAvatar :  getFriendInfor(message.publicKey).avatar}
            data={message.data}
            timeStamp={message.timeStamp}
          />
        );
      })
    : null;

  // Displays each card
  const chats = friends
    ? friends.map((friend) => {
        if (friend.name.toLowerCase().indexOf(searchText.toLowerCase())>-1 || friend.publicKey.toLowerCase().indexOf(searchText.toLowerCase())>-1) {
          return (
            <ChatCard
              key={friend.publicKey}
              publicKey={friend.publicKey}
              name={friend.name}
              avatar={friend.avatar}
              isFriend={true}
              fullProfile={friend}
              getMessages={async (key) => {
                await getMessage(key);
                scrollToBottom();
              }}
            />
          );
        }
      })
    : null;
  
  const onSendMsgText = async function(text) {
    setMsgText("");
    await sendMessage(text);
  }
  
  const refreshActiveMsg = function() {
      if (activeChat && activeChat.publicKey) {
        getMessage(activeChat.publicKey);
      }
  }

  useInterval(() => {
    refreshActiveMsg();
  }, 3000)

  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const scrollToBottom = function() {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ padding: "0px"}}>
      {/* This shows the navbar with connect button */}
      <ModelAlert 
        showAlert={showAlert}
        onHide={()=>{setShowAlert({show: false})}}
      ></ModelAlert>
      <Loading active={loadingActive}></Loading>


      <MyHeader onChangeAddress={(address) => {
          setMyPublicKey(address)
        }
      }></MyHeader>

      <Row style={{height: "100%", paddingTop : "58px"}}>
        {/* Here the friends list is shown */}
        <Col style={{ paddingRight: "0px", borderRight: "1px solid grey" }}>
          <div
            style={{
              backgroundColor: "#cac9c9",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Row style={{ marginRight: "0px" }}>
              <Card
                style={{
                  width: "100%",
                  alignSelf: "center",
                  marginLeft: "15px",
                }}
              >
                <Card.Header>
                  <Form.Control
                    required
                    size="text"
                    type="text"
                    placeholder="Search or start new chat"
                    onChange={(e)=>{setSearchText(e.target.value)}}
                  />
                </Card.Header>
              </Card>
            </Row>
            <div
              style={{ height: "calc(100vh - 186px)", overflowY: "auto", paddingTop: "2mm" }}
            >
              {chats}

            </div>
            <div style={{ display: "flex", paddingTop: "10px" }}>
              <AddNewChat
                addHandler={(publicKey) => addChat(publicKey)}
              />
            </div>
          </div>
        </Col>
        <Col xs={8} style={{ paddingLeft: "0px" }}>
          <div style={{ backgroundColor: "#DCDCDC", height: "100%" }}>
            <Row style={{ marginRight: "0px" }}>
              <Card
                style={{
                  width: "100%",
                  alignSelf: "center",
                  margin: "0 0 0 15px",
                }}
              >
                <Card.Header>
                  {
                    activeChat.publicKey 
                    ? <div style={{height: "33px", display: "flex"}}>
                        <div>
                          <Image src={activeChat.avatar} avatar /> 
                          <span style={{padding: "3px"}}>{activeChat.friendname} : {activeChat.publicKey}</span>
                        </div>
                        {
                          <></>
                        }
                      </div>
                    : <><div style={{height: "33px"}}></div></>
                  }
                </Card.Header>
              </Card>
            </Row>

            <div
              className="MessageBox"
              style={{ ...getBackground(), height: "calc(100vh - 186px)", overflowY: "auto" }}
            >
              {Messages}
              <div style={{ float:"left", clear: "both" }}
                ref={(el) => { setMyMessagesEnd(el); }}>
              </div>
            </div>

            <div
              className="SendMessage"
              style={{
                borderTop: "1px solid gray",
                position: "relative",
                bottom: "0px",
                padding: "10px",
                margin: "0 95px 0 0",
                width: "100%",
              }}
            >
              <Form>
                <Form.Row className="align-items-center">
                  <Col xs={11}>
                    <InputEmoji
                      placeholder={"Type your message.."}
                      value={msgText}
                      onChange={setMsgText}
                      onEnter={onSendMsgText}
                    />
                  </Col>
                  <Col xs={1}>
                    {activeChat
                      ? <AttachAsset
                          name={myName}
                          address={myPublicKey}
                          currActivFriend={activeChat}
                          sendNoti={onSendMsgText}
                          setLoadingActive={setLoadingActive}
                        />
                      : <></>}
                  </Col>
                </Form.Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}