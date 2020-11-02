# Intro to Three.js

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

## References
* This tutorial couldn't be possible withouth [Three.js Fundamentals](https://threejsfundamentals.org/) tutorials by [https://gfxfundamentals.org/](https://gfxfundamentals.org/)