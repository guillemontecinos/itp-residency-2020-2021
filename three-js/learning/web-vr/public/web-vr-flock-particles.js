import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js'
import { VRButton } from './jsm/VRButton.js';
// import { XRControllerModelFactory } from './jsm/webxr/XRControllerModelFactory.js';
// import { XRHandModelFactory } from './jsm/webxr/XRHandModelFactory.js';

let container;
let camera, scene, renderer;
let hand1, hand2;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let particleSystem, uniforms, geometry;

const tmpVector1 = new THREE.Vector3();
const tmpVector2 = new THREE.Vector3();

let controls;

let grabbing = false;
const scaling = {
    active: false,
    initialDistance: 0,
    object: null,
    initialScale: 1
};

const particles = 10000;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x444444 );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.set( 0, 1.6, 3 );

    controls = new OrbitControls( camera, container );
    controls.target.set( 0, 1.6, 0 );
    controls.update();

    const floorGeometry = new THREE.PlaneGeometry( 4, 4 );
    const floorMaterial = new THREE.MeshStandardMaterial( { color: 0x222222 } );
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add( floor );

    scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 6, 0 );
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = - 2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = - 2;
    light.shadow.mapSize.set( 4096, 4096 );
    scene.add( light );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;

    container.appendChild( renderer.domElement );

    document.body.appendChild( VRButton.createButton( renderer ) );

    // controllers
    controller1 = renderer.xr.getController( 0 );
    scene.add( controller1 );

    const controlBox1 = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), new THREE.MeshPhongMaterial({color: 0xe5dec5}))
    controller1.add(controlBox1);

    controller2 = renderer.xr.getController( 1 );
    scene.add( controller2 );

    const controlBox2 = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), new THREE.MeshPhongMaterial({color: 0xe5dec5}))
    controller2.add(controlBox2)

    // Hand 1
    hand1 = renderer.xr.getHand( 0 );
    scene.add( hand1 );

    // Hand 2
    hand2 = renderer.xr.getHand( 1 );
    scene.add( hand2 );

    window.addEventListener( 'resize', onWindowResize );

    // Particle system
    uniforms = {

        pointTexture: { value: new THREE.TextureLoader().load( "/spark1.png" ) }

    };

    const shaderMaterial = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true

    } );


    const radius = 5;

    geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];
    const sizes = [];

    const color = new THREE.Color();

    for ( let i = 0; i < particles; i ++ ) {

        positions.push( ( Math.random() * 2 - 1 ) * radius );
        positions.push( ( Math.random() * 2 - 1 ) * radius );
        positions.push( ( Math.random() * 2 - 1 ) * radius );

        color.setHSL( i / particles, 1.0, 0.5 );

        colors.push( color.r, color.g, color.b );

        sizes.push( 20 );

    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

    particleSystem = new THREE.Points( geometry, shaderMaterial );

    scene.add( particleSystem );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

    renderer.setAnimationLoop( render );

}

function render() {

    if ( scaling.active ) {

        const indexTip1Pos = hand1.joints[ 'index-finger-tip' ].position;
        const indexTip2Pos = hand2.joints[ 'index-finger-tip' ].position;
        const distance = indexTip1Pos.distanceTo( indexTip2Pos );
        const newScale = scaling.initialScale + distance / scaling.initialDistance - 1;
        scaling.object.scale.setScalar( newScale );

    }

    const time = Date.now() * 0.002;

    // particleSystem.rotation.z = 0.01 * time;

    const sizes = geometry.attributes.size.array;

    for ( let i = 0; i < particles; i ++ ) {

        sizes[ i ] = .5 * ( 1 + Math.sin( 0.1 * i + time ) );

    }

    geometry.attributes.size.needsUpdate = true;


    renderer.render( scene, camera );

    // console.log(controller1)

}
