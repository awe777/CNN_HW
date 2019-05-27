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
  // step 6:  within C code, for each array member in the array of arrays, feed the HW input with the current member and generate the output
  // step 7:  within C code, generate method to output the code out of the C program
  // step 8:  (optional) do software emulation of the hardware capabilities to provide time comparison between SW and HW execution time

  // PART: Step   1   : square kernel array
  const wg_sq_dim = (v - 1) > Math.ceil(Math.sqrt(wg.length)) ? Math.ceil(Math.sqrt(wg.length)) : (v - 1);
  const wg_sq = new Array(wg_sq_dim * wg_sq_dim).fill().map((c, i) => i < wg.length ? wg[i] : 0);

  debugFlag(1)

  // PART: Step   2   : output size determination - absorbed into step 3, length of out is the output size

  debugFlag(2)

  // PART: Step   3   : transfer JS array to C
  bodyPrint(`#include <stdio.h>`);
  bodyPrint(`#include <stdint.h>`);
  bodyPrint(`#include <sleep.h>`);
  bodyPrint(`uint32_t *control = (uint32_t *) 0x40000000;`);
  bodyPrint(`int main() {`)
  bodyPrint(`  *(control) = 0;`)
  bodyPrint(`  // STEP 3 - commented variable initialisations are to be replaced with a more suitable input data transfer`)
  bodyPrint(`  // importing adderMode toggle, image, and kernel data`)
  // C variables that are initialized using JS variables (except ${v} or ${r}, a HW-specific JS variable) are the one needs to be replaced if I/O methods were to change
  bodyPrint(`  int adderMode = ${true ? 1 : 0}; // 1 to run HW on adder mode, 0 to run HW on max-pooling mode`)
  bodyPrint(`  int im_h = ${im_h}; // image height (vertical pixel length)`)
  bodyPrint(`  int im_w = ${im_w}; // image width (horizontal pixel length)`)
  bodyPrint(`  int wg_dim = ${wg_sq_dim}; // kernel dimension, make sure this value is positive and less than ${v}`)
  bodyPrint(`  int im[${im_h * im_w}] = {${im.map(float2Int).join()}}; // image array goes here, format is signed fixed point with radix at 8th (Q7.24), 14 LSBs will be ignored by HW`)
  bodyPrint(`  int wg[${wg_sq_dim * wg_sq_dim}] = {${wg_sq.map(float2Int).join()}}; // square kernel array goes here, format is signed fixed point with radix at 8th (Q7.24), 14 LSBs will be ignored by HW`)
  bodyPrint(`  int out_h = im_h - wg_dim + 1;`)
  bodyPrint(`  int out_w = im_w - wg_dim + 1;`)
  bodyPrint(`  int out[out_w * out_h]; // output of this (image, kernel) layer will be stored here, format is signed fixed point with radix at 16th (Q15.16)`)

  debugFlag(3)

  // PART: Step   4   : find structuralized input jumping parameters to prepare image data before feeding to HW
  bodyPrint(`  // STEP 4`)
  bodyPrint(`  int jumps = ${v} - wg_dim + 1;`)
  bodyPrint(`  int out_h_rep = out_h % jumps == 0 ? out_h / jumps : 1 + out_h / jumps; // Math.ceil(out_h / jumps)`)  
  bodyPrint(`  int out_w_rep = out_w % jumps == 0 ? out_w / jumps : 1 + out_w / jumps; // Math.ceil(out_w / jumps)`)

  debugFlag(4)

  // PART: Step   5   : restructure and feed kernel data to HW
  bodyPrint(`  // STEP 5`)
  bodyPrint(`  int count = 0;`)
  bodyPrint(`  for(count = 0; count < ${v - 1} * ${v - 1}; count++) {`)
  bodyPrint(`    if(count % ${v - 1} < wg_dim && count / ${v - 1} < wg_dim) {`)
  bodyPrint(`      *(control + ${1 + v * v} + count) = wg[wg_dim * (count / ${v - 1}) + count % ${v - 1}];`)
  bodyPrint(`    } else {`)
  bodyPrint(`      *(control + ${1 + v * v} + count) = 0;`)
  bodyPrint(`    }`)
  bodyPrint(`  }`)

  debugFlag(5)

  // PART: Step   6   : feed image data to HW, run HW, and obtain output
  bodyPrint(`  // STEP 6`)
  bodyPrint(`  int jumpRight = 0;`)
  bodyPrint(`  int jumpDown = 0;`)
  bodyPrint(`  int moveRight = 0;`)
  bodyPrint(`  int moveDown = 0;`)
  bodyPrint(`  for(jumpDown = 0; jumpDown < out_h_rep; jumpDown++) {`)
  bodyPrint(`    for(jumpRight = 0; jumpRight < out_w_rep; jumpRight++) {`)
  bodyPrint(`      for(moveDown = 0; moveDown < ${v}; moveDown++) {`)
  bodyPrint(`        for(moveRight = 0; moveRight < ${v}; moveRight++) {`)
  bodyPrint(`          if(jumps * jumpRight + moveRight < im_w && jumps * jumpDown + moveDown < im_h) {`)
  bodyPrint(`            *(control + 1 + ${v} * moveDown + moveRight) = im[im_w * (jumps * jumpDown + moveDown) + (jumps * jumpRight + moveRight)];`)
  bodyPrint(`          } else {`)
  bodyPrint(`            *(control + 1 + ${v} * moveDown + moveRight) = 0;`)
  bodyPrint(`          }`)
  bodyPrint(`        }`)
  bodyPrint(`      }`)
  bodyPrint(`      if(adderMode = 1) {`)
  bodyPrint(`        *(control) = 0xffffffff;// turn on all the bits to enable adder mode`)
  bodyPrint(`      } else {`)
  bodyPrint(`        *(control) = 0x007fffff; // turn off the first 9 bits to enable max-pooling mode`)
  bodyPrint(`      }`)
  bodyPrint(`      usleep(${Math.ceil(1.1 * 13.75 * (v * (v - wg_sq_dim) + (v - wg_sq_dim + 1) + Math.ceil(Math.ceil(Math.log2(v * v)) / r) + 1) / 1000)}); // sleep length is mostly determined by HW specifications and performance (added 10% extra time as buffer)`)
  bodyPrint(`      *(control) = 0; `)
  bodyPrint(`      for(moveDown = 0; moveDown < jumps; moveDown++) {`)
  bodyPrint(`        for(moveRight = 0; moveRight < jumps; moveRight++) {`)
  bodyPrint(`          if(jumps * jumpRight + moveRight < out_w && jumps * jumpDown + moveDown < out_h) {`)
  bodyPrint(`            out[out_w * (jumps * jumpDown + moveDown) + (jumps * jumpRight + moveRight)] = (int)*(control + ${2 * (v * (v - 1) + 1)} + ${v} * moveDown + moveRight);`)
  bodyPrint(`          }`)
  bodyPrint(`        }`)
  bodyPrint(`      }`)
  bodyPrint(`    }`)
  bodyPrint(`  }`)

  debugFlag(6)

  // PART: Step   7   : provide output data to suitable output channels, or, (from here) repurpose the output as the input of another run
  bodyPrint(`  // STEP 7 - at this point, output of the (image, kernel) layer is in out[]`)
  bodyPrint(`  printf("result = [\\n");`)
  bodyPrint(`  for(count = 0; count < out_w * out_h; count++) {`)
  bodyPrint(`    printf("%f,\\n", (double) ((int) (out[count])) / 65536);`)
  bodyPrint(`  }`)
  bodyPrint(`  printf("]\\n");`)
  bodyPrint(`}`)

  debugFlag(7)
  
  console.log("Hardware code generation time - " + (Date.now() - start) + " ms");
  bodyWrite();
  let emu_0_result;
  let emu_1_result;
  if(emulate) {
  // PART: Step   8   : unfaithful hardware emulation with single-threaded JS
    const emu_output = new Array((im_h - wg_sq_dim + 1) * (im_w - wg_sq_dim + 1)).fill();
    const start_emu_0 = Date.now();
    emu_0_result = emu_output.map((c, i) => {
      return wg_sq.reduce((acc, cur, index) => {
        return acc + cur * im[i % (im_w - wg_sq_dim + 1) + index % wg_sq_dim + im_w * (Math.floor(i / (im_w - wg_sq_dim + 1)) + Math.floor(index / wg_sq_dim))];
      }, 0);
    })
    console.log("Adder result: " + emu_0_result)
    console.log("Software emulation (adder) time - " + (Date.now() - start_emu_0) + " ms");
    
    const start_emu_1 = Date.now();
    emu_1_result = emu_output.map((c, i) => {
      return wg_sq.reduce((acc, cur, index) => {
        return acc && acc > cur * im[i % (im_w - wg_sq_dim + 1) + index % wg_sq_dim + im_w * (Math.floor(i / (im_w - wg_sq_dim + 1)) + Math.floor(index / wg_sq_dim))] ? acc : cur * im[i % (im_w - wg_sq_dim + 1) + index % wg_sq_dim + im_w * (Math.floor(i / (im_w - wg_sq_dim + 1)) + Math.floor(index / wg_sq_dim))];
      });
    })
    console.log("Max-pooling result: " + emu_1_result)
    console.log("Software emulation (max-pooling) time - " + (Date.now() - start_emu_1) + " ms");
  }

  debugFlag(8)
  return emulate ? {
    im,
    wg,
    emu_0_result,
    emu_1_result
  } : {
    im, 
    wg
  }
}