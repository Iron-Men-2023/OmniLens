import cv2
import numpy as np
import picamera
import picamera.array
from upload import *
from api_call import *
from lcd import *
import io
import pyzbar.pyzbar as pyzbar

temp = False
api = FacialRecognitionAPI("https://flask-api-omnilense.herokuapp.com")
# Load the face cascade classifier
face_cascade = cv2.CascadeClassifier('/home/pi/Desktop/OmniLens/OpenCV/haarcascade_frontalface_default.xml')
print("about to start")
with picamera.PiCamera() as camera:
    with picamera.array.PiRGBArray(camera) as output:
        while True:
            # Capture a frame from the camera
            camera.resolution= (440,280)
            camera.rotation=180
            while temp == False:
                # Create a BytesIO object for the image data in memory
                image_stream = io.BytesIO()

                # Capture an image and save it to the image stream
                camera.capture(image_stream, format='jpeg')

                # Set the position of the stream to the beginning
                image_stream.seek(0)

                # Read the image data from the stream into a Numpy array
                image_data = np.frombuffer(image_stream.getvalue(), dtype=np.uint8)

                # Decode the JPEG image data to a Numpy array
                image_array = cv2.imdecode(image_data, cv2.IMREAD_COLOR)

                # Convert the image to grayscale
                gray = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)

                # Try to decode any QR codes in the image
                codes = pyzbar.decode(gray)

                if len(codes) > 0:
                    # Print the decoded QR code
                    print('QR code: {}'.format(codes[0].data.decode('utf-8')))
                    temp = True
                else:
                    print('No QR code found.')
                    
            camera.capture(output, 'bgr')
            frame= output.array
            # Convert the frame to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Detect faces in the grayscale image
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)


            # Draw rectangles around the detected faces
            if len(faces)!=0:
                camera.capture("/home/pi/Desktop/holder/local.jpeg")
                #upload1("LfqBYBcq1BhHUvmE7803PhCFxeI2","/home/pi/Desktop/holder/local.jpeg")
                display1("Face Detected!","Loading...")
                result_call=api.recognize_face("/home/pi/Desktop/holder/local.jpeg", "LfqBYBcq1BhHUvmE7803PhCFxeI2", "web")
                display1(result_call," ")
                time.sleep(3)
                clear()
                

            # Clear the stream for the next frame
            output.truncate(0)

            # Exit if the 'q' key is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

# Release the camera and close all windows
camera.close()
cv2.destroyAllWindows()

