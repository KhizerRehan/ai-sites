import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const mount = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x100d1b);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
mount.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x100d1b, .045);
const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
camera.position.set(0, 4.2, 10.5); camera.lookAt(0, 1.1, 0);
const ambient = new THREE.AmbientLight(0x7d659e, 1.3); scene.add(ambient);
const key = new THREE.DirectionalLight(0xd2b2ff, 3); key.position.set(-3, 8, 5); scene.add(key);
const rim = new THREE.PointLight(0x8075ff, 100, 20); rim.position.set(4, 3, -2); scene.add(rim);
const fill = new THREE.PointLight(0xec92c9, 35, 15); fill.position.set(-5, 1, 3); scene.add(fill);
const group = new THREE.Group(); scene.add(group);
const base = new THREE.Group(); group.add(base);
const stoneMat = new THREE.MeshStandardMaterial({ color: 0x30283e, roughness: .9, flatShading: true });
for(let i=0;i<15;i++){
 const angle=i*2.4, radius=i===0?0:.3+Math.random()*1.5;
 const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(i===0?1.2:.28+Math.random()*.5,1),stoneMat);
 rock.position.set(Math.cos(angle)*radius,-.14+Math.random()*.13,Math.sin(angle)*radius); rock.scale.set(1.25,.29,1); base.add(rock);
}
const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.95,2.13,.23,48),new THREE.MeshStandardMaterial({color:0x211d2d,roughness:.65,metalness:.28}));pedestal.position.y=-.38; group.add(pedestal);
const trim=new THREE.Mesh(new THREE.TorusGeometry(2.02,.014,8,80),new THREE.MeshStandardMaterial({color:0xb9a0c1,metalness:.8,roughness:.3}));trim.rotation.x=Math.PI/2;trim.position.y=-.27;group.add(trim);
// Each triangle receives its own vertices so the mineral's faces catch light separately.
function crystalGeometry(){
 const vertices=[], colors=[]; const sides=6, ring=[];
 for(let i=0;i<sides;i++){const a=i*Math.PI*2/sides;ring.push([Math.cos(a),Math.sin(a)]);}
 function tri(a,b,c,shade){vertices.push(...a,...b,...c);for(let i=0;i<3;i++)colors.push(shade,shade,shade);}
 for(let i=0;i<sides;i++){let j=(i+1)%sides, a=ring[i],b=ring[j],s=.68+(i%3)*.13;
  tri([a[0],0,a[1]],[b[0],0,b[1]],[b[0],.73,b[1]],s);
  tri([a[0],0,a[1]],[b[0],.73,b[1]],[a[0],.73,a[1]],s);
  tri([a[0],.73,a[1]],[b[0],.73,b[1]],[0,1,0],Math.min(1,s+.18));
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();return geo;
}
const geo=crystalGeometry();
const palettes={amethyst:{color:0xa86de0,emissive:0x31104f},rose:{color:0xf4a3bd,emissive:0x501d35},aqua:{color:0x72dfd6,emissive:0x114646}};
let mineral='amethyst', targetGrowth=.75, crystals=[];
const crystalRoot=new THREE.Group();group.add(crystalRoot);
function createCluster(){
 for(const c of crystals){crystalRoot.remove(c.mesh);c.mesh.material.dispose();} crystals=[];
 const configs=[{x:0,z:0,h:2.9,r:.39}];
 for(let i=0;i<24;i++){let angle=i*2.399, radius=.34+Math.sqrt((i+1)/24)*1.4;configs.push({x:Math.cos(angle)*radius,z:Math.sin(angle)*radius,h:.55+Math.random()*1.85*(1-radius/3),r:.16+Math.random()*.18});}
 for(const c of configs){const p=palettes[mineral];const mat=new THREE.MeshPhysicalMaterial({color:p.color,emissive:p.emissive,emissiveIntensity:.4,metalness:.15,roughness:.22,clearcoat:1,clearcoatRoughness:.12,vertexColors:true,flatShading:true});
  const mesh=new THREE.Mesh(geo,mat);mesh.position.set(c.x,.03,c.z);mesh.rotation.z=(Math.random()-.5)*.20;mesh.rotation.x=(Math.random()-.5)*.20;mesh.rotation.y=Math.random()*Math.PI;mesh.scale.set(c.r,.01,c.r);crystalRoot.add(mesh);crystals.push({mesh,height:c.h,phase:Math.random()*.6});}
}
createCluster();
const pointsGeo=new THREE.BufferGeometry(), pos=[];for(let i=0;i<140;i++){let a=Math.random()*Math.PI*2,r=2+Math.random()*5;pos.push(Math.cos(a)*r,Math.random()*6-.5,Math.sin(a)*r);}pointsGeo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const dust=new THREE.Points(pointsGeo,new THREE.PointsMaterial({color:0xd9c3ff,size:.025,transparent:true,opacity:.7}));scene.add(dust);
const ground=new THREE.Mesh(new THREE.CircleGeometry(20,80),new THREE.MeshStandardMaterial({color:0x100d1b,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.52;scene.add(ground);
const lightSets={moon:[0xd2b2ff,0x8075ff,0xec92c9,0x100d1b],dusk:[0xffb1c8,0xb070a6,0xff8a6c,0x21131f],glow:[0xffe3a4,0xd39252,0xe8bd80,0x1c171c]};
document.querySelectorAll('.mineral').forEach(button=>button.addEventListener('click',()=>{mineral=button.dataset.mineral;document.querySelectorAll('.mineral').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button);});document.querySelector('#specimen').textContent=button.querySelector('b').textContent.toUpperCase();const p=palettes[mineral];crystals.forEach(c=>{c.mesh.material.color.setHex(p.color);c.mesh.material.emissive.setHex(p.emissive);});}));
document.querySelectorAll('[data-light]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-light]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button);});const c=lightSets[button.dataset.light];key.color.setHex(c[0]);rim.color.setHex(c[1]);fill.color.setHex(c[2]);renderer.setClearColor(c[3]);scene.fog.color.setHex(c[3]);}));
const growth=document.querySelector('#growth');growth.addEventListener('input',()=>{targetGrowth=+growth.value/100;document.querySelector('#growth-value').textContent=growth.value+'%';});document.querySelector('#grow').addEventListener('click',createCluster);
let dragging=false,lastX=0,lastY=0,rotY=0,rotX=0;
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;rotY+=(e.clientX-lastX)*.008;rotX=THREE.MathUtils.clamp(rotX+(e.clientY-lastY)*.004,-.35,.35);lastX=e.clientX;lastY=e.clientY;});
renderer.domElement.addEventListener('pointerup',()=>dragging=false);renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
function resize(){const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,w<700?4:4.2,w<700?11.5:10.5);camera.lookAt(0,1.1,0);camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();if(!dragging)rotY+=.0015;group.rotation.y+=(rotY-group.rotation.y)*.06;group.rotation.x+=(rotX-group.rotation.x)*.06;crystals.forEach(c=>{let desired=c.height*targetGrowth;c.mesh.scale.y+=(desired-c.mesh.scale.y)*.035;});dust.rotation.y=t*.015;dust.material.opacity=.48+Math.sin(t*.6)*.12;renderer.render(scene,camera);}animate();
