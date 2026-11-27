import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const wrap = document.querySelector('#canvas-wrap');
const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, preserveDrawingBuffer: true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-4.8, 4.8, 4.8, -4.8, .1, 30);
camera.position.set(0, 10, .01); camera.lookAt(0, 0, 0);
scene.add(new THREE.HemisphereLight(0xffecd3, 0x3c3156, 2.1));
const sun = new THREE.DirectionalLight(0xffe1b5, 2.3); sun.position.set(-4, 8, 5); scene.add(sun);

// Layered physical tray provides depth while the canvas texture holds every grain.
const tray = new THREE.Group(); scene.add(tray);
const cyl = (radius, height, y, color, metalness = 0, roughness = .8) => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 128), new THREE.MeshStandardMaterial({color, metalness, roughness}));
  mesh.position.y = y; tray.add(mesh); return mesh;
};
cyl(3.74, .20, -.20, 0x3a282a); cyl(3.68, .12, -.08, 0x916b55, .3, .5); cyl(3.56, .08, -.005, 0x2c2531); cyl(3.50, .05, .025, 0xcfad7b);
const rim = new THREE.Mesh(new THREE.TorusGeometry(3.59, .028, 12, 160), new THREE.MeshStandardMaterial({color:0xf1d39e, metalness:.7, roughness:.35})); rim.rotation.x = Math.PI / 2; rim.position.y=.08; tray.add(rim);

const size=1024, mid=size/2, radius=492;
const sand=document.createElement('canvas'); sand.width=sand.height=size; const ctx=sand.getContext('2d');
const texture=new THREE.CanvasTexture(sand); texture.colorSpace=THREE.SRGBColorSpace; texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
const surface=new THREE.Mesh(new THREE.CircleGeometry(3.48, 128), new THREE.MeshStandardMaterial({map:texture, roughness:1})); surface.rotation.x=-Math.PI/2; surface.position.y=.057; tray.add(surface);
function baseSand(){
  ctx.clearRect(0,0,size,size);
  const grad=ctx.createRadialGradient(mid,mid,30,mid,mid,mid); grad.addColorStop(0,'#d1ad80');grad.addColorStop(.75,'#b88e68');grad.addColorStop(1,'#987250'); ctx.fillStyle=grad;ctx.fillRect(0,0,size,size);
  for(let i=0;i<32000;i++){const x=Math.random()*size,y=Math.random()*size,light=Math.random()>.5;ctx.fillStyle=light?'rgba(255,232,187,.14)':'rgba(75,42,40,.13)';ctx.fillRect(x,y,Math.random()*1.7+.3,Math.random()*1.7+.3)}
  texture.needsUpdate=true;
}
baseSand(); const blank=ctx.getImageData(0,0,size,size);
let color='#edbb62', folds=8, flow=2, drawing=false, last=null, grains=0, history=[];
function grain(x,y,c,spread=1){for(let i=0;i<spread;i++){const a=Math.random()*Math.PI*2,r=Math.random()*(flow*1.8);ctx.fillStyle=c;ctx.globalAlpha=.55+Math.random()*.45;ctx.beginPath();ctx.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,.55+Math.random()*1.4,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;grains+=spread;}
function point(x,y,c=color){
  const dx=x-mid, dy=y-mid;
  for(let i=0;i<folds;i++){const a=i*Math.PI*2/folds,co=Math.cos(a),si=Math.sin(a);for(const sign of [1,-1]){const xx=dx*co-sign*dy*si,yy=dx*si+sign*dy*co;grain(mid+xx,mid+yy,c,flow+1)}}
}
function stroke(a,b){const dist=Math.hypot(b.x-a.x,b.y-a.y), steps=Math.max(1,Math.ceil(dist/2));for(let i=0;i<=steps;i++){const t=i/steps;point(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t)}texture.needsUpdate=true;document.querySelector('#grain-count').textContent=`${grains.toLocaleString()} GRAINS PLACED`;}
// A small opening motif invites interaction without prescribing the finished work.
function initialMotif(){
  const savedFlow=flow; flow=1;
  for(let j=0;j<3;j++){let r=45+j*34;for(let a=0;a<Math.PI*2;a+=.012)grain(mid+Math.cos(a)*r,mid+Math.sin(a)*r,['#f7d695','#ef9293','#e8d5ae'][j],1)}
  for(let i=0;i<8;i++){let a=i*Math.PI/4;for(let t=0;t<1;t+=.01){let r=160+Math.sin(t*Math.PI)*55,ang=a+(t-.5)*.35;grain(mid+Math.cos(ang)*r,mid+Math.sin(ang)*r,'#e9c384',1)}}
  flow=savedFlow;grains=0;texture.needsUpdate=true;
} initialMotif();
const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2(), plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.057), hit=new THREE.Vector3();
function coordinates(e){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height)*2+1);raycaster.setFromCamera(pointer,camera);if(!raycaster.ray.intersectPlane(plane,hit)||Math.hypot(hit.x,hit.z)>3.46)return null;return{x:mid+hit.x/3.48*radius,y:mid+hit.z/3.48*radius};}
canvas.addEventListener('pointerdown',e=>{const p=coordinates(e);if(!p)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);history.push({image:ctx.getImageData(0,0,size,size),grains});if(history.length>12)history.shift();drawing=true;last=p;stroke(p,p);document.querySelector('#hint').classList.add('hidden')});
canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=coordinates(e);if(p){stroke(last||p,p);last=p}else last=null});
function end(){drawing=false;last=null}canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
document.querySelectorAll('.swatch').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.swatch').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')});button.classList.add('selected');button.setAttribute('aria-pressed','true');color=button.dataset.color;document.querySelector('#color-name').textContent=button.dataset.name}));
document.querySelector('#symmetry').addEventListener('input',e=>{folds=+e.target.value;document.querySelector('#sym-value').value=folds});
document.querySelector('#size').addEventListener('input',e=>{flow=+e.target.value;document.querySelector('#size-value').textContent=['','DELICATE','MEDIUM','GENEROUS'][flow]});
document.querySelector('#undo').addEventListener('click',()=>{const previous=history.pop();if(previous){ctx.putImageData(previous.image,0,0);grains=previous.grains;texture.needsUpdate=true;document.querySelector('#grain-count').textContent=`${grains.toLocaleString()} GRAINS PLACED`}});
document.querySelector('#clear').addEventListener('click',()=>{history.push({image:ctx.getImageData(0,0,size,size),grains});if(history.length>12)history.shift();ctx.putImageData(blank,0,0);grains=0;texture.needsUpdate=true;document.querySelector('#grain-count').textContent='0 GRAINS PLACED';document.querySelector('#hint').classList.remove('hidden')});
document.querySelector('#save').addEventListener('click',()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='still-sand-mandala.png';a.href=canvas.toDataURL('image/png');a.click()});
function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;renderer.setSize(w,h,false);const aspect=w/h;camera.left=-4.5*aspect;camera.right=4.5*aspect;camera.top=4.5;camera.bottom=-4.5;camera.updateProjectionMatrix()};window.addEventListener('resize',resize);resize();
function animate(t){requestAnimationFrame(animate);sun.intensity=2.1+Math.sin(t*.0004)*.18;renderer.render(scene,camera)}animate(0);
