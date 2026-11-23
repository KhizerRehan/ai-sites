import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const host = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; host.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(37,1,.1,100); const lookAt=new THREE.Vector3(0,.8,0);
const hemi=new THREE.HemisphereLight(0xfff0cf,0x455b44,2.1); scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffdfb0,2.5); sun.position.set(-5,10,6); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8;sun.shadow.normalBias=.04;scene.add(sun);
const island=new THREE.Group();scene.add(island);
const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
const grass=mat(0x729867), soil=mat(0x655841), stemMat=mat(0x4e7552), leafMat=mat(0x5f895b), gold=mat(0xe4af52), wingDark=mat(0x3c4c38);
function mesh(geometry,material,parent=island){const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
const base=mesh(new THREE.CylinderGeometry(4.15,3.45,.7,64),soil);base.position.y=-.32;
const turf=mesh(new THREE.CylinderGeometry(4.2,4.15,.25,64),grass);turf.position.y=.08;
const edge=mesh(new THREE.TorusGeometry(4.12,.06,8,80),mat(0x92ae79));edge.rotation.x=Math.PI/2;edge.position.y=.21;
const flowerColors={peach:0xf39b80,cream:0xffe0a0,lilac:0xb99ad4,pink:0xea8dac}; let flowerColor='peach'; let flowers=[]; let butterflies=[];
function flower(x,z,color,scale=1){
 const g=new THREE.Group();g.position.set(x,.21,z);g.scale.setScalar(scale);island.add(g);const h=.48+Math.random()*.3;
 const stem=mesh(new THREE.CylinderGeometry(.025,.035,h,6),stemMat,g);stem.position.y=h/2;
 const leafGeo=new THREE.SphereGeometry(1,8,6);for(let side of [-1,1]){let leaf=mesh(leafGeo,leafMat,g);leaf.scale.set(.17,.045,.07);leaf.position.set(side*.12,h*.4,0);leaf.rotation.z=side*.5;}
 const petalMat=mat(color);for(let j=0;j<6;j++){let a=j*Math.PI/3;let p=mesh(new THREE.SphereGeometry(1,10,7),petalMat,g);p.scale.set(.115,.035,.2);p.position.set(Math.sin(a)*.16,h,Math.cos(a)*.16);p.rotation.y=a;}
 let center=mesh(new THREE.SphereGeometry(.085,10,8),gold,g);center.position.y=h+.04;g.userData.phase=Math.random()*6;flowers.push(g);return g;
}
function plantRandom(n){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*3.7;let colors=Object.values(flowerColors);flower(Math.cos(a)*r,Math.sin(a)*r,colors[Math.floor(Math.random()*colors.length)],.65+Math.random()*.5)}}
// Low sculptural leaves add texture to the meadow without obscuring its flowers.
for(let i=0;i<95;i++){let a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*4;let blade=mesh(new THREE.ConeGeometry(.055,.25+Math.random()*.25,4),i%2?leafMat:grass);blade.position.set(Math.cos(a)*r,.3,Math.sin(a)*r);blade.rotation.z=(Math.random()-.5)*.5;}
const stones=mat(0xb7be9f);for(let i=0;i<13;i++){let a=Math.random()*6.28,r=Math.random()*3.8;let rock=mesh(new THREE.DodecahedronGeometry(.12+Math.random()*.1,0),stones);rock.scale.y=.5;rock.position.set(Math.cos(a)*r,.23,Math.sin(a)*r)}
function addButterfly(){
 if(butterflies.length>=24)return;
 const b=new THREE.Group();scene.add(b);const colors=[0xf4ad86,0xf3d385,0xdab0d9,0xe8ecbb,0xf18d91];let wingMat=mat(colors[butterflies.length%colors.length],.65);
 const body=mesh(new THREE.SphereGeometry(.075,8,8),wingDark,b);body.scale.set(.5,.5,2.1);
 const wings=[];for(let side of [-1,1]){let hinge=new THREE.Group();b.add(hinge);let upper=mesh(new THREE.SphereGeometry(1,12,8),wingMat,hinge);upper.scale.set(.25,.035,.18);upper.position.set(side*.23,0,-.06);upper.rotation.y=side*-.28;let lower=mesh(new THREE.SphereGeometry(1,12,8),wingMat,hinge);lower.scale.set(.17,.03,.13);lower.position.set(side*.16,0,.16);lower.rotation.y=side*.3;let dot=mesh(new THREE.SphereGeometry(.038,8,6),wingDark,hinge);dot.scale.y=.3;dot.position.set(side*.27,.04,-.08);wings.push({hinge,side});}
 b.userData={wings,phase:Math.random()*6.28,radius:1.2+Math.random()*2.6,height:1.2+Math.random()*1.8,speed:.3+Math.random()*.25};butterflies.push(b);updateCount();
}
function updateCount(){document.querySelector('#count').textContent=`${butterflies.length} LITTLE VISITOR${butterflies.length===1?'':'S'}`}
plantRandom(30);for(let i=0;i<6;i++)addButterfly();
const presets={morning:{bg:0xc2dfd0,fog:0xc2dfd0,hemi:0xffffff,sun:0xfff2d0,hi:2.1,si:2.4,label:'MORNING LIGHT'},golden:{bg:0xd6d6af,fog:0xd6d6af,hemi:0xffe6c1,sun:0xffd09b,hi:2.1,si:2.5,label:'GOLDEN HOUR'},night:{bg:0x263c43,fog:0x263c43,hemi:0x9ab9dc,sun:0xb9c8ed,hi:.9,si:1,label:'MOONLIT MEADOW'}};
const targetBg=new THREE.Color(),targetHemi=new THREE.Color(),targetSun=new THREE.Color();let targetHI=2,targetSI=2;scene.background=new THREE.Color();scene.fog=new THREE.Fog(0xd6d6af,15,35);
function setTime(name){let p=presets[name];targetBg.setHex(p.bg);targetHemi.setHex(p.hemi);targetSun.setHex(p.sun);targetHI=p.hi;targetSI=p.si;document.querySelector('#scene-time').textContent=p.label;document.querySelectorAll('[data-time]').forEach(b=>{let on=b.dataset.time===name;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)});}
setTime('golden');scene.background.copy(targetBg);
let angle=.5,elevation=.77,down=null,moved=false;const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.23),hit=new THREE.Vector3();
function updateCamera(){const d=11;camera.position.set(Math.sin(angle)*Math.cos(elevation)*d,Math.sin(elevation)*d,Math.cos(angle)*Math.cos(elevation)*d);camera.lookAt(lookAt)}updateCamera();
host.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};moved=false;host.setPointerCapture(e.pointerId)});
host.addEventListener('pointermove',e=>{if(!down)return;let dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>1)moved=true;angle-=dx*.007;elevation=THREE.MathUtils.clamp(elevation+dy*.005,.38,1.1);down={x:e.clientX,y:e.clientY};updateCamera()});
host.addEventListener('pointerup',e=>{if(!down)return;if(!moved){const rect=host.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);if(raycaster.ray.intersectPlane(plane,hit)&&Math.hypot(hit.x,hit.z)<4){flower(hit.x,hit.z,flowerColors[flowerColor],.9);}}down=null});host.addEventListener('pointercancel',()=>down=null);
document.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>setTime(b.dataset.time)));
document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{flowerColor=b.dataset.color;document.querySelectorAll('[data-color]').forEach(x=>{let on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on)})}));
document.querySelector('#release').addEventListener('click',addButterfly);
document.querySelector('#reset').addEventListener('click',()=>{flowers.forEach(f=>island.remove(f));flowers=[];butterflies.forEach(b=>scene.remove(b));butterflies=[];plantRandom(30);for(let i=0;i<6;i++)addButterfly();setTime('golden');angle=.5;elevation=.77;updateCamera()});
function resize(){let w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();scene.background.lerp(targetBg,.025);scene.fog.color.copy(scene.background);hemi.color.lerp(targetHemi,.025);sun.color.lerp(targetSun,.025);hemi.intensity+=(targetHI-hemi.intensity)*.025;sun.intensity+=(targetSI-sun.intensity)*.025;
 butterflies.forEach((b,i)=>{let u=b.userData,a=t*u.speed+u.phase;b.position.set(Math.sin(a)*u.radius,u.height+Math.sin(t*1.7+u.phase)*.22,Math.cos(a*.87)*u.radius);b.rotation.y=a+Math.PI/2;b.rotation.z=Math.sin(t*.8+u.phase)*.12;u.wings.forEach(w=>w.hinge.rotation.z=w.side*(.2+Math.abs(Math.sin(t*8+u.phase))*.9))});flowers.forEach(f=>f.rotation.z=Math.sin(t*1.1+f.userData.phase)*.025);renderer.render(scene,camera)}animate();
