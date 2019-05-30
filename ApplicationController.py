import sys, os, time
import subprocess, webbrowser
import win32gui, win32process, win32api
import psutil
import ctypes
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume, ISimpleAudioVolume
import serial, pynotify
import json

master_vol = 0
json_location = os.path.realpath(os.path.join(os.getcwd(), "./ApplicationControllerGui/programmableData.json"))

def main():
  init()
  listen_for_serial()

def listen_for_serial():
  ser = serial.Serial('COM3', 9600)
  should_loop = True
  while should_loop:
    command = ser.readline()
    if (command != ""):
      process_cmd(command)

def process_cmd(command_raw):
  command = [x.strip() for x in command_raw.split(',')]
  command_val = command[0]
  command_type = command[1]
  print command_val
  print command_type

  # button
  if (command_type == "1"):
    parse_json(command_val)
  # System Volume
  elif command_type == "2": 
    print("Should change master vol")
    change_master_vol(float(command_val) / 100)
  # Application Volume
  elif command_type == "3":
    change_active_window_volume(float(command_val) / 100)


def init():
  get_master_vol()

# Gets master volume for initialization
def get_master_vol():
  devices = AudioUtilities.GetSpeakers()
  interface = devices.Activate(
    IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
  volume = cast(interface, POINTER(IAudioEndpointVolume))
  volume.GetMute()
  return volume.GetMasterVolumeLevelScalar() * 100

def open_website(url):
  webbrowser.open_new_tab(url)

def open_application(filePath):
  subprocess.call(filePath)

# Gets the pids associated with the active window
def get_pids_from_active_window():
  #print win32api.GetCurrentProcessId()
  window = win32gui.GetForegroundWindow()
  #print win32process.GetWindowThreadProcessId(window)
  #print win32gui.GetWindowText(win32gui.GetForegroundWindow())
  return win32process.GetWindowThreadProcessId(window)

# Change system master volume
def change_master_vol(volume_level):
  devices = AudioUtilities.GetSpeakers()
  interface = devices.Activate(
    IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
  volume = cast(interface, POINTER(IAudioEndpointVolume))
  volume.GetMute()
  volume.GetMasterVolumeLevel()
  volume.GetVolumeRange()
  volume.SetMasterVolumeLevelScalar(volume_level, None)

# Change volume of active window, if applicable
def change_active_window_volume(volume_level):
  pids = get_pids_from_active_window()
  sessions = AudioUtilities.GetAllSessions()
  for session in sessions:
    volume = session._ctl.QueryInterface(ISimpleAudioVolume)
    if session.Process and (session.ProcessId in pids):
      print session.Process.name()
      print session.ProcessId
      volume.SetMute(0, None)
      volume.SetMasterVolume(volume_level, None)

def get_application_vol():
  pids = get_pids_from_active_window()
  sessions = AudioUtilities.GetAllSessions()
  for session in sessions:
    volume = session._ctl.QueryInterface(ISimpleAudioVolume)
    if session.Process and (session.ProcessId in pids):
      return volume.GetMasterVolume()

# Memory, CPU, Disk usage. CPU temp not available on Windows
def get_pc_stats():
  time.sleep(2)
  print "Memory Usage is: %d%%" % psutil.virtual_memory().percent
  print "CPU usage is: %d%%" % psutil.cpu_percent(interval=1)
  print "Current Disk usage: %d%%" % psutil.disk_usage('/').percent
  current_appliation_vol = get_application_vol()
  if current_appliation_vol:
    print "Current application volume: %d%%" % get_application_vol()
  else:
    print "Current application volume: N/A"
  print "Master Volume: %d%%" % get_master_vol()

def parse_json(button):
  button_name = "button-" + button
  print json_location
  with open(json_location) as json_file:
    data = (json.load(json_file))[int(button) - 1]
    web_ops = data["websiteOperations"]
    file_ops = data["fileOperations"]
    print web_ops[0]
    for url in web_ops:
      open_website(url)
    for exe in file_ops:
      open_application(exe)


if __name__== "__main__":
  main()
