import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const sceneEl = document.querySelector('#scene');
const glass = document.querySelector('#glass');
const ctx = glass.getContext('2d');
const rainInput = document.querySelector('#rain');
const rainValue = document.querySelector('#rain-value');
const hint = document.querySelector('#hint');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#253e50');
scene.fog = new THREE.FogExp2('#344d5a', .025);
const camera = new THREE.PerspectiveCamera(44, 1, .1, 250);
camera.position.set(0, 9, 38); camera.lookAt(0, 6, -10);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
sceneEl.prepend(renderer.domElement);
const ambient = new THREE.AmbientLight(0x98b4bc, 1.5); scene.add(ambient);
const moon = new THREE.DirectionalLight(0xc9d8dd, 1.6); moon.position.set(-10,20,15);scene.add(moon);
const city = new THREE.Group();scene.add(city);
const buildingMats = ['#263a43','#30434a','#34454a','#283943'].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}));
const litMat = new THREE.MeshBasicMaterial({color:'#e5bd85'});
const dimMat = new THREE.MeshBasicMaterial({color:'#607479'});
let seed=404;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
// Layers of quiet buildings and small warm windows form a dimensional city beyond the glass.
for(let row=0;row<4;row++){
 let x=-42;
 while(x<43){
  const w=3+rand()*4.8, h=5+rand()*13+(row===3?4:0), d=2+rand()*2;
  const z=-row*8-3;
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), buildingMats[Math.floor(rand()*buildingMats.length)]);
  mesh.position.set(x+w/2,h/2-2,z);city.add(mesh);
  if(rand()>.5){const cap=new THREE.Mesh(new THREE.BoxGeometry(w*.45,.25,d*.8),buildingMats[0]);cap.position.set(x+w/2,h-1.9,z);city.add(cap)}
  for(let wx=x+.65;wx<x+w-.4;wx+=.95){for(let wy=0;wy<h-2;wy+=1.25){if(rand()>.38){const windowMesh=new THREE.Mesh(new THREE.PlaneGeometry(.34,.55),rand()>.35?litMat:dimMat);windowMesh.position.set(wx,wy-1,z+d/2+.012);city.add(windowMesh)}}}
  x+=w+.35+rand()*1.5;
 }
}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(150,150),new THREE.MeshStandardMaterial({color:'#1d3039',roughness:.5}));ground.rotation.x=-Math.PI/2;ground.position.y=-2.1;scene.add(ground);
const rainGeo=new THREE.BufferGeometry();const count=1400;const rainPositions=new Float32Array(count*6);const drops=[];
for(let i=0;i<count;i++){drops.push({x:(rand()-.5)*105,y:rand()*50,z:-rand()*50, speed:.15+rand()*.3});}
rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));
const rainLines=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xb6d4d7,transparent:true,opacity:.28}));scene.add(rainLines);
const palettes={blue:{bg:'#253e50',fog:'#344d5a',ambient:0x98b4bc,lit:'#e5bd85',rain:0xb6d4d7},amber:{bg:'#755563',fog:'#9a7370',ambient:0xe9b2a0,lit:'#ffe0a8',rain:0xf2c6ba},night:{bg:'#101b30',fog:'#203549',ambient:0x718eb8,lit:'#d7b986',rain:0x9ab6d8}};
document.querySelectorAll('.light').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.light').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');const p=palettes[button.dataset.light];scene.background.set(p.bg);scene.fog.color.set(p.fog);ambient.color.setHex(p.ambient);litMat.color.set(p.lit);rainLines.material.color.setHex(p.rain)}));
let density=55;rainInput.addEventListener('input',()=>{density=+rainInput.value;rainValue.textContent=density<25?'DRIZZLE':density<70?'STEADY':'DOWNPOUR'});
let width,height,dpr;let pointerDown=false,lastX=0,lastY=0,hasWiped=false;
function resize(){width=sceneEl.clientWidth;height=sceneEl.clientHeight;dpr=Math.min(devicePixelRatio,2);renderer.setSize(width,height);camera.aspect=width/height;camera.position.z=width<750?52:38;camera.updateProjectionMatrix();glass.width=width*dpr;glass.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);mist()}
function mist(){ctx.fillStyle='rgba(169,193,191,.13)';ctx.fillRect(0,0,width,height);for(let i=0;i<Math.min(800,width*height/1000);i++)droplet()}
function droplet(){const x=Math.random()*width,y=Math.random()*height,r=.4+Math.random()*1.8;ctx.fillStyle=`rgba(217,235,231,${.08+Math.random()*.22})`;ctx.beginPath();ctx.ellipse(x,y,r,r*(1.2+Math.random()*2),0,0,Math.PI*2);ctx.fill();if(r>1.4){ctx.strokeStyle='rgba(224,242,234,.08)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-1,y+5+Math.random()*30);ctx.stroke()}}
function wipe(x,y){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=38;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.beginPath();ctx.moveTo(lastX,lastY);ctx.lineTo(x,y);ctx.stroke();ctx.restore();lastX=x;lastY=y}
glass.addEventListener('pointerdown',e=>{pointerDown=true;glass.setPointerCapture(e.pointerId);lastX=e.offsetX;lastY=e.offsetY;wipe(lastX+.01,lastY);if(!hasWiped){hasWiped=true;hint.classList.add('hidden')}});
glass.addEventListener('pointermove',e=>{if(pointerDown)wipe(e.offsetX,e.offsetY)});glass.addEventListener('pointerup',()=>pointerDown=false);glass.addEventListener('pointercancel',()=>pointerDown=false);
document.querySelector('#clear').addEventListener('click',()=>{ctx.clearRect(0,0,width,height);hint.classList.add('hidden')});
window.addEventListener('resize',resize);resize();let last=0;
function animate(time){requestAnimationFrame(animate);const delta=Math.min((time-last)/16.67,3)||1;last=time;const pos=rainGeo.attributes.position.array;for(let i=0;i<count;i++){const p=drops[i];p.y-=p.speed*delta*(reduced?.25:1);if(p.y<-3){p.y=47;p.x=(Math.random()-.5)*105}const j=i*6;pos[j]=p.x;pos[j+1]=p.y;pos[j+2]=p.z;pos[j+3]=p.x+.08;pos[j+4]=p.y+.65;pos[j+5]=p.z;}rainGeo.attributes.position.needsUpdate=true;rainGeo.setDrawRange(0,Math.floor(count*(.1+density/110))*2);renderer.render(scene,camera);if(Math.random()<.7)for(let i=0;i<Math.ceil(density/20);i++)droplet()}
requestAnimationFrame(animate);
