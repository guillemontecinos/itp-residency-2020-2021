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
## Orbit Controls
## Import OBJ files