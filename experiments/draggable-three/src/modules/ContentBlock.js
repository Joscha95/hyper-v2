import {PlaneGeometry,Mesh} from 'three'
import {CSS3DObject} from '@/modules/CSS3DRenderer.js'
import Toolbar from '@/modules/Toolbar.js'

class ContentBlock {
  constructor(scene,contentItem,mat,options={cssResolution:.2}) {
    this.scene = scene;
    this.contentItem = contentItem;
    this.h_id = this.contentItem.h_id;
    this.h_type=this.contentItem.h_type;
    this.name=this.contentItem.name;
    this.cssRes=options.cssResolution;

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
    this.onDispose=()=>{};

    this.domRect;

    this.dom.dataset.h_id=this.contentItem.h_id;
    this.dom.classList.add('floating-blocks');
    this.dom.classList.add(this.contentItem.h_type);
    this.dom.innerHTML=this.contentItem.content||'( ͡° ͜ʖ ͡°)﻿';
    const cssObj=new CSS3DObject(this.dom);
    let iter = 0;
    setPlaneGeomToDomWidth(this);

    function setPlaneGeomToDomWidth(scope) {
      if (scope.dom.offsetWidth!=0 && scope.dom.offsetHeight!=0) {
        scope.updatePlaneSize();
      }else if(iter<10) {
        setTimeout(()=>{
          iter++;
          setPlaneGeomToDomWidth(scope);
        },10)
      }

    }

    cssObj.position.set(0, 0, 0);
    cssObj.scale.set(this.cssRes, this.cssRes, this.cssRes);
    this.plane.add(cssObj);
    cssObj.position.set(0, 0, 0);
    this.contentItem.sceneElement=this;

    this.scene.add(this.plane)
  }

  updateToolBox(){
    this.domRect=this.dom.getBoundingClientRect();
    if(this.toolbox) this.toolbox.setPos(this.domRect.right,this.domRect.top)
  }

  lookAt(pos){
    this.plane.lookAt(pos)
  }

  updatePlaneSize(){
    this.plane.geometry.dispose();
    this.plane.geometry=new PlaneGeometry( this.dom.offsetWidth*this.cssRes , this.dom.offsetHeight*this.cssRes );
  }

  setPos(pos){
    this.plane.position.set(pos.x,pos.y,pos.z);
    this.updateToolBox()
  }

  startLink(){
    this.onStartLink(this);
  }

  position(){
    return this.plane.position;
  }

  dispose(){
    this.onDispose();
    this.scene.remove(this.plane)
    this.dom.remove()
    if(this.toolbox) this.toolbox.dispose();
  }

  blur(){
    this.plane.visible=false;
    this.onBlur();
    if(this.toolbox)this.toolbox.dispose();
    this.toolbox=undefined;
    this.dom.classList.remove('focus')
  }

  focus(){
    this.plane.visible=true;
    this.onFocus();
    this.dom.classList.add('focus')
    this.toolbox=new Toolbar([
      {name:'connection',text:'☍',tooltip:'make a new connection'},
      {name:'isFixed',type:'toggle', on:'⥿', off:'↔', condition:this.contentItem.isFixed, tooltipOff:'make node fixed',tooltipOn:'make node dynamic'}
    ],
    [
      ()=>{this.startLink()},
      ()=>{this.toggleFixed()}
    ]);
    this.updateToolBox()
  }

  toggleFixed(){
    this.contentItem.isFixed=!this.contentItem.isFixed;
    if (this.contentItem.isFixed) {
      this.contentItem.fx=this.contentItem.x;
      this.contentItem.fy=this.contentItem.y;
      this.contentItem.fz=this.contentItem.z;
    }else {
      this.contentItem.fx=null;
      this.contentItem.fy=null;
      this.contentItem.fz=null;
    }
    this.toolbox.updateField('isFixed',this.contentItem.isFixed)
  }

  setContent(c){
    this.dom.innerHTML=c;
    this.plane.geometry.dispose();
    this.plane.geometry=new PlaneGeometry( this.dom.offsetWidth*this.cssRes , this.dom.offsetHeight*this.cssRes );
  }

}




export default ContentBlock