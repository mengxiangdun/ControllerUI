function CreateEthercatControllerUI(node,father) {
    if (node.hasChildNodes()) {
        var sonNodes = node.childNodes;
        for (var j = 0; j < sonNodes.length; j++) {
            if (sonNodes[j].nodeType === 1 && sonNodes[j].nodeName==="SlavePoolObject") {
                CreaterSlavePoolObjectUI(sonNodes[j],father);
            }
        }
    }
}

function CreaterSlavePoolObjectUI(node,father) {
    if (node.hasChildNodes()) {
        var sonNodes = node.childNodes;
        var ethercat_id_local=0;
        for (var j = 0; j < sonNodes.length; j++) {
            if (sonNodes[j].nodeType === 1&&sonNodes[j].nodeName==="EthercatMotion") {
                CreateEthercatMotionUI(sonNodes[j],father,ethercat_id_local);
                ethercat_id_local++;
            }
        }
    }
}

function CreateEthercatMotionUI(node,father,ethercat_id_local) {
    if (node.nodeName==="EthercatMotion"){
        // ethercat_id_local++;
        //sm_id=-1;
        // console.log("ethercat id: "+ethercat_id_local);
        //input UI
        //$("#accordion").show();

        var head_div=document.createElement("div");
        head_div.innerText="Motion_"+ethercat_id_local.toString();
        father.appendChild(head_div);
        var content_div=document.createElement("div");
        father.appendChild(content_div);

        var motion_table=document.createElement("table");
        var motion_table_row=motion_table.insertRow(-1);
        var id_str="motion_"+ethercat_id_local.toString();
        motion_table_row.innerHTML="<td>phy_id</td><td><input id="+id_str+"_phy_id"+" value="+node.getAttribute('phy_id')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>vendor_id</td><td><input id="+id_str+"_vendor_id"+" value="+node.getAttribute('vendor_id')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>product_code</td><td><input id="+id_str+"_product_code"+" value="+node.getAttribute('product_code')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>revision_num</td><td><input id="+id_str+"_revision_num"+" value="+node.getAttribute('revision_num')+" style='width: 100px' /></td>";

        motion_table_row=motion_table.insertRow(-1);
        motion_table_row.innerHTML="<td>dc_assign_activate</td><td><input id="+id_str+"_dc_assign_activate"+" value="+node.getAttribute('dc_assign_activate')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>max_pos</td><td><input id="+id_str+"_max_pos"+" value="+node.getAttribute('max_pos')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>min_pos</td><td><input id="+id_str+"_min_pos"+" value="+node.getAttribute('min_pos')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>max_vel</td><td><input id="+id_str+"_max_vel"+" value="+node.getAttribute('max_vel')+" style='width: 100px' /></td>";

        motion_table_row=motion_table.insertRow(-1);
        motion_table_row.innerHTML="<td>min_vel</td><td><input id="+id_str+"_min_vel"+" value="+node.getAttribute('min_vel')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>max_acc</td><td><input id="+id_str+"_max_acc"+" value="+node.getAttribute('max_acc')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>min_acc</td><td><input id="+id_str+"_min_acc"+" value="+node.getAttribute('min_acc')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>max_pos_following_error</td><td><input id="+id_str+"_max_pos_following_error"+" value="+node.getAttribute('max_pos_following_error')+" style='width: 100px' /></td>";

        motion_table_row=motion_table.insertRow(-1);
        motion_table_row.innerHTML="<td>max_vel_following_error</td><td><input id="+id_str+"_max_vel_following_error"+" value="+node.getAttribute('max_vel_following_error')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>pos_factor</td><td><input id="+id_str+"_pos_factor"+" value="+node.getAttribute('pos_factor')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>pos_offset</td><td><input id="+id_str+"_pos_offset"+" value="+node.getAttribute('pos_offset')+" style='width: 100px' /></td>";
        motion_table_row.innerHTML+="<td>home_pos</td><td><input id="+id_str+"_home_pos"+" value="+node.getAttribute('home_pos')+" style='width: 100px' /></td>";

        content_div.appendChild(motion_table);
        var p_=document.createElement("p");
        p_.innerHTML="<p></p>";

        content_div.appendChild(p_);

        var p_2=document.createElement("p");
        p_2.innerHTML="<p></p>";
        content_div.appendChild(p_2);

        if (node.hasChildNodes()) {
            var sonNodes = node.childNodes;
            for (var j = 0; j < sonNodes.length; j++) {
                if (sonNodes[j].nodeType === 1&&sonNodes[j].nodeName==="SyncManagerPoolObject") {
                    CreateSyncManagerPoolObjectUI(sonNodes[j],content_div,ethercat_id_local);
                }
            }
        }
    }
}

