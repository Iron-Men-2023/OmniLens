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
    encoded_data = request.form['image']
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
    sfr = RecognitionHelper()
    sfr.load_images("images")

    face_locations, face_names = sfr.detect_known_faces(img)

    if face_names is None:
        return jsonify({'message': 'No face found'})
    else:
        for face_loc, name in zip(face_locations, face_names):
            y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]
            # cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)
            # cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 255), 2)
            # cv2.imshow("frame", frame)
        print(face_names)
        return jsonify({'predicted_person': face_names})

@app.route('/api/facial-recognition', methods=['GET'])
def get():
    return jsonify({'message': 'Hello World!'})

if __name__ == '__main__':
    if ip_address is not None:
        print(ip_address)
        app.run(host='192.168.0.203', port=8000, debug=True)
    else:
        print("IP address is not defined.")