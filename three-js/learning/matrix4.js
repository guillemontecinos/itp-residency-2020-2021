import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

const canvas = document.getElementById('c')
const renderer = new THREE.WebGLRenderer({canvas})
const scene = new THREE.Scene()

// Scene Camera 
const fov = 50
const aspect = 2
const near = 0.01
const far = 40
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 4, 0)
camera.lookAt(0, 0, 0)
scene.add(camera)

// // Adding hemisphere light
const skyColor = 0xB1E1FF
const groundColor = 0xB97A20
const hemisphereLightIntensity = 1.5
const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemisphereLightIntensity)
scene.add(hemisphereLight)

// Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial =  new THREE.MeshPhongMaterial({color: 0x873e2d})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
const cubeLookAt = new THREE.Vector3(0, 1, 0)
cubeMesh.position.set(0, 0, 0)
cubeMesh.matrixAutoUpdate = false
cubeMesh.updateMatrix()
scene.add(cubeMesh)


const translationVector = new THREE.Vector3(1, 0, 0)
const translationMatrix = new THREE.Matrix4().makeTranslation(translationVector.x, translationVector.y, translationVector.z)
console.log(translationMatrix)

const rotationQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 5)
const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(rotationQuat)

const transformMatrix = new THREE.Matrix4()

transformMatrix.multiply(rotationMatrix)
transformMatrix.multiply(translationMatrix)

console.log(transformMatrix)

cubeMesh.matrix.multiply(transformMatrix)

console.log(cubeMesh)

function renderFrame(time){
    time *= .0005

    if(resizeRendererToDisplaySize(renderer)){
        // Create a representation of the element where three.js is rendering
        const cnv = renderer.domElement;
        camera.aspect = cnv.clientWidth / cnv.clientHeight;
        camera.updateProjectionMatrix();
    }

    // cubeMesh.rotation.set(time, time, 0)
    renderer.render(scene, camera)
    requestAnimationFrame(renderFrame)
}
requestAnimationFrame(renderFrame)

function resizeRendererToDisplaySize(renderer){
    // console.log(camera.position)
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