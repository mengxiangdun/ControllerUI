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
var id_list=0;//自动添加的id，++
var demoWorkspace

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
    if (str){
        var index_1=ui_id_list.indexOf(str);
        if (index_1!=-1){
            return ui_id_value_list[index_1];

        }else {return "aaa"+(id_list++).toString();}
    }
    else {
        return "aaa"+(id_list++).toString();
    }
}

function ReturnUI_Text(str) {
    if (str!==null&&str!==""){
        var str_list=str.split('|');
        switch (language) {
            case "eng":
                return str_list[0];
            case "chs":
                return str_list[1]?str_list[1]:str_list[0];
            default:
                return str;

        }
    }
    else {
        return "";
    }
}

function ShowInterface(node,father) {
    if (node.getAttribute("lang")){
        language=node.getAttribute("lang");
    }
    GetUI_ID_List(node);
    // CreateLayout(node,father);
    CreateUI(node,father);
}

function CreateLayout(node,father) {
    // var layout_nodes=node.getElementsByTagName("Layout");

    var layout_nodes=node.childNodes;
    var size=[100,100,100,100];//north,south,west,east
    for (var i=0;i<layout_nodes.length;i++){
        if (layout_nodes[i].nodeType===1&&layout_nodes[i].nodeName==="Layout"){
            var layout_class, layout_id;

            if (layout_nodes[i].getAttribute("pos")){
                layout_class=layout_nodes[i].getAttribute("pos");
                //(document.getElementById("body")).innerHTML+="<div class="+layout_nodes[i].getAttribute("pos")+"></div>";
            }
            if (layout_nodes[i].getAttribute("size")){
                switch (layout_class) {
                    case "ui-layout-north":
                        size[0]=layout_nodes[i].getAttribute("size");
                        break;
                    case "ui-layout-south":
                        size[1]=layout_nodes[i].getAttribute("size");
                        break;
                    case "ui-layout-west":
                        size[2]=layout_nodes[i].getAttribute("size");
                        break;
                    case "ui-layout-east":
                        size[3]=layout_nodes[i].getAttribute("size");
                        break;
                }
            }
            layout_id=ReturnUI_ID(layout_nodes[i].getAttribute("id"));

            father.innerHTML+="<div class="+layout_class+" id="+layout_id+"></div>";
            // setTimeout(function () {
            //     CreateUI(layout_nodes[i],document.getElementById(layout_id));
            // },6);
            // CreateUI(layout_nodes[i],document.getElementById(layout_id));
        }

    }
    var id_str=father.id;
    $("#"+id_str).layout({
        north__size:size[0],
        south__size:size[1],
        west__size:size[2],
        east_size:size[3],
    });
}

function CreateLayoutUI(node,father) {
    var layout_nodes=node.getElementsByTagName("Layout");
    for (var k=0;k<layout_nodes.length;k++){
        var sonNode=layout_nodes[k].childNodes;
        for (var n=0;n<sonNode.length;n++){
            if (sonNode[n].nodeType===1){
                if (sonNode[n].nodeName==="CmdInterfacePoolObject") {
                    var id_str=layout_nodes[k].getAttribute("id");
                    CreateCmdInterface(sonNode[n],document.getElementById(id_str));
                    // setTimeout(function () {
                    //
                    // },20);
                }
                else if (sonNode[n].nodeName==="View3DInterfacePoolObject") {
                    Create3DVidw(sonNode[n],document.getElementById(layout_nodes[k].getAttribute("id")));
                }
                else if (sonNode[n].nodeName==="Layout") {
                    CreateLayout(layout_nodes[k],document.getElementById(layout_nodes[k].getAttribute("id")));
                    CreateLayoutUI(layout_nodes[k],document.getElementById(layout_nodes[k].getAttribute("id")));
                }
            }
        }
    }
}

