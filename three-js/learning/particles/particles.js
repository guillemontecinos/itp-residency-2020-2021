// Particle system with separation force, inspired in flocking simulation
// three.js particle system example: https://threejs.org/examples/?q=parti#webgl_buffergeometry_custom_attributes_particles
// flocking simulation example: https://thecodingtrain.com/CodingChallenges/124-flocking-boids

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js'
import Boid from './lib/boid.js'

let renderer, scene, camera, stats;

let particleSystem, uniforms, geometry;

let particleBoid

const particles = 1000;



init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, .1, 10);
    camera.position.z = 2;

    scene = new THREE.Scene();

    uniforms = {

        pointTexture: { value: new THREE.TextureLoader().load( "spark1.png" ) }

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


    const radius = .1;

    geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];
    const sizes = [];

    const color = new THREE.Color();

    for ( let i = 0; i < particles; i ++ ) {

        positions.push( ( Math.random() * 2 - 1 ) * radius );
        positions.push( ( Math.random() * 2 - 1 ) * radius );
        positions.push( ( Math.random() * 2 - 1 ) * radius );

        // color.setHSL( i / particles, 1.0, 0.5 );
        color.setHex(0xffffff)

        colors.push( color.r, color.g, color.b );

        sizes.push( 20 );

    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

    particleSystem = new THREE.Points( geometry, shaderMaterial );

    scene.add( particleSystem );

    console.log(particleSystem)

    particleBoid = new Boid(particleSystem.geometry)

    console.log(particleBoid)

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    const container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );

    new OrbitControls(camera, renderer.domElement)

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();
    // stats.update();

}

function render() {

    const time = Date.now() * 0.002;

    particleBoid.update(particleSystem.geometry)

    const sizes = geometry.attributes.size.array;

    for ( let i = 0; i < particles; i ++ ) {

        sizes[ i ] = .1 * ( 1 + Math.sin( 0.1 * i + time * 2 ) );

    }

    geometry.attributes.size.needsUpdate = true;

    renderer.render( scene, camera );

}