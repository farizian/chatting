import socket from "../../config/socket";


export const USER_ONLINE = (id) =>{
    return(dispatch)=>{
        
        socket.emit("broadcast", (id))
        socket.on("get-online-broadcast", (payload)=>{
            dispatch({
                type: "GET_SENDERRECEIVER_FULFILLED",
                payload
            })
        });
    }
}

export const LISTMESSAGE = (id, receiver, msg) =>{
    // console.log(id)
    // console.log(receiver)
    // console.log(msg)
    return(dispatch)=>{
        dispatch(getListMessagePending());
        socket.emit("send-message", {
            sender: id,
            receiver,
            msg,
        });
    }
}

export const HISTORYMESSAGE = (data) =>{
    const { sender, receiver, msg } = data
    // console.log(sender)
    // console.log(receiver)
    return(dispatch)=>{
        dispatch(getHistoryPending());
        socket.emit("get-message", { receiver: receiver, sender: sender });
        dispatch(getHistoryFulfilled(data));
    }
} 

export const DELETEMESSAGE = (id, userID) =>{
    return new Promise((resolve, reject)=>{
        socket.emit("get-delete-Message", (id))
        socket.on("deleteMessage", (response)=>{
            console.log(response)
            if(response.error){
                reject(response.error);
            }else{
                resolve(response)
            }
        })
        
    })
}


const getContactPending = () =>{
    return{
        type: "GET_CONTACTS_PENDING"
    }
}
const getContactFulfilled = (payload) =>{
    return{
        type: "GET_CONTACTS_FULFILLED",
        payload
    }
}
const getContactRejected = (payload) =>{
    return{
        type: "GET_CONTACTS_REJECTED",
        payload
    }
}

const getContactChatsPending = () =>{
    return{
        type: "GET_SENDERRECEIVER_PENDING"
    }
}
const getContactChatsFulfilled = (payload) =>{
    return{
        type: "GET_SENDERRECEIVER_FULFILLED",
        payload
    }
}

const getListMessagePending = () =>{
    return{
        type: "GET_LISTMESSAGE_PENDING"
    }
}
const getListMessageFulfilled = (payload) =>{
    return{
        type: "GET_LISTMESSAGE_FULFILLED",
        payload
    }
}

const getHistoryPending = () =>{
    return{
        type: "GET_HISTORYMESSAGE_PENDING"
    }
}
const getHistoryFulfilled = (payload) =>{
    return{
        type: "GET_HISTORYMESSAGE_FULFILLED",
        payload
    }
}

// const getHistoryRejected = (payload) =>{
//     return{
//         type: "GET_CONTACTS_REJECTED",
//         payload
//     }
// }

const getContactsActivePending = () =>{
    return{
        type : "GET_LISTCONTACTACTIVE_PENDING"
    }
}

const getContactsActiveFullfilled = (payload) =>{
    return{
        type : "GET_LISTCONTACTACTIVE_FULFILLED",
        payload
    }
}