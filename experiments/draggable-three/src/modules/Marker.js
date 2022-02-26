import {Vector3,LineDashedMaterial,LineBasicMaterial,BufferGeometry,Line,Group} from 'three'

class Marker {
  constructor(scene,pos) {
    const group = new Group();
    group.name="marker";

    const points=[
      [
        new Vector3(0,-50,0),
        new Vector3(0,50,0),
      ],
      [
        new Vector3(-50,0,0),
        new Vector3(50,0,0)
      ],
      [
        new Vector3(0,0,-50),
        new Vector3(0,0,50)
      ]
    ];

    for (var i = 0; i < points.length; i++) {

      const geom=new BufferGeometry().setFromPoints(points[i]);
      const mat = new LineDashedMaterial( {
        	color: 0x0000ff,
        	dashSize: 3,
        	gapSize: 1,
        } );


      const mesh = new Line(geom,mat)
      mesh.computeLineDistances();

      mesh.name='marker'
      group.add(mesh)
    }
    group.position.copy(pos);
    scene.add(group);

  }
}

export default Marker