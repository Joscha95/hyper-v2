import * as THREE from 'three'

class Connection {
  constructor(scene,startObject,endObject,link,midpointMat) {
    this.startObject = startObject;
    this.endObject = endObject;
    this.scene = scene;

    const material = new THREE.LineBasicMaterial({color: 0x0000ff });

    let geometry = new THREE.BufferGeometry().setFromPoints( [this.startObject.position,this.endObject.position] );

    this.group = new THREE.Group();
    this.group.h_type='connection';
    this.group.name=link.h_uuid;

    this.line=new THREE.Line( geometry, material );
    this.line.h_type='connection';
    this.line.h_uuid=link.h_uuid;
    this.line.name=link.h_uuid;
    this.linepositions=this.line.geometry.attributes.position;
    this.line.geometry.dynamic=true;
    this.linepositions.usage = THREE.DynamicDrawUsage;
    this.group.add(this.line);


    geometry = new THREE.PlaneGeometry( 50, 50 );
    this.midPoint = new THREE.Mesh( geometry, midpointMat );
    this.midPoint.h_type='connection_midpoint';
    this.group.add(this.midPoint);
    this.scene.add(this.group)
  }

  update(){
    this.linepositions.setXYZ(0,this.startObject.position.x,this.startObject.position.y,this.startObject.position.z);
    this.linepositions.setXYZ(1,this.endObject.position.x,this.endObject.position.y,this.endObject.position.z);
    this.linepositions.needsUpdate = true;
    this.line.geometry.computeBoundingSphere();

    this.midPoint.position.copy(this.startObject.position.clone());
    this.midPoint.position.lerp(this.endObject.position,0.5);
  }

  dispose(){
    this.scene.remove(this.group)
  }

}

export default Connection