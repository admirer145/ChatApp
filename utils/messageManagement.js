var mongoClient = require("mongodb");

messageArr = [];

function postMessage(obj){

    mongoClient.connect("mongodb://localhost:27017/",{ useUnifiedTopology: true }, (err, dbHost)=>{
        if(err){
            console.log("error connecting to server");
        }else{
            var db = dbHost.db("slDb");
            db.collection("messages", (err, coll)=>{
                if(err){
                    console.log("Error connecting to collection");
                }else{
                    coll.insertOne(obj);
                }
            })
        }
    });
    messageArr.push(obj);
}

function getAllMessage(obj){
    return messageArr;
}

module.exports = {postMessage:postMessage, getAllMessage};