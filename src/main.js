import './style.css';
import './motion.css';
import './readability.css';
import './story.css';
import { story } from './story.js';
import './motion.js';
import './approach.js';
import * as THREE from 'three';
import { profile } from '../site.config.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
if (!reduced.matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const contact = document.querySelector('.contact .button');
if (profile.email) {
  contact.href = `mailto:${profile.email}`;
  contact.removeAttribute('target');
  contact.textContent = "Let's build something together";
  document.querySelector('.email-placeholder').textContent = profile.email;
}
document.querySelectorAll('.project').forEach((el, index) => {
  const project = profile.projects[index];
  el.querySelector('h3').textContent = project.title;
  el.querySelector('p').textContent = project.description;
  if (project.url) {
    const link = document.createElement('a');
    link.href = project.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = `VISIT ${project.title.toUpperCase()}`;
    link.setAttribute('aria-label', `Visit ${project.title} (opens in a new tab)`);
    el.querySelector('.project-placeholder').replaceChildren(link);
  }
});
if (!profile.email) contact.href = profile.linkedin;

const canvas = document.querySelector('#scene');
try {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setClearColor(0x080b10, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0, 0, 10.8);
  scene.add(new THREE.AmbientLight(0xe6d5c1, 1.6));
  const key = new THREE.DirectionalLight(0xffdfbd, 4); key.position.set(-3, 5, 5); scene.add(key);
  const rim = new THREE.PointLight(0xc47841, 65); rim.position.set(3, -2, 2); scene.add(rim);
  const cool = new THREE.DirectionalLight(0x9db7d4, 2); cool.position.set(4, 1, -3); scene.add(cool);
  const sculpture = new THREE.Group(); scene.add(sculpture);
  sculpture.rotation.set(.28, -.28, -.35);
  const copper = new THREE.MeshStandardMaterial({ color: 0xb78056, metalness: .82, roughness: .28 });
  const pale = new THREE.MeshStandardMaterial({ color: 0xe6d6bf, metalness: .65, roughness: .25 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x202932, metalness: .8, roughness: .35 });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.87, 1), dark); sculpture.add(core);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(core.geometry), new THREE.LineBasicMaterial({ color: 0xcfaa7f, transparent: true, opacity: .7 })); core.add(wire);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(.36, 0), pale); sculpture.add(inner);
  const rings = [];
  [{r:1.42,t:.025,x:1.1,y:.3,z:.2},{r:1.85,t:.052,x:.18,y:.6,z:0},{r:2.21,t:.016,x:1.3,y:-.4,z:.25},{r:2.5,t:.033,x:.55,y:.6,z:-.3}].forEach((spec,i)=>{
    const group = new THREE.Group(); group.rotation.set(spec.x,spec.y,spec.z);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.r,spec.t,12,180), i%2 ? pale : copper); group.add(ring);
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(i%2?.095:.065,16,16), pale); satellite.position.set(spec.r,0,0); group.add(satellite);
    if (i===1) {
      for(let j=0;j<72;j++){
        const tick = new THREE.Mesh(new THREE.BoxGeometry(.013,j%6===0?.1:.045,.012),copper);
        const a=j/72*Math.PI*2; tick.position.set(Math.cos(a)*(spec.r+.12),Math.sin(a)*(spec.r+.12),0); tick.rotation.z=a-Math.PI/2; group.add(tick);
      }
    }
    sculpture.add(group); rings.push(group);
  });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(2.83,.003,4,160),new THREE.MeshBasicMaterial({color:0x65717c,transparent:true,opacity:.3}));halo.rotation.x=.5;sculpture.add(halo);
  // Three distinct exhibits, animated together at the same chapter boundaries as the copy.
  const systems = new THREE.Group();
  const agents = new THREE.Group();
  scene.add(systems, agents);
  const blue = new THREE.MeshStandardMaterial({color:0x477b98,metalness:.65,roughness:.3});
  const violet = new THREE.MeshStandardMaterial({color:0x9370df,emissive:0x442080,emissiveIntensity:.7,metalness:.5,roughness:.3});
  const modules = [];
  for(let i=0;i<5;i++){
    const module = new THREE.Mesh(new THREE.BoxGeometry(2.3,.28,1.6),i%2?blue:pale);
    module.position.set(i%2?.45:-.25,(i-2)*.8,0);
    module.add(new THREE.LineSegments(new THREE.EdgesGeometry(module.geometry),new THREE.LineBasicMaterial({color:0xb2e1f4})));
    systems.add(module);modules.push(module);
  }
  const systemPath = new THREE.BufferGeometry().setFromPoints(modules.map(m=>m.position.clone()));
  systems.add(new THREE.Line(systemPath,new THREE.LineBasicMaterial({color:0xe0a679})));
  const nodePositions = [new THREE.Vector3(0,0,0)];
  const signalPaths = [];
  for(let i=0;i<14;i++){
    const angle=i/14*Math.PI*2;
    const position=new THREE.Vector3(Math.cos(angle)*(i%2?2.25:1.5),Math.sin(angle)*(i%2?2.25:1.5),Math.sin(i*2)*.9);
    nodePositions.push(position);
    const start=new THREE.Vector3(0,0,0);
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([start,position]),new THREE.LineBasicMaterial({color:0x8279b9,transparent:true,opacity:.6}));agents.add(line);
    const signal=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),new THREE.MeshBasicMaterial({color:0xf4d7ad}));agents.add(signal);signalPaths.push({signal,end:position});
  }
  nodePositions.forEach((position,i)=>{
    const node=new THREE.Mesh(new THREE.IcosahedronGeometry(i===0?.58:.15,1),i===0?pale:violet);node.position.copy(position);agents.add(node);
  });
  systems.scale.setScalar(.001);agents.scale.setScalar(.001);
  let exhibit = 0;
  let previousTime = 0;
  const positions = new Float32Array(150*3);
  for(let i=0;i<positions.length;i++) positions[i]=(Math.random()-.5)*11;
  const pointsGeo = new THREE.BufferGeometry();pointsGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  scene.add(new THREE.Points(pointsGeo,new THREE.PointsMaterial({color:0xc4b29a,size:.016,transparent:true,opacity:.45})));
  let px=0,py=0,scroll=0,visible=true;
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(canvas);resize();
  window.addEventListener('pointermove',e=>{px=(e.clientX/innerWidth-.5)*.25;py=(e.clientY/innerHeight-.5)*.18;},{passive:true});
  window.addEventListener('scroll',()=>{scroll=Math.min(window.scrollY/innerHeight,1.3);},{passive:true});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;}).observe(canvas);
  const clock = new THREE.Clock();let frame;
  function draw(){frame=requestAnimationFrame(draw);if(!visible||document.hidden)return;const t=clock.getElapsedTime();
    const dt=Math.min(.05,t-previousTime);previousTime=t;
    const target=story.enabled&&!reduced.matches?story.chapter:0;
    const blend=1-Math.exp(-dt*10);
    [sculpture,systems,agents].forEach((group,i)=>{
      const size=THREE.MathUtils.lerp(group.scale.x,i===target?1:.001,blend);
      group.scale.setScalar(size);
      group.visible=size>.005;
    });
    if(target!==exhibit){
      const caption=document.querySelector('.scene-caption');
      caption.textContent=['THE POSSIBILITY ENGINE / FIG. 001','CONNECTED SYSTEMS / FIG. 002','AGENT NETWORK / FIG. 003'][target];
      document.querySelector('.observatory').setAttribute('aria-label',['Orbital sculpture representing possibility','Exploded architectural stack of connected software modules','Connected AI agent network with moving signals'][target]);
      exhibit=target;
    }
    if(!reduced.matches){
      if (story.enabled) scroll = story.progress * 2;
      sculpture.rotation.y= -.28 + t*.055 + px + scroll*.85;
      sculpture.rotation.x=.28+py+scroll*.35;
      sculpture.position.y=Math.sin(t*.6)*.06+scroll*.18;
      core.rotation.y=t*.12;
      rings.forEach((ring,i)=>{
        ring.position.z=scroll*(i-1.5)*.4;
        ring.rotation.z=(i%2?-1:1)*t*(.035+i*.015)+scroll*(i-1.5)*.18;
      });
      camera.position.z=THREE.MathUtils.lerp(camera.position.z,target===0?10.8:11,blend);
      systems.rotation.set(.3+Math.sin(t*.4)*.05,-.5+t*.12,.12);
      modules.forEach((module,i)=>{module.rotation.y=Math.sin(t*1.5+i)*.1;});
      agents.rotation.set(.1,Math.sin(t*.3)*.35,t*.08);
      signalPaths.forEach(({signal,end},i)=>{signal.position.copy(end).multiplyScalar((t*.65+i*.17)%1);});
    }
    renderer.render(scene,camera);
  }draw();
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);document.documentElement.classList.add('no-webgl');});
} catch(error) { document.documentElement.classList.add('no-webgl'); console.warn('3D scene unavailable; showing static artwork.'); }
