# Intro to Three.js – From nothing to importing an .obj model
*by Guillermo Montecinos*

[Three.js](https://threejs.org/) is a powerful JavaScript library that allows to render 3D graphics on the web browser, by using a [WebGL](https://www.khronos.org/webgl/) rednerer.

In the following tutorial we will learn how to set up a basic three.js scene, with a basic element, which we'll animate and illuminate. Then, we'll learn how to control the camera with your mouse, and finally we'll learn how to import an .obj model into the scene.

This tutorial couldn't be possible withouth [Three.js Fundamentals](https://threejsfundamentals.org/) tutorials by [https://gfxfundamentals.org/](https://gfxfundamentals.org/)

## Hello world – Cube
* On HTML create create canvas with id
```html
<canvas id='c'></canvas>
```
* Import Three.js as a module -> explain why modules and how to
```js
import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'
```
* create a var that stores the canvas
```js
const canvas = document.getElementById('c')
```
You can also do:
```js
const canvas = document.querySelector('#c')
```
* create a webgl renderer
```js
const renderer = new THREE.WebGLRenderer({canvas})
```
* create camera 
    * explain [field of view](https://en.wikipedia.org/wiki/Field_of_view_in_video_games)
    * explain [viewing frustrum](https://en.wikipedia.org/wiki/Viewing_frustum)
```js
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
```
* create scene
```js
const scene = new THREE.Scene()
```
* create basic cube
    * create geometry
    * create material
    * create mesh
    * add mesh to scene
```js
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x4d4fc6})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)
```
* render
```js
renderer.render(scene, camera)
```
## Animate Cube
* explain [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
* declare `function renderer(time)`
* use time to rotate the cube
* render inside loop
```js
function render(time){
    time *= .001
    cubeMesh.rotation.set(time, time, 0)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
```
## Make it responsive
* Make the canvas be screensize
```css
<style>
html, body {
   margin: 0;
   height: 100%;
}
#c {
   width: 100%;
   height: 100%;
   display: block;
}
</style>
```
* Force camera to keep aspect ratio
```js
const canvas = renderer.domElement;
camera.aspect = canvas.clientWidth / canvas.clientHeight;
camera.updateProjectionMatrix();
```
* Update the renderer display size
```js
function resizeRendererToDisplaySize(renderer){
    const canvas = renderer.domElement
    // get the browser window's size
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    const needsResize = width != canvas.width || height != canvas.height

    if (needsResize) {
        renderer.setSize(width, height)
    }
}
```
## Add basic lights
We cannot properly see the box edges. Let's change the material and add lights to improve its appearance.

* Adding lights
```js
const lightColor = 0xFFFFFF
const lightIntensity = 1
const light = new THREE.DirectionalLight(lightColor, lightIntensity)
light.position.set(-1, 2, 4)
scene.add(light)
```
* Using [MeshPhongMaterial](https://threejs.org/docs/index.html#api/en/materials/MeshPhongMaterial) to get a shinning surface
```js
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x4d4fc6})
```

## Orbit Controls
Control the camera to orbit around a target.
* Import orbit controls
```js
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js'
```
* Declare orbit controls passing the camera and canvas as arguments, and setting the origin as target.
```js
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();
```

## Import OBJ files
* First, let's add a an [`HemisphereLight`](https://threejs.org/docs/index.html#api/en/lights/HemisphereLight) that represents the sky light and will help us out improve the model's display. This light takes the sky and grond colors and fades from one to the another.
```js
const skyColor = 0xB1E1FF
const groundColor = 0xB97A20
const hemisphereLightIntensity = 1
const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemisphereLightIntensity)
scene.add(hemisphereLight)
```
* Import the module [`OBJLoader2`](https://threejs.org/docs/index.html#examples/en/loaders/OBJLoader2)
```js
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/OBJLoader2.js';
```
* Import the model
```js
const objLoader = new OBJLoader2()
objLoader.load(modelPath, (model) => {
    scene.add(model)
})
```
* Update camera position and target (on orbit control)
* Import `MTLLoader` and `MtlObjBridge` modules, that load the object's material and parse it in order to be understandable by `objLoader`.
```js
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/MTLLoader.js'
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'
```
* Load material using MTLLoader
```js
const mtlLoader = new MTLLoader()
mtlLoader.load(materialPath, (preMaterial) => {
    
})
```
* Parse the material using `MtlObjBridge.addMaterialsFromMtlLoader(preMaterial)`
* Add the material to the OBJLoader `objLoader.addMaterials(material)``
* And there we go
```js
const materialPath = './assets/plazadignidad-cau-1219/plazadignidad-cau-1219.mtl'
const mtlLoader = new MTLLoader()
mtlLoader.load(materialPath, (preMaterial) => {
    const material = MtlObjBridge.addMaterialsFromMtlLoader(preMaterial)
    // Load OBJ model
    const modelPath = './assets/plazadignidad-cau-1219/plazadignidad-cau-1219.obj'
    const objLoader = new OBJLoader2()
    objLoader.addMaterials(material)
    objLoader.load(modelPath, (model) => {
        scene.add(model)
    })
})
```