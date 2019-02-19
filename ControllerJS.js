

function buildWS(cmd,serverIP) {
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

function PackBotCmd(str) {
    //1&1&0&0&0&Read --check_none
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
        // console.log("send cmd"+headView.buffer.byteLength);

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

function AnalizeBotData(buffer) {
    var dataView=new DataView(buffer);
    var cmd_length=dataView.getInt32(0);
    // console.log("receive cmd_length:"+cmd_length);
    var cmd_id=dataView.getInt32(4,true);
    // console.log("receive cmd_id:"+cmd_id);
    var cmd_code=dataView.getFloat64(16,true);
    // console.log(("receive cmd_code:"+cmd_code));

    var getMess;
    //return float message
    if (cmd_id===0){
        // var step=new Array();
        // for(var i=0;i<(dataView.length-40)/8;i++){
        //     step[i]=dataView.getFloat64(432+i*8);
        // }

    }

    //return float
    if (cmd_id===1){
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
        //console.log("send PQ to UNity:"+pq);
        gameInstance.SendMessage("empt","ReceiveDataFromJs",pq);
    }

    //return xml
    if (cmd_id===2){
        // getMess=String.fromCharCode.apply(null,new Uint8Array(buffer,40));
        getMess=Utf8ArrayToStr(new Uint8Array(buffer,40));
        // console.log(getMess);
        GetXmlDoc(getMess);
    }

    //return query
    if (cmd_id===5){
        var return_str=String.fromCharCode.apply(null,new Uint8Array(buffer,40));
        // console.log("receive query :"+return_str);
        if (cmd_code_list.indexOf(cmd_code)!=-1){
            var cmd_code_index=cmd_code_list.indexOf(cmd_code);
            // console.log("cmd_code_index: "+cmd_code_index);
            var code_return_str=cmd_code_return_list[cmd_code_index];
            if (code_return_str.indexOf("$")!=-1){
                var index_1=code_return_str.indexOf("{");
                var index_2=code_return_str.indexOf("}");
                var id_str=code_return_str.substr(index_1+1,index_2-index_1-1);
                // console.log("id_str: "+id_str);
                // $("#" + id_str).setAttribute("value",return_str);
                $("#" + id_str).val(return_str);
                // document.getElementById(id_str).innerText=return_str;
                // console.log("label str:"+$("#" + id_str).value);
            }
            cmd_code_list.splice(cmd_code_index,1);
            cmd_code_return_list.splice(cmd_code_index,1);
        }
    }
}

function SendCmd(cmd){
    switch (ws.readyState) {
        case WebSocket.CONNECTING:
            break;
        case WebSocket.OPEN:
            ws.binaryType='arraybuffer';
            PackBotCmd(cmd);
            break;
        case  WebSocket.CLOSING:
            break;
        case WebSocket.CLOSED:
            buildWS(cmd);
            //setTimeout("SendCmd(cmd)",4000);
            break;
    }
}

function ReadFromServer(){
    switch (ws.readyState) {
        case WebSocket.CONNECTING:
            break;
        case WebSocket.OPEN:
            ws.binaryType='arraybuffer';
            PackBotCmd("1&1&0&0&0&Read --check_none");
            //ws.send(PackBotCmd("1&1&0&0&0&Read --check_none"));
            //ws.send("hello");
            //CheckData(receiveStr);
            break;
        case  WebSocket.CLOSING:
            break;
        case WebSocket.CLOSED:
            buildWS();
            break;
    }


}