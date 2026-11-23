import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const container = document.querySelector('#scene');
const vessel = document.querySelector('#vessel');
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x101c25, 1);
container.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-5,5,5,-5,.1,100);
camera.position.z = 20;
const count = 14000;
const positions = new Float32Array(count*3), colors = new Float32Array(count*3), sizes = new Float32Array(count), alphas = new Float32Array(count);
const velocities = new Float32Array(count*3), ages = new Float32Array(count), lives = new Float32Array(count), phases = new Float32Array(count);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
geometry.setAttribute('color',new THREE.BufferAttribute(colors,3).setUsage(THREE.DynamicDrawUsage));
geometry.setAttribute('size',new THREE.BufferAttribute(sizes,1).setUsage(THREE.DynamicDrawUsage));
geometry.setAttribute('alpha',new THREE.BufferAttribute(alphas,1).setUsage(THREE.DynamicDrawUsage));
const material = new THREE.ShaderMaterial({transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, vertexColors:true, uniforms:{pixelRatio:{value:renderer.getPixelRatio()}}, vertexShader:`attribute float size; attribute float alpha; varying vec3 vColor; varying float vAlpha; uniform float pixelRatio; void main(){vColor=color;vAlpha=alpha;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*pixelRatio;gl_Position=projectionMatrix*mvPosition;}`, fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5)*2.;float soft=pow(max(0.,1.-d),2.3);gl_FragColor=vec4(vColor,soft*vAlpha);}`});
const particles = new THREE.Points(geometry,material);scene.add(particles);
let cursor=0, pigment=new THREE.Color('#4f67e9'), flow=.38, amount=2, paused=false, time=0;
function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);const aspect=w/h;camera.left=-5*aspect;camera.right=5*aspect;camera.top=5;camera.bottom=-5;camera.updateProjectionMatrix()}
window.addEventListener('resize',resize);resize();
function burst(x,y,scale=1){const n=Math.floor((160+amount*95)*scale);for(let i=0;i<n;i++){const k=cursor++%count,j=k*3;const a=Math.random()*Math.PI*2,r=Math.pow(Math.random(),1.8)*.24;positions[j]=x+Math.cos(a)*r;positions[j+1]=y+Math.sin(a)*r;positions[j+2]=(Math.random()-.5)*.5;const speed=.015+Math.random()*.11;velocities[j]=Math.cos(a)*speed;velocities[j+1]=Math.sin(a)*speed-.04-Math.random()*.05;velocities[j+2]=0;const c=pigment.clone().multiplyScalar(.7+Math.random()*.5);colors[j]=c.r;colors[j+1]=c.g;colors[j+2]=c.b;sizes[k]=18+Math.random()*35;ages[k]=0;lives[k]=7+Math.random()*8;phases[k]=Math.random()*10;alphas[k]=.12+Math.random()*.16}geometry.attributes.color.needsUpdate=true;document.querySelector('#hint').classList.add('hidden')}
function point(event){const rect=vessel.getBoundingClientRect();return {x:((event.clientX-rect.left)/rect.width*2-1)*camera.right,y:(1-(event.clientY-rect.top)/rect.height*2)*camera.top}}
let drawing=false,last=0;vessel.addEventListener('pointerdown',e=>{drawing=true;vessel.setPointerCapture(e.pointerId);const p=point(e);burst(p.x,p.y);last=performance.now()});vessel.addEventListener('pointermove',e=>{if(!drawing)return;if(performance.now()-last>55){const p=point(e);burst(p.x,p.y,.32);last=performance.now()}});vessel.addEventListener('pointerup',()=>drawing=false);vessel.addEventListener('pointercancel',()=>drawing=false);vessel.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();burst(0,0)}});
document.querySelectorAll('.swatch').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.swatch').forEach(el=>{el.classList.remove('selected');el.setAttribute('aria-pressed','false')});button.classList.add('selected');button.setAttribute('aria-pressed','true');pigment.set(button.dataset.color);document.querySelector('#colour-name').textContent=button.dataset.name}));
document.querySelector('#flow').addEventListener('input',e=>{flow=Number(e.target.value)/100;document.querySelector('#flow-value').textContent=flow<.2?'STILL':flow<.65?'GENTLE':'FLOWING'});
document.querySelector('#amount').addEventListener('input',e=>{amount=Number(e.target.value);document.querySelector('#amount-value').textContent=['','SMALL','MEDIUM','LARGE'][amount]});
document.querySelector('#drop').addEventListener('click',()=>burst((Math.random()-.5)*camera.right*.6,1));
document.querySelector('#clear').addEventListener('click',()=>{lives.fill(0);alphas.fill(0);geometry.attributes.alpha.needsUpdate=true;document.querySelector('#hint').classList.remove('hidden')});
document.querySelector('#pause').addEventListener('click',e=>{paused=!paused;e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.innerHTML=paused?'▶ &nbsp; Resume motion':'Ⅱ &nbsp; Pause motion'});
let previous=performance.now();function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-previous)/1000,.04);previous=now;if(!paused){time+=dt;for(let k=0;k<count;k++){if(lives[k]<=0)continue;ages[k]+=dt;if(ages[k]>=lives[k]){lives[k]=0;alphas[k]=0;continue}const j=k*3,age=ages[k],f=age/lives[k];const swirl=Math.sin(positions[j+1]*1.2+time*.5+phases[k])*.024*flow;positions[j]+=(velocities[j]+swirl+Math.sin(time*.2+positions[j+1])*.025*flow)*dt;positions[j+1]+=(velocities[j+1]+Math.cos(time*.3+positions[j])*flow*.018)*dt;velocities[j]*=.999;velocities[j+1]*=.999;sizes[k]+=dt*(1.4+flow);alphas[k]=Math.sin(Math.PI*Math.min(f*1.5,1))*.15*(1-f*.35)}for(const key of ['position','size','alpha'])geometry.attributes[key].needsUpdate=true}renderer.render(scene,camera)}
// A small opening bloom shows the material before the first gesture.
burst(-.8,.8,1.2);pigment.set('#f07880');burst(.3,.4,.8);pigment.set('#4f67e9');document.querySelector('#hint').classList.remove('hidden');requestAnimationFrame(animate);
