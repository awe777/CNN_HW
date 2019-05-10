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

  if(!(v && im_w * im_h === im.length && im_w >= 0)) { // sanity check
    return -1;
  }
   
  console.log("Image array  : " + im);
  console.log("Kernel array : " + wg);
  bodyReset();
  const start = Date.now()

  // step 1:  create square image array and square kernel array, if they aren't square already, and re-arrange them into 1-D array
  //          (square kernel must be of length ${v - 1} * ${v - 1}, and square image must have a minimum of length ${v} * ${v})
  // step 2:  determine output size and length of array of arrays, based on *ORIGINAL* width and height of image and the size of the square kernel 
  //          (eg. 26 x 14 convolved with 5 x 5 should result in 22 x 10, not 22 x 22)
  // step 3:  within C code, note where the input of square image and square kernel is transferred from JS to C
  //          (in order to ease adaptation if other means of input method are used)
  // step 4:  within C code, create algorithm that takes the square image array and break them into array of arrays with length ${v} * ${v}
  //          (the length of array will be dependent on the size of the square kernel)
  // step 5:  within C code, for each array member in the array of arrays, feed the HW input with the current member and the square kernel
  // step 6:  within C code, plug the resulting output onto its position in the master output array, and not where the master output array is
  //          (in order to ease adaptation if other means of output method are used)
  // step 7:  within C code, generate method to output the code out of the C program

  // PART: Step   1.0 : preliminary work
  const squareMapper = (dim, ar, w, h) => {
    return (c, i) => i < ar.length && i < w * h && i % dim < w ? ar[i % dim + w * Math.floor(i / dim)] : 0;
  }
  // PART: Step   1.1 : square image array
  const im_sq_dim = im_h > im_w ? (im_h > v ? im_h : v) : (im_w > v ? im_w : v); // max(im_h, im_w, v)
  const im_sq = new Array(im_sq_dim * im_sq_dim).fill().map(squareMapper(im_sq_dim, im, im_w, im_h));

  // PART: Step   1.2 : square kernel array
  const wg_sq_dim = Math.ceil(Math.sqrt(wg.length));
  const wg_sq = new Array((v - 1) * (v - 1)).fill().map(squareMapper(v - 1, wg, wg_sq_dim, wg_sq_dim));

  // PART: Step   2   : output size determination
  const out_w = im_w - wg_sq_dim + 1;
  const out_w_rep = Math.ceil(1 + (out_w - v) / (v - wg_sq_dim + 1));
  const out_h = im_h - wg_sq_dim + 1;
  const out_h_rep = Math.ceil(1 + (out_h - v) / (v - wg_sq_dim + 1));
  // length of array of arrays will be out_w_rep * out_h_rep
  
  console.log("Hardware code generation time - " + (Date.now() - start) + " ms");
  // step 8:  (optional) do software emulation of the hardware capabilities to provide time comparison between SW and HW execution time
  if(emulate) {
    // emulation starts here
    const start_emu_0 = Date.now();
    console.log("Software emulation (adder) time - " + (Date.now() - start_emu_0) + " ms")
    
    const start_emu_1 = Date.now();
    console.log("Software emulation (max-pooling) time - " + (Date.now() - start_emu_1) + " ms")
  }
}