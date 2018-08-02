var ros = new ROSLIB.Ros({url : "ws://" + "192.168.100.236" + ":9000"});

ros.on("connection", function() {console.log("websocket: connected"); });
ros.on("error", function(error) {console.log("websocket error; ", error); });
ros.on("close", function() {console.log("websocket: closed");});

var ls = new ROSLIB.Topic({
    ros : ros,
    name : "/read_status",
    messageType : "necst/Read_status_msg"
});

var auth = new ROSLIB.Topic({
    ros : ros,
    name : "/authority_check",
    messageType : "necst/String_necst"
});

var dometrack = new ROSLIB.Topic({
    ros : ros,
    name : "/dome_track_flag",
    messageType : "necst/Bool_necst",
});

var node = new ROSLIB.Topic({
    ros:ros,
    name:"/web_topic",
    messageType:"necst/Status_node_msg"
});

/*
var ondo = new ROSLIB.Topic({
    ros : ros,
    name : "/outer_ondotori",
    messageType : "ondo/tr7nw_values"
});
*/

var ondoondo = new ROSLIB.Topic({
    ros : ros,
    name : "/web_ondo",
    messageType : "necst/l218_values"
});

var tpgtpg = new ROSLIB.Topic({
    ros : ros,
    name : "/web_tpg",
    messageType : "necst/tpg261_values"
});


ls.subscribe(function(message) {
    var dt = new Date()
    utc = dt.getUTCFullYear().toString()+"/"
	+(dt.getUTCMonth()+1).toString()+"/"
	+(dt.getUTCDate()).toString()+" "
	+dt.getUTCHours().toString()+":"
	+dt.getUTCMinutes().toString()+":"
	+dt.getUTCSeconds().toString()+" "
    document.getElementById("UTC").innerHTML = utc;
    for( name in message){
	if (name=="Current_Az"||name=="Current_El"){
	    message_e=parseFloat(message[name]).toFixed(3)
	}else if (name=="Command_Az"||name=="Command_El"){
	    message_e=parseFloat(message[name]).toFixed(3)
	}else if (name=="Current_Dome"){
	    message_e=parseFloat(message[name]).toFixed(2)	    
	}else if (typeof(message[name])=="number"){
	    message_e=parseFloat(message[name]).toFixed(2)}
	else{
	    message_e=message[name]
	}
	try{
	    if(name=="Current_M4"){
		if(message_e=="IN"){
		    message_e = "NAGOYA"
		}else if(message_e=="OUT"){
		    message_e = "SMART"
		}else{};
	    }else if(name=="LST"){
		lst_h = parseInt(message_e/3600);
		lst_m = parseInt((message_e%3600)/60);
		lst_s = (message_e%3600)%60;
		message_e = lst_h.toString()+":"+lst_m.toString()+":"+lst_s.toString();
	    }else{}
	    if(name=="OutTemp"||name=="OutHumi"){
	    }else{
		$("#"+name+"_box").attr("class", "node_box_blue")		
		document.getElementById(name).innerHTML = message_e;//message[name];
	    }
	    if(name == "WindSp"){
		if (message_e > 20){
		    $("#WindSp_box").attr("class", "node_box_red")}else if(message_e > 15){
			$("#WindSp_box").attr("class", "node_box_yellow")}else{
			    $("#WindSp_box").attr("class", "node_box_blue")
			}
	    }else if (name == "Rain"){
		if (message_e > 5){
		    $("#Rain_box").attr("class", "node_box_yellow")}else{
		    }
	    }else{
	    }
	}
	catch(e){
	}
    }
});

node.subscribe(function(message){
    msg = message["from_node"].toString();
    data = message["active"]
    //console.log("msg, data : ", msg,data)
    if (data==true){
	document.getElementById(msg);
	$("#"+msg).attr("class", "node_box_blue")
    }else if(data==false){
	$("#"+msg).attr("class", "node_box_red")
    }else{
	console.log("error")
    }
});


