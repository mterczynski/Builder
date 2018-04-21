function CelShader()
{
    const outlineMaterial = new THREE.MeshBasicMaterial({color : "rgb(0,0,0)", side: THREE.BackSide});
    function getOutline(mesh,scale)
    {
        const outline = new THREE.Mesh(mesh.geometry, outlineMaterial);
        outline.name = "Outline";
        outline.scale.multiplyScalar(scale);
        return outline;
    }
    function addOutline(mesh, scale)
    {
        mesh.add(getOutline(mesh,scale));
    }

    this.getOutline = getOutline;
    this.addOutline = addOutline;
}
