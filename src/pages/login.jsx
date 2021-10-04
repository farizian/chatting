import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import '../css/logsign/body.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BsEyeFill } from "@react-icons/all-files/bs/BsEyeFill";
import { LOGIN } from "../redux/actions/users"
import { BsEyeSlashFill } from "@react-icons/all-files/bs/BsEyeSlashFill";

const Login = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [roomId, setRoomId]= useState();
  const [user, setUser] = useState({
    email: "",
    password: "",
  })
  const setData=(event)=>{
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }
  const handleSign =(e)=> {
    e.preventDefault();
    LOGIN(user).then(() =>{
      alert("Login Berhasil")
      history.push(`/chat`);
    }).catch((err) =>{
      alert("username/password salah")
    })
  }
  const [type, setType] = useState('password')

  return (
    <body className="d-flex align-items-center justify-content-center flex-column logsign" >
      <section className="d-flex align-items-center flex-column box">
        <h1>Login</h1>
        <p className="mt-4">Hi, Welcome back!</p>
        <form onSubmit={handleSign} className="formlgn">
          <div className="signbox">
            <div className="textbox">
              <p>Email</p>
              <input 
              type="text" 
              placeholder="Email" 
              name="email"
              onChange={setData}
              >
            </input>
            </div>
            <div className="textbox">
              <p>Password</p>
              <input 
              type={type} 
              placeholder="Password" 
              name="password" 
              onChange={setData}
              >
              </input>
              {
                type==='password'?(
                  <BsEyeSlashFill className="img" style={{cursor:'pointer'}} onClick={()=>setType('text')}/>
                ):(
                  <BsEyeFill className="img" style={{cursor:'pointer'}} onClick={()=>setType('password')}/>
                )
              }
            </div>
            <h3>Forgot password?</h3>
          </div>
          <div className="buttonlgn">
            <div className="btn">
            <button className="btn-lg sign" type="submit">Login</button>
            </div>
            <span className="with-line">
              <p>Login With</p>
            </span>
            <Link to="/signup" className="mt-3 btn">
            <button className="sign d-flex" id="sign2">
              <img src="https://raw.githubusercontent.com/farizian/week20/master/img/gugelvector.png" alt="" srcset="" />
              <p>Google</p>
            </button>
            </Link>
            <p>Don’t have an account?&ensp;
            <Link className="link" to="/signup" style={{textDecoration:'none'}}>
            <span className="bold">Sign Up</span>
            </Link>
            </p>
          </div>
        </form>
      </section>
    </body>
  )
}

export default Login