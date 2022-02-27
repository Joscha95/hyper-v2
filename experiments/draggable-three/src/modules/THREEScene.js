import * as THREE from 'three'
import FirstPersonController from '@/modules/FirstPersonController.js'
import {TransformControls} from '@/modules/TransformControls.js'
import Globe from '@/modules/GlobeHelper.js'
import LineHelper from '@/modules/LineHelper.js'
import Connection from '@/modules/Connection.js'
import ContentBlock from '@/modules/ContentBlock.js'
import {CSS3DRenderer,CSS3DObject} from '@/modules/CSS3DRenderer.js'
import {makeid,map} from '@/modules/Helpers.js'

class THREEScene {
  constructor(domparent,forceSimulation,cameraSettings,store) {
    this.scene = new THREE.Scene();
    this.forceSimulation=forceSimulation;
    this.forceSimulation.onDataChange=()=>{this.simDataChanged()};
    this.scene.background = new THREE.Color( '#e3e3e3' );
    this.width=window.innerWidth;
    this.height=window.innerWidth;
    this.aspect=this.width/this.height;
    this.cameraController=new FirstPersonController(domparent,cameraSettings);
    this.cameraController.onmove=()=> this.onCamMove();
    this.blocks=[];
    this.connections=[];
    this.defaultMat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    this.mouse=new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.lineHelper = null;
    this.store=store;

    this.onLinkAdded = ()=>{};

    domparent.addEventListener('mousedown',(e)=>this.onClick(e));
    domparent.addEventListener('mousemove',(e)=>this.onMousemove(e));
    window.addEventListener('hashchange', (e)=>this.onHashChange(e));
    window.addEventListener('keydown', (e)=>this.onKeyDown(e));

    this.globeHelper = new Globe(3000, 16, 32, 64, 'rgb(240,240,240)'); // Radius, num lat, num lon, segments, color
    this.globeHelper.position.copy(this.cameraController.camera.position);
    this.scene.add(this.globeHelper);

    const helper = new THREE.GridHelper(3,3);
    helper.scale.setScalar(100);
    this.scene.add(helper);

    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.cssRenderer.domElement.style.position = 'fixed';
    this.cssRenderer.domElement.style.top = '0px';
    this.cssRenderer.domElement.style.left = '0px';
    this.cssRenderer.domElement.style.pointerEvents = 'none';

    document.querySelectorAll('.CSS3DRenderer').forEach((item, i) => {
      item.remove()
    });

    this.cssRenderer.domElement.classList.add('CSS3DRenderer');
    document.body.appendChild(this.cssRenderer.domElement);

    this.renderer=new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth,window.innerHeight );
    this.setRendererSize();

    this.objectControls = new TransformControls(this.cameraController.camera, this.renderer.domElement);
    this.objectControls.addEventListener('mouseDown', () => {this.objectTouched()});
    this.objectControls.addEventListener('mouseUp', () => {this.objectReleased()});
    this.objectControls.addEventListener('change', () => {this.objectChanged()});
    this.objectControls.attachedContent=null;
    this.scene.add(this.objectControls);

    window.onresize=()=>{
      this.setRendererSize();
    }

    this.importNodes();

    domparent.appendChild(this.renderer.domElement);
    this.render();

