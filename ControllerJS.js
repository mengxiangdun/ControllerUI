// import * as echarts from "./echarts";

var ui_id_list=[];//ui id 变量名列表
var ui_id_value_list=[];// ui id 列表
var cmd_code_list=[];//发送的命令代码列表
var cmd_code_return_list=[];//需要处理返回值的方式列表
var dataSet = [];
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
    div_syncm.innerText=ReturnUI_Text(panel_text)+"\n";
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
    input_para.innerText="  "+node.getAttribute("parameter");
    father.appendChild(input_para);
    var input_div=document.createElement("input");
    input_div.id=ReturnUI_ID(node.getAttribute("id"));
    input_div.value=node.getAttribute("default");
    input_div.style="width:80px";
    input_div.onclick=function(){
        if (show3D){
            var pastedtext= prompt("Please paste here:", "placeholder");
            input_div.value=pastedtext;
        }
    }
    father.appendChild(input_div);
}

function CreateTabs(node,father) {
    var tabs_div=document.createElement("div");
    tabs_div.id=ReturnUI_ID(node.getAttribute("id"));
    tabs_div.innerText=ReturnUI_Text(node.getAttribute("text"));
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
            a_div.innerText="tab-1";
            li_div.appendChild(a_div);
            // li_div.innerHTML="<a href="#""+tabs_div.id+"tab-"+(tab_i+1)+">tab-1</a>";

            ul_div.appendChild(li_div);

        }
    }

}

function CreateLabel(node,father) {
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
    chart_div.innerText="chart";
    chart_div.style="width: 300px; height: 300px; float: left;background-color: beige;";
    father.appendChild(chart_div);
    var myChart = echarts.init(chart_div);
    var  option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dataSet[data_index]
        },
        yAxis: {
            boundaryGap: [0, '50%'],
            type: 'value'
        },
        series: [
            {
                name:'RT',
                type:'line',
                //smooth:true,
                symbol: 'none',
                stack: 'a',
                // areaStyle: {
                //     normal: {}
                // },
                // data: date,
                // min:-1000,
                // max:1000
            },
            {
                name:"Max",
                type:"line",
                // data:vel,
                // min:-10,
                // max:10
            }
            // {
            //     name:"Min",
            //     type:"line",
            //     data:current
            // }
        ]
    };

    setInterval(function () {
        //addData(true);
        // console.log("chart!");
        myChart.setOption({
            xAxis: {
                // data: data
            },
            series: [{
                name:'成交',
                data: dataSet[data_index]
            },
                {
                    name:"Max",
                    type:"line",
                    // data:vel
                }
                // {
                //     name:"Min",
                //     type:"line",
                //     data:current
                // }
            ]
        });
    }, 500);

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

    var btn_SaveData=document.createElement("button");
    btn_SaveData.innerText="Save Data";
    btn_SaveData.onclick=function () {
        downloadText(dataSet[data_index]);
    }
    father.appendChild(btn_SaveData);
}

