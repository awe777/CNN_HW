let debug = false;

function debugToggle() {
  debug = !debug;
}

function debugFlag(n = 0) {
  debug ? console.log("Flag: end of step " + n + ", " + Date.now()) : null;
}

function float2Int(v = 0) {
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

  // step 1:  create square kernel array, if it isn't square already, and re-arrange them into 1-D array
  //          (square kernel must have a maximum of length ${v - 1} * ${v - 1})
  // step 2:  determine output size and length of array of arrays, based on *ORIGINAL* width and height of image and the size of the square kernel 
  //          (eg. 26 x 14 convolved with 5 x 5 should result in 22 x 10, not 22 x 22)
  // step 3:  within C code, note where the master output array, input of image and square kernel is transferred from JS to C
  //          (in order to ease adaptation if other means of I/O method are used)
  // step 4:  within C code, create algorithm that takes the image array and break them into array of arrays with length ${v} * ${v}, or something as functional
  //          (the length of array will be dependent on the size of the square kernel and hardware maximum capacity)
  // step 5:  within C code, create algorithm that takes the square kernel array and re-mold it into a ${v - 1} * ${v - 1} square kernel, then feed it to HW input
  // step 6:  within C code, for each array member in the array of arrays, feed the HW input with the current member 
  // step 7:  within C code, plug the resulting output onto its position in the master output array
  // step 8:  within C code, generate method to output the code out of the C program

  // PART: Step   1.0 : preliminary work
  const squareMapper = (dim, ar, w, h) => {
    return (c, i) => i < ar.length && i < w * h && i % dim < w ? ar[i % dim + w * Math.floor(i / dim)] : 0;
  }
  // PART: Step   1.1 : square kernel array
  const wg_sq_dim = (v - 1) > Math.ceil(Math.sqrt(wg.length)) ? Math.ceil(Math.sqrt(wg.length)) : (v - 1);
  const wg_sq = new Array(wg_sq_dim * wg_sq_dim).fill().map(squareMapper(wg_sq_dim, wg, wg_sq_dim, wg_sq_dim));

  debugFlag(1)

  // PART: Step   2   : output size determination
  const out_w = im_w - wg_sq_dim + 1;
  const out_w_rep = Math.ceil(1 + (out_w - v) / (v - wg_sq_dim + 1));
  const out_h = im_h - wg_sq_dim + 1;
  const out_h_rep = Math.ceil(1 + (out_h - v) / (v - wg_sq_dim + 1));
  // length of array of arrays will be out_w_rep * out_h_rep
  // length of output array will be out_w * out_h

  debugFlag(2)

  // PART: Step   3   : transfer JS array to C
  bodyPrint(`#include <stdio.h>`);
  bodyPrint(`#include <stdint.h>`);
  bodyPrint(`#include <sleep.h>`);
  bodyPrint(`uint32_t *control = (uint32_t *) 0x40000000;`);
  bodyPrint(`int main() {`)
  bodyPrint(`  *(control) = 0;`)
  bodyPrint(`  // STEP 3`)
  bodyPrint(`  // importing adderMode toggle, image, and kernel data`)
  // C variables that are initialized using JS variables (except ${v} or ${r}, a HW-specific JS variable) are the one needs to be replaced if I/O methods were to change
  bodyPrint(`  int adderMode = ${true ? 1 : 0};`)
  bodyPrint(`  int im_h = ${im_h}; // image height (vertical)`)
  bodyPrint(`  int im_w = ${im_w}; // image width (horizontal)`)
  bodyPrint(`  int wg_dim = ${wg_sq_dim} // kernel dimension, make sure this value is positive and less than ${v}`)
  bodyPrint(`  int im[im_h * im_w] = {${im.map(float2Int).join()}}; // image array goes here`)
  bodyPrint(`  int wg[wg_dim * wg_dim] = {${wg_sq.map(float2Int).join()}}; // square kernel array goes here`)
  bodyPrint(`  // output of this (image, kernel) layer will be stored in out[]`)
  bodyPrint(`  int out_h = im_h - wg_dim + 1;`)
  bodyPrint(`  int out_w = im_w - wg_dim + 1;`)
  bodyPrint(`  int out[out_w * out_h];`)

  debugFlag(3)

  // PART: Step   4   : find structuralized input jumping parameters to prepare image data before feeding to HW
  bodyPrint(`  // STEP 4`)
  bodyPrint(`  int jumps = ${v} - wg_dim + 1;`)
  bodyPrint(`  int out_h_rep = out_h % jumps == 0 ? out_h / jumps : 1 + out_h / jumps; // Math.ceil(out_h / jumps)`)  
  bodyPrint(`  int out_w_rep = out_w % jumps == 0 ? out_w / jumps : 1 + out_w / jumps; // Math.ceil(out_w / jumps)`)

  debugFlag(4)

  // PART: Step   5   : restructure and feed kernel data to HW
  bodyPrint(`  // STEP 5`)
  bodyPrint(`  int count0 = 0;`)
  bodyPrint(`  for(count0 = 0; count0 < ${v - 1} * ${v - 1}; count0++) {`)
  bodyPrint(`    if(count0 % ${v - 1} < wg_dim && count0 / ${v - 1} < wg_dim) {`)
  bodyPrint(`      *(control + ${1 + v * v} + count0) = wg[wg_dim * (count0 / ${v - 1}) + count0 % ${v - 1}];`)
  bodyPrint(`    } else {`)
  bodyPrint(`      *(control + ${1 + v * v} + count0) = 0;`)
  bodyPrint(`    }`)
  bodyPrint(`  }`)

  debugFlag(5)
  
  console.log("Hardware code generation time - " + (Date.now() - start) + " ms");
  // step 9:  (optional) do software emulation of the hardware capabilities to provide time comparison between SW and HW execution time
  if(emulate) {
  // PART: Step   9   : software emulation with single-threaded JS
    const start_emu_0 = Date.now();
    console.log("Software emulation (adder) time - " + (Date.now() - start_emu_0) + " ms");
    
    const start_emu_1 = Date.now();
    console.log("Software emulation (max-pooling) time - " + (Date.now() - start_emu_1) + " ms");
  }
}