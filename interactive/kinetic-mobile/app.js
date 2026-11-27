import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const host=document.querySelector('#canvas');
const scene=new THREE.Scene();
const camera=new THREE.OrthographicCamera(-3,3,3,-3,.1,100);
camera.position.set(5,3.3,10); camera.lookAt(0,0,0);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x858b73,2));
const light=new THREE.DirectionalLight(0xfff6e4,3);light.position.set(-4,7,8);light.castShadow=true;scene.add(light);
const fill=new THREE.DirectionalLight(0xe6f2eb,1.2);fill.position.set(5,1,-5);scene.add(fill);
const root=new THREE.Group();scene.add(root);
const hanging=new THREE.Group();root.add(hanging);
const wireMat=new THREE.MeshStandardMaterial({color:0x39483e,metalness:.5,roughness:.4});
const palettes={terra:['#b54e32','#28473b','#dfb356','#e8dbc1'],marine:['#2e6e80','#8cbeb6','#edbd79','#eae3d0'],mono:['#26352e','#9daa98','#e8e2d2','#607264'],orchard:['#a5445a','#e7ad70','#6d7a4e','#eedbbf']};
let config={form:'balance',palette:'terra',finish:'matte',breeze:32,paused:false};
let tiers=[], materials=[], sculpture; let time=0, targetAngle=0, angle=0, last=performance.now();
function line(a,b,r=.012,mat=wireMat){const d=new THREE.Vector3().subVectors(b,a);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),8),mat);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return mesh}
function makeMaterial(color){let p={color,roughness:.78,metalness:.08};if(config.finish==='metal'){p.roughness=.23;p.metalness=.8}if(config.finish==='porcelain'){p.roughness=.22;p.metalness=.05}const mat=new THREE.MeshStandardMaterial(p);materials.push(mat);return mat}
function disk(radius,mat){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.065,48),mat);mesh.rotation.x=Math.PI/2;return mesh}
function crescent(mat){const shape=new THREE.Shape();shape.absarc(0,0,.47,-Math.PI/2,Math.PI/2,true);shape.absarc(.19,0,.36,Math.PI/2,-Math.PI/2,false);const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:2,curveSegments:40}),mat);mesh.position.z=-.035;return mesh}
function capsule(mat){const mesh=new THREE.Mesh(new THREE.CapsuleGeometry(.16,.55,8,24),mat);mesh.rotation.z=-.35;return mesh}
function triangle(mat){const sh=new THREE.Shape();sh.moveTo(0,.5);sh.lineTo(-.43,-.35);sh.lineTo(.43,-.35);sh.closePath();const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.07,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:3}),mat);mesh.position.z=-.035;return mesh}
function object(type,color,scale=1){let mat=makeMaterial(color),m;if(type==='disc')m=disk(.38,mat);if(type==='moon')m=crescent(mat);if(type==='pill')m=capsule(mat);if(type==='triangle')m=triangle(mat);if(type==='ball')m=new THREE.Mesh(new THREE.SphereGeometry(.27,32,20),mat);if(type==='ring'){m=new THREE.Mesh(new THREE.TorusGeometry(.34,.075,16,48),mat)}m.scale.setScalar(scale);m.castShadow=true;return m}
const recipes={balance:[['disc','moon'],['pill','ball'],['ring','disc']],arc:[['moon','disc'],['ring','triangle'],['disc','pill']],play:[['triangle','ball'],['disc','ring'],['moon','pill']]};
function rebuild(){if(sculpture){hanging.remove(sculpture);sculpture.traverse(o=>{if(o.geometry)o.geometry.dispose()});materials.forEach(m=>m.dispose())}materials=[];tiers=[];sculpture=new THREE.Group();hanging.add(sculpture);const colors=palettes[config.palette];const recipesNow=recipes[config.form];
// The top suspension and three individually pivoting balanced crossbars.
sculpture.add(line(new THREE.Vector3(0,3.05,0),new THREE.Vector3(0,2.1,0),.009));
for(let i=0;i<3;i++){const pivot=new THREE.Group();pivot.position.y=2.1-i*1.27; sculpture.add(pivot);tiers.push(pivot);const width=1.52-i*.18;pivot.add(line(new THREE.Vector3(-width,0,0),new THREE.Vector3(width,0,0),.018));const center=new THREE.Mesh(new THREE.SphereGeometry(.05,16,12),wireMat);pivot.add(center);
for(let side=0;side<2;side++){const x=side===0?-width:width;const drop=.38+((i+side)%2)*.17;pivot.add(line(new THREE.Vector3(x,0,0),new THREE.Vector3(x,-drop,0),.009));const piece=object(recipesNow[i][side],colors[(i*2+side)%colors.length],i===0?1.02:.82);piece.position.set(x,-drop-.35,0);pivot.add(piece);}
if(i<2) sculpture.add(line(new THREE.Vector3(0,2.1-i*1.27,0),new THREE.Vector3(0,2.1-(i+1)*1.27,0),.008));}
}
rebuild();
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);const aspect=w/h;const size=3.9;camera.left=-size*aspect/2;camera.right=size*aspect/2;camera.top=size/2;camera.bottom=-size/2; // fit the tall sculpture with comfortable margin
const vsize=6.45;camera.left=-vsize*aspect/2;camera.right=vsize*aspect/2;camera.top=vsize/2;camera.bottom=-vsize/2;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(host);resize();
let dragging=false,startX=0;host.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;host.setPointerCapture(e.pointerId)});host.addEventListener('pointermove',e=>{if(!dragging)return;targetAngle+=(e.clientX-startX)*.012;startX=e.clientX});host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('pointercancel',()=>dragging=false);
function animate(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!config.paused)time+=dt;const strength=config.breeze/100;angle+=(targetAngle-angle)*.06;root.rotation.y=angle;hanging.rotation.z=Math.sin(time*.45)*(.012+strength*.09);tiers.forEach((tier,i)=>{tier.rotation.y=Math.sin(time*(.35+i*.11)+i*1.7)*(.14+strength*.55)+i*.55;tier.rotation.z=Math.sin(time*(.6+i*.12)+i)*(.012+strength*.035)});renderer.render(scene,camera);requestAnimationFrame(animate)}requestAnimationFrame(animate);
function selectButtons(selector,key,value){document.querySelectorAll(selector).forEach(b=>{const active=b.dataset[key]===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}
function setForm(value){config.form=value;selectButtons('[data-form]','form',value);document.querySelector('#form-name').textContent=value.toUpperCase();document.querySelector('#caption b').textContent=String(Object.keys(recipes).indexOf(value)+1).padStart(2,'0');rebuild()}
function setPalette(value){config.palette=value;selectButtons('[data-palette]','palette',value);document.querySelector('#palette-name').textContent=value.toUpperCase();rebuild()}
document.querySelectorAll('[data-form]').forEach(b=>b.addEventListener('click',()=>setForm(b.dataset.form)));document.querySelectorAll('[data-palette]').forEach(b=>b.addEventListener('click',()=>setPalette(b.dataset.palette)));
document.querySelector('#finish').addEventListener('change',e=>{config.finish=e.target.value;rebuild()});document.querySelector('#breeze').addEventListener('input',e=>{config.breeze=+e.target.value;document.querySelector('#breeze-value').textContent=config.breeze===0?'STILL':config.breeze<40?'GENTLE':config.breeze<75?'BREEZY':'WILD'});
document.querySelector('#pause').addEventListener('click',e=>{config.paused=!config.paused;e.currentTarget.textContent=config.paused?'Resume motion':'Pause motion';e.currentTarget.setAttribute('aria-pressed',String(config.paused))});
document.querySelector('#shuffle').addEventListener('click',()=>{const forms=Object.keys(recipes),colors=Object.keys(palettes);setForm(forms[Math.floor(Math.random()*forms.length)]);setPalette(colors[Math.floor(Math.random()*colors.length)]);targetAngle+=Math.PI*.7});
