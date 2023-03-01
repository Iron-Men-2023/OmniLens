from picamera import PiCamera
from time import sleep

camera = PiCamera()

camera.start_preview(fullscreen=False,window=(100,200,300,400))
sleep(10)
camera.stop_preview()
camera.close()

