var clientSocket = 
{
    init()
    {
        game.client = io();
        //----------- Logging: ------------------------
        function onLoginOrRegister(data)
        {
            console.log(data)
            if(data.success)
            {
                let messageNode = (new MessageBox()).getNode(data.success);
                document.body.appendChild(messageNode);
                messageNode.addEventListener("click",(ev)=>
                {
                    messageNode.remove();
                    if(document.querySelector(".loginScreen"))
                    {
                        document.querySelector(".loginScreen").remove();
                    }  
                    game.start();
                });
                messageNode.addEventListener("keydown",(event)=>{
                    
                    //TODO
                    messageNode.remove();
                    if(document.querySelector(".loginScreen"))
                    {
                        document.querySelector(".loginScreen").remove();
                    }  
                    game.start();
                });
            }
            else if(data.error)
            {
                const messageNode = (new MessageBox()).getNode(data.error);
                document.body.appendChild(messageNode);
                game.playerLogin = null;
            }
        }
        game.client.on("loginResponse",function(data)
        {
            onLoginOrRegister(data);
        })
        //----------- Registering: ------------------------
        game.client.on("registerResponse",function(data)
        {
            onLoginOrRegister(data);
        });
        game.client.on("saveBuildingResponse",function(data){
        });
        game.client.on("getListOfBuildingsResponse",function(buildingList){
            game.playerBuildings = buildingList;
            buildingList.map((el)=>{
                game.sidemenu.addNewBuildingToHtmlList(el.buildingName);
            });
        });
        game.client.on("removeBuildingResponse",function(response){
        });
    }   
}
