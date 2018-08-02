/*initialize*/
/*
var config = {
    apiKey: "AIzaSyCV9QTs7Kzg5olXhrBWgbWjcAJZrXyV8ZU",
    authDomain: "nasco-obs-monitor.firebaseapp.com",
    databaseURL: "https://nasco-obs-monitor.firebaseio.com",
    projectId: "nasco-obs-monitor",
    storageBucket: "nasco-obs-monitor.appspot.com",
    messagingSenderId: "944989612626"
};
*/

var config = {
    apiKey: "AIzaSyCV9QTs7Kzg5olXhrBWgbWjcAJZrXyV8ZU",
    authDomain: "nasco-obs-monitor.firebaseapp.com",
    databaseURL: "https://nasco-obs-monitor.firebaseio.com",
    projectId: "nasco-obs-monitor",
    storageBucket: "nasco-obs-monitor.appspot.com",
    messagingSenderId: "944989612626"
};


firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword("nascofirebase@gmail.com","passnasco");

var db = firebase.database();
var node = db.ref("/NECST/Monitor/Telescope/Node_status");
var weather = db.ref("/NECST/Monitor/Instrument/Weather");
var weather24 = db.ref("/NECST/Monitor/Instrument/Weather24");
var encoder = db.ref("/NECST/Monitor/Telescope/Encoder");
var device = db.ref("/NECST/Monitor/Telescope/Device");
var timer = db.ref("/NECST/Monitor/Telescope/Timer");
var obs = db.ref("/NECST/Monitor/Telescope/Obs_status");
var onepoint = db.ref("/NECST/Monitor/Telescope/Onepoint_status");

var rx_vacuum = db.ref("/NECST/Monitor/RX/Vacuum");

var w_device = db.ref("/NECST/Controll/Telescope/Device");
var w_queue = db.ref("/NECST/Controll/Telescope/Queue");

/*
var random = Math.random();
aa = parseInt(random*5);
bb = ["Hello my master.", "Fight~~", "Happy Day!!", "Maybe Sleepy??", "Yes, we can."];
document.getElementById("asobi").innerText = bb[aa]
*/

node.on("value", snapshot => {
	for (i in snapshot.val()){
	    if (i=="NodeStatus"){
		_list="";
		for (j in snapshot.val()[i]){
		    /*console.log(snapshot.val()[i][j]);*/
		    _list += (snapshot.val()[i][j]).toString();
		    _list +="\n"
			};
		document.getElementById("n_status").innerText = _list;
		document.getElementById(i).className="node_box_blue";
	    }else if(snapshot.val()[i]==true){
		document.getElementById(i).className="node_box_blue";
	    }else if(snapshot.val()[i]==false){
		document.getElementById(i).className="node_box_red";
	    }else if(snapshot.val()[i]==""){
		document.getElementById(i).className="node_box";
	    }else{
	    }
	}
    });

weather.on("value", snapshot => {
	for (i in snapshot.val()){
	    if (i =="Year"||i=="Month"||i=="Day"||i=="Hour"||i=="Min"||i=="Sec"){
		param = (snapshot.val()[i]).toFixed(0);
	    }else{
		try{
		    param = (snapshot.val()[i]).toFixed(2);
		    document.getElementById(i).innerText = param;
		    document.getElementById(i+"_box").className="node_box_blue";
		}catch(e){
		}
	    }
	};
    });

weather24.on("value", snapshot => {
	for (i in snapshot.val()){
	    weather_monitor(snapshot.val()["humi24"], snapshot.val()["wind24"]);
	    //weather_monitor(snapshot.val()["wind24"],"wind");
	}
    });


device.on("value", snapshot => {
	for (i in snapshot.val()){
	    /*console.log(i)*/
	    if (i=="Drive_ready_Az"){
	    }else if (i=="Current_Az"||i=="Current_El"||i=="Command_Az"||i=="Command_Az"||i=="Command_El"||i=="Deviation_Az"||i=="Deviation_El"||i=="Current_Dome"){
		param=(snapshot.val()[i]).toFixed(3)
		document.getElementById(i).innerText = param;		
	    }else if(i=="Current_M2"){
		param=(snapshot.val()[i]*1000.).toFixed(3);
		document.getElementById(i).innerText = param;
	    }else{
		/*console.log(i)*/
		document.getElementById(i).innerText = snapshot.val()[i];
	    }
	}
    });

