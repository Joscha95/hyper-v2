import * as THREE from 'three'
import FirstPersonController from '@/modules/FirstPersonController.js'
import {TransformControls} from '@/modules/TransformControls.js'
import Globe from '@/modules/GlobeHelper.js'
import LineHelper from '@/modules/LineHelper.js'
import PolarGrid from '@/modules/PolarGrid.js'
import Connection from '@/modules/Connection.js'
import Thread from '@/modules/Thread.js'
import Lookout from '@/modules/Lookout.js'
import ContentBlock from '@/modules/ContentBlock.js'
import {CSS3DRenderer,CSS3DObject} from '@/modules/CSS3DRenderer.js'
import {makeid,map,connectionName} from '@/modules/Helpers.js'

class THREEScene {
  constructor(domparent,forceSimulation,cameraSettings,store,sceneElements) {
    this.scene = new THREE.Scene();
    this.forceSimulation=forceSimulation;
    this.forceSimulation.onDataChange=()=>{this.simDataChanged()};
    this.scene.background = new THREE.Color( '#e3e3e3' );
    this.width=window.innerWidth;
    this.height=window.innerWidth;
    this.aspect=this.width/this.height;
    this.cameraController=new FirstPersonController(domparent,cameraSettings,this.scene);
    this.cameraController.onmove=()=> this.onCamMove();
    this.cameraController.onenterLookout=(h_id)=> this.onEnterLookout(h_id);
    this.cameraController.onleaveLookout=()=> this.onLeaveLookout();
    this.blocks=sceneElements;
    this.connections=[];
    this.defaultMat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    this.mouse=new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 2;
    this.lineHelper = null;
    this.store=store;
    this.blockGeometries=[];


    this.thread = new Thread(this.scene,store,makeid(5));
    domparent.appendChild(this.thread.domPlus)

    this.scale_factor = .2;

    this.onLinkAdded = ()=>{};
    const scope = this;
    this.hoveredItem = {
      item:undefined,
      set(val){
        if (val && this.item) {
          if (val.refID!=this.item.h_id) {
            if(this.item) this.item.unHover()
            this.item = val ? val.name=='thread' ? scope.thread : scope.blocks.find((b) => b.h_id==val.refID) : val
            if(this.item && this.item.h_type!='thread') this.item.hover()
          }
        } else if(val!=this.item) {
          if(this.item) this.item.unHover()
          this.item = val ? val.name=='thread' ? scope.thread : scope.blocks.find((b) => b.h_id==val.refID) : val
          if(this.item && this.item.h_type!='thread') this.item.hover()
        }
      },
    }

    domparent.addEventListener('mousedown',(e)=>this.onClick(e));
    domparent.addEventListener('mousemove',(e)=>this.onMousemove(e));
    window.addEventListener('hashchange', (e)=>this.onHashChange(e));
    window.addEventListener('keydown', (e)=>this.onKeyDown(e));

    this.horizon = new Globe(this.cameraController.camera.far*.9, 16, 32, 64, this.store.sceneSettings.globeGridColor, this.store.sceneSettings.backgroundColor); // Radius, num lat, num lon, segments, color
    this.horizon.group.position.copy(this.cameraController.position());

    this.scene.add(this.horizon.group);
    this.polar = undefined;

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
    domparent.appendChild(this.cssRenderer.domElement);

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

    this.togglePolar(this.store.sceneSettings.showCircles)

    domparent.appendChild(this.renderer.domElement);
    this.render();
    if(store.selectedObject) this.focusItem(store.selectedObject.h_id,store.selectedObject.h_type)
  }

  togglePolar(bool){
    if (bool) {
      this.polar = new PolarGrid();
      this.scene.add(this.polar.group);
    } else if (this.polar){
      this.scene.remove(this.polar.group);
      this.polar = undefined;
    }
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
      for (const block of this.blocks) {
        simPos=this.forceSimulation.getNodeById(block.h_id);
        if (block.isDragged) {
          if (!block.contentItem.isFixed) {
            simPos.x=block.position().x;
            simPos.y=block.position().y;
            simPos.z=block.position().z;
          }else {
            simPos.fx=block.position().x;
            simPos.fy=block.position().y;
            simPos.fz=block.position().z;
          }

          this.forceSimulation.reheat();
          block.updateToolbox()
          if(block.h_type=='lookout') block.updateBounds()
        }else if(block.h_type!='lookout') {
          block.setPos(simPos);
        }
        block.lookAt(this.cameraController.position())
      }

      for (const connection of this.connections) {
        connection.update();
      }

      this.thread.updateSpline()
    }




