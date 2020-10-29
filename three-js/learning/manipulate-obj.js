// https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js'
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js'
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/MTLLoader.js'
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'

function main(){
    // const objPath = './Full_body/model_mesh.obj'
    // const mtlPath = './Full_body/model_mesh.obj.mtl'
    const objPath = './plazadignidad-cau-1219/plazadignidad-cau-1219.obj'
    const mtlPath = './plazadignidad-cau-1219/plazadignidad-cau-1219.mtl'

    const canvas = document.querySelector('#c')
    const renderer = new THREE.WebGLRenderer({canvas})

    const fov = 40
    const aspect = 2
    const near = 0.1
    const far = 150
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 50, 80)
    camera.rotation.set(-Math.PI/7, 0, 0)

    let mouseX = 0
    let mouseY = 0
    const windowWidth = renderer.domElement.clientWidth
    const windowHeight = renderer.domElement.clientHeight

    let prevMouseX = 0

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

    let box
    const backupModel = new THREE.Object3D()
    {
        const mtlLoader = new MTLLoader()
        mtlLoader.load(mtlPath, (mtlParseResult) => {
            const objLoader = new OBJLoader2()
            const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult)
            objLoader.addMaterials(materials)
            objLoader.load(objPath, (root) => {
                // set dynamic usage of position attribute
                root.children[0].geometry.attributes.position.setUsage(THREE.DynamicDrawUsage)
                root.children[0].geometry.attributes.normal.setUsage(THREE.DynamicDrawUsage)
                scene.add(root)
                backupModel.copy(root)
                console.log(backupModel)
                
                box = new THREE.Box3().setFromObject(root)
                // const boxSize = box.getSize(new THREE.Vector3()).length()
                // const boxCenter = box.getCenter(new THREE.Vector3())
                console.log(box)
                // console.log(boxCenter)
            })
        })
    }
    
    // const rotationAxis = new THREE.Vector3(0, 1, 0)
    // const tempPos = new THREE.Vector3()
    // const tempNorm = new THREE.Vector3()

    function render(time) {
        time *= .0000003
        // console.log(time)

        if(resizeRendererToDisplaySize(renderer)){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // Update obj positions =================================
        twistObject3D(scene.children[3], backupModel, mouseX / windowWidth, new THREE.Vector3(0, 1, 0), Math.PI / 50)
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

    function twistObject3D(element, backupElement, twistFactor, axis, maxAngle) {
        // element -> THREE.Object3D
        //  backupElement -> THREE.Object3D
        // axis -> THREE.Vector3
        // twistFactor -> (0, 1)
        // maxAngle -> rads

        // TODO: be able to make a copy o the Object3D and have a referential BufferGeometry attributes

        const tempPos = new THREE.Vector3()
        const tempNorm = new THREE.Vector3()
        let direction = 1

        if(mouseX > prevMouseX) direction = 1
        else if(mouseX < prevMouseX) direction = -1
        else direction = 0
        prevMouseX = mouseX

        if(element){
            const positions = backupElement.children[0].geometry.getAttribute('position').array
            const normals = backupElement.children[0].geometry.getAttribute('normal').array
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
            console.log(backupElement.children[0].geometry.getAttribute('position').array)
        }
    }

    // mouse moved
    canvas.addEventListener('mousemove', e => {
        mouseX = e.offsetX
        mouseY = e.offsetY
    })

}

main()

