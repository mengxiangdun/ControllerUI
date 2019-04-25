// import * as echarts from "./echarts";

var ui_id_list=[];//ui id 变量名列表
var ui_id_value_list=[];// ui id 列表
var cmd_code_list=[];//发送的命令代码列表
var cmd_code_return_list=[];//需要处理返回值的方式列表
var dataSet = [];
var dataSet_Count=[];
var dataSetLength=[];
var dataMap_chartID=[];
var dataMap_dataIndex=[];

function GetUI_ID_List(node) {
    var id_pool_node=node.getElementsByTagName("UiIdPoolObject");
    var id_list=id_pool_node[0].childNodes;
    for (var i=0;i<id_list.length;i++){

        if (id_list[i].nodeType===1){
            ui_id_list[ui_id_list.length]=id_list[i].getAttribute("name");
            ui_id_value_list[ui_id_value_list.length]=id_list[i].getAttribute("value");
        }
    }
}

function ReturnUI_ID(str) {
    var index_1=ui_id_list.indexOf(str);
    if (index_1!=-1){
        return ui_id_value_list[index_1];

    }else {return null;}
}

function ShowInterface(node,text,father) {
    // var cmd_interface_pool_node=node.getElementsByTagName("Cmd_interface_pool_object");
    var cmd_panel_node=node.getElementsByTagName("Panel");
    for (var i=0;i<cmd_panel_node.length;i++){
        if (cmd_panel_node[i].nodeType===1&&cmd_panel_node[i].getAttribute("text")===text){
            CreatePanel(cmd_panel_node[i],father);
        }
    }
}

function CreatePanel(node,father) {
    console.log("panel!");
    var panel_id=ReturnUI_ID( node.getAttribute("id"));
    var panel_text=node.getAttribute("text");
    var div_syncm=document.createElement("fieldset");
    div_syncm.style="width:400px";
    div_syncm.id=panel_id;
    if (panel_text!==null&&panel_text!==""){
        div_syncm.innerText=ReturnUI_Text(panel_text)+"\n";
    }
    else {
        div_syncm.innerText="";
    }

    // div_syncm.appendChild(document.createElement("p"));
    // language_ui_id[language_ui_id.length]=panel_id;
    // language_ui_text[language_ui_text.length]=panel_text;
    // console.log(div_syncm.innerText);
    var sonNodes=node.childNodes;
    for (var j=0;j<sonNodes.length;j++){
        if (sonNodes[j].nodeType===1){
            if (sonNodes[j].nodeName==="Panel"){
                CreatePanel(sonNodes[j],div_syncm);
            }
            if (sonNodes[j].nodeName==="Input"){
                CreateInput(sonNodes[j],div_syncm);
            }
            if (sonNodes[j].nodeName==="Button"){
                CreateButton(sonNodes[j],div_syncm);
                console.log("Button!");
            }
            if (sonNodes[j].nodeName==="Label"){
                CreateLabel(sonNodes[j],div_syncm);
            }
            if (sonNodes[j].nodeName==="BinaryLabel"){
                // CreateBinaryLabel(sonNodes[j],div_syncm);
                CreateLabel(sonNodes[j],div_syncm);
            }
            if (sonNodes[j].nodeName==="Chart"){
                console.log("chart!");
                CreateChart(sonNodes[j],div_syncm);
            }
            if (sonNodes[j].nodeName==="Tabs"){
                console.log("Tabs!");
                CreateTabs(sonNodes[j],div_syncm);
            }
        }
    }
    father.appendChild(document.createElement("h"));
    father.appendChild(div_syncm);
}

function CreateInput(node,father) {
    var input_para=document.createElement("b");
    if (node.getAttribute("parameter")!==null){
        input_para.innerText="  "+node.getAttribute("parameter");
    }

    father.appendChild(input_para);
    var input_div=document.createElement("input");
    input_div.id=ReturnUI_ID(node.getAttribute("id"));
    input_div.value=node.getAttribute("default");
    input_div.style="width:80px";
    input_div.onclick=function(){
        if (show3D){
            var pastedtext= prompt("Please paste here:", "placeholder");
            if (pastedtext!==null){
                input_div.value=pastedtext;
            }

        }
    };
    father.appendChild(input_div);
}

