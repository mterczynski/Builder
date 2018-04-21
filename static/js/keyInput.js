document.addEventListener("keydown",(e)=>
{
    if(e.target == document.body)
    {
        game.pressedKeys[e.key] = true;
    }
});
document.addEventListener("keyup",(e)=>
{
    game.pressedKeys[e.key] = false;
});
