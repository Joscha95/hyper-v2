import {PlaneGeometry,Vector3,LineBasicMaterial,Group,Line,MeshBasicMaterial,Mesh,BoxGeometry,BufferGeometry,DoubleSide} from 'three'
import Toolbar from '@/modules/Toolbar.js'

class Lookout {
  constructor(scene,contentItem) {
    this.scene = scene;
    this.contentItem = contentItem;
    this.h_id = this.contentItem.h_id;
    this.h_type=this.contentItem.h_type;
    this.name=this.contentItem.name;
    this.contentItem.sceneElement=this;
    this.isActive = false;
  	this.group = new Group();

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

    this.plane=hitbox; // for raycasting

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
  }

  updateToolBox(){
    // if(!this.toolbox) return;
    // this.toolbox.setPos(this.domRect.right,this.domRect.top)
  }

  lookAt(){
  }

  setPos(pos){
    // this.group.position.set(pos.x,pos.y,pos.z);
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

  focus(){
    this.onFocus();
    // this.toolbox=new Toolbar([
    //   {name:'connection',text:'☌',tooltip:'make a new connection'},
    //   {name:'isFixed',type:'toggle', on:'⥿', off:'↔', condition:this.contentItem.isFixed, tooltipOff:'make node fixed',tooltipOn:'make node dynamic'}
    // ],
    // [
    //   ()=>{this.startLink()},
    //   ()=>{this.toggleFixed()}
    // ]);
    // this.updateToolBox()
  }

  toggleFixed(){
    this.contentItem.isFixed=true;
  }

  updateDisplayElement(){

  }

}






export default Lookout