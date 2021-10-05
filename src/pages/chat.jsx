/* eslint-disable array-callback-return */
import React, {useEffect, useState} from "react";
import socket from "../config/socket";
import { GET_DETAIL_USER, GET_ALL_USER, GET_DETAIL_BY_NAME, UPDATE_USER, UPDATE_PW } from "../redux/actions/users"
import '../css/chat/body.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector, useDispatch } from "react-redux"
import { API_URL } from "../helper/env";
import { useHistory } from "react-router";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import { HiMenuAlt1 } from "@react-icons/all-files/hi/HiMenuAlt1";
import { BiSearch } from "@react-icons/all-files/bi/BiSearch";
import { AiOutlinePlus } from "@react-icons/all-files/ai/AiOutlinePlus";
// import { BsCheckAll } from "@react-icons/all-files/bs/BsCheckAll";

const Chat = (props) => {
  const [msg, setMsg] =useState("")
  const [listMsg, setListMsg] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [receiver, setReceiver]= useState('');
  const [listMsgHistory, setListMsgHistory]= useState([]);
  const [toggle, setToggle]= useState(true)
  const [input, setInput]= useState(false)
  const [setting, toggleSetting]=useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const history = useHistory()
  const toggleDrop = () => setDropdownOpen(prevState => !prevState);
  const [width, setWidth]= useState({
    chat:'100%',
    profile:'none'
  })
  // const [read, setRead]= useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const detail = user.getDetail
  const detailByName = user.getDetailByName
  const id = detail.id
  const getData = (data) =>{
    dispatch(GET_DETAIL_USER())
    dispatch(GET_DETAIL_BY_NAME(data))
    dispatch(GET_ALL_USER())
  }
  socket.emit('login', detail.username);
  useEffect(() => {
    getData()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [updData, setUpd]=useState({})
  const changeReceiver = (username) => {
    setReceiver(username);
    getData(username)
    socket.emit('get-message', { receiver: username, sender: detail.username})
    setListMsg([]);
    socket.on('history-messages', (payload) => {
      setListMsgHistory(payload);
    })
  }
  const setChange=(event)=>{
    setUpd({
      ...updData,
      [event.target.name]: event.target.value,
    })
  }
  const setFile = (event)=>{
    setUpd({
      ...updData,
      img: event.target.files[0]
    })
  }
  const updateUser=(event)=>{
    event.preventDefault();
    const {img, username, phone, tag, bio}=updData
    const formData = new FormData()
    formData.append("img", !img?user.img:img)
    formData.append("username", !username?updData.username: username)
    formData.append("phone", !phone?updData.phone: phone)
    formData.append("tag", !tag?updData.tag:tag)
    formData.append("bio", !bio?updData.bio:bio)
    UPDATE_USER(formData, id).then((response) => {
      alert(response.data.message)
    }).catch((err) =>{
      alert(err)
    })
  }
  const widthmenu=()=>{
    if(!toggle){
      setWidth({
        chat:'100%',
        profile:'none'
      })
      setToggle(true)
    } else {
      setWidth({
        chat:'70%',
        profile:'flex'
      })
      setToggle(false)
    }
  }
  const logout=()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('img')
    history.push('/')
  }
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send-message', {
      sender: detail.username,
      receiver,
      msg
    });
    setListMsg([
      ...listMsg,
      {
        sender: detail.username,
        receiver,
        msg
      }
    ])
    setMsg('');
  };
  useEffect(() => {
    socket.on('list-message', (payload) =>{
      setListMsg([...listMsg, payload])
    })
  })
  useEffect(()=> {
    setListUser(user.getAll)
    setUpd({
      img: detail.img,
      username: detail.username,
      phone: detail.phone_number,
      tag: detail.tag_name,
      bio: detail.bio,
    })
  }, [user, detail])
  return (
    <body  style={{width:'auto',display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'khaki', padding:'0'}}>
      <div className="container-fluid p-0">
        <div className="row bg-info p-0 m-0">
          <aside className="col-lg-3 p-0">
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
                <input type="text" placeholder="Type your message..." />
                </div>
                <AiOutlinePlus className="plus" />
              </div>
              {listUser.length <= 0 ?(
                <h1>User Not Found</h1>
              ): (
                listUser.map((e, i) => {
                  if(e.username !== detail.username){
                    return (
                      <div className="listuser" key={i} style={{display:'flex'}}>
                        <img src={API_URL+e.img} alt="" srcset="" />
                        <p onClick={() => changeReceiver(e.username)} style={{cursor:'pointer'}} >{e.username}</p>
                      </div>
                    )
                  }
                })
              )}
              </div>
            ):(
              <form className='settinguser'>
                <nav className='profile'>
                  <p style={{cursor:'pointer', width:'40%'}} onClick={()=>toggleSetting(!toggle)}><strong>{'<'}</strong></p>
                  <p onClick={updateUser} style={{cursor:'pointer', width:'60%', paddingLeft:'0'}}>{detail.tag_name}</p>
                </nav>
                <div className='box'>
                  <Input type="file" id="file-input" className="select" onChange={setFile}>
                  </Input>
                  <label for="file-input">
                    <img for="file-input" src={API_URL+updData.img} alt="" srcset="" />
                  </label>
                  <div className='textbox' style={{alignItems:'center'}}>
                    <input type="text" style={{textAlign:'center'}} name="username" value={updData.username} onChange={setChange}/>
                    <p style={{fontSize:'16px', fontWeight:'400', color:'#848484'}}>{detail.tag_name}</p>
                  </div>
                  <div className='textbox' style={{height:'100px',borderBottom:'solid 1px #F6F6F6'}}>
                    <p style={{fontSize:'19px', marginBottom:'5px'}}>Account</p>
                    {input?(
                      <input type="text" name="phone" style={{fontSize:'16px', fontWeight:'400', color:'#848484'}} value={updData.phone} onChange={setChange}/>
                    ):(
                      <p style={{fontSize:'16px', fontWeight:'400', color:'#848484'}}>{detail.phone_number}</p>
                    )}
                    <p onClick={()=>setInput(!input)} style={{fontSize:'16px', fontWeight:'400',color:'#7E98DF', cursor:'pointer'}}>Tap to change phone number</p>
                  </div>
                  <div className='textbox' style={{height:'65px',borderBottom:'solid 1px #F6F6F6'}}>
                    <input type="text" name="tag" style={{fontSize:'16px', fontWeight:'500'}} value={updData.tag} onChange={setChange}/>
                    <p style={{fontSize:'16px', fontWeight:'400',}}>Username</p>
                  </div>
                  <div className='textbox'>
                    <textarea type="text" name="bio" value={updData.bio} onChange={setChange} />
                    <p style={{fontSize:'16px', fontWeight:'400',}}>Bio</p>
                  </div>
                  <div className='textbox'>
                    <p style={{fontSize:'19px', fontWeight:'500',}}>Setting</p>
                    <div className='menu' style={{cursor:'pointer'}}>
                      <div className='imgbox'>
                        <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/lock.png" alt="" srcset="" />
                      </div>
                      <p>Change Password</p>
                    </div>
                    <div className='menu' onClick={logout} style={{cursor:'pointer'}}>
                      <div className='imgbox'>
                        <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/Chat.png" alt="" srcset="" />
                      </div>
                      <p>Logout</p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </aside>
          <section className="col-lg-9 p-0 sec" style={{ border:'solid 1px #E5E5E5'}}>
            <div className='chatrow' style={{width:width.chat}}>
              {receiver?(
                <nav className='chatnav'>
                  <img src={API_URL+detailByName.img} alt="" srcset="" />
                  <div className='textbox'>
                  <p>{receiver}</p>
                  </div>
                  <img onClick={widthmenu} className='menu' src="https://raw.githubusercontent.com/farizian/chatting/master/img/Profile_menu.png" alt="" srcset="" />
                </nav>
              ):(
                <nav className='chatnav' style={{backgroundColor:'transparent'}}></nav>
              )}
              <div className="chatbox" style={{ width:"100%", height: "69vh", overflow: "scroll" }}>
              {receiver?
              listMsgHistory.map((e, i) => {
                  if(e.receiver === receiver || e.sender === receiver) {
                    return (
                      <div key={i}>
                        {e.sender === detail.username ? 
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                            <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}}>
                              <p>{e.text_msg}</p>
                            </div>
                            <img style={{marginLeft:'20px'}} src={API_URL+detail.img} alt="" srcset="" />
                          </div>): 
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                            <img style={{marginRight:'20px'}} src={API_URL+detailByName.img} alt="" srcset="" />
                            <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                              <p>{e.text_msg}</p>
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
                        {e.sender === detail.username ?
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                            <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}}>
                              <p>{e.msg}</p>
                            </div>
                            <img style={{marginLeft:'20px'}} src={API_URL+detail.img} alt="" srcset="" />
                          </div>):
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                            <img style={{marginRight:'20px'}} src={API_URL+detailByName.img} alt="" srcset="" />
                            <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                              <p>{e.msg}</p>
                            </div>
                          </div>)}
                      </div>
                    )
                  }
                })}
              
              </div>
              {receiver ? (
                <div className='sendbox'>
                  <div className="send">
                    <form onSubmit={sendMessage}>
                      <input type="text"
                      value={msg}
                      placeholder="Type your message..."
                      onChange={(e) =>setMsg(e.target.value)}/>
                    </form>
                    <div className='rowbox'>
                    <div className='imgbox'>
                    <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/Plus.png" alt="" srcset="" />
                    </div>
                    <div className='imgbox'>
                    <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/sticker.png" alt="" srcset="" />
                    </div>
                    <div className='imgbox'>
                    <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/photobox.png" alt="" srcset=""/>
                    <img className="round" src="https://raw.githubusercontent.com/farizian/chatting/master/img/Ellipse%2021.png" alt="" srcset="" />
                    </div>
                    </div>
                  </div>
                </div>
              ):(
                <div className='sendbox'></div>
              )}
              
            </div>
            <div className='profilesender' style={{display:width.profile}}>
              <nav className='navprofile'>
                <p><strong style={{cursor:'pointer'}} onClick={widthmenu}>{'<'}</strong>{detailByName.tag_name}</p>
              </nav>
              <div className='profilebox'>
                <img src={API_URL+detailByName.img} alt="" srcset="" />
                <div className='textbox'>
                  <p>{detailByName.username}</p>
                </div>
                <div className='textbox'>
                  <p style={{fontSize:'19px'}}>Phone number</p>
                  <p style={{fontSize:'16px', fontWeight:'400'}}>{detailByName.phone_number}</p>
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