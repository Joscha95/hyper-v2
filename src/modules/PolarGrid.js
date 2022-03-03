import {LineBasicMaterial,Vector3,BufferGeometry,Line,Group}  from 'three'


class PolarGrid {
	constructor(mat,circleSegments=36) {
		this.group=new Group();

		const circleMat = new LineBasicMaterial( { color: 'black' } );
		let circleRadius;
		for (var i = 0; i < 4; i++) {
			circleRadius=i*100+100;
			const points = [];
			const divisions = 360 / 36;
			for(let j=0; j<=(360/divisions); j++){
				points.push( new Vector3( Math.cos((j*divisions)*(Math.PI/180))*circleRadius, 0, Math.sin((j*divisions)*(Math.PI/180))*circleRadius ));
			}
			const circleGeo = new BufferGeometry().setFromPoints( points );

			this.group.add(new Line( circleGeo, circleMat ));
		}
	}
}

export default PolarGrid;