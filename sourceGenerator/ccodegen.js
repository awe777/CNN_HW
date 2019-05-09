function process(v = 0) {
  return (v < 128 && v >= -128) ? Math.floor(1024 * v) * 16384 : (v > 0) ? 0x7fffffff : 0xffffffff;
}

function generate(v, r, im = [], wg = [], ledControl = false, debug = true) {
  v = +v > 1 ? +v : 0
  if(!v) {
    return -1;
  }
  r = +r; 
  Array.isArray(im) && im.length ? null : im = new Array(Math.floor(v * v * Math.random())).fill().map((p) => 256 * Math.random() - 128); console.log(im)
  Array.isArray(wg) && wg.length ? null : wg = new Array(Math.floor(Math.min(v - 1, Math.floor(Math.sqrt(im.length))) * Math.min(v - 1, Math.floor(Math.sqrt(im.length))) * Math.random())).fill().map((p) => 256 * Math.random() - 128); console.log(wg)
  bodyReset();
  const start = Date.now()
  
  const imProc = Array(v * v);
  const wgProc = Array((v - 1) * (v - 1));
  let control = Math.ceil(Math.sqrt(im.length)) <= v ? Math.ceil(Math.sqrt(im.length)) : v;

  for(count0 = 0; count0 < imProc.length; count0++) {
    if(count0 >= control * v) {
      imProc[count0] = 0;
    } else {
      imProc[count0] = count0 % v < control ? process(im[count0 - (v - control) * Math.floor(count0 / v)]) : 0;
    }
  }
  control = Math.ceil(Math.sqrt(wg.length)) <= (v - 1) ? Math.ceil(Math.sqrt(wg.length)) : v - 1;
  for(count1 = 0; count1 < wgProc.length; count1++) {
    
    if(count1 >= control * (v - 1)) {
      wgProc[count1] = 0;
    } else {
      wgProc[count1] = count1 % (v - 1) < control ? process(wg[count1 - (v - 1 - control) * Math.floor(count1 / (v - 1))]) : 0;
    }
  }
  let softwareAdderTime = Date.now();
  let x0 = 0;
  let x1 = 0;
  let y0 = 0;
  let y1 = 0;
  const rsProc = new Array(v * v).fill(0);
  for(count0 = 0; count0 < v * v; count0++) {
    x0 = count0 % v;
    y0 = Math.floor(count0 / v);
    for(count1 = 0; count1 < (v - 1) * (v - 1); count1++) {
      x1 = count1 % (v - 1);
      y1 = Math.floor(count1 / (v - 1));
      rsProc[count0] += (wgProc[count1] / 16777216) * (imProc[v * ((y0 + y1) % v) + ((x0 + x1) % v)] / 16777216);
    }
  }
  softwareAdderTime = Date.now() - softwareAdderTime;
  console.log(rsProc);
  let softwareMaxTime = Date.now();
  let currentValue = 0;
  const rsMProc = new Array(v * v).fill();
  for(count0 = 0; count0 < v * v; count0++) {
    x0 = count0 % v;
    y0 = Math.floor(count0 / v);
    for(count1 = 0; count1 < (v - 1) * (v - 1); count1++) {
      x1 = count1 % (v - 1);
      y1 = Math.floor(count1 / (v - 1));
      currentValue = (wgProc[count1] / 16777216) * (imProc[v * ((y0 + y1) % v) + ((x0 + x1) % v)] / 16777216);
      rsMProc[count0] = (!rsMProc[count0] && rsMProc[count0] !== 0) || rsMProc[count0] < currentValue ? currentValue : rsMProc[count0];
    }
  }
  softwareMaxTime = Date.now() - softwareMaxTime;
  console.log(rsMProc);
  bodyReset();

  bodyPrint(`#include <stdio.h>`);
  bodyPrint(`#include <stdint.h>`);
  bodyPrint(`#include <sleep.h>`);
  bodyPrint(`uint32_t *control = (uint32_t *) 0x40000000;`);
  ledControl ? bodyPrint(`uint32_t *ledCtrl = (uint32_t *) 0x41200000;`) : null;

  bodyPrint(`int main() {`)
  bodyPrint(`  // deactivate hardware processing`)
  bodyPrint(`  *(control) = 0;`)
  
  ledControl ? bodyPrint(`  *(ledCtrl) = 0b0000;`) : null;

  bodyPrint(`  // input kernel data to weight "array"`)
  for(count1 = 0; count1 < wgProc.length; count1++) {
    bodyPrint(`  *(control + ${count1 + 1 + imProc.length}) = ${wgProc[count1]}; ${wgProc[count1] ? "// " + (16384 * Math.floor(wgProc[count1] / 16384) / 16777216) : ""}`)
  }
  debug ? bodyPrint(`  printf("weight = [\\n");`) : null
  for(count1 = 0; count1 < wgProc.length && debug; count1++) {
    bodyPrint(`  printf("%f,\\n", (double) ((int)*(control + ${count1 + 1 + imProc.length})) / 16777216);`)
  }
  debug ? bodyPrint(`  printf("]\\n");`) : null

  bodyPrint(`Note - if image is larger than ${v} x ${v}, then this portion and the hardware processing portion of the program needs to be repeated to process 1 layer of CNN`)

  bodyPrint(`  // input image data to image "array"`)
  for(count0 = 0; count0 < imProc.length; count0++) {
    bodyPrint(`  *(control + ${count0 + 1}) = ${imProc[count0]}; ${imProc[count0] ? "// " + (16384 * Math.floor(imProc[count0] / 16384) / 16777216) : ""}`)
  }
  debug ? bodyPrint(`  printf("image = [\\n");`) : null;
  for(count0 = 0; count0 < imProc.length && debug; count0++) {
    bodyPrint(`  printf("%f,\\n", (double) ((int)*(control + ${count0 + 1})) / 16777216);`);
  }
  debug ? bodyPrint(`  printf("]\\n");`) : null

  bodyPrint(`  // activate hardware processing`)
  bodyPrint(`  *(control) = 0xffffffff;`)
  bodyPrint(`  // sleep while hardware is processing, time slept given for the hardware is 120% of hardware processing time to the nearest us`)
  bodyPrint(`  usleep(${Math.ceil(16.5 / 1000 * (v * (Math.ceil(Math.sqrt(im.length)) - Math.ceil(Math.sqrt(wg.length))) + (1 + Math.ceil(Math.sqrt(im.length)) - Math.ceil(Math.sqrt(wg.length))) + Math.ceil(Math.ceil(Math.log2(v * v)) / r)))});`)
  bodyPrint(`  // deactivate hardware processing`)
  bodyPrint(`  *(control) = 0;`)
  ledControl ? bodyPrint(`  *(ledCtrl) = 0b1111;`) : null;
  bodyPrint(`  printf("result = [\\n");`)
  for(count0 = 0; count0 < imProc.length; count0++) {
    bodyPrint(`  printf("%f,\\n", (double) ((int)*(control + ${count0 + 1 + imProc.length + wgProc.length})) / 65536);`)
  }
  bodyPrint(`  printf("]\\n");`)
  
  bodyPrint(`}`)
  bodyPrint(`// rsProc = [${rsProc.join()}];`)
  bodyPrint(`// rsMProc = [${rsMProc.join()}];`)
  bodyWrite()
  console.log(`Hardware generation time: ${Date.now() - start - softwareAdderTime - softwareMaxTime}; Software JS processing time (adder): ${softwareAdderTime} ; Software JS processing time (max-pooling): ${softwareMaxTime}`)
  return {
    rsProc,
    rsMProc
  }
}