    this.renderer.render(this.scene,this.cameraController.camera);
    this.cssRenderer.render(this.scene,this.cameraController.camera);
    window.requestAnimationFrame(()=> this.render());
  }

  importNodes(){
    const nodes = this.store.sceneList;
    let nn;
    nodes.forEach((item, i) => {
      if (item.h_type=='lookout') {
        nn=this.createNewElement('lookout',item)
      } else {
        nn=this.createNewElement('content',item)
      }
    });

    // let startObject,middleObject,endObject,con;
    nodes.filter((n) => n.h_type=='connection').forEach((item, i) => {
      const startObject=this.blocks.find((p)=> p.h_id==item.sourceID);
      const middleObject=this.blocks.find((p)=> p.h_id==item.h_id);
      const endObject=this.blocks.find((p)=> p.h_id==item.targetID)
      const con = new Connection(this.scene,startObject,middleObject,endObject,this.store.colors.connection)
      con.onDispose=(n)=>{this.store.sceneList.splice(this.store.sceneList.indexOf(n),1)}

      middleObject.onFocus=()=>{con.focus()};
      middleObject.onBlur=()=>{con.blur()};
      this.connections.push(con);
    });

    this.updateHitboxArray();
  }

  simDataChanged(isInit=false){
    const nodes = this.store.sceneList;
    const planes = this.blocks;

    // check which nodes are in the simulation but not in the scene -> add new plane to scene
    const toAdd =  nodes.filter((n)=>{
        return !planes.some((p) => n.h_id==p.h_id)
      });
    let nn;
    toAdd.forEach((item, i) => {
      if (item.h_type=='lookout') {
        nn=this.createNewElement('lookout',item)
      } else {
        nn=this.createNewElement('content',item)
      }
      });
    toAdd.filter((n) => n.h_type=='connection').forEach((item, i) => {
      const startObject=this.blocks.find((p)=> p.h_id==item.sourceID);
      const middleObject=this.blocks.find((p)=> p.h_id==item.h_id);
      const endObject=this.blocks.find((p)=> p.h_id==item.targetID)
      const con = new Connection(this.scene,startObject,middleObject,endObject,this.store.colors.connection)
      con.onDispose=(n)=>{this.store.sceneList.splice(this.store.sceneList.indexOf(n),1)}

      middleObject.onFocus=()=>{con.focus()};
      middleObject.onBlur=()=>{con.blur()};
      this.connections.push(con);
    });

    // check which planes are in the scene but not in the simulation -> remove them from scene
    const toRemove = planes.filter((p)=>{
      return !nodes.some((n)=>n.h_id==p.h_id)
    })

    if(this.objectControls.attachedContent && toRemove.some((b)=>b.h_id==this.objectControls.attachedContent.h_id)) this.objectControls.detach();

    //check for  connected nodes and remove them as well
    let indices = [];
    toRemove.forEach((item, i) => {
      item.dispose();
      item.connections.forEach((con, i) => {
        indices.push(this.store.sceneList.indexOf(con))
      });
    });
    indices=indices.filter((i)=> i>=0 ).sort((a, b) => a - b);

    for (var i = indices.length -1; i >= 0; i--) {
      this.store.sceneList.splice(indices[i],1);
    }

    //finally remove blocks from this list
    indices=[]

    toRemove.forEach((item, i) => {
      indices.push(this.blocks.indexOf(item))
    });

    indices=indices.filter((i)=> i>=0 ).sort((a, b) => a - b);

    for (var i = indices.length -1; i >= 0; i--) {
      this.blocks.splice(indices[i],1);
    }

    this.updateHitboxArray();

    if(isInit) this.thread.setup(this.blocks);
  }

  updateHitboxArray(){
    this.blockGeometries=this.blocks.map((b)=>b.hitbox);
  }

  createNewElement(type,contentItem){
    let nn = null;
    switch (type) {
      case 'lookout':
          nn = new Lookout(this.scene,contentItem,this.forceSimulation.getNodeById(contentItem.h_id),this.objectControls,this.cameraController.camera,this.store.colors.lookout)
        break;
      case 'content':
        nn = new ContentBlock(this.scene,contentItem,this.defaultMat,{cssResolution:this.scale_factor},this.objectControls)
        break;
      default:
        nn = new ContentBlock(this.scene,contentItem,this.defaultMat,{cssResolution:this.scale_factor},this.objectControls)
    }

    nn.onStartLink=(ele,_type)=>{this.startConnection(ele,_type)};
    nn.onExitLink=()=>{this.disposeConnection()};
    nn.onQuitThread=(ele)=>{this.thread.remove(ele)}
    nn.canStartThread=this.thread.empty;
    this.blocks.push(nn);
    return nn
  }

  getWorldPosition(x,y,offset=500){
    const vec = new THREE.Vector3(); // create once and reuse
    const pos = new THREE.Vector3(); // create once and reuse

    vec.set(
        ( x / window.innerWidth ) * 2 - 1,
        - ( y / window.innerHeight ) * 2 + 1,
        0.5 );

    vec.unproject( this.cameraController.camera );

    vec.sub( this.cameraController.position() ).normalize().multiplyScalar(offset);

    pos.copy( this.cameraController.position() ).add( vec );
    return pos;
  }

  castRay(point,objs){
    this.raycaster.setFromCamera(point, this.cameraController.camera);
    return this.raycaster.intersectObjects(objs || this.blockGeometries);
  }

  onClick(e){
    const objs = this.thread.isInserting || this.cameraController.enteredLookout ? this.blockGeometries : [...this.blockGeometries,this.thread.spline.mesh];
    const intersects = this.castRay(this.mouse,objs);

    if (intersects.length > 0) {
      if (intersects[0].object.name=="thread") {
        if (!this.thread.isInserting && this.store.loggedIn){
          this.thread.startInsert(intersects[0].point);
        }else {
          this.thread.abortInsert();
        }

      }else {
        const targ = this.blocks.find((b)=> b.h_id==intersects[0].object.refID) ;
        if (this.thread.isInserting) {
          if (!targ.isInThreat) {
            this.thread.insert(targ);
          }else {
            if (this.thread.isInserting) this.thread.abortInsert();
          }
        } else if(!this.isConnecting) {
          this.store.selectedObject=targ.contentItem
        } else if(this.isConnecting) {
          this.finishLine(targ);
        }
      }

    }else {
      if(this.lineHelper) this.disposeConnection();
      if (this.thread.isInserting) this.thread.abortInsert();
      if (this.cameraController.enabled) {
        this.objectControls.detach();
        if(this.store.selectedObject) this.blocks.find((b) => b.h_id==this.store.selectedObject.h_id ).blur();
        this.store.selectedObject=null;
      }

    }
  }

  onKeyDown(event) {

    if (this.store.focused) return
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
      case 79:
        // o see overview
        this.store.isOrbit = !this.store.isOrbit
        break;
      case 88:
        // x delete
        break;
      case 27:
        // esc
        if(this.lineHelper) this.disposeConnection();
        break;
      default:
    }

  }

  toggleCamMode(){
    if (!this.store.isOrbit) {
      this.cameraController.quitOrbit();
    }else {
      const bs = new THREE.Sphere()
      this.computeBounds().getBoundingSphere(bs);
      this.cameraController.initOrbit(bs);
    }
  }

  focusItem(h_id,h_type){
    if(this.focusedItem) this.focusedItem.blur();
    this.focusedItem = this.blocks.find((e) => e.h_id==h_id);
    if(this.focusedItem) {
      this.focusedItem.focus();
      if(this.focusedItem.h_type=='connection') {
        this.objectControls.detach();
        return;
      }
    }
  }

  onMousemove(e){
    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    if (this.lineHelper) {
      this.lineHelper.endPosition = this.getWorldPosition(event.clientX,event.clientY,1.3);
      this.lineHelper.update();
    } else if (this.thread.isInserting) {
      this.thread.onInsert(this.getWorldPosition(event.clientX,event.clientY,500));
    }

    const intersect = this.castRay(this.mouse,this.thread.isInserting ? this.blockGeometries : [...this.blockGeometries,this.thread.spline.mesh])[0]
    this.hoveredItem.set(intersect ? intersect.object : undefined );
    if (this.store.loggedIn && this.hoveredItem.item && this.hoveredItem.item.h_type=='thread' && !this.thread.empty && !this.thread.isInserting && !this.cameraController.enteredLookout) {
      this.thread.hover(event.clientX,event.clientY)
    }
  }

  onHashChange() {
    const target = this.blocks.find((b)=>b.h_id==location.hash.substr(1));
    if (target) {
      this.cameraController.moveTo(target);
      this.store.isOrbit=false;
    }
  }

  onCamMove(){
    if (!this.forceSimulation.isHot) {
      this.blocks.forEach((item, i) => {
        item.lookAt(this.cameraController.position());
        if (item.toolbox) {
          item.updateToolbox(this.cameraController.isInView(item.position()));
        }
      });
    }

    const intersects = this.castRay(new THREE.Vector2());
    if (intersects[0] && intersects[0].distance<600) {
      const targ = intersects[0].object;
      if (this.store.elementInCameraView!=targ.refID && !this.cameraController.enteredLookout) {
        this.store.elementInCameraView=targ.refID;
      }

    }else {
      if(!this.cameraController.enteredLookout) this.store.elementInCameraView = undefined;
    }

    if(this.lineHelper)  this.lineHelper.update();
    this.horizon.group.position.copy(this.cameraController.position());
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

  startConnection(obj,type){
    if(this.lineHelper) this.lineHelper.dispose(this.scene);
    this.lineHelper = new LineHelper(obj,type);
    this.scene.add(this.lineHelper.line);
    this.isConnecting=true;

    if (this.lineHelper) {
      this.lineHelper.endPosition = this.getWorldPosition(event.clientX,event.clientY,1.3);
      this.lineHelper.update();
    }
  }

  disposeConnection(){
    if(this.lineHelper) this.lineHelper.dispose(this.scene);
    this.isConnecting=false;
    this.lineHelper=null;
  }

  finishLine(obj){
    if(this.lineHelper) this.lineHelper.dispose(this.scene);
    this.isConnecting=false;
    if(obj==this.lineHelper.startObject) return;

    if (this.lineHelper.type=="connection") {
      this.finishConnection(obj)
    } else {
      if (this.thread.empty) {
        this.thread.init(this.lineHelper.startObject,obj);
        this.blocks.forEach((item) => {item.canStartThread=false});
      } else {
        this.thread.newEntry(this.lineHelper.startObject,obj);
      }
    }
    this.lineHelper.startObject.isConnecting=false;
    this.lineHelper.startObject.updateToolboxOptions();
    this.lineHelper=null;
  }

  finishConnection(obj){
    const center = new THREE.Vector3().copy(this.lineHelper.startObject.position()).lerp(obj.position(),0.5);
    const list_element = {
      h_id:makeid(5),
      name: '',
      to:undefined,
      val:1,
      from:undefined,
      content: '',
      initDistance:0,
      isFixed:false,
      sourceID : this.lineHelper.startObject.h_id,
      targetID : obj.h_id,
      h_type: 'connection',
    }

    const simulation_element = {
      h_id:list_element.h_id,
      h_type: 'connection',
      x:center.x,
      y:center.y,
      z:center.z,
      links:[]
    }

    const middleNodePlane = this.createNewElement('content',list_element)
    const con = new Connection(this.scene, this.lineHelper.startObject, middleNodePlane, obj,this.store.colors.connection);
    middleNodePlane.onFocus=()=>{con.focus()};
    middleNodePlane.onBlur=()=>{con.blur()};

    const nl=con.createNew(list_element,simulation_element);
    con.onDispose=(n)=>{this.store.sceneList.splice(this.store.sceneList.indexOf(n),1)}
    this.connections.push(con);

    // callBack to Graph.vue to update simulation data
    this.onLinkAdded(nl);
    this.updateHitboxArray();
  }

  computeBounds(){
    const min = new THREE.Vector3();
    const max = new THREE.Vector3();
    for (const block of this.blocks) {
      const pos = block.position();
      min.min(pos)
      max.max(pos)
    }

    return new THREE.Box3(min,max);
  }

  onEnterLookout(h_id){
    this.store.elementInCameraView=h_id;
  }

  onLeaveLookout(){
    //this.store.elementInCameraView=undefined;
  }
}

export default THREEScene