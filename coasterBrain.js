var admin = require("firebase-admin");
var serviceAccount = require("serviceKey.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testing-cf658.firebaseio.com"
});

var db = admin.database();
//here is the variables linked to the database
var motorState = db.ref().child('motorOn');
var coasterBack = db.ref().child('coasterBack');
var coasterEstop = db.ref().child('coasterEstop');
var coasterMode = db.ref().child('coasterMode');
var lightStatus = db.ref().child('lightStatus');
var loopCount = db.ref().child('loopCount');
var motorState = db.ref().child('motorOn');
var recordTime = db.ref().child('recordTime');
var timeDeparted = db.ref().child('timeDeparted');
var timeElapsed = db.ref().child('timeElapsed');
var timeReturned = db.ref().child('timeReturned');
var totalLoops = db.ref().child('totalLoops');

// Database setup is taken care of above

var five = require('johnny-five');
var board = new five.Board();
//check the coaster light status
board.on('ready', function(){
  //outputs
  var rideLights = new five.Led(12);//ride lights white
  var greenLight = new five.Led(7);//green
  var yellowLight = new five.Led(6);//yellow
  var redLight = new five.Led(5);//red
  var motor = new five.Led(13);
// inputs
  sendButton = new five.Button(2);
  stopButton = new five.Button(3);
  lightButton = new five.Button(4);
  carBack = new five.Button(8);

//listening to firebase database data
  lightStatus.on('value',function(snap){
    //console.log("The lights are on? " + snap.val());
    if(snap.val()===true){
        rideLights.off();
    }
    else{
      rideLights.on();
    }
  });

  motorState.on('value',function(state){
    if(state.val()===true){
      motor.on();
    }
    else{
      motor.off();
    }
  });


  coasterMode.on('value',function(getMode){
    if(getMode.val()=="Single loop"){
      greenLight.off();
      yellowLight.on();
    }
    if(getMode.val()=="Continuous"){
      greenLight.off();
      yellowLight.on();
    }
    if(getMode.val()=="Loop for"){
      greenLight.off();
      yellowLight.on();
    }
    if(getMode.val()=="EMERGENCY STOP"){
      greenLight.off();
      yellowLight.off();
      redLight.on();
      motor.off();
    }
    if(getMode.val()=="System Ready"){
      greenLight.on();
      yellowLight.off();
      redLight.off();
      motor.off();
    }
  })//end of coasterMode();


  //input listeners Arduino --------------------------------------------------
  sendButton.on("down",function(){
    //console.log("The send button was pressed");
    coasterEstop.once('value',function(getData){
      if(getData.val()===false){
    coasterMode.set("Single loop");
    sendCoaster();
  }
});
  });

  stopButton.on("down",function(){
    //console.log("The stop button was pressed");
    coasterEstop.once('value',function(getData){
      if(getData.val()===false){
        coasterEstop.set(true);
        coasterMode.set("EMERGENCY STOP");
        motor.off();
      }
      else{
        coasterEstop.set(false);
        coasterMode.set("System Ready");
      }
    });
  });

  lightButton.on("down",function(){
    console.log("the light button was pressed");
    lightStatus.once('value',function(check){
      if(check.val()===true){
        lightStatus.set(false);
      }
      else{
        lightStatus.set(true);
      }
    })

  })//end light button

  carBack.on("down",function(){
    console.log("The car has returned");
    //the coaster has completed a loop so add to the total count
    totalLoops.once('value',function(getNum){
      var loopNum = getNum.val();
      totalLoops.set(loopNum+1);//adds one each loop
    });
    coasterEstop.once('value',function(getData){
      if(getData.val()===false){
        var d = new Date();
        var n = d.getTime();
        timeReturned.set(n);//send the final time
        timeDeparted.once('value',function(getTime){
          var l = getTime.val();
          var c = n-l;//total ride time
          timeElapsed.set(c);//set the time elapsed
           recordTime.once('value',function(getTime){
             if(getTime.val()>c){
               recordTime.set(c);
             }//end set new record
           });
        });//end set ride time
      }//end submit ride final time
    });
    coasterMode.once('value',function(getMode){
        if(getMode.val()==="Single loop"){
          coasterMode.set("System Ready");
        }
        if(getMode.val()==="Loop for"){
            loopCount.once('value',function(goAgain){
              if(goAgain.val()>0){
                var newCount = goAgain.val()-1;
                loopCount.set(newCount);
                sendCoaster();
              }
              else{
                coasterMode.set("System Ready");
              }
            });
        }
        if(getMode.val()==="Continuous"){
          sendCoaster();//if the mode is in coninuous just keep sending the coaster
        }
    });
  })//end of car returned block

function sendCoaster(){
  var d = new Date();
  var n = d.getTime();
  timeDeparted.set(n);//set the time that the car departs
  motorState.set(true);
  setTimeout(function(){
    motorState.set(false);
  },4000);
}





});//end of the johnny-five board ready
