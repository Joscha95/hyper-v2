import * as THREE from 'three'
class LineHelper {
  constructor(startObject) {
    this.startObject=startObject;
    this.endPosition=new THREE.Vector3();
    const material = new THREE.LineBasicMaterial({color: 0x0000ff });

    const points = [];
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    points.push( new THREE.Vector3( 10, 10, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    this.line=new THREE.Line( geometry, material );
    this.linepositions=this.line.geometry.attributes.position;
    this.line.geometry.dynamic=true;
    this.linepositions.usage = THREE.DynamicDrawUsage;
  }

  update(){
    this.linepositions.setXYZ(0,this.startObject.position.x,this.startObject.position.y,this.startObject.position.z);
    this.linepositions.setXYZ(1,this.endPosition.x,this.endPosition.y,this.endPosition.z);
    this.linepositions.needsUpdate = true;
    this.line.geometry.computeBoundingSphere();
  }

  dispose(scene){
    scene.remove(this.line);
  }

}

export default LineHelper