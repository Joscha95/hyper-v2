import {LineBasicMaterial,Vector3,BufferGeometry,Line,Group}  from 'three'


class PolarGrid {
	constructor(mat) {
		this.group=new Group();

		const circleMat = new LineBasicMaterial( { color: 'black' } );
		let circleRadius;
		const resolutions = [32,40,72,72];
		for (var i = 0; i < resolutions.length; i++) {
			circleRadius=i*200+200;
			const points = [];
			const divisions = 360 / resolutions[i];
			for(let j=0; j<=(360/divisions); j++){
				points.push( new Vector3( Math.cos((j*divisions)*(Math.PI/180))*circleRadius, 0, Math.sin((j*divisions)*(Math.PI/180))*circleRadius ));
			}
			const circleGeo = new BufferGeometry().setFromPoints( points );

			this.group.add(new Line( circleGeo, circleMat ));
		}
	}
}

export default PolarGrid;