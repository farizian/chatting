import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import '../css/logsign/body.css'
import { REGISTER } from "../redux/actions/users"
import 'bootstrap/dist/css/bootstrap.min.css'
import { IoIosArrowBack } from "react-icons/io"
import { BsEyeFill } from "@react-icons/all-files/bs/BsEyeFill";
import { BsEyeSlashFill } from "@react-icons/all-files/bs/BsEyeSlashFill";

const Login = () => {
  const history = useHistory();
  const [user, setUser] = useState({
    username: "",
    email: '',
    password: ''
  })
  const [errMsg, setErr] = useState()
  const setData=(event)=>{
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }
  const handleSign =(e)=> {
    e.preventDefault();
    const valid = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(user.email)
    if(user.email === "" || user.password === ""){
      setErr("email atau password tidak boleh kosong")
    } else if (user.username === "") {
      setErr("username tidak boleh kosong")
    } else if (user.password.length < 3) {
      setErr("password minimal 3 karakter")
    } else if (!valid) {
      setErr("format email tidak sesuai.")
    } else {
      setErr(""); // Clear previous errors
      REGISTER(user).then(() =>{
        alert("Registrasi berhasil! Silakan login.");
        history.push(`/`);
      }).catch((err) =>{
        if(err.response && err.response.data) {
          setErr(err.response.data.error || err.response.data.message || "Registrasi gagal");
        } else {
          setErr("Registrasi gagal. Periksa koneksi internet Anda.");
        }
      })
    }
  }
  const [type, setType] = useState('password')

  return (
    <body className="d-flex align-items-center justify-content-center flex-column logsign" >
      <section className="d-flex align-items-center flex-column box">
      <div className="d-flex align-items-center w-100">
          <div className="d-flex justify-content-start" style={{width:'40%', cursor:'pointer'}}>
            <IoIosArrowBack color="#7E98DF" style={{fontSize:'25px'}} onClick={()=>history.push('/')}/>
          </div>
        <h1 className="m-0" style={{width:'60%'}}>Register</h1>
        </div>
        <p className="mt-4">Let’s create your account!</p>
        <form onSubmit={handleSign} className="formlgn">
          <div className="signbox">
            <div className="textbox">
              <p>Username</p>
              <input 
              type="text" 
              placeholder="Username" 
              name="username"
              value={user.username}
              onChange={setData} 
              />
            </div>
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
                  <BsEyeFill className="img" style={{cursor:'pointer'}} onClick={()=>setType('text')}/>
                ):(
                  <BsEyeSlashFill className="img" style={{cursor:'pointer'}} onClick={()=>setType('password')}/>
                )
              }
            </div>
            <p style={{color:'red'}}>{errMsg}</p>
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