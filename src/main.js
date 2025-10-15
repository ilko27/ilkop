import * as THREE from 'three'
import { LoadGLTFByPath } from './Helpers/ModelHelper.js'
import { CSS3DObject, CSS3DRenderer, CSS2DObject } from 'three/examples/jsm/Addons.js';
import { LightFlicker } from './Misc/LightFlicker.js';
//Renderer does the job of rendering the graphics
let renderer = new THREE.WebGLRenderer({

    //Defines the canvas component in the DOM that will be used
    canvas: document.querySelector('#app'),
    antialias: true,
});

let rendererCSS3D = new CSS3DRenderer();
let mouse = new THREE.Vector2();

// sethings for the normal renderer
renderer.setSize(window.innerWidth, window.innerHeight);

//set up the renderer with the default settings for threejs.org/editor - revision r153
renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1
renderer.useLegacyLights = false;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0xffffff, 0);
//make sure three/build/three.module.js is over r152 or this feature is not available. 
renderer.outputColorSpace = THREE.SRGBColorSpace

// settings for the CSS3D renderer
rendererCSS3D.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(rendererCSS3D.domElement);

// rendererWebGL = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
// rendererWebGL.setPixelRatio(window.devicePixelRatio);
// rendererWebGL.setSize(window.innerWidth, window.innerHeight);
// rendererWebGL.toneMapping = THREE.NeutralToneMapping;
// rendererWebGL.setAnimationLoop(animate);
// document.body.appendChild(rendererWebGL.domElement);


const scene = new THREE.Scene();

let cameraList = [];
let lightsList = [];
let light;
let camera;

// Load the GLTF model
LoadGLTFByPath(scene)
    .then(() => {
        retrieveListOfCameras(scene);
    })
    .catch((error) => {
        console.error('Error loading JSON scene:', error);
    });

//retrieve list of all cameras
function retrieveListOfCameras(scene) {
    // Get a list of all cameras in the scene
    scene.traverse(function (object) {
        if (object.isCamera) {
            cameraList.push(object);
        }
        if (object.isLight) {
            lightsList.push(object);
        }
    });

    //Set the camera to the first value in the list of cameras
    camera = cameraList[0];
    light = lightsList[0];

    updateCameraAspect(camera);

    // Start the animation loop after the model and cameras are loaded
    animate();
}

// Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

const iframe = document.createElement('iframe');
iframe.style.width = '1028px';
iframe.style.height = '790px';
iframe.style.border = '0px';
iframe.style.opacity = 0.5;
iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
let obj = new CSS3DObject(iframe);
let objScale = 0.000285;
obj.scale.set(objScale, objScale, objScale);
obj.position.set(0, 0.3, 0.21);
scene.add(obj);


function onDocumentMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

//A method to be run each time a frame is generated
function animate() {
    requestAnimationFrame(animate);

    // camera.translateZ(0.01);

    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, (-mouse.x * Math.PI) / 100, 0.1);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, (mouse.y * Math.PI) / 100, 0.1);

    LightFlicker(light);

    renderer.render(scene, camera);
    rendererCSS3D.render(scene, camera);
    // renderer2.render(scene, camera);
};


document.addEventListener('mousemove', onDocumentMouseMove, false);


