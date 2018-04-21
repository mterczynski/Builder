const ObjectId = require('mongodb').ObjectID;

module.exports = function () 
{
    const opers = 
    {
        saveBuilding: function(buildingModel)
        {
            return new Promise((resolve,reject)=>
            {
                opers.insertOne(buildingModel).then((onInsert)=>{
                    resolve("created one building")
                }).catch((insertError)=>{
                    reject(insertError);
                })
            });
        },
        getListOfBuildings:function(buildingModel, playerNick)
        {
            return new Promise((resolve,reject)=>{
                buildingModel.find({playerLogin:playerNick},function callback(err,data){
                    resolve(data);
                })
            })
        },
        getListOfUsers:function(userModel)
        {
            return new Promise((resolve,reject)=>{
                opers.selectAll(userModel).then((data)=>{
                    const logins = [];
                    for(let user of data)
                    {
                        logins.push(user.login);
                    }
                    resolve(logins);
                }).catch((error)=>{
                    reject(error);
                });
            });
        },
        removeBuilding:function(buildingModel,playerNick,buildingName)
        {
            return new Promise((resolve,reject)=>{
                buildingModel.remove({playerLogin:playerNick, buildingName:buildingName}, function(err,removed) // removed: int n, int ok
                { 
                    if(err)
                        reject(err);
                    else if(!removed.result.ok || removed.result.n == 0)
                        reject(new Error(`Can't remove building - building doesn't exist.`));
                    else
                        resolve({success:"Removed building."});
                });
            });
            
        },
        registerUser: function(userModel, login, password) // login: String, password: String
        {
            return new Promise((resolve,reject)=>
            {
                userModel.find({login:login},function callback(error, data)
                {
                    if(error) 
                    {
                        reject(error)
                        return;
                    }
                    if(data.length == 0) // no user found -> add user to db
                    {
                        const user = new userModel(
                        {
                            login:login,
                            password:password
                        });
                        
                        opers.insertOne(user)
                        .then((response)=>{
                            resolve({success:"Registration successful"});
                        }).catch((error)=>{
                            reject(error);
                        });
                    }
                    else
                    {
                        resolve({error:"username busy"})
                    }
                });
            })
        },
        loginUser:  function(userModel, login, password) // login: String, password: String
        {
            return new Promise((resolve,reject)=>
            {
                userModel.find({login, password}, function callback(error, data)
                {
                    if(error) 
                    {
                        reject(error)
                    }
                    if(data.length == 0)
                    {
                        resolve({error:"Access denied"});
                    }
                    else
                    {
                        resolve({success:"Access granted"});
                    }
                });
            })
        },
        selectBy:function(model,property,filterValue)
        {
            return new Promise((resolve,reject)=>
            {
                const filter = {};
                filter[property] = filterValue;
                model.find(filter,function callback(error, data)
                {
                    if(error)
                        reject(error);
                    else
                        resolve(data);
                })
            })
        },
        insertOne: function (data) // [Model model]
        {
            return new Promise((resolve,reject)=>
            {
                data.save(function callback(error, data, addedCount) 
                {
                    if(error)
                    {
                        reject(error);
                    }
                    else
                    {
                        resolve({success:`Added documents. Count: ${addedCount}`});
                    }
                })
            }) 
        },
        selectAll: function (model) 
        {
            return new Promise((resolve,reject)=>
            {
                model.find({},function (error, data) 
                {
                    if(error) 
                    {
                        reject(error)
                    }
                    else
                    {
                        resolve(data);
                    }
                })
            })
        },
        selectById: function(model,id)
        {
            return new Promise((resolve,reject)=>
            {
                model.find({_id:ObjectId(id)},function(err,data)
                {
                    if (err) 
                        reject(err);
                    else
                        resolve(data);
                })
            })     
        }, 
        deleteById(model,id) // Model model, string id
        { 
            return new Promise((resolve,reject)=>
            {
                model.remove({_id:ObjectId(id)}, function(err,removed) // removed: int n, int ok
                { 
                    if(err)
                        reject(err);
                    else if(!removed.result.ok || removed.result.n == 0)
                        reject(new Error(`User with id:'${id}' doesn't exist.`));
                    else
                        resolve(removed);
                });
            })   
        },  
		deleteAll(model) 
        {
            return new Promise((resolve,reject)=>
            {
                model.remove(function callback (error, data) 
                {
                    if (error) 
                        reject(error); 
                    else
                        resole(data);
                })
            })
           
        },
    }
    return opers;
}