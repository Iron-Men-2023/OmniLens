import cv2
import numpy as np
import picamera
import picamera.array
from upload import *
from api_call import *
from lcd import *
import io


api = FacialRecognitionAPI("https://flask-api-omnilense.herokuapp.com")
# Load the face cascade classifier
face_cascade = cv2.CascadeClassifier('/home/pi/Desktop/OmniLens/OpenCV/haarcascade_frontalface_default.xml')
print("about to start")
with picamera.PiCamera() as camera:
    with picamera.array.PiRGBArray(camera) as output:
        while True:
            # Capture a frame from the camera
            camera.resolution= (320,240)
            camera.capture(output, 'bgr')
            frame= cv2.resize(output.array,(640,480))

            # Convert the frame to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Detect faces in the grayscale image
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
            #print(str(faces))

            # Draw rectangles around the detected faces
            if len(faces)!=0:
                print("face detected")
                camera.capture("/home/pi/Desktop/holder/local.jpeg")
                upload1("LfqBYBcq1BhHUvmE7803PhCFxeI2","/home/pi/Desktop/holder/local.jpeg")
                result_call=api.recognize_face("images/ml_images/LfqBYBcq1BhHUvmE7803PhCFxeI2.jpg")
                display1(result_call)

            # Clear the stream for the next frame
            output.truncate(0)

            # Exit if the 'q' key is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

# Release the camera and close all windows
cv2.destroyAllWindows()

