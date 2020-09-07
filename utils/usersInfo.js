var mongoClient = require("mongodb").MongoClient;

// const usersArr = [];

function newUserjoin(id, username, roomname){
    var obj = {id, username, roomname};
    // usersArr.push(obj);
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
    if(err){
        console.log("Error connecting to the server");
    }else{
        var db = dbHost.db("slDb");
        db.collection("users", (err, coll) => {
            if(err){
                console.log("Error connecting to collection");
            }else{
                coll.insertOne(obj);
            }
        });
    }
});
}

function getAllUser(roomname, callback){
    // var usersByRoom = usersArr.filter(item => item.roomname == roomname);
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if(err){
            console.log("Error connecting to the server");
        }else{
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if(err){
                    console.log("Error connecting to collection");
                }else{
                    coll.find({roomname:roomname}).toArray((err, res)=>{
                        if(err){
                            console.log("Cannot find user");
                        }else{
                            // console.log("All users in room: ", roomname, " are " , res);
                            return callback(res);
                        }
                    });
                }
            });
        }
    });
    return callback(null);
}

function getUser(id, callback){
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if(err){
            console.log("Error connecting to the server");
        }else{
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if(err){
                    console.log("Error connecting to collection");
                }else{
                    coll.findOne({id:id}, (err, res)=>{
                        if(err){
                            console.log("Cannot find user");
                        }else{
                            // console.log("output of find", res);
                            return callback(res);
                        }
                    });
                }
            });
        }
    });
    // var pos  = usersArr.findIndex(item => item.id==id);
    // if(pos>=0){
    //     return usersArr[pos];
    // }
    return callback(null);
}

function removeUser(id, callback){
    // var pos  = usersArr.findIndex(item => item.id==id);
    // if(pos>=0){
    //     usersArr.splice(pos, 1);
    // }else{
    //     console.log("User does not exist");
    // }

    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if(err){
            console.log("Error connecting to the server");
        }else{
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if(err){
                    console.log("Error connecting to collection");
                }else{
                    coll.deleteOne({id:id}, (err, res)=>{
                        if(err){
                            console.log("Error while deleting user");
                        }else{
                            // console.log("Delete result: ", res.deletedCount);
                            if(res.deletedCount == 1){
                                return callback(true);
                            }else{
                                return callback(false);
                            }
                        }
                    });
                }
            });
        }
    });
    return callback(false);
}

module.exports = {newUserjoin, getAllUser, getUser, removeUser};