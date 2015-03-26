


Carpet = function( o ){

    THREE.Group.call(this);
    var scope = this;
    scope.type = 'Carpet';
    scope.cubes = [];

    o = o || {};
    scope.color = o.color || 0x0074b0;
    scope.size = o.size || new THREE.Vector3(1,1,1);
    scope.subd = o.subd || new THREE.Vector3(5,0,5);

	function init(){
		var unitX = scope.size.x/scope.subd.x,
			unitZ = scope.size.z/scope.subd.z;
		var geo = new THREE.BoxGeometry(unitX, scope.size.y, unitZ);
		var mat = new THREE.MeshPhongMaterial({
			color: scope.color
// 			,diffuse: 0x20a4d0
		});

		var cube = null;
		for( var i=0; i<scope.subd.x; i++)
		{
			for( var j=0; j<scope.subd.z; j++)
			{
				cube = new THREE.Mesh( geo, mat );
				cube.translateX( unitX*(i+.5) );
				cube.translateZ( unitZ*(j+.5) );

				scope.cubes.push( cube );
				scope.add( cube );
			}
		}
	}

	this.update = function( t ){

		for( var i=0; i<scope.subd.x; i++)
		{
			for( var j=0; j<scope.subd.z; j++)
			{
				cube = scope.cubes[ i+j*scope.subd.x ];

				cube.scale.y = 1 + Math.max(0, Math.cos( t*.001 )*i + Math.sin( t*.001 )*j )/2;
				cube.position.setY( cube.scale.y/2 );
			}
		}
	};

	init();

	return this;
}

Carpet.prototype = Object.create(THREE.Group.prototype);
Carpet.prototype.constructor = Carpet;



(function(){

	var time = 0,
		time_now = 0,
		time_delta = 0,

		camera, controls,
		scene, renderer,

		carpet
	;




	function init() {

		var container = document.querySelector( "#Main" );

		camera = new THREE.PerspectiveCamera( 30, container.clientWidth / container.clientHeight, 1, 100 );
		camera.position.set( 10, 20, 30 );

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0xbbbbbb, 0.002 );

		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.update();
		controls.addEventListener( 'change', render );


		/**********************
		 *        Plane       *
		 **********************/

		 var plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 500, 500 ),
			new THREE.MeshBasicMaterial({
				color: 0xeeeeee
			})
		);
		plane.rotateX( -Math.PI/2 );
		scene.add( plane );


		/**********************
		 *        Light       *
		 **********************/

		var lightP0 = new THREE.PointLight( 0xffffff );
		lightP0.position.set( 30, 60, 80 );
		lightP0.lookAt( 0, 0, 0 );
		scene.add( lightP0 );

		var lightA = new THREE.AmbientLight( 0x202020 );
		scene.add( lightA );

	// 	scene.add( new THREE.PointLightHelper( lightP0, 20 ) );
	// 	scene.add( new THREE.PointLightHelper( lightA, 20 ) );

		scene.lights = [ lightP0, lightA ];


		/**********************
		 *     AxisHelper     *
		 **********************/

		var axis = new THREE.AxisHelper( 20 );
		scene.add( axis );



		/**********************
		 *       Carpet       *
		 **********************/

		carpet = new Carpet();
		carpet.scale.set( 10, 2, 10 );
		carpet.translateY( carpet.scale.y/2 );
		scene.add( carpet );
	}




	/**********************
	*        Loop        *
	**********************/


	function update() {

		var time_now = Date.now(),
			time_delta = time_now - time;

		if(carpet) carpet.update( time_now );

		render();
		time = time_now;
		requestAnimationFrame( update );
	}

	function render() {
		
		renderer.render( scene, camera );
	}


	init();
	update();

})();
