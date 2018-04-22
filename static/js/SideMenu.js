function Sidemenu()
{
    //------------ Private: ------------------------------
    const mainNode = document.createElement("div");
        const buildingMenuItem = document.createElement("div");
        const saveMenuItem = document.createElement("div");
        const newBuildingMenuItem = document.createElement("div");
        const logOutMenuItem = document.createElement("div");
        const infoTab = document.createElement("div");
    //-------- Append elements: -------------------------
    mainNode.classList.add("sidemenu");
        buildingMenuItem.innerHTML = "Your buildings";
        buildingMenuItem.classList.add("sidemenu-active");
        buildingMenuItem.classList.add("menu-item");
        mainNode.appendChild(buildingMenuItem);
        saveMenuItem.innerHTML = `<input type="text" value="Building Name" class="buildingName"><img src="images/saveIcon.png" alt="Save" class="saveIcon">`;
        mainNode.appendChild(saveMenuItem);
        saveMenuItem.classList.add("menu-item");
        newBuildingMenuItem.innerHTML = "New building";
        mainNode.appendChild(newBuildingMenuItem);
        newBuildingMenuItem.classList.add("menu-item");
        logOutMenuItem.innerHTML = "Log out";
        logOutMenuItem.classList.add("menu-item");
        mainNode.appendChild(logOutMenuItem);
        infoTab.classList.add('infoTab');
        mainNode.appendChild(infoTab);
        infoTab.innerHTML = `<div class='controlsTitle'>Controls:</div>
        <div>Change color: 1,2,3,4</div>
        <div>Control camera: W,A,S,D</div>
        <div>Change brick size: +,-</div>
        <div>Rotate brick: Q,E</div>`;
    (function addClickListeners(){
        newBuildingMenuItem.addEventListener("click", (event)=>{
            game.elementGetter.getBricks().map((brick)=>{
                brick.parent.remove(brick);
                saveMenuItem.querySelector(".buildingName").value = "New Building";
            });
        });
        logOutMenuItem.addEventListener("click", (event)=>{
            location.reload();
        });
        buildingMenuItem.addEventListener("click", (event)=>
        {
            // Stop event inheritance:
            if(event.target.parentNode != document.querySelector(".sidemenu")){
                return;
            }
            let isActive = event.target.classList.contains("sidemenu-active");
            if(isActive){
                event.target.classList.remove("sidemenu-active");
            } else {
                event.target.classList.add("sidemenu-active");
            }
        })
        saveMenuItem.querySelector(".saveIcon").addEventListener("click", (event)=>{
            const buildingData = {
                buildingName: saveMenuItem.querySelector(".buildingName").value,
                playerLogin: game.playerLogin,
                bricks:[]
            }
            game.elementGetter.getBricks().map((brick)=>{
                const brickData ={
                    length: brick.children.length,
                    rotation: {x:brick.rotation.x, y:brick.rotation.y, z:brick.rotation.z},
                    position:brick.position,
                    materialIndex: brick.material.userData.materialIndex,
                }
                buildingData.bricks.push(brickData);
            });
            game.client.emit("saveBuilding",buildingData)
            addNewBuildingToHtmlList(buildingData.buildingName);
            game.playerBuildings.push(buildingData);
        })
    })();
    function addNewBuildingToHtmlList(buildingName){
        const buildingNode = document.createElement("div");
        const hamburger = document.createElement("div");
        const buildingTitle = document.createElement("span"); 
        buildingTitle.classList.add("buildingName");
        buildingTitle.innerHTML = buildingName;
        hamburger.classList.add("hamburger","open");
        for(var i=0; i<3; i++){
            hamburger.appendChild(document.createElement("span"));
        }
        buildingNode.appendChild(buildingTitle);
        buildingNode.appendChild(hamburger);

        buildingMenuItem.appendChild(buildingNode);

        buildingNode.addEventListener("click",(event)=>{
            if(event.target == hamburger || event.target.parentNode == hamburger){
                return;
            }
            game.elementGetter.getBricks().map((brick)=>{
                brick.parent.remove(brick);
            });
            const buildingData = game.playerBuildings.filter((el)=>{
                return el.buildingName == buildingName;
            });
            if(buildingData.length == 0){
                throw new Error(`Found no information about building ${buildingName}`);
            }
            buildingData[0].bricks.map((brick)=>{
                const material = loader.materials.brick[brick.materialIndex];
                const mesh = new Brick().getMesh();
                mesh.material = material;
                mesh.position.set(brick.position.x,brick.position.y,brick.position.z);
                mesh.rotation.set(brick.rotation.x ,brick.rotation.y ,brick.rotation.z);
                mesh.rotateY(-Math.PI/2)
                for(var i=0; i<brick.length-1; i++){
                    const subBrick = new Brick().getMesh();
                    subBrick.material = material;
                    subBrick.position.set(game.UNIT * (i+1),0,0);
                    mesh.add(subBrick);
                }
                game.scene.add(mesh);
            });
            saveMenuItem.querySelector(".buildingName").value = buildingName;
        });
        hamburger.addEventListener("click",()=>{
            game.client.emit("removeBuilding",game.playerLogin,buildingName);
            console.log(buildingName);
            let index = game.playerBuildings.map(function(el){return el.buildingName;}).indexOf(buildingName);
            buildingNode.remove();
            if(index == -1){ // no building found with such name
                return;
            } 
            game.playerBuildings.splice(index,1);
        });
    }
    function getNode()
    {
        return mainNode;
    }
    function logOut()
    {

    }
    //------------- Public: -------------------------
    this.getNode = getNode;
    this.logOut = logOut;
    this.addNewBuildingToHtmlList = addNewBuildingToHtmlList;
}