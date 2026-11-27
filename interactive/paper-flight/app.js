import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(innerWidth, innerHeight);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#9ccbd9'); scene.fog = new THREE.Fog('#c5dfe0', 35, 125);
const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, .1, 200); camera.position.set(0, 3.3, 13); camera.lookAt(0, 1.1, -10);
scene.add(new THREE.HemisphereLight(0xfff8dd, 0x91b5c7, 2.2));
const sun = new THREE.DirectionalLight(0xffe2c0, 2); sun.position.set(-8, 14, 12); scene.add(sun);

// A simple folded sheet, modeled as independently shaded triangles.
const plane = new THREE.Group();
function triangle(a,b,c,color){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...b,...c],3));g.computeVertexNormals();return new THREE.Mesh(g,new THREE.MeshStandardMaterial({color, side:THREE.DoubleSide, roughness:.82}));}
plane.add(triangle([0,.16,-2.7],[-2.15,0,1.35],[0,.27,.64],0xfff9e9));
plane.add(triangle([0,.16,-2.7],[0,.27,.64],[2.15,0,1.35],0xe3e7df));
plane.add(triangle([0,.16,-2.7],[0,-.31,1.55],[0,.27,.64],0xb8c9c5));
plane.add(triangle([-2.15,0,1.35],[-.35,-.13,1.15],[0,.27,.64],0xf8eedb));
plane.add(triangle([2.15,0,1.35],[0,.27,.64],[.35,-.13,1.15],0xcbdad8));
const seam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.18,-2.65),new THREE.Vector3(0,.29,.64),new THREE.Vector3(0,-.29,1.53)]),new THREE.LineBasicMaterial({color:0xaabdb9,transparent:true,opacity:.7})); plane.add(seam);
plane.position.set(0,1.1,4);plane.scale.setScalar(.82);scene.add(plane);

// Soft, low-poly clouds drift past at different depths.
const cloudMat = new THREE.MeshStandardMaterial({color:0xfff9eb,roughness:1,flatShading:true});
const clouds=[];
function makeCloud(){const group=new THREE.Group();let count=4+Math.floor(Math.random()*4);for(let i=0;i<count;i++){const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(.7+Math.random()*.8,1),cloudMat);mesh.position.set((i-(count-1)/2)*.85,Math.random()*.35,Math.random()*.5);mesh.scale.set(1.25,.55,.85);group.add(mesh)}scene.add(group);return group}
function scatterCloud(c,initial=false){c.position.set((Math.random()-.5)*42,-2+Math.random()*15,initial?-Math.random()*100:-100-Math.random()*25);const s=.65+Math.random()*1.1;c.scale.setScalar(s)}
for(let i=0;i<42;i++){const c=makeCloud();scatterCloud(c,true);clouds.push(c)}
// Little floating hoops reward steering; they are deliberately optional.
const rings=[]; const ringMat=new THREE.MeshStandardMaterial({color:0xffd79d,emissive:0xdd9870,emissiveIntensity:.25,metalness:.3,roughness:.4});
function resetRing(r,z){r.position.set((Math.random()-.5)*10, .4+Math.random()*5,z);r.userData.scored=false}
for(let i=0;i<7;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.25,.035,8,64),ringMat);resetRing(ring,-22-i*16);scene.add(ring);rings.push(ring)}
// The distant sun is a flat graphic disk, like a stamp on the horizon.
const sunDisk=new THREE.Mesh(new THREE.CircleGeometry(9,64),new THREE.MeshBasicMaterial({color:0xf8dabd,transparent:true,opacity:.65,fog:false}));sunDisk.position.set(25,12,-105);scene.add(sunDisk);
const trails=[];const trailMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.24,side:THREE.DoubleSide});
for(const side of [-1,1]){const trail=new THREE.Mesh(new THREE.PlaneGeometry(.035,11),trailMat);trail.rotation.x=Math.PI/2;trail.position.set(side*1.6,1, -1);scene.add(trail);trails.push(trail)}

