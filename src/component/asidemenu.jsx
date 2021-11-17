/* eslint-disable array-callback-return */
import React, {useEffect, useState} from "react";
import { UPDATE_USER } from "../redux/actions/users"
import '../css/chat/body.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector, useDispatch } from "react-redux"
import { API_URL } from "../helper/env";
import { useHistory } from "react-router";
import { Input } from 'reactstrap';

const Usersetting = ({detail, toggleSetting, toggle, getData, userOn, setOn}) => {
  const [input, setInput]= useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const history = useHistory()
  const toggleDrop = () => setDropdownOpen(prevState => !prevState);
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
 
  const [updData, setUpd]=useState({})
  
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
      alert(err.response.data.message)
    })
  }
  const logout=()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('img')
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
            <button onClick={updateUser} type='submit' className="btnsave">Save Changes</button>
          </div>
        </div>
      </form>
    </body>
  )
}

export default Usersetting