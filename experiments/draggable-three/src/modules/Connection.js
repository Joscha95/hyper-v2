import {LineBasicMaterial,BufferGeometry,Line,DynamicDrawUsage,Vector3} from 'three'

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

  createNew(){
    const center = new Vector3().copy(this.startObject.position).lerp(this.endObject.position,0.5);
    const dist = this.startObject.position.distanceTo(this.endObject.position)
    
    const node = {
      h_uuid:'H'+Date.now()+makeid(5),
      name: this.startObject.name+' ↭ '+this.endObject.name,
      to:[],
      val:1,
      from:[],
      content:'',
      initDistance:dist,
      isFixed:false,
      x:center.x,
      y:center.y,
      z:center.z,
      sourceID : this.startObject.h_uuid,
      targetID : this.endObject.h_uuid,
      h_type: 'connection'
    }

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

    return l;
  }

}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}

export default Connection