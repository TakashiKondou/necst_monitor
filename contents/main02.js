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

/*
var ondo = new ROSLIB.Topic({
    ros : ros,
    name : "/outer_ondotori",
    messageType : "ondo/tr7nw_values"
});
*/

ls.subscribe(function(message) {
    for( name in message){
	if (name=="Current_Az"||name=="Current_El"){
	    message_e=parseFloat(message[name]).toFixed(3)
	}else if (name=="Command_Az"||name=="Command_El"){
	    message_e=parseFloat(message[name]).toFixed(3)
	}else if (typeof(message[name])=="number"){
	    message_e=parseFloat(message[name]).toFixed(0)}else{
		message_e=message[name]
	    }
	try{
	    if(name=="OutTemp"||name=="OutHumi"){
		;
	    }else{
		document.getElementById(name).innerHTML = message_e;//message[name];
	    }
	    if(name == "WindSp"){
		if (message_e > 20){
		    $("#WindSp").attr("class", "emergency")}else if(message_e > 15){
			$("#WindSp").attr("class", "warning")}else{
			    $("#WindSp").attr("class", "nomal")
			}
	    }else if (name == "Rain"){
		if (message_e > 5){
		    $("#Rain").attr("class", "warning")}else{
		    }
	    }else{
	    }
	}
	catch(e){
	}
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

auth.subscribe(function(message) {
    document.getElementById("Authority2").innerHTML = message.data
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

var dome = new ROSLIB.Topic({
    ros : ros,
    name : "/WebDome",
    messageType : "necst/String_necst"
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

    if (key == "drive"){
	msg = new ROSLIB.Message({data:String(value)});
	drive.publish(msg);
	//contactor.publish(msg);
    }else if(key == "emergency"){
	msg = new ROSLIB.Message({data:String(value)});
	emergency.publish(msg);	
    }else if(key == "hot"){
	msg = new ROSLIB.Message({data:String(value)});
	hot.publish(msg);
    }else if(key == "m4"){
	msg = new ROSLIB.Message({data:String(value)});
	m4.publish(msg);
    }else if(key == "dome"){
	msg = new ROSLIB.Message({data:String(value)});
	dome.publish(msg);
	console.log("ok")
    }else if(key == "memb"){
	msg = new ROSLIB.Message({data:String(value)});
	memb.publish(msg);	
    }else if (key == "authority"){
	msg = new ROSLIB.Message({data:String(value)});
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
    }else if (value=="in"){
	$("#"+key+"_in").attr("class", "btn btn-danger");
	$("#"+key+"_out").attr("class", "btn btn-default");
    }else if(value=="out"){
	$("#"+key+"_out").attr("class", "btn btn-danger");
	$("#"+key+"_in").attr("class", "btn btn-default");
    }else if(value=="open"){
	$("#"+key+"_open").attr("class", "btn btn-danger");
	$("#"+key+"_close").attr("class", "btn btn-default");
    }else if(value=="close"){
	$("#"+key+"_close").attr("class", "btn btn-danger");
	$("#"+key+"_open").attr("class", "btn btn-default");
    }else{}

    console.log("msg",msg)
};



/*

$("#motor_on").on("click", function(e){
    Pubmotorvalues('on');
    $("#motor_on").attr("class", "btn btn-danger");
    $("#motor_off").attr("class", "btn btn-default");
})

$("#motor_off").on("click", function(e){
    pubMotorValues("off");
    $("#motor_on").attr("class", "btn btn-default");
    $("#motor_off").attr("class", "btn btn-danger");
});

$("#hot_in").on("click", function(e){
    pubHotValues('in');
    $("#hot_in").attr("class", "btn btn-danger");
    $("#hot_out").attr("class", "btn btn-default");
})

$("#hot_out").on("click", function(e){
    pubHotValues("out");
    $("#hot_in").attr("class", "btn btn-default");
    $("#hot_out").attr("class", "btn btn-danger");
});
*/


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

