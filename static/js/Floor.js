class Floor
{
    constructor(quantX, quantZ)
    {
        const lineMaterial = new THREE.LineBasicMaterial({color: "rgb(0,0,0)"});
        
        const planeGeometry = new THREE.PlaneGeometry(game.UNIT,game.UNIT);
        const planeMaterial = new THREE.MeshBasicMaterial({color:"rgb(100,100,100)"});
        const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial);
        const floorObject = new THREE.Object3D();
        const dimX = quantX * game.UNIT;
        const dimZ = quantZ * game.UNIT;
        for(let i = 0; i < quantX; i++)
        {
            for(let j = 0; j < quantZ; j++)
            {
                const mesh = planeMesh.clone();
                mesh.position.set
                (
                    i * game.UNIT - dimX / 2 + game.UNIT/2,
                    0,
                    j * game.UNIT - dimZ / 2 + game.UNIT/2
                );
                mesh.rotateX(-Math.PI / 2)
                floorObject.add(mesh);
            }
        }
        
        //------------- Lines: ------------------------
        for(let i = 0; i < quantX + 1; i++)
        {
            const lineGeometry = new THREE.Geometry();
            const line = new THREE.Line(lineGeometry, lineMaterial);  
            lineGeometry.vertices.push(new THREE.Vector3(- dimX / 2 + i * game.UNIT, 0.01, - dimZ / 2));
            lineGeometry.vertices.push(new THREE.Vector3(- dimX / 2 + i * game.UNIT, 0.01, dimZ / 2));
            floorObject.add(line);
        }
        for(let i = 0; i < quantZ + 1; i++)
        {
            const lineGeometry = new THREE.Geometry();
            const line = new THREE.Line(lineGeometry, lineMaterial);  
            lineGeometry.vertices.push(new THREE.Vector3(- dimX / 2 , 0.01, - dimZ / 2 + i * game.UNIT));
            lineGeometry.vertices.push(new THREE.Vector3(dimX / 2 , 0.01, - dimZ / 2 + i * game.UNIT));
            floorObject.add(line);
        }
        
        this.object3d = floorObject;
    }
    getObject3d()
    {
        return this.object3d;
    }
}
