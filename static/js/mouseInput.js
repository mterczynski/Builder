function addMouseEvents(){
    document.addEventListener("click", (e)=>{
        game.lastClicked = new THREE.Vector2();
        game.lastClicked.x = (e.clientX / window.innerWidth) * 2 - 1;
        game.lastClicked.y = -(e.clientY / window.innerHeight) * 2 + 1;
    })
}
