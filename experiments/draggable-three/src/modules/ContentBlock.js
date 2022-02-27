import {PlaneGeometry,Mesh} from 'three'
import {CSS3DObject} from '@/modules/CSS3DRenderer.js'

class ContentBlock {
  constructor(scene,contentItem,mat,options={cssResolution:.5}) {
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
    this.dom = document.createElement('DIV');

    this.onBlur=()=>{};
    this.onFocus=()=>{};

    this.dom.dataset.h_id=this.contentItem.h_id;
    this.dom.classList.add('floating-blocks');
    this.dom.classList.add(this.contentItem.h_type);
    this.dom.innerHTML=this.contentItem.content||'( ͡° ͜ʖ ͡°)﻿';
    const cssObj=new CSS3DObject(this.dom);
    let iter = 0;
    setPlaneGeomToDomWidth(this);

    function setPlaneGeomToDomWidth(scope) {
      if (scope.dom.offsetWidth!=0 && scope.dom.offsetHeight!=0) {
        scope.plane.geometry.dispose();
        scope.plane.geometry=new PlaneGeometry( scope.dom.offsetWidth*scope.cssRes , scope.dom.offsetHeight*scope.cssRes );
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

  update(){

  }

  lookAt(pos){
    this.plane.lookAt(pos)
  }

  updatePlaneSize(){
    this.plane.geometry.dispose();
    this.plane.geometry=new PlaneGeometry( this.dom.offsetWidth*this.cssRes , this.dom.offsetHeight*this.cssRes );
  }

  setPos(pos){
    if(pos)this.plane.position.set(pos.x,pos.y,pos.z);
  }

  position(){
    return this.plane.position;
  }

  dispose(){
    this.scene.remove(this.plane)
  }

  blur(){
    this.plane.visible=false;
    this.onBlur();
  }

  focus(){
    this.plane.visible=true;
    this.onFocus();
  }

  setContent(c){
    this.dom.innerHTML=c;
    this.plane.geometry.dispose();
    this.plane.geometry=new PlaneGeometry( this.dom.offsetWidth*this.cssRes , this.dom.offsetHeight*this.cssRes );
  }

}


export default ContentBlock