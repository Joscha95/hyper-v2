import * as THREE from 'three'
class LineHelper {
  constructor() {
    this.startObject=null;
    this.endPosition=new THREE.Vector3();
    const material = new THREE.LineBasicMaterial({color: 0x0000ff });

    const points = [];
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    points.push( new THREE.Vector3( 10, 10, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    this.line=new THREE.Line( geometry, material );
    this.linepositions=this.line.geometry.attributes.position;
    this.line.geometry.dynamic=true;
    this.line.frustumCulled = false;
    this.linepositions.usage = THREE.DynamicDrawUsage;
    console.log(this.line.geometry.attributes.position);
  }

  update(){
    this.linepositions.setX(0,this.startObject ? this.startObject.position.x : 0)
    this.linepositions.setY(0,this.startObject ? this.startObject.position.y : 0)
    this.linepositions.setZ(0,this.startObject ? this.startObject.position.z : 0)

    this.linepositions.setX(1,this.endPosition.x);
    this.linepositions.setY(1,this.endPosition.y);
    this.linepositions.setZ(1,this.endPosition.z);
    // this.line.position.set(this.endPosition)
    // console.log(this.linepositions.array);
    this.linepositions.needsUpdate = true;
  }
}

export default LineHelper