import * as THREE from 'three'

class Scene {
  constructor(domparent) {
    this.domparent=domparent;
    this.scene=new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    this.scene.add( this.camera );

    window.onresize=()=>{
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    domParent.appendChild(this.renderer.domElement);
    this.render();
  }

  render(){
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
}

export{Scene}