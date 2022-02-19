import * as THREE from 'three'
import FirstPersonController from './FirstPersonController.js'
import Globe from './GlobeHelper.js'

class THREEScene {
  constructor(domparent,forceSimulation,cameraSettings) {
    this.scene = new THREE.Scene();
    this.forceSimulation=forceSimulation;
    this.forceSimulation.onDataChange=()=>{this.simDataChanged()};
    this.scene.background = new THREE.Color( '#e3e3e3' );
    this.width=window.innerWidth;
    this.height=window.innerWidth;
    this.aspect=this.width/this.height;
    this.cameraController=new FirstPersonController(domparent,cameraSettings);
    this.planes=[];
    this.defaultMat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

    this.globeHelper = new Globe(3000, 16, 32, 64, 'white'); // Radius, num lat, num lon, segments, color
    this.globeHelper.position.copy(this.cameraController.camera.position);
    this.scene.add(this.globeHelper);

    const helper= new THREE.GridHelper(3,3);
    helper.scale.setScalar(200);
    this.scene.add(helper);

    this.renderer=new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth,window.innerHeight );
    this.setRendererSize();
    window.onresize=()=>{
      this.setRendererSize();
    }

    this.importNodes();

    domparent.appendChild(this.renderer.domElement);
    this.render();
  }

  setRendererSize(){
    this.width=window.innerWidth;
    this.height=window.innerHeight;

    this.aspect=this.width/this.height;
    this.cameraController.updateSize(this.aspect);

    this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.width, this.height );
  }

  render(){
    this.cameraController.update();
    this.forceSimulation.update();
    let simPos;
    const simIsHot=this.forceSimulation.isHot;
    this.planes.forEach((item, i) => {
      simPos=this.forceSimulation.getNodeById(item.hyperID);
      item.position.set(simPos.x,simPos.y,simPos.z);
      if (simIsHot) {
        item.lookAt(this.cameraController.camera.position)
      }
    });

    this.renderer.render(this.scene,this.cameraController.camera);
    window.requestAnimationFrame(()=> this.render());
  }

  importNodes(){

    this.forceSimulation.simulation.nodes().forEach((item, i) => {
      const geometry = new THREE.PlaneGeometry( 100, 100 );
      const plane = new THREE.Mesh( geometry, this.defaultMat );
      plane.hyperID=item.hyperID;
      this.planes.push(plane);
      this.scene.add(plane)
    });

  }

  simDataChanged(){
    const nodes = this.forceSimulation.simulation.nodes();
    const planes = this.planes;
    const toAdd =  nodes.filter((n)=>{
        return !planes.some((p) => n.hyperID==p.hyperID)
      });
    toAdd.forEach((item, i) => {
        const geometry = new THREE.PlaneGeometry( 100, 100 );
        const plane = new THREE.Mesh( geometry, this.defaultMat );
        plane.hyperID=item.hyperID;
        this.planes.push(plane);
        this.scene.add(plane)
      });

    const toRemove = planes.filter((p)=>{
      return !nodes.some((n)=>n.hyperID==p.hyperID)
    })

    this.planes=planes.filter((p)=>{
      return nodes.some((n)=>n.hyperID==p.hyperID)
    })
    toRemove.forEach((item, i) => {
      this.scene.remove(item)
    });
  }

  getWorldPosition(x,y,offset=500){
    const vec = new THREE.Vector3(); // create once and reuse
    const pos = new THREE.Vector3(); // create once and reuse

    vec.set(
        ( x / window.innerWidth ) * 2 - 1,
        - ( y / window.innerHeight ) * 2 + 1,
        0.5 );

    vec.unproject( this.cameraController.camera );

    vec.sub( this.cameraController.camera.position ).normalize().multiplyScalar(offset);

    pos.copy( this.cameraController.camera.position ).add( vec );
    return pos;
  }
}

export default THREEScene