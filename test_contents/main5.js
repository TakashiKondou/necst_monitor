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
    for( e in message){
	if (typeof(message[e])=="number"){
	    ll=parseInt(message[e])}else{
		ll=message[e]
	    }
	document.getElementById(e).innerHTML = ll;
    }
});

var drive = new ROSLIB.Topic({
    ros : ros,
    name : "/antenna_drive",
    messageType : "std_msgs/String"
});



function pubMotorValues(move){
    msg = new ROSLIB.Message({data:String(move)});
    console.log(msg)
    drive.publish(msg)
};



$("#motor_on").on("click", function(e){
    pubMotorValues('on');
    $("#motor_on").attr("class", "btn btn-danger");
    $("#motor_off").attr("class", "btn btn-default");
})

$("#motor_off").on("click", function(e){
    pubMotorValues("off");
    $("#motor_on").attr("class", "btn btn-default");
    $("#motor_off").attr("class", "btn btn-danger");
});

document.getElementById("camstream").data ="http://"
    +"192.168.101.153"
    +":10000/stream?topic=/cv_camera_node/image_raw" ;
