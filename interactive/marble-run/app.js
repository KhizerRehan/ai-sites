import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e66e50');
scene.fog = new THREE.Fog('#e66e50', 20, 43);
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
camera.position.set(9, 8, 12);
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 2.4, 0);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 22;
controls.minPolarAngle = .3;
controls.maxPolarAngle = Math.PI / 2.12;
controls.autoRotate = true;
controls.autoRotateSpeed = .5;
controls.addEventListener('start', () => { controls.autoRotate = false; });
scene.add(new THREE.HemisphereLight('#fff3cf', '#ac6d51', 2));
const sun = new THREE.DirectionalLight('#fff4d9', 3);
sun.position.set(-5, 12, 8); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -10; sun.shadow.camera.right = 10; sun.shadow.camera.top = 10; sun.shadow.camera.bottom = -10;
scene.add(sun);
const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({color, roughness:.5, ...extra});
const cream = mat('#ffedbf');
const red = mat('#e6533d');
const green = mat('#a8ce8b');
const blue = mat('#739bd7');
const yellow = mat('#f3c552');
const dark = mat('#32342b');
function mesh(geometry, material, parent = scene) { const m = new THREE.Mesh(geometry, material); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; }
const floor = mesh(new THREE.PlaneGeometry(200,200), mat('#e66e50')); floor.rotation.x = -Math.PI/2; floor.position.y = -.28; floor.receiveShadow = true;
const base = mesh(new THREE.CylinderGeometry(4.5, 4.5, .35, 64), cream); base.position.y = -.05;
const baseTrim = mesh(new THREE.CylinderGeometry(4.51,4.51,.11,64), dark); baseTrim.position.y = -.15;
// Little painted studs make the construction feel like a physical tabletop toy.
for (let i=0;i<12;i++) { const a=i*Math.PI/6; const stud=mesh(new THREE.CylinderGeometry(.075,.075,.035,16),red); stud.position.set(Math.cos(a)*4.08,.145,Math.sin(a)*4.08); }
const trackGroup = new THREE.Group(); scene.add(trackGroup);
const ballGroup = new THREE.Group(); scene.add(ballGroup);
let track, balls = [], rolled = 0, selected = 'coral', trackType = 'wiggle', speed = 2;
const palette = {coral:'#e96549', blue:'#668fdc', yellow:'#f6c64d', mint:'#a4da9a'};
function pointsFor(type) {
 if (type === 'spiral') { const p=[]; for(let i=0;i<=48;i++){const t=i/48,a=t*Math.PI*3.1-.7,r=2.35-.35*t;p.push(new THREE.Vector3(Math.cos(a)*r,5.25-t*4.4,Math.sin(a)*r));} return p; }
 if (type === 'switchback') return [[-2.8,5.2,-1.8],[2.6,4.55,-1.8],[3,4.25,-.8],[-2.55,3.45,-.6],[-2.9,3.1,.35],[2.55,2.35,.55],[2.8,1.9,1.45],[-2.5,.85,1.5]].map(p=>new THREE.Vector3(...p));
 return [[-2.7,5.2,-1.3],[-1.8,4.8,-2],[.2,4.35,-1.7],[2.5,3.9,-.9],[2.1,3.45,.35],[.25,3,-.1],[-2.2,2.55,-.3],[-2.5,2.05,.9],[-.8,1.6,1.8],[1.4,1.2,1.3],[2.8,.8,1.6]].map(p=>new THREE.Vector3(...p));
}
function clearGroup(group) { while(group.children.length) { const obj=group.children[0]; group.remove(obj); obj.traverse(child=>{ if(child.geometry) child.geometry.dispose(); }); } }
function buildTrack(type) {
 clearGroup(trackGroup); clearBalls();
 track = new THREE.CatmullRomCurve3(pointsFor(type), false, 'centripetal');
 // A wide solid channel, with bright rails on either side of the rolling surface.
 mesh(new THREE.TubeGeometry(track, 240, .23, 10, false), green, trackGroup);
 for(const side of [-1,1]) {
  const railPoints=[];
  for(let i=0;i<=120;i++){let t=i/120,p=track.getPointAt(t),tan=track.getTangentAt(t);const n=new THREE.Vector3(-tan.z,0,tan.x).normalize();p.addScaledVector(n,side*.29);p.y+=.16;railPoints.push(p);}
  const rail = new THREE.CatmullRomCurve3(railPoints);
  mesh(new THREE.TubeGeometry(rail,240,.055,8,false),cream,trackGroup);
 }
 // Independent upright supports show the physical construction of the run.
 for (let i=0;i<7;i++) { const t=.04+i*.15,p=track.getPointAt(t),h=Math.max(.15,p.y-.2);const post=mesh(new THREE.CylinderGeometry(.095,.12,h,12),red,trackGroup); post.position.set(p.x,h/2+.16,p.z);const foot=mesh(new THREE.CylinderGeometry(.28,.32,.09,20),yellow,trackGroup);foot.position.set(p.x,.2,p.z);const joint=mesh(new THREE.SphereGeometry(.17,16,12),yellow,trackGroup);joint.position.copy(p); }
 const start=track.getPointAt(0);const funnel=mesh(new THREE.CylinderGeometry(.62,.29,.38,24,1,true),yellow,trackGroup);funnel.position.copy(start).add(new THREE.Vector3(0,.28,0));
 const end=track.getPointAt(1);const bowl=mesh(new THREE.CylinderGeometry(.6,.34,.32,24),blue,trackGroup);bowl.position.copy(end).add(new THREE.Vector3(0,-.34,0));
 document.querySelector('#stage-status').textContent='READY TO ROLL';
}
function clearBalls(){ for(const b of balls){ballGroup.remove(b.mesh);b.mesh.geometry.dispose();b.mesh.material.dispose();}balls=[]; }
function dropBall() {
 if (balls.length >= 12) { const b=balls.shift();ballGroup.remove(b.mesh);b.mesh.geometry.dispose();b.mesh.material.dispose(); }
 const ball=mesh(new THREE.SphereGeometry(.21,24,18),mat(palette[selected],{roughness:.17,metalness:.16}),ballGroup);
 const stripe=mesh(new THREE.TorusGeometry(.207,.018,8,40),cream,ball);stripe.rotation.x=Math.PI/2;
 balls.push({mesh:ball,t:0, finished:false});ball.position.copy(track.getPointAt(0)).add(new THREE.Vector3(0,.37,0));
 rolled++; document.querySelector('#count').textContent=String(rolled).padStart(2,'0');document.querySelector('#stage-status').textContent='MARBLE IN MOTION';
}
function resize(){const rect=canvas.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(canvas);
for(const button of document.querySelectorAll('.track')) button.addEventListener('click',()=>{trackType=button.dataset.track;document.querySelectorAll('.track').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});document.querySelector('#track-name').textContent='THE '+button.querySelector('strong').textContent.toUpperCase();buildTrack(trackType);});
for(const button of document.querySelectorAll('.swatch')) button.addEventListener('click',()=>{selected=button.dataset.color;document.querySelectorAll('.swatch').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});});
document.querySelector('#speed').addEventListener('input',e=>{speed=Number(e.target.value);document.querySelector('#speed-label').textContent=['','NICE & EASY','JUST RIGHT','SUPER SPEED'][speed];});
document.querySelector('#drop').addEventListener('click',dropBall);
document.querySelector('#clear').addEventListener('click',()=>{clearBalls();document.querySelector('#stage-status').textContent='READY TO ROLL';});
buildTrack(trackType);resize();
const clock = new THREE.Clock();
function animate(){requestAnimationFrame(animate);const delta=Math.min(clock.getDelta(),.05);controls.update();let moving=false;for(const b of balls){if(!b.finished){b.t=Math.min(1,b.t+delta*[0,.025,.043,.075][speed]);const point=track.getPointAt(b.t);b.mesh.position.copy(point).add(new THREE.Vector3(0,.38,0));b.mesh.rotation.z-=delta*speed*2;if(b.t>=1)b.finished=true;else moving=true;}}if(balls.length && !moving)document.querySelector('#stage-status').textContent='NICE ROLL!';renderer.render(scene,camera);}animate();
