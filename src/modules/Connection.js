import {LineBasicMaterial,BufferGeometry,Line,DynamicDrawUsage,Vector3,LineDashedMaterial,ConeGeometry,MeshBasicMaterial,Mesh} from 'three'
import {makeid} from '@/modules/Helpers.js'

class Connection {
  constructor(scene,startObject,middleObject,endObject,color) {
    this.startObject = startObject;
    this.middleObject = middleObject;
    this.endObject = endObject;
    this.scene = scene;

    this.onDispose=()=>{}

    this.material = new LineBasicMaterial({color: color });
    this.dashedMaterial=new LineDashedMaterial( {
      	color: color,
      	dashSize: 3,
      	gapSize: 3,
      } );


    this.middleObject.onDispose=()=>{this.dispose()};

    this.startObject.connections.push(this.middleObject.contentItem);
    this.endObject.connections.push(this.middleObject.contentItem);

    const geometry = new BufferGeometry().setFromPoints( [this.startObject.position(),this.middleObject.position(),this.endObject.position()] );

    const cgeometry = new ConeGeometry( 2, 5, 3 );
    cgeometry.rotateX(Math.PI * 0.5);
    const material = new MeshBasicMaterial( {color: color} );
    this.cones = [new Mesh( cgeometry, material ),new Mesh( cgeometry, material )];
    this.cones.forEach((item, i) => {
      scene.add(item)
    });


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
    let con;

    this.positions.forEach((item, i) => {
      this.linepositions.setXYZ(i,item.x,item.y,item.z);
      if(con = this.cones[i]) {
        con.position.copy(item.clone()).lerp(this.positions[i+1],.5);
        con.lookAt(this.positions[i+1])
      }
    });
    this.linepositions.needsUpdate = true;
    this.line.geometry.computeBoundingSphere();
  }

  dispose(){
    //this.middleObject.dispose();
    this.scene.remove(this.line);
    this.cones.forEach((item, i) => {
      this.scene.remove(item)
    });

    this.startObject.connections.splice(this.startObject.connections.indexOf(this.middleObject.contentItem),1);
    this.endObject.connections.splice(this.startObject.connections.indexOf(this.middleObject.contentItem),1);
    console.log('disposed');

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

    this.middleObject.h_id=node.h_id;

    const l = {
      link1:
        {
          source : this.startObject.h_id,
          target : node.h_id,
          distance : dist/2,
          name:  '',
          h_type: 'connection',
          h_id: makeid(5),
        },
      node:node,
      link2:
        {
          source : node.h_id,
          target : this.endObject.h_id,
          distance : dist/2,
          name:  '',
          h_type: 'connection',
          h_id: makeid(5),
        }
    }

    node.links=[l.link1,l.link2];
    node.initDistance=dist;

    return l;
  }

}

export default Connection