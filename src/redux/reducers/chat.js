const initialState = {
    listMessage: [],
    loadlistMessage: false,

    senderReceiver: [],
    loadSenderReceiver: false,

    historyMessage: [],
    loadhistoryMessage: false,

    listActiveContacts: [],
    loadlistActiveContacts: false,
};

const chatReducer = ( state=initialState, action)=>{
    switch (action.type) {
        case 'GET_LISTMESSAGE_PENDING':
            return { ...state, loadlistMessage: true };
        case 'GET_LISTMESSAGE_FULFILLED':
            return { ...state, loadlistMessage: false, listMessage: [...state.listMessage, action.payload] };
        case "GET_SENDERRECEIVER_PENDING":
            return { ...state, loadSenderReceiver: true };
        case "GET_SENDERRECEIVER_FULFILLED":
            return{...state, loadSenderReceiver: false, senderReceiver: action.payload}
        
        case 'GET_CONTACTS_PENDING':
            return { ...state, loadcontacts: true };
        case 'GET_CONTACTS_FULFILLED':
            return { ...state, loadcontacts: false, contacts: action.payload };
        case 'GET_CONTACTS_REJECTED':
            return {...state, loadcontacts: false, errorcontacts: true, errorcontactInfo: action.payload}

        case 'GET_HISTORYMESSAGE_PENDING':
            return { ...state, loadhistoryMessage: true };
        case 'GET_HISTORYMESSAGE_FULFILLED':
            return { ...state, loadhistoryMessage: false, historyMessage: action.payload, listMessage: [] };
        // case 'GET_HISTORYMESSAGE_REJECTED':
        //     return {...state, loadhistoryMessage: false, errorhistoryMessage: true, errorhistoryMessageInfo: action.payload}
        case 'GET_LISTCONTACTACTIVE_PENDING':
            return {...state, loadlistActiveContacts: true};
        
        case 'GET_LISTCONTACTACTIVE_FULFILLED':
            return {...state,loadlistActiveContacts: false, listActiveContacts: action.payload};
        
        
        default:
            return state;
    }
}
export default chatReducer