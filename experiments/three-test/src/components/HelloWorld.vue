<template>
  <div ref="scene">

  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  mounted(){
    let scene = new THREE.Scene();

    scene.add(new THREE.GridHelper(3,3));
    scene.add( new THREE.AxesHelper( 5 ));

    let renderer = new THREE.WebGLRenderer({antialias:true});

    console.log(window.innerWidth);
    const w =window.innerWidth;
    const h =window.innerHeight;
    this.$refs.scene.appendChild(renderer.domElement);

    renderer.setSize( w,h);

    const camera = new THREE.PerspectiveCamera( 45, w/h, 1, 1000 );
    camera.position.set(1,1,1);
    camera.lookAt(0,0,0)
    scene.add( camera );
    render();
    function render(){
      renderer.render(scene,camera);
      window.requestAnimationFrame(()=> render());
      // this.cameraController.update()
  }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
canvas{
  position:fixed;
  top:0;
  left:0;
}
</style>