function CreateTabs(node,father) {
    var tabs_div=document.createElement("div");
    tabs_div.id=ReturnUI_ID(node.getAttribute("id"));
    var div_text=node.getAttribute("text");
    if (div_text!==null&&div_text!==""){
        tabs_div.innerText=ReturnUI_Text(div_text);
    }

    father.appendChild(tabs_div);
    setTimeout("$( \"#"+tabs_div.id+"\" ).tabs()",1065);
    var ul_div=document.createElement("ul");
    tabs_div.appendChild(ul_div);
    var sonNodes=node.getElementsByTagName("Li");
    for (var tab_i=0;tab_i<sonNodes.length;tab_i++){
        if (sonNodes[tab_i].nodeType===1){
            var tabOne_div=document.createElement("div");
            tabOne_div.id=tabs_div.id+"tab-"+(tab_i+1);
            tabs_div.appendChild(tabOne_div);
            var cmd_panel_node=sonNodes[tab_i].getElementsByTagName("Panel");
            for (var i=0;i<cmd_panel_node.length;i++){
                if (cmd_panel_node[i].nodeType===1){
                    CreatePanel(cmd_panel_node[i],tabOne_div);
                }
            }

            var li_div=document.createElement("li");
            var a_div=document.createElement("a");
            a_div.setAttribute("href","#"+tabOne_div.id);
            a_div.innerText=ReturnUI_Text(sonNodes[tab_i].getAttribute(("text")));
            // a_div.innerText="123";
            li_div.appendChild(a_div);
            // li_div.innerHTML="<a href="#""+tabs_div.id+"tab-"+(tab_i+1)+">tab-1</a>";

            ul_div.appendChild(li_div);

        }
    }

}

function CreateLabel(node,father) {
    var b=document.createElement("b");
    if (node.getAttribute("text")!==null){
        b.innerText="\n"+node.getAttribute("text");
    }
    father.appendChild(b);
    var input_para=document.createElement("input");
    input_para.id=ReturnUI_ID(node.getAttribute("id"));
    // console.log("label id:"+input_para.id);
    // input_para.innerText="  ";
    input_para.setAttribute("type","text");
    input_para.setAttribute("value","");
    father.appendChild(input_para);
    // var input_div=document.createElement("input");
    // input_div.id=node.getAttribute("id");
    // input_div.value=node.getAttribute("default");
    // input_div.style="width:80px";
    // father.appendChild(input_div);
}

function CreateBinaryLabel(node,father) {
    var input_para=document.createElement("input");
    input_para.id=ReturnUI_ID(node.getAttribute("id"));
    // console.log("label id:"+input_para.id);
    // input_para.innerText="  ";
    input_para.setAttribute("type","text");
    input_para.setAttribute("value","");
    father.appendChild(input_para);
    // var input_div=document.createElement("input");
    // input_div.id=node.getAttribute("id");
    // input_div.value=node.getAttribute("default");
    // input_div.style="width:80px";
    // father.appendChild(input_div);
}

function CreateTextarea(node,father) {
    var input_para=document.createElement("textarea");
    input_para.id=ReturnUI_ID(node.getAttribute("id"));
    // console.log("label id:"+input_para.id);
    // input_para.innerText="  ";
    input_para.setAttribute("type","text");
    input_para.setAttribute("value","");
    father.appendChild(input_para);
    // var input_div=document.createElement("input");
    // input_div.id=node.getAttribute("id");
    // input_div.value=node.getAttribute("default");
    // input_div.style="width:80px";
    // father.appendChild(input_div);
}