function CreateButton(node,father) {

    var btn_cmd=document.createElement("button");

    // btn_cmd.innerHTML="<button>"+node.getAttribute('text')+"</button>";
    var btn_text=node.getAttribute('text');
    btn_cmd.innerText=ReturnUI_Text(btn_text);
    var btn_id=ReturnUI_ID(node.getAttribute("id"));
    btn_cmd.id=btn_id;
    // language_ui_id[language_ui_id.length]=btn_id;
    // language_ui_text[language_ui_text.length]=btn_text;

    btn_cmd.style="width: 80px; position: relative; margin-left: 20px;margin-top: 5px";
    father.appendChild(btn_cmd);

    // $("#"+btn_id).css({position: "absolute",'top':100,'left':50,'z-index':2});

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
            }
            btn_cmd.onmouseup=function () {
                clearInterval(repeat_1);
            }
        }
        if (node.getAttribute("repeat")>1){//mouse click repeat
            var repeat_click;
            var rate_click=node.getAttribute("rate");
            btn_cmd.onclick=function () {
                if (repeat_click == null) {
                    repeat_click=setInterval(Btn_cmd_onclick_repeat(cmd_str_1),rate_click);
                }else {
                    clearInterval(repeat_click);
                    repeat_click=null;
                }
            }
        }
    }

    if (node.getAttribute("query_item")!=null){
        var query_str=node.getAttribute("query_item");
        var query_return_str=node.getAttribute("return_attached");

        if (node.getAttribute("repeat")===null){//down repeat
            console.log("no repeat");
            btn_cmd.onclick=function(){
                Btn_query_onclick(query_str,query_return_str);
            }
        }
        if (node.getAttribute("repeat")==="0"){//keep mouse down repeat
            console.log("repeat");
            var repeat_1;
            var rate_1=node.getAttribute("rate");
            btn_cmd.onmousedown=function(){
                repeat_1=  setInterval(Btn_query_onclick_repeat(query_str,query_return_str),rate_1);
            }
            btn_cmd.onmouseup=function () {
                clearInterval(repeat_1);
            }
        }
        if (node.getAttribute("repeat")==="1"){//mouse click repeat
            var repeat_click;
            var rate_click=node.getAttribute("rate");
            console.log("repeat rate="+rate_click);
            btn_cmd.onclick=function () {
                setInterval(Btn_query_onclick_repeat(query_str,query_return_str),50);
                // if (repeat_click == null) {
                //     repeat_click=setInterval(Btn_query_onclick_repeat(query_str,query_return_str),rate_click);
                // }else {
                //     clearInterval(repeat_click);
                //     repeat_click=null;
                // }
            }
        }
        // btn_cmd.onclick=function () {
        //     Btn_query_onclick(query_str,query_return_str);
        // }
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

        console.log("0&1&"+now+"&0&0&"+str);
        var str_2=str.split(';');

        for (var j=0;j<str_2.length;j++){
            SendCmd(str_2[j],return_str);
            // SendCmd(str_2[j],(return_str===null?"":return_str));
            // SendCmd("0&1&"+now+"&0&0&"+str_2[j]);
            console.log("After btn click: "+str);
            AfterBtnClick(str_2[j]);

        }

        // cmd_code_list[cmd_code_list.length]=now;//储存已发送的cmd code
        // cmd_code_return_list[cmd_code_return_list.length]=(return_str===null?"":return_str);
        //console.log("send return str: "+return_str);

    }
}

function Btn_query_onclick(str,return_str){
    var myDate=new Date();
    var now=myDate.getTime();
    // SendCmd("5&1&"+now+"&0&0&"+str);
    SendCmd(str,(return_str===null?"":return_str));
    // cmd_code_list[cmd_code_list.length]=now;//储存已发送的cmd code
    // cmd_code_return_list[cmd_code_return_list.length]=return_str;//储存cmd的返回操作

}

function Btn_query_onclick_repeat(id,id2) {
    console.log("query mm");
    return function()
    {
        //foo(id,id2);
        Btn_query_onclick(id,id2);
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


    }
    ws.onmessage=function (evt) {
        if (typeof evt.data=== String){
            // console.log("Received "+evt.data);
            receiveStr=evt.data;
        }
        if (evt.data instanceof ArrayBuffer){
            // console.log("receive byte"+evt.data.byteLength);
            AnalizeBotData(evt.data);
        }


    }
    ws.onclose=function (evt) {
        console.log("closed");
    }
}

