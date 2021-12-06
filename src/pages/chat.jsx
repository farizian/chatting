/* eslint-disable array-callback-return */
import React, {useEffect, useState} from "react";
import socket from "../config/socket";
import { GET_DETAIL_USER, GET_ALL_USER, GET_DETAIL_BYID } from "../redux/actions/users"
// import { LISTMESSAGE, HISTORYMESSAGE, DELETEMESSAGE, USER_ONLINE } from "../redux/actions/chat";
import '../css/chat/body.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector, useDispatch } from "react-redux"
import { API_URL } from "../helper/env";
// import { useHistory } from "react-router";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { HiMenuAlt1, HiOutlineTrash } from "react-icons/hi"
import { IoIosArrowBack } from 'react-icons/io'
import { BiSearch } from "@react-icons/all-files/bi/BiSearch";
import { RiSendPlaneFill } from 'react-icons/ri'
import { FaCircle } from 'react-icons/fa'
import { AiOutlinePlus } from "@react-icons/all-files/ai/AiOutlinePlus";
import Usersetting from "../component/asidemenu";
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = (props) => {
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
  // const [input, setInput]= useState(false)
  const [setting, toggleSetting]=useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const history = useHistory()
  const toggleDrop = () => setDropdownOpen(prevState => !prevState);
  const [width, setWidth]= useState({
    chat:'100%',
    profile:'none'
  })
  // const [read, setRead]= useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  // const chat = useSelector((store) => store.chat);
  const detail = user.getDetail
  const detailById = user.getDetailById
  const getData = (data) =>{
    dispatch(GET_DETAIL_USER())
    dispatch(GET_DETAIL_BYID(data))
    dispatch(GET_ALL_USER())
    
    
  }
  socket.emit('login', detail.id);
 
  useEffect(() => {
    getData()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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
    socket.emit('get-message', { receiver: id, sender: detail.id})
    socket.on('history-messages', (payload) => {
      setListMsgHistory(payload)
    })
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
  // setelah user klik send chat
  const sendMessage = (e) => {
    e.preventDefault();
    // pesan di tampung di data
    const data = {
      sender: detail.id,
      receiver: receiver,
      msg: msg
    }
    // dikirim ke be untuk di simpan di database dalam bentuk history pesan dan di simpan di data sementara untuk di tampilkan di receiver
    socket.emit('send-message', {
      sender: detail.id,
      receiver,
      msg: msg
    });
    // di set pesan sementara berdasarkan data untuk di tampilkan di sender
    setListMsg([...listMsg, data])
    // state penampung kalimat pesan di kosongkan
    setMsg('');
    // kosongkan notif ketika selesai mengirim chat
    setNotif({})
  };
  // proses delete chat
  const handleDeleteChat = (id) => {
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
  
  const delBtn = (id) => {
    console.log(id)
    if(toggleDel===""){
      setToggleDel(id)
    } else {
      setToggleDel("")
    }
  }
  const logOut = () => {
    // socket.emit('offline', detail.id)
    // localStorage.removeItem('id')
    // setOn([])
  }
  const getHist = () => {
    socket.on("history-messages", async(data) => {
      await setListMsgHistory(data)
      setListMsg([])
      setNotif([])
    })
  }
  useEffect(() => {
    // tampilkan pesan sementara yang di peroleh di be untuk di tampilkan di receiver
    socket.on('list-message', (payload) =>{
      console.log(payload)
      setListMsg([...listMsg, payload])
      setNotif({
        sender: payload.sender,
        receiver: payload.receiver,
        msg: payload.msg
      })
    })
    // socket.emit('broadcast', detail.id)
    
    
  }, [listMsg])
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(GET_ALL_USER(search))
  };

  useEffect(()=> {
    setListUser(user.getAll)
    // socket.on('get-online-broadcast', (payload) => {
    //   setOn(payload)
    // })
    getHist()
  }, [user, detail, userOn, listMsgHistory])

  return (
    <body  style={{width:'auto',display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'khaki', padding:'0'}}>
      <div className="container-fluid p-0">
        <div className="row bg-info p-0 m-0">
          <aside className={`col-lg-3 p-0 ${displayAsd}`}>
            {!setting?(
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
              {receiver?(
                <nav className='chatnav'>
                  <IoIosArrowBack style={{fontSize:'50px', marginRight:'10px', color:'#7E98DF', cursor:'pointer'}} onClick={toggleMsg}/>
                  <img src={API_URL+detailById.img} alt="" srcset="" />
                  <div className='textbox'>
                  <p>{detailById.username}</p>
                  </div>
                  <img onClick={widthmenu} className='menu' src="https://raw.githubusercontent.com/farizian/chatting/master/img/Profile_menu.png" alt="" srcset="" />
                </nav>
              ):(
                <nav className='chatnav' style={{backgroundColor:'transparent'}}></nav>
              )}
              <ScrollToBottom className="chatbox">
              {receiver?
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
                }):(
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
                {listMsg.map((e, i) => {
                  if(e.receiver === receiver || e.sender === receiver) {
                    return (
                      <div key={i}>
                        {e.sender === detail.id ?
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                            <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}} >
                              <p style={{margin:'0', cursor:'pointer'}} onClick={()=>delBtn(e.msg)}>{e.msg}</p>
                              {toggleDel===e.msg?<HiOutlineTrash color="white" style={{marginLeft:'7px', cursor:'pointer'}} onClick={()=>handleDeleteChat()}/>:null}
                            </div>
                            <img style={{marginLeft:'20px'}} src={API_URL+detail.img} alt="" srcset="" />
                          </div>):
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                            <img style={{marginRight:'20px'}} src={API_URL+detailById.img} alt="" srcset="" />
                            <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                              <p style={{margin:'0'}}>{e.msg}</p>
                            </div>
                          </div>)}
                      </div>
                    )
                  }
                })}
              </ScrollToBottom>
              {receiver ? (
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
          </section>
        </div>
      </div>
    </body>
  )
}

export default Chat