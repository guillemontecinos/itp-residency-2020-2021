// https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

// import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js'

function main(){
    const canvas = document.querySelector('#c')
    const renderer = new THREE.WebGLRenderer({canvas})

    const fov = 40
    const aspect = 2
    const near = 0.1
    const far = 100
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 0, 15)

    // const controls = new OrbitControls(camera, canvas);
    // controls.target.set(0, 0, 0);
    // controls.update();

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

    const vertices = [
        // front
        { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
        { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
        
        { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
        { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
        // right
        { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
        { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
        { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
        
        { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
        { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
        { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
        // back
        { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
        { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
        { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
        
        { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
        { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
        { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
        // left
        { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], },
        { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
        { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
        
        { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
        { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
        { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1], },
        // top
        { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], },
        { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
        { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
        
        { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
        { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
        { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], },
        // bottom
        { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], },
        { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
        { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
        
        { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
        { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
        { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], },
    ]
    console.log(vertices)

    const positions = []
    const normals = []
    const uvs = []

    for(const vertex of vertices) {
        positions.push(...vertex.pos)
        normals.push(...vertex.norm)
        uvs.push(...vertex.uv)
    }
    console.log(positions)
    console.log(normals)
    console.log(uvs)

    const geometry = new THREE.BufferGeometry()
    const positionNumComponents = 3
    const normalNumComponents = 3
    const uvNumComponents = 2

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents)
    )
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
    )
    geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
    )

    const loader = new THREE.TextureLoader()
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png')

    function makeInstance(geometry, color, x){
        const material = new THREE.MeshPhongMaterial({color, map: texture})
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)

        cube.position.x = x
        return cube
    }

    const cubes = [
        makeInstance(geometry, 0x88FF88,  0),
        makeInstance(geometry, 0x8888FF, -4),
        makeInstance(geometry, 0xFF8888,  4),
    ]


    function render(time) {
        time *= 0.001
        if(resizeRendererToDisplaySize(renderer)){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        })

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
}

main()

