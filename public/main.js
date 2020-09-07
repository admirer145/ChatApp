var chatForm = document.getElementById("chatForm");
var chatMessage = document.getElementById("chatMessage");
var chatMessageDiv = document.getElementById("chatMessageDiv");
var participantList = document.getElementById("participantList");
var chatRoom = document.getElementById("chatRoom");
var userObj = Qs.parse(location.search, {ignoreQueryPrefix:true});
var username = userObj.username;
var roomname = userObj.roomname;

console.log("username : "+ username);
console.log("roomname : "+ roomname);

const socket = io();
socket.emit("joinRoom", {username:username, roomname:roomname});
socket.on("welcomeUser", (msg)=>{
    var divElement = document.createElement("div");
    divElement.className = "col-12 border rounded m-1 text-center";
    divElement.innerHTML = "Web Chat : " + msg;
    chatMessageDiv.appendChild(divElement);
});

socket.on("chatMessage", (obj)=>{
    // chatMessageDiv.scrollTop = chatMessageDiv.scrollHeight;
    chatMessageDiv.appendChild(formatMessage(obj));
    // chatMessageDiv.innerHTML += formatMessage(obj);
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
        }
    }
});

socket.on("modifyUserJoin", (obj)=>{
    // Add messages
    var divElement = document.createElement("div");
    divElement.className = "col-12 border rounded m-1";
    var str = obj.username+obj.message;
    divElement.innerHTML = str;
    chatMessageDiv.appendChild(divElement);
});

function formatMessage(obj){
    var divElement = document.createElement("div");
    divElement.className = "col-12 border rounded m-1";

    var str = obj.username+" : "+obj.message;
    divElement.innerHTML = str;
    return divElement;
}

function sendMessage(){
    console.log(chatMessage.value);
    socket.emit("message", {message:chatMessage.value, username:username, roomname:roomname});
}