import React, { useState, useEffect } from 'react';
import socket from '../config/socket'

const Home = () => {
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [listMsg, setListMsg] = useState([]);
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send-message', msg);
    socket.emit('send-name', name);
    setName('')
    setMsg('')
  };
  useEffect(() => {
    socket.on('get-message', (msg) => {
      socket.on('get-name', (name) => {
        setListMsg([
          ...listMsg,
          {
            data: `${name}: ${msg}`
          },
        ]);
      });
    });
    console.log(listMsg)
  });
  return (
    <div>
      <h1>Chatting</h1>
      <div style={{ width:"300px", height: "200px", overflow: "scroll" }}>
        {listMsg.map((e, i) => (
          <div style={{ width:"100%", height:"40px", backgroundColor:"green", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", marginTop:"10px"}} key={i}>
            <p style={{fontSize:"15px", color:"white", fontWeight:"700"}}>{e.data}</p>
          </div>
        ))}
      </div>
      <div>
        <form onSubmit={sendMessage}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="text here"
          />
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            type="text"
            placeholder="text here"
          />
          <button type="submit">send</button>
        </form>
      </div>
    </div>


  );
};

export default Home;
