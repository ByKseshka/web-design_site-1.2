'use strict';
class AudioManager{
 constructor(save){this.save=save;this.context=null;this.clock=0;this.note=0;this.mode='menu';}
 unlock(){try{if(!this.context){this.context=new(window.AudioContext||window.webkitAudioContext)();this.master=this.context.createGain();this.master.connect(this.context.destination);}if(this.context.state==='suspended')this.context.resume();this.apply();}catch{}}
 apply(){if(this.context)this.master.gain.setTargetAtTime(this.save.data.settings.volume,this.context.currentTime,.05);}
 tone(freq,duration=.15,type='sine',volume=.12,offset=0){if(!this.context)return;const t=this.context.currentTime+offset,o=this.context.createOscillator(),g=this.context.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration+.03);}
 play(name){if(!this.save.data.settings.sound)return;const tones={jump:440,morJump:220,land:120,collect:880,key:660,button:330,door:170,elevator:100,checkpoint:740,hurt:90,death:65,win:523,transition:330,error:130,ui:540,open:390,close:260,carry:290,ability:620};this.tone(tones[name]||400,name==='death'?.6:.18,name==='hurt'?'sawtooth':'sine',.09);if(['win','key','checkpoint'].includes(name)){this.tone(880,.28,'sine',.09,.13);this.tone(1046,.5,'sine',.07,.28);}}
 update(dt,mode){this.mode=mode;if(!this.save.data.settings.music||!this.context||mode==='pause')return;this.clock-=dt;if(this.clock<=0){this.clock=mode==='menu'?1.25:1.9;const menu=[261.6,329.6,392,329.6,293.7,220,293.7,392],game=[130.8,196,220,164.8,146.8,196,164.8,110];this.tone((mode==='menu'?menu:game)[this.note++%8],1.7,'sine',.028);if(this.note%4===0)this.tone(783.99,1.6,'sine',.015,.3);}}
 silence(){if(this.context)this.master.gain.setTargetAtTime(0,this.context.currentTime,.03);}
}