    if(store.selectedObject) this.focusItem(store.selectedObject.h_uuid,store.selectedObject.h_type)
  }

  setRendererSize(){
    this.width=window.innerWidth;
    this.height=window.innerHeight;

    this.aspect=this.width/this.height;
    this.cameraController.updateSize(this.aspect);

    this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.width, this.height );
		this.cssRenderer.setSize( this.width, this.height );
  }

  render(){
    this.cameraController.update();
    this.forceSimulation.update();
    let simPos;

    if (this.forceSimulation.isHot) {
      this.blocks.forEach((item, i) => {
        simPos=this.forceSimulation.getNodeById(item.h_uuid);
        if (item.isDragged) {
          if (!simPos.isFixed) {
            simPos.x=item.position().x;
            simPos.y=item.position().y;
            simPos.z=item.position().z;
          }else {
            simPos.fx=item.position().x;
            simPos.fy=item.position().y;
            simPos.fz=item.position().z;
          }

          this.forceSimulation.reheat()
        }else {
          item.setPos(simPos);
        }
        item.lookAt(this.cameraController.camera.position)
      });

      this.connections.forEach((item, i) => {
         item.update();
      });
    }




    this.renderer.render(this.scene,this.cameraController.camera);
    this.cssRenderer.render(this.scene,this.cameraController.camera);
    window.requestAnimationFrame(()=> this.render());
  }

  importNodes(){
    const nodes = this.forceSimulation.simulation.nodes();
    nodes.forEach((item, i) => {
      this.blocks.push(new ContentBlock(this.scene,item,this.defaultMat,{cssResolution:.5}));
    });

    // let startObject,middleObject,endObject,con;
    nodes.filter((n) => n.h_type=='connection').forEach((item, i) => {
      const startObject=this.blocks.find((p)=> p.h_uuid==item.sourceID);
      const middleObject=this.blocks.find((p)=> p.h_uuid==item.h_uuid);
      const endObject=this.blocks.find((p)=> p.h_uuid==item.targetID)
      const con = new Connection(this.scene,startObject,middleObject,endObject)
      middleObject.onFocus=()=>{con.focus()};
      middleObject.onBlur=()=>{con.blur()};
      this.connections.push(con);
    });

  }

  simDataChanged(){
    const nodes = this.forceSimulation.simulation.nodes();
    const planes = this.blocks;

    // check which nodes are in the simulation but not in the scene -> add new plane to scene
    const toAdd =  nodes.filter((n)=>{
        return !planes.some((p) => n.h_uuid==p.h_uuid)
      });
    toAdd.forEach((item, i) => {
        this.blocks.push(new ContentBlock(this.scene,item,this.defaultMat,{cssResolution:.5}));
      });

    // check which planes are in the scene but not in the simulation -> remove them from scene
    const toRemove = planes.filter((p)=>{
      return !nodes.some((n)=>n.h_uuid==p.h_uuid)
    })

    this.blocks=planes.filter((p)=>{
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

  castRay(point){
    this.raycaster.setFromCamera(point, this.cameraController.camera);
    return this.raycaster.intersectObjects(this.blocks.map((b)=>b.plane));
  }

  onClick(e){
    const intersects = this.castRay(this.mouse);
    if (intersects.length > 0) {
      const targ = this.blocks.find((b)=> b.h_uuid==intersects[0].object.refID) ;
      if (!this.isConnecting) {
        this.startConnection(targ);
      } else {
        this.finishConnection(targ);
      }

    }else {
      if(this.lineHelper) this.disposeConnection();
      if (this.cameraController.enabled) {
        this.objectControls.detach();
        if(this.store.selectedObject) this.store.selectedObject.sceneElement.blur();
        this.store.selectedObject=null;
      }

    }
  }

  onKeyDown(event) {

    // if ((editMode) &&
    //     (event.which == 83 && (event.ctrlKey||event.metaKey) || (event.which == 19))){
    //   event.preventDefault();
    //   event.stopPropagation();
    //   saveScene();
    //   return;
    // }
    switch (event.keyCode) {
      case 37:
        // left arrow
        history.go(-1);
        break;
      case 39:
        // right arrow
        history.go(+1);
        break;
      case 67:
        // c
          const targ = this.objectControls.object;
          if( targ) this.cameraController.moveTo(targ);
        break;
      case 69:
        // e editmode
      case 84:
        // t
        // if (!editMode) break;
        // this.objectControls.setMode('translate');
        break;
      case 77:
        // m
        // if (!editMode) break;
        // this.objectControls.setMode('translate');
        break;
      case 76:
        // l add lookout
        break;
      case 88:
        // x delete
        break;
      default:
    }

  }

  focusItem(h_uuid,h_type){
    if(this.focusedItem) this.focusedItem.blur();
    this.focusedItem = this.blocks.find((e) => e.h_uuid==h_uuid);
    if(this.focusedItem) {
      this.focusedItem.focus();
      if(this.focusedItem.h_type=='connection') {
        this.objectControls.detach();
        return;
      }
      this.objectControls.attach(this.focusedItem);
    }
  }

  onMousemove(e){
    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    if (this.lineHelper) {
      this.lineHelper.endPosition = this.getWorldPosition(event.clientX,event.clientY,1.3);
      this.lineHelper.update();
    }
  }

  onHashChange() {
    const target = this.blocks.find((b)=>b.h_uuid==location.hash.substr(1));
    if (target) {
      this.cameraController.moveTo(target.plane);
    }
  }

  onCamMove(){
    this.blocks.forEach((item, i) => {
      item.lookAt(this.cameraController.camera.position)
    });
    const intersects = this.castRay(new THREE.Vector2());
    if (intersects.length > 0 && intersects[0].distance<600) {
      this.store.activeChainElement=intersects[0].object.refID;
    }else {
      this.store.activeChainElement = undefined;
    }

    if(this.lineHelper)  this.lineHelper.update();
  }

  objectTouched() {
    this.cameraController.enabled = false;
    this.objectControls.attachedContent.isDragged=true;
    this.forceSimulation.reheat();
  }

  objectReleased() {
    this.cameraController.enabled = true;
    this.objectControls.attachedContent.isDragged=false;
  }

  objectChanged(e) {

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

    const center = new THREE.Vector3().copy(this.lineHelper.startObject.position()).lerp(obj.position(),0.5);
    const node = {
      h_uuid:'H'+Date.now()+makeid(5),
      name: this.lineHelper.startObject.name+' ↭ '+obj.name,
      to:[],
      val:1,
      from:[],
      content:this.lineHelper.startObject.name+' ↭ '+obj.name,
      initDistance:0,
      isFixed:false,
      x:center.x,
      y:center.y,
      z:center.z,
      sourceID : this.lineHelper.startObject.h_uuid,
      targetID : obj.h_uuid,
      h_type: 'connection',
      links:[]
    }

    const middleNodePlane = new ContentBlock(this.scene,node,this.defaultMat,{cssResolution:.5});
    const con = new Connection(this.scene, this.lineHelper.startObject, middleNodePlane, obj);
    middleNodePlane.onFocus=()=>{con.focus()};
    middleNodePlane.onBlur=()=>{con.blur()};
    this.blocks.push(middleNodePlane);

    const nl=con.createNew(node);
    this.connections.push(con);

    // callBack to Graph.vue to update simulation data
    this.onLinkAdded(nl);

  }
}

export default THREEScene