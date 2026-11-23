const scene=document.querySelector('.experience'), burger=document.querySelector('#burger'),range=document.querySelector('#range'),toggle=document.querySelector('#toggle'),nav=document.querySelector('#ingredientNav');
const layers=[
 {name:'Sesame brioche',text:'A golden crown with a little crunch.',clip:'0 0 75% 0',shift:26},
 {name:'Red onion',text:'A crisp, bright bite between the layers.',clip:'22% 0 65% 0',shift:21},
 {name:'Melted cheddar',text:'Golden cheddar, folded over the patty.',clip:'33% 0 53% 0',shift:16},
 {name:'Chargrilled beef',text:'A generous patty with a beautiful sear.',clip:'44% 0 39% 0',shift:12},
 {name:'Tomato',text:'Juicy slices bring a little brightness.',clip:'59% 0 28% 0',shift:8},
 {name:'Lettuce',text:'A fresh, crisp finish to the stack.',clip:'68% 0 15% 0',shift:4},
 {name:'Brioche base',text:'The golden foundation of a good bite.',clip:'83% 0 0 0',shift:0}
];
layers.forEach((layer,i)=>{const el=document.createElement('div');el.className='layer';el.style.clipPath=`inset(${layer.clip})`;el.style.setProperty('--shift',layer.shift);burger.append(el);const btn=document.createElement('button');btn.textContent=layer.name;btn.addEventListener('click',()=>select(i));btn.addEventListener('focus',()=>select(i));btn.addEventListener('mouseenter',()=>select(i));nav.append(btn)});
function select(i){const l=layers[i];document.querySelector('#detailIndex').textContent='INSIDE THE STACK';document.querySelector('#detailTitle').textContent=l.name;document.querySelector('#detailText').textContent=l.text;document.querySelector('#mobileCaption').textContent=l.name+' — '+l.text;document.querySelectorAll('.layer').forEach((el,n)=>el.classList.toggle('selected',n===i))}
function update(value){value=Math.max(0,Math.min(100,value));range.value=value;burger.style.setProperty('--open',value/100);scene.classList.toggle('is-open',value>70);toggle.firstChild.textContent=value>50?'Stack it back ':'Explore layers ';document.querySelector('#dragLabel').style.opacity=value>60?'0':'1'}
range.addEventListener('input',()=>update(+range.value));toggle.addEventListener('click',()=>update(+range.value>50?0:100));let startY,startValue;
burger.addEventListener('pointerdown',e=>{startY=e.clientY;startValue=+range.value;burger.setPointerCapture(e.pointerId)});burger.addEventListener('pointermove',e=>{if(startY===undefined)return;update(startValue+(startY-e.clientY)/Math.max(100,burger.clientHeight*.35)*100)});burger.addEventListener('pointerup',()=>{startY=undefined});burger.addEventListener('pointercancel',()=>{startY=undefined});update(0);
