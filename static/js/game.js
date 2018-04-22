const game = 
{
    UNIT:35,
    playerLogin: null,
    playerBuildings: [],
    sidemenu: null,
    celShader: null,
    elementGetter: null,
    pressedKeys: {},
    lastClicked: null, // for raycasting
    lastPlacedBrick: null,
    client: null, // socket.io client
    scene: new THREE.Scene(),
    renderer: null,
    raycaster: new THREE.Raycaster(),
    // camera: new THREE.OrthographicCamera
    // (
    //     window.innerWidth / -2, // left
    //     window.innerWidth / 2, // right
    //     window.innerHeight / 2, // top
    //     window.innerHeight / -2, // bottom
    //     0.1 // near
    // ),
    camera :
       new THREE.PerspectiveCamera
       (
           45,
           window.innerWidth / window.innerHeight,
           0.1,
           10000
       ),
    init()
    {
        clientSocket.init(); // sockets, connection with server
        let loginScreen = new LoginScreen();
        document.body.appendChild(loginScreen.getNode());
        loginScreen.addEventListeners();
       // game.start();
    },
    start()
    {
        //----------- Add mouse events (for raycasting): ---------------
        setTimeout(()=>{addMouseEvents();},50)
        //----------- Add element getter: ---------------------------
        game.elementGetter = new ElementGetter();
        //------------ Add admin panel: -----------------------------
        if(game.playerLogin === "admin"){
            document.body.appendChild(new AdminPanel().getNode());
        }
        //----------- Show sidemenu add click event listeners: ------
        const sidemenu = new Sidemenu();
        game.sidemenu = sidemenu;
        document.body.appendChild(sidemenu.getNode());
        game.client.emit("getListOfBuildings",game.playerLogin);
        //---------- Add point light: --------------------------------
        const light = new THREE.PointLight();
        light.position.set(0,600,0);
        game.scene.add(light);
        //---------- Add cel shader: ---------------------------------
        game.celShader = new CelShader();
        //---------- Create canvas: ----------------------------------
        const canvasNode = document.createElement("canvas");
        canvasNode.id = "mainCanvas";
        document.body.appendChild(canvasNode);
        //---------- Set renderer settings: --------------------------
        game.renderer = new THREE.WebGLRenderer({canvas: document.getElementById('mainCanvas'), antialias:true});
		game.renderer.setPixelRatio(window.devicePixelRatio);
		game.renderer.setSize(window.innerWidth, window.innerHeight);
		game.renderer.setClearColor("rgb(220,220,220)");
        //---------- Resizable canvas: ---------------------
        window.addEventListener( 'resize', function()
        {
            game.camera.left = window.innerWidth / -2;
            game.camera.right = window.innerWidth / 2;
            game.camera.top = window.innerHeight / 2;
            game.camera.bottom = window.innerHeight / -2;
            game.camera.updateProjectionMatrix();
            game.renderer.setSize( window.innerWidth, window.innerHeight );
        });
        //--------- Create floor: ----------------
        let floor = new Floor(15,15).getObject3d();
        game.scene.add(floor);
        //--------- Set camera: ------------------
        game.camera.position.set(400,400,50);
        game.camera.lookAt({x:0,y:0,z:0});
        game.camera.userData.orbitAngle = 0;
        game.camera.userData.orbitRange = 1200;
        game.camera.userData.orbitSpeed = 0.03;
        game.camera.userData.verticalSpeed = 10;
        //--------- Create axis helper: --------------------------
        const axisHelper = new THREE.AxisHelper(game.UNIT * 10, game.UNIT * 10, game.UNIT * 10);
        // game.scene.add(axisHelper);
        //--------- Start rendering: ----------------------------
        game.render();
    },
    render(){
        //------------- Brick controls: ---------------------------------------
        if(game.pressedKeys["1"]){
            if(game.lastPlacedBrick){
                game.lastPlacedBrick.children.map((el)=>{
                    if(el.name != "Outline"){
                        el.material = loader.materials.brick[0];
                    }
                })
                game.lastPlacedBrick.material = loader.materials.brick[0];
            }
        }
        if(game.pressedKeys["2"]){
            if(game.lastPlacedBrick){
                game.lastPlacedBrick.children.map((el)=>{
                    if(el.name != "Outline"){
                        el.material = loader.materials.brick[1];
                    }
                })
                game.lastPlacedBrick.material = loader.materials.brick[1];
            }
        }
        if(game.pressedKeys["3"]){
            if(game.lastPlacedBrick){
                game.lastPlacedBrick.children.map((el)=>{
                    if(el.name != "Outline"){
                        el.material = loader.materials.brick[2];
                    }
                })
                game.lastPlacedBrick.material = loader.materials.brick[2];
            }
        }
        if(game.pressedKeys["4"]){
            if(game.lastPlacedBrick){
                game.lastPlacedBrick.children.map((el)=>{
                    if(el.name != "Outline"){
                        el.material = loader.materials.brick[3];
                    }
                })
                game.lastPlacedBrick.material = loader.materials.brick[3];
            }
        }
        if(game.pressedKeys["-"]){
            game.pressedKeys["-"] = false;
            if(game.lastPlacedBrick && game.lastPlacedBrick.userData.length > 1){
                game.lastPlacedBrick.userData.length -= 1;
                game.lastPlacedBrick.remove(game.lastPlacedBrick.children[game.lastPlacedBrick.children.length-1]);
            }   
        }
        if(game.pressedKeys["+"] || game.pressedKeys["="]){
            game.pressedKeys["+"] = false;
            game.pressedKeys["="] = false;
            if(game.lastPlacedBrick){
                game.lastPlacedBrick.userData.length += 1;
                let brick = new Brick().getMesh();
                brick.material = game.lastPlacedBrick.material;
                brick.position.z = game.UNIT * (game.lastPlacedBrick.userData.length -1);
                game.lastPlacedBrick.add(brick);
            } 
        }
        if(game.pressedKeys["q"]){
            game.pressedKeys["q"] = false;
            if(game.lastPlacedBrick){
                game.lastPlacedBrick.rotateY(Math.PI/2);
                console.log(game.lastPlacedBrick.userData)
            }
        }
        if(game.pressedKeys["e"]){
            game.pressedKeys["e"] = false;
            if(game.lastPlacedBrick){
                game.lastPlacedBrick.rotateY(-Math.PI/2);
            }
        }
        
        //------------- Camera controls: ---------------------------------------
        if(game.pressedKeys.a){
            game.camera.userData.orbitAngle += game.camera.userData.orbitSpeed;
        }
        if(game.pressedKeys.d){
            game.camera.userData.orbitAngle -= game.camera.userData.orbitSpeed;
        }
        if(game.pressedKeys.w){
            game.camera.position.y +=  game.camera.userData.verticalSpeed;
        }
        if(game.pressedKeys.s){
            game.camera.position.y -=  game.camera.userData.verticalSpeed;
        }
        game.camera.position.x = Math.cos(game.camera.userData.orbitAngle) * game.camera.userData.orbitRange;
        game.camera.position.z = Math.sin(game.camera.userData.orbitAngle) * game.camera.userData.orbitRange;
        game.camera.lookAt({x:0,y:0,z:0});
        //------------- Raycasting: ---------------------------------------
        if(game.lastClicked)
        {
            game.raycaster.setFromCamera(game.lastClicked, game.camera);
            const intersects = game.raycaster.intersectObjects( game.scene.children, true );
            if(intersects.length > 0 && intersects[0].object.type != "LineSegments" && intersects[0].object.type != "Line")
            {
                const selected = intersects[0].object;
                var vector = new THREE.Vector3();
                vector.setFromMatrixPosition( selected.matrixWorld );
                if(game.lastClicked)
                {       
                    const position = selected.position;
                    const brick = new Brick().getMesh();

                    game.lastPlacedBrick = brick;
            
                    brick.position.set
                    (
                        vector.x,
                        vector.y + game.UNIT/2,
                        vector.z
                    );
                    if(["Brick","Outline"].includes(selected.name))
                    {
                        brick.position.y += game.UNIT/2;
                    }
                    game.scene.add(brick);
                }
            }
            game.lastClicked = null;
        }
        
        game.renderer.render(game.scene, game.camera);
        requestAnimationFrame(game.render);
    }
}