function CreateSyncManagerPoolObjectUI(node,father,ethercat_id) {
    if (node.hasChildNodes()) {
        var sonNodes = node.childNodes;
        var sm_id_local=0;
        for (var j = 0; j < sonNodes.length; j++) {
            if (sonNodes[j].nodeType === 1&&sonNodes[j].nodeName==="SyncManager") {
                CreateSyncManagerUI(sonNodes[j],father,ethercat_id,sm_id_local);
                sm_id_local++;
            }
        }
    }
}

function CreateSyncManagerUI(node,father,ethercat_id,sm_id_local) {
    //sm_id_local++;
    //pdo_id=-1;
    // console.log("sm id: "+sm_id_local.toString());
    var div_syncm=document.createElement("fieldset");
    div_syncm.id="motion_"+ethercat_id.toString()+"_syncm_"+sm_id_local.toString();
    div_syncm.innerText="sm_"+sm_id_local.toString();

    father.appendChild(div_syncm);
    var pdo_id_local=0;
    if (node.hasChildNodes()) {
        var sonNodes = node.childNodes;

        for (var j = 0; j < sonNodes.length; j++) {
            if (sonNodes[j].nodeType === 1&&sonNodes[j].nodeName==="Pdo") {
                CreatePdoUI(sonNodes[j],father,ethercat_id,sm_id_local,pdo_id_local);
                pdo_id_local++;
            }
        }
    }

    var btn_addPdo=document.createElement("div");
    btn_addPdo.innerHTML="<button>Add Pdo</button>";
    btn_addPdo.onclick=function(){
        AddPdoBtnClick(node,div_syncm,pdo_id_local);
    };
    div_syncm.appendChild(btn_addPdo);

}

function CreatePdoUI(node,father,ethercat_id,sm_id,pdo_id_local) {
    // pdo_id_local++;
    //pdo_entry_id=-1;
    // console.log("pdo id: "+pdo_id_local.toString());
    var div_pdo=document.createElement("fieldset");
    //div_pdo.innerText="pdo_"+pdo_id_local.toString()+" Name:"+node.nodeName+"  ";
    var div_Pdo_index=document.createElement("b");
    div_Pdo_index.innerText="index";
    div_pdo.appendChild(div_Pdo_index);
    var div_input=document.createElement("input");
    div_input.innerHTML="<input/>";
    var id_str="motion_"+ethercat_id.toString()+"_syncm_"+sm_id.toString()+"_pdo_"+pdo_id_local.toString();

    div_input.id=id_str+"_index";
    div_input.value=node.getAttribute("index");
    div_pdo.appendChild(div_input);
    father.appendChild(div_pdo);
    //document.getElementById("motion_"+ethercat_id.toString()+"_syncm_"+sm_id.toString()).appendChild(div_pdo);

    var  t;
    t = document.createElement('table');
    t.id="motion_"+ethercat_id.toString()+"_syncm_"+sm_id.toString()+"_pdo_"+pdo_id_local.toString()+ "_pdoEntry_table_"+pdo_id_local.toString();
    var r_ = t.insertRow(0);
    var c_ = r_.insertCell(0);
    c_.innerHTML = "name";
    c_ = r_.insertCell(1);
    c_.innerHTML = "index";
    c_ = r_.insertCell(2);
    c_.innerHTML = "subindex";
    c_ = r_.insertCell(-1);
    c_.innerHTML = "size";
    //document.getElementById("motion_"+ethercat_id.toString()+"_syncm_"+sm_id.toString()).appendChild(t);
    div_pdo.appendChild(t);

    var pdoEntry_id_local=0;
    if (node.hasChildNodes()) {
        var sonNodes = node.childNodes;
        for (var j = 0; j < sonNodes.length; j++) {
            if (sonNodes[j].nodeType === 1&&sonNodes[j].nodeName==="PdoEntry") {
                CreatePdoEntryUI(sonNodes[j],t,ethercat_id,sm_id,pdo_id_local,pdoEntry_id_local);
                pdoEntry_id_local++;
            }
        }
    }
}

function CreatePdoEntryUI(node,father,ethercat_id,sm_id,pdo_id,pdoEntry_id_local) {
    //pdoEntry_id_local++;
    // console.log("pdo Entry id: "+pdoEntry_id_local.toString());
    // console.log("motion_"+ethercat_id.toString()+"_syncm_"+sm_id.toString()+"_pdo_"+pdo_id.toString()+"_pdoEntry_table_"+pdo_id.toString());
    //var t_1=document.getElementById("motion_"+ethercat_id.toString()+"_syncm_"+sm_id.toString()+"_pdo_"+pdo_id.toString()+"_pdoEntry_table_"+pdo_id.toString());
    var t_1=father;
    var r=t_1.insertRow(-1);
    var c=r.insertCell(0);
    // c.innerHTML = node.nodeName;
    var id_str="motion_"+ethercat_id.toString()+"_syncm_"+sm_id.toString()+"_pdo_"+pdo_id.toString()+"_pdoEntry_"+pdoEntry_id_local.toString();

    c.innerHTML ="<input id=" + id_str+"_name"+" value="+node.getAttribute('name')+" style='width: 80px'/>";

    c = r.insertCell(1);
    c.innerHTML ="<input id=" + id_str+"_index"+" value="+node.getAttribute('index')+" style='width: 80px'/>";
    // console.log(c.innerHTML);
    c = r.insertCell(-1);
    c.innerHTML ="<input id="+id_str+"_subindex"+" value="+node.getAttribute('subindex')+" style='width: 80px'/>";
    c = r.insertCell(-1);
    c.innerHTML ="<input id="+id_str+"_size"+" value="+node.getAttribute('size')+" style='width: 60px'/>";


}

