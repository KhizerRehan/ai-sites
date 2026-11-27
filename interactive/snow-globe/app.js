import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('#world');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
camera.position.set(0, 2.15, 11.6); camera.lookAt(0, 1.65, 0);
const ambient = new THREE.HemisphereLight(0xddeeff, 0x506d64, 2.2); scene.add(ambient);
const key = new THREE.DirectionalLight(0xfff3d8, 2.5); key.position.set(-4, 7, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0x9bdcf1, 2); rim.position.set(5, 3, -4); scene.add(rim);
const globe = new THREE.Group(); scene.add(globe);
const mat=(color,more={})=>new THREE.MeshStandardMaterial({color,roughness:.65,...more});
const snowMat=mat(0xf2f7ee); const darkWood=mat(0x253e37,{roughness:.48}); const gold=mat(0xc6a878,{metalness:.65,roughness:.3});
function mesh(geo, material, x=0,y=0,z=0,parent=globe){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);parent.add(m);return m}
function cylinder(top,bottom,height,material,y){return mesh(new THREE.CylinderGeometry(top,bottom,height,64),material,0,y,0)}
// A softly tiered, painted wooden plinth.
cylinder(1.62,1.72,.18,darkWood,.09); cylinder(1.63,1.55,.12,gold,.23); cylinder(1.53,1.58,.38,mat(0x3c5d4f,{roughness:.55}),.48); cylinder(1.59,1.62,.1,gold,.72); cylinder(1.55,1.48,.12,darkWood,.82);
const plaque=mesh(new THREE.BoxGeometry(.84,.19,.035),gold,0,.49,1.575); plaque.rotation.x=-.04;
// Glass globe and snow bed.
const glass=new THREE.Mesh(new THREE.SphereGeometry(1.58,64,48),new THREE.MeshPhysicalMaterial({color:0xd7f7fa,transparent:true,opacity:.12,metalness:0,roughness:.04,side:THREE.DoubleSide,depthWrite:false}));glass.position.y=2.37;globe.add(glass);
const ground=mesh(new THREE.SphereGeometry(1.47,48,24,0,Math.PI*2,0,Math.PI/2),snowMat,0,1.08,0);ground.scale.y=.17;
const line=new THREE.Mesh(new THREE.TorusGeometry(1.46,.025,10,100),gold);line.rotation.x=Math.PI/2;line.position.y=.91;globe.add(line);
// Reflections drawn as delicate arcs on the outside of the glass.
function arc(radius,start,length,tube,opacity,rotation){const a=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,64,length),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity,depthWrite:false}));a.position.set(0,2.37,.36);a.rotation.z=rotation+start;globe.add(a)}
arc(1.46,0,1.05,.016,.36,1.65);arc(1.46,0,.47,.008,.22,4.95);
const diorama=new THREE.Group();diorama.position.y=1.1;globe.add(diorama);
const treeGreen=[0x315e4b,0x487b62,0x59856a];
function tree(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);diorama.add(g);mesh(new THREE.CylinderGeometry(.06,.09,.35,8),mat(0x82634b),0,.18,0,g);for(let i=0;i<3;i++){const y=.37+i*.25;const radius=.40-i*.085;mesh(new THREE.ConeGeometry(radius,.58,9),mat(treeGreen[i]),0,y,0,g);const cap=mesh(new THREE.ConeGeometry(radius*.87,.18,9),snowMat,0,y+.22,0,g);cap.position.y+=.02}return g}
function forest(){tree(-.62,-.25,1.12);tree(.12,-.55,1.35);tree(.68,.08,.86);tree(-.18,.46,.72);for(let i=0;i<9;i++){const a=i*2.4,r=.3+(i%3)*.34;mesh(new THREE.SphereGeometry(.06,10,8),snowMat,Math.cos(a)*r,.07,Math.sin(a)*r,diorama)}}
function house(x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);diorama.add(g);mesh(new THREE.BoxGeometry(.65,.54,.55),mat(0xd6a78a),0,.28,0,g);const roof=mesh(new THREE.ConeGeometry(.59,.45,4),mat(0x925f51),0,.75,0,g);roof.rotation.y=Math.PI/4;const snow=mesh(new THREE.ConeGeometry(.6,.12,4),snowMat,0,.94,0,g);snow.rotation.y=Math.PI/4;mesh(new THREE.BoxGeometry(.18,.27,.02),mat(0x62483f),0,.14,.286,g);for(const xx of [-.21,.21])mesh(new THREE.BoxGeometry(.11,.12,.02),new THREE.MeshBasicMaterial({color:0xffe2a3}),xx,.38,.286,g);mesh(new THREE.BoxGeometry(.12,.28,.12),mat(0xb47c65),.22,.89,-.12,g)}
function village(){house(-.4,.15,1);house(.43,-.25,.74);tree(.85,.32,.55);tree(-.95,-.35,.7);tree(.15,-.8,.65)}
function mountain(){for(const [x,z,s] of [[-.55,-.25,1.05],[.4,-.55,1.25],[.85,.12,.7]]){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);diorama.add(g);mesh(new THREE.ConeGeometry(.65,1.45,5),mat(0x829a91),0,.73,0,g);mesh(new THREE.ConeGeometry(.36,.58,5),snowMat,0,1.17,0,g)}tree(-.6,.55,.46);tree(.35,.55,.52);tree(-1,.15,.42)}
const scenes={forest,village,mountain};
function setScene(name){while(diorama.children.length){const obj=diorama.children.pop();obj.traverse(c=>{if(c.geometry)c.geometry.dispose()});obj.parent=null}scenes[name]()}
setScene('forest');
// Snow remains inside the spherical glass volume and rises briefly when shaken.
const count=430, positions=new Float32Array(count*3), velocities=[];
function resetFlake(i,randomY=true){const y=randomY?Math.random()*2.5+.98:3.75;const maxR=Math.sqrt(Math.max(.05,1.48**2-(y-2.37)**2))*.94;const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*maxR;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=y;positions[i*3+2]=Math.sin(a)*r;velocities[i]=.18+Math.random()*.24}
for(let i=0;i<count;i++)resetFlake(i);
const snowGeo=new THREE.BufferGeometry();snowGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
const snowPoints=new THREE.Points(snowGeo,new THREE.PointsMaterial({color:0xffffff,size:.032,transparent:true,opacity:.9,sizeAttenuation:true,depthWrite:false}));globe.add(snowPoints);snowGeo.setDrawRange(0,Math.round(count*.42));
let shake=0, snowAmount=42, rotationTarget=0, pointerDown=false, lastX=0, lastTime=performance.now();
const resize=()=>{const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;renderer.setSize(box.width,box.height,false);camera.aspect=box.width/box.height;camera.updateProjectionMatrix()};addEventListener('resize',resize);resize();
canvas.addEventListener('pointerdown',e=>{pointerDown=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(pointerDown){rotationTarget+=(e.clientX-lastX)*.012;lastX=e.clientX}});
canvas.addEventListener('pointerup',()=>pointerDown=false);canvas.addEventListener('pointercancel',()=>pointerDown=false);
document.querySelectorAll('.scene').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.scene').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');setScene(button.dataset.scene);shake=1.5}));
const moods={day:[0xddeeff,0xfff3d8,2.2,2.5],dusk:[0xd5add3,0xffb987,1.5,2],night:[0x7296d1,0xa7c4ff,.8,1.1]};
document.querySelectorAll('.mood').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.mood').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');const [sky,sun,a,k]=moods[button.dataset.mood];ambient.color.setHex(sky);key.color.setHex(sun);ambient.intensity=a;key.intensity=k}));
document.querySelector('#snow').addEventListener('input',e=>{snowAmount=Number(e.target.value);snowGeo.setDrawRange(0,Math.round(count*snowAmount/100));document.querySelector('#snow-value').textContent=snowAmount<25?'LIGHT':snowAmount<65?'GENTLE':'HEAVY'});
document.querySelector('#shake').addEventListener('click',()=>{shake=2.6;for(let i=0;i<count;i++)resetFlake(i);snowGeo.attributes.position.needsUpdate=true});
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;shake=Math.max(0,shake-dt);globe.rotation.y+=(rotationTarget-globe.rotation.y)*.07;globe.rotation.z=Math.sin(now*.035)*shake*.025;for(let i=0;i<count;i++){let j=i*3;positions[j+1]-=velocities[i]*dt*(1+shake*.35);positions[j]+=Math.sin(now*.001+i)*dt*.02*(1+shake*2);if(positions[j+1]<1.05)resetFlake(i,false);const maxR=Math.sqrt(Math.max(.02,1.46**2-(positions[j+1]-2.37)**2))*.96;const r=Math.hypot(positions[j],positions[j+2]);if(r>maxR){positions[j]*=maxR/r;positions[j+2]*=maxR/r}}snowGeo.attributes.position.needsUpdate=true;renderer.render(scene,camera)}requestAnimationFrame(animate);
