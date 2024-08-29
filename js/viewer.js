//// -- THREE -- ////
import * as THREE from 'three';
import { pass, mrt, output, emissive, uniform } from 'three/tsl';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { cubeBank } from './Database.js';

// SHADER - gradient
import { GradientGreyShader } from '../assets/shaders/GradientShader.js';





// cube default
const cubeDefault = {
    animation: true
}


// HASH
const url = window.location.href;
var hash = location.hash;
var lastHash = null;


// Hashchange
window.addEventListener('hashchange', function() {
    lastHash = hash;
    hash = location.hash;
    updateCubeInfo();
}, false);

function setHash(hash){
    window.location.hash = hash;
}


// 
var mixers = [];
var envMap;
var cubeMesh;
var cubeId = null;
var cubeUpload = false;

//
const clock = new THREE.Clock();

//
const manager = new THREE.LoadingManager();
const loaderTex = new THREE.TextureLoader();
const loaderGLTF = new GLTFLoader();
const loaderDraco = new DRACOLoader(manager);
loaderDraco.setDecoderPath( '../assets/js/three/jsm/libs/draco/' );
loaderGLTF.setDRACOLoader( loaderDraco );
const loaderRGBE = new RGBELoader(manager).setPath( '../assets/textures/env/hdri/' );

// 
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 100 );
// camera.position.z = 7;
camera.layers.enable(1);
camera.position.set(0,0,3.25);
const camZ = camera.position.z;


//scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x000000);

let tex = loaderTex.load('../assets/img/ui_edit/Background2x.png');
tex.minFilter = THREE.NearestFilter; 
tex.magFilter = THREE.NearestFilter
tex.colorSpace = THREE.SRGBColorSpace;
scene.background = tex;



// envMap
const envTex = 'creature_hdri.hdr';
loaderRGBE.load( envTex, function ( texture ) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    envMap = texture;
});


//renderer
const renderer = new THREE.WebGPURenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setAnimationLoop( animate );
document.getElementById('threeD-container').appendChild( renderer.domElement );


//POSTPROCESSING
const scenePass = pass( scene, camera );
scenePass.setMRT( mrt( {
    output,
    emissive
} ) );

const outputPass = scenePass.getTextureNode();
const emissivePass = scenePass.getTextureNode( 'emissive' );

//POST
const paramAmph = {
    intensity: uniform( 1.0 ),
    threshold: uniform( 1.4 ),
    scaleNode: uniform( 5 ),
    resolution: 0.2, // 1 = full resolution
    samples : 64
}
const anamorphicPass = outputPass.anamorphic( paramAmph.threshold, paramAmph.scaleNode, paramAmph.samples );
anamorphicPass.resolution = new THREE.Vector2( paramAmph.resolution, paramAmph.resolution ); 

const bloomPass = emissivePass.bloom( 2.5, .5 );

// POST SETTINGS 
const PASSES = [
    bloomPass,
    anamorphicPass.mul( paramAmph.intensity )
];
const passIndex = 0;

// COMPILE
const postProcessing = new THREE.PostProcessing( renderer );
postProcessing.outputColorTransform = false;
postProcessing.outputNode = outputPass.add( PASSES[passIndex] ).renderOutput();


//
parseCubeInfo();


// LIGHTS
// const lightAmbient = new THREE.AmbientLight( 0xf1d67e, 0.3 );
// scene.add(lightAmbient);

const dirLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
dirLight.position.set( 0, 0.5, 1 ).multiplyScalar( 30 );
scene.add( dirLight );

//controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.target = new THREE.Vector3( 0, 0, -0.5 );
controls.minDistance = 2;
controls.maxDistance = 6;
controls.update();
// controls.enabled = false;


//stats
const stats = new Stats();
stats.dom.classList.add("stats_br");
document.body.appendChild( stats.dom );

//events
window.addEventListener("resize", onWindowResize, false);
document.addEventListener('dragover', dragOverHandler, false);
document.addEventListener('drop', dropHandler, false);
// 
onWindowResize();


//GUI
const gui = new GUI();
// gui.domElement.style.display = "none";
createGUI();

//LOADING
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    // console.log('start');
    document.getElementById("loader").style.display = "block";
};
manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

};
manager.onLoad = function ( ) {
    // console.log('end');
    document.getElementById("loader").style.display = "none";
};
manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};


function animate() {

    const delta = clock.getDelta();
    if(mixers.length > 0){
        for(let i=0;i<mixers.length;i++){
            mixers[i].update( delta );
        }
    }
    
    stats.update();

    render();

}


function render() {

    postProcessing.render();
    // renderer.render(scene, camera);

}