function AddPdoBtnClick(node,father,pdo_id_local) {
    var father_id=father.id;

    var pdo_node=xmlDoc.createElement("Pdo");
    node.appendChild(pdo_node);
    //pdo_node.setAttribute("index","");
    //pdo_id_local++;
    var pdo_entry_id=0;
    // console.log("pdo id: "+pdo_id_local.toString());

    var div_pdo=document.createElement("fieldset");
    //div_pdo.innerText="pdo_"+pdo_id_local.toString()+" Name:"+node.nodeName+"  ";
    var div_Pdo_index=document.createElement("b");
    div_Pdo_index.innerText="index";
    div_pdo.appendChild(div_Pdo_index);
    var div_input=document.createElement("input");
    div_input.innerHTML="<input/>";
    //id_str="motion_"+ethercat_id.toString()+"_syncm_"+sm_id_local.toString()+"_pdo_"+pdo_id_local.toString();
    id_str=father_id+"_pdo_"+pdo_id_local.toString();
    div_input.id=id_str+"_index";
    div_input.value=node.getAttribute("index");
    div_pdo.appendChild(div_input);
    father.appendChild(div_pdo);
    // document.getElementById("motion_"+ethercat_id.toString()+"_syncm_"+sm_id_local.toString()).appendChild(div_pdo);

    var  t;
    t = document.createElement('table');
    //t.id="motion_"+ethercat_id.toString()+"_syncm_"+sm_id_local.toString()+"_pdo_"+pdo_id_local.toString()+ "_pdoEntry_table_"+pdo_id_local.toString();
    t.id=father_id +"_pdo_"+pdo_id_local.toString()+ "_pdoEntry_table_"+pdo_id_local.toString();

    var r_ = t.insertRow(0);
    var c_ = r_.insertCell(0);
    c_.innerHTML = "PdoEntryName";
    c_ = r_.insertCell(1);
    c_.innerHTML = "index";
    c_ = r_.insertCell(2);
    c_.innerHTML = "subindex";
    c_ = r_.insertCell(-1);
    c_.innerHTML = "size";
    //document.getElementById("motion_"+ethercat_id.toString()+"_syncm_"+sm_id_local.toString()).appendChild(t);
    div_pdo.appendChild(t);

    //var pdoEntryName=["status_word","mode"]
    for (var i=0;i<5;i++){
        var pdoEntry_node=xmlDoc.createElement("PdoEntry");
        pdo_node.appendChild(pdoEntry_node);
        //pdoEntry_node.setAttribute("type","PdoEntry");

        // console.log("pdo Entry id: "+pdo_entry_id.toString());
        // console.log("motion_"+ethercat_id.toString()+"_syncm_"+sm_id_local.toString()+"_pdo_"+pdo_id_local.toString()+"_pdoEntry_table_"+pdo_id_local.toString());
        //var t_1=document.getElementById("motion_"+ethercat_id.toString()+"_syncm_"+sm_id_local.toString()+"_pdo_"+pdo_id_local.toString()+"_pdoEntry_table_"+pdo_id_local.toString());
        //var t_1=document.getElementById(father_id+"_pdo_"+pdo_id_local.toString()+"_pdoEntry_table_"+pdo_id_local.toString());

        var r=t.insertRow(-1);
        var c=r.insertCell(0);
        //c.innerHTML = "status_word";
        //id_str="motion_"+ethercat_id.toString()+"_syncm_"+sm_id_local.toString()+"_pdo_"+pdo_id_local.toString()+"_pdoEntry_"+pdo_entry_id.toString();;
        id_str=father_id+"_pdo_"+pdo_id_local.toString()+"_pdoEntry_"+pdo_entry_id.toString();;

        c.innerHTML ="<input id=" + id_str +"_name"+" value="+"name"+" style='width: 80px'/>";
        c = r.insertCell(1);
        var id_str=father_id+"_pdo_"+pdo_id_local.toString()+"_pdoEntry_"+pdo_entry_id.toString();
        c.innerHTML ="<input id=" + id_str+"_index"+" value="+"index"+" style='width: 80px'/>";
        // console.log(c.innerHTML);
        c = r.insertCell(-1);
        c.innerHTML ="<input id="+id_str+"_subindex"+" value="+"subindex"+" style='width: 80px'/>";
        c = r.insertCell(-1);
        c.innerHTML ="<input id="+id_str+"_size"+" value="+"size"+" style='width: 60px'/>";
        pdo_entry_id++;
    }
}