function CreateUI(node,father) {
    var sonNodes=node.childNodes;
    for (var j=0;j<sonNodes.length;j++){
        if (sonNodes[j].nodeName==="Layout"){
            CreateLayout(node,father);
            CreateLayoutUI(node,father);
            break;
            return;
        }
        switch (sonNodes[j].nodeName) {
            case "Layout":
                break;
            case "CmdInterfacePoolObject":
                CreateUI(sonNodes[j],father);
                break;
            case "View3DInterfacePoolObject":
                Create3DVidw(sonNodes[j],father);
                break;
            case "Panel":
                CreatePanel(sonNodes[j],father);
                break;
            case "Input":
                CreateInput(sonNodes[j],father);
                break;
            case "Button":
                CreateButton(sonNodes[j],father);
                break;
            case "Label":
                CreateLabel(sonNodes[j],father);
                break;
            case "BinaryLabel":
                CreateLabel(sonNodes[j],father);
                break;
            case "Chart":
                CreateChart(sonNodes[j],father);
                break;
            case "Tabs":
                CreateTabs(sonNodes[j],father);
                break;
            case "Slider":
                CreateSlider(sonNodes[j],father);
                break;
            case "Select":
                CreateSelect(sonNodes[j],father);
                break;
            case "Spinner":
                CreateSpinner(sonNodes[j],father);
                break;
            case "Figure":
                CreateFigure(sonNodes[j],father);
                break;
            case "Accordion":
                CreateAccordion(sonNodes[j],father);
                break;
            case "Br":
                CreateBr(sonNodes[j],father);
                break;
            case "Sortable":
                CreateSortable(sonNodes[j],father);
                break;
            case "Dragable":
                CreateDragable(sonNodes[j],father);
                break;
            case "BlockProgram":
                CreateBlockProgram(sonNodes[j],father);
                break;
        }

        // if (sonNodes[j].nodeType===1){
        //     if (sonNodes[j].nodeName==="CmdInterfacePoolObject"){
        //         CreateUI(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="View3DInterfacePoolObject"){
        //
        //         Create3DVidw(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Panel"){
        //         CreatePanel(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Input"){
        //         CreateInput(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Button"){
        //         CreateButton(sonNodes[j],father);
        //         console.log("Button!");
        //     }
        //     else if (sonNodes[j].nodeName==="Label"){
        //         CreateLabel(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="BinaryLabel"){
        //         // CreateBinaryLabel(sonNodes[j],father);
        //         CreateLabel(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Chart"){
        //         console.log("chart!");
        //         CreateChart(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Tabs"){
        //         console.log("Tabs!");
        //         CreateTabs(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Slider"){
        //         console.log("Slider!");
        //         CreateSlider(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Select"){
        //         console.log("Select!");
        //         CreateSelect(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Spinner"){
        //         console.log("Spinner!");
        //         CreateSpinner(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Figure"){
        //         console.log("Figure!");
        //         CreateFigure(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Accordion"){
        //         console.log("Accordion!");
        //         CreateAccordion(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Br"){
        //         // console.log("Accordion!");
        //         CreateBr(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Sortable"){
        //         // console.log("Accordion!");
        //         CreateSortable(sonNodes[j],father);
        //     }
        //     else if (sonNodes[j].nodeName==="Dragable"){
        //         // console.log("Accordion!");
        //         CreateDragable(sonNodes[j],father);
        //     }
        // }
    }
}

function CreateCmdInterface(node,father) {
    CreateUI(node,father);
}

function Create3DVidw(node,father) {
    var d=node;
    var ifView3D=d.getAttribute("show");
    if (ifView3D==="true"){
        father.innerHTML="<div id=\"gameContainer\"  style=\"width: 100%;height: 100%\"></div>\n" +
            "        <div id=\"loader\" style=\"width: 500%;height: 100%;left: auto\">\n" +
            "            <!--<img class=\"logo\" src=\"logo.png\">-->\n" +
            "            <div class=\"spinner\" style=\"width: 50%;float: left\"></div>\n" +
            "            <div class=\"progress\" style=\"width: 50%;float: left\"><div class=\"full\" ></div></div>\n" +
            "        </div>"

        Show3DView();
    }
}

