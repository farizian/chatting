import { io } from "socket.io-client";
import { API_URL } from "../helper/env";

const socket = io(API_URL, {
  transports: ['polling', 'websocket'],
  timeout: 20000,
  forceNew: true,
  upgrade: true,
  rememberUpgrade: false
});

export default socket;