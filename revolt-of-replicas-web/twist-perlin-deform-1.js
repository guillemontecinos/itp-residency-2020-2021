// https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js'
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/MTLLoader.js'
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'
import $ from './jquery.js'

const objPath = './plazadignidad-cau-1219/plazadignidad-cau-1219-collapsed-010.obj'
const mtlPath = './plazadignidad-cau-1219/plazadignidad-cau-1219-collapsed-010.mtl'

const canvas = document.querySelector('#c')
const renderer = new THREE.WebGLRenderer({canvas})

const fov = 40
const aspect = 2
const near = 0.1
const far = 150
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 50, 80)
camera.rotation.set(-Math.PI/7, 0, 0)

const windowWidth = renderer.domElement.clientWidth
const windowHeight = renderer.domElement.clientHeight

const scene = new THREE.Scene()
scene.background = new THREE.Color('black')

{
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}

{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
}

// TODO: Lower model's vertices number
const box = new THREE.Box3()
const backupGeometry = new THREE.BufferGeometry()
{
    const mtlLoader = new MTLLoader()
    mtlLoader.load(mtlPath, (mtlParseResult) => {
        const objLoader = new OBJLoader2()
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult)
        objLoader.addMaterials(materials)
        objLoader.load(objPath, (root) => {
            // backup original model positions
            backupGeometry.copy(root.children[0].geometry)

            // set dynamic usage of position attribute
            root.children[0].geometry.attributes.position.setUsage(THREE.DynamicDrawUsage)
            root.children[0].geometry.attributes.normal.setUsage(THREE.DynamicDrawUsage)
            scene.add(root)
            console.log(root)
            
            box.setFromObject(root)
            // const boxSize = box.getSize(new THREE.Vector3()).length()
            // const boxCenter = box.getCenter(new THREE.Vector3())
            // console.log(box)
            // console.log(boxCenter)
        })
    })
}

const s = new THREE.Spherical(1, Math.random() * Math.PI, Math.random() * Math.PI)

let deformFactor = 0
function render(time) {
    time *= .0000003
    // console.log(time)

    if(resizeRendererToDisplaySize(renderer)){
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // Update obj positions =================================
    // twistObject3D(scene.children[3], backupGeometry, deformFactor, new THREE.Vector3(0, 1, 0), 4 * Math.PI )
    // twistPerlinDeform(scene.children[3], backupGeometry, deformFactor, new THREE.Vector3(0, 1, 0), 4 * Math.PI, .1)
    twistPerlinDeform(scene.children[3], backupGeometry, deformFactor, new THREE.Vector3().setFromSpherical(s), 4 * Math.PI, .1)
    // Update obj positions =================================

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

function twistObject3D(element, backupGeom, twistFactor, axis, maxAngle) {
    // element -> THREE.Object3D
    // backupGeom -> THREE.BufferGeometry
    // axis -> THREE.Vector3
    // twistFactor -> (0, 1)
    // maxAngle -> rads

    const tempPos = new THREE.Vector3()
    const tempNorm = new THREE.Vector3()
    let direction = 1

    if(element){
        const positions = backupGeom.getAttribute('position').array
        const normals = backupGeom.getAttribute('normal').array
        // console.log(positions)
        for(let i = 0; i < positions.length; i += 3){
            tempPos.fromArray(positions, i)
            const factor =  THREE.MathUtils.mapLinear(tempPos.y, box.min.y, box.max.y, 0, 1)

            tempPos.applyAxisAngle(axis, maxAngle * twistFactor * factor * direction)
            tempPos.toArray(element.children[0].geometry.attributes.position.array, i);

            tempNorm.fromArray(normals, i)
            tempNorm.applyAxisAngle(axis, maxAngle * twistFactor * factor * direction)
            tempNorm.toArray(element.children[0].geometry.attributes.normal.array, i);
        }
        element.children[0].geometry.getAttribute('position').needsUpdate = true
        element.children[0].geometry.getAttribute('normal').needsUpdate = true
    }
}

function twistPerlinDeform(element, backupGeom, deformFactor, axis, maxAngle, alpha) {
    // element -> THREE.Object3D    
    // backupGeom -> THREE.BufferGeometry
    // axis -> THREE.Vector3
    // factor -> (0, 1)
    // maxAngle -> rads

    const tempPos = new THREE.Vector3()
    const tempNorm = new THREE.Vector3()
    let direction = 1

    if(element){
        const positions = backupGeom.getAttribute('position').array
        const normals = backupGeom.getAttribute('normal').array
        // console.log(positions)
        for(let i = 0; i < positions.length; i += 3){
            tempPos.fromArray(positions, i)
            const factor =  THREE.MathUtils.mapLinear(tempPos.y, box.min.y, box.max.y, 0, 1)

            tempPos.applyAxisAngle(axis, maxAngle * deformFactor * factor * direction)

            const r = 1 + THREE.MathUtils.mapLinear(PerlinNoise.noise(tempPos.x * alpha, tempPos.y
                * alpha, tempPos.z * alpha), 0, 1, -.8, .8) * deformFactor
            tempPos.multiplyScalar(r)

            tempPos.toArray(element.children[0].geometry.attributes.position.array, i);

            tempNorm.fromArray(normals, i)
            tempNorm.applyAxisAngle(axis, maxAngle * deformFactor * factor * direction)
            tempNorm.toArray(element.children[0].geometry.attributes.normal.array, i);
        }
        element.children[0].geometry.getAttribute('position').needsUpdate = true
        element.children[0].geometry.getAttribute('normal').needsUpdate = true
    }
}

// This is a port of Ken Perlin's Java code. The
// original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
// Note that in this version, a number from 0 to 1 is returned.
const PerlinNoise = new function() {

    this.noise = function(x, y, z) {
    
    var p = new Array(512)
    var permutation = [ 151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ];
    for (var i=0; i < 256 ; i++) 
    p[256+i] = p[i] = permutation[i]; 

        var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
            Y = Math.floor(y) & 255,                  // CONTAINS POINT.
            Z = Math.floor(z) & 255;
        x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
        y -= Math.floor(y);                                // OF POINT IN CUBE.
        z -= Math.floor(z);
        var    u = fade(x),                                // COMPUTE FADE CURVES
                v = fade(y),                                // FOR EACH OF X,Y,Z.
                w = fade(z);
        var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
            B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

        return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                        grad(p[BA  ], x-1, y  , z   )), // BLENDED
                                lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                        grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                        lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                        grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                                lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                        grad(p[BB+1], x-1, y-1, z-1 )))));
    }
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp( t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
        var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
        var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
                v = h<4 ? y : h==12||h==14 ? x : z;
        return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
    } 
    function scale(n) { return (1 + n)/2; }
}

let prevTime = 0, prevTop = 0

$('#scrollable').scroll(() => {
    let currentTop = $('#scrollable').scrollTop()
    let currentTime = new Date().getTime()
    let pixDelta = currentTop - prevTop
    let deltaTime = currentTime - prevTime
    let speed = 5e7 * pixDelta / deltaTime
    deformFactor += speed
    prevTop = currentTop
    // console.log('pixDelta: ' + pixDelta)
    // console.log('deltaTime: ' + deltaTime)
    // console.log('swipe speed: ' + speed)
    // console.log('scrollable top: ' + $('#scrollable').scrollTop())
})