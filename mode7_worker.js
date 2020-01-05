/*
 * mode7_worker.js: webworker to help performance
 */

let running = false,
    ctx;

let x0,
    y0,
    height,
    horizon,
    theta,
    image;

let sin_theta,
    cos_theta;

let half_w,
    half_h;

onmessage = (e)=>{
  switch(e.data.cmd){
    case 'init':
      ctx = e.data.canv.getContext('2d');
      image = e.data.image;

      half_w = image.width / 2;
      half_h = image.height / 2;
      break;
    case 'set_params':
      x0 = e.data.x0;
      y0 = e.data.y0;
      height = e.data.height;
      horizon = e.data.horizon;
      theta = e.data.theta;

      sin_theta = Math.sin(theta);
      cos_theta = Math.cos(theta);
      break;
    case 'start':
      running = true;
      break;
    case 'stop':
      running = false;
      break;
  }
};

function update(){
  if(running){
    let out = new ImageData(image.width, image.height);

    for(let i=4*image.width*horizon;i<out.data.length;i+=4){ /* i is set to this value to avoid iterating over every pixel above the horizon */
      let y = Math.floor(i/(4*image.width));              /* y is the number of times x has wrapped -- out of order for performance reasons */
      if(y >= horizon){                                   /* avoiding unnecessary computation leads to a noticeable speed increase */
        let x = Math.floor((i/4)%image.width)-half_w,     /* x wraps around every time i/4 crosses this.w, must be centered around this.w/2 rather than 0 */
            z = y/height,                                 /* z position depends upon y (closer=greater) */
            view_angle = y-half_h;                        /* angle between camera point and (x,y,z) increases with y */

        let xtemp = (x/(z*view_angle))*half_w,   /* perspective transform: the closer an object is (i.e. the smaller is z value), the larger it will be to the camera */
            ytemp = (height/view_angle)*half_h;  /* simplified form of y/(z*view_angle) -- 1/z describes perspective: larger values closer to camera, smaller farther */

        let xprime = Math.floor((xtemp * cos_theta) - (ytemp * sin_theta) - x0), /* rotate perspective-transformed point */
            yprime = Math.floor((xtemp * sin_theta) + (ytemp * cos_theta) + y0); /* add camera point to properly translate view plane rather than skew it */

        if(xprime >= 0 && xprime <= image.width &&
            yprime >= 0 && yprime <= image.height){
          let i_dest = ((yprime * image.width) + xprime) * 4; /* again for performance, this function has been inlined */

          out.data[i] = image.data[i_dest];
          out.data[i+1] = image.data[i_dest+1];
          out.data[i+2] = image.data[i_dest+2];
          out.data[i+3] = image.data[i_dest+3];
        }
      }
    }

    /***/

    createImageBitmap(out).then((bitmap)=>{
      ctx.clearRect(0, 0, out.width, out.height);
      ctx.drawImage(bitmap, 0, 0);
    });
  }

  requestAnimationFrame(update);
}
update();