function CreatePanel(node,father) {
    console.log("panel!");
    var panel_id=ReturnUI_ID( node.getAttribute("id"));
    var panel_text=node.getAttribute("text");
    var div_syncm=document.createElement("fieldset");
    div_syncm.style=node.getAttribute("style");
    if (panel_id!==null&&panel_id!==""){
        div_syncm.id=panel_id;
    }else {
        div_syncm.id="aaa"+(id_list++).toString();
    }
    if (panel_text!==null&&panel_text!==""){
        div_syncm.innerText=ReturnUI_Text(panel_text)+"\n";
        div_syncm.style="white-space:pre";
    }
    else {
        div_syncm.innerText="";
    }

    CreateUI(node,div_syncm);
    // var sonNodes=node.childNodes;
    // for (var j=0;j<sonNodes.length;j++){
    //     if (sonNodes[j].nodeType===1){
    //         if (sonNodes[j].nodeName==="Panel"){
    //             CreatePanel(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="Input"){
    //             CreateInput(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="Button"){
    //             CreateButton(sonNodes[j],div_syncm);
    //             console.log("Button!");
    //         }
    //         else if (sonNodes[j].nodeName==="Label"){
    //             CreateLabel(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="BinaryLabel"){
    //             // CreateBinaryLabel(sonNodes[j],div_syncm);
    //             CreateLabel(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="Chart"){
    //             console.log("chart!");
    //             CreateChart(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="Tabs"){
    //             console.log("Tabs!");
    //             CreateTabs(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="Slider"){
    //             console.log("Slider!");
    //             CreateSlider(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="Select"){
    //             console.log("Select!");
    //             CreateSelect(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="Spinner"){
    //             console.log("Spinner!");
    //             CreateSpinner(sonNodes[j],div_syncm);
    //         }
    //         else if (sonNodes[j].nodeName==="Figure"){
    //             console.log("Figure!");
    //             CreateFigure(sonNodes[j],div_syncm);
    //         }
    //     }
    // }
    father.appendChild(document.createElement("h"));
    father.appendChild(div_syncm);
}

function CreateInput(node,father) {
    // var input_para=document.createElement("b");
    // if (node.getAttribute("parameter")!==null){
    //     input_para.innerText="  "+ReturnUI_Text( node.getAttribute("parameter"));
    // }

    var input_para=document.createElement("b");
    if (node.getAttribute("parameter")!==null){
        input_para.innerText="  "+ReturnUI_Text( node.getAttribute("parameter"));
    }
    input_para.style="white-space:pre";


    father.appendChild(input_para);
    var input_div=document.createElement("input");
    var input_id=ReturnUI_ID(node.getAttribute("id"));
    if (input_id){
        input_div.id=input_id;
    }else {
        input_div.id="aaa"+(id_list++).toString();
    }

    input_div.value=node.getAttribute("default");
    input_div.style=node.getAttribute("style");
    // input_div.onclick=function(){
    //     if (show3D){
    //         var pastedtext= prompt("Please paste here:", "placeholder");
    //         if (pastedtext!==null){
    //             input_div.value=pastedtext;
    //         }
    //     }
    // };
    father.appendChild(input_div);
}

function CreateSpinner(node,father) {
    var input_para=document.createElement("b");
    if (node.getAttribute("parameter")!==null){
        input_para.innerText="  "+ReturnUI_Text( node.getAttribute("parameter"));
    input_para.style="white-space:pre";
    }

    father.appendChild(input_para);
    var input_div=document.createElement("input");
    var input_id=ReturnUI_ID(node.getAttribute("id"));
    if (input_id){
        input_div.id=input_id;
    }else {
        input_div.id="aaa"+(id_list++).toString();
    }

    input_div.value=node.getAttribute("default");
    input_div.style=node.getAttribute("style");
    father.appendChild(input_div);
    var max=node.getAttribute("max");
    if (max===null||max===""){
        max=1;
    }
    var min=node.getAttribute("min");
    if (min===null||min===""){
        min=0;
    }
    var step=node.getAttribute("step");
    if (step===null||step===""){
        step=(max-min)/10;
    }
    var default_value=node.getAttribute("default");
    if (default_value===null||default_value===""){
        default_value=(max-min)/2;
    }
    var slide_option="max:"+max+", min:"+min+",step:"+step+", value:"+default_value+"";
    setTimeout("$( \"#"+input_div.id+"\" ).spinner({"+slide_option+"})",6);
}

