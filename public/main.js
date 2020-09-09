var chatForm = document.getElementById("chatForm");
var chatMessage = document.getElementById("chatMessage");
var chatMessageDiv = document.getElementById("chatMessageDiv");
var participantList = document.getElementById("participantList");
var chatRoom = document.getElementById("chatRoom");

var userObj = Qs.parse(location.search, {ignoreQueryPrefix:true});
var username = userObj.username;
var roomname = userObj.roomname;
var baseUrl = "http://localhost:3000";

console.log("username : "+ username);
console.log("roomname : "+ roomname);

const socket = io();

socket.emit("joinRoom", {username:username, roomname:roomname});

socket.on("welcomeUser", (msg)=>{
    // var divElement = document.createElement("div");
    // divElement.className = "col-12 border rounded m-1 bg-primary text-white text-center";
    // divElement.innerHTML = "Web Chat : " + msg;
    var divElement = formatMessage({username:"Web Chat", message:msg}, "text-center");
    chatMessageDiv.appendChild(divElement);
    chatMessageDiv.scrollTo(0, chatMessageDiv.scrollHeight);
});

socket.on("chatMessage", (obj)=>{
    if(obj.username == username){
        chatMessageDiv.appendChild(formatMessage(obj, "text-right"));
    }else{
        chatMessageDiv.appendChild(formatMessage(obj, "text-left"));
    }
    
    // chatMessageDiv.scrollTop = chatMessageDiv.scrollHeight;
    chatMessageDiv.scrollTo(0, chatMessageDiv.scrollHeight);
});

socket.on("modifyUsersList", (obj)=>{
    var usersArr = obj.usersArr;
    var currRoom = obj.currRoom;
    console.log(obj);
    participantList.innerHTML = "";
    chatRoom.innerHTML = currRoom;
    console.log(usersArr);
    if(usersArr){
        for(let i=0; i<usersArr.length; i++){
            var liElem = document.createElement("li");
            var user = usersArr[i].username;
            liElem.appendChild(document.createTextNode(user));
            // console.log(liTextNode);
            participantList.appendChild(liElem);
            // participantList.scrollTo(0, participantList.scrollHeight);
        }
    }
});

socket.on("modifyUserJoin", (obj)=>{
    // Add messages
    var divElement = document.createElement("div");
    divElement.className = "col-12 border rounded m-1 bg-primary text-white text-left";
    var str = obj.username+obj.message;
    divElement.innerHTML = str;
    chatMessageDiv.appendChild(divElement);
    chatMessageDiv.scrollTo(0, chatMessageDiv.scrollHeight);
});

socket.on("initMessage", (obj)=>{
    if(obj){
        var msgArr = obj.msgArr;
        var currUser = obj.currUser;
        for(let i=0; i<msgArr.length; i++){
            let msgobj = msgArr[i];
            if(msgobj.username == currUser){
                chatMessageDiv.appendChild(formatMessage(msgobj, "text-right"));
            }else{
                chatMessageDiv.appendChild(formatMessage(msgobj, "text-left"));
            }
        }
    }
})

function formatMessage(obj, msg){
    var divElement = document.createElement("div");
    divElement.className = "col-12 border rounded m-1 bg-primary text-white ";
    divElement.className += msg;
    var str = obj.username+" : "+obj.message;
    divElement.innerHTML = str;
    return divElement;
}

function sendMessage(){
    console.log(chatMessage.value);
    socket.emit("message", {message:chatMessage.value, username:username, roomname:roomname});
    chatMessage.value = "";
}

function leaveRoom(){
    window.location = baseUrl;
}