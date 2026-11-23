import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const container = document.querySelector('#scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.set(8, 6.5, 12); camera.lookAt(0, 2.8, 0);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; container.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xf5fbff, 0x839bab, 2.2));
const sun = new THREE.DirectionalLight(0xffe8d4, 3); sun.position.set(-5, 9, 8); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-7; sun.shadow.camera.right=7; sun.shadow.camera.top=8; sun.shadow.camera.bottom=-7; scene.add(sun);
const root = new THREE.Group(); scene.add(root);
const mat = (color, roughness=.55, metalness=0) => new THREE.MeshStandardMaterial({color, roughness, metalness});
const coral=mat(0xf58d72), darkCoral=mat(0xd56b56), cream=mat(0xf9edd5), butter=mat(0xffd37c), navy=mat(0x496474), blue=mat(0x89bcd0), white=mat(0xffffff), gold=mat(0xeeb755,.4,.3);
function mesh(geo,material,x=0,y=0,z=0,parent=root){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cylinder(rt,rb,h,material,x,y,z,parent=root){return mesh(new THREE.CylinderGeometry(rt,rb,h,48),material,x,y,z,parent)}
function sphere(r,material,x,y,z,parent=root){return mesh(new THREE.SphereGeometry(r,24,16),material,x,y,z,parent)}
function ring(radius,tube,material,x,y,z,parent=root){const m=mesh(new THREE.TorusGeometry(radius,tube,12,60),material,x,y,z,parent);m.rotation.x=Math.PI/2;return m}
// A floating island and a stout, toy-like weather machine.
cylinder(3,2.9,.26,cream,0,-.08,0); cylinder(2.9,2.7,.3,coral,0,-.35,0); ring(2.87,.045,gold,0,.06,0);
for(let i=0;i<24;i++){let a=i/24*Math.PI*2;sphere(.045,gold,Math.cos(a)*2.75,.08,Math.sin(a)*2.75)}
cylinder(1.23,1.34,.32,darkCoral,0,.2,0); cylinder(1.26,1.2,1.8,coral,0,1.22,0); ring(1.25,.07,cream,0,.39,0); ring(1.21,.06,cream,0,2.1,0);
// Rounded shoulders and stack.
sphere(1.2,coral,0,2.04,0).scale.set(1,.38,1); cylinder(.5,.58,.72,cream,0,2.6,0); cylinder(.68,.5,.17,gold,0,2.99,0); cylinder(.7,.7,.11,cream,0,3.13,0); ring(.5,.06,darkCoral,0,3.2,0);
// Decorative front face, gauge, dial and pipework.
const face=cylinder(.52,.52,.12,cream,0,1.27,1.21); face.rotation.x=Math.PI/2;
const glass=cylinder(.4,.4,.14,blue,0,1.27,1.28);glass.rotation.x=Math.PI/2;
const bezel=mesh(new THREE.TorusGeometry(.46,.055,12,48),gold,0,1.27,1.36); 
const gaugeHand=mesh(new THREE.BoxGeometry(.035,.27,.04),navy,0,1.33,1.38);gaugeHand.rotation.z=-.7;sphere(.045,cream,0,1.27,1.41);
for(let i=0;i<5;i++){const a=(-.8+i*.4);const dot=sphere(.025,cream,Math.sin(a)*.29,1.27+Math.cos(a)*.29,1.4);}
for(const x of [-.75,.75]){const lamp=sphere(.11,butter,x,1.8,1.02);lamp.scale.z=.5;}
for(let i=0;i<4;i++){const vent=mesh(new THREE.BoxGeometry(.07,.35,.035),darkCoral,-.38+i*.25,.61,1.28);vent.rotation.z=.08;}
// Side valves and brass piping.
for(const x of [-1.27,1.27]){const pipe=cylinder(.13,.13,.55,gold,x,1.45,0);pipe.rotation.z=Math.PI/2; const cap=cylinder(.24,.24,.08,cream,x*1.22,1.45,0);cap.rotation.z=Math.PI/2;}
const wheel=mesh(new THREE.TorusGeometry(.31,.055,12,32),gold,1.65,1.72,0);wheel.rotation.y=Math.PI/2;for(let i=0;i<3;i++){let spoke=mesh(new THREE.BoxGeometry(.06,.58,.06),gold,1.65,1.72,0);spoke.rotation.x=i*Math.PI/3;}
const chimney=cylinder(.3,.35,1.5,navy,-1.7,1.08,-.65);cylinder(.42,.3,.13,gold,-1.7,1.84,-.65);cylinder(.42,.42,.1,cream,-1.7,1.94,-.65);
// Floating tiny details make the scene feel like a miniature model.
for(let i=0;i<9;i++){const a=i*Math.PI*2/9;let s=mesh(new THREE.OctahedronGeometry(.055),i%2?cream:butter,Math.cos(a)*3.1,1.4+Math.sin(a*3)*.7,Math.sin(a)*2.8);s.userData.phase=i;}
const clouds=[];let made=0;const count=document.querySelector('#count');const fluff=document.querySelector('#fluff');
function makeCloud(initial=false){
 const g=new THREE.Group();const n=Number(fluff.value);const cloudMat=mat(document.body.dataset.sky==='night'?0xe4ddf6:0xfffbf5,.85);
 // Intersecting softly lit spheres form unmistakable puffs.
 const specs=[[-.55,0,0,.42],[0,.12,0,.6],[.58,0,0,.44],[-.25,.04,.25,.39],[.3,.03,.25,.42]];
 if(n>1)specs.push([-.45,.32,0,.35],[.38,.33,-.04,.36]);if(n>2)specs.push([0,.48,.03,.37],[-.8,.03,.04,.27],[.84,.03,0,.29]);
 specs.forEach(([x,y,z,r])=>sphere(r,cloudMat,x,y,z,g));
 g.scale.setScalar(.5+Math.random()*.15);g.position.set((Math.random()-.5)*3.4,3.8+Math.random()*1.9,(Math.random()-.5)*2);g.userData={base:g.position.y,phase:Math.random()*6,velocity:.12+Math.random()*.07};root.add(g);clouds.push(g);if(clouds.length>12){const old=clouds.shift();root.remove(old);old.traverse(o=>{if(o.geometry)o.geometry.dispose()});}
 if(!initial){made++;count.textContent=String(made).padStart(2,'0');document.querySelector('#make').animate([{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:220});}
}
for(let i=0;i<5;i++)makeCloud(true);
// Rain lives in the same miniature world and is switched without recreating it.
const drops=new THREE.Group();root.add(drops);for(let i=0;i<90;i++){const drop=mesh(new THREE.CapsuleGeometry(.018,.12,3,6),new THREE.MeshBasicMaterial({color:0xe6f9ff,transparent:true,opacity:.7}),(Math.random()-.5)*6,Math.random()*5,(Math.random()-.5)*4,drops);drop.userData.speed=.6+Math.random();}drops.visible=false;
let raining=false;document.querySelector('#rain').addEventListener('click',e=>{raining=!raining;drops.visible=raining;e.currentTarget.setAttribute('aria-checked',String(raining));});
document.querySelector('#make').addEventListener('click',()=>makeCloud());document.querySelector('#clear').addEventListener('click',()=>{clouds.forEach(g=>{root.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose()})});clouds.length=0;});
fluff.addEventListener('input',()=>{document.querySelector('#fluffValue').textContent=['LIGHT & AIRY','EXTRA FLUFFY','MAXIMUM FLUFF'][Number(fluff.value)-1]});
document.querySelectorAll('.sky').forEach(button=>button.addEventListener('click',()=>{document.body.dataset.sky=button.dataset.preset;document.querySelectorAll('.sky').forEach(b=>{const on=b===button;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});sun.color.set(button.dataset.preset==='peach'?0xffc5a1:button.dataset.preset==='night'?0xc5ceff:0xffe8d4);clouds.forEach(g=>g.children.forEach(p=>p.material.color.set(button.dataset.preset==='night'?0xe4ddf6:0xfffbf5)));}));
let dragging=false,lastX=0;container.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;container.setPointerCapture(e.pointerId)});container.addEventListener('pointermove',e=>{if(dragging){root.rotation.y+=(e.clientX-lastX)*.008;lastX=e.clientX}});container.addEventListener('pointerup',()=>dragging=false);container.addEventListener('pointercancel',()=>dragging=false);
function resize(){const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(container);resize();
let previous=performance.now();function animate(now){const dt=Math.min((now-previous)/1000,.05);previous=now;const t=now*.001;if(!dragging)root.rotation.y+=dt*.035;clouds.forEach((g,i)=>{g.position.y=g.userData.base+Math.sin(t*.8+g.userData.phase)*.12;g.position.x+=dt*g.userData.velocity;if(g.position.x>3)g.position.x=-3;g.rotation.y+=dt*.08});if(raining)drops.children.forEach(d=>{d.position.y-=dt*d.userData.speed*2;if(d.position.y<.1)d.position.y=5});gaugeHand.rotation.z=-.7+Math.sin(t*1.8)*.18;renderer.render(scene,camera);requestAnimationFrame(animate)}requestAnimationFrame(animate);
