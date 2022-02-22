import * as THREE from 'three'

class Connection {
  constructor(scene,startObject,endObject,link) {
    this.startObject=startObject;
    this.endObject=endObject;


    const material = new THREE.LineBasicMaterial({color: 0x0000ff });

    const geometry = new THREE.BufferGeometry().setFromPoints( [this.startObject.position,this.endObject.position] );

    this.line=new THREE.Line( geometry, material );
    this.line.h_type='connection';
    this.line.h_uuid=link.h_uuid;
    this.line.name=link.h_uuid;
    this.linepositions=this.line.geometry.attributes.position;
    this.line.geometry.dynamic=true;
    this.linepositions.usage = THREE.DynamicDrawUsage;

    scene.add(this.line)
  }

  update(){
    this.linepositions.setXYZ(0,this.startObject.position.x,this.startObject.position.y,this.startObject.position.z);
    this.linepositions.setXYZ(1,this.endObject.position.x,this.endObject.position.y,this.endObject.position.z);
    this.linepositions.needsUpdate = true;
    this.line.position.set(this.startObject.position.clone().addScaledVector(this.endObject.position.clone().sub(this.startObject.position),.5))
    this.line.geometry.computeBoundingSphere();
  }


}

export default Connection