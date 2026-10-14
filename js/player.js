'use strict';
class Player{
 constructor(id,spawn){this.id=id;this.w=30;this.h=42;this.controls=id==='niva'?{left:'KeyA',right:'KeyD',jump:'KeyW',interact:'KeyS',ability:'KeyE'}:{left:'ArrowLeft',right:'ArrowRight',jump:'ArrowUp',interact:'ArrowDown',ability:'KeyP'};this.reset(spawn);}
 reset(s){this.x=s.x;this.y=s.y;this.vx=0;this.vy=0;this.grounded=false;this.riding=null;this.active=0;this.cooldown=0;this.dead=false;this.facing=1;this.coyote=0;this.jumpBuffer=0;this.walk=0;this.landSquash=0;}
 update(dt,input,l){if(this.dead)return;const c=this.controls;this.active=Math.max(0,this.active-dt);this.cooldown=Math.max(0,this.cooldown-dt);this.landSquash=Math.max(0,this.landSquash-dt*4);const holding=input.down(c.interact)||input.down(c.ability);if(holding&&this.active<=0&&this.cooldown<=0){this.active=CONFIG.abilityDuration;this.cooldown=CONFIG.abilityDuration+CONFIG.abilityCooldown;l.audio.play('ability');const supported=this.grounded;if(!supported&&this.vy>=-100){const temp={x:this.x-35,y:this.y+this.h+8,w:100,h:12,life:CONFIG.abilityDuration,oneWay:true,type:this.id==='niva'?'light':'shadow'};l.tempPlatforms.push(temp);}}
 if(input.hit(c.interact))l.interact(this,input);
 let dir=Number(input.down(c.right))-Number(input.down(c.left));let speed=CONFIG.moveSpeed;const carry=l.crates.find(a=>a.carrier===this.id||a.carrier==='both');if(carry)speed*=carry.type==='joint'?.6:carry.type==='heavy'?.7:.85;if(this.active>0&&this.id==='mor')speed*=.84;this.vx=Physics.approach(this.vx,dir*speed,(dir?CONFIG.acceleration*(this.grounded?1:CONFIG.airControl):CONFIG.friction)*dt);if(dir)this.facing=dir;
 if(input.hit(c.jump))this.jumpBuffer=.14;else this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);this.coyote=this.grounded?.12:Math.max(0,this.coyote-dt);if(this.jumpBuffer>0&&this.coyote>0){this.vy=-(this.id==='niva'?CONFIG.nivaJump:CONFIG.morJump)*(carry?.92:1);this.grounded=false;this.riding=null;this.coyote=0;this.jumpBuffer=0;l.audio.play(this.id==='niva'?'jump':'morJump');}
 const grounded=this.grounded;const oldX=this.x;Physics.move(this,dt,l.solidsFor(this));this.x=Math.max(0,Math.min(l.width-this.w,this.x));if(!grounded&&this.grounded){this.landSquash=.35;l.audio.play('land');}this.walk+=Math.abs(this.x-oldX)*.07;
 // Push light boxes in the direction of travel, respecting walls.
 if(dir)for(const box of l.crates)if(!box.carrier&&!box.socket&&box.type!=='joint'&&(box.type!=='heavy'||this.id==='mor')&&Math.abs(this.y+this.h-(box.y+box.h))<30&&Math.abs((dir>0?this.x+this.w-box.x:this.x-box.x-box.w))<5){box.vx=dir*speed;}
 }
}
