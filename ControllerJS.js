var ui_id_list=[];//ui id 变量名列表
var ui_id_value_list=[];// ui id 列表


function GetUI_ID_List(node) {
    var id_pool_node=node.getElementsByTagName("ui_id_pool_object");
    var id_list=id_pool_node[0].childNodes;
    for (var i=0;i<id_list.length;i++){

        if (id_list[i].nodeType===1){
            ui_id_list[ui_id_list.length]=id_list[i].nodeName;
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

function CreatePanel(node,father) {
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
            if (sonNodes[j].nodeName==="panel"){
                CreatePanel(sonNodes[j],div_syncm);
            }
            if (sonNodes[j].nodeName==="input"){
                CreateInput(sonNodes[j],div_syncm);
            }
            if (sonNodes[j].nodeName==="button"){
                CreateButton(sonNodes[j],div_syncm);
            }
            if (sonNodes[j].nodeName==="label"){
                CreateLabel(sonNodes[j],div_syncm);
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
        if (node.getAttribute("repeat")!=1){//down repeat
            btn_cmd.onclick=function(){
                Btn_cmd_onclick(cmd_str_1,cmd_return_str);
            }
        }
        if (node.getAttribute("repeat")==="1"){//down repeat
            console.log("repeat");
            var repeat_1;
            btn_cmd.onmousedown=function(){
                repeat_1=  setInterval(Btn_cmd_onclick_repeat(cmd_str_1,cmd_return_str),50);
            }
            btn_cmd.onmouseup=function () {
                clearInterval(repeat_1);
            }

        }
    }
    if (node.getAttribute("query_item")!=null){
        var query_str=node.getAttribute("query_item");
        var query_return_str=node.getAttribute("return_attached");
        btn_cmd.onclick=function () {
            Btn_query_onclick(query_str,query_return_str)
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
        var id_value = $("#" + id_str).val();
        // console.log(id_value);
        var old_str="${"+id_str+"}";
        // console.log("old str "+old_str);
        // console.log(str.replace(old_str,id_value));
        Btn_cmd_onclick(str.replace(old_str,id_value));
    }

    if (str.indexOf("$")==-1){
        var myDate=new Date();
        var now=myDate.getTime();
        // console.log("time:"+now);

        // console.log("0&1&"+now+"&0&0&"+str);
        var str_2=str.split(';');
        for (var j=0;j<str_2.length;j++){
            SendCmd("0&1&"+now+"&0&0&"+str_2[j]);
        }


        cmd_code_list[cmd_code_list.length]=now;//储存已发送的cmd code
        cmd_code_return_list[cmd_code_return_list.length]=return_str;//储存cmd的返回操作

        if (str.indexOf("mm --stop")!=-1){
            manual_stop=true;
            manual_start=false;
        }

        if (str.indexOf("am --stop")!=-1){
            auto_stop=true;
            auto_start=false;
        }
        if (str.indexOf("mm --start")!=-1){
            manual_start=true;
            manual_stop=false;
        }
        if (str.indexOf("am --start")!=-1){
            auto_start=true;
            auto_stop=false;
        }
    }
}

function Btn_query_onclick(str,return_str){
    var myDate=new Date();
    var now=myDate.getTime();
    // var now=myDate.myDate.toLocaleTimeString();
    // console.log("time:"+now);

    // console.log("send :"+"5&1&"+now+"&0&0&"+str);
    SendCmd("5&1&"+now+"&0&0&"+str);
    cmd_code_list[cmd_code_list.length]=now;//储存已发送的cmd code
    cmd_code_return_list[cmd_code_return_list.length]=return_str;//储存cmd的返回操作

}

