void getSystemVolumeControls(){
  // Check for system vol mute button press
  if (digitalRead(systemVolMutePin) == LOW && canPressSystemVolMute){
    resetSystemVolMuteTimer();
    systemVolIsMuted = !systemVolIsMuted;
    if (systemVolIsMuted){
      sendSerialData(0, SYSTEM_VOL);
    }
    else {
      sendSerialData(systemVol, SYSTEM_VOL);
    }
  }

  // Read System Volume
  int pinA = digitalRead(systemVolPinAPin);
  if (pinA != lastSystemVolPinAReading){
    systemVolIsMuted = false;
    if (digitalRead(systemVolPinBPin) != pinA){
      systemVol--;
    }
    else {
      systemVol++;
    }
    // Don't let vol go above 100 or under 0
    if (systemVol > 100){
      systemVol = 100;
    }
    else if (systemVol < 0){
      systemVol = 0;
    }
    sendSerialData(systemVol, SYSTEM_VOL);
  }
  lastSystemVolPinAReading = pinA;
}