encoder.on("value", snapshot => {
	for (i in snapshot.val()){
	    document.getElementById(i).innerText = (snapshot.val()[i]/3600.).toFixed(4)
	}
    });

timer.on("value", snapshot => {
	for (i in snapshot.val()){
	    try{
		document.getElementById(i).innerText = snapshot.val()[i]
	    }catch(e){
		/*console.log(e)*/
	    }
	}
    });

document.getElementById("obs_box").style.display = "block";
document.getElementById("obs_box_one").style.display = "none";
obs.on("value", snapshot => {
	for (i in snapshot.val()){
	    if(i=="active"){
		if(snapshot.val()[i]==true){
		    document.getElementById("obs_box").className="column22-main-sub3-true";
		    document.getElementById("obs_box").style.display = "block";
		    document.getElementById("obs_box_one").style.display = "none";
		}else if(snapshot.val()[i]==false){
		    document.getElementById("obs_box").className="column22-main-sub3";
		}else{
		    console.log("xxxxxxxx")		
		}
	    }else if(i=="timestamp"){
		if(snapshot.val()["active"]==true){
		    if(snapshot.val()[i] != document.getElementById("start_time").innerText){
			document.getElementById("start_time").innerText = snapshot.val()[i]
		    }else{}
		}else if(snapshot.val()["active"]==false){
		    if(snapshot.val()[i] != document.getElementById("end_time").innerText){
			document.getElementById("end_time").innerText = snapshot.val()[i]
		    }else{}
		}else{}		    
	    }else if(i != "current_num" & i != "current_position"){
		if (snapshot.val()[i]!=0||snapshot.val()[i]!=""){
		    try{
			document.getElementById(i).innerText = snapshot.val()[i];
		    }catch(e){
			console.log(e)
		    }
		    /*if (snapshot.val()["current_position"]=="ON"){*/
		    if(snapshot.val()["obsmode"] == "LINECROSS"){
			if(parseInt(snapshot.val()["current_num"]/snapshot.val()["num_on"])%2 == 0){
			    px = parseInt(snapshot.val()["current_num"]%snapshot.val()["num_on"])-parseInt(snapshot.val()["num_on"]/2);
			    py = 0;
			}else{
			    px = 0;
			    py = parseInt(snapshot.val()["current_num"]%snapshot.val()["num_on"])-parseInt(snapshot.val()["num_on"]/2);
			}
			xnum = snapshot.val()["num_on"]
			ynum = snapshot.val()["num_on"]			
		    }else if(snapshot.val()["obsmode"] == "LINEOTF"){
			px = 0;
			py = parseInt(snapshot.val()["current_num"]/snapshot.val()["num_on"])-parseInt(snapshot.val()["num_seq"]/2);
			xnum = snapshot.val()["num_on"]
			ynum = snapshot.val()["num_on"]			
		    }else{
			px = 0;
			py = 0;
			xnum = 2;
			ynum = 2;
		    }

		    console.log(parseInt(snapshot.val()["current_num"]));
		    console.log(px, py, xnum, ynum)
		    otf_plot("plot", px, py, xnum, ynum)
		    /*}else{}*/
		}else{
		    ;
		}
	    }else if(i == "current_num"){
		num = parseInt(snapshot.val()[i]%snapshot.val()["num_on"])
		document.getElementById(i).innerText = num;
	    }else if(i == "next_obs"){
	    }else{
		document.getElementById(i).innerText = snapshot.val()[i];
	    }
	}
    });

onepoint.on("value", snapshot => {
	for (i in snapshot.val()){
	    if(i=="one_active"){
		if(snapshot.val()[i]==true){
		    document.getElementById("obs_box_one").className="column22-main-sub3-true";
		    document.getElementById("obs_box").style.display = "none";
		    document.getElementById("obs_box_one").style.display = "block";		    
		}else if(snapshot.val()[i]==false){
		    document.getElementById("obs_box_one").className="column22-main-sub3";
		}else{
		    console.log("xxxxxxxx")		
		}
	    }else if(i=="timestamp"){
		if(snapshot.val()["one_active"]==true){
		    if(snapshot.val()[i] != document.getElementById("one_start_time").innerText){
			document.getElementById("one_start_time").innerText = snapshot.val()[i]
		    }else{}
		}else if(snapshot.val()["one_active"]==false){
		    if(snapshot.val()[i] != document.getElementById("one_end_time").innerText){
			document.getElementById("one_end_time").innerText = snapshot.val()[i]
		    }else{}
		}else{}		    
	    }else if(i != "one_current_num" & i != "one_current_position"){
		if (snapshot.val()[i]!=0||snapshot.val()[i]!=""){
		    try{
			document.getElementById(i).innerText = snapshot.val()[i];
		    }catch(e){
			console.log(e)
		    }
		    /*if (snapshot.val()["current_position"]=="ON"){*/
		    px = 0
		    py = 0
		    otf_plot("oneplot", px, py, snapshot.val()["one_num_on"]+1, snapshot.val()["one_num_on"]+1)
		    /*}else{}*/
		}else{
		    ;
		}
	    }else{
		document.getElementById(i).innerText = snapshot.val()[i];
	    }
	}
    });


