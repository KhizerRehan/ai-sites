import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
camera.position.set(0, 2.7, 10.8);
camera.lookAt(0, 2.1, 0);
scene.add(new THREE.HemisphereLight(0xffe3f2, 0x52305e, 2.1));
const key = new THREE.DirectionalLight(0xffd7cf, 3.2); key.position.set(-4, 7, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0xb46cff, 3); rim.position.set(4, 4, -4); scene.add(rim);
const glow = new THREE.PointLight(0xff5c9e, 16, 8); glow.position.set(0, 2.2, 1); scene.add(glow);
const lamp = new THREE.Group(); scene.add(lamp);
const metal = new THREE.MeshStandardMaterial({color:0xe5b7bc,metalness:.8,roughness:.24});
const metalDark = new THREE.MeshStandardMaterial({color:0x774b78,metalness:.8,roughness:.28});
function cylinder(rt,rb,h,y,material=metal){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,80),material);mesh.position.y=y;lamp.add(mesh);return mesh}
cylinder(.73,.92,.18,.09,metalDark); cylinder(.68,.75,.16,.25); cylinder(.54,.68,.5,.58); cylinder(.58,.54,.12,.89,metalDark);
// A lathed glass shell gives the lamp its familiar tapered silhouette.
const profile = [[.55,.95],[.66,1.08],[.71,1.3],[.68,1.7],[.59,2.25],[.47,2.85],[.36,3.32],[.29,3.48]].map(([x,y])=>new THREE.Vector2(x,y));
const glassGeo = new THREE.LatheGeometry(profile,96);
const glassMat = new THREE.MeshPhysicalMaterial({color:0xc8a3ff,metalness:.02,roughness:.08,transparent:true,opacity:.19,side:THREE.DoubleSide,depthWrite:false});
const glass = new THREE.Mesh(glassGeo,glassMat); glass.renderOrder=3; lamp.add(glass);
// Subtle liquid tint remains visible when the light is switched off.
const liquidMat=new THREE.MeshBasicMaterial({color:0x6c3fc9,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false});
const liquid=new THREE.Mesh(glassGeo,liquidMat);liquid.scale.set(.97,.99,.97); liquid.renderOrder=1;lamp.add(liquid);
cylinder(.31,.39,.11,3.46,metalDark); cylinder(.05,.31,.43,3.72); cylinder(.045,.05,.06,3.96,metalDark);
// Bright fine curves on the glass are reflected studio lights.
const shineMat=new THREE.MeshBasicMaterial({color:0xffe8fa,transparent:true,opacity:.43});
function shine(x,z){const points=[];for(let i=0;i<=28;i++){let y=1.14+i/28*2.13;let radius=.65-(y-1.15)*.12;points.push(new THREE.Vector3(x*radius,y,z*radius))}const curve=new THREE.CatmullRomCurve3(points);lamp.add(new THREE.Mesh(new THREE.TubeGeometry(curve,40,.012,6,false),shineMat))}
shine(-.53,.86); shine(.66,.74);
const waxMat = new THREE.MeshPhysicalMaterial({color:0xff729b,emissive:0x8d183c,emissiveIntensity:.43,roughness:.22,metalness:0,clearcoat:.7,clearcoatRoughness:.2});
const wax = new MarchingCubes(42,waxMat,true,true,100000); wax.scale.set(.74,1.35,.74); wax.position.y=2.18; wax.isolation=70; wax.renderOrder=2; lamp.add(wax);
const floor = new THREE.Mesh(new THREE.CircleGeometry(3.3,100),new THREE.MeshBasicMaterial({color:0xf79bc3,transparent:true,opacity:.045}));floor.rotation.x=-Math.PI/2;floor.position.y=-.015;scene.add(floor);
const rings = new THREE.Mesh(new THREE.RingGeometry(1.45,1.46,96),new THREE.MeshBasicMaterial({color:0xf7b4c7,transparent:true,opacity:.25,side:THREE.DoubleSide}));rings.rotation.x=-Math.PI/2;rings.position.y=.002;scene.add(rings);
const palettes={berry:{name:'COSMIC BERRY',wax:0xff729b,emissive:0x8d183c,glass:0xc8a3ff,liquid:0x6c3fc9,light:0xff5c9e},citrus:{name:'ELECTRIC CITRUS',wax:0xffb62e,emissive:0xb0360c,glass:0xffa16a,liquid:0xce4b37,light:0xff7f36},lagoon:{name:'BLUE LAGOON',wax:0x56f3c2,emissive:0x05795b,glass:0x91d5ff,liquid:0x1461ae,light:0x31eaca},orchid:{name:'PINK HAZE',wax:0xfb8ce6,emissive:0xa21980,glass:0xffb4dc,liquid:0x9e2a74,light:0xff60cc}};
let powered=true,heat=50,count=7,shake=0,elapsed=0,rotationTarget=0;
const blobs=Array.from({length:10},(_,i)=>({phase:i*2.4+Math.random(),speed:.35+Math.random()*.25,x:Math.sin(i*2.8)*.12,z:Math.cos(i*2.1)*.12,size:.8+Math.random()*.3}));
function updateWax(t){wax.reset();for(let i=0;i<count;i++){const b=blobs[i];let y=.5+Math.sin(t*b.speed+b.phase)*.29;let x=.5+b.x*Math.sin(t*.28+b.phase)+Math.sin(t*1.9+i)*shake*.045;let z=.5+b.z*Math.cos(t*.35+b.phase)+Math.cos(t*1.6+i)*shake*.045;wax.addBall(x,y,z,.075*b.size,12)}wax.addBall(.5,.13,.5,.075,12);wax.update()}
function resize(){const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.position.z=rect.width<450?11.8:10.8;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(canvas);resize();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const delta=Math.min(clock.getDelta(),.05);if(powered)elapsed+=delta*(.17+heat/65);shake*=.97;lamp.rotation.y+=(rotationTarget-lamp.rotation.y)*.06;updateWax(elapsed);renderer.render(scene,camera)}animate();
const paletteButtons=[...document.querySelectorAll('.swatch')];paletteButtons.forEach(button=>button.addEventListener('click',()=>{const p=palettes[button.dataset.palette];waxMat.color.setHex(p.wax);waxMat.emissive.setHex(p.emissive);glassMat.color.setHex(p.glass);liquidMat.color.setHex(p.liquid);glow.color.setHex(p.light);document.querySelector('#palette-name').textContent=p.name;paletteButtons.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)})}));
const powerButton=document.querySelector('#power');powerButton.addEventListener('click',()=>{powered=!powered;powerButton.setAttribute('aria-pressed',powered);powerButton.innerHTML=powered?'<span>◉</span> LIGHT IS ON':'<span>◉</span> LIGHT IS OFF';glow.intensity=powered?16:0;waxMat.emissiveIntensity=powered?.43:0;liquidMat.opacity=powered?.12:.06});
document.querySelector('#heat').addEventListener('input',e=>{heat=Number(e.target.value);document.querySelector('#heat-value').textContent=heat<34?'MELLOW':heat<70?'WARM':'HOT STUFF'});
const flowButtons=[...document.querySelectorAll('[data-flow]')];flowButtons.forEach(button=>button.addEventListener('click',()=>{count=Number(button.dataset.flow);document.querySelector('#flow-value').textContent=button.textContent;flowButtons.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)})}));
document.querySelector('#shake').addEventListener('click',()=>{shake=1;elapsed+=1.1});
let dragging=false,lastX=0;canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!dragging)return;rotationTarget+=(e.clientX-lastX)*.012;lastX=e.clientX});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
