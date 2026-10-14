'use strict';
class CollisionSystem{static overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}static near(a,b,r){return Math.hypot(a.x+a.w/2-b.x-b.w/2,a.y+a.h/2-b.y-b.h/2)<r;}}
class Physics{
 static move(o,dt,solids,oneWay=true){let oldY=o.y;const prior=o.riding;if(prior){o.x+=prior.dx||0;o.y+=prior.dy||0;}o.riding=null;o.grounded=false;
 o.vy=Math.min(CONFIG.maxFallSpeed,(o.vy||0)+CONFIG.gravity*dt);o.x+=(o.vx||0)*dt;
 for(const s of solids){if(s===o||s.oneWay)continue;if(CollisionSystem.overlaps(o,s)){if(o.vx>0)o.x=s.x-o.w;else if(o.vx<0)o.x=s.x+s.w;o.vx=0;}}
 oldY=o.y;o.y+=o.vy*dt;
 for(const s of solids){if(s===o)continue;if(!CollisionSystem.overlaps(o,s))continue;if(o.vy>=0&&oldY+o.h<=s.y+Math.max(8,Math.abs(s.dy||0)+2)){o.y=s.y-o.h;o.vy=0;o.grounded=true;o.riding=s;}else if(!s.oneWay){if(o.vy<0&&oldY>=s.y+s.h-8){o.y=s.y+s.h;o.vy=0;}else if(oldY+o.h>s.y+9){const a=o.x+o.w-s.x,b=s.x+s.w-o.x;o.x+=a<b?-a:b;o.vx=0;}}}
 }
 static approach(v,target,amount){return v<target?Math.min(target,v+amount):Math.max(target,v-amount);}
}
