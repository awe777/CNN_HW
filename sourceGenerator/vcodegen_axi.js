function ceilLog2(v) {
    return +v > 1 ? Math.ceil(Math.log2(+v)) : (+v - 1 ? NaN : 0)
}

function generate(v, r, dl = 0) {
    const start = Date.now()
    v = +v > 0 ? +v : 0
    if(!v) {
        return;
    }
    r = +r > 0 ? Math.floor(+r): 0
    bodyReset();
    const dataLength = +dl ? +dl : 32;
    /**
     * dataLength diatur menurut jenis data yang dipegang register:
     * * 16 untuk 16-bit fixed-point
     * * 32 untuk 32-bit fixed-point
     * * 64 untuk 64-bit fixed-point
     * 
     * wire yang diperlukan berbanding linier dengan dataLength
     */    
    bodyPrint(`// IMPORTANT: RENAME FILE TO \"axi_cnn.v\"`)
    bodyPrint(`// input data word length is ${dataLength}`)
    bodyPrint(`// input from shift register that holds source matrix data is in0 to in${v * v - 1}`)
    bodyPrint(`// input from shift register that holds weight matrix data is wg0 to wg${v * v - 1}`)
    bodyPrint(`// input from clock that drives this system is masterClock`)
    bodyPrint(`// input from reset that refreshes this system is masterReset`)
    bodyPrint(`// output of convolutional multiplication is out0 to out${v * v - 1}`)
    r ? bodyPrint(`// the maximum amount of adder connected serially while not exceeding the delay of 1 multiplier is ${r}`) : null
    bodyPrint(`// Alert: main module - convmultCore`)   // !!! ALERT !!!
    let opening = "module convmultCore("
    let ioList = ""
    for(o = 0; o < v * v; o++) {
        opening = opening + `in${o}, wg${o}, out${o}, `
        ioList = ioList + `input [${dataLength - 1}:0] in${o};` + "\n" + `input [${dataLength - 1}:0] wg${o};` + "\n" + `output [${dataLength - 1}:0] out${o};` + "\n"
    }
    bodyPrint(opening + `enabler, masterClock, masterReset);`)
    
    bodyPrint(ioList + `input masterClock;` + "\n" + `input masterReset;` + "\n" + `input enabler;` + "\n" + `wire processedClock = enabler && masterClock;`)
    for(iny = 0; iny < v * v; iny++){
        bodyPrint(`reg [${dataLength - 1}:0] multxInput${iny};`)
    }
    bodyPrint(`wire [${dataLength - 1}:0] outTemp;`)
    bodyPrint(`reg [${ceilLog2(v * v)}:0] counter;`)
    const workspace = new Array(v * v);
    for(i = 0; i < workspace.length; i++) {
        workspace[i] = new Array(v * v);
        for(j = 0; j < workspace[i].length; j++) {
            workspace[i][j] = "in" + (((Math.floor(i / v) + i % v) % v) * v + ((Math.floor(j / v) + j % v) % v))
        }
    } // O(n^4) with input = n

    const output = new Array(v * v);
    for(k = 0; k < output.length; k++) {
        output[k] = new Array(v * v);
        for(l = 0; l < output[k].length; l++) {
            output[k][l] = workspace[Math.floor(k / v) * v + Math.floor(l / v)][(k % v) * v + l % v];
        }
    } // O(n^4) with input = n

    // TODO -> rewrite:
    // FROM multiple modules for each out${index} using dynamic ${outx[m]} as image data and static wg${m} as weight data
    // INTO single module outputting out${index} per clock, keeping wg${m} as static input and using multiplexer connected to counter to control image data ${outx[m]}

    for(something = 0; something < v * v; something++) {
        bodyPrint(`mult2reg outMult${something} (`)
        bodyPrint(`   .in0(out${something}),`)
        bodyPrint(`   .in1(outTemp),`)
        bodyPrint(`   .sel(counter == ${ceilLog2(v * v) + 1}'d${something + ceilLog2(v * v) - 2}),`)
        bodyPrint(`   .out(out${something}),`)
        bodyPrint(`   .clk(processedClock),`)
        bodyPrint(`   .rst(masterReset)`)
        bodyPrint(`);`)
    }

    bodyPrint(`// begin writing submodule instance`)
    bodyPrint(`multx multxPrime (`)
    for(m = 0; m < v * v; m++) {
        bodyPrint(`   .d${m} (wg${m}),`)
        bodyPrint(`   .i${m} (multxInput${m}),`)
    }
    bodyPrint(`   .out (outTemp),`)
    bodyPrint(`   .clk (processedClock),`)
    bodyPrint(`   .rst (masterReset)`)
    bodyPrint(`);`)

    bodyPrint(`// begin writing multiplexer instances`)
    for(currentMultiplexer = 0; currentMultiplexer < v * v; currentMultiplexer++) {
        bodyPrint(`// multiplexer with output of multxInput${currentMultiplexer}`)
        bodyPrint(`always @(*)`)
        bodyPrint(`   begin`)
        bodyPrint(`      case(counter)`)
        for(currentCase = 0; currentCase < v * v; currentCase++) {
            bodyPrint(`         ${currentCase}: multxInput${currentMultiplexer} = ${output[currentMultiplexer][currentCase]};`)
        }
        bodyPrint(`         default: multxInput${currentMultiplexer} = ${dataLength}'b0;`)
        bodyPrint(`      endcase`)
        bodyPrint(`   end`)
    }

    bodyPrint(`always @(posedge masterClock or negedge masterReset)`)
    bodyPrint(`   begin`)
    bodyPrint(`      counter <= masterReset & enabler ? counter + 1 : ${ceilLog2(v * v) + 1}'b0;`)
    bodyPrint(`   end`)
    // end of code rewrite
    bodyPrint(`endmodule`)
    bodyPrint(`// end alert`)
    

    let opening2 = "module multx("
    for(n = 0; n < v * v; n++) {
        opening2 = opening2 + `d${n}, i${n}, `
    }
    bodyPrint(opening2 + `out, clk, rst);`)
    for(n = 0; n < v * v; n++) {
        bodyPrint(`input  [${dataLength - 1}:0]     d${n};`)
        bodyPrint(`input  [${dataLength - 1}:0]     i${n};`)
        bodyPrint(`wire signed [${dataLength - 1}:0]     w${n};`)
        bodyPrint(`multiplier mult${n} (.in0(d${n}), .in1(i${n}), .out(w${n}));`)
        bodyPrint(`reg signed [${dataLength - 1}:0]     w0_${n};`)
    }
    const layerCount = ceilLog2(v * v);
    let current = v * v;
    let previous = v * v;
    const lhs = [];
    const rhs = [];
    for(x = 0; x < layerCount; x++) {
        current = Math.ceil(current / 2)
        for(y = 0; y < current; y++) {
            if(2 * y + 1 < previous) {
                if(r && !((x + 1) % r) && (x + 1) != layerCount) {
                    bodyPrint(`reg signed [${dataLength - 1}:0]     w${x + 1}_${y};`)
                    bodyPrint(`wire signed [${dataLength - 1}:0]     w${x + 1}_${y}d = w${x}_${2 * y} + w${x}_${2 * y + 1};`)
                    lhs.push(`w${x + 1}_${y}`)
                    rhs.push(`w${x + 1}_${y}d`)
                } else {
                    bodyPrint(`wire signed [${dataLength - 1}:0]     w${x + 1}_${y} = w${x}_${2 * y} + w${x}_${2 * y + 1};`)
                }
            } else {
                if(r && !((x + 1) % r) && (x + 1) != layerCount) {
                    bodyPrint(`reg signed [${dataLength - 1}:0]     w${x + 1}_${y};`)
                    lhs.push(`w${x + 1}_${y}`)
                    rhs.push(`w${x}_${2 * y}`)
                } else {
                    bodyPrint(`wire signed [${dataLength - 1}:0]     w${x + 1}_${y} = w${x}_${2 * y};`)
                }
            }
        }
        previous = current;
    }
    bodyPrint(`input clk;`)
    bodyPrint(`input rst;`)
    bodyPrint(`output  [${dataLength - 1}:0]    out;`)
    bodyPrint(`// end of submodule parameter`)

    bodyPrint(`assign out = w${layerCount}_0;`)

    bodyPrint(`always @(posedge clk or negedge rst)`)
    bodyPrint(`   begin`)
    for(c = 0; c < v * v; c++) {
        bodyPrint(`      w0_${c} <= rst ? w${c} : ${dataLength}'b0;`)
    }
    lhs.forEach((entry, index) => {
        bodyPrint(`      ${entry} <= rst ? ${rhs[index]} : ${dataLength}'b0;`)
    })
    bodyPrint(`   end`)
    bodyPrint(`endmodule`)
    
    bodyPrint(`module multiplier(in0, in1, out);`)
    bodyPrint(`input [${dataLength - 1}:0] in0, in1;`)
    bodyPrint(`wire signed [${2 * dataLength - 1}:0] outMem = in0 * in1;`)
    bodyPrint(`output [${dataLength - 1}:0] out;`)
    bodyPrint(`assign out = outMem[${24 + dataLength - 1}:24];`)
    bodyPrint(`endmodule`)

    bodyPrint(`module mult2reg(in0, in1, sel, out, clk, rst);`)
    bodyPrint(`input [${dataLength - 1}:0] in0, in1;`)
    bodyPrint(`input sel, clk, rst;`)
    bodyPrint(`reg signed [${dataLength - 1}:0] outq;`)
    bodyPrint(`output [${dataLength - 1}:0] out;`)
    bodyPrint(`assign out = outq;`)

    bodyPrint(`always @(posedge clk or negedge rst)`)
    bodyPrint(`   begin`)
    bodyPrint(`      outq <= rst ? (sel ? in1 : in0) : ${dataLength}'b0;`)
    bodyPrint(`   end`)
    bodyPrint(`endmodule`)
    console.log(Date.now() - start)
    document.getElementById("saveButton") ? document.getElementById("saveButton").hidden = false : null;
}