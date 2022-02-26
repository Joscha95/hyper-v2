import {LineBasicMaterial,BufferGeometry,Line,DynamicDrawUsage,Vector3,LineDashedMaterial} from 'three'
import {makeid} from '@/modules/Helpers.js'

class Connection {
  constructor(scene,startObject,middleObject,endObject) {
    this.startObject = startObject;
    this.middleObject = middleObject;
    this.endObject = endObject;
    this.scene = scene;

    this.material = new LineBasicMaterial({color: 0x0000ff });
    this.dashedMaterial=new LineDashedMaterial( {
      	color: 0x0000ff,
      	dashSize: 3,
      	gapSize: 3,
      } );

    const geometry = new BufferGeometry().setFromPoints( [this.startObject.position(),this.middleObject.position(),this.endObject.position()] );

    this.line=new Line( geometry, this.material );
    this.line.computeLineDistances();
    this.linepositions=this.line.geometry.attributes.position;
    this.line.geometry.dynamic=true;
    this.linepositions.usage = DynamicDrawUsage;
    this.scene.add(this.line);
    this.positions=[]
  }

  update(){
    this.positions=[this.startObject.position(),this.middleObject.position(),this.endObject.position()];

    this.positions.forEach((item, i) => {
      this.linepositions.setXYZ(i,item.x,item.y,item.z);
    });
    this.linepositions.needsUpdate = true;
    this.line.geometry.computeBoundingSphere();
  }

  dispose(){
    this.scene.remove(this.line)
  }

  blur(){
    this.line.material=this.material;
  }

  focus(){
    this.line.material=this.dashedMaterial;
    this.line.computeLineDistances();
  }

  createNew(node){
    const center = new Vector3().copy(this.startObject.position()).lerp(this.endObject.position(),0.5);
    const dist = this.startObject.position().distanceTo(this.endObject.position())

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