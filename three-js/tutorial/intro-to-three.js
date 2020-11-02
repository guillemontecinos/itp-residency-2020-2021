import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js'

const canvas = document.getElementById('c')
const renderer = new THREE.WebGLRenderer({canvas})

// Declaring camera constants, instantiating camera object, and setting camera position
const fov = 75
const aspect = 2
const near = 0.01
const far = 10
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 2)

// Creating scene, which is the root of the project
const scene = new THREE.Scene()

// Creating cube geometry, material and mesh
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x4d4fc6})
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x4d4fc6})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)

// Declaring light paramteres and instantiating a new light object
const lightColor = 0xFFFFFF
const lightIntensity = 1
const light = new THREE.DirectionalLight(lightColor, lightIntensity)
light.position.set(-1, 2, 4)
scene.add(light)

// Orbit controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

function render(time){
    time *= .0005

    if(resizeRendererToDisplaySize(renderer)){
        // Create a representation of the element where three.js is rendering
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // cubeMesh.rotation.set(time, time, 0)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
requestAnimationFrame(render)

function resizeRendererToDisplaySize(renderer){
    const canvas = renderer.domElement
    // get the browser window's size
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needsResize = width != canvas.width || height != canvas.height
    if (needsResize) {
        renderer.setSize(width, height, false)
    }
    return needsResize
}