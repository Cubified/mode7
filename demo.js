/*
 * demo.js: a simple demo for mode7.js
 *
 * incredibly ugly and poorly-formatted
 */

const canv = document.getElementById('canv'),
      img = document.getElementById('ci1'),
      bgd = document.getElementById('bgd');

canv.width = img.width;
canv.height = img.height;

let x = -img.width/2,
    y = img.height/2,
    height = 15,
    horizon = img.height/2,
    theta = -320*Math.PI;

let keys = [];

let velocity = 0,
    accel = 0.01,
    decel = 0.01,
    max_vel = 1;

let turn_velocity = 0,
    turn_accel = Math.PI / 2048,
    turn_decel = Math.PI / 2048,
    turn_max_vel = Math.PI / 128;

let m7 = new mode7({img_tag: img, canvas: canv});
m7.update(x, y, height, horizon, theta);

document.addEventListener('keydown', (evt)=>{
  keys[evt.keyCode] = true;
});

document.addEventListener('keyup', (evt)=>{
  keys[evt.keyCode] = false;
});

function update(){
  if(keys[87]){
    velocity = Math.min(velocity+accel, max_vel);
  } else if(keys[83]){
    velocity = Math.max(velocity-accel, -max_vel);
  } else if(velocity < 0) {
    velocity = Math.min(velocity+decel, 0);
  } else {
    velocity = Math.max(velocity-decel, 0);
  }

  x += velocity * Math.sin(theta);
  y += velocity * Math.cos(theta);

  if(keys[65]){
    turn_velocity = Math.min(turn_velocity+turn_accel, turn_max_vel);
  } else if(keys[68]){
    turn_velocity = Math.max(turn_velocity-turn_accel, -turn_max_vel);
  } else if(turn_velocity < 0){
    turn_velocity = Math.min(turn_velocity+turn_decel, 0);
  } else {
    turn_velocity = Math.max(turn_velocity-turn_decel, 0);
  }

  theta += turn_velocity;

  m7.update(x, y, height, horizon, theta);

  requestAnimationFrame(update);
}
update();