function CreateChart(node,father) {
    var chart_div=document.createElement("b");
    var id_str=ReturnUI_Text(node.getAttribute("id"));
    chart_div.id=id_str;
    var  data_index=dataSet.length;
    dataMap_chartID[dataMap_chartID.length]=id_str;
    dataMap_dataIndex[dataMap_dataIndex.length]=data_index;
    dataSet[data_index]=[];
    dataSet_Count[data_index]=[];
    var dataLength=node.getAttribute("length");
    dataSetLength[data_index]=(dataLength===null||dataLength==="")?1000:dataLength;
    chart_div.innerText="chart";
    chart_div.style="width: 500px; height: 280px; float:right; background-color: beige;";
    father.appendChild(chart_div);
    var myChart = echarts.init(chart_div);
    // var  option = {
    //     xAxis: {
    //         type: 'value',
    //         boundaryGap: false,
    //         data: dataSet_Count[data_index],
    //         axisLabel:{
    //             formatter:function (value,index) {
    //                 if (value>1000){
    //                     return value.toExponential([1]);
    //                 }
    //                 else {return value;}
    //             },
    //             margin:5
    //         }
    //     },
    //     yAxis: {
    //         boundaryGap: false,
    //         type: 'value',
    //         data:dataSet[data_index],
    //         // data:dataSet[data_index],
    //         axisLabel:{
    //             formatter:function (value,index) {if (value>1000){
    //                 return value.toExponential([1]);
    //             }
    //             else {return value;}
    //             },
    //             margin:5
    //         }
    //     },
    //     series: [
    //         {
    //             // name:'RT',
    //             // type:'line',
    //             // //smooth:true,
    //             // symbol: 'none',
    //             // stack: 'a',
    //             // // areaStyle: {
    //             // //     normal: {}
    //             // // },
    //             // data: dataSet[data_index],
    //         },
    //     ]
    // };
    var option = {
        xAxis: {
            type: 'value',
            boundaryGap: false,
            min:'dataMin',
            max:'dataMax',
            scale:true,
            // data: dataSet_Count[data_index]
        },
        yAxis: {
            boundaryGap: [0, '50%'],
            type: 'value',
            scale:true
        },
        series: [

            {
                name:'成交',
                type:'line',
                smooth:true,
                symbol: 'none',
                stack: 'a',
                // areaStyle: {
                //     normal: {}
                // },
                data: dataSet[data_index]
            }
        ]
    };
    setInterval(function () {
        //addData(true);
        // console.log("chart!");
        myChart.setOption({
            xAxis: {
                data: dataSet_Count[data_index]
            },
            series: [{
                name:'成交',
                data: dataSet[data_index]
            }]
        });
    }, 50);

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

    var btn_SaveData=document.createElement("button");
    btn_SaveData.innerText="Save";
    btn_SaveData.onclick=function () {
        // var data_save=[];
        // for (var i=0;i<dataSet[data_index].length;i++){
        //     data_save[data_save.length]=dataSet[data_index][i];
        //     data_save[data_save.length]=dataSet_Count[data_index][i];
        // }
        // downloadText(data_save);
        downloadText(dataSet[data_index]);
    };
    father.appendChild(btn_SaveData);
}

function CreateButton(node,father) {

    var btn_cmd=document.createElement("button");

    // btn_cmd.innerHTML="<button>"+node.getAttribute('text')+"</button>";
    var btn_text=node.getAttribute('text');
    btn_cmd.innerText=ReturnUI_Text(btn_text);
    var btn_id=ReturnUI_ID(node.getAttribute("id"));
    btn_cmd.id=btn_id;

    btn_cmd.style="width: 80px; position: relative; margin-left: 20px;margin-top: 5px";
    father.appendChild(btn_cmd);

    if (node.getAttribute("cmd")!=null){

        var cmd_str_1=node.getAttribute("cmd");
        var cmd_return_str=node.getAttribute("return_attached");

        if (node.getAttribute("repeat")===null){//down repeat
            btn_cmd.onclick=function(){
                Btn_cmd_onclick(cmd_str_1,cmd_return_str);
            }
        }

        if (node.getAttribute("repeat")==="0"){//keep mouse down repeat
            console.log("repeat");
            var repeat_1;
            var rate_1=node.getAttribute("rate");
            btn_cmd.onmousedown=function(){
                repeat_1=  setInterval(Btn_cmd_onclick_repeat(cmd_str_1,cmd_return_str),rate_1);
            };
            btn_cmd.onmouseup=function () {
                clearInterval(repeat_1);
            };
        }

        if (node.getAttribute("repeat")==="1"){//mouse click repeat
            var repeat_click;
            var rate_click=node.getAttribute("rate");
            btn_cmd.onclick=function () {
                if (repeat_click == null) {
                    repeat_click=setInterval(Btn_cmd_onclick_repeat(cmd_str_1,cmd_return_str),rate_click);
                }else {
                    clearInterval(repeat_click);
                    repeat_click=null;
                }
            }
        }
    }

}

