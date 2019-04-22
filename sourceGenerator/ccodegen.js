function process(v = 0) {
  return (v < 128 && v >= -128) ? Math.floor(1024 * v) * 16384 : (v > 0) ? 0x7fffffff : 0xffffffff;
}

function generate(v, im = [], wg = [], ledControl = false) {
  v = +v > 1 ? +v : 0
  if(!v) {
    return -1;
  }
  Array.isArray(im) && im.length ? null : im = new Array(Math.floor(v * v * Math.random())).fill().map((p) => 256 * Math.random() - 128); console.log(im)
  Array.isArray(wg) && wg.length ? null : wg = new Array(Math.floor((v - 1) * (v - 1) * Math.random())).fill().map((p) => 256 * Math.random() - 128); console.log(wg)
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
  let softwareTime = Date.now();
  const rsProc = imProc.map((value, indexOffset) => {
    return wgProc.reduce((acc, currentValue, indexWeight) => {
      return acc + (currentValue / 16777216) * (imProc[(indexOffset + (indexWeight % (v - 1)) % v + v * (Math.floor(indexOffset / v) + Math.floor(indexWeight / (v - 1))))] / 16777216);
    }, 0)
  })
  softwareTime = Date.now() - softwareTime;
  console.log(rsProc);
  bodyReset();

  bodyPrint(`#include <stdio.h>`);
  bodyPrint(`#include <stdint.h>`);
  bodyPrint(`#include <time.h>`);
  bodyPrint(`uint32_t *control = (uint32_t *) 0x40000000;`);
  bodyPrint(`uint32_t *imArray = (uint32_t *) 0x40000004;`);
  bodyPrint(`uint32_t *wgArray = (uint32_t *) 0x${(0x40000000 + 4 * v * v).toString(16)}`)
  bodyPrint(`uint32_t *rsArray = (uint32_t *) 0x${(0x40000008 + 8 * v * (v - 1)).toString(16)}`)
  ledControl ? bodyPrint(`uint32_t *ledCtrl = (uint32_t *) 0x41200000;`) : null;

  bodyPrint(`int main() {`)
  bodyPrint(`  // deactivate hardware processing`)
  bodyPrint(`  *(control) = 0;`)
  bodyPrint(`  // MARKER = SIGN`)
  ledControl ? bodyPrint(`  *(ledCtrl) = 0b0000;`) : null;
  bodyPrint(`  // input image data to image "array"`)
  for(count0 = 0; count0 < imProc.length; count0++) {
    bodyPrint(`  *(imArray + ${count0}) = ${imProc[count0]};`)
  }
  bodyPrint(`  // input weight data to weight "array"`)
  for(count1 = 0; count1 < wgProc.length; count1++) {
    bodyPrint(`  *(wgArray + ${count1}) = ${wgProc[count1]};`)
  }
  bodyPrint(`  // activate hardware processing`)
  bodyPrint(`  *(control) = 0xffffffff;`)
  bodyPrint(`  // sleep while hardware is processing, time slept given for the hardware is 120% of hardware processing time`)
  bodyPrint(`  nanosleep((const struct timespec[]){{0, ${12 * (v * v + Math.ceil(Math.log2(v * v)) - 2)}L}}, NULL);`)
  bodyPrint(`  // deactivate hardware processing`)
  bodyPrint(`  *(control) = 0;`)
  ledControl ? bodyPrint(`  *(ledCtrl) = 0b1111;`) : null;
  for(count0 = 0; count0 < imProc.length; count0++) {
    bodyPrint(`  printf("%d\\n", *(rsArray + ${count0}));`)
  }
  bodyPrint(`  // MARKER = REPEAT from SIGN ad infinitum`)
  bodyPrint(`}`)
  bodyWrite()
  console.log(`Hardware generation time: ${Date.now() - start - softwareTime}; Software JS processing time: ${softwareTime}`)
}