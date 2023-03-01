from io import BytesIO

from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import os
import tempfile
import cv2
from simple_facerec import RecognitionHelper

import platform

ip_address = None
if platform.system() == "Windows":
    print("This is a Windows system.")
    import netifaces

    # Get the IP address of the default network interface
    ip_address = netifaces.ifaddresses('en0')[netifaces.AF_INET][0]['addr']

    # Print the IP address
    print("IP address:", ip_address)
elif platform.system() == "Darwin":
    import socket

    # Get the hostname of the current computer
    hostname = socket.gethostname()

    # Get the IP address of the current computer
    ip_address = socket.gethostbyname(hostname)

    # Print the IP address
    print("IP address:", ip_address)
    print("This is a Mac system.")
elif platform.system() == "Linux":
    print("This is a Linux system.")
else:
    print("This system is not recognized.")

app = Flask(__name__)


@app.route('/api/facial-recognition', methods=['POST'])
def facial_recognition():
    # Get image data from request
    image_data = request.get_json()['image']
    print(image_data)
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
    cv2.imwrite("images/test1.jpg", img)
    resized_img = cv2.resize(img, (0, 0), fx=0.25, fy=0.25)
    rotated_image = cv2.rotate(resized_img, cv2.ROTATE_90_CLOCKWISE)
    cv2.imwrite("images/test.jpg", rotated_image)
    sfr = RecognitionHelper()
    sfr.load_images("images")
    # Wait for 1 second
    cv2.waitKey(500)
    face_locations, face_names = sfr.detect_known_faces(resized_img)

    if face_names is None:
        return jsonify({'message': 'No face found'})
    else:
        for face_loc, name in zip(face_locations, face_names):
            y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]
            # cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)
            # cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 255), 2)
            # cv2.imshow("frame", frame)
        print(face_names)
        return jsonify({'predicted_person': face_names, 'message': 'No face found'})


@app.route('/api/facial-recognition', methods=['GET'])
def get():
    return jsonify({'message': 'Hello World!'})


if __name__ == '__main__':
    if ip_address is not None:
        print(ip_address)
        app.run(host='localhost', port=8000, debug=True)
    else:
        print("IP address is not defined.")