function SendCmd(cmd,code_return_str){
    switch (ws.readyState) {
        case WebSocket.CONNECTING:
            break;
        case WebSocket.OPEN:

            ws.binaryType='arraybuffer';
            var myDate=new Date();
            var now=myDate.getTime();
            cmd_code_list[cmd_code_list.length]=now;//储存已发送的cmd code
            cmd_code_return_list[cmd_code_return_list.length]=(code_return_str===null?"":code_return_str);
            if (cmd==="get_part_pq") {
                // PackBotCmd("1&1&"+now+"&0&0&"+cmd);
                PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            }
            if (cmd==="get_xml") {
                // PackBotCmd("2&1&"+now+"&0&0&"+cmd);
                PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            }
            if (cmd==="a"||cmd==="b") {
                // PackBotCmd("5&1&"+now+"&0&0&"+cmd);
                PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            }
            else {
                // PackBotCmd("0&1&"+now+"&0&0&"+cmd);
                PackBotCmd("0&1&"+now+"&0&0&"+cmd);
            }
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
        return_str=String.fromCharCode.apply(null,new Uint8Array(buffer,40));
        // console.log("receive  :"+return_str);
        if (cmd_code_list.indexOf(cmd_code)!==-1){
            cmd_code_index=cmd_code_list.indexOf(cmd_code);
            // console.log("cmd_code_index: "+cmd_code_index);
            code_return_str=cmd_code_return_list[cmd_code_index];

            if (code_return_str.indexOf("$")!==-1){
                var index_1=code_return_str.indexOf("{");
                var index_2=code_return_str.indexOf("}");
                var id_str=code_return_str.substr(index_1+1,index_2-index_1-1);

                if (code_return_str.indexOf("label")!==-1){
                    $("#" + id_str).val(return_str);
                    console.log("receive mess:"+return_str);
                }

                if (code_return_str.indexOf("chart")!==-1){
                    var data_index=dataMap_dataIndex[dataMap_chartID.indexOf(id_str)];
                    dataSet[data_index].push(return_str);
                }
            }

            if (code_return_str.indexOf("get_xml")!==-1) {
                getMess=Utf8ArrayToStr(new Uint8Array(buffer,40));
                console.log(getMess);
                GetXmlDoc(getMess);
            }
            if (code_return_str.indexOf("update_ui")!==-1) {
                // getMess=Utf8ArrayToStr(new Uint8Array(buffer,40));
                console.log("update_UI");
                ReGenerateUI();
            }
            if (code_return_str.indexOf("get_part_pq")!==-1){
                var pq="";
                // console.log("data view length:"+buffer.byteLength)
                for(var i=0;i<(buffer.byteLength-40)/8;i++){
                    if (i!=0){
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

            cmd_code_list.splice(cmd_code_index,1);
            cmd_code_return_list.splice(cmd_code_index,1);
        }
    }


    //return float
    if (cmd_id===1){

        var pq="";
        console.log("data view length:"+buffer.byteLength)
        for(var i=0;i<(buffer.byteLength-40)/8;i++){
            if (i!=0){
                pq+="&"+dataView.getFloat64(40+i*8,true).toString();
            }
            if (i===0){
                pq+=dataView.getFloat64(40+i*8,true).toString();
            }
        }
        //console.log("send PQ to UNity:"+pq);
        if (gameInstance!=null){
            gameInstance.SendMessage("empt","ReceiveDataFromJs",pq);
        }
    }

    //return query
    if (cmd_id===5){
        var return_str=String.fromCharCode.apply(null,new Uint8Array(buffer,40));
        // console.log("receive query :"+return_str);
        if (cmd_code_list.indexOf(cmd_code)!==-1){
            var cmd_code_index=cmd_code_list.indexOf(cmd_code);
            // console.log("cmd_code_index: "+cmd_code_index);
            var code_return_str=cmd_code_return_list[cmd_code_index];
            if (code_return_str.indexOf("$")!==-1){
                var index_1=code_return_str.indexOf("{");
                var index_2=code_return_str.indexOf("}");
                var id_str=code_return_str.substr(index_1+1,index_2-index_1-1);
                if (code_return_str.indexOf("chart")!==-1){
                    var data_index=dataMap_dataIndex[dataMap_chartID.indexOf(id_str)];
                    dataSet[data_index].push(return_str);
                }
                $("#" + id_str).val(return_str);

            }
            cmd_code_list.splice(cmd_code_index,1);
            cmd_code_return_list.splice(cmd_code_index,1);
        }
    }

    //return xml
    if (cmd_id===2){
        // getMess=String.fromCharCode.apply(null,new Uint8Array(buffer,40));
        getMess=Utf8ArrayToStr(new Uint8Array(buffer,40));
        // console.log(getMess);
        GetXmlDoc(getMess);
    }
}

function  QueryXml() {
    SendCmd("get_xml","get_xml");
}

function GetPartPq(){
    SendCmd("get_part_pq","get_part_pq");
}
