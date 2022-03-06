import {BufferGeometry, BufferAttribute, Vector3, CatmullRomCurve3, Line, LineBasicMaterial} from 'three'

class Thread {
  constructor(scene,store) {
    this.scene=scene
    this.store=store
    this.empty=true

    this.ARC_SEGMENTS = 200;

    const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( this.ARC_SEGMENTS * 3 ), 3 ) );

		let curve = new CatmullRomCurve3( this.store.thread.map((n)=>n.position()) );
		curve.curveType = 'catmullrom';
		curve.mesh = new Line( geometry, new LineBasicMaterial( {
			color: 0xff0000,
			opacity: 0.35
		} ) );
		curve.mesh.castShadow = false;
		this.spline = curve;
    this.spline.tension = .5;
    this.scene.add(this.spline.mesh)

    this.temppoint=new Vector3();

    this.val=0;
    this.valTarg=1;
  }

  prepend(node){
    this.store.thread.unshift(node)
    this.nodesChanged()
  }

  append(node){
    this.store.thread.push(node)
    this.nodesChanged()
  }

  init(start,end){
    this.store.thread=[start,end]
    this.empty=false
    this.nodesChanged()
  }

  remove(node){
    const ind = this.store.thread.map((n)=>n.h_id).indexOf(node.h_id);
    node.contentItem.from=undefined
    node.contentItem.to=undefined
    node.isThreatStart=false
    node.isThreatEnd=false
    node.isInThreat=false

    this.store.thread.splice(ind,1);

    this.nodesChanged()
  }

  newEntry(start,end){
    if (end.isInThreat) {
      console.warn('Weaving not possible, target is already in thread');
    }else {
      if (start.isThreatEnd) {
        this.append(end)
      }else if (start.isThreatStart) {
        this.prepend(end)
      } else {
        console.warn('weaving not possible');
      }
    }
  }

  updateLine(){

  }

  updateDamp(){
    //this.val=this.val + (this.valTarg-this.val)*.1;
  }

  nodesChanged(){

    this.store.thread.forEach((item, i) => {
      item.isThreatStart=false
      item.isThreatEnd=false

      const from=this.store.thread[i-1];
      if(from) {
        item.contentItem.from=from
      }else {
        item.isThreatStart=true
      }

      const to=this.store.thread[i+1];
      if(to) {
        item.contentItem.to=to
      }else {
        item.isThreatEnd=true
      }

      item.isInThreat=true;
      item.threat=this;

    })

    this.spline.points=this.store.thread.map((n)=>n.position());
    this.updateSpline();
  }

  updateSpline(){
    // this.temppoint=new Vector3();
    if (this.spline.points.length<2) return;
		const position = this.spline.mesh.geometry.attributes.position;

		for ( let i = 0; i < this.ARC_SEGMENTS; i ++ ) {

			const t = i / ( this.ARC_SEGMENTS - 1 );
			this.spline.getPoint( t, this.temppoint );
			position.setXYZ( i, this.temppoint.x, this.temppoint.y, this.temppoint.z );

		}

		position.needsUpdate = true;
    this.spline.mesh.geometry.computeBoundingSphere();
  }



}

export default Thread;