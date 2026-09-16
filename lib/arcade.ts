export const W = 720, H = 560;
export type RoundKind = 'collect' | 'gates' | 'chase' | 'route' | 'dock' | 'quiz';
export type Round = {name:string;subtitle:string;goal:number;color:string;object:string;win:string;line:string;kind:RoundKind;icon:number;instruction:string;pilot:string;boost:string;timeLimit?:number;maxBumps?:number;quiz?:'wiring'|'brain'};
export const rounds:Round[] = [
  {timeLimit:60,maxBumps:3,name:'Coffee run',subtitle:'Our coffee bar isn’t going to stock itself.',goal:6,color:'#ffc287',object:'coffees',win:'ESPRESSOOOOO.',line:'Okay. The coffee bar is happening.',kind:'collect',icon:0,instruction:'Grab all six coffees. Dodge the orange glitches.',pilot:'Pick the route. Preferably a caffeinated one.',boost:'Pull in nearby coffee with your boost.'},
  {timeLimit:65,maxBumps:3,name:'Plot twist',subtitle:'A book for you. A book for me.',goal:6,color:'#b6a5ff',object:'books',win:'Neat little haul.',line:'Now we actually have to read them.',kind:'collect',icon:1,instruction:'Six books, a few moving glitches, and absolutely no shelf space.',pilot:'Weave between the glitches and grab the books.',boost:'Shield the ship when the route gets crowded.'},
  {name:'Brain wiring',subtitle:'Two brains. One very neat signal.',goal:4,color:'#e2b0ff',object:'questions',win:'Neurons: firing.',line:'That connection was quite optimal.',kind:'quiz',quiz:'wiring',icon:8,instruction:'Four quick questions about how neurons send messages. Get at least three right.',pilot:'Read the question out loud. Have a tiny debate.',boost:'Pick an answer together, then lock it in. No timer.'},
  {timeLimit:75,name:'After you',subtitle:'A tiny exercise in extremely good timing.',goal:4,color:'#f6afce',object:'gates',win:'Impeccable timing.',line:'We are calling that intentional.',kind:'gates',icon:4,instruction:'Reach each numbered ring. Boost inside it when it says OPEN.',pilot:'Park inside the bright ring. It opens again every few seconds.',boost:'Wait for OPEN, then boost. Early? You can try again.'},
  {timeLimit:90,name:'Wait, come back',subtitle:'That sparkle has somewhere to be.',goal:5,color:'#ffd88b',object:'comets',win:'Caught feelings. Sorry, comets.',line:'An entirely normal amount of chasing.',kind:'chase',icon:5,instruction:'Catch five comets. They move along the dotted orbit, so cut them off.',pilot:'Aim ahead of the comet. It’s slower than you.',boost:'Your magnet can catch it from farther away.'},
  {timeLimit:75,maxBumps:3,name:'Star collecting',subtitle:'A scenic detour. Obviously necessary.',goal:8,color:'#8aeadb',object:'stars',win:'Yay us.',line:'That was quite optimal.',kind:'collect',icon:2,instruction:'Gather all eight stars. The middle is busy; the edges are your friends.',pilot:'Find a smooth route around the orbiting glitches.',boost:'Keep the streak going with a well-timed boost.'},
  {timeLimit:65,name:'Connect the dots',subtitle:'We can pretend this is astronomy.',goal:7,color:'#a9c8ff',object:'stars linked',win:'A very neat constellation.',line:'Scientists are welcome to disagree.',kind:'route',icon:6,instruction:'Follow stars 1 through 7 in order. Your route will draw itself behind you.',pilot:'Follow the bright number. The dim ones can wait.',boost:'Speed up between stars. These ones stay put.'},
  {name:'Use your head',subtitle:'We brought two. Seems promising.',goal:4,color:'#a9c8ff',object:'questions',win:'Amazing brains, honestly.',line:'A little neuroscience. A very good team.',kind:'quiz',quiz:'brain',icon:8,instruction:'Four questions about memory, movement, and learning. Three right gets you through.',pilot:'Your turn to suggest an answer. Reasoning encouraged.',boost:'Talk it through together. Lock it in when you agree.'},
  {timeLimit:90,name:'Park it here',subtitle:'One last thing to do together.',goal:4,color:'#8aeadb',object:'steps',win:'Optimal landing.',line:'Nine detours. Same very good company.',kind:'dock',icon:7,instruction:'Charge three beacons, then bring the ship home to the center.',pilot:'Stay inside each beacon while it charges. Then settle in HOME.',boost:'Boost inside a beacon and hold still for one second to charge it.'},
];
export type Particle = {x:number;y:number;vx:number;vy:number;life:number;color:string};
export type Pickup = {x:number;y:number;active:boolean};
export type Hazard = {x:number;y:number;radius:number};
export type Game = {round:number;x:number;y:number;angle:number;time:number;elapsed:number;score:number;collected:number;combo:number;lastPickup:number;cooldown:number;boost:number;immune:number;bumps:number;boosts:number;pickups:Pickup[];hazards:Hazard[];particles:Particle[];complete:boolean;charge:number;gateOpen:boolean;gateRemaining:number;failed:string|null;roundBumps:number;quizCorrect:number;startScore:number;startElapsed:number;startBumps:number;startBoosts:number;attempt:number};
export type Input = {dx:number;dy:number;target?:{x:number;y:number}};
export type GameEvent = 'pickup' | 'bump' | 'complete' | 'failed';
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const points=[[150,135],[360,115],[570,145],[565,405],[355,435],[150,405],[110,280],[610,280]];
const gatePoints=[[155,145],[565,155],[565,410],[155,410]];
const routePoints=[[130,400],[180,180],[315,310],[360,110],[420,310],[560,180],[600,400]];
const dockPoints=[[160,160],[560,160],[360,420],[360,280]];
export function createGame(round=0,previous?:Pick<Game,'score'|'elapsed'|'bumps'|'boosts'>):Game{
  const r=rounds[round],coords=r.kind==='quiz'?[]:r.kind==='gates'?gatePoints:r.kind==='route'?routePoints:r.kind==='dock'?dockPoints:r.kind==='chase'?[[565,280]]:points.slice(0,r.goal);
  return {round,x:W/2,y:H/2,angle:0,time:0,elapsed:previous?.elapsed??0,score:previous?.score??0,collected:0,combo:0,lastPickup:-100,cooldown:0,boost:0,immune:0,bumps:previous?.bumps??0,boosts:previous?.boosts??0,pickups:coords.map(([x,y])=>({x,y,active:true})),hazards:[],particles:[],complete:false,charge:0,gateOpen:true,gateRemaining:2.8,failed:null,roundBumps:0,quizCorrect:0,startScore:previous?.score??0,startElapsed:previous?.elapsed??0,startBumps:previous?.bumps??0,startBoosts:previous?.boosts??0,attempt:1};
}
export function activateBoost(g:Game):boolean{if(g.complete||g.failed||rounds[g.round].kind==='quiz'||g.cooldown>0)return false;g.cooldown=4.5;g.boost=1.4;g.boosts++;return true;}
function burst(g:Game,x:number,y:number,color:string,n=12){for(let i=0;i<n;i++){const a=i/n*Math.PI*2;g.particles.push({x,y,vx:Math.cos(a)*100,vy:Math.sin(a)*100,life:.65,color});}}
export function cometPosition(time:number,caught:number){const a=time*.62+caught*1.7;return {x:W/2+Math.cos(a)*235,y:H/2+Math.sin(a)*155};}
export function objective(g:Game):string{
  const r=rounds[g.round];
  if(r.kind==='quiz')return `${g.collected} / 4 answered · ${g.quizCorrect} correct · 3 to pass`;
  if(r.kind==='gates')return `Ring ${Math.min(g.collected+1,r.goal)} · ${g.gateOpen?'OPEN — boost inside':'wait for OPEN'} · ${g.gateRemaining.toFixed(1)}s`;
  if(r.kind==='route')return `Follow star ${Math.min(g.collected+1,r.goal)} → ${r.goal}`;
  if(r.kind==='chase')return 'Cut across the orbit. Boost to pull the comet in.';
  if(r.kind==='dock')return g.collected===3?`Settle in HOME · ${Math.round(g.charge/1.6*100)}%`:`Beacon ${g.collected+1} · boost & stay inside · ${Math.round(g.charge*100)}%`;
  return `Collect every ${r.object==='books'?'book':r.object==='stars'?'star':'coffee'}. Orange glitches = small detours.`;
}
export function step(g:Game,input:Input,seconds:number):GameEvent[]{
  if(g.complete||g.failed||rounds[g.round].kind==='quiz')return [];
  const dt=clamp(seconds,0,.04),events:GameEvent[]=[],r=rounds[g.round];
  g.time+=dt;g.elapsed+=dt;g.cooldown=Math.max(0,g.cooldown-dt);g.boost=Math.max(0,g.boost-dt);g.immune=Math.max(0,g.immune-dt);
  let dx=input.dx,dy=input.dy;
  if(input.target&&dx===0&&dy===0){dx=input.target.x-g.x;dy=input.target.y-g.y;if(Math.hypot(dx,dy)<4){dx=0;dy=0;}}
  const length=Math.hypot(dx,dy),speed=g.boost>0?330:205;
  if(length>0){const distance=input.target&&input.dx===0&&input.dy===0?Math.min(length,speed*dt):speed*dt;g.x=clamp(g.x+dx/length*distance,28,W-28);g.y=clamp(g.y+dy/length*distance,28,H-28);g.angle=Math.atan2(dy,dx)+Math.PI/2;}
  const hazardCount=r.kind==='collect'?(g.round===0?3:g.round===1?4:5):0;
  g.hazards=Array.from({length:hazardCount},(_,i)=>{const a=i/hazardCount*Math.PI*2+g.time*.27;return {x:W/2+Math.cos(a)*(155+25*Math.sin(g.time*.4+i)),y:H/2+Math.sin(a)*105,radius:19};});
  const award=(p:Pickup)=>{p.active=false;g.collected++;g.combo=g.time-g.lastPickup<4?Math.min(3,g.combo+1):1;g.lastPickup=g.time;g.score+=100*g.combo;burst(g,p.x,p.y,r.color);events.push('pickup');};
  if(r.kind==='collect')for(const p of g.pickups){if(!p.active)continue;let distance=Math.hypot(p.x-g.x,p.y-g.y);if(g.boost>0&&distance<170){const pull=Math.min(distance,360*dt);p.x+=(g.x-p.x)/(distance||1)*pull;p.y+=(g.y-p.y)/(distance||1)*pull;distance=Math.hypot(p.x-g.x,p.y-g.y);}if(distance<44)award(p);}
  if(r.kind==='route'){const p=g.pickups[g.collected];if(p&&Math.hypot(p.x-g.x,p.y-g.y)<44)award(p);}
  if(r.kind==='gates'){
    const phase=g.time%5;g.gateOpen=phase<2.8;g.gateRemaining=g.gateOpen?2.8-phase:5-phase;
    const p=g.pickups[g.collected];if(p&&g.gateOpen&&g.boost>0&&Math.hypot(p.x-g.x,p.y-g.y)<50)award(p);
  }
  if(r.kind==='chase'){
    const p=g.pickups[0],pos=cometPosition(g.time,g.collected);p.x=pos.x;p.y=pos.y;
    if(g.boost>0){const distance=Math.hypot(p.x-g.x,p.y-g.y);if(distance<170){const pull=Math.min(distance,100);p.x+=(g.x-p.x)/(distance||1)*pull;p.y+=(g.y-p.y)/(distance||1)*pull;}}
    if(Math.hypot(p.x-g.x,p.y-g.y)<44){award(p);if(g.collected<r.goal){Object.assign(p,cometPosition(g.time,g.collected));p.active=true;}}
  }
  if(r.kind==='dock'){
    const p=g.pickups[g.collected],home=g.collected===3;
    const inside=p&&Math.hypot(p.x-g.x,p.y-g.y)<52;
    if(inside&&(home?length===0:g.boost>0))g.charge+=dt;
    else if(!inside)g.charge=Math.max(0,g.charge-dt*.5);
    if(p&&g.charge>=(home?1.6:1)){award(p);g.charge=0;}
  }
  if(g.boost<=0&&g.immune<=0)for(const h of g.hazards){if(Math.hypot(h.x-g.x,h.y-g.y)<h.radius+18){g.immune=1.6;g.score=Math.max(0,g.score-25);g.combo=0;g.bumps++;g.roundBumps++;burst(g,g.x,g.y,'#ff987d',8);events.push('bump');break;}}
  for(const p of g.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}g.particles=g.particles.filter(p=>p.life>0);
  if(r.maxBumps&&g.roundBumps>=r.maxBumps){g.failed='Three bumps. Let’s try a smoother route.';events.push('failed');}
  else if(g.collected>=r.goal){g.complete=true;events.push('complete');}
  else if(r.timeLimit&&g.time>=r.timeLimit){g.failed='Time’s up. Same team, fresh attempt.';events.push('failed');}
  return events;
}

export function retryGame(g:Game):Game {
  const next=createGame(g.round,{score:g.startScore,elapsed:g.startElapsed,bumps:g.startBumps,boosts:g.startBoosts});
  next.attempt=g.attempt+1;return next;
}
export function roundRules(r:Round):string {
  if(r.kind==='quiz')return '3 of 4 correct to pass · no timer · retake below 3';
  return `Finish in ${r.timeLimit}s${r.maxBumps?' · third bump ends the attempt':''} · retry if you miss it`;
}
export function recordQuizAnswer(g:Game,index:number,correct:boolean):boolean {
  if(rounds[g.round].kind!=='quiz'||g.failed||g.complete||index!==g.collected||index>=rounds[g.round].goal)return false;
  g.collected++;if(correct){g.quizCorrect++;g.score+=100;}return true;
}
export function finishQuiz(g:Game):boolean {
  if(rounds[g.round].kind!=='quiz'||g.failed||g.complete||g.collected!==rounds[g.round].goal)return false;
  if(g.quizCorrect>=3)g.complete=true;
  else g.failed=`${g.quizCorrect} out of 4. You need 3 to pass. Give those neurons another go.`;
  return true;
}
