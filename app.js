import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const host = document.querySelector('#scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
camera.position.set(4.5, 3.6, 7.6); camera.lookAt(0, 1.42, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffe6c9, 0x302224, 2.2));
const key = new THREE.DirectionalLight(0xffd2a5, 3); key.position.set(-3, 7, 5); key.castShadow = true; key.shadow.mapSize.set(1024,1024); key.shadow.camera.left = key.shadow.camera.bottom = -5; key.shadow.camera.right = key.shadow.camera.top = 5; scene.add(key);
const rim = new THREE.DirectionalLight(0xffaf6e, 2); rim.position.set(4,4,-5); scene.add(rim);
const mat = (color, roughness=.65, metalness=0) => new THREE.MeshStandardMaterial({color, roughness, metalness});
const addMesh = (geo, material, parent, x=0,y=0,z=0) => { const m = new THREE.Mesh(geo, material); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m; };
const world = new THREE.Group(); scene.add(world);
// A low stone pedestal holds the object, with warm metallic inlay.
addMesh(new THREE.CylinderGeometry(2.25,2.38,.19,96),mat(0x745b4d,.9),world,0,-.02,0);
addMesh(new THREE.CylinderGeometry(2.20,2.25,.035,96),mat(0xad8d72,.8),world,0,.09,0);
const baseRing = addMesh(new THREE.TorusGeometry(2.02,.012,8,100),mat(0xc49b70,.4,.5),world,0,.114,0); baseRing.rotation.x=Math.PI/2;
const candle = new THREE.Group(); world.add(candle); candle.position.y=.12;
const vesselMaterial = mat(0xc2b09a,.8);
const body = addMesh(new THREE.CylinderGeometry(.83,.70,1.85,96,1,true),vesselMaterial,candle,0,1.02,0);
body.material.side=THREE.DoubleSide;
addMesh(new THREE.CylinderGeometry(.70,.70,.10,96),vesselMaterial,candle,0,.12,0);
const lip = addMesh(new THREE.TorusGeometry(.825,.037,16,96),vesselMaterial,candle,0,1.95,0); lip.rotation.x=Math.PI/2;
const inner = addMesh(new THREE.CylinderGeometry(.79,.69,1.78,96,1,true),mat(0x806e5e,.95),candle,0,1.03,0); inner.material.side=THREE.BackSide;
const waxMaterial=mat(0xeee0bd,.45);
const wax = addMesh(new THREE.CylinderGeometry(.79,.69,.1,96),waxMaterial,candle,0,.22,0);
const wick = addMesh(new THREE.CylinderGeometry(.027,.03,.23,12),mat(0x2b201c,.95),candle,0,.38,0); wick.rotation.z=.08; wick.visible=false;
// A small paper label makes the vessel feel like a made object.
const label = addMesh(new THREE.PlaneGeometry(.83,.50),mat(0xe4d3b8,.95),candle,0,1.03,.833); label.rotation.y=0;
const labelCanvas=document.createElement('canvas'); labelCanvas.width=512; labelCanvas.height=320;
const ctx=labelCanvas.getContext('2d'); ctx.fillStyle='#e4d3b8';ctx.fillRect(0,0,512,320);ctx.strokeStyle='#a99782';ctx.lineWidth=2;ctx.strokeRect(16,16,480,288);ctx.fillStyle='#574b40';ctx.textAlign='center';ctx.font='22px Georgia';ctx.fillText('✳',256,64);ctx.font='34px Georgia';ctx.fillText('STILL FLAME',256,135);ctx.font='15px sans-serif';ctx.letterSpacing='3px';ctx.fillText('A LITTLE MOMENT FOR YOU',256,177);ctx.fillText('HAND POURED  ·  220 G',256,235);
label.material.map=new THREE.CanvasTexture(labelCanvas); label.material.needsUpdate=true;
const flameGroup = new THREE.Group(); candle.add(flameGroup); flameGroup.position.y=2.17; flameGroup.visible=false;
const flamePoints=[new THREE.Vector2(0,0),new THREE.Vector2(.095,.04),new THREE.Vector2(.14,.16),new THREE.Vector2(.11,.31),new THREE.Vector2(.055,.45),new THREE.Vector2(0,.59)];
const flame = addMesh(new THREE.LatheGeometry(flamePoints,32),new THREE.MeshBasicMaterial({color:0xffb454,transparent:true,opacity:.9,side:THREE.DoubleSide}),flameGroup);
const core = addMesh(new THREE.SphereGeometry(.075,24,16),new THREE.MeshBasicMaterial({color:0xfff4bd}),flameGroup,0,.1,0); core.scale.y=1.7;
const glow = addMesh(new THREE.SphereGeometry(.40,24,16),new THREE.MeshBasicMaterial({color:0xffa447,transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false}),flameGroup,0,.23,0); glow.scale.y=1.4;
const flameLight=new THREE.PointLight(0xffa348,0,5); flameLight.position.set(0,2.5,.1); candle.add(flameLight);
// Wax stream appears during the pour.
const stream=addMesh(new THREE.CylinderGeometry(.035,.055,1.4,16),waxMaterial,candle,0,2.75,0); stream.visible=false;
const colors={vanilla:0xeee0bd,rose:0xcb9285,sage:0x9ba98d,honey:0xd6a45f};
const vessels={stone:{color:0xc2b09a,rough:.8,metal:0},amber:{color:0x875034,rough:.25,metal:.1},ink:{color:0x41433d,rough:.88,metal:0}};
let state='empty', fill=0, targetFill=0, glowAmount=1, dragging=false, prevX=0, angle=0, targetAngle=0, pourStart=0;
const action=document.querySelector('#action'), hint=document.querySelector('#stage-hint'), caption=document.querySelector('#action-caption');
function setAction(title,description,hintText){action.querySelector('span').textContent=title;caption.textContent=description;hint.textContent=hintText;}
function choose(button,selector){document.querySelectorAll(selector).forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
document.querySelectorAll('[data-vessel]').forEach(button=>button.addEventListener('click',()=>{choose(button,'[data-vessel]'); const v=vessels[button.dataset.vessel]; vesselMaterial.color.setHex(v.color);vesselMaterial.roughness=v.rough;vesselMaterial.metalness=v.metal;}));
document.querySelectorAll('[data-wax]').forEach(button=>button.addEventListener('click',()=>{choose(button,'[data-wax]');waxMaterial.color.setHex(colors[button.dataset.wax]);}));
const slider=document.querySelector('#flame-size');slider.addEventListener('input',()=>{glowAmount=Number(slider.value);document.querySelector('#glow-value').textContent=glowAmount<.9?'SOFT':glowAmount<1.2?'WARM':'BRIGHT';});
action.addEventListener('click',()=>{if(state==='empty'){state='pouring';targetFill=1;pourStart=performance.now();stream.visible=true;action.disabled=true;setAction('Pouring slowly…','GOOD THINGS TAKE THEIR TIME.','POURING WITH CARE');} else if(state==='poured'){state='lit';flameGroup.visible=true;flameLight.intensity=3;setAction('Blow out the flame','TAKE A BREATH. STAY A WHILE.','A LITTLE LIGHT, JUST FOR YOU');} else if(state==='lit'){state='poured';flameGroup.visible=false;flameLight.intensity=0;setAction('Light your candle','READY WHEN YOU ARE.','YOUR CANDLE IS READY');}});
document.querySelector('#reset').addEventListener('click',()=>{state='empty';fill=0;targetFill=0;stream.visible=false;flameGroup.visible=false;flameLight.intensity=0;wick.visible=false;action.disabled=false;setAction('Pour your candle','A SMALL ACT OF MAKING, JUST FOR YOU.','YOUR VESSEL IS READY');document.querySelector('[data-vessel="stone"]').click();document.querySelector('[data-wax="vanilla"]').click();slider.value=1;slider.dispatchEvent(new Event('input'));targetAngle=0;});
host.addEventListener('pointerdown',e=>{dragging=true;prevX=e.clientX;host.setPointerCapture(e.pointerId);});host.addEventListener('pointermove',e=>{if(dragging){targetAngle+=(e.clientX-prevX)*.012;prevX=e.clientX;}});host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('pointercancel',()=>dragging=false);
function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);}
new ResizeObserver(resize).observe(host); resize();
function animate(time){requestAnimationFrame(animate);if(state==='pouring'){fill=Math.min(targetFill,(time-pourStart)/2600);if(fill>=1){state='poured';stream.visible=false;wick.visible=true;action.disabled=false;setAction('Light your candle','YOUR CANDLE IS READY FOR ITS FIRST GLOW.','POURED WITH CARE');}}wax.position.y=.22+fill*1.58;wick.position.y=wax.position.y+.17;angle+=(targetAngle-angle)*.08;candle.rotation.y=angle;const flicker=1+Math.sin(time*.009)*.06+Math.sin(time*.023)*.035;flameGroup.scale.set(glowAmount*flicker,glowAmount*(2-flicker),glowAmount*flicker);if(state==='lit')flameLight.intensity=(2.5+Math.sin(time*.013)*.35)*glowAmount;renderer.render(scene,camera);}
requestAnimationFrame(animate);
