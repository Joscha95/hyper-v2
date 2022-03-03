import {LineBasicMaterial,Vector3,BufferGeometry,Line,Group}  from 'three'


function drawCircle(circleRadius, circleSegments, y=0,mat )
{
	const points = [];
	const divisions = 360 / circleSegments;
	for(let i=0; i<=(360/divisions); i++){
		points.push( new Vector3( Math.cos((i*divisions)*(Math.PI/180))*circleRadius, y, Math.sin((i*divisions)*(Math.PI/180))*circleRadius ));
	}
	const circleGeo = new BufferGeometry().setFromPoints( points );
	return new Line( circleGeo, mat );
}

const Globe = function drawGlobe ( radius, nLat=15, nLon=32, segments=32, color='white' ) {

	const Circles = new Group();
	Circles.hyperType='GlobeHelper';
	nLat = nLat + 1 ;

	const circleMat = new LineBasicMaterial( { color: color } );

	var circularSegment = Math.PI / nLat;
	for(let i=1; i<nLat; i++)
	{
		var yRadius = Math.sin(i * circularSegment) * radius;
		var y = Math.cos(i * circularSegment) * radius;
		const latCircle = drawCircle( yRadius, segments, y, circleMat );
		Circles.add(latCircle);
	}

	const lonCircle = drawCircle( radius, segments );
	lonCircle.rotation.x = Math.PI / 2;

	for(let i=1; i<nLon/2; i++)
	{
		const circleClone = lonCircle.clone();
		circleClone.rotation.z = Math.PI * 2 / nLon * i;
		Circles.add(circleClone);
	}

	Circles.add(lonCircle);

	return Circles;
}

export default Globe;
//const globeHelper = new globe(100, 13, 32, 'red');
//scene.add( globeHelper );