function CreateTabs(node,father) {
    var tabs_div=document.createElement("div");
    var tab_id=ReturnUI_ID(node.getAttribute("id"));
    tabs_div.id=ReturnUI_ID(tab_id);

    father.appendChild(tabs_div);
    setTimeout("$( \"#"+tabs_div.id+"\" ).tabs()",6);
    var ul_div=document.createElement("ul");
    tabs_div.appendChild(ul_div);
    var sonNodes=node.getElementsByTagName("TabItem");
    for (var tab_i=0;tab_i<sonNodes.length;tab_i++){
        if (sonNodes[tab_i].nodeType===1){
            var tabOne_div=document.createElement("div");
            tabOne_div.id=tabs_div.id+"tab-"+(tab_i+1);
            tabs_div.appendChild(tabOne_div);

            CreateUI(sonNodes[tab_i],tabOne_div);
            // var cmd_panel_node=sonNodes[tab_i].getElementsByTagName("Panel");
            // for (var i=0;i<cmd_panel_node.length;i++){
            //     if (cmd_panel_node[i].nodeType===1){
            //         CreatePanel(cmd_panel_node[i],tabOne_div);
            //     }
            // }



            var li_div=document.createElement("li");
            var a_div=document.createElement("a");
            a_div.setAttribute("href","#"+tabOne_div.id);
            a_div.innerText=ReturnUI_Text((sonNodes[tab_i].getAttribute(("text"))));
            a_div.style="white-space:pre";
            // a_div.innerText=ReturnUI_Text(sonNodes[tab_i].getAttribute(("text")));
            // a_div.innerText="123";
            li_div.appendChild(a_div);
            // li_div.innerHTML="<a href="#""+tabs_div.id+"tab-"+(tab_i+1)+">tab-1</a>";

            ul_div.appendChild(li_div);

        }
    }

}

function CreateAccordion(node,father) {
    var accor_div=document.createElement("div");
    accor_div.id=ReturnUI_ID(node.getAttribute("id"));
    father.appendChild(accor_div);

    var item_list=node.getElementsByTagName("AccordionItem");
    for (var i=0;i<item_list.length;i++){
        var item_node=item_list[i];
        var head_div=document.createElement("div");
        head_div.innerText=ReturnUI_Text(item_node.getAttribute("text"));
        head_div.style="white-space:pre";
        head_div.id=ReturnUI_ID(item_node.getAttribute("id"));
        accor_div.appendChild(head_div);

        var content_div=document.createElement("div");
        accor_div.appendChild(content_div);

        CreateUI(item_node,content_div);

        // var panel_list=item_node.childNodes;
        // for (var j=0;j<panel_list.length;j++){
        //     if (panel_list[j].nodeName==="Panel"){
        //         CreatePanel(panel_list[j],content_div);
        //     }
        // }


    }

    setTimeout("$( \"#"+accor_div.id+"\" ).accordion({\n" +
        "        heightStyle:\"content\",\n" +
        "        collapsible: \"true\"\n" +
        "\n" +
        "    });",6);
}

function CreateLabel(node,father) {
    var b=document.createElement("b");
    if (node.getAttribute("text")!==null){
        b.innerText="\n"+ReturnUI_Text( node.getAttribute("text"));
        b.style="white-space:pre";
    }
    father.appendChild(b);
    var input_para=document.createElement("input");
    var label_id=ReturnUI_ID(node.getAttribute("id"));
    if (label_id){
        input_para.id=label_id;
    }else {
        input_para.id="aaa"+(id_list++).toString();
    }

    input_para.style=node.getAttribute("style");
    input_para.setAttribute("type","text");
    input_para.setAttribute("value","");
    father.appendChild(input_para);

}

function CreateFigure(node,father) {
    var figure_div=document.createElement("figure");
    figure_div.id=ReturnUI_ID(node.getAttribute("id"));
    var figure_caption=document.createElement("figcaption");
    figure_caption.innerText=ReturnUI_Text(node.getAttribute("text"));
    figure_caption.style="white-space:pre";
    if (figure_caption.innerText){
        figure_div.appendChild(figure_caption);
    }
    var img_div=document.createElement("img");
    img_div.src=node.getAttribute("src");
    img_div.alt=node.getAttribute("alt");
    img_div.style=node.getAttribute("style");
    figure_div.appendChild(img_div);
    father.appendChild(figure_div);
}

