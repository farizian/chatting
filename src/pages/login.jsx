import React from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import '../css/logsign/body.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BsEyeFill } from "@react-icons/all-files/bs/BsEyeFill";
import { LOGIN } from "../redux/actions/users"
import { BsEyeSlashFill } from "@react-icons/all-files/bs/BsEyeSlashFill";

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const [errMsg, setErr]= useState();
  const [user, setUser] = useState({
    email: "",
    password: "",
  })
  const [roomLogin, setRoomLogin] = useState({
    username: "",
    roomId: ""
  });

  // Check if this is a room-based login from URL params
  const urlParams = new URLSearchParams(location.search);
  const isRoomLogin = urlParams.get('room') !== null;

  const setData=(event)=>{
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const setRoomData=(event)=>{
    setRoomLogin({
      ...roomLogin,
      [event.target.name]: event.target.value
    })
  }

  const handleSign =(e)=> {
    e.preventDefault();
    
    if(isRoomLogin) {
      // Room-based login flow
      if(roomLogin.username === "" || roomLogin.roomId === ""){
        setErr("Username dan Room ID harus diisi.")
      } else {
        // Navigate to chat with query parameters
        history.push(`/chat?username=${roomLogin.username}&roomId=${roomLogin.roomId}`);
      }
    } else {
      // Regular user login flow
      const valid = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(user.email)
      if(user.email === "" || user.password === ""){
        setErr("input harus diisi.")
      } else if (!valid) {
        setErr("input email tidak sesuai.")
      } else {
        setErr(""); // Clear previous errors
        LOGIN(user).then(() =>{
          history.push(`/chat`);
        }).catch((err) =>{
          console.log("Login error:", err);
          if(err.response && err.response.data) {
            setErr(err.response.data.error || err.response.data.message || "Login gagal");
          } else {
            setErr("Login gagal. Periksa koneksi internet Anda.");
          }
        })
      }
    }
  }

  const [type, setType] = useState('password')

  return (
    <body className="d-flex align-items-center justify-content-center flex-column logsign" >
      <section className="d-flex align-items-center flex-column box">
        <h1>{isRoomLogin ? 'Join Room' : 'Login'}</h1>
        <p className="mt-4">{isRoomLogin ? 'Enter your details to join the chat room!' : 'Hi, Welcome back!'}</p>
        <form onSubmit={handleSign} className="formlgn">
          <div className="signbox">
            {isRoomLogin ? (
              <>
                <div className="textbox">
                  <p>Username</p>
                  <input 
                  type="text" 
                  placeholder="Enter your username" 
                  name="username"
                  value={roomLogin.username}
                  onChange={setRoomData}
                  />
                </div>
                <div className="textbox">
                  <p>Room ID</p>
                  <input 
                  type="text" 
                  placeholder="Enter room ID" 
                  name="roomId"
                  value={roomLogin.roomId}
                  onChange={setRoomData}
                  />
                </div>
              </>
            ) : (
              <>
            <div className="textbox">
              <p>Email</p>
              <input 
              type="text" 
              placeholder="Email" 
              name="email"
              value={user.email}
              onChange={setData}
              />
            </div>
            <div className="textbox">
              <p>Password</p>
              <input 
              type={type} 
              placeholder="Password" 
              name="password" 
              value={user.password}
              onChange={setData}
              />
              {
                type==='password'?(
                  <BsEyeSlashFill className="img" style={{cursor:'pointer'}} onClick={()=>setType('text')}/>
                ):(
                  <BsEyeFill className="img" style={{cursor:'pointer'}} onClick={()=>setType('password')}/>
                )
              }
            </div>
              </>
            )}
            <p style={{color:'red'}}>{errMsg}</p>
            {!isRoomLogin && <h3>Forgot password?</h3>}
          </div>
          <div className="buttonlgn">
            <div className="btn">
            <button className="btn-lg sign" type="submit">Login</button>
            </div>
            <span className="with-line">
              <p>Login With</p>
            </span>
            {!isRoomLogin && (
            <Link to="/signup" className="mt-3 btn">
            <button className="sign d-flex" id="sign2">
              <img src="https://raw.githubusercontent.com/farizian/week20/master/img/gugelvector.png" alt="" srcset="" />
              <p>Google</p>
            </button>
            </Link>
            )}
            <p>Don’t have an account?&ensp;
            {!isRoomLogin && (
            <Link className="link" to="/signup" style={{textDecoration:'none'}}>
            <span className="bold">Sign Up</span>
            </Link>
            )}
            {isRoomLogin && (
              <Link className="link" to="/" style={{textDecoration:'none'}}>
              <span className="bold">Back to Login</span>
              </Link>
            )}
            </p>
          </div>
        </form>
      </section>
    </body>
  )
}

export default Login