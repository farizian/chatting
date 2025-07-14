import { io } from "socket.io-client";
import { API_URL } from "../helper/env";

const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true
});

export default socket;