import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const mount = document.querySelector('#stage');
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, .1, 100);
camera.position.set(0, 0, 9.5);
const world = new THREE.Group(); scene.add(world);
const presets = [
 {name:'Terra', description:'A blue world with a wild heart.', deep:'#102d56', water:'#367e91', land:'#87ac80', high:'#d4d1a1', air:'#77cfe8', ring:'#d2d6b0', seed:2.3},
 {name:'Ember', description:'Where mountains glow after dark.', deep:'#4d2135', water:'#973d3c', land:'#df8455', high:'#ffdd9a', air:'#ff9472', ring:'#edb182', seed:8.8},
 {name:'Glacier', description:'An endless quiet, written in ice.', deep:'#254472', water:'#6aa9c1', land:'#b5e1df', high:'#f1ffff', air:'#9feaff', ring:'#b6e9f3', seed:5.1},
 {name:'Nebula', description:'A daydream at the edge of night.', deep:'#302053', water:'#6c4c9a', land:'#b178ad', high:'#f1b8d0', air:'#c19aff', ring:'#d8a8e5', seed:12.7}
];
const uniforms={uDeep:{value:new THREE.Color()},uWater:{value:new THREE.Color()},uLand:{value:new THREE.Color()},uHigh:{value:new THREE.Color()},uSeed:{value:0},uTerrain:{value:.58},uTime:{value:0}};
const surface = new THREE.ShaderMaterial({uniforms,vertexShader:`varying vec3 vPos; varying vec3 vNormal; void main(){vPos=position; vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
fragmentShader:`varying vec3 vPos; varying vec3 vNormal; uniform vec3 uDeep,uWater,uLand,uHigh; uniform float uSeed,uTerrain,uTime;
float hash(vec3 p){p=fract(p*.3183099+vec3(.13,.17,.19));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.04+vec3(2.3,1.2,3.7);a*=.5;}return n;}
void main(){vec3 p=normalize(vPos);float n=fbm(p*3.1+uSeed);float threshold=mix(.66,.34,uTerrain);float land=smoothstep(threshold-.025,threshold+.025,n);vec3 col=mix(uDeep,uWater,smoothstep(.25,.68,n));col=mix(col,mix(uLand,uHigh,smoothstep(threshold+.06,threshold+.23,n)),land);float ice=smoothstep(.73,.94,abs(p.y)+noise(p*8.)*.14);col=mix(col,uHigh,ice*.62);float clouds=smoothstep(.59,.7,fbm(p*6.+vec3(uTime*.009,2.,0.)));col=mix(col,vec3(.94,.98,1.),clouds*.42);float light=max(dot(normalize(vNormal),normalize(vec3(-.65,.45,1.))),0.);float rim=pow(1.-max(vNormal.z,0.),3.);col*=.23+.85*light;col+=vec3(.11,.20,.27)*rim;gl_FragColor=vec4(col,1.);}`});
const planet = new THREE.Mesh(new THREE.SphereGeometry(2,128,96),surface); world.add(planet);
const atmosphereUniforms={uColor:{value:new THREE.Color()},uStrength:{value:.7}};
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2.15,96,64),new THREE.ShaderMaterial({uniforms:atmosphereUniforms,transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,vertexShader:`varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform vec3 uColor;uniform float uStrength;varying vec3 vNormal;void main(){float glow=pow(max(.7-abs(vNormal.z),0.),2.3);gl_FragColor=vec4(uColor,glow*uStrength);}`}));world.add(atmosphere);
const ringCanvas=document.createElement('canvas');ringCanvas.width=512;ringCanvas.height=1;const ctx=ringCanvas.getContext('2d');const grad=ctx.createLinearGradient(0,0,512,0);[[0,'rgba(255,255,255,0)'],[.08,'rgba(255,255,255,.05)'],[.16,'rgba(255,255,255,.42)'],[.22,'rgba(255,255,255,.13)'],[.32,'rgba(255,255,255,.5)'],[.39,'rgba(255,255,255,.16)'],[.49,'rgba(255,255,255,.4)'],[.54,'rgba(255,255,255,.07)'],[.62,'rgba(255,255,255,.36)'],[.73,'rgba(255,255,255,.12)'],[.82,'rgba(255,255,255,.28)'],[1,'rgba(255,255,255,0)']].forEach(([p,c])=>grad.addColorStop(p,c));ctx.fillStyle=grad;ctx.fillRect(0,0,512,1);
const ringGeo=new THREE.RingGeometry(2.55,3.5,160);const pos=ringGeo.attributes.position,uv=ringGeo.attributes.uv;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);uv.setXY(i,(Math.sqrt(x*x+y*y)-2.55)/.95,.5)}
const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(ringCanvas),color:0xffffff,side:THREE.DoubleSide,transparent:true,depthWrite:false,opacity:.85}));ring.rotation.x=1.23;ring.rotation.y=-.2;ring.rotation.z=-.15;world.add(ring);
const starsGeo=new THREE.BufferGeometry();const stars=[];for(let i=0;i<1500;i++){let x=(Math.random()-.5)*65,y=(Math.random()-.5)*40,z=-10-Math.random()*30;stars.push(x,y,z)}starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));const starsMesh=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xb4d4ff,size:.035,transparent:true,opacity:.72}));scene.add(starsMesh);
let active=0,speed=.45,dragging=false,lastX=0,lastY=0;const $=s=>document.querySelector(s);
function selectPreset(index){active=index;const p=presets[index];uniforms.uDeep.value.set(p.deep);uniforms.uWater.value.set(p.water);uniforms.uLand.value.set(p.land);uniforms.uHigh.value.set(p.high);uniforms.uSeed.value=p.seed;atmosphereUniforms.uColor.value.set(p.air);ring.material.color.set(p.ring);$('#planet-name').innerHTML=`${p.name} <i>0${index+1}</i>`;$('#planet-description').textContent=p.description;$('#world-number').textContent=`0${index+1} / 04`;document.querySelectorAll('.preset').forEach((el,i)=>{el.classList.toggle('active',i===index);el.setAttribute('aria-pressed',String(i===index))})}
function setSlider(id,value){const input=$('#'+id);input.value=value;input.dispatchEvent(new Event('input'))}
document.querySelectorAll('.preset').forEach(btn=>btn.addEventListener('click',()=>selectPreset(Number(btn.dataset.preset))));
$('#terrain').addEventListener('input',e=>{uniforms.uTerrain.value=e.target.value/100;$('#terrain-value').textContent=e.target.value+'%'});
$('#atmosphere').addEventListener('input',e=>{atmosphereUniforms.uStrength.value=e.target.value/100;$('#atmosphere-value').textContent=e.target.value+'%'});
$('#speed').addEventListener('input',e=>{speed=e.target.value/100;$('#speed-value').textContent=e.target.value+'%'});
$('#rings').addEventListener('click',e=>{ring.visible=!ring.visible;e.currentTarget.classList.toggle('on',ring.visible);e.currentTarget.setAttribute('aria-checked',String(ring.visible))});
$('#random').addEventListener('click',()=>{selectPreset((active+1+Math.floor(Math.random()*3))%4);uniforms.uSeed.value=Math.random()*30;setSlider('terrain',Math.round(20+Math.random()*70));setSlider('atmosphere',Math.round(30+Math.random()*70));setSlider('speed',Math.round(15+Math.random()*65));});
$('#reset').addEventListener('click',()=>{selectPreset(0);setSlider('terrain',58);setSlider('atmosphere',70);setSlider('speed',45);world.rotation.set(0,0,0);camera.position.z=9.5;if(!ring.visible)$('#rings').click()});
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;world.rotation.y+=(e.clientX-lastX)*.008;world.rotation.x+=(e.clientY-lastY)*.008;world.rotation.x=Math.max(-1.2,Math.min(1.2,world.rotation.x));lastX=e.clientX;lastY=e.clientY});
renderer.domElement.addEventListener('pointerup',()=>dragging=false);renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();camera.position.z=Math.max(7,Math.min(14,camera.position.z+e.deltaY*.004))},{passive:false});
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.position.x=innerWidth<800?0:.1;camera.updateProjectionMatrix();world.scale.setScalar(innerWidth<800?.86:1)}window.addEventListener('resize',resize);resize();selectPreset(0);
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const delta=Math.min(clock.getDelta(),.05);uniforms.uTime.value+=delta;planet.rotation.y+=delta*speed*.12;starsMesh.rotation.z+=delta*.0005;renderer.render(scene,camera)}animate();
