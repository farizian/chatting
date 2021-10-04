/* eslint-disable array-callback-return */
import React, {useEffect, useState} from "react";
import socket from "../config/socket";
import { GET_DETAIL_USER, GET_ALL_USER, GET_DETAIL_BY_NAME} from "../redux/actions/users"
import '../css/chat/body.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector, useDispatch } from "react-redux"
import { API_URL } from "../helper/env";
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
  const [width, setWidth]= useState({})
  // const [read, setRead]= useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const detail = user.getDetail
  const detailByName = user.getDetailByName
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
  const changeReceiver = (username) => {
    setReceiver(username);
    getData(username)
    socket.emit('get-message', { receiver: username, sender: detail.username})
    setListMsg([]);
    socket.on('history-messages', (payload) => {
      setListMsgHistory(payload);
    })
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
  }, [user])
  return (
    <body  style={{width:'auto',display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'khaki', padding:'0'}}>
      <div className="container-fluid p-0">
        <div className="row bg-info p-0 m-0">
          <aside className="col-lg-3 px-4 py-4">
            <nav>
            <h3 style={{textAlign:'left', width:'92%'}}>Chatting</h3>
            <HiMenuAlt1 style={{width:'22px', height:'40px', backgroundColor:'lightcoral'}}/>
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
          </aside>
          <section className="col-lg-9 p-0 sec" style={{display:'flex', flexDirection:'column', border:'solid 1px #E5E5E5'}}>
            <div className='chatrow'>
              {listMsgHistory.length>0||listMsg.length>0?(
                <nav className='chatnav'>
                  <img src={API_URL+detailByName.img} alt="" srcset="" />
                  <div className='textbox'>
                  <p>{receiver}</p>
                  </div>
                </nav>
              ):(
                <nav className='chatnav' style={{backgroundColor:'transparent'}}></nav>
              )}
              
              <div className="chatbox" style={{ width:"100%", height: "69vh", overflow: "scroll" }}>
              {listMsgHistory.length>0||listMsg.length>0?
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
                            <div className="text" style={{ width:"auto", backgroundColor:'lightgreen', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
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
                            <div className="text" style={{ width:"auto", backgroundColor:'lime', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}}>
                              <p>{e.msg}</p>
                            </div>
                            <img style={{marginLeft:'20px'}} src={API_URL+detail.img} alt="" srcset="" />
                          </div>):
                        (
                          <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                            <img style={{marginRight:'20px'}} src={API_URL+detailByName.img} alt="" srcset="" />
                            <div className="text" style={{ width:"auto", backgroundColor:'orange', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                              <p>{e.msg}</p>
                            </div>
                          </div>)}
                      </div>
                    )
                  }
                })}
              
              </div>
              {listMsgHistory.length>0||listMsg.length>0?(
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
            <div className='profilesender' style={{width:'30%'}}>

            </div>
          </section>
        </div>
      </div>
    </body>
  )
}

export default Chat