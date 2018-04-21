class Brick
{
    constructor()
    {
        this.mesh = loader.meshes.brick.clone();
        game.celShader.addOutline(this.mesh,1.1);
    }
    getMesh()
    {
        return this.mesh;
    }
}