function CreateSlider(node,father) {
    var b=document.createElement("b");
    if (node.getAttribute("parameter")!==null){
        b.innerText="\n"+ReturnUI_Text( node.getAttribute("parameter"));
        b.style="white-space:pre";
    }
    father.appendChild(b);
    var input_para=document.createElement("div");
    var slider_id=ReturnUI_ID(node.getAttribute("id"));
    if (slider_id){
        input_para.id=slider_id;
    }else {
        input_para.id="aaa"+(id_list++).toString();
    }
    var max=node.getAttribute("max");
    if (max===null||max===""){
        max=1;
    }
    var min=node.getAttribute("min");
    if (min===null||min===""){
        min=0;
    }
    var step=node.getAttribute("step");
    if (step===null||step===""){
        step=(max-min)/10;
    }
    var default_value=node.getAttribute("default");
    if (default_value===null||default_value===""){
        default_value=(max-min)/2;
    }
    var slide_option="max:"+max+", min:"+min+",step:"+step+", value:"+default_value+"";
    setTimeout("$( \"#"+input_para.id+"\" ).slider({"+slide_option+"})",6);
    father.appendChild(input_para);
}

function CreateSelect(node,father) {
    var b=document.createElement("b");
    if (node.getAttribute("parameter")!==null){
        b.innerText="\n"+ReturnUI_Text(node.getAttribute("parameter"));
        b.style="white-space:pre";
    }
    father.appendChild(b);
    var select_div=document.createElement("b");
    var select_html=new XMLSerializer().serializeToString(node);
    select_div.innerHTML=select_html;
    father.appendChild(select_div);
    var id_str=node.getAttribute("id");
     setTimeout("$( \"#"+id_str+"\" ).selectmenu()",6);

}

function CreateTable(node,father) {

}

function CreateBlockProgram(node,father) {
    var block_div=document.createElement("div");
    block_div.id=ReturnUI_ID(node.getAttribute("id"));
    var id_str=block_div.id;
    block_div.style="display: inline-block; height: 300px; width: 500px";
    father.appendChild(block_div);
    demoWorkspace = Blockly.inject(id_str,
        {media: '../../media/',
            toolbox: document.getElementById('toolbox')});
    Blockly.Xml.domToWorkspace(document.getElementById('workspaceBlocks'),
        demoWorkspace);

    demoWorkspace.addChangeListener(function(event) {
        if (!(event instanceof Blockly.Events.Ui)) {
            // Something changed. Parser needs to be reloaded.
            generateCodeAndLoadIntoInterpreter();
        }
    });

    father.appendChild(document.createElement("br"));
    var btn=document.createElement("button");
    btn.innerText="Run";
    btn.id=ReturnUI_ID("");
    btn.onclick=function () {
         var code=generateCodeAndLoadIntoInterpreter();
         eval(code);
      //  stepCode();
    };
    setTimeout("$( \"#"+btn.id+"\" ).button()",20);
    father.appendChild(btn);
}
function stepCode() {
    generateCodeAndLoadIntoInterpreter();
    //eval(latestCode);
    if (!myInterpreter) {
        // First statement of this code.
        // Clear the program output.
        resetStepUi(true);
        myInterpreter = new Interpreter(latestCode, initApi);

        // And then show generated code in an alert.
        // In a timeout to allow the outputArea.value to reset first.
        setTimeout(function() {
            alert('Ready to execute the following code\n' +
                '===================================\n' + latestCode);
            highlightPause = true;
            stepCode();
        }, 1);
        return;
    }
    highlightPause = false;
    do {
        try {
            var hasMoreCode = myInterpreter.step();
        } finally {
            if (!hasMoreCode) {
                // Program complete, no more code to execute.
                outputArea.value += '\n\n<< Program complete >>';

                myInterpreter = null;
                resetStepUi(false);

                // Cool down, to discourage accidentally restarting the program.
                stepButton.disabled = 'disabled';
                setTimeout(function() {
                    stepButton.disabled = '';
                }, 2000);

                return;
            }
        }
        // Keep executing until a highlight statement is reached,
        // or the code completes or errors.
    } while (hasMoreCode && !highlightPause);
}
function resetStepUi(clearOutput) {
    demoWorkspace.highlightBlock(null);
    highlightPause = false;

    if (clearOutput) {
        //outputArea.value = 'Program output:\n=================';
    }
}

var myInterpreter = null;

function initApi(interpreter, scope) {
    // Add an API function for the alert() block, generated for "text_print" blocks.
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(function(text) {
            text = text ? text.toString() : '';
            outputArea.value += '\n' + text;
        }));

    // Add an API function for the prompt() block.
    var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for highlighting blocks.
    var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));
}

var highlightPause = false;
var latestCode = '';

