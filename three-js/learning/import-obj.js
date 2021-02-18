// https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'

import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js'
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js'
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/MTLLoader.js'
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'

function main(){
    // const objPath = './Full_body/model_mesh.obj'
    // const mtlPath = './Full_body/model_mesh.obj.mtl'
    // const objPath = './plazadignidad-cau-1219/plazadignidad-cau-1219.obj'
    // const mtlPath = './plazadignidad-cau-1219/plazadignidad-cau-1219.mtl'
    const objPath = './genio-export-aecl/genio-export-aecl.obj'
    const mtlPath = './genio-export-aecl/genio-export-aecl.mtl'
    // const objPath = './baquedano-export-aecl/baquedano-aecl.obj'
    // const mtlPath = './baquedano-export-aecl/baquedano-aecl.mtl'

    const canvas = document.querySelector('#c')
    const renderer = new THREE.WebGLRenderer({canvas})

    const fov = 45
    const aspect = 2
    const near = 0.1
    const far = 150
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 50, 80)

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('black')

    // {
    //     const planeSize = 40;
    
    //     const loader = new THREE.TextureLoader();
    //     const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    //     texture.wrapS = THREE.RepeatWrapping;
    //     texture.wrapT = THREE.RepeatWrapping;
    //     texture.magFilter = THREE.NearestFilter;
    //     const repeats = planeSize / 2;
    //     texture.repeat.set(repeats, repeats);
    
    //     const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    //     const planeMat = new THREE.MeshPhongMaterial({
    //       map: texture,
    //       side: THREE.DoubleSide,
    //     });
    //     const mesh = new THREE.Mesh(planeGeo, planeMat);
    //     mesh.rotation.x = Math.PI * -.5;
    //     scene.add(mesh);
    // }

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

    {
        const mtlLoader = new MTLLoader()
        mtlLoader.load(mtlPath, (mtlParseResult) => {
            const objLoader = new OBJLoader2()
            const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult)
            objLoader.addMaterials(materials)
            objLoader.load(objPath, (root) => {
                // set dynamic usage of position attribute
                root.children[0].geometry.attributes.position.setUsage(THREE.DynamicDrawUsage)
                scene.add(root)
                
                console.log(root)
                // console.log(root.children[0].geometry.getAttribute('position'))
                // console.log(root.matrix)
                // console.log(scene)

                // const box = new THREE.Box3().setFromObject(root)
                // const boxSize = box.getSize(new THREE.Vector3()).length()
                // const boxCenter = box.getCenter(new THREE.Vector3())
                // console.log(boxSize)
                // console.log(boxCenter)
            })
        })
    }
    
    function render() {
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

