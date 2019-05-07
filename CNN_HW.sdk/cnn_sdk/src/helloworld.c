#include <stdio.h>
#include <stdint.h>
#include <sleep.h>
uint32_t *control = (uint32_t *) 0x40000000;
int main() {
  // deactivate hardware processing
  *(control) = 0;
  // MARKER = SIGN
  // input image data to image "array"
  *(control + 1) = -1948008448; // -116.1103515625
  *(control + 2) = -1935032320; // -115.3369140625
  *(control + 3) = 1065467904; // 63.5068359375
  *(control + 4) = -1427537920; // -85.087890625
  *(control + 5) = -2021523456; // -120.4921875
  *(control + 6) = -408666112; // -24.3583984375
  *(control + 7) = 1435516928; // 85.5634765625
  *(control + 8) = 1137852416; // 67.8212890625
  *(control + 9) = -259801088; // -15.4853515625
  *(control + 10) = -960937984; // -57.2763671875
  *(control + 11) = -741212160; // -44.1796875
  *(control + 12) = -320274432; // -19.08984375
  *(control + 13) = 1891532800; // 112.744140625
  *(control + 14) = 829063168; // 49.416015625
  *(control + 15) = 1889353728; // 112.6142578125
  *(control + 16) = 1782693888; // 106.2568359375
  *(control + 17) = -395575296; // -23.578125
  *(control + 18) = -1880539136; // -112.0888671875
  *(control + 19) = 1291059200; // 76.953125
  *(control + 20) = -2054619136; // -122.46484375
  *(control + 21) = -909721600; // -54.2236328125
  *(control + 22) = 1723203584; // 102.7109375
  *(control + 23) = 436633600; // 26.025390625
  *(control + 24) = 830160896; // 49.4814453125
  *(control + 25) = -1072840704; // -63.9462890625
  *(control + 26) = -525877248; // -31.3447265625
  *(control + 27) = 1609302016; // 95.921875
  *(control + 28) = -2115584000; // -126.0986328125
  *(control + 29) = 1962852352; // 116.9951171875
  *(control + 30) = -1809727488; // -107.8681640625
  *(control + 31) = -1087832064; // -64.83984375
  *(control + 32) = -1064992768; // -63.478515625
  *(control + 33) = -84754432; // -5.0517578125
  *(control + 34) = -77103104; // -4.595703125
  *(control + 35) = 1730985984; // 103.1748046875
  *(control + 36) = 1463926784; // 87.2568359375
  *(control + 37) = 1778581504; // 106.01171875
  *(control + 38) = -1803681792; // -107.5078125
  *(control + 39) = -2007990272; // -119.685546875
  *(control + 40) = 1135558656; // 67.6845703125
  *(control + 41) = -1181843456; // -70.443359375
  *(control + 42) = 1575747584; // 93.921875
  *(control + 43) = -1324613632; // -78.953125
  *(control + 44) = -1900937216; // -113.3046875
  *(control + 45) = -14811136; // -0.8828125
  *(control + 46) = -167641088; // -9.9921875
  *(control + 47) = -67076096; // -3.998046875
  *(control + 48) = 1365671936; // 81.400390625
  *(control + 49) = -399933440; // -23.837890625
  *(control + 50) = -1784889344; // -106.3876953125
  *(control + 51) = -686555136; // -40.921875
  *(control + 52) = -538755072; // -32.1123046875
  *(control + 53) = -1242988544; // -74.087890625
  *(control + 54) = 66961408; // 3.9912109375
  *(control + 55) = 0;
  *(control + 56) = 0;
  *(control + 57) = 0;
  *(control + 58) = 0;
  *(control + 59) = 0;
  *(control + 60) = 0;
  *(control + 61) = 0;
  *(control + 62) = 0;
  *(control + 63) = 0;
  *(control + 64) = 0;
  printf("image = [\n");
  printf("%f,\n", (double) ((int)*(control + 1)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 2)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 3)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 4)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 5)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 6)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 7)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 8)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 9)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 10)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 11)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 12)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 13)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 14)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 15)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 16)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 17)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 18)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 19)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 20)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 21)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 22)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 23)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 24)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 25)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 26)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 27)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 28)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 29)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 30)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 31)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 32)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 33)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 34)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 35)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 36)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 37)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 38)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 39)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 40)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 41)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 42)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 43)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 44)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 45)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 46)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 47)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 48)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 49)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 50)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 51)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 52)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 53)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 54)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 55)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 56)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 57)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 58)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 59)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 60)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 61)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 62)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 63)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 64)) / 16777216);
  printf("]\n");
  // input weight data to weight "array"
  *(control + 65) = -1688076288; // -100.6171875
  *(control + 66) = 1442168832; // 85.9599609375
  *(control + 67) = -1023344640; // -60.99609375
  *(control + 68) = -1488158720; // -88.701171875
  *(control + 69) = 27787264; // 1.65625
  *(control + 70) = 1065025536; // 63.48046875
  *(control + 71) = 0;
  *(control + 72) = 1172733952; // 69.900390625
  *(control + 73) = -1633304576; // -97.3525390625
  *(control + 74) = 1952612352; // 116.384765625
  *(control + 75) = 227082240; // 13.53515625
  *(control + 76) = -2125053952; // -126.6630859375
  *(control + 77) = -1959411712; // -116.7900390625
  *(control + 78) = 0;
  *(control + 79) = 410697728; // 24.4794921875
  *(control + 80) = -189382656; // -11.2880859375
  *(control + 81) = 652607488; // 38.8984375
  *(control + 82) = -1851375616; // -110.3505859375
  *(control + 83) = 802684928; // 47.84375
  *(control + 84) = 288669696; // 17.2060546875
  *(control + 85) = 0;
  *(control + 86) = -977879040; // -58.2861328125
  *(control + 87) = -1373863936; // -81.888671875
  *(control + 88) = 1885863936; // 112.40625
  *(control + 89) = -1940242432; // -115.6474609375
  *(control + 90) = 1268826112; // 75.6279296875
  *(control + 91) = -463585280; // -27.6318359375
  *(control + 92) = 0;
  *(control + 93) = 1190739968; // 70.9736328125
  *(control + 94) = 751091712; // 44.7685546875
  *(control + 95) = 1356349440; // 80.8447265625
  *(control + 96) = -401391616; // -23.9248046875
  *(control + 97) = 0;
  *(control + 98) = 0;
  *(control + 99) = 0;
  *(control + 100) = 0;
  *(control + 101) = 0;
  *(control + 102) = 0;
  *(control + 103) = 0;
  *(control + 104) = 0;
  *(control + 105) = 0;
  *(control + 106) = 0;
  *(control + 107) = 0;
  *(control + 108) = 0;
  *(control + 109) = 0;
  *(control + 110) = 0;
  *(control + 111) = 0;
  *(control + 112) = 0;
  *(control + 113) = 0;
  printf("weight = [\n");
  printf("%f,\n", (double) ((int)*(control + 65)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 66)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 67)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 68)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 69)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 70)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 71)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 72)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 73)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 74)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 75)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 76)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 77)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 78)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 79)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 80)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 81)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 82)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 83)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 84)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 85)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 86)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 87)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 88)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 89)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 90)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 91)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 92)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 93)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 94)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 95)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 96)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 97)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 98)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 99)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 100)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 101)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 102)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 103)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 104)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 105)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 106)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 107)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 108)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 109)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 110)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 111)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 112)) / 16777216);
  printf("%f,\n", (double) ((int)*(control + 113)) / 16777216);
  printf("]\n");
  // activate hardware processing
  *(control) = 0xffffffff;
  // sleep while hardware is processing, time slept given for the hardware is 120% of hardware processing time to the nearest us
  usleep(1);
  // deactivate hardware processing
  *(control) = 0;
  printf("result = [\n");
  printf("%f,\n", (double) ((int)*(control + 114)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 115)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 116)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 117)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 118)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 119)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 120)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 121)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 122)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 123)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 124)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 125)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 126)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 127)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 128)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 129)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 130)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 131)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 132)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 133)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 134)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 135)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 136)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 137)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 138)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 139)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 140)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 141)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 142)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 143)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 144)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 145)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 146)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 147)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 148)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 149)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 150)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 151)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 152)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 153)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 154)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 155)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 156)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 157)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 158)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 159)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 160)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 161)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 162)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 163)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 164)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 165)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 166)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 167)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 168)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 169)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 170)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 171)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 172)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 173)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 174)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 175)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 176)) / 65536);
  printf("%f,\n", (double) ((int)*(control + 177)) / 65536);
  printf("]\n");
  // MARKER = REPEAT from SIGN ad infinitum
}
