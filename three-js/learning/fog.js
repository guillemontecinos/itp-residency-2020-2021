import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js'
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/MTLLoader.js'
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'

const canvas = document.querySelector('#c')
const renderer = new THREE.WebGLRenderer({canvas})
const scene = new THREE.Scene()

// camera
const fov = 40
const aspect = 2
const near = 0.1
const far = 150
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 50, 80)
camera.lookAt(0, 0, 0)
camera.updateProjectionMatrix()
scene.add(camera)

// Hemisphere light
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const intensity = 1.5;
const hLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(hLight);

// Directional light
// const color = 0xFFFFFF;
// const intensity = 1;
// const dLight = new THREE.DirectionalLight(color, intensity);
// dLight.position.set(0, 10, 0);
// dLight.target.position.set(-5, 0, 0);
// scene.add(dLight);
// scene.add(light.target);

// obj import
const objPath = './plazadignidad-cau-1219/plazadignidad-cau-1219.obj'
const mtlPath = './plazadignidad-cau-1219/plazadignidad-cau-1219.mtl'
const mtlLoader = new MTLLoader()
mtlLoader.load(mtlPath, (mtlParseResult) => {
    const objLoader = new OBJLoader2()
    const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult)
    objLoader.addMaterials(materials)
    objLoader.load(objPath, (root) => {
        scene.add(root)
        console.log(root)
    })
})

// Fog
const fogColor = 0xFFFFFF
const fogNear = 50
const fogFar = 80
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar)
// const fogDensity = .1
// scene.fog = new THREE.FogExp2(fogColor, fogDensity)

function render(time) {
    time *= .0005
    // console.log(time)

    if(resizeRendererToDisplaySize(renderer)){
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera)

    requestAnimationFrame(render)
}
requestAnimationFrame(render)

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needsResize = canvas.width !== width || canvas.height !== height
    if(needsResize) {
        renderer.setSize(width, height, false)
    }
    return needsResize
}
