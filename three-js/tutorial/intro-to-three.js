import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

const canvas = document.getElementById('c')
const renderer = new THREE.WebGLRenderer({canvas})

const fov = 75
const aspect = 2
const near = 0.01
const far = 10
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 2)

const scene = new THREE.Scene()

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x4d4fc6})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)


function render(time){
    time *= .001
    cubeMesh.rotation.set(time, time, 0)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
requestAnimationFrame(render)