const distanceEl=document.querySelector('#distance'),ringsEl=document.querySelector('#rings'),windEl=document.querySelector('#wind'),windLabel=document.querySelector('#wind-label'),windValue=document.querySelector('#wind-value'),toast=document.querySelector('#toast');
let targetX=0,targetY=1.1,distance=0,caught=0,wind=1,last=0,elapsed=0,toastTimer;const keys=new Set();
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}
function updateWind(){wind=Number(windEl.value);const label=['STILL','GENTLE','WILD'][wind];windLabel.textContent=label;windValue.textContent=label;showToast(['A breathless blue sky.','A gentle breeze finds your wings.','Hold on, the wind is picking up!'][wind])}
windEl.addEventListener('input',updateWind);
document.querySelector('#launch').addEventListener('click',()=>{distance=0;caught=0;targetX=0;targetY=1.1;plane.position.set(0,1.1,4);rings.forEach((r,i)=>resetRing(r,-22-i*16));showToast('A fresh start, just like that.')});
function point(e){if(e.target.closest('button,input,a,.dashboard'))return; targetX=THREE.MathUtils.clamp((e.clientX/innerWidth-.5)*12,-5.5,5.5);targetY=THREE.MathUtils.clamp((.55-e.clientY/innerHeight)*8+1.1,-1.3,6)}
window.addEventListener('pointermove',point);window.addEventListener('pointerdown',point);
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();keys.add(e.key)}});window.addEventListener('keyup',e=>keys.delete(e.key));window.addEventListener('blur',()=>keys.clear());
function resize(){camera.aspect=innerWidth/innerHeight;camera.position.z=innerWidth<700?17:13;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}window.addEventListener('resize',resize);resize();
function animate(time){requestAnimationFrame(animate);const dt=Math.min((time-last)/1000||0,.05);last=time;elapsed+=dt;const speed=[5,8,12][wind];distance+=dt*speed*3;
 if(keys.has('ArrowLeft'))targetX-=dt*5;if(keys.has('ArrowRight'))targetX+=dt*5;if(keys.has('ArrowUp'))targetY+=dt*4;if(keys.has('ArrowDown'))targetY-=dt*4;targetX=THREE.MathUtils.clamp(targetX,-5.5,5.5);targetY=THREE.MathUtils.clamp(targetY,-1.3,6);
 const breeze=Math.sin(elapsed*.9)*wind*.22;const dx=(targetX+breeze)-plane.position.x;plane.position.x+=dx*Math.min(dt*2.5,1);plane.position.y+=(targetY+Math.sin(elapsed*1.6)*.12-plane.position.y)*Math.min(dt*2.5,1);plane.rotation.z=THREE.MathUtils.lerp(plane.rotation.z,-dx*.12,Math.min(dt*3,1));plane.rotation.x=THREE.MathUtils.lerp(plane.rotation.x,(targetY-plane.position.y)*.08,Math.min(dt*3,1));
 clouds.forEach(c=>{c.position.z+=dt*speed;if(c.position.z>20)scatterCloud(c)});rings.forEach(r=>{r.position.z+=dt*speed;r.rotation.z+=dt*.12;if(!r.userData.scored&&Math.abs(r.position.z-plane.position.z)<.3&&Math.hypot(r.position.x-plane.position.x,r.position.y-plane.position.y)<1.45){r.userData.scored=true;caught++;showToast(['Lovely catch. Keep wandering.','A little circle of sunshine.','The sky looks good on you.'][caught%3])}if(r.position.z>20)resetRing(r,-90-Math.random()*20)});
 trails.forEach((t,i)=>{t.position.x=plane.position.x+(i?1:-1)*1.55;t.position.y=plane.position.y-.05;t.position.z=plane.position.z+5;t.rotation.z=-plane.rotation.z*.3});distanceEl.innerHTML=`${Math.floor(distance)} <small>m</small>`;ringsEl.innerHTML=`${caught} <small>caught</small>`;renderer.render(scene,camera)}requestAnimationFrame(animate);
