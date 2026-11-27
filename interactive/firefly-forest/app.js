import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const container = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x152f29, .032);
const camera = new THREE.PerspectiveCamera(45, 1, .1, 180);
camera.position.set(0, 8, 25); camera.lookAt(0, 5, -12);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);
const ambient = new THREE.HemisphereLight(0x9ac7a0, 0x13211b, 1.1); scene.add(ambient);
const moonlight = new THREE.DirectionalLight(0xbce1b0, 1.4); moonlight.position.set(-4, 18, -18); scene.add(moonlight);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(220,220), new THREE.MeshLambertMaterial({color:0x142e22})); ground.rotation.x=-Math.PI/2; ground.position.y=-.2; scene.add(ground);
// Tall layered silhouettes frame a softly illuminated clearing.
const bark = new THREE.MeshLambertMaterial({color:0x142b20});
const canopy = new THREE.MeshLambertMaterial({color:0x1b3b28});
const treeGroup = new THREE.Group(); scene.add(treeGroup);
const random=(a,b)=>a+Math.random()*(b-a);
for(let i=0;i<110;i++){
  let z=random(-90,8), x=random(-70,70);
  if(z>-22 && Math.abs(x)<12) x += x<0?-12:12;
  const h=random(12,29), width=random(.2,.7);
  const tree=new THREE.Group(); tree.position.set(x,0,z); tree.rotation.z=random(-.04,.04);
  let trunk=new THREE.Mesh(new THREE.CylinderGeometry(width*.45,width,h,5),bark); trunk.position.y=h/2; tree.add(trunk);
  for(let j=0;j<3;j++){
    let crown=new THREE.Mesh(new THREE.ConeGeometry(random(2.1,4.1),random(7,11),6),canopy);
    crown.position.set(random(-1,1),h*.65+j*3,random(-.6,.6)); tree.add(crown);
  }
  treeGroup.add(tree);
}
// An emissive disk recedes into the forest haze.
const moon = new THREE.Mesh(new THREE.CircleGeometry(3.8,64), new THREE.MeshBasicMaterial({color:0xdde5af,transparent:true,opacity:.65})); moon.position.set(0,13,-78); scene.add(moon);
const moonHalo = new THREE.Mesh(new THREE.CircleGeometry(7,64), new THREE.MeshBasicMaterial({color:0xb6cba2,transparent:true,opacity:.07})); moonHalo.position.set(0,13,-78.1); scene.add(moonHalo);
// Luminous sprites use a canvas radial gradient; each has independent wandering motion.
const canvas=document.createElement('canvas'); canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d');const gradient=ctx.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(255,255,218,1)');gradient.addColorStop(.08,'rgba(239,255,172,.95)');gradient.addColorStop(.24,'rgba(202,245,106,.35)');gradient.addColorStop(1,'rgba(177,245,93,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
const sprite=new THREE.CanvasTexture(canvas);const flies=[];const flyGroup=new THREE.Group();scene.add(flyGroup);
let amount=80,glow=.7, attraction=null, lastPointer=0;
function makeFly(){const material=new THREE.SpriteMaterial({map:sprite,color:0xe3ff9e,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});const mesh=new THREE.Sprite(material);mesh.position.set(random(-17,17),random(.5,11),random(-35,8));flyGroup.add(mesh);return {mesh,base:mesh.position.clone(),phase:random(0,Math.PI*2),speed:random(.4,1),size:random(.55,1.3)};}
function setCount(n){while(flies.length<n)flies.push(makeFly());while(flies.length>n){let f=flies.pop();flyGroup.remove(f.mesh);f.mesh.material.dispose();}}
setCount(amount);
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),8),hit=new THREE.Vector3();
function point(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height)*2+1);raycaster.setFromCamera(pointer,camera);if(raycaster.ray.intersectPlane(plane,hit)){attraction=hit.clone();attraction.y=THREE.MathUtils.clamp(attraction.y,.5,13);lastPointer=performance.now();}}
renderer.domElement.addEventListener('pointermove',point);renderer.domElement.addEventListener('pointerdown',point);
const moods={dusk:{fog:0x152f29,ground:0x142e22,sky:0x94b48b,moon:0xdde5af},moon:{fog:0x152c39,ground:0x142b30,sky:0x829fbb,moon:0xd7e9ef},mist:{fog:0x405d4e,ground:0x2b4836,sky:0xb5cfad,moon:0xe0ebd4}};
function setMood(name){let m=moods[name];scene.background=new THREE.Color(m.fog);scene.fog.color.setHex(m.fog);ground.material.color.setHex(m.ground);ambient.color.setHex(m.sky);moon.material.color.setHex(m.moon);document.querySelectorAll('.mood').forEach(b=>{let selected=b.dataset.mood===name;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});}
setMood('dusk');document.querySelectorAll('.mood').forEach(b=>b.addEventListener('click',()=>setMood(b.dataset.mood)));
const count=document.querySelector('#count');count.addEventListener('input',()=>{amount=+count.value;document.querySelector('#countValue').value=count.value;setCount(amount);});
const glowInput=document.querySelector('#glow');glowInput.addEventListener('input',()=>{glow=+glowInput.value/100;document.querySelector('#glowValue').value=glowInput.value+'%';});
document.querySelector('#scatter').addEventListener('click',()=>{attraction=null;flies.forEach(f=>{f.base.set(random(-19,19),random(.5,12),random(-40,8));});});
// Quiet synthesized forest ambience starts only after an explicit user gesture.
let audio,osc,gain;const soundButton=document.querySelector('#sound');soundButton.addEventListener('click',async()=>{let first=!audio;if(!audio){audio=new AudioContext();osc=audio.createOscillator();gain=audio.createGain();const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=180;osc.type='sine';osc.frequency.value=65;gain.gain.value=.035;osc.connect(filter).connect(gain).connect(audio.destination);osc.start();}if(!first && audio.state==='running'){await audio.suspend();soundButton.setAttribute('aria-pressed','false');soundButton.querySelector('span').textContent='Sound off';}else{await audio.resume();soundButton.setAttribute('aria-pressed','true');soundButton.querySelector('span').textContent='Sound on';}});
function resize(){let w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}
window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);let t=clock.getElapsedTime();if(attraction&&performance.now()-lastPointer>2500)attraction=null;flies.forEach((f,i)=>{const p=f.mesh.position;const target=attraction&&i%3!==0?attraction:f.base;let offx=Math.sin(t*f.speed+f.phase)*1.5,offy=Math.sin(t*f.speed*.7+f.phase)*.8,offz=Math.cos(t*f.speed*.5+f.phase)*1.2;p.x+=(target.x+offx-p.x)*.012;p.y+=(target.y+offy-p.y)*.012;p.z+=(target.z+offz-p.z)*.012;let pulse=.45+.55*(.5+.5*Math.sin(t*2.1*f.speed+f.phase));f.mesh.material.opacity=pulse*(.35+glow*.65);let s=f.size*(.6+glow*.85);f.mesh.scale.set(s,s,1);});renderer.render(scene,camera);}animate();
