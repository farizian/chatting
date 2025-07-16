import { io } from "socket.io-client";
import { API_URL } from "../helper/env";

const socket = io('https://chattingbe.farizian.my.id', {
  transports: ['polling', 'websocket'],
  timeout: 20000,
  forceNew: true,
  upgrade: true,
  rememberUpgrade: false,
  withCredentials: false
});

export default socket;