/*
ondo.subscribe(function(key){
    console.log(key)
    for( name in key){
	try{
	    if (name == "ch1_value"){
		document.getElementById("OutTemp").innerHTML = key[name];
	    }else if(name == "ch2_value"){
		document.getElementById("OutHumi").innerHTML = key[name];
		if (key[name] > 80){
		    $("#OutHumi").attr("class", "emergency");
		}else if(key[name] > 60){
		    $("#OutHumi").attr("class", "warning");
		}else{
		    $("#OutHumi").attr("class", "nomal");
		}
	    }else{
	    }
	}catch(e){
	}
    }
});
*/

ondoondo.subscribe(function(key){
    console.log(key)
    for( name in key){
	try{
	    if (name == "ch1_value"){
		document.getElementById(name).innerHTML = key[name].toFixed(5);
	    }else{
		document.getElementById(name).innerHTML = key[name].toFixed(5);		
	    }
	}catch(e){
	}
    }
});

tpgtpg.subscribe(function(key){
    console.log(key)
    for( name in key){
	try{
	    document.getElementById("vacuum").innerHTML = key[name].toFixed(5);
	}catch(e){
	}
    }
});    
  
  

auth.subscribe(function(message) {
    document.getElementById("Authority2").innerHTML = message.data
});

dometrack.subscribe(function(message){
    document.getElementById("Dome_Track").innerHTML = message.data;
});

var drive = new ROSLIB.Topic({
    ros : ros,
    name : "/WebDrive",
    messageType : "necst/String_necst"
});

/*
var contactor = new ROSLIB.Topic({
    ros : ros,
    name : "/antenna_contactor",
    messageType : "necst/String_necst"
});
*/

var emergency = new ROSLIB.Topic({
    ros : ros,
    name : "/WebEmergency",
    messageType : "necst/String_necst"
});

var hot = new ROSLIB.Topic({
    ros : ros,
    name : "/WebHot",
    messageType : "necst/String_necst"
});

var m4 = new ROSLIB.Topic({
    ros : ros,
    name : "/WebM4",
    messageType : "necst/String_necst"
});

var m2 = new ROSLIB.Topic({
    ros : ros,
    name : "/WebM2",
    messageType : "necst/Float64_necst"
});


var dome = new ROSLIB.Topic({
    ros : ros,
    name : "/WebDome",
    messageType : "necst/String_necst"
});

var domemove = new ROSLIB.Topic({
    ros : ros,
    name : "/WebDomeMove",
    messageType : "necst/Float64_necst"
});

var memb = new ROSLIB.Topic({
    ros : ros,
    name : "/WebMemb",
    messageType : "necst/String_necst"
});

var move = new ROSLIB.Topic({
    ros : ros,
    name : "/WebOnepoint",
    messageType : "necst/Move_mode_msg",
});

var planet = new ROSLIB.Topic({
    ros : ros,
    name : "/WebPlanet",
    messageType : "necst/Move_mode_msg",
});

var observation = new ROSLIB.Topic({
    ros : ros,
    name : "/WebObservation",
    messageType : "necst/String_necst",
});

var auth = new ROSLIB.Topic({
    ros : ros,
    name : "/WebAuthority",
    messageType : "necst/String_necst",
});

