import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

const canvas = document.getElementById('c')
const renderer = new THREE.WebGLRenderer({canvas})
const scene = new THREE.Scene()

// Scene Camera 
// const fov = 50
// const aspect = 2
// const near = 0.01
// const far = 30
// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
// camera.position.set(0, -16, 6)
// camera.lookAt(0, 0, 0)
// scene.add(camera)

// Hemisphere Light
const skyColor = 0xffffff
const groundColor = 0xddc199
const hemisphereLightIntensity = 1.5
const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemisphereLightIntensity)
scene.add(hemisphereLight)

// Plane
const planeSize = 20
const loader = new THREE.TextureLoader();
const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize)
// const planeMaterial =  new THREE.MeshPhongMaterial({color: 0xffffff})
const planeMaterial =  new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

// Scenario Guard
const planeGuard = new THREE.Box3().setFromObject(planeMesh)

// Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial =  new THREE.MeshPhongMaterial({color: 0x873e2d})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
const cubeLookAt = new THREE.Vector3(0, 1, 0)
cubeMesh.position.set(0, 0, .5)
cubeMesh.matrixAutoUpdate = false
cubeMesh.updateMatrix()
scene.add(cubeMesh)

// Cube Camera
const fov = 70
const aspect = 2
const near = 0.01
const far = 20
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
cubeMesh.add(camera)
camera.position.set(0, -1.1, 1)
camera.lookAt(0, 1, .5)

console.log(cubeMesh)

// let boxZRot = 0
// Render
function renderFrame(time){
    time *= .0005

    updateCubeTransform()

    if(resizeRendererToDisplaySize(renderer)){
        // Create a representation of the element where three.js is rendering
        const cnv = renderer.domElement;
        camera.aspect = cnv.clientWidth / cnv.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera)
    requestAnimationFrame(renderFrame)
}
requestAnimationFrame(renderFrame)

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


function updateCubeTransform() {
    // For efficiency purposes let's make all calculations and matrix update only when an interaction is detected
    if(moveFront || moveBack || boxZRotSpeed != 0) {
        // ========================= With Matrices =====================
        // Rotation
        const transformMatrix = new THREE.Matrix4()

        const rotationQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), boxZRotSpeed)
        const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(rotationQuat)
        transformMatrix.multiply(rotationMatrix)
        // Position
        let moveDirection = 0
        if(moveFront) {
            moveDirection = 1
        }
        if(moveBack) {
            moveDirection = -1
        }
        const cubeLookAtCopy = new THREE.Vector3().copy(cubeLookAt)
        cubeLookAtCopy.multiplyScalar(translateSpeed * moveDirection)
        const translationMatrix = new THREE.Matrix4().makeTranslation(cubeLookAtCopy.x, cubeLookAtCopy.y, cubeLookAtCopy.z)
        transformMatrix.multiply(translationMatrix)
        
        // Test if inside the guard
        const nextTransformMatrix = new THREE.Matrix4().copy(cubeMesh.matrix)
        nextTransformMatrix.multiply(transformMatrix)
        const pos = new THREE.Vector3().setFromMatrixPosition(nextTransformMatrix)
        pos.z = 0
        if(planeGuard.containsPoint(pos)) cubeMesh.matrix.copy(nextTransformMatrix)

        // cubeMesh.matrix.multiply(transformMatrix)
        // ========================= With Matrices =====================

        // ======================= Without Matrices =====================
        // // Rotation
        // boxZRot += boxZRotSpeed
        // cubeMesh.rotation.set(0, 0, boxZRot)
        // // Position
        // let moveDirection = 0
        // if(moveFront) {
        //     moveDirection = 1
        // }
        // if(moveBack) {
        //     moveDirection = -1
        // }
        // const cubeLookAtCopy = new THREE.Vector3().copy(cubeLookAt)
        // const translateTo = cubeLookAtCopy.applyAxisAngle(new THREE.Vector3(0, 0, 1), boxZRot)
        // translateTo.multiplyScalar(translateSpeed * moveDirection)
        // const cubeNextPosition = new THREE.Vector3().copy(cubeMesh.position)
        // cubeNextPosition.add(translateTo)
        // if(planeGuard.containsPoint(new THREE.Vector3(cubeNextPosition.x, cubeNextPosition.y, 0))) cubeMesh.position.add(translateTo)
        // cubeMesh.updateMatrix()
        // ======================= Without Matrices =====================
    }
}

// User interaction
const translateSpeed = .04
let moveFront = false, moveBack = false, moveLeft = false, moveRight = false

window.addEventListener('keydown', (e) => {
    if(e.key === 'w' || e.key === 'W'){
        moveFront = true
    }
    else if(e.key === 's' || e.key === 'S'){
        moveBack = true
    }
})

window.addEventListener('keyup', (e) => {
    if(e.key === 'w' || e.key === 'W'){
        moveFront = false
    }
    else if(e.key === 's' || e.key === 'S'){
        moveBack = false
    }
})

let boxZRotSpeed = 0
canvas.addEventListener('mousemove', (e) => {
    if(e.offsetX > renderer.domElement.clientWidth / 2 + 75 || e.offsetX < renderer.domElement.clientWidth / 2 - 75) {
        boxZRotSpeed = THREE.MathUtils.mapLinear(e.offsetX, 0, renderer.domElement.clientWidth, Math.PI / 300, -Math.PI / 300)
    }
    else { 
        boxZRotSpeed = 0
    }
})