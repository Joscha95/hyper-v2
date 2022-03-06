import {BufferGeometry, BufferAttribute, Vector3, CatmullRomCurve3, Line, LineBasicMaterial} from 'three'

class Thread {
  constructor(scene,store) {
    this.scene=scene
    this.store=store
    this.empty=true;

    this.ARC_SEGMENTS = 200;

    const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( this.ARC_SEGMENTS * 3 ), 3 ) );

		let curve = new CatmullRomCurve3( this.store.thread.map((n)=>n.position()) );
		curve.curveType = 'catmullrom';
		curve.mesh = new Line( geometry, new LineBasicMaterial( {
			color: 0xff0000,
			//opacity: 0.35
		} ) );
		curve.mesh.castShadow = false;
		curve.mesh.name = 'thread';
		this.spline = curve;
    this.spline.tension = .5;
    this.scene.add(this.spline.mesh)

    this.temppoint=new Vector3()

    this.domPlus=document.createElement('DIV');
    this.domPlus.id='thread_plus';
    this.domPlus.innerHTML='click to insert';
    this.domPlus.style.display='none';
    this.isHovered=false;

    this.isInserting=false;
    this.insertindex=null;

    this.val=0;
    this.valTarg=1;
  }

  setup(nodes){

    this.store.threadIds.forEach((item, i) => {
      const node = nodes.find((n) => n.h_id==item);
      if(node) this.store.thread.push(node);
    });
    this.nodesChanged()
  }

  dispose(){
    this.scene.remove(this.spline.mesh)
  }

  prepend(node){
    this.store.thread.unshift(node)
    this.nodesChanged()
  }

  append(node){
    this.store.thread.push(node)
    this.nodesChanged()
  }

  startInsert(point){
    const divisions = this.store.thread.length*10
    const points = this.spline.getPoints(divisions);
    let dist = 100000;
    let ind = null;

    points.forEach((item, i) => {
      if (point.distanceTo(item)<dist) {
        ind=i;
        dist=point.distanceTo(item);
      }
    });

    ind = Math.floor(ind/(divisions/(this.store.thread.length-1)))
    this.spline.points.splice(ind+1,0,point)
    this.insertindex=ind+1;
    this.isInserting=true;
    this.spline.tension = 0;
  }

  onInsert(point){
    this.spline.points[this.insertindex]=point;
    this.updateSpline();
  }

  abortInsert(){
    this.spline.tension = .5;
    this.nodesChanged();
  }

  insert(obj){
    this.store.thread.splice(this.insertindex,0,obj);
    this.spline.tension = .5;
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
    this.isInserting=false;

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
    this.empty=this.store.thread.length==0;
  }

  hover(x,y){
    this.domPlus.style.left=x+15+'px';
    this.domPlus.style.top=y+15+'px';
    if(!this.isHover) {
      this.domPlus.style.display='block';
      document.body.classList.add('cursor_pointer')
    }
    this.isHovered=true;
  }

  unHover(){
    if(this.isHovered) {
      this.domPlus.style.display='none';
      document.body.classList.remove('cursor_pointer')
    }
    this.isHovered=false;
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