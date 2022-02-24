import {LineBasicMaterial,BufferGeometry,Line,DynamicDrawUsage,Vector3} from 'three'
import {makeid} from '@/modules/Helpers.js'

class Connection {
  constructor(scene,startObject,middleObject,endObject) {
    this.startObject = startObject;
    this.middleObject = middleObject;
    this.endObject = endObject;
    this.scene = scene;

    const material = new LineBasicMaterial({color: 0x0000ff });

    let geometry = new BufferGeometry().setFromPoints( [this.startObject.position,this.middleObject.position,this.endObject.position] );

    this.line=new Line( geometry, material );
    this.line.h_type='connection';
    this.linepositions=this.line.geometry.attributes.position;
    this.line.geometry.dynamic=true;
    this.linepositions.usage = DynamicDrawUsage;
    this.scene.add(this.line)
  }

  update(){
    this.linepositions.setXYZ(0,this.startObject.position.x,this.startObject.position.y,this.startObject.position.z);
    this.linepositions.setXYZ(1,this.middleObject.position.x,this.middleObject.position.y,this.middleObject.position.z);
    this.linepositions.setXYZ(2,this.endObject.position.x,this.endObject.position.y,this.endObject.position.z);
    this.linepositions.needsUpdate = true;
    this.line.geometry.computeBoundingSphere();
  }

  dispose(){
    this.scene.remove(this.line)
  }

  unfocus(){
    this.line.material.color.setHex( 0x0000ff );
  }

  focus(){
    this.line.material.color.set( 'red' );
  }

  createNew(node){
    const center = new Vector3().copy(this.startObject.position).lerp(this.endObject.position,0.5);
    const dist = this.startObject.position.distanceTo(this.endObject.position)

    this.middleObject.name = node.name;

    this.middleObject.h_uuid=node.h_uuid;

    const l = {
      link1:
        {
          source : this.startObject.h_uuid,
          target : node.h_uuid,
          distance : dist/2,
          name:  '',
          h_type: 'connection',
          h_uuid:'H'+Date.now()+makeid(5),
        },
      node:node,
      link2:
        {
          source : node.h_uuid,
          target : this.endObject.h_uuid,
          distance : dist/2,
          name:  '',
          h_type: 'connection',
          h_uuid:'H'+Date.now()+makeid(5),
        }
    }

    node.links=[l.link1,l.link2];
    node.initDistance=dist;

    return l;
  }

}

export default Connection