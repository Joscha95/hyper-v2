import {PlaneGeometry,Vector3,LineBasicMaterial,Group,Line,MeshBasicMaterial,Mesh,BoxGeometry,BufferGeometry,DoubleSide} from 'three'
import Toolbar from '@/modules/Toolbar.js'

class Lookout {
  constructor(scene,contentItem,objectControls,camera) {
    this.scene = scene;
    this.camera = camera;
    this.contentItem = contentItem;
    this.h_id = this.contentItem.h_id;
    this.h_type=this.contentItem.h_type;
    this.name=this.contentItem.name;
    this.contentItem.sceneElement=this;
    this.isActive = false;
  	this.group = new Group();
    this.objectControls=objectControls;

  	const material = new LineBasicMaterial({ color: 0x0000ff });
  	const points = [
  		new Vector3( -40, -25, 70 ),
  		new Vector3( 40, -25, 70 ),
  		new Vector3( 0, 0, 0 ),//-70
  		new Vector3( -40, -25, 70 ),
  		new Vector3( -40, 25, 70 ),
  		new Vector3( -40, 25, 70 ),
  		new Vector3( 0, 0, 0 ),//-70
  		new Vector3( 40, 25, 70 ),
  		new Vector3( 40, -25, 70 ),
  		new Vector3( 40, 25, 70 ),
  		new Vector3( -40, 25, 70 )
  	];
  	const line = new Line( new BufferGeometry().setFromPoints( points ), material );

  	const planeGeo = new PlaneGeometry( 80, 50 );
  	this.planeMat = new MeshBasicMaterial({ color: 0x0000ff, side: DoubleSide, opacity: 0.33, transparent: true });
  	const plane = new Mesh( planeGeo, this.planeMat );
    plane.position.set(0,0,70)

  	const boxGeometry = new BoxGeometry( 80, 50, 70 );
  	const hitbox = new Mesh( boxGeometry, material );
  	hitbox.visible=false;
  	hitbox.refID=this.h_id;
    hitbox.position.set(0,0,35)

    this.hitbox=hitbox; // for raycasting
    this.dragObject=this.group;

  	this.group.name = contentItem.name;
  	this.group.add(hitbox);
  	this.group.add(line);
  	this.group.add(plane);

    this.group.position.set(this.contentItem.x,this.contentItem.y,this.contentItem.z);
    this.group.rotation.set(this.contentItem.rx,this.contentItem.ry,this.contentItem.rz);

    this.isDragged=false;
    this.isFocused;
    this.connections=[]

    this.toolbox;

    this.onBlur=()=>{};
    this.onFocus=()=>{};
    this.onStartLink=()=>{};
    this.onDispose=()=>{};

    this.scene.add(this.group);
    this.outerBound=this.hitbox.localToWorld(new Vector3(60,0,0))

    this.canStartThread=true;
  }



  lookAt(){
  }

  setPos(pos){
    //this.group.position.set(pos.x,pos.y,pos.z);
    // this.updateToolbox()
  }

  setTransform(transform){
    this.contentItem.x=this.contentItem.fx=transform.position.x;
    this.contentItem.y=this.contentItem.fy=transform.position.y;
    this.contentItem.z=this.contentItem.fz=transform.position.z;

    this.contentItem.rx=transform.rotation.x;
    this.contentItem.ry=transform.rotation.y;
    this.contentItem.rz=transform.rotation.z;

    this.updateBounds();
    this.group.position.set(this.contentItem.x,this.contentItem.y,this.contentItem.z);
    this.group.rotation.set(this.contentItem.rx,this.contentItem.ry,this.contentItem.rz);
  }

  activate(){
    this.group.children[2].visible=false
  }

  deactivate(){
    this.group.children[2].visible=true
  }

  startLink(){
    this.onStartLink(this,'connection');
  }
  startThread(){
    this.onStartLink(this,'thread');
  }

  position(){
    return this.group.position;
  }

  dispose(){
    this.onDispose();
    this.scene.remove(this.group)
    if(this.isInThreat) this.onQuitThread(this)
    if(this.toolbox) this.toolbox.dispose();
  }

  blur(){
    this.onBlur();
    if(this.toolbox)this.toolbox.dispose();
    this.toolbox=undefined;
  }

  updateBounds(){
    this.outerBound=this.hitbox.localToWorld(new Vector3(-50,25,0))
  }

  focus(){
    this.onFocus();
    this.updateBounds();
    this.widthHalf = window.innerWidth / 2;
    this.heightHalf = window.innerHeight / 2;
    this.objectControls.detach();
    this.updateToolboxOptions()
  }

  updateToolboxOptions(){
    if(this.toolbox) this.toolbox.dispose();
    this.toolbox=null;

    const scope=this;
    const options = [
      {name:'transform',text:'⨣',tooltip:'move element',callback:()=>{scope.objectControls.attach(scope)}},
      {name:'center',text:'⊹',tooltip:'focus element',callback:()=>{window.location.hash=scope.h_id;window.dispatchEvent(new HashChangeEvent("hashchange"))}},
      {name:'connection',text:'☌',tooltip:'make a new connection',callback:()=>{scope.startLink()}}
    ]

    if(this.canStartThread) {
      options.push({name:'thread',text:'☡',tooltip:'start weaving',callback:()=>{scope.startThread()}});
    } else if (this.isThreatStart || this.isThreatEnd) {
      options.push({name:'thread',text:'c',tooltip:'continue weaving',callback:()=>{scope.startThread()}});
      options.push({name:'thread',text:'x',tooltip:'remove from thread',callback:()=>{scope.onQuitThread(scope);scope.updateToolboxOptions()}});
    }else if(this.isInThreat) {
      options.push({name:'thread',text:'x',tooltip:'remove from thread',callback:()=>{scope.onQuitThread(scope);scope.updateToolboxOptions()}});
    }

    this.toolbox=new Toolbar(options);
    this.updateToolbox()
  }

  updateToolbox(){
    if(!this.toolbox) return;
    const pos = this.outerBound.clone().project(this.camera)

    pos.x = (pos.x * this.widthHalf) + this.widthHalf;
    pos.y = - (pos.y * this.heightHalf) + this.heightHalf;
    pos.z = 0;
    this.toolbox.setPos(pos.x,pos.y)
  }

  toggleFixed(){
    this.contentItem.isFixed=true;
  }

  updateDisplayElement(){

  }

}






export default Lookout