void checkForLEDButtonPress(){
  if (digitalRead(buttonPin1) == HIGH && canPressLEDButton){
    sendSerialData(1, BUTTON);
    resetLEDButtonTimer();
  }
}

void resetApplicationVolMuteTimer(){
  canPressApplicationVolMute = false;
  applicationMuteLastPressedTime = millis();
}

void resetSystemVolMuteTimer(){
  canPressSystemVolMute = false;
  systemMuteLastPressedTime = millis();
}

void resetLEDButtonTimer(){
  canPressLEDButton = false;
  buttonLastPressedTime = millis();
}

void performCyclicButtonValidation(){
  signed long currTime = millis();
  if (!canPressSystemVolMute && (currTime - systemMuteLastPressedTime) > 1000){
    canPressSystemVolMute = true;
  }
  if (!canPressApplicationVolMute && (currTime - applicationMuteLastPressedTime) > 1000){
    canPressApplicationVolMute = true;
  }
  if (!canPressLEDButton && (currTime - buttonLastPressedTime) > 1000){
    canPressLEDButton = true;
  }
}
