import json

from flask import Flask, request, jsonify
from downloadImgAndRec import FirebaseImageRecognizer

app = Flask(__name__)
recognizer = FirebaseImageRecognizer("omnilens-d5745-firebase-adminsdk-rorof-df461ea39d.json",
                                     "omnilens-d5745.appspot.com")
recognizer.get_all_images()


@app.route('/api/facial-recognition', methods=['POST'])
def facial_recognition():
    # Get image data from request
    recognizer.get_all_images()
    print(request.form)
    path = request.form['path']
    face_names, faceLoc = recognizer.recognize_faces(path)

    if face_names is None or faceLoc is None:
        return jsonify({'message': 'No face found'})
    else:
        try:
            faceLoc_dict = {}
            for i in range(len(faceLoc)):
                faceLoc_dict[i] = faceLoc[i]
            # Convert the NumPy arrays to nested lists using tolist()
            data_json = json.dumps(faceLoc[0].tolist())

            # Print the JSON string
            print(face_names)
            jsonConv = jsonify({'predicted_person': face_names, 'face_loc': data_json, 'message': 'Face found'})
            print("Json: ", jsonConv)
            return jsonConv
        except Exception as e:
            print("Error: ", e)
            return jsonify({'message': 'Error'})


@app.route('/api/facial-recognition', methods=['GET'])
def get():
    return jsonify({'message': 'Hello World!'})


@app.route('/')
def get1():
    return jsonify({'message': 'Hello World111!'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
