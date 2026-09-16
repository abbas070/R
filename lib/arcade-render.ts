import { W, H, rounds, cometPosition, type Game } from './arcade';
export function drawChallenges(ctx:CanvasRenderingContext2D,g:Game,images:HTMLImageElement[],time:number){
  const r=rounds[g.round],special=r.kind==='route'||r.kind==='gates'||r.kind==='dock';
  if(r.kind==='route'||r.kind==='chase'){
    ctx.strokeStyle=r.color+'40';ctx.lineWidth=2;ctx.setLineDash([4,10]);ctx.beginPath();
    if(r.kind==='chase')ctx.ellipse(W/2,H/2,235,155,0,0,Math.PI*2);
    else g.pickups.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.stroke();ctx.setLineDash([]);
    if(r.kind==='route'&&g.collected>1){ctx.strokeStyle=r.color;ctx.lineWidth=3;ctx.beginPath();g.pickups.slice(0,g.collected).forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();}
    if(r.kind==='chase')for(let i=1;i<=8;i++){const p=cometPosition(g.time-i*.08,g.collected);ctx.globalAlpha=(1-i/9)*.5;ctx.fillStyle=r.color;ctx.beginPath();ctx.arc(p.x,p.y,10-i,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  }
  g.pickups.forEach((p,i)=>{
    if(!p.active){if(special){ctx.fillStyle=r.color;ctx.beginPath();ctx.arc(p.x,p.y,7,0,Math.PI*2);ctx.fill();}return;}
    const current=!special||i===g.collected,bob=special?0:Math.sin(time*2+p.x)*3;
    const radius=r.kind==='dock'?60:r.kind==='gates'?56:29;
    ctx.globalAlpha=current?1:.28;ctx.shadowColor=r.color;ctx.shadowBlur=current?14:0;ctx.fillStyle='#101a30';ctx.strokeStyle=r.kind==='gates'&&current&&!g.gateOpen?'#9ca4ba':r.color;ctx.lineWidth=current?2.5:1.5;ctx.beginPath();ctx.arc(p.x,p.y+bob,radius,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    if(r.kind==='dock'||r.kind==='gates'){
      ctx.font='600 27px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=r.color;ctx.fillText(r.kind==='dock'&&i===3?'HOME':String(i+1),p.x,p.y-7);
      ctx.font='600 15px Arial';ctx.fillStyle='#d4dff1';ctx.fillText(!current?'WAIT':r.kind==='gates'?(g.gateOpen?'OPEN':'WAIT'):i===3?'SETTLE':'CHARGE',p.x,p.y+21);
      if(current){ctx.strokeStyle=r.color;ctx.lineWidth=5;ctx.beginPath();const fraction=r.kind==='dock'?g.charge/(i===3?1.6:1):g.gateRemaining/(g.gateOpen?2.8:2.2);ctx.arc(p.x,p.y,radius+7,-Math.PI/2,-Math.PI/2+Math.max(.001,fraction)*Math.PI*2);ctx.stroke();}
    }else if(r.kind==='route'){ctx.font='600 28px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=r.color;ctx.fillText(String(i+1),p.x,p.y);}
    else if(images[r.icon])ctx.drawImage(images[r.icon],p.x-16,p.y+bob-16,32,32);
    else{ctx.fillStyle=r.color;ctx.beginPath();ctx.arc(p.x,p.y+bob,9,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;
  });
}
