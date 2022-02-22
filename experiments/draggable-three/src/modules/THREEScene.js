import * as THREE from 'three'
import FirstPersonController from './FirstPersonController.js'
import Globe from './GlobeHelper.js'
import LineHelper from './LineHelper.js'
import Connection from './Connection.js'

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
    this.cameraController.onmove=()=> this.onCamMove();
    this.planes=[];
    this.connections=[];
    this.defaultMat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    this.mouse=new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.lineHelper=null;

    this.onLinkAdded=()=>{};

    domparent.addEventListener('click',(e)=>this.onClick(e));
    domparent.addEventListener('mousemove',(e)=>this.onMousemove(e));
    window.addEventListener('hashchange', (e)=>this.onHashChange(e));

    this.globeHelper = new Globe(3000, 16, 32, 64, 'white'); // Radius, num lat, num lon, segments, color
    this.globeHelper.position.copy(this.cameraController.camera.position);
    this.scene.add(this.globeHelper);

    const helper= new THREE.GridHelper(3,3);
    helper.scale.setScalar(100);
    this.scene.add(helper);

    this.renderer=new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth,window.innerHeight );
    this.setRendererSize();
    window.onresize=()=>{
      this.setRendererSize();
    }

    this.importNodes();
    this.importlinks();

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
      simPos=this.forceSimulation.getNodeById(item.h_uuid);
      item.position.set(simPos.x,simPos.y,simPos.z);
      if (simIsHot) {
        item.lookAt(this.cameraController.camera.position)
      }
    });

    if (simIsHot) {
      this.connections.forEach((item, i) => {
         item.update();
         item.midPoint.lookAt(this.cameraController.camera.position)
      });
    }



    this.renderer.render(this.scene,this.cameraController.camera);
    window.requestAnimationFrame(()=> this.render());
  }

  importNodes(){
    this.forceSimulation.simulation.nodes().forEach((item, i) => {
      const plane=createPlane(item,this.defaultMat)
      this.planes.push(plane);
      this.scene.add(plane)
    });
  }

  importlinks(){
    this.forceSimulation.simulation.force('link').links().forEach((item, i) => {
      const startObject = this.scene.getObjectByProperty('h_uuid',item.source.h_uuid)
      const endObject = this.scene.getObjectByProperty('h_uuid',item.target.h_uuid)
      this.connections.push(new Connection(this.scene,startObject,endObject,item));
    });

  }

  simDataChanged(){
    const nodes = this.forceSimulation.simulation.nodes();
    const planes = this.planes;

    // check which nodes are in the simulation but not in the scene -> add new plane to scene
    const toAdd =  nodes.filter((n)=>{
        return !planes.some((p) => n.h_uuid==p.h_uuid)
      });
    toAdd.forEach((item, i) => {
        const plane=createPlane(item,this.defaultMat)
        this.planes.push(plane);
        this.scene.add(plane)
      });

    // check which planes are in the scene but not in the simulation -> remove them from scene
    const toRemove = planes.filter((p)=>{
      return !nodes.some((n)=>n.h_uuid==p.h_uuid)
    })

    this.planes=planes.filter((p)=>{
      return nodes.some((n)=>n.h_uuid==p.h_uuid)
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

  castRay(){
    this.raycaster.setFromCamera(this.mouse, this.cameraController.camera);
    const intersects = this.raycaster.intersectObjects(this.planes);
    if (intersects.length > 0) {
      const targ = intersects[0].object;
      if (!this.isConnecting) {
        this.startConnection(targ);
      } else {
        this.finishConnection(targ);
      }

    }else {
      if(this.lineHelper) this.disposeConnection();
    }
  }

  onClick(e){
    this.castRay();
  }

  onMousemove(e){
    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    if (this.lineHelper) {
      this.lineHelper.endPosition = this.getWorldPosition(event.clientX,event.clientY,1.3);
      this.lineHelper.update();
    }
  }

  onHashChange() {
    const target = this.scene.getObjectByProperty('h_uuid',location.hash.substr(1));
    if (target) {
      this.cameraController.moveTo(target);
    }
  }

  onCamMove(){
    this.planes.forEach((item, i) => {
      item.lookAt(this.cameraController.camera.position)
    });
    this.connections.forEach((item, i) => {
      item.midPoint.lookAt(this.cameraController.camera.position)
    });

    if(this.lineHelper)  this.lineHelper.update();
  }

  startConnection(obj){
    if(this.lineHelper) this.lineHelper.dispose(this.scene);
    this.lineHelper = new LineHelper(obj);
    this.scene.add(this.lineHelper.line);
    this.isConnecting=true;
  }

  disposeConnection(){
    if(this.lineHelper) this.lineHelper.dispose(this.scene);
    this.isConnecting=false;
  }

  finishConnection(obj){
    if(this.lineHelper) this.lineHelper.dispose(this.scene);
    this.isConnecting=false;
    if(obj==this.lineHelper.startObject) return;
    const dist = confirm('Keep distance or unset Distance?') ? obj.position.distanceTo(this.lineHelper.startObject.position) : 100;
    const center = new THREE.Vector3().copy(this.lineHelper.startObject).lerp(obj.position,0.5);
    const node = {
      h_uuid:'_'+Date.now()+makeid(5),
      name: 'connection Node',
      to:[],
      from:[],
      x:center.x,
      y:center.y,
      z:center.z,
      h_type: 'connectionNode'
    }
    const l = {
      link1:
        {
          source : this.lineHelper.startObject.h_uuid,
          target : node.h_uuid,
          distance : dist/2,
          name:  '',
          h_type: 'connection',
          h_uuid:'_'+Date.now()+makeid(5),
          from:[],
          to:[],
          text:''
        },
      node:node,
      link2:
        {
          source : node.h_uuid,
          target : obj.h_uuid,
          distance : dist/2,
          name:  '',
          h_type: 'connection',
          h_uuid:'_'+Date.now()+makeid(5),
          from:[],
          to:[],
          text:''
        }
    }

    // callBack to Graph.vue to update simulation data
    this.onLinkAdded(l);
    this.connections.push(new Connection(this.scene,this.lineHelper.startObject,obj,l,this.defaultMat));
  }
}

function createPlane(item,mat) {
  const geometry = new THREE.PlaneGeometry( 100, 100 );
  const plane = new THREE.Mesh( geometry, mat );
  plane.name=item.name;
  plane.h_name=item.name;
  plane.h_uuid=item.h_uuid;
  plane.h_type=item.h_type;
  return plane;
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}

export default THREEScene