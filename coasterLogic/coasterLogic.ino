boolean carIsBack = true;
int green = 10;
int yellow = 9;
int red = 8;
int rideLights = 12;
int motor = 7;
int stopButton = 3;
int sendButton = 2;
int lightButton = 4;
bool lightsOn = false;
bool halted  = false;
void setup() {
  Serial.begin(9600);//serial transmits 9600
  // outputs:
  pinMode(green, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(red, OUTPUT);
  pinMode(rideLights, OUTPUT);
  pinMode(motor, OUTPUT);
  //Inputs
  pinMode(stopButton, INPUT);
  pinMode(sendButton, INPUT);
  pinMode(lightButton, INPUT);
  pinMode(11, INPUT);
}

void loop() {

  if (digitalRead(sendButton)) {
    sendCar();
  }

  if (digitalRead(stopButton)) {
    halt();
  }

  if (digitalRead(lightButton)) {
    lightToggle();
  }
  //delay(200);
  if (digitalRead(11) == LOW) {
    carReturned();
  }

}

//This function toggles the ride lights on and off
void lightToggle() {
  lightsOn = !lightsOn;
  if (lightsOn) {
    digitalWrite(rideLights, HIGH);
  }
  else {
    digitalWrite(rideLights, LOW);
  }
}

void halt() {
  halted = !halted;
  if (halted) {
    digitalWrite(green, LOW);
    digitalWrite(yellow, LOW);
    digitalWrite(red, HIGH);

    digitalWrite(motor, LOW);
  }
  else {
    digitalWrite(red, LOW);
  }

}

void sendCar() {
  carIsBack = false;
  digitalWrite(green, LOW);
  digitalWrite(yellow, HIGH);
  for (int i = 0; i < 400; i++) {
    if (digitalRead(stopButton)) {
      halt();
    }
    if (!halted) {
      digitalWrite(motor, HIGH);
      delay(10);
    }
    else if (halted) {
      digitalWrite(motor, LOW);
      digitalWrite(red, HIGH);
      digitalWrite(yellow, LOW);
    }
  }
  digitalWrite(motor, LOW);

}

void carReturned() {
  digitalWrite(yellow, LOW);
  digitalWrite(green, HIGH);
  carIsBack = true;
}