function PubMotorValues(id){
    var key = id.split("_")[0]
    var value = id.split("_")[1]
    var dt = new Date()
    
    if (key == "drive"){
	msg = new ROSLIB.Message({data:String(value),from_node:"web",timestamp:dt.getSeconds()});
	drive.publish(msg);
	//contactor.publish(msg);
    }else if(key == "emergency"){
	msg = new ROSLIB.Message({data:String(value),from_node:"web",timestamp:dt.getSeconds()});
	emergency.publish(msg);	
    }else if(key == "hot"){
	msg = new ROSLIB.Message({data:String(value),from_node:"web",timestamp:dt.getSeconds()});
	hot.publish(msg);
    }else if(key == "m4"){
	msg = new ROSLIB.Message({data:String(value),from_node:"web",timestamp:dt.getSeconds()});
	m4.publish(msg);
    }else if(key == "m2"){
	value=parseFloat(document.forms.form4.input_m2.value);
	console.log(value)
	msg = new ROSLIB.Message({data:value,from_node:"web",timestamp:dt.getSeconds()});
	m2.publish(msg);	
    }else if(key == "dome"){
	if(value=="move"){
	    value=parseFloat(document.forms.form3.input_dome.value);
	    console.log(value)
	    msg = new ROSLIB.Message({data:value,from_node:"web",timestamp:dt.getSeconds()});
	    domemove.publish(msg);
	    console.log(msg);
	}else{
	    msg = new ROSLIB.Message({data:String(value),from_node:"web",timestamp:dt.getSeconds()});
	    dome.publish(msg);	    
	}
	console.log("ok")
    }else if(key == "memb"){
	msg = new ROSLIB.Message({data:String(value),from_node:"web",timestamp:dt.getSeconds()});
	memb.publish(msg);	
    }else if (key == "authority"){
	msg = new ROSLIB.Message({data:String(value),from_node:"web",timestamp:dt.getSeconds()});
	auth.publish(msg);
    }else if(key == "antenna"){
	az = parseFloat(document.forms.form1.input_az.value);
	el = parseFloat(document.forms.form1.input_el.value);
	_coord = document.getElementById("mode").value;
	var dt = new Date();
	now = dt.getTime()/1000;
	if (typeof(az)=="number" & typeof(el)=="number"){
	    msg = new ROSLIB.Message({x:az, y:el, coord:_coord, planet:"", off_x:0, off_y:0, offcoord:"altaz",hosei:"hosei_230.txt",lamda:2600, dcos:0,limit:true, from_node:"web",timestamp:now});
	    move.publish(msg);
	    console.log("antenna_move", _coord);
	}else{
	    msg = "no publish";
	}
    }else if(key=="planet"){
	if (document.getElementById("planet").value != "no"){
	    name = document.getElementById("planet").value;
	    var dt = new Date();
	    now = dt.getTime()/1000;	    
	    msg = new ROSLIB.Message({x:0, y:0, coord:"planet", planet:name, off_x:0, off_y:0, offcoord:"altaz",hosei:"hosei_230.txt",lamda:2600, dcos:0,limit:true, from_node:"web",timestamp:now});
	    planet.publish(msg);
	    console.log("planet_move", name);
	};
    }else if(key=="obsfile"){
	if (document.getElementById("filename").value != "no"){
	    name = document.getElementById("filename").value;
	    var dt = new Date();
	    now = dt.getTime()/1000;
	    msg = new ROSLIB.Message({data:name, from_node:"web", timestamp:now});
	    observation.publish(msg);
	    console.log("obsfile", name);
	}else{
	    msg="";
	};
    }else{
	msg="";
    }

    if (value == "on"){
	$("#"+key+"_on").attr("class", "btn btn-danger");
	$("#"+key+"_off").attr("class", "btn btn-default");
    }else if(value == "off"){
	$("#"+key+"_off").attr("class", "btn btn-danger");
	$("#"+key+"_on").attr("class", "btn btn-default");
    }else if (value=="IN"){
	$("#"+key+"_IN").attr("class", "btn btn-danger");
	$("#"+key+"_OUT").attr("class", "btn btn-default");
    }else if(value=="OUT"){
	$("#"+key+"_OUT").attr("class", "btn btn-danger");
	$("#"+key+"_IN").attr("class", "btn btn-default");
    }else if(value=="OPEN"){
	$("#"+key+"_OPEN").attr("class", "btn btn-danger");
	$("#"+key+"_CLOSE").attr("class", "btn btn-default");
    }else if(value=="CLOSE"){
	$("#"+key+"_CLOSE").attr("class", "btn btn-danger");
	$("#"+key+"_OPEN").attr("class", "btn btn-default");
    }else if(value=="tracking"){
	$("#"+key+"_tracking").attr("class", "btn btn-danger");
	$("#"+key+"_trackend").attr("class", "btn btn-default");
    }else if(value=="trackend"){
	$("#"+key+"_trackend").attr("class", "btn btn-danger");
	$("#"+key+"_tracking").attr("class", "btn btn-default");	
    }else{}

    console.log("msg",msg)
};

$(".btn").on("click", function(e){
    var id =  $(this).attr("id");
    PubMotorValues(id);
    console.log("id", id);
})

/*
document.getElementById("camstream").data ="http://"
    +"172.20.0.91"
    +":10000/stream?topic=/cv_camera_node/image_raw" ;
*/


document.getElementById("camstream").data ="http://"
    +"192.168.101.153"
    +":10000/stream?topic=/cv_camera_node/image_raw" ;

