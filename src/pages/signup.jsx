import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import '../css/logsign/body.css'
import { REGISTER } from "../redux/actions/users"
import 'bootstrap/dist/css/bootstrap.min.css'
import { BsEyeFill } from "@react-icons/all-files/bs/BsEyeFill";
import { BsEyeSlashFill } from "@react-icons/all-files/bs/BsEyeSlashFill";

const Login = () => {
  const history = useHistory();
  const [user, setUser] = useState({})
  const setData=(event)=>{
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }
  const handleSign =(e)=> {
    e.preventDefault();
    REGISTER(user).then((response) =>{
      alert("Register Berhasil")
      history.push(`/`);
    }).catch((err) =>{
      alert("username/password salah")
    })
  }
  const [type, setType] = useState('password')

  return (
    <body className="d-flex align-items-center justify-content-center flex-column logsign" >
      <section className="d-flex align-items-center flex-column box">
        <h1>Register</h1>
        <p className="mt-4">Let’s create your account!</p>
        <form onSubmit={handleSign} className="formlgn">
          <div className="signbox">
            <div className="textbox">
              <p>Username</p>
              <input 
              type="text" 
              placeholder="Username" 
              name="username"
              onChange={setData} 
              >
              </input>
            </div>
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
                  <BsEyeFill className="img" style={{cursor:'pointer'}} onClick={()=>setType('text')}/>
                ):(
                  <BsEyeSlashFill className="img" style={{cursor:'pointer'}} onClick={()=>setType('password')}/>
                )
              }
            </div>
          </div>
          <div className="buttonlgn">
            <div className="btn">
            <button className="btn-lg sign" type="submit">Register</button>
            </div>
            <span className="with-line">
              <p id="sgn">Register With</p>
            </span>
            <Link to="/signup" className="mt-3 btn">
            <button className="sign d-flex" id="sign2">
              <img src="https://raw.githubusercontent.com/farizian/week20/master/img/gugelvector.png" alt="" srcset="" />
              <p>Google</p>
            </button>
            </Link>
          </div>
        </form>
      </section>
    </body>
  )
}

export default Login