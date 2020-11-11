# Intro to Three.js – From nothing to importing an .obj model
*by Guillermo Montecinos*

[Three.js](https://threejs.org/) is a powerful JavaScript library that allows to render 3D graphics on the web browser, by using a [WebGL](https://www.khronos.org/webgl/) renderer. WebGL, onthe other hand, is *simplily* a JavaScript API that allows the browser render 3D graphics in the low level of your computer, specifically in its GPU. If you feel curious about the grpahics rendering process, please check out the [first chapter](https://thebookofshaders.com/01/) of the Books of Shaders.

In the following tutorial we will learn how to set up a basic three.js scene, with a basic element, which we'll animate and illuminate. Then, we'll learn how to control the camera with your mouse, to finally import an .obj model into the scene.

This tutorial is highly inspired –not to say is a remix of– on [Three.js Fundamentals](https://threejsfundamentals.org/) tutorial series by [https://gfxfundamentals.org/](https://gfxfundamentals.org/), and was designed to be taught at NYU ITP during fall 2020.

## The Three.js structure
Three.js' structure is very similar to any 3D engine like Unity, Unreal or Spark AR. There is a `scene` that parents all the elements on it: `objects`, `lights`, `meshes`, `materials`, etc. The scene represents a hierarchical structure of dependency and property heritage where childs inherit their parent's physical properties as position, rotation and scale (the three of them usually known in the computer graphics library world as the transform).

In order to be able to see a scene and all the elements on it, there is needed a camera that captures and represents them as a 2D image, and a renderer that takes the physical info from the scene and the graphic info from the camera and renders it on a HTML canvas (yeah, the same canvas where p5.js works).

<p align="center">
  <img src="https://github.com/guillemontecinos/itp-residency-2020-2021/blob/master/three-js/tutorial/assets/threejs-structure.jpg" align="middle" width="50%">
</p>

Finally, physical objects are represented as meshes. In three.js, a `mesh` has to be componed by a `geometry` that describes the spaciality of the shape, this means the `vertices` that compone each face of the shape, the `normals` which are the normal vector to each of the faces, and the `uv` coordinates, which represent how a material is mapped to the geometry. On the other side, the `mesh` is also componed by a `material` which represents the visual `shell` of the geometry.

## Hello world – Displaying a 3D Cube
Let's start our web 3D journey by displaying a basic and plain cube. To do that let's create an HTML canvas with a given id, which can be pointed by our renderer element from three.js.

```html
<canvas id='c'></canvas>
```
Then, let's create a JavaScript sketch and import it into the HTML file. Please notice that the HTML `<script>` has its `type` parameter set as `module` which means the way of importing libraries to our sketch is different, what will be seen more clearly in the next step.

```html
<canvas id='c'></canvas>
<script src='intro-to-three.js' type="module"></script>
```

Go to the JavaScript file, and type the following to import Three.js as a module into your program.
```js
import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'
```
The above statement means: *Import everything contained in the module loaded from the declared url under the name (*`as`*)* `THREE`. Then, let's declare a variable that stores the canvas as a DOM object by calling:

```js
const canvas = document.getElementById('c')
```
Note that we declared `canvas` as a `const`. We will do this as much as possible during this workshop because since 3D processing is heavy in terms of computation, it's a good idea to write our code as effcitien as possible. Then, let's create a `renderer` object that points to the `canvas`, which means the `renderer` will pass the camera and scene information to out laptop's GPU in order to get a 2D representation of the space based on the camera's perspectiv, and then it will display it on the canvas object.

```js
const renderer = new THREE.WebGLRenderer({canvas})
```
### Creating a camera
Since we already declared our `renderer`, we need two more elements to have a scene rendered on the canvas: the `scene` (duh) and a `camera`, let's start with cameras. In the 3D graphics world there are two main types of cameras: perspective and orthographic cameras. Perspective cameras simulate the behave of the human eye by replicating the perspective of a set of elements in the space, which means farther elements look smaller than closer elements. On the other hand, orthographic cameras use orthographic projection, also known as parallel projeciton. This means elements keep their size on the camera, even if they are at different distances from it.

In our case, we will use three.js' [`PerspectiveCamera`](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera), which takes four elements on its constructor: `fov` which represent the vertical [field of view](https://en.wikipedia.org/wiki/Field_of_view_in_video_games) (measured in degrees), `aspect` which respresents the aspect ratio of the camera, `near` which represents the distance between the camera and the near plane, and `far` which represents the distance between the camera and the farther plane. These 4 elements conform what is known as the camera frustrum or [viewing frustrum](https://en.wikipedia.org/wiki/Viewing_frustum).

<p align="center">
  <img src="https://github.com/guillemontecinos/itp-residency-2020-2021/blob/master/three-js/tutorial/assets/camera-diagram.jpg" align="middle" width="70%">
</p>

In this case, let's declare the following:

```js
const fov = 60
const aspect = 2
const near = 0.01
const far = 10
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
```

After creating the camera element, we need to create a scene which is where physically our elements will live.

```js
const scene = new THREE.Scene()
```

### Basic Cube
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