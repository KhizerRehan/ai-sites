import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const world = document.querySelector('.world');
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-6, 6, 6, -6, .1, 100);
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const ambient = new THREE.HemisphereLight(0xffffff, 0x8eac9a, 2.15); scene.add(ambient);
const sun = new THREE.DirectionalLight(0xfff2d4, 3.1); sun.position.set(-5,10,6); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:.1,far:30}); sun.shadow.bias=-.0005; scene.add(sun);
const group = new THREE.Group(); scene.add(group);
const mat=(color, extra={})=>new THREE.MeshStandardMaterial({color,roughness:.78,...extra});
const palette={cream:mat('#fff1ce'),coral:mat('#ed8468'),pink:mat('#f6b7a5'),blue:mat('#6fa9b3'),navy:mat('#365c70'),yellow:mat('#f2c76b'),grass:mat('#a9c78f'),green:mat('#5b9776'),darkgreen:mat('#408164'),road:mat('#b2c8a6'),stone:mat('#dce5c6'),white:mat('#fff7df'),glass:mat('#b7d9d4'),trunk:mat('#ad8060'),orange:mat('#de725e')};
function box(parent,w,h,d,m,x=0,y=0,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function sphere(parent,r,m,x,y,z,scale=[1,1,1]){const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,12,9),m);mesh.position.set(x,y,z);mesh.scale.set(...scale);mesh.castShadow=true;parent.add(mesh);return mesh}
function cone(parent,r,h,m,x,y,z,segments=4){const mesh=new THREE.Mesh(new THREE.ConeGeometry(r,h,segments),m);mesh.position.set(x,y+h/2,z);mesh.rotation.y=Math.PI/4;mesh.castShadow=true;parent.add(mesh);return mesh}
function tree(parent,x,z,s=1){box(parent,.09*s,.38*s,.09*s,palette.trunk,x,0,z);sphere(parent,.27*s,palette.green,x,.5*s,z,[1,1.08,1]);sphere(parent,.18*s,palette.darkgreen,x+.13*s,.57*s,z)}
// Floating board and the individual plots make a tactile tabletop.
box(group,7.1,.3,7.1,palette.navy,0,-.42,0);box(group,7,.16,7,palette.stone,0,-.12,0);
const plots=[], buildings=new Map();
for(let z=0;z<5;z++)for(let x=0;x<5;x++){const tile=box(group,1.21,.08,1.21,palette.road,(x-2)*1.34,.04,(z-2)*1.34);tile.userData={x,z};plots.push(tile);}
// Road markings between plots.
for(let i=-2;i<=2;i++)for(let j=-2;j<2;j++){box(group,.05,.012,.24,palette.cream,i*1.34,.124,(j+.5)*1.34);box(group,.24,.012,.05,palette.cream,(j+.5)*1.34,.124,i*1.34)}
const selection = new THREE.Mesh(new THREE.BoxGeometry(1.25,.035,1.25),new THREE.MeshBasicMaterial({color:0xfff2a4,transparent:true,opacity:.5})); selection.position.y=.14; selection.visible=false;group.add(selection);
const roofMaterials=[palette.coral,palette.blue,palette.yellow,palette.pink];
function makeBuilding(type,variant=Math.floor(Math.random()*4)){
 const g=new THREE.Group(), m=roofMaterials[variant%4];
 if(type==='house'){
  box(g,.75,.72,.72,palette.cream,0,0,0);cone(g,.65,.46,m,0,.72,0);box(g,.18,.29,.025,palette.navy,0,0,.37);box(g,.15,.15,.028,palette.glass,-.24,.37,.37);box(g,.15,.15,.028,palette.glass,.24,.37,.37);box(g,.13,.13,.025,palette.white,-.24,.38,.39);box(g,.13,.13,.025,palette.white,.24,.38,.39);box(g,.1,.34,.1,palette.coral,.28,.88,-.16);tree(g,-.46,.34,.55);
 }else if(type==='tower'){
  const height=1.45+variant*.17;box(g,.73,height,.68,m,0,0,0);box(g,.79,.09,.74,palette.cream,0,height,0);box(g,.32,.1,.32,palette.navy,0,height+.09,0);
  for(let y=.23;y<height-.15;y+=.29)for(let x of [-.23,0,.23]){box(g,.12,.15,.025,palette.glass,x,y,.35);box(g,.025,.15,.12,palette.glass,.375,y,x)}
  box(g,.2,.24,.03,palette.navy,0,0,.365);
 }else if(type==='shop'){
  box(g,.88,.6,.78,palette.cream,0,0,0);box(g,.94,.1,.84,m,0,.6,0);box(g,.55,.24,.03,palette.glass,0,.2,.405);box(g,.18,.32,.04,palette.navy,.27,0,.41);box(g,.69,.08,.26,palette.coral,-.07,.49,.48);for(let x=-.31;x<.3;x+=.18)box(g,.085,.085,.27,palette.white,x,.49,.49);box(g,.45,.11,.04,palette.yellow,-.05,.67,.43);tree(g,-.46,.35,.55);
 }else{
  box(g,1.04,.07,1.04,palette.grass,0,0,0);box(g,.13,.025,.95,palette.stone,0,.07,0);tree(g,-.3,-.25,.9);tree(g,.32,.25,.75);tree(g,.25,-.35,.55);box(g,.31,.06,.13,palette.yellow,-.26,.13,.31);box(g,.03,.14,.03,palette.trunk,-.36,.06,.31);box(g,.03,.14,.03,palette.trunk,-.16,.06,.31);for(const [x,z,c] of [[-.39,.03,palette.pink],[.37,-.07,palette.yellow],[-.3,.4,palette.coral]])sphere(g,.035,c,x,.11,z);
 }
 return g;
}
function key(x,z){return `${x},${z}`}
function updateCount(){const n=buildings.size;document.querySelector('#count').textContent=`${n} ${n===1?'BLOCK':'BLOCKS'} & COUNTING`}
function removeAt(x,z){const k=key(x,z),old=buildings.get(k);if(old){group.remove(old);buildings.delete(k);}}
function place(x,z,type,variant){removeAt(x,z);if(type!=='erase'){const g=makeBuilding(type,variant);g.position.set((x-2)*1.34,.12,(z-2)*1.34);g.scale.setScalar(.01);g.userData.targetScale=1;group.add(g);buildings.set(key(x,z),g)}updateCount()}
function reset(){for(const g of buildings.values())group.remove(g);buildings.clear();updateCount()}
function populate(random=false){reset();const types=['house','tower','shop','park'];const locations=random?Array.from({length:13},()=>[Math.floor(Math.random()*5),Math.floor(Math.random()*5)]):[[0,0],[1,0],[3,0],[4,0],[0,1],[2,1],[4,1],[1,2],[3,2],[0,3],[2,3],[4,3],[1,4],[3,4]];locations.forEach(([x,z],i)=>place(x,z,types[random?Math.floor(Math.random()*4):[0,1,0,3,2,0,1,3,2,0,1,0,2,3][i]],i));}
populate();
let tool='house', theta=.72, elevation=6.7, dragging=false, moved=false, lastX=0, startX=0,startY=0;
function positionCamera(){const radius=10;camera.position.set(Math.sin(theta)*radius,elevation,Math.cos(theta)*radius);camera.lookAt(0,0,0)}positionCamera();
function resize(){const w=world.clientWidth,h=world.clientHeight;renderer.setSize(w,h,false);const aspect=w/h, view=5.7;camera.left=-view*aspect;camera.right=view*aspect;camera.top=view;camera.bottom=-view;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(world); resize();
const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
function hit(event){const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(plots)[0]?.object}
canvas.addEventListener('pointerdown',e=>{dragging=true;moved=false;lastX=startX=e.clientX;startY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(dragging){if(Math.hypot(e.clientX-startX,e.clientY-startY)>5)moved=true;if(moved){theta-=(e.clientX-lastX)*.008;positionCamera();selection.visible=false}lastX=e.clientX}else{const tile=hit(e);selection.visible=!!tile;if(tile){selection.position.x=tile.position.x;selection.position.z=tile.position.z}}});
canvas.addEventListener('pointerup',e=>{if(dragging&&!moved){const tile=hit(e);if(tile){place(tile.userData.x,tile.userData.z,tool);toast(tool==='erase'?'Plot cleared. Make something new!':'A new neighbor just moved in!')}}dragging=false});
canvas.addEventListener('pointercancel',()=>dragging=false);canvas.addEventListener('pointerleave',()=>selection.visible=false);
document.querySelectorAll('.tool').forEach(button=>button.addEventListener('click',()=>{tool=button.dataset.tool;document.querySelectorAll('.tool').forEach(b=>{const on=b===button;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',on)})}));
const themes={day:{sky:'#ffffff',ground:'#8eac9a',sun:'#fff2d4',ambient:2.15,intensity:3.1,name:'SUNNY SIDE'},dusk:{sky:'#ffe1b8',ground:'#a47680',sun:'#ffb079',ambient:1.6,intensity:2.7,name:'GOLDEN HOUR'},night:{sky:'#98aada',ground:'#40596a',sun:'#abc2ff',ambient:1.25,intensity:1.7,name:'AFTER HOURS'}};
document.querySelectorAll('.theme').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.theme').forEach(b=>{const on=b===button;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)});const t=themes[button.dataset.theme];ambient.color.set(t.sky);ambient.groundColor.set(t.ground);ambient.intensity=t.ambient;sun.color.set(t.sun);sun.intensity=t.intensity;document.querySelector('#cityName').textContent=t.name}));
let toastTimeout;function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2200)}
document.querySelector('#shuffle').addEventListener('click',()=>{populate(true);toast('A brand new neighborhood!')});document.querySelector('#clear').addEventListener('click',()=>{reset();toast('A fresh start for your city.')});document.querySelector('#help').addEventListener('click',()=>document.querySelector('#helpDialog').showModal());
let t=0;function animate(){requestAnimationFrame(animate);t+=.016;for(const b of buildings.values()){if(b.scale.x<.999){const s=THREE.MathUtils.lerp(b.scale.x,1,.12);b.scale.setScalar(s)}}renderer.render(scene,camera)}animate();document.querySelector('#loading').classList.add('done');
