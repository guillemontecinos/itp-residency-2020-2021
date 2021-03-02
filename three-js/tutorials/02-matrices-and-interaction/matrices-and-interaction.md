# 02 – Intro to Three.js – Matrices and interaction
## Scenario Setup
### Basic Setup – Canvas, Renderer, Scene and Lighting
```js
import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

// Three.js setup
const canvas = document.getElementById('c')
const renderer = new THREE.WebGLRenderer({canvas})
const scene = new THREE.Scene()

// Hemisphere Light
const skyColor = 0xffffff
const groundColor = 0xddc199
const hemisphereLightIntensity = 1.5
const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemisphereLightIntensity)
scene.add(hemisphereLight)
```
### Plane Setup – Geometry, Texture and Guard

```js
// Plane
const planeSize = 20
// Texture instance
const loader = new THREE.TextureLoader();
// Texture load
const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
// Texture UV mapping
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// Texture magnification
texture.magFilter = THREE.NearestFilter;
// Texture setup
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);
// Plane geometry decalaration
const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize)
// Plane Material decalaration
const planeMaterial =  new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide
})
// Plane Mesh creation
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

// Scenario Guard
const planeGuard = new THREE.Box3().setFromObject(planeMesh)
```
## Player Setup – Cube and Camera
```js
// Cube setup
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial =  new THREE.MeshPhongMaterial({color: 0x873e2d})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
const cubeLookAt = new THREE.Vector3(0, 1, 0)
cubeMesh.position.set(0, 0, 0)
// Set matrixAutoUpdate to false in order to avoid the renderer recalculating the matrix on every frame. In this way we can manipulate the matrix by hand
cubeMesh.matrixAutoUpdate = false

// Cube Camera
const fov = 70
const aspect = 2
const near = 0.01
const far = 20
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
cubeMesh.add(camera)
camera.position.set(0, -1.1, 1)
camera.lookAt(0, 1, .5)
// Attach the camera as a child of the cube. This way the camera's coordinate system (or matrix) is referenced to the cube's
scene.add(cubeMesh)
```
## 3D transforms and interaction
### Setting User Interaction
```js
// User interaction
const translateSpeed = .04
let moveFront = false, moveBack = false
// Use keyboard pressed event to detect if W & S keys are pressed: W to move front and S to move back. Key down sets the moment when the interaction starts and keyup the moment when the interaction stops.
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
// Declare a mousemove event to detect the current mouse's position and calculate a rotation speed based on that. That angular speed will be applied to rotate the cube on each frame update.
let boxZRotSpeed = 0
canvas.addEventListener('mousemove', (e) => {
    if(e.offsetX > renderer.domElement.clientWidth / 2 + 75 || e.offsetX < renderer.domElement.clientWidth / 2 - 75) {
        boxZRotSpeed = THREE.MathUtils.mapLinear(e.offsetX, 0, renderer.domElement.clientWidth, Math.PI / 300, -Math.PI / 300)
    }
    else { 
        boxZRotSpeed = 0
    }
})
```
### 3D Matrices
### Transforming the Player's matrix
```js
function updateCubeTransform() {
    // For efficiency purposes let's make all calculations and matrix update only when an interaction is detected
    if(moveFront || moveBack || boxZRotSpeed != 0) {
        // Declare an identity 4x4 matrix that will store rotation and translation transforms, and subsequently will be applied to the mesh's matrix
        const transformMatrix = new THREE.Matrix4()

        // Rotation
        // Declare a quaternion from an axis rotation around z (because in our system z is pointing up)
        const rotationQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), boxZRotSpeed)
        // Declare a 4x4 matrix from the quaternion that represents rotation
        const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(rotationQuat)
        // Apply rotation by multiplying transformMatrix by rotationMatrix
        transformMatrix.multiply(rotationMatrix)

        // Position
        let moveDirection = 0
        if(moveFront) {
            moveDirection = 1
        }
        if(moveBack) {
            moveDirection = -1
        }
        // Since the rotation has been previously applied to the transformMatrix, the mesh's "front" has rotated. Then, applying translating the cube in the y-direction means it will move in the y-direction of the already rotated cube's coordinate system.
        const cubeLookAtCopy = new THREE.Vector3().copy(cubeLookAt)
        // Calculate a vector that represents the translation in terms of direction and magnitude
        cubeLookAtCopy.multiplyScalar(translateSpeed * moveDirection)
        // Decalre a translation matrix from the above vector
        const translationMatrix = new THREE.Matrix4().makeTranslation(cubeLookAtCopy.x, cubeLookAtCopy.y, cubeLookAtCopy.z)
        // Apply translation to the transformMatrix
        transformMatrix.multiply(translationMatrix)
        
        // Test if inside the guard
        // Create an auxiliary matrix to estimate the next position after the transform is applied
        const nextTransformMatrix = new THREE.Matrix4().copy(cubeMesh.matrix)
        // Apply transformation
        nextTransformMatrix.multiply(transformMatrix)
        // Retrieve position 3D vector from next step matrix
        const pos = new THREE.Vector3().setFromMatrixPosition(nextTransformMatrix)
        pos.z = 0
        // Update the cube's matrix to that vector only if the vector is inside the plane guard.
        if(planeGuard.containsPoint(pos)) cubeMesh.matrix.copy(nextTransformMatrix)
    }
}
```
```js
// Render
function renderFrame(){
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
```

## Resources
* [The True Power of the Matrix (Transformations in Graphics) - Computerphile](https://www.youtube.com/watch?v=vQ60rFwh2ig)
* [Understanding 3D matrix transforms](https://medium.com/swlh/understanding-3d-matrix-transforms-with-pixijs-c76da3f8bd8)
* [Transformation Matrix – Wikipedia](https://en.wikipedia.org/wiki/Transformation_matrix)
* [Matrix transformations – Three.js](https://threejs.org/docs/#manual/en/introduction/Matrix-transformations)