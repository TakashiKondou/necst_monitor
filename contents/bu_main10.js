var ros = new ROSLIB.Ros({url : "ws://" + location.hostname + ":9000"});

ros.on("connection", function() {console.log("websocket: connected"); });
ros.on("error", function(error) {console.log("websocket error; ", error); });
ros.on("close", function() {console.log("websocket: closed");});

var ls = new ROSLIB.Topic({
    ros : ros,
    name : "/read_status",
    messageType : "necst/Read_status_msg"
});

ls.subscribe(function(message) {
    for( name in message){
	if (typeof(message[name])=="number"){
	    if(String(message[name]).length > 5){
		message_e=parseFloat(message[name]).toFixed(4)
	    }else{
		message_e=parseFloat(message[name])
	    }
	}else{
	    message_e=message[name]
	}
	try{
	    document.getElementById(name).innerHTML = message_e//message[e]
	    if (name == "OutHumi"){
		if (message_e > 80){
		    $("#OutHumi").attr("class", "emergency")}else if(message_e > 60){
			$("#OutHumi").attr("class", "warning")}else{
			    $("#OutHumi").attr("class", "nomal")
			}
	    }else if(name == "WindSp"){
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

var drive = new ROSLIB.Topic({
    ros : ros,
    name : "/antenna_drive",
    messageType : "necst/String_necst"
});

var contactor = new ROSLIB.Topic({
    ros : ros,
    name : "/antenna_contactor",
    messageType : "necst/String_necst"
});
    
var hot = new ROSLIB.Topic({
    ros : ros,
    name : "/hot",
    messageType : "necst/String_necst"
});

var m4 = new ROSLIB.Topic({
    ros : ros,
    name : "/m4",
    messageType : "necst/String_necst"
});

var dome = new ROSLIB.Topic({
    ros : ros,
    name : "/dome_move",
    messageType : "necst/Dome_msg"
});

var antenna = new ROSLIB.Topic({
    ros : ros,
    name : "/onepoint_command",
    messageType : "necst/Move_mode_msg"
});

var stop = new ROSLIB.Topic({
    ros : ros,
    name : "/move_stop",
    messageType : "necst/Bool_necst"
});

function PubMotorValues(id){
    var key = id.split("_")[0]
    var value = id.split("_")[1]

    if (key == "drive"){	
	msg = new ROSLIB.Message({data:String(value)});
	drive.publish(msg);
	contactor.publish(msg);
	console.log(msg)
    }else if(key == "hot"){
	msg = new ROSLIB.Message({data:String(value)});
	hot.publish(msg);
	console.log(msg)
    }else if(key == "m4"){
	msg = new ROSLIB.Message({data:String(value)});
	m4.publish(msg);
	console.log(msg)
    }else if(key == "dome"||key=="memb"){
	msg = new ROSLIB.Message({name:"command", value:String(id)});
	dome.publish(msg);
	console.log(msg)
    }else if(key == "antenna"){
	az = parseFloat(document.forms.form1.input_az.value)
	el = parseFloat(document.forms.form1.input_el.value)
	console.log(az,el)
	ctime = Date.now()/1000
	stop_flag = new ROSLIB.Message({data:Boolean(0), from_node:"web_GUI", timestamp:ctime})
	stop.publish(stop_flag)	
	msg = new ROSLIB.Message({x:az, y: el,coord:"horizontal", planet:"0", off_x:0, off_y:0, offcoord:"horizontal", hosei:"hosei_230.txt", lamda:2600, dcos:0, func_x:"0", func_y:"0", limit:Boolean(1), from_node:"web_GUI", timestamp:ctime});
	antenna.publish(msg);
	console.log(msg)
    }else if(key == "emergency"){
	msg = new ROSLIB.Message({data:"stop"});
	stop.publish(msg);
	console.log(msg)
    }else{
	;}
    
    /*color change*/
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
    
    console.log(msg)
};


$(".btn").on("click", function(e){
    var id =  $(this).attr("id");
    PubMotorValues(id);
    console.log(id)
})


    

document.getElementById("camstream").data ="http://"
    +"192.168.101.153"
    +":10000/stream?topic=/cv_camera_node/image_raw" ;

/*
document.getElementById("camstream").data ="http://"
    +"192.168.101.67"
    +":10000/stream?topic=/cv_camera_node/image_raw" ;
*/
