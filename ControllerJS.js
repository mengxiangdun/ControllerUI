function LoadUnity() {
    var gameInstance = UnityLoader.instantiate("gameContainer", "Build/8.json", {onProgress: UnityProgress});
    function UnityProgress(gameInstance, progress) {
        if (!gameInstance.Module) {
            return;
        }
        const loader = document.querySelector("#loader");
        if (!gameInstance.progress) {
            const progress = document.querySelector("#loader .progress");
            progress.style.display = "block";
            gameInstance.progress = progress.querySelector(".full");
            loader.querySelector(".spinner").style.display = "none";
        }
        gameInstance.progress.style.transform = `scaleX(${progress})`;
        if (progress === 1 && !gameInstance.removeTimeout) {
            gameInstance.removeTimeout = setTimeout(function() {
                loader.style.display = "none";
            }, 2000);
        }
    }

    function ServerIP_onChange(){
        var str=document.getElementById("serverIP").value;
        if (str!=""&&str!=null){
            serverIP="ws://"+str+":5866";
            console.log(serverIP);
            ws.close();
            buildWS();
            setTimeout("SendCmd('2&1&0&0&0&GetXml --check_none')",4000);
        }
    }
}