# Intro to Three.js

## Hello world – Cube
* On HTML create create canvas with id
* Import Three.js as a module -> explain why modules and how to
* create a var that stores the canvas
* create a webgl renderer `const renderer = new THREE.WebGLRenderer()`
* create camera 
    * explain [field of view](https://en.wikipedia.org/wiki/Field_of_view_in_video_games)
    * explain [viewing frustrum](https://en.wikipedia.org/wiki/Viewing_frustum)
* create scene
* create basic cube
    * create geometry
    * create material
    * create mesh
    * add mesh to scene
* render
## Animate Cube
* explain [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
* declare `function renderer(time)`
* use time to rotate the cube
* render inside loop
## Make it responsive
## Orbit Controls
## Import OBJ files