import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const $ = id => document.getElementById(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b2945);
scene.fog = new THREE.Fog(0x1b2945, 35, 85);
const camera = new THREE.OrthographicCamera(-12,12,9,-9,.1,100);
camera.position.set(0,9,35); camera.lookAt(0,9,0);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
$('scene').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xbdd4ff,0x565462,2));
const sun = new THREE.DirectionalLight(0xffe8cb,2.6); sun.position.set(-8,14,20); scene.add(sun);
const mat=(color,extras={})=>new THREE.MeshStandardMaterial({color,roughness:.8,...extras});
function mesh(geo, material, x,y,z, target=scene){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);target.add(o);return o}
// A sparse field of stars and a distant pale planet.
const starPos=[];for(let i=0;i<380;i++)starPos.push((Math.random()-.5)*78,Math.random()*48-5,-15-Math.random()*15);
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));
scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xe8e8dd,size:.065,transparent:true,opacity:.8})));
const earth=mesh(new THREE.SphereGeometry(2.1,32,24),mat(0x9ebac6,{roughness:1}),-8,15,-13);earth.scale.set(1,1,0.3);
const earthGlow=mesh(new THREE.RingGeometry(2.15,2.34,48),new THREE.MeshBasicMaterial({color:0xa4cbd1,transparent:true,opacity:.18,side:THREE.DoubleSide}),-8,15,-12.9);
// Layered lunar landscape, constructed as low-poly silhouettes.
function terrainLayer(points,color,z){const shape=new THREE.Shape();shape.moveTo(points[0][0],-8);points.forEach(([x,y])=>shape.lineTo(x,y));shape.lineTo(points.at(-1)[0],-8);shape.closePath();return mesh(new THREE.ShapeGeometry(shape),mat(color),0,0,z)}
terrainLayer([[-25,2],[-20,5],[-16,3.2],[-12,6],[-8,3],[-4,4.6],[0,2.8],[4,4.5],[8,2.4],[12,5],[17,2.5],[22,4.5],[25,2]],0x465570,-8);
terrainLayer([[-25,1],[-21,3],[-18,2],[-14,4],[-10,2],[-6,3.4],[-2,1.8],[2,3],[6,1.7],[10,2.5],[14,1],[18,3],[22,1.6],[25,2]],0x68717f,-5);
terrainLayer([[-25,1],[-20,1.7],[-16,1.1],[-12,2],[-8,1.3],[-4,2.1],[0,1.45],[2,1.8],[6,1.8],[9,1.25],[13,1.9],[18,1],[22,1.8],[25,1]],0x9d9d9b,0);
const ground=mesh(new THREE.BoxGeometry(4,.18,.8),mat(0xf7b078,{emissive:0x9b4224,emissiveIntensity:.6}),4,1.9,1);
const padLine=mesh(new THREE.BoxGeometry(4.4,.04,.04),new THREE.MeshBasicMaterial({color:0xffc893}),4,2.02,2);
const padLabel=mesh(new THREE.BoxGeometry(2.6,.03,.04),new THREE.MeshBasicMaterial({color:0xffe1bd}),4,1.72,2);
// Lander, designed in the style of a tiny model kit.
const lander=new THREE.Group();scene.add(lander);
const cream=mat(0xe8dfc5), dark=mat(0x334457), gold=mat(0xe9a35c,{metalness:.4}), white=mat(0xf8ead0);
mesh(new THREE.CylinderGeometry(.64,.82,.8,8),gold,0,0,0,lander);
mesh(new THREE.CylinderGeometry(.55,.64,.58,8),cream,0,.64,0,lander);
mesh(new THREE.CylinderGeometry(.27,.44,.17,8),white,0,1.01,0,lander);
mesh(new THREE.BoxGeometry(.63,.25,.15),dark,0,.71,.56,lander);
mesh(new THREE.BoxGeometry(.48,.1,.04),new THREE.MeshBasicMaterial({color:0x8ac8cf}),0,.72,.65,lander);
mesh(new THREE.CylinderGeometry(.23,.39,.2,8),dark,0,-.49,0,lander);
function beam(a,b,r,material){const d=new THREE.Vector3().subVectors(b,a);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),8),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());lander.add(m)}
for(const s of [-1,1]){beam(new THREE.Vector3(s*.45,-.12,.1),new THREE.Vector3(s*1,-.95,.1),.045,cream);beam(new THREE.Vector3(s*.68,-.45,.1),new THREE.Vector3(s*1,-.95,.1),.035,gold);mesh(new THREE.BoxGeometry(.5,.1,.35),cream,s*1,-.96,.1,lander)}
beam(new THREE.Vector3(.4,.95,0),new THREE.Vector3(.72,1.35,0),.025,cream);mesh(new THREE.SphereGeometry(.07,8,8),gold,.72,1.35,0,lander);
const flame=mesh(new THREE.ConeGeometry(.25,.95,12),new THREE.MeshBasicMaterial({color:0xffae68,transparent:true,opacity:.9}),0,-1,0,lander);flame.rotation.z=Math.PI;flame.visible=false;
const inner=mesh(new THREE.ConeGeometry(.11,.62,10),new THREE.MeshBasicMaterial({color:0xfff0b8}),0,.02,.03,flame);
const padGlow=mesh(new THREE.RingGeometry(2.3,2.5,40),new THREE.MeshBasicMaterial({color:0xffa268,transparent:true,opacity:.25,side:THREE.DoubleSide}),4,1.9,-.1);padGlow.scale.y=.12;
let state='ready', x=-5,y=14,vx=.5,vy=-.5,angle=0,fuel=100,clock=0;const held={left:false,right:false,thrust:false};
function reset(){state='ready';x=-5;y=14;vx=.5;vy=-.5;angle=0;fuel=100;Object.keys(held).forEach(k=>held[k]=false);document.querySelectorAll('.controls button').forEach(b=>b.classList.remove('active'));$('messageTag').textContent='MISSION CONTROL';$('messageTitle').textContent='Ready for descent?';$('messageText').textContent='Guide your lander to the glowing pad. Keep your speed gentle and your ship upright.';$('start').innerHTML='BEGIN DESCENT <span>✳</span>';$('message').hidden=false;$('status').textContent='STANDBY';$('statusText').textContent='Awaiting launch instructions.';updateUI()}
function start(){if(state==='landed'||state==='crashed')reset();state='playing';$('message').hidden=true;$('status').textContent='DESCENDING';$('statusText').textContent='Find the illuminated landing pad.'}
function finish(success){state=success?'landed':'crashed';$('status').textContent=success?'LANDED':'SIGNAL LOST';$('statusText').textContent=success?'A beautiful landing, commander.':'The surface came up a little fast.';$('messageTag').textContent=success?'MISSION COMPLETE':'MISSION ENDED';$('messageTitle').textContent=success?'A perfect little landing.':'Well, that was close.';$('messageText').textContent=success?'You made it to the moon. Mission control is very proud.':'Aim for the glowing pad. Land upright at less than 4.5 m/s.';$('start').innerHTML='FLY AGAIN <span>✳</span>';$('message').hidden=false;flame.visible=false}
function updateUI(){ $('altitude').textContent=String(Math.max(0,Math.round((y-3)*10))).padStart(3,'0');$('velocity').textContent=Math.abs(vy).toFixed(1);$('fuel').textContent=Math.max(0,Math.ceil(fuel));$('fuelbar').style.width=Math.max(0,fuel)+'%';$('altbar').style.width=Math.max(0,Math.min(100,(y-3)/11*100))+'%'; }
$('start').addEventListener('click',start);$('reset').addEventListener('click',reset);
for(const key of ['left','right','thrust']){const button=$(key);const end=e=>{e.preventDefault();held[key]=false;button.classList.remove('active')};button.addEventListener('pointerdown',e=>{e.preventDefault();held[key]=true;button.classList.add('active');button.setPointerCapture(e.pointerId)});button.addEventListener('pointerup',end);button.addEventListener('pointercancel',end);button.addEventListener('lostpointercapture',end)}
const keymap={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'thrust',w:'thrust',' ':'thrust'};
window.addEventListener('keydown',e=>{const k=keymap[e.key];if(k){e.preventDefault();held[k]=true;$(k).classList.add('active')}});window.addEventListener('keyup',e=>{const k=keymap[e.key];if(k){e.preventDefault();held[k]=false;$(k).classList.remove('active')}});window.addEventListener('blur',()=>{Object.keys(held).forEach(k=>held[k]=false);document.querySelectorAll('.controls button').forEach(b=>b.classList.remove('active'))});
function resize(){const el=$('scene');const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h,false);const aspect=w/h;const halfH=10;camera.left=-halfH*aspect;camera.right=halfH*aspect;camera.top=halfH;camera.bottom=-halfH;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe($('scene'));resize();reset();
let previous=performance.now();function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-previous)/1000,.035);previous=now;clock+=dt;earth.rotation.z+=dt*.006;padGlow.material.opacity=.18+Math.sin(clock*3)*.1;
if(state==='playing'){if(held.left)angle+=dt*1.3;if(held.right)angle-=dt*1.3;angle=Math.max(-1.05,Math.min(1.05,angle));let firing=held.thrust&&fuel>0;flame.visible=firing;if(firing){fuel=Math.max(0,fuel-dt*7);vx+=-Math.sin(angle)*5.2*dt;vy+=Math.cos(angle)*5.2*dt;flame.scale.y=.7+Math.random()*.45}vy-=2*dt;vx*=Math.pow(.99,dt);x+=vx*dt;y+=vy*dt;if(x<-11){x=-11;vx=Math.abs(vx)*.3}if(x>11){x=11;vx=-Math.abs(vx)*.3}if(y>18){y=18;vy=Math.min(0,vy)}if(y<=2.95){y=2.95;finish(x>2.5&&x<5.5&&Math.abs(vy)<4.5&&Math.abs(vx)<2.2&&Math.abs(angle)<.32)}updateUI()}
lander.position.set(x,y,1);lander.rotation.z=angle;renderer.render(scene,camera)}requestAnimationFrame(animate);
