function process(v = 0) {
  return (v < 128 && v >= -128) ? Math.floor(1024 * v) * 16384 : (v > 0) ? 0x7fffffff : 0xffffffff;
}

function generate(v, r, im = [], im_w = 0, im_h = 0, wg = [], emulate = false) {
  v = +v > 1 ? +v : 0
  r = +r;

  if(v && !(Array.isArray(im) && im.length)) { // randomly generate an image array if input is invalid or unavailable
    im_w = Math.floor((10 * Math.random() + 2) * v / 3);
    im_h = Math.random() < 0.5 ? im_w : Math.floor((10 * Math.random() + 2) * v / 3); // 50% chance to have either square image or re-roll
    im = new Array(im_w * im_h).fill().map(() => 256 * Math.random() - 128);
  }
  if(v && !(Array.isArray(wg) && wg.length)) {
    wg = Math.floor((1 + Math.random()) * (v - 1) / 2)
    wg = new Array(wg * wg).fill().map(() => 256 * Math.random() - 128)
  }

  if(!(v && im_w * im_h === im.length)) { // sanity check
    return -1;
  }
   
  console.log("Image array  : " + im);
  console.log("Kernel array : " + wg);
  bodyReset();
  const start = Date.now()

  // step 1:  create square image array and square kernel array, if they aren't square already, and re-arrange them into 1-D array
  // step 2:  estimate output size, based on *ORIGINAL* width and height of image and the size of the square kernel 
  //          (eg. 26 x 14 convolved with 5 x 5 should result in 22 x 10, not 22 x 22)
  // step 3:  within C code, note where the input of square image and square kernel is transferred from JS to C
  //          (in order to ease adaptation if other means of input method are used)
  // step 4:  within C code, create algorithm that takes the square image array and break them into array of arrays with length ${v} * ${v}
  //          (the length of array will be dependent on the size of the square kernel)
  // step 5:  within C code, for each array member in the array of arrays, feed the HW input with the current member and the square kernel
  // step 6:  within C code, plug the resulting output onto its position in the master output array, and not where the master output array is
  //          (in order to ease adaptation if other means of output method are used)
  // step 7:  within C code, generate method to output the code out of the C program
  
  console.log(Date.now() - start);
  // step 8:  (optional) do software emulation of the hardware capabilities to provide time comparison between SW and HW execution time
  if(emulate) {
    // emulation starts here
  }
}