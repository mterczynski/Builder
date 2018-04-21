const loader = 
{
    loadedPercentage:0,
    materials:
    {
        selectedTile: null,
        brick:
        [
        ]
    },
    geometries:
    {
        brick:null
    },
    meshes:
    {
        brick:null
    },
    loadMaterials()
    {
        loader.materials. selectedTile = new THREE.MeshBasicMaterial({color:"rgb(0,255,0)"});
        loader.materials.brick = 
        [
            new THREE.MeshToonMaterial({color:"rgb(255,0,0)"}),
            new THREE.MeshToonMaterial({color:"rgb(0,255,0)"}),
            new THREE.MeshToonMaterial({color:"rgb(0,130,250)"}),
            new THREE.MeshToonMaterial({color:"rgb(255,255,0)"})
        ];
        loader.materials.brick.map((el,index)=>{
            el.userData = {materialIndex: index};
        });
    },
    loadGeometries()
    {

    },
    loadMeshes()
    {
        const loadBrick = function loadBrick()
        {
            const finalGeo = new THREE.Geometry();
            const boxGeo = new THREE.BoxGeometry(game.UNIT,game.UNIT,game.UNIT);
            const cylinderGeo = new THREE.CylinderGeometry(game.UNIT * 0.1, game.UNIT * 0.1, game.UNIT * 0.4, 32 ); // radiusTop, radiusBottom, height, radiusSegments
            const boxMesh = new THREE.Mesh(boxGeo);
            const cylinderMesh = new THREE.Mesh(cylinderGeo);
            
            boxMesh.updateMatrix();
            finalGeo.merge(boxMesh.geometry, boxMesh.matrix);

            for(let i=0; i<2; i++)
            {
                for(let j=0; j<2; j++)
                {
                    const cylinderMeshClone = cylinderMesh.clone();
                    cylinderMeshClone.position.set
                    (
                        game.UNIT * i /2 - game.UNIT / 4,
                        game.UNIT/2,
                        game.UNIT * j /2 - game.UNIT / 4
                    );
                    cylinderMeshClone.updateMatrix();
                    finalGeo.merge(cylinderMeshClone.geometry, cylinderMeshClone.matrix);
                }
            }
            
            const finalMesh = new THREE.Mesh(finalGeo,loader.materials.brick[0]);
            finalMesh.name = "Brick";
            finalMesh.userData.level = 0;
            finalMesh.userData.length = 1;
            loader.meshes.brick = finalMesh;
        }
        loadBrick();
    },
    init()
    {
        const createLoadingScreen = function createLoadingScreen()
        {
            const loadingScreen = document.createElement("div");
            const loadingBar = document.createElement("div");
            const progress = document.createElement("div");
            const loadingMessage = document.createElement("span");
            const currentPackageSizeIndicator = document.createElement("div");
            //---------- Set attributes: ----------------------
            loadingScreen.setAttribute("class","loadingScreen");
            loadingBar.setAttribute("class","loadingBar");
            progress.setAttribute("class","progress");
            loadingMessage.setAttribute("class","loadingMessage");
            currentPackageSizeIndicator.setAttribute("class","currentPackageSizeIndicator");
            //---------- Append: ------------------------------
            loadingBar.appendChild(progress);
            loadingBar.appendChild(currentPackageSizeIndicator);
            loadingBar.appendChild(loadingMessage);
            loadingScreen.appendChild(loadingBar);
            document.body.appendChild(loadingScreen);
        }
        const loadScripts = function loadScripts()
        {
            let i=0;
            const callbackLoadFunction = function()
            {
                var currentLoadPercentage = Number(progress.style.width.split("%")[0]);
                if(i>=toLoad.length)
                {
                    loadingMessage.innerHTML = "All data loaded!";
                    currentPackageSizeIndicator.remove();
                    loader.loadMaterials();
                    loader.loadGeometries();
                    loader.loadMeshes();
                    setTimeout(function removeLoadingScreen(){
                        document.querySelector(".loadingScreen").remove();
                        game.init();
                    },300); 
                    return;
                }
                loadingMessage.innerHTML = `Loading ${toLoad[i].name}...<br> [${i}/${toLoad.length}]`;
                //--------- CurrentPackageSizeIndicator: ------------------------------------
                currentPackageSizeIndicator.style.left = (currentLoadPercentage) + "%";
                currentPackageSizeIndicator.style.width = (toLoad[i].size / totalSize * 100) + "%";
                //--------- Load script:  -------------------------------
                loader.loadScript(toLoad[i].src,function callback()
                {
                    var finish = new Date().getTime(); // currently not used, can be used for checking download time
                    currentLoadPercentage = Number(progress.style.width.split("%")[0]);
                    progress.style.width = (currentLoadPercentage + toLoad[i].size / totalSize * 100) + "%";      
                    i++;
                    callbackLoadFunction(); 
                })
            }
            callbackLoadFunction();
        };
        const toLoad = 
        [
            //------- Libraries: -----------------------
            {
                src:"libs/preventNavigatingBack.js",
                name:"",
                size:1
            },
            {
                src:"libs/Stats.js",
                name:"Stats",
                size:3
            },
            {
                src:"libs/webGLDetector.js",
                name:"WebGL Detector",
                size:3
            },
            {
                src:"libs/three.js",
                name:"Three.js",
                size:1054
            },
            {
                src:"libs/socket.io.js",
                name:"Socket.io",
                size:96
            },
            //--------- User scripts: ---------------
            {
                src:"js/Brick.js",
                name:"game objects",
                size:1
            },
            {
                src:"js/clientSocket.js",
                name:"game objects",
                size:2
            },
            {
                src:"js/CelShader.js",
                name:"game objects",
                size:2
            },
            {
                src:"js/Floor.js",
                name:"game objects",
                size:3
            },
            {
                src:"js/game.js",
                name:"game objects",
                size:8
            },
            {
                src:"js/MessageBox.js",
                name:"game objects",
                size:1
            },
            {
                src:"js/ElementGetter.js",
                name:"game objects",
                size:1
            },
            {
                src:"js/AdminPanel.js",
                name:"user interface",
                size:1
            },
            {
                src:"js/LoginScreen.js",
                name:"game objects",
                size:1
            },
            {
                src:"js/keyInput.js",
                name:"game objects",
                size:1
            },
            {
                src:"js/mouseInput.js",
                name:"game objects",
                size:1
            },
            {
                src:"js/LoginScreen.js",
                name:"user interface",
                size:1
            },
            {
                src:"js/SideMenu.js",
                name:"user interface",
                size:1
            },
        ];
        const start = new Date().getTime();
        let progress;
        let loadingMessage;
        let currentPackageSizeIndicator;
        let totalSize = 0;

        for(let i=0; i<toLoad.length; i++)
        {
            totalSize += toLoad[i].size;
        }
        createLoadingScreen();
        progress = document.querySelector(".progress");
        loadingMessage = document.querySelector(".loadingMessage");
        currentPackageSizeIndicator = document.querySelector(".currentPackageSizeIndicator");

        progress.style.width = "0%";
        currentPackageSizeIndicator.style.width = "0%";

        loadScripts();
    },
    loadScript(src, callback) 
    {
        const script = document.createElement('script');
        let loaded;
        
        script.setAttribute('src', src);
        if (callback) 
        {
            script.onreadystatechange = script.onload = function() 
            {
                if (!loaded) 
                {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    }  
}