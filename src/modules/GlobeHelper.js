import {
	LineBasicMaterial,
	Vector3,
	BufferGeometry,
	Line,
	Group,
	Color,
	SphereGeometry,
	ShaderMaterial,
	BackSide,
	Mesh
}  from 'three'


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

class Globe {
	constructor(radius, nLat=15, nLon=32, segments=32, color='white',gradient ) {
		this.group = new Group();
		const _rad = radius*.8
		nLat = nLat + 1 ;

		const circleMat = new LineBasicMaterial( { color: color } );

		var circularSegment = Math.PI / nLat;
		for(let i=1; i<nLat; i++)
		{
			var yRadius = Math.sin(i * circularSegment) * _rad;
			var y = Math.cos(i * circularSegment) * _rad;
			const latCircle = drawCircle( yRadius, segments, y, circleMat );
			this.group.add(latCircle);
		}

		const lonCircle = drawCircle( _rad, segments, 0, circleMat );
		lonCircle.rotation.x = Math.PI / 2;

		for(let i=1; i<nLon/2; i++)
		{
			const circleClone = lonCircle.clone();
			circleClone.rotation.z = Math.PI * 2 / nLon * i;
			this.group.add(circleClone);
		}

		this.group.add(lonCircle);

		const geometry = new SphereGeometry( radius, 28, 11 );
    const material = new ShaderMaterial({
      uniforms: {
        color1: {
          value: new Color(gradient.bottom)
        },
        color2: {
          value: new Color(gradient.top)
        }
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;

        varying vec2 vUv;

        void main() {

          gl_FragColor = vec4(mix(color1, color2, smoothstep(0.2,0.7,vUv.y)), 1.0);
        }
      `,
      side:BackSide
    });
    this.sphere = new Mesh( geometry, material );
    this.group.add( this.sphere );
	}

	updateGradient(gradient){
		this.sphere.material.uniforms.color1.value=new Color(gradient.bottom)
		this.sphere.material.uniforms.color2.value=new Color(gradient.top)
	}
	updateGlobeGrid(lineColor){
		this.group.children.forEach(
			line => line.material.color=new Color(lineColor)
		)
	}
}

export default Globe;
//const globeHelper = new globe(100, 13, 32, 'red');
//scene.add( globeHelper );