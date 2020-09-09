var mongoClient = require("mongodb").MongoClient;

function newUserjoin(id, username, roomname){
    var obj = {id, username, roomname};
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

function userExists(username, callback){
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if(err){
            console.log("Error connecting to the server");
        }else{
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if(err){
                    console.log("Error connecting to collection");
                }else{
                    coll.findOne({username}, (err, data) => {
                        if(err){
                            console.log("Error while findind the username");
                        }else{
                            if(data){
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
}

function getAllUser(roomname, callback){
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if(err){
            console.log("Error connecting to the server");
            return callback([]);
        }else{
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if(err){
                    console.log("Error connecting to collection");
                    return callback([]);
                }else{
                    coll.find({roomname:roomname}).toArray((err, res)=>{
                        if(err){
                            console.log("Cannot find user");
                            return callback([]);
                        }else{
                            return callback(res);
                        }
                    });
                }
            });
        }
    });
}

function getUser(id, callback){
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if(err){
            console.log("Error connecting to the server");
            return callback(null);
        }else{
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if(err){
                    console.log("Error connecting to collection");
                    return callback(null);
                }else{
                    coll.findOne({id:id}, (err, res)=>{
                        if(err){
                            console.log("Cannot find user");
                            return callback(null);
                        }else{
                            return callback(res);
                        }
                    });
                }
            });
        }
    });
    
}

function removeUser(id, callback){
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if(err){
            console.log("Error connecting to the server");
            return callback(false);
        }else{
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if(err){
                    console.log("Error connecting to collection");
                    return callback(false);
                }else{
                    coll.deleteOne({id:id}, (err, res)=>{
                        if(err){
                            console.log("Error while deleting user");
                            return callback(false);
                        }else{
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
}

module.exports = {newUserjoin, userExists, getAllUser, getUser, removeUser};