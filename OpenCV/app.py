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
    face_names = recognizer.recognize_faces(path)

    if face_names is None:
        return jsonify({'message': 'No face found'})
    else:
        # for face_loc, name in zip(face_locations, face_names):
        #     y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]
        #     # cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)
        #     # cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 255), 2)
        #     # cv2.imshow("frame", frame)
        print(face_names)
        return jsonify({'predicted_person': face_names, 'message': 'Face found'})


@app.route('/api/facial-recognition', methods=['GET'])
def get():
    return jsonify({'message': 'Hello World!'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
