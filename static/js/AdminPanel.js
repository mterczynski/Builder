function AdminPanel()
{
    const mainNode = document.createElement("div");
    const buildings = {
        player1:[],
        player2:[
            //building1
            //building2
        ]
    }
    mainNode.classList.add("adminPanel");
    mainNode.innerHTML = `<div class="sidemenu-active">Użytkownicy</div>`;

    /*<div class="adminPanel">
        <div class="sidemenu-active">
            Użytkownicy
            <div class="activeUserName">
                Admin
                <div>Building1</div>
                <div>Building2</div>
            </div>
            <div>SomeUser</div>
        </div>
    </div>*/
    
    mainNode.classList.add("adminPanel");
    function addUserName()
    {

    }
    function refreshBuildingsToUser()
    {

    }
    function getNode()
    {
        return mainNode;
    }
    function getListOfUsers()
    {
        game.client.emit("getListOfUsers",{});
    }
    game.client.on("getListOfUsersResponse",function(data){
        console.log(data);
        data.map((el)=>{
            let userDiv = document.createElement("div");
            userDiv.innerHTML = el;
            mainNode.querySelector("div").appendChild(userDiv);
            userDiv.addEventListener("click",function(event){
                userDiv.classList.toggle("activeUserName");
                if(userDiv.classList.contains("activeUserName")){

                    game.client.emit("getPlayerBuildings", el);
                }
                // download from server
            });
        });
    });
    game.client.on("getPlayerBuildingsResponse",function(data){
        data.map((el)=>{
            if(!buildings[el.playerLogin])
            {
                buildings[el.playerLogin] = [];
            }
            buildings[el.playerLogin].push(el);
            mainNode.querySelector("div").childNodes.forEach(function(element,index) {
                if(element.innerHTML == el.playerLogin)
                {
                    let div = document.createElement("div");
                    div.innerHTML = el.buildingName;
                    element.appendChild(div)
                }
            });
        });
    });
    getListOfUsers();
    //-------------- Public: ---------------------
    this.getNode = getNode;
}