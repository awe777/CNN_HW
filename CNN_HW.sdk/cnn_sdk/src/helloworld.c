#include <stdio.h>
#include <stdint.h>
#include <sleep.h>
uint32_t *control = (uint32_t *) 0x40000000;
int main() {
  // deactivate hardware processing
  *(control) = 0;
  // MARKER = SIGN
  // input image data to image "array"
  *(control + 1) = 50331648; // 3
  *(control + 2) = 16777216; // 1
  *(control + 3) = 33554432; // 2
  *(control + 4) = 0;
  *(control + 5) = 0;
  *(control + 6) = 0;
  *(control + 7) = 0;
  *(control + 8) = 0;
  *(control + 9) = 117440512; // 7
  *(control + 10) = 16777216; // 1
  *(control + 11) = 67108864; // 4
  *(control + 12) = 0;
  *(control + 13) = 0;
  *(control + 14) = 0;
  *(control + 15) = 0;
  *(control + 16) = 0;
  *(control + 17) = 0;
  *(control + 18) = 16777216; // 1
  *(control + 19) = 83886080; // 5
  *(control + 20) = 0;
  *(control + 21) = 0;
  *(control + 22) = 0;
  *(control + 23) = 0;
  *(control + 24) = 0;
  *(control + 25) = 0;
  *(control + 26) = 0;
  *(control + 27) = 0;
  *(control + 28) = 0;
  *(control + 29) = 0;
  *(control + 30) = 0;
  *(control + 31) = 0;
  *(control + 32) = 0;
  *(control + 33) = 0;
  *(control + 34) = 0;
  *(control + 35) = 0;
  *(control + 36) = 0;
  *(control + 37) = 0;
  *(control + 38) = 0;
  *(control + 39) = 0;
  *(control + 40) = 0;
  *(control + 41) = 0;
  *(control + 42) = 0;
  *(control + 43) = 0;
  *(control + 44) = 0;
  *(control + 45) = 0;
  *(control + 46) = 0;
  *(control + 47) = 0;
  *(control + 48) = 0;
  *(control + 49) = 0;
  *(control + 50) = 0;
  *(control + 51) = 0;
  *(control + 52) = 0;
  *(control + 53) = 0;
  *(control + 54) = 0;
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
  printf("%d,\n", (int) *(control + 1) >> 24);
  printf("%d,\n", (int) *(control + 2) >> 24);
  printf("%d,\n", (int) *(control + 3) >> 24);
  printf("%d,\n", (int) *(control + 4) >> 24);
  printf("%d,\n", (int) *(control + 5) >> 24);
  printf("%d,\n", (int) *(control + 6) >> 24);
  printf("%d,\n", (int) *(control + 7) >> 24);
  printf("%d,\n", (int) *(control + 8) >> 24);
  printf("%d,\n", (int) *(control + 9) >> 24);
  printf("%d,\n", (int) *(control + 10) >> 24);
  printf("%d,\n", (int) *(control + 11) >> 24);
  printf("%d,\n", (int) *(control + 12) >> 24);
  printf("%d,\n", (int) *(control + 13) >> 24);
  printf("%d,\n", (int) *(control + 14) >> 24);
  printf("%d,\n", (int) *(control + 15) >> 24);
  printf("%d,\n", (int) *(control + 16) >> 24);
  printf("%d,\n", (int) *(control + 17) >> 24);
  printf("%d,\n", (int) *(control + 18) >> 24);
  printf("%d,\n", (int) *(control + 19) >> 24);
  printf("%d,\n", (int) *(control + 20) >> 24);
  printf("%d,\n", (int) *(control + 21) >> 24);
  printf("%d,\n", (int) *(control + 22) >> 24);
  printf("%d,\n", (int) *(control + 23) >> 24);
  printf("%d,\n", (int) *(control + 24) >> 24);
  printf("%d,\n", (int) *(control + 25) >> 24);
  printf("%d,\n", (int) *(control + 26) >> 24);
  printf("%d,\n", (int) *(control + 27) >> 24);
  printf("%d,\n", (int) *(control + 28) >> 24);
  printf("%d,\n", (int) *(control + 29) >> 24);
  printf("%d,\n", (int) *(control + 30) >> 24);
  printf("%d,\n", (int) *(control + 31) >> 24);
  printf("%d,\n", (int) *(control + 32) >> 24);
  printf("%d,\n", (int) *(control + 33) >> 24);
  printf("%d,\n", (int) *(control + 34) >> 24);
  printf("%d,\n", (int) *(control + 35) >> 24);
  printf("%d,\n", (int) *(control + 36) >> 24);
  printf("%d,\n", (int) *(control + 37) >> 24);
  printf("%d,\n", (int) *(control + 38) >> 24);
  printf("%d,\n", (int) *(control + 39) >> 24);
  printf("%d,\n", (int) *(control + 40) >> 24);
  printf("%d,\n", (int) *(control + 41) >> 24);
  printf("%d,\n", (int) *(control + 42) >> 24);
  printf("%d,\n", (int) *(control + 43) >> 24);
  printf("%d,\n", (int) *(control + 44) >> 24);
  printf("%d,\n", (int) *(control + 45) >> 24);
  printf("%d,\n", (int) *(control + 46) >> 24);
  printf("%d,\n", (int) *(control + 47) >> 24);
  printf("%d,\n", (int) *(control + 48) >> 24);
  printf("%d,\n", (int) *(control + 49) >> 24);
  printf("%d,\n", (int) *(control + 50) >> 24);
  printf("%d,\n", (int) *(control + 51) >> 24);
  printf("%d,\n", (int) *(control + 52) >> 24);
  printf("%d,\n", (int) *(control + 53) >> 24);
  printf("%d,\n", (int) *(control + 54) >> 24);
  printf("%d,\n", (int) *(control + 55) >> 24);
  printf("%d,\n", (int) *(control + 56) >> 24);
  printf("%d,\n", (int) *(control + 57) >> 24);
  printf("%d,\n", (int) *(control + 58) >> 24);
  printf("%d,\n", (int) *(control + 59) >> 24);
  printf("%d,\n", (int) *(control + 60) >> 24);
  printf("%d,\n", (int) *(control + 61) >> 24);
  printf("%d,\n", (int) *(control + 62) >> 24);
  printf("%d,\n", (int) *(control + 63) >> 24);
  printf("%d,\n", (int) *(control + 64) >> 24);
  printf("]\n");
  // input weight data to weight "array"
  *(control + 65) = 33554432; // 2
  *(control + 66) = 67108864; // 4
  *(control + 67) = 0;
  *(control + 68) = 0;
  *(control + 69) = 0;
  *(control + 70) = 0;
  *(control + 71) = 0;
  *(control + 72) = 16777216; // 1
  *(control + 73) = 33554432; // 2
  *(control + 74) = 0;
  *(control + 75) = 0;
  *(control + 76) = 0;
  *(control + 77) = 0;
  *(control + 78) = 0;
  *(control + 79) = 0;
  *(control + 80) = 0;
  *(control + 81) = 0;
  *(control + 82) = 0;
  *(control + 83) = 0;
  *(control + 84) = 0;
  *(control + 85) = 0;
  *(control + 86) = 0;
  *(control + 87) = 0;
  *(control + 88) = 0;
  *(control + 89) = 0;
  *(control + 90) = 0;
  *(control + 91) = 0;
  *(control + 92) = 0;
  *(control + 93) = 0;
  *(control + 94) = 0;
  *(control + 95) = 0;
  *(control + 96) = 0;
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
  printf("%d,\n", (int) *(control + 65) >> 24);
  printf("%d,\n", (int) *(control + 66) >> 24);
  printf("%d,\n", (int) *(control + 67) >> 24);
  printf("%d,\n", (int) *(control + 68) >> 24);
  printf("%d,\n", (int) *(control + 69) >> 24);
  printf("%d,\n", (int) *(control + 70) >> 24);
  printf("%d,\n", (int) *(control + 71) >> 24);
  printf("%d,\n", (int) *(control + 72) >> 24);
  printf("%d,\n", (int) *(control + 73) >> 24);
  printf("%d,\n", (int) *(control + 74) >> 24);
  printf("%d,\n", (int) *(control + 75) >> 24);
  printf("%d,\n", (int) *(control + 76) >> 24);
  printf("%d,\n", (int) *(control + 77) >> 24);
  printf("%d,\n", (int) *(control + 78) >> 24);
  printf("%d,\n", (int) *(control + 79) >> 24);
  printf("%d,\n", (int) *(control + 80) >> 24);
  printf("%d,\n", (int) *(control + 81) >> 24);
  printf("%d,\n", (int) *(control + 82) >> 24);
  printf("%d,\n", (int) *(control + 83) >> 24);
  printf("%d,\n", (int) *(control + 84) >> 24);
  printf("%d,\n", (int) *(control + 85) >> 24);
  printf("%d,\n", (int) *(control + 86) >> 24);
  printf("%d,\n", (int) *(control + 87) >> 24);
  printf("%d,\n", (int) *(control + 88) >> 24);
  printf("%d,\n", (int) *(control + 89) >> 24);
  printf("%d,\n", (int) *(control + 90) >> 24);
  printf("%d,\n", (int) *(control + 91) >> 24);
  printf("%d,\n", (int) *(control + 92) >> 24);
  printf("%d,\n", (int) *(control + 93) >> 24);
  printf("%d,\n", (int) *(control + 94) >> 24);
  printf("%d,\n", (int) *(control + 95) >> 24);
  printf("%d,\n", (int) *(control + 96) >> 24);
  printf("%d,\n", (int) *(control + 97) >> 24);
  printf("%d,\n", (int) *(control + 98) >> 24);
  printf("%d,\n", (int) *(control + 99) >> 24);
  printf("%d,\n", (int) *(control + 100) >> 24);
  printf("%d,\n", (int) *(control + 101) >> 24);
  printf("%d,\n", (int) *(control + 102) >> 24);
  printf("%d,\n", (int) *(control + 103) >> 24);
  printf("%d,\n", (int) *(control + 104) >> 24);
  printf("%d,\n", (int) *(control + 105) >> 24);
  printf("%d,\n", (int) *(control + 106) >> 24);
  printf("%d,\n", (int) *(control + 107) >> 24);
  printf("%d,\n", (int) *(control + 108) >> 24);
  printf("%d,\n", (int) *(control + 109) >> 24);
  printf("%d,\n", (int) *(control + 110) >> 24);
  printf("%d,\n", (int) *(control + 111) >> 24);
  printf("%d,\n", (int) *(control + 112) >> 24);
  printf("%d,\n", (int) *(control + 113) >> 24);
  printf("]\n");
  // activate hardware processing
  *(control) = 0xffffffff;
  // sleep while hardware is processing, time slept given for the hardware is 120% of hardware processing time to the nearest us
  usleep(1);
  // deactivate hardware processing
  *(control) = 0;
  printf("result = [\n");
  printf("%d,\n", (int) *(control + 114) >> 16);
  printf("%d,\n", (int) *(control + 115) >> 16);
  printf("%d,\n", (int) *(control + 116) >> 16);
  printf("%d,\n", (int) *(control + 117) >> 16);
  printf("%d,\n", (int) *(control + 118) >> 16);
  printf("%d,\n", (int) *(control + 119) >> 16);
  printf("%d,\n", (int) *(control + 120) >> 16);
  printf("%d,\n", (int) *(control + 121) >> 16);
  printf("%d,\n", (int) *(control + 122) >> 16);
  printf("%d,\n", (int) *(control + 123) >> 16);
  printf("%d,\n", (int) *(control + 124) >> 16);
  printf("%d,\n", (int) *(control + 125) >> 16);
  printf("%d,\n", (int) *(control + 126) >> 16);
  printf("%d,\n", (int) *(control + 127) >> 16);
  printf("%d,\n", (int) *(control + 128) >> 16);
  printf("%d,\n", (int) *(control + 129) >> 16);
  printf("%d,\n", (int) *(control + 130) >> 16);
  printf("%d,\n", (int) *(control + 131) >> 16);
  printf("%d,\n", (int) *(control + 132) >> 16);
  printf("%d,\n", (int) *(control + 133) >> 16);
  printf("%d,\n", (int) *(control + 134) >> 16);
  printf("%d,\n", (int) *(control + 135) >> 16);
  printf("%d,\n", (int) *(control + 136) >> 16);
  printf("%d,\n", (int) *(control + 137) >> 16);
  printf("%d,\n", (int) *(control + 138) >> 16);
  printf("%d,\n", (int) *(control + 139) >> 16);
  printf("%d,\n", (int) *(control + 140) >> 16);
  printf("%d,\n", (int) *(control + 141) >> 16);
  printf("%d,\n", (int) *(control + 142) >> 16);
  printf("%d,\n", (int) *(control + 143) >> 16);
  printf("%d,\n", (int) *(control + 144) >> 16);
  printf("%d,\n", (int) *(control + 145) >> 16);
  printf("%d,\n", (int) *(control + 146) >> 16);
  printf("%d,\n", (int) *(control + 147) >> 16);
  printf("%d,\n", (int) *(control + 148) >> 16);
  printf("%d,\n", (int) *(control + 149) >> 16);
  printf("%d,\n", (int) *(control + 150) >> 16);
  printf("%d,\n", (int) *(control + 151) >> 16);
  printf("%d,\n", (int) *(control + 152) >> 16);
  printf("%d,\n", (int) *(control + 153) >> 16);
  printf("%d,\n", (int) *(control + 154) >> 16);
  printf("%d,\n", (int) *(control + 155) >> 16);
  printf("%d,\n", (int) *(control + 156) >> 16);
  printf("%d,\n", (int) *(control + 157) >> 16);
  printf("%d,\n", (int) *(control + 158) >> 16);
  printf("%d,\n", (int) *(control + 159) >> 16);
  printf("%d,\n", (int) *(control + 160) >> 16);
  printf("%d,\n", (int) *(control + 161) >> 16);
  printf("%d,\n", (int) *(control + 162) >> 16);
  printf("%d,\n", (int) *(control + 163) >> 16);
  printf("%d,\n", (int) *(control + 164) >> 16);
  printf("%d,\n", (int) *(control + 165) >> 16);
  printf("%d,\n", (int) *(control + 166) >> 16);
  printf("%d,\n", (int) *(control + 167) >> 16);
  printf("%d,\n", (int) *(control + 168) >> 16);
  printf("%d,\n", (int) *(control + 169) >> 16);
  printf("%d,\n", (int) *(control + 170) >> 16);
  printf("%d,\n", (int) *(control + 171) >> 16);
  printf("%d,\n", (int) *(control + 172) >> 16);
  printf("%d,\n", (int) *(control + 173) >> 16);
  printf("%d,\n", (int) *(control + 174) >> 16);
  printf("%d,\n", (int) *(control + 175) >> 16);
  printf("%d,\n", (int) *(control + 176) >> 16);
  printf("%d,\n", (int) *(control + 177) >> 16);
  printf("]\n");
  // MARKER = REPEAT from SIGN ad infinitum
}
