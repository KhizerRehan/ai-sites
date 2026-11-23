import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const host = document.querySelector('#scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(37, 1, .1, 100);
camera.position.set(0, 1.3, 15.5);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
host.appendChild(renderer.domElement);
const root = new THREE.Group(); scene.add(root);
root.rotation.set(.18,-.2,.09);
scene.add(new THREE.AmbientLight(0xabbcff, 1.15));
const key = new THREE.PointLight(0xffe0a0, 90, 30); key.position.set(2,3,5); scene.add(key);
const rim = new THREE.DirectionalLight(0x728dff, 2.2); rim.position.set(-5,2,-4); scene.add(rim);

// A hand-painted star field behind the kinetic sculpture.
const starsGeometry = new THREE.BufferGeometry(); const starPos=[]; const starColors=[];
for(let i=0;i<1100;i++){ const x=(Math.random()-.5)*55,y=(Math.random()-.5)*36,z=-8-Math.random()*24; starPos.push(x,y,z); const v=.35+Math.random()*.65; starColors.push(v,v*.95,Math.min(1,v*1.2)); }
starsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3)); starsGeometry.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));
const stars=new THREE.Points(starsGeometry,new THREE.PointsMaterial({size:.035,vertexColors:true,transparent:true,opacity:.8,sizeAttenuation:true}));scene.add(stars);
const sun=new THREE.Mesh(new THREE.IcosahedronGeometry(.8,5),new THREE.MeshStandardMaterial({color:0xffc774,emissive:0xa94a1a,emissiveIntensity:.32,roughness:.54,metalness:.08}));root.add(sun);
const corona=new THREE.Mesh(new THREE.SphereGeometry(1.04,48,32),new THREE.MeshBasicMaterial({color:0xffbf76,transparent:true,opacity:.055,side:THREE.BackSide}));root.add(corona);
const sunRing=new THREE.Mesh(new THREE.TorusGeometry(1.18,.006,8,160),new THREE.MeshBasicMaterial({color:0xffd09b,transparent:true,opacity:.42}));sunRing.rotation.x=1.15;root.add(sunRing);
const palettes=[0xd9f38b,0xff9c88,0x99baff,0xe8a9e5,0xffce80];const names=['Limoncello','Coral','Periwinkle','Orchid','Honey'];let selected=0, speed=1, elapsed=0;const moons=[];
function addMoon(color=palettes[selected]){
 if(moons.length>=8)return;
 const n=moons.length, radius=1.55+n*.49, pivot=new THREE.Group();
 pivot.rotation.set(.65+n*.21, .35+n*.52, n*.5);root.add(pivot);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.006,6,180),new THREE.MeshBasicMaterial({color:0xa9b6e2,transparent:true,opacity:.28}));pivot.add(ring);
 const orbiter=new THREE.Group();pivot.add(orbiter);
 const body=new THREE.Mesh(new THREE.SphereGeometry(.13+(n%3)*.055,32,24),new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.08}));body.position.x=radius;orbiter.add(body);
 const halo=new THREE.Mesh(new THREE.SphereGeometry(.21+(n%3)*.055,24,16),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.1,side:THREE.BackSide}));halo.position.x=radius;orbiter.add(halo);
 const beads=new THREE.Group();for(let i=0;i<10;i++){const angle=-i*.055;const dot=new THREE.Mesh(new THREE.SphereGeometry(.012*(1-i/13),8,6),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.48*(1-i/12)}));dot.position.set(radius*Math.cos(angle),radius*Math.sin(angle),0);beads.add(dot)}orbiter.add(beads);
 moons.push({pivot,orbiter,body,phase:Math.random()*Math.PI*2,velocity:(.45+n*.07)*(n%2?-1:1)});updateCount();
}
function removeMoon(){const moon=moons.pop();if(moon){root.remove(moon.pivot);moon.pivot.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()})}updateCount()}
function updateCount(){document.querySelector('#count').textContent=String(moons.length).padStart(2,'0')+' / 08 MOONS';document.querySelector('#add').disabled=moons.length>=8;document.querySelector('#remove').disabled=moons.length===0;}
function reset(){while(moons.length)removeMoon();[palettes[0],palettes[1],palettes[2]].forEach(addMoon);root.rotation.set(.18,-.2,.09);speed=1;document.querySelector('#speed').value='1';document.querySelector('#speed-value').textContent='1.0×'}
document.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click',()=>{selected=+b.dataset.color;document.querySelectorAll('.swatch').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#color-name').textContent=names[selected]}));
document.querySelector('#add').addEventListener('click',()=>addMoon());document.querySelector('#remove').addEventListener('click',removeMoon);document.querySelector('#reset').addEventListener('click',reset);document.querySelector('#speed').addEventListener('input',e=>{speed=+e.target.value;document.querySelector('#speed-value').textContent=speed.toFixed(1)+'×'});
let dragging=false,lastX=0,lastY=0;host.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;host.setPointerCapture(e.pointerId)});host.addEventListener('pointermove',e=>{if(!dragging)return;root.rotation.y+=(e.clientX-lastX)*.008;root.rotation.x+=(e.clientY-lastY)*.008;lastX=e.clientX;lastY=e.clientY});host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('pointercancel',()=>dragging=false);
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=w<650?20:15.5;camera.position.x=w<650?0:1.0;camera.position.y=w<650?1.5:1.3;camera.setViewOffset(w,h,0,w<650? h*.06:0,w,h);camera.updateProjectionMatrix()};window.addEventListener('resize',resize);resize();reset();
let last=performance.now();function animate(now){requestAnimationFrame(animate);let dt=Math.min((now-last)/1000,.05);last=now;elapsed+=dt*speed;sun.rotation.y+=dt*.06;corona.scale.setScalar(1+Math.sin(now*.001)*.025);moons.forEach(m=>{m.orbiter.rotation.z=m.phase+elapsed*m.velocity;m.body.rotation.y+=dt*.3});stars.rotation.z+=dt*.001;renderer.render(scene,camera)}requestAnimationFrame(animate);
