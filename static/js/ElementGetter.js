function ElementGetter()
{
    //private:
    function getBricks()
    {
        return game.scene.children.filter((el)=>{
            return el.name == "Brick";
        })
    }
    //public:
    this.getBricks = getBricks;
}