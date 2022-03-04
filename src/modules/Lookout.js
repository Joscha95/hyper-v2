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
  		new Vector3( -40, -25, 0 ),
  		new Vector3( 40, -25, 0 ),
  		new Vector3( 0, 0, -70 ),
  		new Vector3( -40, -25, 0 ),
  		new Vector3( -40, 25, 0 ),
  		new Vector3( -40, 25, 0 ),
  		new Vector3( 0, 0, -70 ),
  		new Vector3( 40, 25, 0 ),
  		new Vector3( 40, -25, 0 ),
  		new Vector3( 40, 25, 0 ),
  		new Vector3( -40, 25, 0 )
  	];
  	const line = new Line( new BufferGeometry().setFromPoints( points ), material );

  	const planeGeo = new PlaneGeometry( 80, 50 );
  	this.planeMat = new MeshBasicMaterial({ color: 0x0000ff, side: DoubleSide, opacity: 0.33, transparent: true });
  	const plane = new Mesh( planeGeo, this.planeMat );

  	const boxGeometry = new BoxGeometry( 80, 50, 70 );
  	const hitbox = new Mesh( boxGeometry, material );
  	hitbox.visible=false;
  	hitbox.refID=this.h_id;

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

  }

  updateToolBox(){
    if(!this.toolbox) return;
    const pos = this.outerBound.clone().project(this.camera)

    pos.x = (pos.x * this.widthHalf) + this.widthHalf;
    pos.y = - (pos.y * this.heightHalf) + this.heightHalf;
    pos.z = 0;
    this.toolbox.setPos(pos.x,pos.y)
  }

  lookAt(){
  }

  setPos(pos){
    //this.group.position.set(pos.x,pos.y,pos.z);
    // this.updateToolBox()
  }

  startLink(){
    this.onStartLink(this);
  }

  position(){
    return this.group.position;
  }

  dispose(){
    this.onDispose();
    this.scene.remove(this.group)
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
    this.toolbox=new Toolbar([
      {name:'transform',text:'⨣',tooltip:'move element'},
      {name:'center',text:'⊹',tooltip:'focus element'},
      {name:'connection',text:'☌',tooltip:'make a new connection'},
    ],
    [
      ()=>{this.objectControls.attach(this)},
      ()=>{window.location.hash=this.h_id},
      ()=>{this.startLink()},
      ()=>{this.toggleFixed()}
    ]);
    this.updateToolBox()
  }

  toggleFixed(){
    this.contentItem.isFixed=true;
  }

  updateDisplayElement(){

  }

}






export default Lookout