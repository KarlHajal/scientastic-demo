import * as THREE from './vendor/three/three.module.min.mjs';
import { headContour, tongueGeometry, tongueBounds } from './anatomy-geometry.mjs';

function shape(commands) {
  const result = new THREE.Shape();
  for (const [command, ...p] of commands) {
    if (command === 'M') result.moveTo(...p);
    else if (command === 'L') result.lineTo(...p);
    else if (command === 'C') result.bezierCurveTo(...p);
    else if (command === 'Q') result.quadraticCurveTo(...p);
    else if (command === 'Z') result.closePath();
  }
  return result;
}

function extrusion(commands, depth) {
  return new THREE.ExtrudeGeometry(shape(commands), { depth, bevelEnabled: true, bevelSize: 1.2, bevelThickness: .8, bevelSegments: 2, curveSegments: 20, steps: 1 });
}

/** Render a procedural 3D teaching model; it contains no measured patient geometry. */
export class AnatomyScene {
  constructor({ host, settings, part, simulation, sounding, motion, view, onTongue, onCamera, t }) {
    Object.assign(this, { host, settings: { ...settings }, part, simulation, sounding, motion, onTongue, onCamera, t });
    this.view = { yaw: .28, tilt: .04, zoom: 1, ...view };
    this.disposed = false;
    this.start = performance.now();
    this.events = new AbortController();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    try {
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.05;
      this.canvas = this.renderer.domElement;
      this.canvas.className = 'anatomy-canvas';
      this.canvas.tabIndex = 0;
      this.canvas.setAttribute('role', 'img');
      this.canvas.setAttribute('aria-label', t('sceneAlt'));
      this.canvas.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight ArrowUp ArrowDown Home');
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(35, 1, .05, 50);
      this.target = new THREE.Vector3(simulation ? .45 : .15, simulation ? .65 : 0, 0);
      this.content = new THREE.Group();
      this.content.scale.set(.01, -.01, .01);
      this.content.position.set(-3.1, 2.7, 0);
      this.scene.add(this.content);
      this.scene.add(new THREE.HemisphereLight('#ffffff', '#a0acb7', 1.5));
      const key = new THREE.DirectionalLight('#fff4e9', 2.2);
      key.position.set(-3, 5, 7); this.scene.add(key);
      const rim = new THREE.DirectionalLight('#d7edf5', 1.4);
      rim.position.set(4, 1, -3); this.scene.add(rim);
      this.build();
      this.bind();
      this.host.append(this.canvas);
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(host);
      this.resize();
      this.update({ settings, part, sounding, motion });
      this.host.dataset.scene = 'ready';
      const fallback = host.querySelector('.scene-fallback');
      if (fallback) fallback.hidden = true;
    } catch (error) {
      this.dispose();
      throw error;
    }
  }

  material(color, opacity = 1) {
    return new THREE.MeshStandardMaterial({ color, roughness: .6, metalness: 0, transparent: opacity < 1, opacity, depthWrite: opacity === 1, side: THREE.DoubleSide });
  }

  solid(commands, z, depth, color, part, opacity = 1) {
    const mesh = new THREE.Mesh(extrusion(commands, depth), this.material(color, opacity));
    mesh.position.z = z; mesh.userData.part = part;
    this.content.add(mesh); return mesh;
  }