function generateCodeAndLoadIntoInterpreter() {
    // Generate JavaScript code and parse it.
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    var latestCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    console.log("code : "+latestCode);
    resetStepUi(true);
    return latestCode;
}

function highlightBlock(id) {
    demoWorkspace.highlightBlock(id);
    highlightPause = true;
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
    if (id_str){
        chart_div.id=id_str;
    }else {
        chart_div.id="aaa"+(id_list++).toString();
    }

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
    btn_SaveData.id=ReturnUI_ID("");
    setTimeout("$( \"#"+btn_SaveData.id+"\" ).button()",20);
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

function CreateBr(node,father) {
    var br=document.createElement("br");
    father.appendChild(br);
}

function CreateSortable(node,father) {
    var div=document.createElement("div");
    div.id=ReturnUI_ID(node.getAttribute("id"));
    div.style=node.getAttribute("style");
    setTimeout("$( \"#"+div.id+"\" ).sortable()",20);
    father.appendChild(div);
}

function CreateDragable(node,father) {
    var div=document.createElement("div");
    div.innerText=ReturnUI_Text(node.getAttribute("text"));
    div.style="white-space:pre";
    div.id=ReturnUI_ID(node.getAttribute("id"));
    if (node.getAttribute("dragable")==="true"){
        var sort_id=node.getAttribute("connectToSortable");
        setTimeout("$( \"#"+div.id+"\" ).draggable({\n" +
            "        appendTo:\"body\",\n" +
            "        helper:\"clone\",\n" +
            "        opacity:1,\n" +
            "        connectToSortable:\"#"+sort_id+"\"\n" +
            "    })",20);
    }
    setTimeout("$( \"#"+div.id+"\" ).button()",20);
    father.appendChild(div);
}

function CreateButton(node,father) {

    var btn_cmd=document.createElement("button");

    // btn_cmd.innerHTML="<button>"+node.getAttribute('text')+"</button>";
    var btn_text=node.getAttribute('text');
    btn_cmd.innerText=ReturnUI_Text(btn_text);
    btn_cmd.style="white-space:pre";
    var btn_id=ReturnUI_ID(node.getAttribute("id"));
    if (btn_id!==null&&btn_id!==""){
        btn_cmd.id=btn_id;
    }else {
        btn_cmd.id="aaa"+(id_list++).toString();
    }

    if (node.getAttribute("style")) {
        btn_cmd.style=node.getAttribute("style");
    }

    else {

        // setTimeout("$( \"#"+btn_cmd.id+"\" ).button()",20);

    }
    setTimeout("$( \"#"+btn_cmd.id+"\" ).button()",20);
    father.appendChild(btn_cmd);

    if (node.getAttribute("cmd")!==null){

        var cmd_str_1=node.getAttribute("cmd");
        var cmd_return_str=node.getAttribute("return_attached");

        if (node.getAttribute("repeat")===null){//down repeat
            // btn_cmd.onclick=function(){
            //     Btn_cmd_onclick(cmd_str_1,cmd_return_str);
            // }
            AddClickEvent(btn_cmd,function(){
                Btn_cmd_onclick(cmd_str_1,cmd_return_str);
            });
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
            btn_cmd.onmouseleave=function () {
                clearInterval(repeat_1);
            }
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

    if (node.getAttribute("function")!==null){

        var fun=node.getAttribute("function");
        var fun_list=fun.split(';');
        for (var i=0;i<fun_list.length;i++){
            if (fun_list[i].indexOf("$")!==-1){

                if (fun_list[i].indexOf("ShowUI")!==-1){
                    AddShowEvent(fun_list[i],btn_cmd);
                }
                else if (fun_list[i].indexOf("HideUI")!==-1){
                    AddHideEvent(fun_list[i],btn_cmd);
                }
                else if (fun_list[i].indexOf("Disable")!==-1){
                    AddDisableEvent(fun_list[i],btn_cmd);
                }
                else if (fun_list[i].indexOf("Enable")!==-1){
                    AddEnableEvent(fun_list[i],btn_cmd);
                }
            }
        }
    }

}

function AddShowEvent(funStr,btn) {
    var con_str_showUI=GetInnerID(funStr);
    AddClickEvent(btn,function(){ ShowUI(con_str_showUI[0]);});
}

function AddHideEvent(funStr,btn) {
    var con_str_showUI=GetInnerID(funStr);
    AddClickEvent(btn,function(){ HideUI(con_str_showUI[0]);});
}

function AddDisableEvent(funStr,btn) {
    var con_str_showUI=GetInnerID(funStr);
    AddClickEvent(btn,function(){ DisableUI(con_str_showUI[0]);});
}

function AddEnableEvent(funStr,btn) {
    var con_str_showUI=GetInnerID(funStr);
    AddClickEvent(btn,function(){ EnableUI(con_str_showUI[0]);});
}

function AddClickEvent(el,fn){
    // el.addEventListener("onclick",fn);
    //
    if(el.onclick){
        var _bak = el.onclick;
        el.onclick = function(e){
            _bak.call(this,e);
            fn.call(this,e);
            // _bak.call(this)
            // fn.call(this)
        }
    }else{
        el.onclick = fn
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
    if (str.indexOf("$")!==-1) {
        var index_0=str.indexOf("$");

        var index_1 = (str.substr(index_0,str.length-index_0)).indexOf("{")+index_0;
        var index_2 = (str.substr(index_0,str.length-index_0)).indexOf("}")+index_0;
        console.log("sub str ::"+str.substr(index_0,str.length-index_0-1));
        var con_str=GetInnerID(str);
        var type_str=con_str[1];
        var id_str = con_str[0];
        var id_value;
        if (type_str.indexOf("Input")!==-1||type_str===""){
            id_value = $("#" + id_str).val();
        }
        else if(type_str.indexOf("Slider")!==-1){
            id_value = $("#" + id_str).slider("value");
        }
        else if (type_str.indexOf("Select")!==-1){
            var objS = document.getElementById(id_str);
            var grade = objS.options[objS.selectedIndex].value;
            id_value=grade;
        }
        else if (type_str.indexOf("Spinner")!==-1){
            id_value=$("#"+id_str).spinner("value");
        }
        else if (type_str.indexOf("BlockProgram")!==-1){


        }
        console.log("id:"+id_str+"; value: "+ id_value);
        var old_str=str.substr(index_0,index_2-index_0+1);
        Btn_cmd_onclick(str.replace(old_str,id_value),return_str);
    }

    if (str.indexOf("$")===-1){
        var myDate=new Date();
        var now=myDate.getTime();
        var str_2=str.split(';');
        for (var j=0;j<str_2.length;j++){
            SendCmd(str_2[j],return_str);
            AfterBtnClick(str_2[j]);
        }
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

function GetInnerID(str) {
    if (str.indexOf("$")!==-1) {
        var index_0 = str.indexOf("$");
        var index_1 = (str.substr(index_0,str.length-index_0)).indexOf("{")+index_0;
        var index_2 = (str.substr(index_0,str.length-index_0)).indexOf("}")+index_0;
        var type_str = str.substr(index_0 + 1, index_1 - index_0 - 1);
        var id_str = str.substr(index_1 + 1, index_2 - index_1 - 1);
        return [id_str,type_str];
    }else {
        return null;
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
                    var pq="";
                    var data_1;
                    // console.log("data view length:"+buffer.byteLength)
                    for(var i=0;i<(buffer.byteLength-40)/8;i++){
                        data_1=dataView.getFloat64(40+i*8,true).toString();
                        //SendDataToWinForm(data_1);
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
                SendDataToWinForm("get_xml@"+getMess);
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
                SendDataToWinForm("get_part_pq@"+pq);
                if (gameInstance!=null){
                    gameInstance.SendMessage("empt","ReceiveDataFromJs",pq);
                    //console.log("get part pq: "+pq);
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

function ShowUI(id_str) {
    $("#"+id_str).show();
}

function HideUI(id_str) {
    $("#"+id_str).hide();
}

function DisableUI(id_str) {
    document.getElementById(id_str).disabled=true;
    document.getElementById(id_str).style="color:gray";
}

function  EnableUI(id_str) {
    document.getElementById(id_str).disabled=false;
    document.getElementById(id_str).style="color:black";
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

function SendDataToWinForm(str_data) {
    var event = new MessageEvent('invoke',
        {
            'view': window,
            'bubbles': false,
            'cancelable': false,
            'data': str_data
        });
    document.dispatchEvent(event);
}

function SendXmlToWinForm() {
    
}

