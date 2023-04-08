import io
import cv2
import numpy as np
import time
import picamera
import picamera.array
import pyzbar.pyzbar as pyzbar

with picamera.PiCamera() as camera:
    # Set the resolution of the camera
    camera.resolution = (640, 480)
    while True:
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
            break
        else:
            print('No QR code found.')

    # Release camera resources
    camera.close()
