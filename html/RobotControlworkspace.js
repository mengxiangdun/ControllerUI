// Blockly.Blocks['robotcontrol_movejr'] = {
//     init: function() {
//         this.appendDummyInput()
//             .appendField("MoveJR")
//             .appendField("m=")
//             .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"], ["4","4"], ["5","5"], ["6","6"]]), "m_select")
//             .appendField("   pos=")
//             .appendField(new Blockly.FieldDropdown([["+","1"], ["-","-1"]]), "dir")
//             .appendField(new Blockly.FieldAngle(90), "jointAngle");
//         this.setInputsInline(true);
//         this.setPreviousStatement(true, null);
//         this.setNextStatement(true, null);
//         this.setColour(230);
//         this.setTooltip("");
//         this.setHelpUrl("");
//     }
// };
//
//
// Blockly.JavaScript['robotcontrol_movejr'] = function(block) {
//     var dropdown_m_select = block.getFieldValue('m_select');
//     var angle_jointangle = block.getFieldValue('jointAngle');
//     var dropdown_dir = block.getFieldValue('dir');
//     // TODO: Assemble JavaScript into code variable.
//     var cmd_str="moveJR -m="+dropdown_m_select+" --pos="+angle_jointangle/180*3.14*dropdown_dir;
//     var code_1 = 'SendCmd(\''+cmd_str+'\', \"\");';
//
//     var code='setTimeout(function () {\n' +
//         '    \n' +code_1+
//         '},10);';
//
//     return code;
// };
//
// Blockly.Blocks['robotcontrol_movel'] = {
//     init: function () {
//         this.appendValueInput("pq")
//             .setCheck(null)
//             .appendField("moveL --pq=");
//         this.appendDummyInput();
//         this.setInputsInline(true);
//         this.setPreviousStatement(true, null);
//         this.setNextStatement(true, null);
//         this.setColour(230);
//         this.setTooltip("");
//         this.setHelpUrl("");
//     }
// };
//
//
// Blockly.JavaScript['robotcontrol_movel'] = function(block) {
//     var value_pq = Blockly.JavaScript.valueToCode(block, 'pq', Blockly.JavaScript.ORDER_ATOMIC);
//     // TODO: Assemble JavaScript into code variable.
//
//     console.log("pq value:"+value_pq);
//     var cmd_str="mvl --pq="+String(value_pq);
//     var code_1 = 'SendCmd(\''+cmd_str+'\', \"\");'+'console.log("pq value:"+p1);';
//
//     var code='setTimeout(function () {\n' +
//         '    \n' +code_1+
//         '},10);';
//     return code;
// };