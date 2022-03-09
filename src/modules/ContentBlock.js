import {PlaneGeometry,Mesh} from 'three'
import {CSS3DObject} from '@/modules/CSS3DRenderer.js'
import Toolbar from '@/modules/Toolbar.js'

class ContentBlock {
  constructor(scene,contentItem,mat,options={cssResolution:.2},objectControls) {
    this.scene = scene;
    this.contentItem = contentItem;
    this.h_id = this.contentItem.h_id;
    this.h_type=this.contentItem.h_type;
    this.name=this.contentItem.name;
    this.cssRes=options.cssResolution;
    this.objectControls=objectControls;

    const geometry = new PlaneGeometry( 100, 100 );
    this.plane = new Mesh( geometry, mat );
    this.plane.visible=false;
    this.plane.refID=this.h_id;
    this.isDragged=false;
    this.isFocused;
    this.connections=[]
    this.dom = document.createElement('DIV');

    this.toolbox;

    this.onBlur=()=>{};
    this.onFocus=()=>{};
    this.onStartLink=()=>{};
    this.onStartThread=()=>{};
    this.onDispose=()=>{};
    this.onQuitThread=()=>{};

    this.domRect;

    this.hitbox=this.plane; // for raycasting
    this.dragObject=this.plane;

    this.dom.dataset.h_id=this.contentItem.h_id;
    this.dom.classList.add('floating-blocks');
    this.dom.classList.add(this.contentItem.h_type);
    this.dom.dataset.contentclass=this.contentItem.class
    this.updateDisplayElement();

    const cssObj=new CSS3DObject(this.dom);

    cssObj.position.set(0, 0, 0);
    cssObj.scale.set(this.cssRes, this.cssRes, this.cssRes);
    this.plane.add(cssObj);
    cssObj.position.set(0, 0, 0);
    this.contentItem.sceneElement=this;

    this.canStartThread=true;

    this.scene.add(this.plane);
  }



  lookAt(pos){
    this.plane.lookAt(pos)
  }

  setPos(pos){
    this.plane.position.set(pos.x,pos.y,pos.z);
    this.updateToolbox()
  }

  startLink(){
    this.onStartLink(this,'connection');
  }

  startThread(){
    this.onStartLink(this,'thread');
  }

  position(){
    return this.plane.position;
  }

  setPlaneGeomToDomWidth(img) {
    const isLoaded = img ? img.naturalWidth!=0 && img.naturalHeight!=0 : this.dom.offsetWidth!=0 && this.dom.offsetHeight!=0;
    const width = img ? img.naturalWidth : this.dom.offsetWidth;
    const height = img ? img.naturalHeight : this.dom.offsetHeight;
    if (isLoaded) {
      this.plane.geometry.dispose();
      this.plane.geometry=new PlaneGeometry( width*this.cssRes , height*this.cssRes );
    }else {
      setTimeout(()=>{
        this.setPlaneGeomToDomWidth();
      },100)
    }

  }

  dispose(){
    this.onDispose();
    this.scene.remove(this.plane)
    this.dom.remove()
    if(this.isInThreat) this.onQuitThread(this)
    if(this.toolbox) this.toolbox.dispose();
  }

  blur(){
    //this.plane.visible=false;
    this.onBlur();
    if(this.toolbox)this.toolbox.dispose();
    this.toolbox=undefined;
    this.dom.classList.remove('focus')
  }

  focus(){
    //this.plane.visible=true;
    this.onFocus();
    this.dom.classList.add('focus')
    this.updateToolboxOptions();
    this.objectControls.detach()
  }

  updateToolboxOptions(){
    if(this.toolbox) this.toolbox.dispose();
    this.toolbox=null;

    const scope=this;
    const options = [
      {name:'center',class:'eye',tooltip:'focus element',callback:()=>{window.location.hash=scope.h_id;window.dispatchEvent(new HashChangeEvent("hashchange"))}},
      {name:'connection',class:'connect',tooltip:'make a new connection',callback:()=>{scope.startLink()}},
      {name:'isFixed',type:'toggle', on:'anchor', off:'dynamic', condition:this.contentItem.isFixed, tooltipOff:'make node fixed',tooltipOn:'make node dynamic',callback:()=>{scope.toggleFixed()}},
    ]

    if(this.h_type!='connection') options.splice(2,0,{name:'transform',class:'move',tooltip:'move element',callback:()=>{scope.objectControls.attach(scope)}})

    if(this.canStartThread) {
      options.push({name:'thread',class:'thread',tooltip:'start weaving',callback:()=>{scope.startThread()}});
    } else if (this.isThreatStart || this.isThreatEnd) {
      options.push({name:'thread',class:'threadstart',tooltip:'continue weaving',callback:()=>{scope.startThread()}});
      options.push({name:'thread',class:'threaddelete',tooltip:'remove from thread',callback:()=>{scope.onQuitThread(scope);scope.updateToolboxOptions()}});
    }else if(this.isInThreat) {
      options.push({name:'thread',class:'threaddelete',tooltip:'remove from thread',callback:()=>{scope.onQuitThread(scope);scope.updateToolboxOptions()}});
    }

    this.toolbox=new Toolbar(options);
    this.updateToolbox()
  }

  updateToolbox(){
    if(!this.toolbox) return;
    this.domRect=this.dom.getBoundingClientRect();
    this.toolbox.setPos(this.domRect.right,this.domRect.top)
  }

  hover(){
    document.body.classList.add('cursor_pointer')
    this.dom.classList.add('hover')
  }

  unHover(){
    document.body.classList.remove('cursor_pointer')
    this.dom.classList.remove('hover')
  }

  toggleFixed(){
    this.contentItem.isFixed=!this.contentItem.isFixed;
  }

  updateDisplayElement(){
    let ele;
    switch (this.contentItem.class) {
      case 'Link':
      case 'Image':
      case 'Media':
        ele=document.createElement('IMG');
        ele.onload=(e)=>{this.setPlaneGeomToDomWidth(e.target)}
        ele.src=this.contentItem.imageUrl;
        break;
      case'Connection':
      case'Text':
      default:
        ele=document.createElement('P');
        const content=this.contentItem.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
        if(content==''){
          ele.classList.add('empty');
          ele.innerHTML='<span class="icon link"></span>'
        }else{
          ele.appendChild(document.createTextNode( content ));
        }

        this.setPlaneGeomToDomWidth()
    }

    this.dom.innerHTML='';
    this.dom.appendChild(ele);
  }

}




export default ContentBlock