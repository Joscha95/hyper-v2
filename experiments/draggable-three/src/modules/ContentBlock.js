import {PlaneGeometry,Mesh} from 'three'
import {CSS3DObject} from '@/modules/CSS3DRenderer.js'

class ContentBlock {
  constructor(scene,contentItem,mat,options={cssResolution:.5}) {
    this.scene = scene;
    this.contentItem = contentItem;
    this.h_uuid = this.contentItem.h_uuid;
    this.h_type=this.contentItem.h_type;
    
    const geometry = new PlaneGeometry( 100, 100 );
    this.plane = new Mesh( geometry, mat );
    this.plane.visible=false;
    this.dom = document.createElement('DIV');

    this.dom.dataset.h_uuid=this.contentItem.h_uuid;
    this.dom.classList.add('floating-blocks');
    this.dom.innerHTML=this.contentItem.content||'( ͡° ͜ʖ ͡°)﻿';
    const cssObj=new CSS3DObject(this.dom);
    let iter = 0;
    setPlaneGeomToDomWidth(this);

    function setPlaneGeomToDomWidth(scope) {
      if (scope.dom.offsetWidth!=0 && scope.dom.offsetHeight!=0) {
        scope.plane.geometry.dispose();
        scope.plane.geometry=new PlaneGeometry( scope.dom.offsetWidth*options.cssResolution , scope.dom.offsetHeight*options.cssResolution );
      }else if(iter<10) {
        setTimeout(()=>{
          iter++;
          setPlaneGeomToDomWidth(scope);
        },10)
      }

    }

    cssObj.position.set(0, 0, 0);
    cssObj.scale.set(options.cssResolution, options.cssResolution, options.cssResolution);
    this.plane.add(cssObj);
    cssObj.position.set(0, 0, 0);
    this.contentItem.domElement=this.dom;
    this.contentItem.sceneElement=this;
    this.plane.name=this.contentItem.name;
    this.plane.h_name=this.contentItem.name;
    this.plane.h_uuid=this.contentItem.h_uuid;
    this.plane.h_type=this.contentItem.h_type;

    this.scene.add(this.plane)
  }

  update(){

  }

  lookAt(pos){
    this.plane.lookAt(pos)
  }

  setPos(pos){
    if(pos)this.plane.position.set(pos.x,pos.y,pos.z);
  }

  dispose(){
    this.scene.remove(this.plane)
  }

  // intersects(raycaster){
  //   raycaster.intersectObject(this.plane);
  // }

  unfocus(){
    this.plane.visible=false;
  }

  focus(){
    this.plane.visible=true;
  }

}


export default ContentBlock