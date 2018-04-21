const connectToMongo = () =>
{
    mongoConnection = mongoose.connection;
    mongoConnection.on("error", function () {
        throw new Error("Problem with connecting to Mongo");
    });
    mongoConnection.once("open", function () {
        console.log("Mongo connected".green);
    });
	mongoConnection.once("close", function () {
        console.log("Mongo disconnected".yellow);
    });
}
const http = require("http");
const fs = require("fs");
const socketio = require("socket.io");
const colors = require("colors");
const mongoose = require("mongoose");
const Models = require("./database/Models.js")(mongoose);
const operations = new require("./database/Operations.js")();
const express = require('express');  

const ip = "127.0.0.1";
const port = 3000;

const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);

let mongoConnection;

app.use(express.static("static"));  

server.listen(port, ip);

io.on("connection", function (client) 
{    
    console.log("Client  with ID : \"" + client.id + "\" connected");
    
    client.on("disconnect", function () {
        console.log("Client  with ID : \"" + client.id + "\" disconnected");
    });
    
    client.on("addBrick", function (data) {
         client.broadcast.emit("addBrick",data);
    });

    client.on("changeColor", function (data) {
         client.broadcast.emit("changeColor",data);
    });

    client.on("decreaseLength", function (data) {
         client.broadcast.emit("decreaseLength",null);
    });

    client.on("increaseLength", function (data) {
         client.broadcast.emit("increaseLength",null);
    });

    client.on("rotateBrick", function (data) {
         client.broadcast.emit("rotateBrick",data);
    });

    client.on("login",function(data){
        if(!data.login || !data.password){
            client.emit("registerResponse",{error:"Missing password or login"});
            return; 
        }
        operations.loginUser(Models.User,data.login,data.password).then((future)=>{
            client.emit("loginResponse",future)
        });
    });

    client.on("register",function(data){
        if(!data.login || !data.password) {
            client.emit("registerResponse",{error:"Missing password or login"});
            return; 
        }
        operations.registerUser(Models.User,data.login,data.password).then((future)=>{
            client.emit("registerResponse",future)
        })
    });

    client.on("saveBuilding", function (buildingData) {
        const buildingModel = new Models.Building(buildingData);

        operations.saveBuilding(buildingModel).then((future)=>{
            client.emit("saveBuildingResponse",future);
        }).catch((exception)=>{
            console.log(exception)
        });
    });

    client.on("getListOfUsers",function(){ // for admin only

        operations.getListOfUsers(Models.User).then((listOfUsers)=>{
            client.emit("getListOfUsersResponse",listOfUsers);
        }).catch((error)=>{
            console.log(error.message.red);
        });
    });

    client.on("getListOfBuildings", (playerNick)=>{ // for sidemenu
        operations.getListOfBuildings(Models.Building,playerNick).then((data)=>{
            client.emit("getListOfBuildingsResponse",data);
        }).catch((exception)=>{
            console.log(exception)
        });
    });

    client.on("removeBuilding", (playerNick, buildingName)=>{
        operations.removeBuilding(Models.Building, playerNick, buildingName).catch((ex)=>{
            console.log(ex);
        });
        client.emit("removeBuildingResponse","removed building");
    });

    client.on("getPlayerBuildings", (playerNick)=>{ // for admin panel
        operations.getListOfBuildings(Models.Building,playerNick).then((data)=>{
            client.emit("getPlayerBuildingsResponse",data);
        }).catch((exception)=>{
            console.log(exception)
        });
    });
});

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${ip}/builder`); 
connectToMongo();

console.log(`Server starting on ${ip}:${port}`.green);

operations.registerUser(Models.User,"admin","admin").then((data)=>{
}).catch((error)=>{
    console.log(error.message.red);
});
















// old server

// const server = http.createServer(function (request, response) 
// {  
//     //------------ Reading files: -------------------------------------------------------
//     if (request.method == "GET")
//     {
//         if (request.url === "/") 
//         {
//             fs.readFile("static/index.html", function (error, data) 
//             {
//                 response.writeHead(200, { 'Content-Type': 'text/html' });
//                 response.write(data);
//                 response.end();
//             })
//         }
//         else
//         {
//             fs.readFile("static" + request.url, function (error, data) 
//             {
//                 response.writeHead(200);
//                 try
//                 {
//                     response.write(data);
//                 }   
//                 catch(ex)
//                 {
//                     console.error("Cannot read file \"" + "static" + request.url + "\"")
//                 }
//                 response.end();
//             })
//         }
//     }
// });