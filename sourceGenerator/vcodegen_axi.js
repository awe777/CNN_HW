function ceilLog2(v) {
    return +v > 1 ? Math.ceil(Math.log2(+v)) : (+v - 1 ? NaN : 0)
}

function generate(v, r) {
    const start = Date.now()
    v = +v > 0 ? +v : 0
    if(!v) {
        return;
    }
    r = +r > 0 ? Math.floor(+r): 0
    bodyReset();
    const dataLength = 18; // because DSP48 only has 25x18 multiplier; 32 bit data will take 4 DSP units to implement 1 multiplier
    const fixedPoint = 10;
    /**
     * dataLength diatur menurut jenis data yang dipegang register:
     * * 16 untuk 16-bit fixed-point
     * * 32 untuk 32-bit fixed-point
     * * 64 untuk 64-bit fixed-point
     * 
     * wire yang diperlukan berbanding linier dengan dataLength
     */    
    bodyPrint(`// maximum matrix size is ${v} by ${v} for image data and ${v - 1} by ${v - 1} for weight data`)
    bodyPrint(`// input data word length is ${dataLength} bits, uses ${8 * Math.ceil(dataLength / 8)} bits of register for each entry`)
    bodyPrint(`// data is a fixed-point fraction with ${dataLength - fixedPoint} integer bits and ${fixedPoint} fraction bits`)
    bodyPrint(`// accepted address range is [offset + 0x00000000, offset + 0x00ffffff) with jumps of 4 for each register`)
    bodyPrint(`// there are ${(v - 1) * (3 * v + 1) + 3} registers in this AXI node`)
    bodyPrint(`// input from clock that drives this system is masterClock`)
    bodyPrint(`// input from reset that refreshes this system is masterReset`)
    r ? bodyPrint(`// the maximum amount of adder connected serially while not exceeding the delay of 1 multiplier is ${r}`) : null

    bodyPrint(`\`timescale 1ns / 1ps`);
    bodyPrint(`module axi_cnn(`);
    bodyPrint(`	// ### Clock and reset signals #########################################`);
    bodyPrint(`	input  wire        	aclk,`);
    bodyPrint(`	input  wire        	aresetn,`);
    bodyPrint(`	// ### AXI4-lite slave signals #########################################`);
    bodyPrint(`	// *** Write address signals ***`);
    bodyPrint(`    output wire        	s_axi_awready,`);
    bodyPrint(`	input  wire [31:0] 	s_axi_awaddr,`);
    bodyPrint(`	input  wire        	s_axi_awvalid,`);
    bodyPrint(`	// *** Write data signals ***`);
    bodyPrint(`    output wire        	s_axi_wready,`);
    bodyPrint(`	input  wire [31:0] 	s_axi_wdata,`);
    bodyPrint(`	input  wire [3:0]  	s_axi_wstrb,`);
    bodyPrint(`	input  wire        	s_axi_wvalid,`);
    bodyPrint(`	// *** Write response signals ***`);
    bodyPrint(`    input  wire        	s_axi_bready,`);
    bodyPrint(`	output wire [1:0]  	s_axi_bresp,`);
    bodyPrint(`	output wire        	s_axi_bvalid,`);
    bodyPrint(`	// *** Read address signals ***`);
    bodyPrint(`    output wire        	s_axi_arready,`);
    bodyPrint(`	input  wire [31:0] 	s_axi_araddr,`);
    bodyPrint(`	input  wire        	s_axi_arvalid,`);
    bodyPrint(`	// *** Read data signals ***	`);
    bodyPrint(`    input  wire        	s_axi_rready,`);
    bodyPrint(`	output wire [31:0] 	s_axi_rdata,`);
    bodyPrint(`	output wire [1:0]  	s_axi_rresp,`);
    bodyPrint(`	output wire        	s_axi_rvalid`);
    bodyPrint(`	// ### User signals ####################################################`);
    bodyPrint(`);`);
    bodyPrint(``);
    bodyPrint(`// ### Register map ########################################################`);
    // change address bit length to at most 25, in order to put these values to RAM
    bodyPrint(`localparam 	C_ADDR_BITS = 24;`);
    // end of bit length
    bodyPrint(`// *** Address ***`);
    // change to dynamic # of registers and distance
    for(addReg = 0; addReg <= (v - 1) * (3 * v + 1) + 2; addReg++) {
        bodyPrint(`localparam C_ADDR_REG${addReg} = 24'd${addReg * 4};`)
    }
    // end dynamic change
    bodyPrint(`// *** AXI write FSM ***`);
    bodyPrint(`localparam 	S_WRIDLE = 2'd0,`);
    bodyPrint(`			S_WRDATA = 2'd1,`);
    bodyPrint(`			S_WRRESP = 2'd2;`);
    bodyPrint(`// *** AXI read FSM ***`);
    bodyPrint(`localparam 	S_RDIDLE = 2'd0,`);
    bodyPrint(`			S_RDDATA = 2'd1;`);
    bodyPrint(`// *** AXI write ***`);
    bodyPrint(`reg [1:0] wstate_cs, wstate_ns;`);
    bodyPrint(`reg [C_ADDR_BITS-1:0] waddr;`);
    bodyPrint(`wire [31:0] wmask;`);
    bodyPrint(`wire aw_hs, w_hs;`);
    bodyPrint(`// *** AXI read ***`);
    bodyPrint(`reg [1:0] rstate_cs, rstate_ns;`);
    bodyPrint(`wire [C_ADDR_BITS-1:0] raddr;`);
    bodyPrint(`reg [31:0] rdata;`);
    bodyPrint(`wire ar_hs;`);
    bodyPrint(`// *** Registers ***`);
    bodyPrint(`// reg0 will be control register; hardware will run if one of its bits are 1`)
    bodyPrint(`// reg1 to reg${v * v} will be image data input`)
    bodyPrint(`// reg${v * v + 1} to reg${2 * v * (v - 1) + 1} will be weight data input`)
    bodyPrint(`// reg${2 * (v * v - v + 1)} to reg${(v - 1) * (3 * v + 1) + 2} will be processed data output`)
    // change to dynamic and change data length, if required
    for(dataReg = 0; dataReg <= (v - 1) * (3 * v + 1) + 2; dataReg++) {
        bodyPrint(`reg [${8 * Math.ceil(dataLength / 8) - 1}:0] reg${dataReg};`)
        dataReg < v * v ? bodyPrint(`wire [${dataLength - 1}:0] output${dataReg};`) : null;
    }
    // end dynamic change
    bodyPrint(`// ### AXI write ###########################################################`);
    bodyPrint(`assign s_axi_awready = (wstate_cs == S_WRIDLE);`);
    bodyPrint(`assign s_axi_wready = (wstate_cs == S_WRDATA);`);
    bodyPrint(`assign s_axi_bresp = 2'b00;    // OKAY`);
    bodyPrint(`assign s_axi_bvalid = (wstate_cs == S_WRRESP);`);
    bodyPrint(`assign wmask = {{8{s_axi_wstrb[3]}}, {8{s_axi_wstrb[2]}}, {8{s_axi_wstrb[1]}}, {8{s_axi_wstrb[0]}}};`);
    bodyPrint(`assign aw_hs = s_axi_awvalid & s_axi_awready;`);
    bodyPrint(`assign w_hs = s_axi_wvalid & s_axi_wready;`);
    bodyPrint(``);
    bodyPrint(`// *** Write state register ***`);
    bodyPrint(`always @(posedge aclk)`);
    bodyPrint(`begin`);
    bodyPrint(`	if (!aresetn)`);
    bodyPrint(`		wstate_cs <= S_WRIDLE;`);
    bodyPrint(`	else`);
    bodyPrint(`		wstate_cs <= wstate_ns;`);
    bodyPrint(`end`);
    bodyPrint(`// *** Write state next ***`);
    bodyPrint(`always @(*)`);
    bodyPrint(`begin`);
    bodyPrint(`	case (wstate_cs)`);
    bodyPrint(`		S_WRIDLE:`);
    bodyPrint(`			if (s_axi_awvalid)`);
    bodyPrint(`				wstate_ns = S_WRDATA;`);
    bodyPrint(`			else`);
    bodyPrint(`				wstate_ns = S_WRIDLE;`);
    bodyPrint(`		S_WRDATA:`);
    bodyPrint(`			if (s_axi_wvalid)`);
    bodyPrint(`				wstate_ns = S_WRRESP;`);
    bodyPrint(`			else`);
    bodyPrint(`				wstate_ns = S_WRDATA;`);
    bodyPrint(`		S_WRRESP:`);
    bodyPrint(`			if (s_axi_bready)`);
    bodyPrint(`				wstate_ns = S_WRIDLE;`);
    bodyPrint(`			else`);
    bodyPrint(`				wstate_ns = S_WRRESP;`);
    bodyPrint(`		default:`);
    bodyPrint(`			wstate_ns = S_WRIDLE;`);
    bodyPrint(`	endcase`);
    bodyPrint(`end`);
    bodyPrint(`// *** Write address register ***`);
    bodyPrint(`always @(posedge aclk)`);
    bodyPrint(`begin`);
    bodyPrint(`	if (aw_hs)`);
    bodyPrint(`		waddr <= s_axi_awaddr[C_ADDR_BITS-1:0];`);
    bodyPrint(`end`);
    bodyPrint(`// ### AXI read ############################################################`);
    bodyPrint(`assign s_axi_arready = (rstate_cs == S_RDIDLE);`);
    bodyPrint(`assign s_axi_rdata = rdata;`);
    bodyPrint(`assign s_axi_rresp = 2'b00;    // OKAY`);
    bodyPrint(`assign s_axi_rvalid = (rstate_cs == S_RDDATA);`);
    bodyPrint(`assign ar_hs = s_axi_arvalid & s_axi_arready;`);
    bodyPrint(`assign raddr = s_axi_araddr[C_ADDR_BITS-1:0];`);
    bodyPrint(`// *** Read state register ***`);
    bodyPrint(`always @(posedge aclk)`);
    bodyPrint(`begin`);
    bodyPrint(`	if (!aresetn)`);
    bodyPrint(`		rstate_cs <= S_RDIDLE;`);
    bodyPrint(`	else`);
    bodyPrint(`		rstate_cs <= rstate_ns;`);
    bodyPrint(`end`);
    bodyPrint(`// *** Read state next ***`);
    bodyPrint(`always @(*) `);
    bodyPrint(`begin`);
    bodyPrint(`	case (rstate_cs)`);
    bodyPrint(`		S_RDIDLE:`);
    bodyPrint(`			if (s_axi_arvalid)`);
    bodyPrint(`				rstate_ns = S_RDDATA;`);
    bodyPrint(`			else`);
    bodyPrint(`				rstate_ns = S_RDIDLE;`);
    bodyPrint(`		S_RDDATA:`);
    bodyPrint(`			if (s_axi_rready)`);
    bodyPrint(`				rstate_ns = S_RDIDLE;`);
    bodyPrint(`			else`);
    bodyPrint(`				rstate_ns = S_RDDATA;`);
    bodyPrint(`		default:`);
    bodyPrint(`			rstate_ns = S_RDIDLE;`);
    bodyPrint(`	endcase`);
    bodyPrint(`end`);
    bodyPrint(`	`);
    bodyPrint(`// *** Read data register ***`);
    bodyPrint(`always @(posedge aclk)`);
    bodyPrint(`begin`);
    bodyPrint(`    if (!aresetn)`);
    bodyPrint(`        rdata <= 0;`);
    bodyPrint(`	else if (ar_hs)`);
    bodyPrint(`		case (raddr)`);
    // change to dynamic
    for(readReg = 0; readReg <= (v - 1) * (3 * v + 1) + 2; readReg++) {
        bodyPrint(`			C_ADDR_REG${readReg}:`);
        bodyPrint(`             rdata <= {reg${readReg}, ${32 - 8 * Math.ceil(dataLength / 8)}'b0};`);
    }
    // end change
    bodyPrint(`		endcase`);
    bodyPrint(`end`);
    bodyPrint(`// ### Registers ############################################################`);
    bodyPrint(`always @(posedge aclk)`);
    bodyPrint(`begin`);
    bodyPrint(`    if (!aresetn)`);
    bodyPrint(`    begin`);
    // change to dynamic
    for(resetReg = 0; resetReg <= (v - 1) * (3 * v + 1) + 2; resetReg++) {
        bodyPrint(`        reg${resetReg} <= ${8 * Math.ceil(dataLength / 8)}'b0;`);
    }
    // end change
    bodyPrint(`    end`);
    // change to dynamic
    for(writeReg = 0; writeReg <= (v - 1) * (3 * v + 1) + 2; writeReg++) {
        bodyPrint(`	else if (w_hs && waddr == C_ADDR_REG${writeReg})`);
        bodyPrint(`	   begin`);
        if(writeReg < 2 * (v * v - v + 1)) {
            bodyPrint(`		reg${writeReg}[${8 * Math.ceil(dataLength / 8) - 1}:0] <= (s_axi_wdata[31:${32 - 8 * Math.ceil(dataLength / 8)}] & wmask) | (reg${writeReg}[${8 * Math.ceil(dataLength / 8) - 1}:0] & ~wmask);`);
        } else {
            bodyPrint(`		reg${writeReg}[${8 * Math.ceil(dataLength / 8) - 1}:0] <= (s_axi_wdata[31:${32 - 8 * Math.ceil(dataLength / 8)}] & wmask) | ({output${writeReg - 2 * (v * v - v + 1)}, ${8 * Math.ceil(dataLength / 8) - dataLength}'b0} & ~wmask);`);
        }
        bodyPrint(`    end`);
    }
    // end change
    bodyPrint(`end    `);
    bodyPrint(`// core module instance`)
    bodyPrint(`convmultCore coreInstance(`)
    for(eachIO = 0; eachIO < v * v; eachIO++) {
        bodyPrint(`    .in${eachIO}(reg${eachIO + 1}[${8 * Math.ceil(dataLength / 8) - 1}:${8 * Math.ceil(dataLength / 8) - dataLength}]),`)
        if((eachIO + 1) % v && eachIO / v < (v - 1)) {
            bodyPrint(`    .wg${eachIO}(reg${eachIO + v * v + 1 - Math.floor(eachIO / 8)}[${8 * Math.ceil(dataLength / 8) - 1}:${8 * Math.ceil(dataLength / 8) - dataLength}]),`)
        } else {
            bodyPrint(`    .wg${eachIO}(${dataLength}'b0),`)
        }
        bodyPrint(`    .out${eachIO}(output${eachIO}),`)
    }
    bodyPrint(`    .enabler(|reg0),`)
    bodyPrint(`    .masterClock(aclk),`)
    bodyPrint(`    .masterReset(aresetn)`)
    bodyPrint(`);`)
    bodyPrint(`// end of instance`)
    bodyPrint(`endmodule`);
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

    bodyPrint(`always @(posedge masterClock)`)
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

    bodyPrint(`always @(posedge clk)`)
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
    bodyPrint(`assign out = outMem[${fixedPoint + dataLength - 1}:${fixedPoint}];`)
    bodyPrint(`endmodule`)

    bodyPrint(`module mult2reg(in0, in1, sel, out, clk, rst);`)
    bodyPrint(`input [${dataLength - 1}:0] in0, in1;`)
    bodyPrint(`input sel, clk, rst;`)
    bodyPrint(`reg signed [${dataLength - 1}:0] outq;`)
    bodyPrint(`output [${dataLength - 1}:0] out;`)
    bodyPrint(`assign out = outq;`)

    bodyPrint(`always @(posedge clk)`)
    bodyPrint(`   begin`)
    bodyPrint(`      outq <= rst ? (sel ? in1 : in0) : ${dataLength}'b0;`)
    bodyPrint(`   end`)
    bodyPrint(`endmodule`)
    console.log(Date.now() - start)
    document.getElementById("saveButton") ? document.getElementById("saveButton").hidden = false : null;
}