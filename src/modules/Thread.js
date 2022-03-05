import {BufferGeometry, BufferAttribute, Vector3, CatmullRomCurve3, Line, LineBasicMaterial} from 'three'

class Thread {
  constructor(scene,nodes=[]) {
    this.scene=scene
    this.nodes=nodes
    this.empty=true

    this.ARC_SEGMENTS = 200;

    const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( this.ARC_SEGMENTS * 3 ), 3 ) );

		let curve = new CatmullRomCurve3( this.nodes.map((n)=>n.position()) );
		curve.curveType = 'catmullrom';
		curve.mesh = new Line( geometry, new LineBasicMaterial( {
			color: 0xff0000,
			opacity: 0.35
		} ) );
		curve.mesh.castShadow = false;
		this.spline = curve;
    this.spline.tension = 1;
    this.scene.add(this.spline.mesh)
  }

  prepend(node){
    this.nodes.unshift(node)
    this.nodesChanged()
  }

  append(node){
    this.nodes.push(node)
    this.nodesChanged()
  }

  init(start,end){
    this.nodes=[start,end]
    this.empty=false
    this.nodesChanged()
  }

  remove(node){
    const ind = this.nodes.map((n)=>n.h_id).indexOf(node.h_id);
    node.contentItem.from=undefined
    node.contentItem.to=undefined
    node.isThreatStart=false
    node.isThreatEnd=false
    node.isInThreat=false;

    this.nodes.splice(ind,1);

    this.nodesChanged()
  }

  updateLine(){

  }

  nodesChanged(){

    this.nodes.forEach((item, i) => {
      item.isThreatStart=false
      item.isThreatEnd=false

      const from=this.nodes[i-1];
      if(from) {
        item.contentItem.from=from
      }else {
        item.isThreatStart=true
      }

      const to=this.nodes[i+1];
      if(to) {
        item.contentItem.to=to
      }else {
        item.isThreatEnd=true
      }

      item.isInThreat=true;
      item.threat=this;

    });
    console.log(this.nodes);

    this.spline.points=this.nodes.map((n)=>n.position());

    const point=new Vector3();
		const position = this.spline.mesh.geometry.attributes.position;

		for ( let i = 0; i < this.ARC_SEGMENTS; i ++ ) {

			const t = i / ( this.ARC_SEGMENTS - 1 );
			this.spline.getPoint( t, point );
			position.setXYZ( i, point.x, point.y, point.z );

		}

		position.needsUpdate = true;
    this.spline.mesh.geometry.computeBoundingSphere();
  }



}

export default Thread;