from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import os
import tempfile

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

    # Save image to a temporary file
    # _, tmp_file = tempfile.mkstemp(suffix='.jpg')
    temp_path = 'temp_image.jpg'
    cv2.imwrite(temp_path, img)

    # Check image file format and download if necessary
    if cv2.imread(temp_path) is None:
        return jsonify({'message': 'Invalid image format'})
    else:
        # Preprocess image
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray, (96, 96))
        normalized = resized / 255.0
        print(normalized.shape)

        # Perform facial recognition
        model = cv2.face.LBPHFaceRecognizer_create()
        model.read('model.yml')
        label, confidence = model.predict(normalized)
        # loop through all the files in the directory
        predicted_img = None
        predicted_person = None
        for filename in os.listdir('images'):
            # check if the file starts with the label we want
            if filename.startswith(str(label) + '_'):
                # load the image
                print(os.path.join('images', filename))
                predicted_person = filename.split('_')[1].split('.')[0]
                print(predicted_person)
                predicted_img = cv2.imread(os.path.join('images', filename))
                break
        print(f'Label: {label}, Confidence: {confidence}')
        if predicted_img is None:
            return jsonify({'message': 'No face found'})
        # Encode predicted image in Base64 format
        retval, buffer = cv2.imencode('.jpg', predicted_img)
        jpg_as_text = base64.b64encode(buffer)

        # Remove temporary file
        return jsonify({'predicted_person': predicted_person, 'confidence': confidence, 'image': jpg_as_text.decode('utf-8')})

@app.route('/api/facial-recognition', methods=['GET'])
def get():
    return jsonify({'message': 'Hello World!'})

if __name__ == '__main__':
    if ip_address is not None:
        app.run(host=ip_address, port=8000, debug=True)
    else:
        print("IP address is not defined.")