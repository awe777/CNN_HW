vlib work
vlib riviera

vlib riviera/xilinx_vip
vlib riviera/xil_defaultlib
vlib riviera/xpm
vlib riviera/axi_infrastructure_v1_1_0
vlib riviera/axi_vip_v1_1_4
vlib riviera/processing_system7_vip_v1_0_6
vlib riviera/lib_cdc_v1_0_2
vlib riviera/proc_sys_reset_v5_0_13
vlib riviera/generic_baseblocks_v2_1_0
vlib riviera/fifo_generator_v13_2_3
vlib riviera/axi_data_fifo_v2_1_17
vlib riviera/axi_register_slice_v2_1_18
vlib riviera/axi_protocol_converter_v2_1_18

vmap xilinx_vip riviera/xilinx_vip
vmap xil_defaultlib riviera/xil_defaultlib
vmap xpm riviera/xpm
vmap axi_infrastructure_v1_1_0 riviera/axi_infrastructure_v1_1_0
vmap axi_vip_v1_1_4 riviera/axi_vip_v1_1_4
vmap processing_system7_vip_v1_0_6 riviera/processing_system7_vip_v1_0_6
vmap lib_cdc_v1_0_2 riviera/lib_cdc_v1_0_2
vmap proc_sys_reset_v5_0_13 riviera/proc_sys_reset_v5_0_13
vmap generic_baseblocks_v2_1_0 riviera/generic_baseblocks_v2_1_0
vmap fifo_generator_v13_2_3 riviera/fifo_generator_v13_2_3
vmap axi_data_fifo_v2_1_17 riviera/axi_data_fifo_v2_1_17
vmap axi_register_slice_v2_1_18 riviera/axi_register_slice_v2_1_18
vmap axi_protocol_converter_v2_1_18 riviera/axi_protocol_converter_v2_1_18

vlog -work xilinx_vip  -sv2k12 "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/axi4stream_vip_axi4streampc.sv" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/axi_vip_axi4pc.sv" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/xil_common_vip_pkg.sv" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/axi4stream_vip_pkg.sv" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/axi_vip_pkg.sv" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/axi4stream_vip_if.sv" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/axi_vip_if.sv" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/clk_vip_if.sv" \
"B:/Xilinx/Vivado/2018.3/data/xilinx_vip/hdl/rst_vip_if.sv" \

vlog -work xil_defaultlib  -sv2k12 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"B:/Xilinx/Vivado/2018.3/data/ip/xpm/xpm_cdc/hdl/xpm_cdc.sv" \
"B:/Xilinx/Vivado/2018.3/data/ip/xpm/xpm_memory/hdl/xpm_memory.sv" \

vcom -work xpm -93 \
"B:/Xilinx/Vivado/2018.3/data/ip/xpm/xpm_VCOMP.vhd" \

vlog -work axi_infrastructure_v1_1_0  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl/axi_infrastructure_v1_1_vl_rfs.v" \

vlog -work axi_vip_v1_1_4  -sv2k12 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/98af/hdl/axi_vip_v1_1_vl_rfs.sv" \

vlog -work processing_system7_vip_v1_0_6  -sv2k12 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl/processing_system7_vip_v1_0_vl_rfs.sv" \

vlog -work xil_defaultlib  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0/sim/CNN_top_module_processing_system7_0_0.v" \
"../../../bd/CNN_top_module/ip/CNN_top_module_axi_cnn_0_0/sim/CNN_top_module_axi_cnn_0_0.v" \

vcom -work lib_cdc_v1_0_2 -93 \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ef1e/hdl/lib_cdc_v1_0_rfs.vhd" \

vcom -work proc_sys_reset_v5_0_13 -93 \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/8842/hdl/proc_sys_reset_v5_0_vh_rfs.vhd" \

vcom -work xil_defaultlib -93 \
"../../../bd/CNN_top_module/ip/CNN_top_module_rst_ps7_0_50M_0/sim/CNN_top_module_rst_ps7_0_50M_0.vhd" \

vlog -work generic_baseblocks_v2_1_0  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/b752/hdl/generic_baseblocks_v2_1_vl_rfs.v" \

vlog -work fifo_generator_v13_2_3  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/64f4/simulation/fifo_generator_vlog_beh.v" \

vcom -work fifo_generator_v13_2_3 -93 \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/64f4/hdl/fifo_generator_v13_2_rfs.vhd" \

vlog -work fifo_generator_v13_2_3  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/64f4/hdl/fifo_generator_v13_2_rfs.v" \

vlog -work axi_data_fifo_v2_1_17  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/c4fd/hdl/axi_data_fifo_v2_1_vl_rfs.v" \

vlog -work axi_register_slice_v2_1_18  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/cc23/hdl/axi_register_slice_v2_1_vl_rfs.v" \

vlog -work axi_protocol_converter_v2_1_18  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/7a04/hdl/axi_protocol_converter_v2_1_vl_rfs.v" \

vlog -work xil_defaultlib  -v2k5 "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/ec67/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ipshared/70cf/hdl" "+incdir+../../../../CNN_HW.srcs/sources_1/bd/CNN_top_module/ip/CNN_top_module_processing_system7_0_0" "+incdir+B:/Xilinx/Vivado/2018.3/data/xilinx_vip/include" \
"../../../bd/CNN_top_module/ip/CNN_top_module_auto_pc_0/sim/CNN_top_module_auto_pc_0.v" \
"../../../bd/CNN_top_module/sim/CNN_top_module.v" \

vlog -work xil_defaultlib \
"glbl.v"

