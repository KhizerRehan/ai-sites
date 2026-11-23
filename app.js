import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

const stage = document.querySelector('#stage');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x12535b, .045);
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
stage.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xb7fff0,0x173e4d,2));
const sun = new THREE.DirectionalLight(0xfff5d3,2.7); sun.position.set(-4,8,5); scene.add(sun);
const fill = new THREE.PointLight(0x37b9be,60,20); fill.position.set(4,3,-3); scene.add(fill);
const world = new THREE.Group(); scene.add(world);
const sandMat = new THREE.MeshStandardMaterial({color:0xd4c99a,roughness:1});
const island = new THREE.Mesh(new THREE.CylinderGeometry(3.85,3.45,.42,96,1),sandMat); island.position.y=-.28; world.add(island);
const floor = new THREE.Mesh(new THREE.CircleGeometry(3.8,96), new THREE.MeshStandardMaterial({color:0xdacfa4,roughness:1})); floor.rotation.x=-Math.PI/2; floor.position.y=-.065; world.add(floor);
// Scattered grains, stones, and tiny sea grasses give the miniature reef a lived-in floor.
const pebbleGeo = new THREE.SphereGeometry(1,7,5);
for(let i=0;i<160;i++){const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*3.7;const mat=new THREE.MeshStandardMaterial({color:[0xc2b58c,0xe9d9ad,0x809e85][i%3],roughness:1});const p=new THREE.Mesh(pebbleGeo,mat);p.position.set(Math.cos(a)*r,-.04,Math.sin(a)*r);p.scale.setScalar(.015+Math.random()*.045);p.scale.y*=.38;world.add(p)}
for(let i=0;i<28;i++){const a=Math.random()*6.28,r=2.1+Math.random()*1.4;const g=new THREE.Group();g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);for(let j=0;j<3;j++){const blade=new THREE.Mesh(new THREE.ConeGeometry(.025,.28+Math.random()*.2,5),new THREE.MeshStandardMaterial({color:0x4d9e83,roughness:.9}));blade.position.set((j-1)*.04,.15,0);blade.rotation.z=(j-1)*.22;g.add(blade)}world.add(g)}
const particles=[];const particleGeo=new THREE.SphereGeometry(.018,8,6);const particleMat=new THREE.MeshBasicMaterial({color:0xc2fff2,transparent:true,opacity:.55});
for(let i=0;i<80;i++){let p=new THREE.Mesh(particleGeo,particleMat);p.position.set((Math.random()-.5)*11,Math.random()*6,(Math.random()-.5)*8);p.userData={speed:.004+Math.random()*.01,phase:Math.random()*6};scene.add(p);particles.push(p)}
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),corals=[];
let type='branch',color='#ff806f',growth=.7,light=0, angle=0, dragStart=null, moved=false;
const colors=['#ff806f','#f9c366','#c49af0','#7ad5c4','#f28cb7'];
const count=document.querySelector('#count');
function material(hex){return new THREE.MeshStandardMaterial({color:hex,roughness:.55,metalness:.02})}
function segment(group,a,b,r1,r2,mat){const d=new THREE.Vector3().subVectors(b,a);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,d.length(),7),mat);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());group.add(mesh);const tip=new THREE.Mesh(new THREE.SphereGeometry(r2,7,5),mat);tip.position.copy(b);group.add(tip)}
function branch(group,mat){function grow(start,dir,len,r,depth){const end=start.clone().add(dir.clone().multiplyScalar(len));segment(group,start,end,r,Math.max(.025,r*.7),mat);if(depth<=0)return;const n=depth===3?3:2;for(let i=0;i<n;i++){let next=dir.clone().add(new THREE.Vector3((Math.random()-.5)*1.05,.12,(Math.random()-.5)*1.05)).normalize();grow(end,next,len*(.68+Math.random()*.1),r*.68,depth-1)}}grow(new THREE.Vector3(),new THREE.Vector3(0,1,0),.48,.09,3)}
function fan(group,mat){const root=new THREE.Vector3(0,0,0);segment(group,root,new THREE.Vector3(0,.34,0),.07,.05,mat);for(let i=0;i<11;i++){let theta=(i-5)*.17;let start=new THREE.Vector3(0,.27,0);let end=new THREE.Vector3(Math.sin(theta)*1.0,.35+Math.cos(theta)*1.05,Math.sin(i*2)*.09);segment(group,start,end,.035,.018,mat);for(let j=1;j<4;j++){let pos=start.clone().lerp(end,j/4);let dir=i<5?-1:1;let tip=pos.clone().add(new THREE.Vector3(dir*.14,.16,.03));segment(group,pos,tip,.014,.008,mat)}}}
function bloom(group,mat){const base=new THREE.Mesh(new THREE.SphereGeometry(.24,14,10),mat);base.scale.set(1,.6,1);base.position.y=.1;group.add(base);for(let i=0;i<16;i++){let a=i*2.399,r=.12+Math.sqrt(i/16)*.38;let shape=new THREE.Mesh(new THREE.SphereGeometry(.1+Math.random()*.08,10,8),mat);shape.scale.set(.8,1.8,.8);shape.position.set(Math.cos(a)*r,.22+Math.random()*.12,Math.sin(a)*r);shape.rotation.z=Math.cos(a)*-.25;shape.rotation.x=Math.sin(a)*.25;group.add(shape)}}
function plant(x,z,chosenType=type,chosenColor=color,size=growth){const g=new THREE.Group();const mat=material(chosenColor);if(chosenType==='branch')branch(g,mat);else if(chosenType==='fan')fan(g,mat);else bloom(g,mat);g.position.set(x,0,z);g.rotation.y=Math.random()*6.28;g.userData={target:.6+size*.75,phase:Math.random()*6};g.scale.setScalar(.001);world.add(g);corals.push(g);updateCount()}
function updateCount(){count.textContent=`${String(corals.length).padStart(2,'0')} CORAL${corals.length===1?'':'S'} GROWING`}
function removeLast(){const g=corals.pop();if(!g)return false;world.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()});updateCount();return true}
function randomSpot(){let a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*2.8;return [Math.cos(a)*r,Math.sin(a)*r]}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2200)}
plant(-1.15,-.25,'branch','#ff806f',.85);plant(.5,-.85,'fan','#c49af0',.8);plant(.75,.8,'bloom','#f9c366',.7);
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,5.6,w<600?12.8:10.5);camera.lookAt(0,.4,0);camera.updateProjectionMatrix()};window.addEventListener('resize',resize);resize();
function getFloorPoint(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height)*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObject(floor)[0];return hit?world.worldToLocal(hit.point.clone()):null}
renderer.domElement.addEventListener('pointerdown',e=>{dragStart={x:e.clientX,y:e.clientY,angle};moved=false;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!dragStart)return;const dx=e.clientX-dragStart.x;if(Math.abs(dx)>7||Math.abs(e.clientY-dragStart.y)>7)moved=true;if(moved)angle=dragStart.angle+dx*.007});
renderer.domElement.addEventListener('pointerup',e=>{if(!dragStart)return;if(!moved){const p=getFloorPoint(e);if(p){plant(p.x,p.z);toast('A little wonder is growing');}else toast('Tap the sandy ocean floor to plant')}dragStart=null});
renderer.domElement.addEventListener('pointercancel',()=>dragStart=null);
for(const btn of document.querySelectorAll('.species-btn'))btn.addEventListener('click',()=>{type=btn.dataset.type;document.querySelectorAll('.species-btn').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',b===btn)})});
for(const btn of document.querySelectorAll('.swatch'))btn.addEventListener('click',()=>{color=btn.dataset.color;document.querySelectorAll('.swatch').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',b===btn)})});
const slider=document.querySelector('#growth');slider.addEventListener('input',()=>{growth=slider.value/100;document.querySelector('#growth-value').textContent=slider.value+'%';const percent=(slider.value-35)/65*100;slider.style.background=`linear-gradient(90deg,#a6e1c8 0 ${percent}%,#7caaa36a ${percent}%)`});
document.querySelector('#surprise').addEventListener('click',()=>{const [x,z]=randomSpot();plant(x,z,['branch','fan','bloom'][Math.floor(Math.random()*3)],colors[Math.floor(Math.random()*colors.length)],.45+Math.random()*.55);toast('A surprise for your reef')});
document.querySelector('#undo').addEventListener('click',()=>toast(removeLast()?'Last coral removed':'Your reef is already clear'));
document.querySelector('#clear').addEventListener('click',()=>{while(corals.length)removeLast();toast('A fresh start for your reef')});
document.querySelector('#light').addEventListener('click',e=>{light=(light+1)%3;const settings=[['SHALLOWS',0x12535b,1.2],['GOLDEN HOUR',0x77544a,1.05],['DEEP BLUE',0x073e65,.85]][light];scene.fog.color.setHex(settings[1]);renderer.toneMappingExposure=settings[2];sun.color.setHex([0xfff5d3,0xffb483,0x8abfff][light]);e.currentTarget.querySelector('span').textContent='LIGHT: '+settings[0]});
const modal=document.querySelector('#modal');document.querySelector('#help').addEventListener('click',()=>{modal.hidden=false;document.querySelector('#close').focus()});function closeModal(){modal.hidden=true;document.querySelector('#help').focus()}document.querySelector('#close').addEventListener('click',closeModal);document.querySelector('#start').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});
let frame=0;function animate(){requestAnimationFrame(animate);frame++;world.rotation.y+=(angle-world.rotation.y)*.06;corals.forEach((g,i)=>{let target=g.userData.target;let s=THREE.MathUtils.lerp(g.scale.x,target,.035);g.scale.setScalar(s);g.rotation.z=Math.sin(frame*.012+g.userData.phase)*.014});particles.forEach(p=>{p.position.y+=p.userData.speed;p.position.x+=Math.sin(frame*.012+p.userData.phase)*.001;if(p.position.y>6)p.position.y=0});renderer.render(scene,camera)}animate();
