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
	    message_e=parseInt(message[name])}else{
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
    messageType : "std_msgs/String"
});

var hot = new ROSLIB.Topic({
    ros : ros,
    name : "/hot",
    messageType : "std_msgs/String"
});

var m4 = new ROSLIB.Topic({
    ros : ros,
    name : "/m4",
    messageType : "std_msgs/String"
});

var dome = new ROSLIB.Topic({
    ros : ros,
    name : "/dome_move",
    messageType : "necst/Dome_msg"
});

function PubMotorValues(id){
    var key = id.split("_")[0]
    var value = id.split("_")[1]

    if (key == "drive"){	
	msg = new ROSLIB.Message({data:String(value)});
	drive.publish(msg);
    }else if(key == "hot"){
	msg = new ROSLIB.Message({data:String(value)});
	hot.publish(msg);
    }else if(key == "m4"){
	msg = new ROSLIB.Message({data:String(value)});
	m4.publish(msg);
    }else if(key == "dome"||key=="memb"){
	msg = new ROSLIB.Message({name:"command", value:String(id)});
	dome.publish(msg);
    }else{
	;}
    
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
    console.log(id)
})



document.getElementById("camstream").data ="http://"
    +"192.168.101.153"
    +":10000/stream?topic=/cv_camera_node/image_raw" ;
