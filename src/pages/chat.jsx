/* eslint-disable array-callback-return */
import React, {useEffect, useState} from "react";
import socket from "../config/socket";
import { GET_DETAIL_USER, GET_ALL_USER, GET_DETAIL_BYID } from "../redux/actions/users"
import '../css/chat/body.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector, useDispatch } from "react-redux"
import { API_URL } from "../helper/env";
import { useHistory, useLocation } from "react-router";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { HiMenuAlt1, HiOutlineTrash } from "react-icons/hi"
import { IoIosArrowBack } from 'react-icons/io'
import { BiSearch } from "@react-icons/all-files/bi/BiSearch";
import { RiSendPlaneFill } from 'react-icons/ri'
import { FaCircle } from 'react-icons/fa'
import { AiOutlinePlus } from "@react-icons/all-files/ai/AiOutlinePlus";
import Usersetting from "../component/asidemenu";
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get query parameters for room-based chat
  const query = new URLSearchParams(location.search);
  const roomId = query.get('roomId');
  const username = query.get('username');
  const isRoomChat = roomId && username;

  const [msg, setMsg] =useState("")
  const [listMsg, setListMsg] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [receiver, setReceiver]= useState('');
  const [userOn, setOn]= useState([])
  const [notif, setNotif]= useState({})
  const [listMsgHistory, setListMsgHistory]= useState([]);
  const [toggle, setToggle]= useState(true)
  const [toggleDel, setToggleDel]= useState("")
  const [search, setSearch] = useState();
  const [setting, toggleSetting]=useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDrop = () => setDropdownOpen(prevState => !prevState);
  const [width, setWidth]= useState({
    chat:'100%',
    profile:'none'
  })
  const user = useSelector(state => state.user)
  const detail = user.getDetail
  const detailById = user.getDetailById

  const getData = (data) =>{
    if(!isRoomChat) {
      dispatch(GET_DETAIL_USER())
      if(data) dispatch(GET_DETAIL_BYID(data))
      dispatch(GET_ALL_USER())
    }
  }

  useEffect(() => {
    if(isRoomChat) {
      // Room-based chat setup
      socket.emit('login', roomId);
      setListMsg([]);
    } else {
      // Regular user chat setup
      const token = localStorage.getItem("token");
      if(!token) {
        history.push('/');
        return;
      }
      getData();
    }
  }, [isRoomChat, roomId])

  useEffect(() => {
    if(!isRoomChat && detail.id) {
      socket.emit('login', detail.id);
    }
  }, [detail.id, isRoomChat])

  // Socket event listeners
  useEffect(() => {
    if(isRoomChat) {
      // Room-based chat listeners
      socket.on('get-message-private', (payload) => {
        if(payload.username !== username) {
          setListMsg(prevList => [...prevList, payload])
        }
      })
    } else {
      // Regular chat listeners
      socket.on('list-message', (payload) =>{
        setListMsg(prevList => [...prevList, payload])
        setNotif({
          sender: payload.sender,
          receiver: payload.receiver,
          msg: payload.msg
        })
      })
      
      // History messages listener
      socket.on("history-messages", (data) => {
        setListMsgHistory(data)
        setListMsg([])
        setNotif({})
      })
    }
    
    return () => {
      socket.off('get-message-private');
      socket.off('list-message');
      socket.off('history-messages');
    }
  }, [isRoomChat, username, listMsg])

  const widthmenu=()=>{
    const mediaMatch = window.matchMedia('(max-width: 576px)');
    if(!toggle){
      if(mediaMatch.matches){
        setWidth({
          chat:'100%',
          profile:'none'
        })
        setToggle(true)
      } else {
        setWidth({
          chat:'100%',
          profile:'none'
        })
        setToggle(true)
      }
    } else {
      if(mediaMatch.matches){
        setWidth({
          chat:'0',
          profile:'flex'
        })
        setDisplaySec2("")
        setToggle(false)
      } else {
        setWidth({
          chat:'70%',
          profile:'flex'
        })
        setDisplaySec2("")
        setToggle(false)
      }
    }
  }
  const changeReceiver = (id) => {
    setReceiver(id);
    getData(id)
    setListMsg([]);
    setNotif({})
    toggleMsg()
    if(!isRoomChat) {
      socket.emit('get-message', { receiver: id, sender: detail.id})
    }
  }

  const [displayAsd, setDisplayAsd] = useState("d-block")
  const [displaySec, setDisplaySec] = useState("")
  const [displaySec2, setDisplaySec2] = useState("d-none")
  const toggleMsg = () => {
    const mediaMatch = window.matchMedia('(max-width: 576px)');
    if(mediaMatch.matches && displayAsd === "d-block"){
      setDisplayAsd("d-none")
      setDisplaySec2("d-block")
    } else if (mediaMatch.matches && displayAsd === "d-none") {
      setDisplayAsd("d-block")
      setDisplaySec2("d-none")
    }
  }

  // Send message function
  const sendMessage = (e) => {
    e.preventDefault();
    
    if(msg.trim() === '') return;

    if(isRoomChat) {
      // Room-based chat flow
      const data = {
        username: username,
        roomId: roomId,
        msg: msg
      }
      socket.emit('send-message-private', data);
      setListMsg(prevList => [...prevList, data])
    } else {
      // Regular user chat flow
      const data = {
        sender: detail.id,
        receiver: receiver,
        msg: msg
      }
      socket.emit('send-message', {
        sender: detail.id,
        receiver,
        msg: msg
      });
      setListMsg(prevList => [...prevList, data])
    }
    
    setMsg('');
    setNotif({})
  };

  const handleDeleteChat = (id) => {
    if(!isRoomChat) {
      const payload = {
        idMsg: id,
        sender: detail.id,
        receiver: receiver
      }
      try {
        socket.emit("deleteMessage", payload)
        setToggleDel(!toggleDel)
      } catch (err) {
        console.log(err)
      }
    }
  }
  
  const delBtn = (id) => {
    console.log(id)
    if(toggleDel===""){
      setToggleDel(id)
    } else {
      setToggleDel("")
    }
  }
  const logOut = () => {
    if(isRoomChat) {
      history.push('/?room=true');
    } else {
      socket.emit('offline', detail.id);
      localStorage.removeItem('token');
      localStorage.removeItem('img');
      localStorage.removeItem('id');
      history.push('/');
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(GET_ALL_USER(search))
  };

  useEffect(()=> {
    if(!isRoomChat) {
      setListUser(user.getAll)
    }
  }, [user, detail, userOn, listMsgHistory, isRoomChat])

  return (
    <body  style={{width:'auto',display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'khaki', padding:'0'}}>
      <div className="container-fluid p-0">
        <div className="row bg-info p-0 m-0">
          <aside className={`col-lg-3 p-0 ${displayAsd}`}>
            {!setting?(
              isRoomChat ? (
                // Room chat sidebar
                <div className='userlist px-4 py-4'>
                  <nav>
                    <h3 style={{textAlign:'left', width:'92%'}}>Room: {roomId}</h3>
                    <button 
                      onClick={logOut}
                      style={{
                        backgroundColor:'#7E98DF', 
                        color:'white', 
                        border:'none', 
                        borderRadius:'10px',
                        padding:'5px 10px',
                        cursor:'pointer'
                      }}
                    >
                      Leave
                    </button>
                  </nav>
                  <div style={{marginTop:'20px', textAlign:'center'}}>
                    <p>Welcome, {username}!</p>
                    <p>You are in room: {roomId}</p>
                  </div>
                </div>
              ) : (
                // Regular user chat sidebar
              <div className='userlist px-4 py-4'>
              <nav>
              <h3 style={{textAlign:'left', width:'92%'}}>Chatting</h3>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDrop}>
                <DropdownToggle style={{backgroundColor:'transparent', padding:'0', border:'none'}}>
                  <HiMenuAlt1 style={{width:'30px', height:'40px', color:'#7E98DF'}}/>
                </DropdownToggle>
                <DropdownMenu className='dropmenu' right>
                  <DropdownItem onClick={()=>toggleSetting(toggle)}className='dropitem'>
                    <div className='imgbox'>
                      <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/Settings.png" alt="" srcset="" />
                    </div>
                    <p>Settings</p>
                  </DropdownItem>
                  <DropdownItem className='dropitem'>
                    <div className='imgbox'>
                      <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/Contacts.png" alt="" srcset="" />
                    </div>
                    <p>Contacts</p>
                  </DropdownItem>
                  <DropdownItem className='dropitem'>
                    <div className='imgbox'>
                      <img style={{width:'25px'}} src="https://raw.githubusercontent.com/farizian/chatting/master/img/Invite%20friends.png" alt="" srcset="" />
                    </div>
                    <p>Invite Friends</p>
                  </DropdownItem>
                  <DropdownItem className='dropitem'>
                    <div className='imgbox'>
                      <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/FAQ.png" alt="" srcset="" />
                    </div>
                    <p>Telegram FAQ</p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              </nav>
              <div className="searchbox" style={{display:'flex', width:'100%'}}>
                <div className="box" style={{display:'flex', width:'90%'}}>
                <BiSearch className="src"/>
                <input type="text" placeholder="Type your search..." onChange={(e) => setSearch(e.target.value)} />
                </div>
                <AiOutlinePlus className="plus" onClick={handleSearch}/>
              </div>
              {listUser.length <= 0 ?(
                <h1>User Not Found</h1>
              ): (
                listUser.map((e, i) => {
                  if(e.id !== detail.id){
                    return (
                      <div onClick={() => changeReceiver(e.id)} className="listuser" key={i} style={{cursor:'pointer',display:'flex'}}>
                        <img src={API_URL+e.img} alt="" srcset="" />
                        <div className="d-flex flex-column">
                        <p style={{marginBottom:'5px'}} >{e.username}
                        {/* {userOn.includes(`${e.id}`)?<FaCircle style={{color:'lightgreen', fontSize:'10px', marginLeft:'10px'}}/>:null} */}
                        </p>
                        {notif.sender === e.id?<p style={{overflow:'hidden', textOverflow:'ellipsis', width:'70px', height:'30px', margin:'0'}}>{notif.msg}</p>:null}
                        </div>
                      </div>
                    )
                  }
                })
              )}
              </div>
              )
            ):(
              <Usersetting
              detail={detail}
              toggleSetting={toggleSetting}
              toggle={toggle}
              getData={getData}
              userOn={userOn}
              setOn={logOut}/>
            )}
          </aside>
          <section className={`col-lg-9 p-0 sec ${window.matchMedia('(max-width: 576px)').matches?displaySec2:displaySec}`} style={{ border:'solid 1px #E5E5E5'}}>
            <div className='chatrow' style={{width:width.chat}}>
              {(receiver || isRoomChat)?(
                <nav className='chatnav'>
                  <IoIosArrowBack style={{fontSize:'50px', marginRight:'10px', color:'#7E98DF', cursor:'pointer'}} onClick={toggleMsg}/>
                  {!isRoomChat && <img src={API_URL+detailById.img} alt="" srcset="" />}
                  <div className='textbox'>
                    <p>{isRoomChat ? `Room: ${roomId}` : detailById.username}</p>
                  </div>
                  {!isRoomChat && <img onClick={widthmenu} className='menu' src="https://raw.githubusercontent.com/farizian/chatting/master/img/Profile_menu.png" alt="" srcset="" />}
                </nav>
              ):(
                <nav className='chatnav' style={{backgroundColor:'transparent'}}></nav>
              )}
              <ScrollToBottom className="chatbox">
              {!isRoomChat && receiver && 
              listMsgHistory.map((e, i) => {
                  if(e.receiver === receiver || e.sender === receiver) {
                    return (
                      <div key={i}>
                        {e.sender === detail.id ?
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                            <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}} >
                              <p style={{margin:'0', cursor:'pointer'}} onClick={()=>delBtn(e.id)}>{e.text_msg}</p>
                              {toggleDel===e.id?<HiOutlineTrash color="white" style={{marginLeft:'7px', cursor:"pointer"}} onClick={()=>handleDeleteChat(e.id)}/>:null}
                            </div>
                            <img style={{marginLeft:'20px'}} src={API_URL+detail.img} alt="" srcset="" />
                          </div>):
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                            <img style={{marginRight:'20px'}} src={API_URL+detailById.img} alt="" srcset="" />
                            <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                              <p style={{margin:'0'}}>{e.text_msg}</p>
                            </div>
                          </div>)}
                      </div>
                    )
                  }
                })}
              {!isRoomChat && !receiver && (
                  <div style={{
                    width:'100%',
                    height:'300px',
                    display:'flex',
                    alignItems:'center',
                    paddingTop:'40px'
                  }}>
                  <p style={{
                    width:'100%',
                    margin:'0',
                    textAlign:'center',
                    fontSize:'24px',
                    fontWeight:'400',
                    color:'#848484'
                  }}>Please select a chat to start messaging</p>
                  </div>
                )}
                {isRoomChat && listMsg.length === 0 && (
                  <div style={{
                    width:'100%',
                    height:'300px',
                    display:'flex',
                    alignItems:'center',
                    paddingTop:'40px'
                  }}>
                  <p style={{
                    width:'100%',
                    margin:'0',
                    textAlign:'center',
                    fontSize:'24px',
                    fontWeight:'400',
                    color:'#848484'
                  }}>Start chatting in room {roomId}!</p>
                  </div>
                )}
                {listMsg.map((e, i) => {
                  if(isRoomChat || e.receiver === receiver || e.sender === receiver) {
                    return (
                      <div key={i}>
                        {(isRoomChat ? e.username === username : e.sender === detail.id) ?
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                            <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}} >
                              <p style={{margin:'0', cursor:'pointer'}} onClick={()=>delBtn(isRoomChat ? e.msg : e.msg)}>{e.msg}</p>
                              {!isRoomChat && toggleDel===e.msg?<HiOutlineTrash color="white" style={{marginLeft:'7px', cursor:'pointer'}} onClick={()=>handleDeleteChat()}/>:null}
                            </div>
                            {!isRoomChat && <img style={{marginLeft:'20px'}} src={API_URL+detail.img} alt="" srcset="" />}
                            {isRoomChat && (
                              <div style={{marginLeft:'20px', width:'54px', height:'54px', borderRadius:'20px', backgroundColor:'#7E98DF', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <span style={{color:'white', fontWeight:'bold'}}>{username.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>):
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                            {!isRoomChat && <img style={{marginRight:'20px'}} src={API_URL+detailById.img} alt="" srcset="" />}
                            {isRoomChat && (
                              <div style={{marginRight:'20px', width:'54px', height:'54px', borderRadius:'20px', backgroundColor:'#848484', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <span style={{color:'white', fontWeight:'bold'}}>{e.username.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                            <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                              <p style={{margin:'0'}}>
                                {isRoomChat && <strong>{e.username}: </strong>}
                                {e.msg}
                              </p>
                            </div>
                          </div>)}
                      </div>
                    )
                  }
                })}
              </ScrollToBottom>
              {(receiver || isRoomChat) ? (
                <div className='sendbox'>
                  <div className="send">
                    <form onSubmit={sendMessage}>
                      <input type="text"
                      value={msg}
                      placeholder="Type your message..."
                      onChange={(e) =>setMsg(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' ? sendMessage(e):null}/>
                    </form>
                    <div className='rowbox'>
                      <RiSendPlaneFill onClick={sendMessage} style={{color:'#7E98DF', fontSize:'40px', cursor:'pointer'}}/>
                    </div>
                  </div>
                </div>
              ):(
                <div className='sendbox'></div>
              )}
              
            </div>
            {!isRoomChat && (
            <div className='profilesender' style={{display:width.profile}}>
              <nav className='navprofile'>
                <p><strong style={{cursor:'pointer'}} onClick={widthmenu}>{'<'}</strong>{detailById.tagName}</p>
              </nav>
              <div className='profilebox'>
                <img src={API_URL+detailById.img} alt="" srcset="" />
                <div className='textbox'>
                  <p>{detailById.username}</p>
                </div>
                <div className='textbox'>
                  <p style={{fontSize:'19px'}}>Phone number</p>
                  <p style={{fontSize:'16px', fontWeight:'400'}}>{detailById.phone}</p>
                </div>
                <div className='textbox'>
                  <p style={{fontSize:'19px'}}>Bio</p>
                  <p style={{fontSize:'16px', fontWeight:'400'}}>{detailById.bio}</p>
                </div>
              </div>
            </div>
            )}
          </section>
        </div>
      </div>
    </body>
  )
}

export default Chat