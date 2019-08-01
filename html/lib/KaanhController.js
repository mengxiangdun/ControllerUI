
//#region programming blocks
Blockly.Blocks['robotcontrol_movejr'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("MoveJR")
            .appendField("m=")
            .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"], ["4","4"], ["5","5"], ["6","6"]]), "m_select")
            .appendField("   pos=")
            .appendField(new Blockly.FieldDropdown([["+","1"], ["-","-1"]]), "dir")
            .appendField(new Blockly.FieldAngle(90), "jointAngle");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['robotcontrol_movejr'] = function(block) {
    var dropdown_m_select = block.getFieldValue('m_select');
    var angle_jointangle = block.getFieldValue('jointAngle');
    var dropdown_dir = block.getFieldValue('dir');
    // TODO: Assemble JavaScript into code variable.
    var cmd_str="moveJR -m="+dropdown_m_select+" --pos="+angle_jointangle/180*3.14*dropdown_dir;
    var code_1 = 'SendCmd(\''+cmd_str+'\', \"\");';

    var code='setTimeout(function () {\n' +
        '    \n' +code_1+
        '},10);';

    return code;
};

Blockly.Blocks['robotcontrol_movel'] = {
    init: function () {
        this.appendValueInput("pq")
            .setCheck(null)
            .appendField("moveL --pq=");
        this.appendDummyInput();
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['robotcontrol_movel'] = function(block) {
    var value_pq = Blockly.JavaScript.valueToCode(block, 'pq', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.

    //console.log("pq value:"+value_pq);
    var cmd_str="mvl --pq={"+ReturnVariableValue(value_pq)+"}";
    var code_1 = 'SendCmd(\''+cmd_str+'\', \"\");'+'console.log("pq value:"+p1);';

    var code='setTimeout(function () {\n' +
        '    \n' +code_1+
        '},10);';
    return code;
};

Blockly.Blocks['robotcontrol_movej'] = {
    init: function() {
        this.appendValueInput("pq")
            .setCheck(null)
            .appendField("moveJ --pq=");
        this.appendDummyInput();
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['robotcontrol_movej'] = function(block) {
    var value_pq = Blockly.JavaScript.valueToCode(block, 'pq', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var cmd_str="mvj --pq={"+ReturnVariableValue(value_pq)+"}";
    var code_1 = 'SendCmd(\''+cmd_str+'\', \"\");'+'console.log("pq value:"+p1);';

    var code='setTimeout(function () {\n' +
        '    \n' +code_1+
        '},10);';
    return code;
};
//#endregion

//#region websocket
function PackBotCmd(str) {
    var strArray=str.split("&");
    if (strArray.length>3){
        var cmd_id=parseInt(strArray[0]);
        var cmd_option=parseInt((strArray[1]));
        var cmd_code=parseInt((strArray[2]));

        // console.log("res-1:"+cmd_code);
        var res_2=parseInt((strArray[3]));
        var res_3=parseInt((strArray[4]));

        var mes_length=strArray[5].length;
        var buffer=new ArrayBuffer(40+mes_length);
        var headView=new DataView(buffer);
        headView.setInt32(0,mes_length,true);
        headView.setInt32(4,cmd_id,true);
        headView.setInt32(8,cmd_option,true);
        headView.setFloat64(16,cmd_code,true);
        // console.log("cmd_code:"+headView.getFloat64(16,true));
        headView.setInt32(24,res_2,true);
        headView.setInt32(32,res_3,true);
        for (var i=0;i<mes_length;i++){
            headView.setUint8(40+i,strArray[5].charCodeAt(i));
        }
        ws.send(headView.buffer);
    }
}

//可以处理中文
function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
        c = array[i++];
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
            case 12: case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

function buildWS(cmd,cmd_return) {
    ws=new WebSocket(serverIP);

    ws.onopen=function (evt) {
        console.log("Connection open...");
        if (cmd!=null){
            SendCmd(cmd,cmd_return);
            console.log(cmd);
        }
    };

    ws.onmessage=function (evt) {
        if (typeof evt.data=== String){
            // console.log("Received "+evt.data);
            receiveStr=evt.data;
        }
        if (evt.data instanceof ArrayBuffer){
            // console.log("receive byte"+evt.data.byteLength);
            AnalizeBotData(evt.data);
        }
    };

    ws.onclose=function (evt) {
        console.log("closed");
    };
}

function SendCmd(cmd,code_return_str){
    switch (ws.readyState) {
        case WebSocket.CONNECTING:
            break;
        case WebSocket.OPEN:
            ws.binaryType='arraybuffer';
            var myDate=new Date();
            var now=myDate.getTime()+Math.round(Math.random() * 10000);
            // var now=myDate.getTime();
            // var now=GenerateUUID();
            // var now=uuid(8,10);
            cmd_code_list[cmd_code_list.length]=now;//储存已发送的cmd code
            cmd_code_return_list[cmd_code_return_list.length]=(code_return_str===null?"":code_return_str);
            // if (cmd==="get_part_pq") {
            //     // PackBotCmd("1&1&"+now+"&0&0&"+cmd);
            //     PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            // }
            // if (cmd==="get_xml") {
            //     // PackBotCmd("2&1&"+now+"&0&0&"+cmd);
            //     PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            // }
            // if (cmd==="a"||cmd==="b") {
            //     // PackBotCmd("5&1&"+now+"&0&0&"+cmd);
            //     PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            // }
            // else {
            //     // PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            //     PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            // }
            PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            console.log("send cmd :"+cmd);
            break;
        case  WebSocket.CLOSING:
            break;
        case WebSocket.CLOSED:
            buildWS(cmd);
            //setTimeout("SendCmd(cmd)",4000);
            break;
    }
}

var part_pq_data=[];
var ee_pq=[];
var ee_pe=[];
var motion_pos=[];

function AnalizeBotData(buffer) {

    var dataView=new DataView(buffer);
    var cmd_length=dataView.getInt32(0);
    // console.log("receive cmd_length:"+cmd_length);
    var cmd_id=dataView.getInt32(4,true);
    var cmd_code=dataView.getFloat64(16,true);
    var getMess;

    if (cmd_id===0){
        var return_str;
        var cmd_code_index;
        var code_return_str;
        return_str=Utf8ArrayToStr(new Uint8Array(buffer,40));
        // console.log("receive  :"+return_str);
        if (cmd_code_list.indexOf(cmd_code)!==-1){
            var now=new Date().getTime();
            var time_spend=now-cmd_code;
            // console.log("send - receive :"+ time_spend);
            cmd_code_index=cmd_code_list.indexOf(cmd_code);
            // console.log("cmd_code_index: "+cmd_code_index);
            code_return_str=cmd_code_return_list[cmd_code_index];

            if (code_return_str.indexOf("$")!==-1){
                var list_1=code_return_str.split(',');
                var list_id_str=[];
                for (var i=0;i<list_1.length;i++){
                    var index_1=list_1[i].indexOf("{");
                    var index_2=list_1[i].indexOf("}");
                    list_id_str[list_id_str.length]=list_1[i].substr(index_1+1,index_2-index_1-1);

                }
                if (code_return_str.indexOf("Label")!==-1&&code_return_str.indexOf("Binary")===-1){
                    $("#" + list_id_str[0]).val(return_str);
                    console.log("receive mess:"+return_str);
                }

                if (code_return_str.indexOf("$BinaryLabel")!==-1){
                    // $("#" + id_str).val(return_str);
                    var pq=AnalizeBinaryDataReturn(buffer);
                    // var data_1;
                    // // console.log("data view length:"+buffer.byteLength)
                    // for(var i=0;i<(buffer.byteLength-40)/8;i++){
                    //     data_1=dataView.getFloat64(40+i*8,true).toString();
                    //     //SendDataToWinForm(data_1);
                    //     $("#"+list_id_str[i]).val(data_1);
                    //     if (i!==0){
                    //         pq+=","+data_1;
                    //     }
                    //     if (i===0){
                    //         pq+=data_1;
                    //     }
                    // }
                    console.log("receive mess:"+pq);
                    $("#" + list_id_str[0]).val(pq);
                }

                if (code_return_str.indexOf("$BinaryVariable")!==-1){
                    // $("#" + id_str).val(return_str);
                    var pq=AnalizeBinaryDataReturn(buffer);
                    // var data_1;
                    // // console.log("data view length:"+buffer.byteLength)
                    // for(var i=0;i<(buffer.byteLength-40)/8;i++){
                    //     data_1=dataView.getFloat64(40+i*8,true).toString();
                    //     //SendDataToWinForm(data_1);
                    //     $("#"+list_id_str[i]).val(data_1);
                    //     if (i!==0){
                    //         pq+=","+data_1;
                    //     }
                    //     if (i===0){
                    //         pq+=data_1;
                    //     }
                    // }
                    console.log("receive mess:"+pq);
                    var run_str=list_id_str[0]+"=\'"+pq+"\';";
                    console.log("run str :" +run_str);
                    eval(run_str);

                }
                if (code_return_str.indexOf("Chart")!==-1){
                    var data_index=dataMap_dataIndex[dataMap_chartID.indexOf(list_id_str[0])];

                    var count=dataView.getFloat64(40,true);
                    var count_data=dataView.getFloat64(48,true);
                    // console.log("data view length:"+buffer.byteLength)
                    // for(var i=0;i<(buffer.byteLength-40)/8;i++){
                    //     if (i!==0){
                    //         pq+="&"+dataView.getFloat64(40+i*8,true).toString();
                    //     }
                    //     if (i===0){
                    //         pq+=dataView.getFloat64(40+i*8,true).toString();
                    //     }
                    // }
                    // console.log("receive chart data count :"+count+" data: "+count_data+"; chart length: "+dataSet[data_index].length);

                    dataSet[data_index].push([count,count_data]);
                    dataSet_Count[data_index].push(count);
                    console.log("rceive data : "+dataSet[data_index]);
                    if (dataSet[data_index].length>dataSetLength[data_index]){
                        dataSet[data_index].shift();
                        dataSet_Count[data_index].shift();
                    }
                }
            }

            if (code_return_str.indexOf("get_xml")!==-1) {
                getMess=Utf8ArrayToStr(new Uint8Array(buffer,40));
                console.log(getMess);
                GetXmlDoc(getMess);

            }

            if (code_return_str.indexOf("UpdateUi")!==-1) {
                // getMess=Utf8ArrayToStr(new Uint8Array(buffer,40));
                console.log("update_UI");
                var return_xml=return_str.split('@')[1];
                GetXmlDoc(return_xml);
            }

            if (code_return_str.indexOf("get_data_RT")!==-1){
                var start_bytes=40;
                //part pq
                var part_pq="";


                for(var i=0;i<anyRobot.partList.length*7;i++){
                    part_pq_data.push(dataView.getFloat64(40+i*8,true));
                    if (part_pq_data.length>1000){
                        part_pq_data.shift();
                    }
                    if (i!==0){
                        part_pq+="&"+dataView.getFloat64(40+i*8,true).toString();
                    }
                    if (i===0){
                        part_pq+=dataView.getFloat64(40+i*8,true).toString();
                    }
                }
                //console.log("send PQ to UNity:"+pq);
                if (gameInstance!=null){
                    gameInstance.SendMessage("empt","ReceiveDataFromJs",part_pq);
                }
                console.log("part pq data: "+part_pq_data.toString()+"part pq data length: " +part_pq_data.length);

                //ee pq
                start_bytes=40+anyRobot.partList.length*7*8;

                for (var k=0;k<7;k++){
                    ee_pq.push(dataView.getFloat64(start_bytes+k*8,true));
                    if (ee_pq.length>1000){
                        ee_pq.shift();
                    }
                }
                console.log("ee pq: " + ee_pq.toString());

                //ee pe
                start_bytes+=7*8;

                for (var k=0;k<6;k++){
                    ee_pe.push(dataView.getFloat64(start_bytes+k*8,true));
                    if (ee_pe.length>1000){
                        ee_pe.shift();
                    }
                }
                console.log("ee pe: "+ee_pe.toString());

                //joint pos

                start_bytes += 6*8;
                for (var j=0;j<anyRobot.motionList.length;j++){
                    motion_pos.push(dataView.getFloat64(start_bytes+j*8,true));
                    if (motion_pos.length>1000){
                        motion_pos.shift();
                    }
                }
                console.log("motion pos: "+ motion_pos.toString());
            }


            cmd_code_list.splice(cmd_code_index,1);
            cmd_code_return_list.splice(cmd_code_index,1);
        }
    }
}

function AnalizeBinaryDataReturn(buffer) {
    var dataView=new DataView(buffer);
    var pq="";
    var data_1=[];
    // console.log("data view length:"+buffer.byteLength)
    for(var i=0;i<(buffer.byteLength-40)/8;i++){
        var data=dataView.getFloat64(40+i*8,true).toString();
        data_1.push(data);
        if (i!==0){
            pq+=","+data;
        }
        if (i===0){
            pq+=data;
        }
    }
    return pq;
}

function  QueryXml() {
    SendCmd("get_xml","get_xml");
}

function GetPartPq(){
    //SendCmd("get_part_pq","get_part_pq");
    SendCmd("get","get_data_RT");
}
//#endregion