var ethercat_id_world=-1;
var sm_id_world=-1;
var pdo_id_world=-1;
var pdo_entry_id_world=-1;

function CollectNodeName(node, name) {
    if (node.nodeType === 1){
        // console.log(node.nodeName);
        name+=node.nodeName+":";
        if (node.nodeName==="PdoEntry"){
            pdo_entry_id_world++;
            // console.log("pdo Entry id: "+pdo_entry_id_world.toString());
            // console.log("motion_"+ethercat_id_world.toString()+"_syncm_"+sm_id_world.toString()+"_pdo_"+pdo_id_world.toString()+"_pdoEntry_table_"+pdo_id_world.toString());

            id_str="motion_"+ethercat_id_world.toString()+"_syncm_"+sm_id_world.toString()+"_pdo_"+pdo_id_world.toString()+"_pdoEntry_"+pdo_entry_id_world.toString();

            //console.log(id_str+"_name");
            //console.log($("#"+id_str+"_name").val());
            //var re_node=xmlDoc.createElement($("#"+id_str+"_name").val());
            //re_node.setAttribute("type","PdoEntry");
            //node.parentNode.replaceChild(re_node,node);

            node.setAttribute("name",$("#"+id_str+"_name").val());
            node.setAttribute("index",$("#"+id_str+"_index").val());
            //console.log(id_str+"_index");
            node.setAttribute("subindex",$("#"+id_str+"_subindex").val());
            node.setAttribute("size",$("#"+id_str+"_size").val());

            // node.setAttribute("index",$("#"+(input_id++).toString()).val());
            // node.setAttribute("subindex",$("#"+(input_id++).toString()).val());
            // node.setAttribute("size",$("#"+(input_id++).toString()).val());
        }
        if (node.nodeName==="Pdo"){
            pdo_id_world++;
            pdo_entry_id_world=-1;
            // console.log("pdo id: "+pdo_id_world.toString());
            //id_str="motion_"+ethercat_id_world.toString()+"_syncm_"+sm_id_world.toString()+"_pdo_"+pdo_id_world.toString();
            id_str="motion_"+ethercat_id_world.toString()+"_syncm_"+sm_id_world.toString()+"_pdo_"+pdo_id_world.toString();
            node.setAttribute("index",$("#"+id_str+"_index").val());

        }
        if (node.nodeName==="SyncManager"){
            sm_id_world++;
            pdo_id_world=-1;
            // console.log("sm id: "+sm_id_world.toString());


        }
        if (node.nodeName==="EthercatMotion"){
            ethercat_id_world++;
            sm_id_world=-1;
            // console.log("ethercat id: "+ethercat_id_world);

            var id_str="motion_"+ethercat_id_world.toString();
            node.setAttribute("phy_id",$("#"+id_str+"_phy_id").val());
            node.setAttribute("vendor_id",$("#"+id_str+"_vendor_id").val());
            node.setAttribute("product_code",$("#"+id_str+"_product_code").val());
            node.setAttribute("revision_num",$("#"+id_str+"_revision_num").val());
            node.setAttribute("dc_assign_activate",$("#"+id_str+"_dc_assign_activate").val());
            node.setAttribute("max_pos",$("#"+id_str+"_max_pos").val());
            node.setAttribute("min_pos",$("#"+id_str+"_min_pos").val());
            node.setAttribute("max_vel",$("#"+id_str+"_max_vel").val());
            node.setAttribute("min_vel",$("#"+id_str+"_min_vel").val());
            node.setAttribute("max_acc",$("#"+id_str+"_max_acc").val());
            node.setAttribute("min_acc",$("#"+id_str+"_min_acc").val());
            node.setAttribute("max_pos_following_error",$("#"+id_str+"_max_pos_following_error").val());
            node.setAttribute("max_vel_following_error",$("#"+id_str+"_max_vel_following_error").val());
            node.setAttribute("pos_factor",$("#"+id_str+"_pos_factor").val());
            node.setAttribute("pos_offset",$("#"+id_str+"_pos_offset").val());
            node.setAttribute("home_pos",$("#"+id_str+"_home_pos").val());
        }

        if (node.hasChildNodes()) {
            var sonNodes = node.childNodes;
            for (var j = 0; j < sonNodes.length; j++) {
                if (sonNodes[j].nodeType === 1) {
                    CollectNodeName(sonNodes[j],name);
                }
            }
        }
    }
}