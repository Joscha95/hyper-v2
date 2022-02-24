import {LineBasicMaterial,Vector3,BufferGeometry,Line,DynamicDrawUsage} from 'three'
class LineHelper {
  constructor(startObject) {
    this.startObject=startObject;
    this.endPosition=new Vector3();
    const material = new LineBasicMaterial({color: 0x0000ff });

    const points = [];
    points.push( new Vector3( 0, 0, 0 ) );
    points.push( new Vector3( 10, 10, 0 ) );

    const geometry = new BufferGeometry().setFromPoints( points );

    this.line=new Line( geometry, material );
    this.linepositions=this.line.geometry.attributes.position;
    this.line.geometry.dynamic=true;
    this.linepositions.usage = DynamicDrawUsage;
    this.startPos=new Vector3( 0, 0, 0 );
  }

  update(){
    this.startPos=this.startObject.position();
    this.linepositions.setXYZ(0,this.startPos.x,this.startPos.y,this.startPos.z);
    this.linepositions.setXYZ(1,this.endPosition.x,this.endPosition.y,this.endPosition.z);
    this.linepositions.needsUpdate = true;
    this.line.geometry.computeBoundingSphere();
  }

  dispose(scene){
    scene.remove(this.line);
  }

}

export default LineHelper



