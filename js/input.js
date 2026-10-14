'use strict';
class InputManager{
 constructor(){this.keys=new Set();this.pressed=new Set();window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(!this.keys.has(e.code))this.pressed.add(e.code);this.keys.add(e.code);if(!e.repeat&&this.onCommand)this.onCommand(e.code);});window.addEventListener('keyup',e=>this.keys.delete(e.code));window.addEventListener('blur',()=>{this.clear();if(this.onBlur)this.onBlur();});}
 down(k){return this.keys.has(k);}
 hit(k){return this.pressed.has(k);}
 end(){this.pressed.clear();}
 clear(){this.keys.clear();this.pressed.clear();}
}
