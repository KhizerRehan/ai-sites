import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const wrap = document.querySelector('#canvas-wrap');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
const ambient = new THREE.HemisphereLight(0xfff7e5, 0x687968, 2.1); scene.add(ambient);
const sun = new THREE.DirectionalLight(0xfff8e9, 3); sun.position.set(-4, 8, 5); sun.castShadow = true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left = -6; sun.shadow.camera.right = 6; sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -6; sun.shadow.normalBias=.02; scene.add(sun);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(200,200), new THREE.ShadowMaterial({opacity:.16})); floor.rotation.x=-Math.PI/2; floor.position.y=-.72; floor.receiveShadow=true; scene.add(floor);
const sculpture = new THREE.Group(); scene.add(sculpture);
const palettes={vermillion:0xc94d39,blush:0xe8b2a7,ochre:0xd3ad58,moss:0x576f67,indigo:0x637d9a};
const paper = new THREE.MeshStandardMaterial({color:palettes.vermillion,roughness:.85,side:THREE.DoubleSide});
const pale = new THREE.MeshStandardMaterial({color:0xe9c2af,roughness:.9,side:THREE.DoubleSide});
const flatMat = new THREE.MeshStandardMaterial({color:palettes.vermillion,roughness:.9,side:THREE.DoubleSide,transparent:true});
const flat = new THREE.Mesh(new THREE.PlaneGeometry(3.6,3.6),flatMat); flat.rotation.x=-Math.PI/2; flat.position.y=.02; flat.castShadow=true; sculpture.add(flat);
const bird = new THREE.Group(); sculpture.add(bird);
function panel(vertices, material=paper){
  const geometry=new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices.flat(),3)); geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,material); mesh.castShadow=true; mesh.receiveShadow=true;
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:0x543a32,transparent:true,opacity:.28})); mesh.add(edges); return mesh;
}
// The central body and hinged paper planes form a stylised crane.
bird.add(panel([[0,.35,-1.15],[-.45,.04,0],[0,.72,.45]],paper));
bird.add(panel([[0,.35,-1.15],[0,.72,.45],[.45,.04,0]],paper));
bird.add(panel([[-.45,.04,0],[0,-.12,1.05],[0,.72,.45]],pale));
bird.add(panel([[.45,.04,0],[0,.72,.45],[0,-.12,1.05]],paper));
const left = new THREE.Group(); left.position.set(-.17,.32,0); bird.add(left);
left.add(panel([[0,0,-.75],[-2.05,.04,.05],[-.18,.03,1.12]],paper));
left.add(panel([[0,0,-.75],[-.18,.03,1.12],[.12,.25,.12]],pale));
const right = new THREE.Group(); right.position.set(.17,.32,0); bird.add(right);
right.add(panel([[0,0,-.75],[.18,.03,1.12],[2.05,.04,.05]],paper));
right.add(panel([[0,0,-.75],[-.12,.25,.12],[.18,.03,1.12]],pale));
const tail = new THREE.Group(); tail.position.set(0,.25,0); bird.add(tail);
tail.add(panel([[0,.05,.1],[-.17,.13,1.45],[0,.55,2.05]],paper));
tail.add(panel([[0,.05,.1],[0,.55,2.05],[.17,.13,1.45]],pale));
const neck = new THREE.Group(); neck.position.set(0,.25,-.5); bird.add(neck);
neck.add(panel([[0,0,.1],[-.13,.14,-.7],[0,1.35,-1.55]],paper));
neck.add(panel([[0,0,.1],[0,1.35,-1.55],[.13,.14,-.7]],pale));
neck.add(panel([[0,1.35,-1.55],[0,1.12,-2.12],[-.11,1.19,-1.65]],paper));
neck.add(panel([[0,1.35,-1.55],[.11,1.19,-1.65],[0,1.12,-2.12]],pale));
const slider=document.querySelector('#progress'), stepNo=document.querySelector('#step-number'), title=document.querySelector('#step-title'), desc=document.querySelector('#step-description'), play=document.querySelector('#play');
const steps=[['Begin with a square','Every beautiful thing starts somewhere. Here is your sheet of paper.'],['Find the first creases','Bring the corners together. Your paper is beginning to find its form.'],['Lift the wings','A few gentle folds give your crane its beautiful outstretched wings.'],['A crane takes flight','Your crane is complete. A little symbol of hope, made by you.']];
let value=0, target=0, playing=false, azimuth=.55, elevation=.64, drag=null, last=performance.now();
function setTarget(v){target=Math.max(0,Math.min(100,v)); slider.value=Math.round(target); updateText();}
function updateText(){const index=Math.min(3,Math.floor(target/25)); stepNo.textContent=`0${index+1} — 04`; title.textContent=steps[index][0]; desc.textContent=steps[index][1];}
function setPlaying(v){playing=v;play.innerHTML=v?'PAUSE THE FOLDS <span>Ⅱ</span>':'PLAY THE FOLDS <span>▶</span>';}
slider.addEventListener('input',()=>{setPlaying(false);setTarget(+slider.value)});
document.querySelector('#prev').addEventListener('click',()=>{setPlaying(false);setTarget(Math.max(0,(Math.ceil(target/25)-1)*25))});
document.querySelector('#next').addEventListener('click',()=>{setPlaying(false);setTarget(Math.min(100,(Math.floor(target/25)+1)*25))});
play.addEventListener('click',()=>{if(target>=100)setTarget(0);setPlaying(!playing)});
document.querySelector('#reset').addEventListener('click',()=>{setPlaying(false);setTarget(0)});
document.querySelectorAll('.swatch').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.swatch').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');const name=button.dataset.color; paper.color.setHex(palettes[name]);flatMat.color.setHex(palettes[name]);pale.color.setHex(palettes[name]);pale.color.lerp(new THREE.Color(0xffeee0),.55);document.querySelector('#color-name').textContent=name==='vermillion'?'VERMILION':name.toUpperCase()}));
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;azimuth+=(e.clientX-drag.x)*.008;elevation=Math.max(.18,Math.min(1.25,elevation+(e.clientY-drag.y)*.006));drag={x:e.clientX,y:e.clientY}});
canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(wrap);resize();
function animate(now){const dt=Math.min((now-last)/1000,.05);last=now;if(playing){setTarget(target+dt*9);if(target>=100)setPlaying(false)} value+=(target-value)*Math.min(1,dt*5);const p=value/100;flatMat.opacity=1-THREE.MathUtils.smoothstep(p,.12,.48);flat.visible=flatMat.opacity>.01;bird.visible=p>.12;const scale=THREE.MathUtils.smoothstep(p,.12,.48);bird.scale.setScalar(Math.max(.001,scale));left.rotation.z=-.12-p*.8;right.rotation.z=.12+p*.8;tail.rotation.x=-p*.16;neck.rotation.x=p*.17;sculpture.rotation.y=Math.sin(now*.00045)*.035;camera.position.set(Math.sin(azimuth)*Math.cos(elevation)*8,Math.sin(elevation)*8,Math.cos(azimuth)*Math.cos(elevation)*8);camera.lookAt(0,.35,0);renderer.render(scene,camera);requestAnimationFrame(animate)}requestAnimationFrame(animate);
