
(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDB-W_rJpMGPyI_w4LB5Q6-T7HcHXGmhho",
    authDomain: "testing-cf658.firebaseapp.com",
    databaseURL: "https://testing-cf658.firebaseio.com",
    storageBucket: "testing-cf658.appspot.com",
    messagingSenderId: "611513984981"
  };
  firebase.initializeApp(config);
//get elements
const lightObject = document.getElementById('object1');
const rideObject = document.getElementById('object2');
const time = document.getElementById('time');
const record = document.getElementById('recordTime');
const allTimeLoops = document.getElementById('loop2');
// create references to the database

const lightData = firebase.database().ref().child('lightStatus');
const coasterMode = firebase.database().ref().child('coasterMode');
const coasterEstop = firebase.database().ref().child('coasterEstop');
const loopCount = firebase.database().ref().child('loopCount');
const coasterAlert = firebase.database().ref().child('coasterAlert');
const recordTime = firebase.database().ref().child('recordTime');
const timeElapsed = firebase.database().ref().child('timeElapsed');
const totalLoops = firebase.database().ref().child('totalLoops');


// keep the text on the page updated
lightData.on('value', snap => {
	if(snap.val()===false){
lightObject.innerText = "Light Status: Off";
	}
	else{
		lightObject.innerText = "Light Status: On";
	}
});
coasterMode.on('value', snap => {
rideObject.innerText = "Ride Mode: " + JSON.stringify(snap.val(), null, 3);
});
recordTime.on('value',snap =>{
record.innerText = "The record time is " + JSON.stringify(snap.val()/1000,null,3) + " seconds";
});
timeElapsed.on('value',snap => {
  time.innerText = "The previous run was " + JSON.stringify(snap.val()/1000,null,3) + " seconds";
});
totalLoops.on('value',snap => {
allTimeLoops.innerHTML = "The coaster has completed " + JSON.stringify(snap.val(),null,3) + " trips in all";
})
}());

// create references to the database

const lightData = firebase.database().ref().child('lightStatus');
const coasterMode = firebase.database().ref().child('coasterMode');
const coasterEstop = firebase.database().ref().child('coasterEstop');
const loopCount = firebase.database().ref().child('loopCount');
const coasterAlert = firebase.database().ref().child('coasterAlert');
const motorOn = firebase.database().ref().child('motorOn');
const recordTime = firebase.database().ref().child('recordTime');
const timeElapsed = firebase.database().ref().child('timeElapsed');
const totalLoops = firebase.database().ref().child('totalLoops');

// time for time keeping purposes
const timeDeparted = firebase.database().ref().child('timeDeparted');
const timeReturned = firebase.database().ref().child('timeReturned');


var lightInfo;
lightData.once('value',function(snapshot){
lightInfo = snapshot.val();
})

function lightSwitch(){
  if(lightInfo){
    lightData.set(true);
  }
  else{
    lightData.set(false);
  }
    lightInfo = !lightInfo;

}//end lightSwitch()

function sendSingle(){
  coasterEstop.once('value',function(getData){
    if(getData.val()===false){
  coasterMode.set("Single loop"); //says the mode is single
  sendCoaster();
} // run the motor for 4 seconds or adjust as needed
});
}//end of send single);

function emergencyStop(){
  coasterEstop.once('value',function(getData){
    if(getData.val()===false){
      coasterEstop.set(true);
      coasterMode.set("EMERGENCY STOP");
    }
    else{
      coasterEstop.set(false);
      coasterMode.set("System Ready");
    }
  });
}//end of emergencyStop()

function contLoop(){
  coasterEstop.once('value',function(getData){
    if(getData.val()===false){
      coasterMode.set("Continuous");
      sendCoaster();
  };
});
}

function runFor(){
  var n = document.getElementById("loopNumber").value-1;
  coasterMode.set("Loop for");
  loopCount.set(n);
  sendCoaster();

};
//this function runs the motor for 4 seconds when a ride is called
function sendCoaster(){
  var d = new Date();
  var n = d.getTime();
  timeDeparted.set(n);//set the time that the car departs
  motorOn.set(true);
  setTimeout(function(){
    motorOn.set(false);
  },4000);
}
