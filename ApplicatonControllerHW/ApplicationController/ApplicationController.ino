const int buttonPin = 2;     // the number of the pushbutton pin
const int ledPin =  13;      // the number of the LED pin

enum data_type {
  BUTTON = 1,
  SYSTEM_VOL = 2,
  APPLICATION_VOL = 3
};

// LED Button Pins
const int buttonPin1 = 2;

// System Rotary Encoder Pin Values
const int systemVolPotPin = 0;
const int systemVolMutePin = 8;
const int systemVolPinAPin = 9;
const int systemVolPinBPin = 10;

// System Volume Values
int systemVol = 0;
int systemVolPotVal = 0;
bool systemVolIsMuted = false;
int lastSystemVolPinAReading = LOW;

// Button Timers
bool canPressSystemVolMute = true;
bool canPressApplicationVolMute = true;
bool canPressLEDButton = true;
signed long systemMuteLastPressedTime = 0;
signed long applicationMuteLastPressedTime = 0;
signed long buttonLastPressedTime = 0;

// Application Volume Values
int applicationVolPotVal = 0;

// Button States
int currentButtonState = 0;

// variables will change:
int buttonState = 0;         // variable for reading the pushbutton status
bool ableToPressButton = true;
signed long lastPressedTime;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT);
  pinMode(systemVolMutePin, INPUT);
  pinMode(systemVolPinAPin, INPUT);
  pinMode(systemVolPinBPin, INPUT);
  lastSystemVolPinAReading = digitalRead(systemVolPinAPin);
}

void loop() {
  performCyclicButtonValidation();
  getSystemVolumeControls();
  checkForLEDButtonPress();
}

void sendSerialData(int value, int value_type) {
  String send_data = String(value) + "," + String(value_type);
  Serial.println(send_data);
}