  ellipsoid(x, y, z, scale, color, part) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), this.material(color));
    mesh.position.set(x, y, z); mesh.scale.set(...scale); mesh.userData.part = part;
    this.content.add(mesh); return mesh;
  }

  tube(points, radius, color) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, radius, 12, false), this.material(color));
    this.content.add(mesh); return mesh;
  }

  build() {
    this.solid(headContour, -40, 52, '#dfb79c', null, .85);
    this.solid([['M',278,178],['C',291,130,347,111,417,129],['L',449,157],['Q',391,154,340,166],['L',302,188],['Z']], 14, 14, '#fff4df');
    this.solid([['M',280,188],['L',281,280],['L',296,295],['L',285,341],['L',264,341],['L',264,279],['L',259,213],['Z']], 12, 18, '#fff0d9');
    this.solid([['M',277,186],['Q',357,157,450,182],['L',451,216],['Q',393,275,276,246],['Z']], 14, 16, '#fff5e3');
    this.solid([['M',285,185],['Q',365,156,446,180],['L',443,189],['Q',369,174,290,199],['Z']], 32, 8, '#eadfc6');
    this.solid([['M',291,257],['Q',359,290,432,251],['L',441,234],['Q',369,265,294,248],['Z']], 30, 14, '#eadfc6');
    this.tongue = this.solid(tongueGeometry(this.settings).commands, 34, 22, '#bd7270', 'tongue');
    this.tongueKey = '';
    this.handle = this.ellipsoid(370, 215, 70, [8,8,8], '#007ba3', 'tongue');
    this.handle.visible = this.simulation;
    this.solid([['M',255,299],['Q',274,290,299,299],['L',294,332],['Q',274,345,256,331],['Z']], 10, 16, '#b59bc4', 'folds');
    this.folds = [this.ellipsoid(267,316,35,[4,11,5],'#75568b','folds'),this.ellipsoid(287,316,35,[4,11,5],'#75568b','folds')];
    this.lungs = [this.ellipsoid(229,434,1,[43,56,29],'#7fa697','lungs'),this.ellipsoid(325,434,1,[43,56,29],'#7fa697','lungs')];
    this.lungs.forEach((lung)=>{lung.visible=!this.simulation;});
    this.tube([[276,339,0],[276,380,0],[276,425,0]], 10, '#d8cbb3');
    for (let y = 345; y <= 414; y += 12) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(11,1.5,8,28), this.material('#b7a88e'));
      ring.rotation.x = Math.PI/2; ring.position.set(276,y,0); this.content.add(ring);
    }
    this.tube([[276,413,5],[251,437,12],[225,459,16]], 3, '#709889').visible=!this.simulation;
    this.tube([[276,413,5],[303,437,12],[331,459,16]], 3, '#709889').visible=!this.simulation;
    this.ellipsoid(437,190,43,[5,8,7],'#fffdf3','tongue');
    this.ellipsoid(436,227,43,[5,7,7],'#fffdf3','tongue');
    this.ellipsoid(459,193,23,[7,4,16],'#b96768','tongue');
    this.ellipsoid(457,212,23,[7,4,16],'#b96768','tongue');
    const flow = new THREE.CatmullRomCurve3([[276,458,40],[276,345,43],[276,285,43],[274,220,47],[300,182,53],[370,174,56],[465,201,53]].map((p)=>new THREE.Vector3(...p)));
    this.flow = flow;
    this.particles = Array.from({length:12},()=>this.ellipsoid(0,0,0,[2.4,2.4,2.4],'#3094aa'));
    this.particles.forEach((particle,i)=>particle.position.copy(flow.getPointAt(i/this.particles.length)));
  }

  /** Apply the same illustrative tongue controls as the section and sound model. */
  update({ settings = this.settings, part = this.part, sounding = this.sounding, motion = this.motion } = {}) {
    if (this.disposed) return;
    Object.assign(this, { settings:{...settings}, part, sounding, motion });
    const tongue = tongueGeometry(settings), key = `${tongue.x}:${tongue.y}`;
    if (key !== this.tongueKey) {
      this.tongue.geometry.dispose(); this.tongue.geometry = extrusion(tongue.commands,22); this.tongueKey = key;
      this.handle.position.set(tongue.x,tongue.y,70);
    }
    const accent = getComputedStyle(this.host).getPropertyValue('--action').trim();
    this.handle.material.color.set(accent || '#007ba3');
    this.content.traverse((mesh) => {
      if (!mesh.isMesh || !mesh.userData.part) return;
      mesh.material.emissive.set(mesh.userData.part === part ? '#302016' : '#000000');
      mesh.material.emissiveIntensity = .08;
    });
    this.draw();
    if (!this.frame && this.active()) this.frame = requestAnimationFrame((time)=>this.tick(time));
  }

  active() { return !document.hidden && this.motion && (!this.simulation || this.sounding); }

  tick(time) {
    this.frame = null;
    if (this.disposed) return;
    const phase = (time-this.start)/1000;
    const breathing = 1 + .025*Math.sin(phase*2);
    this.lungs.forEach((lung)=>lung.scale.set(43*breathing,56*breathing,29));
    const vibration = !this.simulation || this.settings.voiced ? .8 + .2*Math.sin(phase*23) : 1;
    this.folds.forEach((fold)=>fold.scale.x = 4*vibration);
    this.particles.forEach((particle,i)=>particle.position.copy(this.flow.getPointAt((phase*.2+i/this.particles.length)%1)));
    this.draw();
    if (this.active()) this.frame=requestAnimationFrame((next)=>this.tick(next));
  }

  draw() {
    if (this.disposed) return;
    const distance=(this.simulation?5.1:8.3)/this.view.zoom, {yaw,tilt}=this.view;
    this.camera.position.copy(this.target).add(new THREE.Vector3(Math.sin(yaw)*Math.cos(tilt)*distance,Math.sin(tilt)*distance,Math.cos(yaw)*Math.cos(tilt)*distance));
    this.camera.lookAt(this.target);
    this.renderer.render(this.scene,this.camera);
  }

  resize() {
    if (this.disposed) return;
    const width=Math.max(1,this.host.clientWidth),height=Math.max(1,this.host.clientHeight);
    this.renderer.setSize(width,height,false); this.camera.aspect=width/height; this.camera.updateProjectionMatrix(); this.draw();
  }

  /** Restore the initial camera without changing speech controls. */
  resetView() {
    this.view={yaw:.28,tilt:.04,zoom:1}; this.onCamera({...this.view}); this.draw();
  }

  ray(event) {
    const bounds=this.canvas.getBoundingClientRect();
    const ray=new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2((event.clientX-bounds.left)/bounds.width*2-1,1-(event.clientY-bounds.top)/bounds.height*2),this.camera);
    return ray;
  }

  bind() {
    const options={signal:this.events.signal};
    this.canvas.addEventListener('pointerdown',(event)=>{
      if(event.button!==0)return;
      this.canvas.focus({preventScroll:true}); this.canvas.setPointerCapture(event.pointerId);
      const tongue=this.simulation && this.ray(event).intersectObject(this.handle).length>0;
      this.drag={mode:tongue?'tongue':'orbit',x:event.clientX,y:event.clientY,yaw:this.view.yaw,tilt:this.view.tilt};
    },options);
    this.canvas.addEventListener('pointermove',(event)=>{
      if(!this.drag || !this.canvas.hasPointerCapture(event.pointerId))return;
      if(this.drag.mode==='tongue'){
        this.content.updateWorldMatrix(true,false);
        const point=this.content.localToWorld(new THREE.Vector3(0,0,70));
        const normal=new THREE.Vector3(0,0,1).transformDirection(this.content.matrixWorld);
        const hit=this.ray(event).ray.intersectPlane(new THREE.Plane().setFromNormalAndCoplanarPoint(normal,point),new THREE.Vector3());
        if(hit){const local=this.content.worldToLocal(hit);this.onTongue((local.x-tongueBounds.left)/tongueBounds.width,1-(local.y-tongueBounds.top)/tongueBounds.height);}
      } else {
        this.view.yaw=THREE.MathUtils.clamp(this.drag.yaw+(event.clientX-this.drag.x)*.006,-.9,.9);
        this.view.tilt=THREE.MathUtils.clamp(this.drag.tilt+(event.clientY-this.drag.y)*.004,-.3,.3);
        this.onCamera({...this.view}); this.draw();
      }
    },options);
    for(const type of ['pointerup','pointercancel','lostpointercapture'])this.canvas.addEventListener(type,()=>{this.drag=null;},options);
    this.canvas.addEventListener('wheel',(event)=>{
      event.preventDefault();this.view.zoom=THREE.MathUtils.clamp(this.view.zoom*Math.exp(-event.deltaY*.001),.8,1.5);this.onCamera({...this.view});this.draw();
    },{...options,passive:false});
    this.canvas.addEventListener('keydown',(event)=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
      event.preventDefault();
      if(event.key==='Home')this.view={yaw:.28,tilt:.04,zoom:1};
      if(event.key==='ArrowLeft')this.view.yaw=Math.max(-.9,this.view.yaw-.1);
      if(event.key==='ArrowRight')this.view.yaw=Math.min(.9,this.view.yaw+.1);
      if(event.key==='ArrowUp')this.view.tilt=Math.min(.3,this.view.tilt+.07);
      if(event.key==='ArrowDown')this.view.tilt=Math.max(-.3,this.view.tilt-.07);
      this.onCamera({...this.view});this.draw();
    },options);
    this.canvas.addEventListener('webglcontextlost',(event)=>{
      event.preventDefault();this.host.dataset.scene='unavailable';const fallback=this.host.querySelector('.scene-fallback');if(fallback)fallback.hidden=false;
      this.host.querySelector('.scene-status').textContent=this.t('sceneUnavailable');
      const hint=this.host.closest('.sound-playground')?.querySelector('.drag-hint');if(hint)hint.textContent=this.t('dragTongue');
      this.dispose();
    },options);
  }

  /** Release animation, observers, event handlers, and GPU resources on navigation. */
  dispose() {
    if(this.disposed)return;
    this.disposed=true;cancelAnimationFrame(this.frame);this.observer?.disconnect();this.events?.abort();
    const geometries=new Set(),materials=new Set();
    this.scene?.traverse((object)=>{if(object.geometry)geometries.add(object.geometry);if(object.material)materials.add(object.material);});
    geometries.forEach((geometry)=>geometry.dispose());materials.forEach((material)=>material.dispose());
    this.renderer?.dispose();this.renderer?.forceContextLoss();this.canvas?.remove();
  }
}
