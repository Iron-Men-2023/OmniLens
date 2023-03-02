import json

from flask import Flask, request, jsonify
from downloadImgAndRec import FirebaseImageRecognizer

app = Flask(__name__)
recognizer = FirebaseImageRecognizer("omnilens-d5745-firebase-adminsdk-rorof-df461ea39d.json",
                                     "omnilens-d5745.appspot.com")


@app.route('/api/facial-recognition', methods=['POST'])
def facial_recognition():
    # Get image data from request
    print(request.form)
    path = request.form['path']
    face_names, faceLoc = recognizer.recognize_faces(path)

    if face_names is None:
        return jsonify({'message': 'No face found'})
    else:
        # for face_loc, name in zip(face_locations, face_names):
        #     y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]
        #     # cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)
        #     # cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 255), 2)
        #     # cv2.imshow("frame", frame)
        try:
            print(faceLoc)
            faceLoc_dict = {}
            for i in range(len(faceLoc)):
                faceLoc_dict[i] = faceLoc[i]
            print(faceLoc_dict)
            # Create an example dictionary with NumPy arrays as values
            # Convert the NumPy arrays to nested lists using tolist()
            data_json = json.dumps(faceLoc[0].tolist())

            # Print the JSON string
            print(data_json)
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
