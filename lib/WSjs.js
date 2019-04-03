export function buildWS() {
    ws=new WebSocket("ws://127.0.0.1:5866");
    //  ws=new WebSocket("ws://10.10.10.126:5866");
    // ws=new WebSocket("ws://120.27.231.59:8001");
    ws.onopen=function (evt) {
        console.log("Connection open...");
        // ws.send("Hello");

    }
    ws.onmessage=function (evt) {
        if (typeof evt.data=== String){
            console.log("Received "+evt.data);
            receiveStr=evt.data;
        }
        if (evt.data instanceof ArrayBuffer){
            console.log("receive byte"+evt.data.byteLength);
            AnalizeBotData(evt.data);
        }


    }
    ws.onclose=function (evt) {
        console.log("closed");

    }
}