function Btn_cmd_onclick_repeat(id,id2) {
    return function()
    {
        //foo(id,id2);
        Btn_cmd_onclick(id,id2);
    }
}

function Btn_cmd_onclick(str,return_str){
    if (str.indexOf("$")!=-1) {
        // console.log(str);
        var index_1 = str.indexOf("{");
        // console.log("index_1: " + index_1);
        var index_2 = str.indexOf("}");
        // console.log("index_2: " + index_2);
        var id_str = str.substr(index_1 + 1, index_2 - index_1 - 1);
        // console.log(id_str);
        //var id_value=document.getElementById(id_str).innerText;
        var id_value = $("#" + id_str).val();
        // console.log(id_value);
        var old_str="${"+id_str+"}";
        // console.log("old str "+old_str);
        // console.log(str.replace(old_str,id_value));
        Btn_cmd_onclick(str.replace(old_str,id_value),return_str);
    }

    if (str.indexOf("$")==-1){
        var myDate=new Date();
        var now=myDate.getTime();
        // console.log("time:"+now);

        // console.log("0&1&"+now+"&0&0&"+str);
        var str_2=str.split(';');

        for (var j=0;j<str_2.length;j++){
            SendCmd(str_2[j],return_str);
            // SendCmd(str_2[j],(return_str===null?"":return_str));
            // SendCmd("0&1&"+now+"&0&0&"+str_2[j]);
            // console.log("After btn click: "+str);
            AfterBtnClick(str_2[j]);

        }

        // cmd_code_list[cmd_code_list.length]=now;//储存已发送的cmd code
        // cmd_code_return_list[cmd_code_return_list.length]=(return_str===null?"":return_str);
        //console.log("send return str: "+return_str);

    }
}

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

function buildWS(cmd) {
    ws=new WebSocket(serverIP);

    ws.onopen=function (evt) {
        console.log("Connection open...");
        if (cmd!=null){
            SendCmd(cmd);
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
            break;
        case  WebSocket.CLOSING:
            break;
        case WebSocket.CLOSED:
            buildWS(cmd);
            //setTimeout("SendCmd(cmd)",4000);
            break;
    }
}

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
        // return_str=String.fromCharCode.apply(null,new Uint8Array(buffer,40));
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
                    var pq="";
                    var data_1;
                    // console.log("data view length:"+buffer.byteLength)
                    for(var i=0;i<(buffer.byteLength-40)/8;i++){
                        data_1=dataView.getFloat64(40+i*8,true).toString();
                        $("#"+list_id_str[i]).val(data_1);
                        if (i!==0){
                            pq+=","+data_1;
                        }
                        if (i===0){
                            pq+=data_1;
                        }
                    }
                    console.log("receive mess:"+pq);
                    $("#" + list_id_str[0]).val(pq);
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

            if (code_return_str.indexOf("get_part_pq")!==-1){
                var pq="";
                // console.log("data view length:"+buffer.byteLength)
                for(var i=0;i<(buffer.byteLength-40)/8;i++){
                    if (i!==0){
                        pq+="&"+dataView.getFloat64(40+i*8,true).toString();
                    }
                    if (i===0){
                        pq+=dataView.getFloat64(40+i*8,true).toString();
                    }
                }
                // console.log("send PQ to UNity:"+pq);
                if (gameInstance!=null){
                    gameInstance.SendMessage("empt","ReceiveDataFromJs",pq);
                }
            }

            if (return_str.indexOf("UpdateUI")!==-1){

                var return_xml=return_str.split('@')[1];
                console.log("UpdateUI"+return_xml);
                GetXmlDoc(return_xml);
            }
            cmd_code_list.splice(cmd_code_index,1);
            cmd_code_return_list.splice(cmd_code_index,1);
        }

    }

}

function  QueryXml() {
    SendCmd("get_xml","get_xml");
}

function GetPartPq(){
    SendCmd("get_part_pq","get_part_pq");
}

function GenerateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}