function createGUI(  ) {

    // BLOOM
    const bloomFolder = gui.addFolder( 'Bloom' );
    bloomFolder.add( bloomPass.strength, 'value', 0.0, 5.0 ).name( 'strength' );
    bloomFolder.add( bloomPass.radius, 'value', 0.0, 1.0 ).name( 'radius' );

    emissivePass

    // LIGHT
    const lightFolder = gui.addFolder( 'Light' );
    lightFolder.addColor(dirLight, "color").name( 'color' );
    lightFolder.add( dirLight, 'intensity', 0.1, 5.0 ).name( 'intensity' );

    // RENDERER
    const rendererFolder = gui.addFolder( 'Renderer' );
    rendererFolder.add( renderer, 'toneMappingExposure', 0.1, 2 ).name( 'exposure' );

    // ANAMORPHIC
    // gui.add( intensity, 'value', 0, 4, 0.1 ).name( 'intensity' );
    // gui.add( threshold, 'value', .8, 3, .001 ).name( 'threshold' );
    // gui.add( scaleNode, 'value', 1, 10, 0.1 ).name( 'scale' );
    // gui.add( anamorphicPass.resolution, 'x', .1, 1, 0.1 ).name( 'resolution' ).onChange( ( v ) => anamorphicPass.resolution.y = v );

}

// EVENTS
function onWindowResize(){

    ((window.innerHeight/window.innerWidth) > 1) ? camera.position.z = camZ * (window.innerHeight/window.innerWidth) : camera.position.z = camZ;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    // composer.setSize( window.innerWidth, window.innerHeight );
};

function dragOverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    ev.preventDefault();
    
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          let url = URL.createObjectURL(file);

          setHash('file:' + file.name);
          clearCubeInfo();
          loadCubeFromFile(url, file.name);

        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }
  }
 

//OBJECTS
function parseCubeInfo(){

    let id = hash.substring(1);
    
    if(id != cubeId){

        let cube = cubeBank[id];

        if(cube){
            loadCubeFromDatabase(cube, id);
        }else{
            console.log('ID not found in database');
        }
        
    }

}




function clearCubeInfo(){

    cubeId = null;
    if(cubeMesh) removeObjWithChildren(cubeMesh); //cubeMesh.parent.remove(cubeMesh);
    cubeMesh = null;
    mixers = [];

}

function updateCubeInfo(){

    cubeId = null;
    if(cubeMesh) removeObjWithChildren(cubeMesh); //cubeMesh.parent.remove(cubeMesh);
    cubeMesh = null;
    mixers = [];

    parseCubeInfo();

}


function loadCubeFromDatabase(cube, id){

    cubeId = id;

    loaderGLTF.load( '../assets/models/finals/' + cube.file, function ( gltf ) {
        let model = gltf.scene;

        model.rotation.set(0,-Math.PI/2,0);
        model.position.set(0,-1,-0.75);

        model.traverse( function ( child ) {
            if ( child.isMesh ){
                child.material.envMap = envMap;
                child.material.envMapIntensity = 1.0;
            }
        });

        if(gltf.animations.length > 0){
            let mixer = new THREE.AnimationMixer( model );
            // mixer.clipAction( gltf.animations[ 0 ] ).play();
            gltf.animations.forEach( clip => {
                const action = mixer.clipAction(clip);
                // action.clampWhenFinished = true;
                // action.loop = THREE.LoopOnce;
                action.play();
            });
            mixers.push(mixer);
        }

        scene.add(model);
        cubeMesh = model;

    });

}

function loadCubeFromFile(file, id){

    cubeId = 1;

    loaderGLTF.load( file, function ( gltf ) {
        let model = gltf.scene;

        model.rotation.set(0,-Math.PI/2,0);
        model.position.set(0,-1,-0.75);

        model.traverse( function ( child ) {
            if ( child.isMesh ){
                child.material.envMap = envMap;
                child.material.envMapIntensity = 1.0;
            }
        });

        if(animation && gltf.animations.length > 0){
            let mixer = new THREE.AnimationMixer( model );
            gltf.animations.forEach( clip => {
                const action = mixer.clipAction(clip);
                action.play();
            });
            mixers.push(mixer);
        }

        scene.add(model);
        cubeMesh = model;

    });

}


function removeObjWithChildren(obj) {
    if (obj.children.length > 0) {
        for (var x = obj.children.length - 1; x >= 0; x--) {
            removeObjWithChildren(obj.children[x])
        }
    }
    if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
    }
    if (obj.parent) {
        obj.parent.remove(obj)

    }
}