var audio = new Audio();

var weather_monitor = function(humi,wind){
    var dt = new Date();
    hh = parseInt(dt.getUTCHours());
    timelist = [];
    data_humi = [];
    data_wind = []
    for(var i=1;i<24;i++){
	if(hh+i<24){
	    timelist.push(hh+i);
	    data_humi.push(humi[hh+i]);
	    data_wind.push(wind[hh+i]);
	}else{
	    timelist.push(hh+i-24);
	    data_humi.push(humi[hh+i-24]);
	    data_wind.push(wind[hh+i-24]);
	}
    }
    timelist.push(hh);
    data_humi.push(humi[hh]);
    data_wind.push(wind[hh]);
    new Chart(document.getElementById("w_monitor"), {
	    type: "line",
	    data: {
		labels: timelist,
		datasets: [
			   {
				   label: "weather monitor humi",
				   data: data_humi,
				   borderColor:"#ffdab9",
				   yAxisID: "y-axis-1",
				   }, 
			   {
				   label: "weather monitor wind",
				   data : data_wind,
				   borderColor:"#fafacc",
				   yAxisID: "y-axis-2",
				   },

			   ],
		    },
		options:{
		responsive:true,
		    scales:{
		    yAxes:[{
			    id: "y-axis-1",
				position:"left",
				ticks:{
				min:0,
				    max:100,
				    },
				scaleLabel:{
				display:true,
				labelString:"humidity [%]",
				    fontsize:18,
				    }

			},{
			    id: "y-axis-2",
				position:"right",
				ticks:{
				min:0,
				    max:30,
				    },
				scaleLabel:{
				display:true,
				    labelString:"wind speed [km/s]",
				    fontsize:20,
				    }
			}]
			}
		    },
		});
};
    
var otf_plot = function(id, px, py, xnum, ynum){
    data = [{
	    x:px,
	    y:py,
	}
    ]

    new Chart(document.getElementById(id), {
	    type: "bubble",
	    data: {
		labels: "OTF_plot",
		datasets: [{
			label: "current_position",
			data: data,
		    }]
	    },
	    options:{
		scales:{
		    xAxes:[{
			    type:"linear",
			    position:"bottom",
			    ticks:{
				min:-parseInt(xnum/2),
				max:parseInt(xnum/2),
			    }
			}],
		    yAxes:[{
			    ticks:{
				min:-parseInt(ynum/2),
				max:parseInt(ynum/2),
			    }
			}]
		}
	    }
	});
};
	
w_device.on("value", snapshot => {
	document.getElementById("user").innerText = snapshot.val()["user"]
    });

rx_vacuum.on("value", snapshot => {
	for (i in snapshot.val()){
	    if (i==""){
		name == "vacuum";
		document.getElementById(name).innerText = (snapshot.val()[i]).toFixed(2)
	    }else{
	    };
	}
    });

var cl = document.getElementsByClassName("btn");
for (i=0;i < cl.length;i++){
    cl[i].onclick = function(){
        console.log(this.id);
        writefunction(this.id);
    };
};

function writefunction(id){
    var key = id.split("_")[0];
    var value = id.split("_")[1];
    console.log("key",key);
    console.log("value", value);
    if (key=="queue"){
	w_queue.update({observation:value});
    }else if(key=="test"){
	rr = firebase.storage().ref().child('test.png');
	rr.getDownloadURL().then(function(url){
		document.getElementById('image').src = url;
	    });
    }else{
	console.log("!!!!! error command !!!!!")
    }
}


/*
try{
    var camera = document.getElementById("camstream");
    camera.innerHTML = '<img style="-webkit-user-select: none;" src="http://192.168.101.153:10000/stream?topic=/cv_camera_node/image_raw" width="292" height="130">';
    //origin --> w292,h219;
}catch(e){
}
*/