// https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

function main(){
    const canvas = document.querySelector('#c')
    const renderer = new THREE.WebGLRenderer({canvas})

    const fov = 40
    const aspect = 2
    const near = 0.1
    const far = 1000
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 50, 0)
    camera.up.set(0, 0, 1)
    camera.lookAt(0, 0, 0)

    const scene = new THREE.Scene()

    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.PointLight(color, intensity);
        scene.add(light);
    }

    // Elements declaration
    const objects = []

    const radius = 1
    const widthSegments = 6
    const heightSegments = 6
    const sphereGeometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments)

    const solarSystem = new THREE.Object3D()
    scene.add(solarSystem)
    objects.push(solarSystem)

    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00})
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
    sunMesh.scale.set(5, 5, 5)
    solarSystem.add(sunMesh)
    objects.push(sunMesh)

    const earthOrbit = new THREE.Object3D()
    earthOrbit.position.set(10, 0, 0)
    solarSystem.add(earthOrbit)
    objects.push(earthOrbit)

    const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244})
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
    earthOrbit.add(earthMesh)
    objects.push(earthMesh)

    const moonOrbit = new THREE.Object3D()
    moonOrbit.position.set(2, 0, 0)
    earthOrbit.add(moonOrbit)

    const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222})
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
    moonMesh.scale.set(.5, .5, .5)
    moonOrbit.add(moonMesh)
    objects.push(moonMesh)

    console.log(scene)

    function render(time) {
        time *= .0003

        objects.forEach(object => {
            object.rotation.set(0, time, 0)
        })
        
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
}

main()

