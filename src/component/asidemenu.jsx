/* eslint-disable array-callback-return */
import React, {useEffect, useState} from "react";
import { UPDATE_USER, UPDATE_PW } from "../redux/actions/users"
import '../css/chat/body.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { API_URL } from "../helper/env";
import { useHistory } from "react-router";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap"

const Usersetting = ({detail, toggleSetting, toggle, getData, userOn, setOn}) => {
  const [input, setInput]= useState(false)
  const history = useHistory()
  const [modalPw, setModalPw] = useState(false);
  const togglePw = () => setModalPw(!modalPw);
  const [updData, setUpd]=useState({})
  console.log(detail)
  const setChange=(event)=>{
    setUpd({
      ...updData,
      [event.target.name]: event.target.value,
    })
  }
  const setFile = (event)=>{
    setUpd({
      ...updData,
      img: event.target.files[0],
      imgPriview: URL.createObjectURL(event.target.files[0])
    })
  }
  const updateUser=(event)=>{
    event.preventDefault();
    const {img, username, phone, tagName, bio}=updData
    const formData = new FormData()
    formData.append("img", img)
    formData.append("username", !username?detail.username: username)
    formData.append("phone", !phone?detail.phone: phone)
    formData.append("tagName", !tagName?detail.tagName:tagName)
    formData.append("bio", !bio?detail.bio:bio)
    UPDATE_USER(formData).then((response) => {
      alert(response.data.message)
      getData()
      toggleSetting(!toggle)
    }).catch((err) =>{
      alert(err.response.data.error)
    })
  }
  const updatePw=(event)=>{
    event.preventDefault();
    const userPw = {
      oldpassword: updData.oldpassword,
      password: updData.password
    }
    UPDATE_PW(userPw).then((response) => {
      alert(response.data.message)
    }).catch((err) =>{
      alert("password tidak sesuai")
    })
    togglePw()
  }
  const logout=()=>{
    socket.emit('offline', detail.id);
    localStorage.removeItem('token')
    localStorage.removeItem('img')
    localStorage.removeItem('id')
    setOn()
    history.push('/')
  }
  useEffect(()=> {
    setUpd({
      img: detail.img,
      username: detail.username,
      phone: detail.phone,
      tagName: detail.tagName,
      bio: detail.bio,
    })
  }, [detail])
  return (
    <body>
      <form className='settinguser'>
        <nav className='profile'>
          <p style={{cursor:'pointer', width:'40%'}} onClick={()=>toggleSetting(!toggle)}><strong>{'<'}</strong></p>
          <p style={{cursor:'pointer', width:'60%', paddingLeft:'0'}}>{detail.tag_name}</p>
        </nav>
        <div className='box'>
          <Input type="file" id="file-input" className="select" onChange={setFile}>
          </Input>
          <label for="file-input">
            <img for="file-input" src={updData.imgPriview ? updData.imgPriview : API_URL+detail.img } alt="" srcset="" />
          </label>
          <div className='textbox' style={{alignItems:'center'}}>
            <input type="text" style={{textAlign:'center'}} name="username" value={updData.username} onChange={setChange}/>
            <p style={{fontSize:'16px', fontWeight:'400', color:'#848484'}}>{detail.tagName}</p>
          </div>
          <div className='textbox' style={{height:'100px',borderBottom:'solid 1px #F6F6F6'}}>
            <p style={{fontSize:'19px', marginBottom:'5px'}}>Account</p>
            {input?(
              <input type="text" name="phone" style={{fontSize:'16px', fontWeight:'400', color:'#848484'}} value={updData.phone} onChange={setChange}/>
            ):(
              <p style={{fontSize:'16px', fontWeight:'400', color:'#848484'}}>{detail.phone}</p>
            )}
            <p onClick={()=>setInput(!input)} style={{fontSize:'16px', fontWeight:'400',color:'#7E98DF', cursor:'pointer'}}>Tap to change phone number</p>
          </div>
          <div className='textbox' style={{height:'65px',borderBottom:'solid 1px #F6F6F6'}}>
            <input type="text" name="tagName" style={{fontSize:'16px', fontWeight:'500'}} value={updData.tagName} onChange={setChange}/>
            <p style={{fontSize:'16px', fontWeight:'400',}}>Username</p>
          </div>
          <div className='textbox'>
            <textarea type="text" name="bio" value={updData.bio} onChange={setChange} />
            <p style={{fontSize:'16px', fontWeight:'400',}}>Bio</p>
          </div>
          <div className='textbox'>
            <p style={{fontSize:'19px', fontWeight:'500',}}>Setting</p>
            <div className='menu' style={{cursor:'pointer'}} onClick={togglePw}>
              <div className='imgbox'>
                <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/lock.png" alt="" srcset="" />
              </div>
              <p>Change Password</p>
            </div>
            <Modal isOpen={modalPw} toggle={togglePw} modalClassName="d-flex align-items-center" className='w-100'>
              <ModalHeader toggle={togglePw}>Edit Password</ModalHeader>
              <ModalBody>
              <form className="insert">
                <div className="textbox" style={{marginBottom:'10px'}}>
                  <h3>Old Password :</h3>
                  <Input type="password" placeholder="Insert Password" name="oldpassword" onChange={setChange}></Input>
                </div>
                <div className="textbox">
                  <h3>New Password :</h3>
                  <Input type="password" placeholder="Insert Password" name="password" onChange={setChange}></Input>
                </div>
              </form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={updatePw}>Submit</Button>{' '}
                <Button color="secondary" onClick={togglePw}>Cancel</Button>
              </ModalFooter>
            </Modal>
            <div className='menu' onClick={logout} style={{cursor:'pointer'}}>
              <div className='imgbox'>
                <img src="https://raw.githubusercontent.com/farizian/chatting/master/img/Chat.png" alt="" srcset="" />
              </div>
              <p>Logout</p>
            </div>
            <button onClick={updateUser} type='submit' className="btnsave">Save Changes</button>
          </div>
        </div>
      </form>
    </body>
  )
}

export default Usersetting