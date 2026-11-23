import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const container = document.querySelector('#scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
camera.position.set(5.5, 4.3, 8); camera.lookAt(0, 1.7, 0);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);
const hemi = new THREE.HemisphereLight(0xe8fff1, 0x517254, 2.4); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff4d4, 3.1); sun.position.set(-4,8,5); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-5;scene.add(sun);
const rim = new THREE.PointLight(0x9be9c3, 35, 20); rim.position.set(4,3,-4); scene.add(rim);
const garden = new THREE.Group(); scene.add(garden);
function mat(color, extra={}) {return new THREE.MeshPhysicalMaterial({color,roughness:.48,metalness:.02,...extra});}
function mesh(geometry, material, parent=garden){const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const soil=mat(0x4d654b), stone=mat(0x809b7b), gold=mat(0xbda66c,{metalness:.55,roughness:.3});
const base=mesh(new THREE.CylinderGeometry(2.02,2.12,.27,64),mat(0x668672));base.position.y=.19;
const baseTop=mesh(new THREE.CylinderGeometry(1.97,1.97,.12,64),mat(0xa5bc9f));baseTop.position.y=.36;
const dirt=mesh(new THREE.CylinderGeometry(1.87,1.87,.15,64),soil);dirt.position.y=.46;
const band=mesh(new THREE.TorusGeometry(2.035,.025,12,100),gold);band.rotation.x=Math.PI/2;band.position.y=.27;
const glass=mesh(new THREE.SphereGeometry(1.96,64,40,0,Math.PI*2,0,Math.PI/2),mat(0xd8fff0,{transparent:true,opacity:.13,roughness:.08,metalness:.05,side:THREE.DoubleSide,depthWrite:false}));glass.position.y=.5;glass.scale.y=1.55;glass.castShadow=false;
const glassRim=mesh(new THREE.TorusGeometry(1.96,.018,8,100),mat(0xdbfff1,{transparent:true,opacity:.65,roughness:.12}));glassRim.rotation.x=Math.PI/2;glassRim.position.y=.52;
// Two slender highlight strokes lend the glass its curved, hand-blown surface.
for (const angle of [-.78,.95]) {const points=[];for(let i=0;i<35;i++){let a=.2+i/34*1.15;points.push(new THREE.Vector3(Math.sin(a)*1.96*Math.cos(angle),.5+Math.cos(a)*3.03,Math.sin(a)*1.96*Math.sin(angle)));}const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.3}));garden.add(line);}
const knob=mesh(new THREE.SphereGeometry(.105,20,12),gold);knob.position.y=3.56;
const pebbles=[];for(let i=0;i<36;i++){let a=i*2.4, r=.3+(i%7)*.19; const p=mesh(new THREE.SphereGeometry(.06+(i%3)*.015,8,6),i%3?stone:mat(0xc4cfaa));p.position.set(Math.cos(a)*r,.55,Math.sin(a)*r);p.scale.y=.45;pebbles.push(p);}
const plants=[]; let selected='daisy';
function stemBetween(a,b,r,material,parent){const d=new THREE.Vector3().subVectors(b,a), m=mesh(new THREE.CylinderGeometry(r*.8,r,d.length(),8),material,parent);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
function plant(type,x,z,animate=true){
 const g=new THREE.Group();g.position.set(x,.54,z);garden.add(g);let height=.83+Math.random()*.3, lean=(Math.random()-.5)*.24;const stem=mat(0x608665);stemBetween(new THREE.Vector3(0,0,0),new THREE.Vector3(lean,height,0),.035,stem,g);
 for(let j=0;j<2;j++){let leaf=mesh(new THREE.SphereGeometry(1,16,10),mat(j?0x86ae85:0x719b77,{transparent:true,opacity:.86}),g);leaf.scale.set(.12,.34,.055);leaf.position.set((j?1:-1)*.17,.32+j*.19,0);leaf.rotation.z=j?-.9:.9;}
 const head=new THREE.Group();head.position.set(lean,height,0);g.add(head);
 if(type==='daisy') {for(let j=0;j<9;j++){let p=mesh(new THREE.SphereGeometry(1,20,12),mat(0xf5fff1,{transparent:true,opacity:.85,roughness:.25}),head);let a=j*Math.PI*2/9;p.position.set(Math.sin(a)*.23,Math.cos(a)*.23,0);p.scale.set(.085,.25,.045);p.rotation.z=-a;}let center=mesh(new THREE.SphereGeometry(.105,18,12),mat(0xe8c77a),head);center.position.z=.04;}
 if(type==='bell'){const bell=mesh(new THREE.SphereGeometry(.27,24,16,0,Math.PI*2,0,Math.PI*.58),mat(0xb5b6ed,{transparent:true,opacity:.78,roughness:.24,side:THREE.DoubleSide}),head);bell.rotation.z=Math.PI;bell.position.y=.02;for(let j=0;j<5;j++){let p=mesh(new THREE.SphereGeometry(.07,12,8),mat(0xd6d2ff,{transparent:true,opacity:.8}),head);let a=j*Math.PI*2/5;p.position.set(Math.cos(a)*.18,-.1,Math.sin(a)*.18);}let stamen=mesh(new THREE.SphereGeometry(.055,12,8),mat(0xffdc98),head);stamen.position.y=-.13;}
 if(type==='star'){for(let j=0;j<7;j++){let p=mesh(new THREE.SphereGeometry(1,16,10),mat(0xffc97e,{transparent:true,opacity:.85,roughness:.25}),head);let a=j*Math.PI*2/7;p.position.set(Math.sin(a)*.2,Math.cos(a)*.2,0);p.scale.set(.075,.24,.045);p.rotation.z=-a;}let c=mesh(new THREE.SphereGeometry(.095,16,12),mat(0xd98e53),head);c.position.z=.04;}
 head.rotation.x=-.2;head.rotation.y=(Math.random()-.5)*.6;g.userData={head,phase:Math.random()*6,scale:animate?0:1};if(animate)g.scale.setScalar(.01);plants.push(g);updateCount();
}
plant('daisy',-.75,.2,false);plant('bell',.05,-.35,false);plant('star',.72,.28,false);
function updateCount(){document.querySelector('#count').textContent=`${plants.length} ${plants.length===1?'BLOOM':'BLOOMS'} GROWING`;}
let timer;function message(text){const m=document.querySelector('#message');m.textContent=text;m.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>m.classList.remove('show'),1800);}
document.querySelectorAll('.species-btn').forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.type;document.querySelectorAll('.species-btn').forEach(b=>{let active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});message(`${btn.querySelector('strong').textContent} selected · tap the soil`);}));
const lightSettings={morning:{hemi:0xe8fff1,sun:0xfff4d4,rim:0x9be9c3,intensity:3.1},golden:{hemi:0xffe6bf,sun:0xffb464,rim:0xffba75,intensity:3.5},moon:{hemi:0xa7c5ed,sun:0x9bbcff,rim:0xc4a8ff,intensity:1.8}};
document.querySelectorAll('.mood').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.mood').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});let s=lightSettings[btn.dataset.light];hemi.color.set(s.hemi);sun.color.set(s.sun);rim.color.set(s.rim);sun.intensity=s.intensity;message(`${btn.textContent.trim()} light`);}));
document.querySelector('#undo').addEventListener('click',()=>{if(plants.length){garden.remove(plants.pop());updateCount();message('Last bloom removed');}else message('Your garden is already empty');});
document.querySelector('#reset').addEventListener('click',()=>{plants.forEach(p=>garden.remove(p));plants.length=0;updateCount();message('A fresh little world awaits');});
const raycaster=new THREE.Raycaster(), mouse=new THREE.Vector2(), hitPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.54), hit=new THREE.Vector3();let pointer=null;
container.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY,last:e.clientX,moved:false};container.setPointerCapture(e.pointerId);});
container.addEventListener('pointermove',e=>{if(!pointer)return;let dx=e.clientX-pointer.last;if(Math.abs(e.clientX-pointer.x)>5||Math.abs(e.clientY-pointer.y)>5)pointer.moved=true;if(pointer.moved)garden.rotation.y+=dx*.012;pointer.last=e.clientX;});
container.addEventListener('pointerup',e=>{if(!pointer)return;if(!pointer.moved){let rect=container.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(mouse,camera);if(raycaster.ray.intersectPlane(hitPlane,hit)){garden.worldToLocal(hit);if(Math.hypot(hit.x,hit.z)<1.75){if(plants.length<35)plant(selected,hit.x,hit.z);else message('Your garden is full of life');}else message('Tap inside the glass to plant');}}pointer=null;});
container.addEventListener('pointercancel',()=>pointer=null);
function resize(){const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}new ResizeObserver(resize).observe(container);resize();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);let t=clock.getElapsedTime();plants.forEach(p=>{p.userData.scale=THREE.MathUtils.lerp(p.userData.scale,1,.045);p.scale.setScalar(p.userData.scale);p.userData.head.rotation.z=Math.sin(t*1.1+p.userData.phase)*.045;});renderer.render(scene,camera);}animate();
