var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var http = require("http");
var socketio = require("socket.io");
var qs = require("querystring");

var userObj = require("./utils/usersInfo");
var messageObj = require("./utils/messageManagement");

const PORT = 3000;

var app = express();
const server = http.createServer(app);
var io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (req, res)=>{
    var fileUrl = path.join(__dirname, "public", "index.html");
    res.sendFile(fileUrl);
});

app.post("/home", (req, res)=>{
    var username = req.body.username;
    var roomname = req.body.roomname;
    var temp = qs.stringify({username:username, roomname:roomname});
    res.redirect("/chat?"+temp);
});

app.get("/chat", (req, res)=>{
    var fileUrl = path.join(__dirname, "public", "chat.html")
    res.sendFile(fileUrl);
});

io.on("connection", (socket)=>{
    socket.on("joinRoom", (data)=>{
        socket.join(data.roomname);
        console.log(data);
        var obj = {username:data.username, message:" has joined the room", roomname:data.roomname};
        userObj.newUserjoin(socket.id, data.username, data.roomname);
        
        messageObj.getAllMessage(data.roomname, (msgArr)=>{
            // console.log("All Messages ", msgArr);
            socket.emit("initMessage", {msgArr, currUser:data.username});
            socket.emit("welcomeUser", "Welcome to the room");
            messageObj.postMessage(obj);
        });
        
        socket.to(data.roomname).broadcast.emit("modifyUserJoin", obj);

        userObj.getAllUser(data.roomname, (usersArr) => {
            // console.log("Users array is ", usersArr);
            io.to(data.roomname).emit("modifyUsersList",  {usersArr:usersArr, currRoom:data.roomname});
        });
    });
    socket.on("disconnect", ()=>{
        console.log("User has left the room");
        userObj.getUser(socket.id, (tempUser)=>{
            console.log("Deleted user ", tempUser);
            if(tempUser){
                userObj.removeUser(socket.id, (res)=>{
                    console.log("deleted flag ", res);
                    if(res){
                        var userLeftMsg = {username:tempUser.username, message:" has left the room", roomname:tempUser.roomname};
                        messageObj.postMessage(userLeftMsg);
                        socket.to(tempUser.roomname).broadcast.emit("modifyUserJoin", userLeftMsg);   
                        
                        userObj.getAllUser(tempUser.roomname, (usersArr) => {
                            io.to(tempUser.roomname).emit("modifyUsersList", {usersArr:usersArr, currRoom:tempUser.roomname});
                        });
                    }
                });
            }
        });
    });
    socket.on("message", (obj)=>{
        console.log("Message Received: ", obj);
        messageObj.postMessage(obj);
        io.to(obj.roomname).emit("chatMessage", obj);
        // messageObj.getAllMessage(obj.roomname, (res)=>{
        //     console.log("All Messages ", res);
        // })
    });
});

server.listen(PORT, (err)=>{
    if(!err){
        console.log("Listening on port "+PORT);
    }
});