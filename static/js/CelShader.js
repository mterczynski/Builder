function CelShader() {
  let scale = 1.07;
  const outlineRefs = [];

  function updateCelShading(change) {
    outlineRefs.forEach(outline => outline.scale.multiplyScalar(1 / scale));
    scale += change;
    outlineRefs.forEach(outline => outline.scale.multiplyScalar(scale));
  }

  document.addEventListener("keydown", ({ key }) => {
    if (key === "o") {
      updateCelShading(0.005);
    } else if (key === "p") {
      updateCelShading(-0.005);
    }
  });

  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: "rgb(0,0,0)",
    side: THREE.BackSide
  });
  function getOutline(mesh, scale) {
    const outline = new THREE.Mesh(mesh.geometry, outlineMaterial);
    outline.name = "Outline";
    outline.scale.multiplyScalar(scale);

    outlineRefs.push(outline);

    return outline;
  }
  function addOutline(mesh, scale) {
    mesh.add(getOutline(mesh, scale));
  }

  this.getOutline = getOutline;
  this.addOutline = addOutline;
}
