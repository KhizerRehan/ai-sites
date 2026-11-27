import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const container = document.querySelector('#canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
camera.position.set(5, 4.2, 8.8); camera.lookAt(0, 1.55, 0);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xfaffed, 0x53634f, 2.3));
const sun = new THREE.DirectionalLight(0xfff3d7, 3.4); sun.position.set(-4, 8, 5); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-5; sun.shadow.camera.right=5; sun.shadow.camera.top=6; sun.shadow.camera.bottom=-5; sun.shadow.normalBias=.035; scene.add(sun);
const fill = new THREE.DirectionalLight(0xcbdce1, 1.1); fill.position.set(5,3,-4); scene.add(fill);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.18})); floor.rotation.x=-Math.PI/2; floor.position.y=-.04; floor.receiveShadow=true; scene.add(floor);
const display = new THREE.Group(); scene.add(display);
const turntable = new THREE.Mesh(new THREE.CylinderGeometry(2.05,2.08,.13,80),new THREE.MeshStandardMaterial({color:0xb4c0a7,roughness:1})); turntable.position.y=.02; turntable.receiveShadow=true; display.add(turntable);
const turntableRim = new THREE.Mesh(new THREE.TorusGeometry(2.045,.015,8,80),new THREE.MeshStandardMaterial({color:0x899c80,roughness:1})); turntableRim.rotation.x=Math.PI/2;turntableRim.position.y=.09;display.add(turntableRim);
const sculpture = new THREE.Group(); display.add(sculpture);
let tree = null, pot = null, seed = 12, leafChoice='moss', potChoice='sand';
const foliage = {moss:[0x718e55,0x95a96c,0x536f46],jade:[0x4a8970,0x73a783,0x376b5a],blossom:[0xe8afa4,0xf4c5bb,0xc98480],autumn:[0xd67c4a,0xe4a15f,0xac593d]};
const pots = {sand:{color:0xc6bba2,name:'Sandstone'},ink:{color:0x485a52,name:'Ink'},clay:{color:0xb87256,name:'Clay'}};
function randomFactory(s){return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;}}
function disposeGroup(group){if(!group)return;group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}}); sculpture.remove(group)}
function makePot(){disposeGroup(pot); pot=new THREE.Group(); sculpture.add(pot); const mat=new THREE.MeshStandardMaterial({color:pots[potChoice].color,roughness:.92});
 const points=[[0,.14],[.75,.14],[.86,.22],[.91,.59],[.95,.64],[.95,.72],[.81,.72],[.79,.66],[0,.66]].map(p=>new THREE.Vector2(...p));
 const vessel=new THREE.Mesh(new THREE.LatheGeometry(points,64),mat); vessel.castShadow=true;vessel.receiveShadow=true;pot.add(vessel);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(.875,.045,12,64),new THREE.MeshStandardMaterial({color:pots[potChoice].color,roughness:.85}));rim.rotation.x=Math.PI/2;rim.position.y=.69;rim.castShadow=true;pot.add(rim);
 const soil=new THREE.Mesh(new THREE.CylinderGeometry(.81,.81,.035,64),new THREE.MeshStandardMaterial({color:0x574a3e,roughness:1}));soil.position.y=.67;soil.receiveShadow=true;pot.add(soil);
 const rng=randomFactory(5);for(let i=0;i<60;i++){const r=Math.sqrt(rng())*.75,a=rng()*Math.PI*2;const pebble=new THREE.Mesh(new THREE.SphereGeometry(.018+rng()*.022,6,4),new THREE.MeshStandardMaterial({color:i%3?0x908a6d:0xa9a58b,roughness:1}));pebble.position.set(Math.cos(a)*r,.7,Math.sin(a)*r);pebble.scale.y=.4;pot.add(pebble)}
}
function makeTree(){disposeGroup(tree);tree=new THREE.Group();sculpture.add(tree);const rng=randomFactory(seed), age=Number(document.querySelector('#age').value)/100, wild=Number(document.querySelector('#shape').value)/100;
 const bark=new THREE.MeshStandardMaterial({color:0x665344,roughness:1}); const palette=foliage[leafChoice].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.95}));
 const h=1.25+age*.65; const lean=.1+wild*.45;
 const trunkPts=[new THREE.Vector3(0,.69,0),new THREE.Vector3(-.14,.9,0),new THREE.Vector3(.2,h*.48+.7,.02),new THREE.Vector3(lean,h*.78+.7,.04),new THREE.Vector3(lean*.65,h+.7,0)];
 const trunkPath=new THREE.CatmullRomCurve3(trunkPts);const trunk=new THREE.Mesh(new THREE.TubeGeometry(trunkPath,36,.13+age*.055,9,false),bark);trunk.castShadow=true;tree.add(trunk);
 const leafGeo=new THREE.IcosahedronGeometry(1,1);
 for(let i=0;i<9;i++){let t=.31+i*.065, start=trunkPath.getPoint(t);const angle=i*2.4+seed*.08;const length=(.7+(1-t)*.55)*(0.65+age*.45);const dir=new THREE.Vector3(Math.cos(angle),0,Math.sin(angle));const end=start.clone().add(new THREE.Vector3(dir.x*length,(.15+wild*.28)*(rng()-.05),dir.z*length));
 const bend=start.clone().lerp(end,.55);bend.y-=.12+wild*.08;const path=new THREE.QuadraticBezierCurve3(start,bend,end);const branch=new THREE.Mesh(new THREE.TubeGeometry(path,12,.045+(1-t)*.025,6,false),bark);branch.castShadow=true;tree.add(branch);
 const center=end.clone().add(new THREE.Vector3(0,.08,0));const count=8+Math.floor(age*7);
 for(let j=0;j<count;j++){const leaf=new THREE.Mesh(leafGeo.clone(),palette[Math.floor(rng()*palette.length)]);const a=rng()*Math.PI*2,r=Math.sqrt(rng())*(.38+age*.18);leaf.position.set(center.x+Math.cos(a)*r,center.y+(rng()-.5)*.19,center.z+Math.sin(a)*r);leaf.scale.set(.17+rng()*.12,.09+rng()*.07,.14+rng()*.12);leaf.rotation.y=rng()*6;leaf.castShadow=true;leaf.receiveShadow=true;tree.add(leaf)}
 }
 // A crown of leaves gives the silhouette a gentle, rounded peak.
 for(let j=0;j<11;j++){const leaf=new THREE.Mesh(leafGeo.clone(),palette[Math.floor(rng()*3)]);let a=rng()*6.28,r=rng()*.32;leaf.position.set(lean*.65+Math.cos(a)*r,h+.76+rng()*.1,Math.sin(a)*r);leaf.scale.set(.22,.13,.2);leaf.castShadow=true;tree.add(leaf)}
 leafGeo.dispose();
}
function updateLabels(){let a=+document.querySelector('#age').value,s=+document.querySelector('#shape').value;document.querySelector('#ageValue').textContent=`${a} years`;document.querySelector('#shapeValue').textContent=s<34?'Upright':s<67?'Balanced':'Wild & free'}
['age','shape'].forEach(id=>document.querySelector('#'+id).addEventListener('input',()=>{updateLabels();makeTree()}));
document.querySelectorAll('[data-leaf]').forEach(button=>button.addEventListener('click',()=>{leafChoice=button.dataset.leaf;document.querySelectorAll('[data-leaf]').forEach(x=>x.classList.toggle('active',x===button));document.querySelector('#foliageName').textContent=button.title;makeTree()}));
document.querySelectorAll('[data-pot]').forEach(button=>button.addEventListener('click',()=>{potChoice=button.dataset.pot;document.querySelectorAll('[data-pot]').forEach(x=>x.classList.toggle('active',x===button));document.querySelector('#potName').textContent=pots[potChoice].name;makePot()}));
document.querySelector('#newTree').addEventListener('click',()=>{seed=Math.floor(Math.random()*10000);makeTree()});
document.querySelector('#resetView').addEventListener('click',()=>{targetRotation=0});
let dragging=false,lastX=0,targetRotation=0;
container.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;container.setPointerCapture(e.pointerId)});
container.addEventListener('pointermove',e=>{if(dragging){targetRotation+=(e.clientX-lastX)*.012;lastX=e.clientX}});
container.addEventListener('pointerup',()=>dragging=false);container.addEventListener('pointercancel',()=>dragging=false);
function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.position.set(5,4.2, w/h<.8?11:8.8);camera.lookAt(0,1.55,0);camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(container);makePot();makeTree();resize();
function animate(){requestAnimationFrame(animate);sculpture.rotation.y+=(targetRotation-sculpture.rotation.y)*.08;renderer.render(scene,camera)}animate();
