class Brick {
  constructor() {
    this.mesh = loader.meshes.brick.clone();
    game.celShader.addOutline(this.mesh, 1.07);
  }
  getMesh() {
    return this.mesh;
  }
}
