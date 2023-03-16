# import os
# import cv2
# import firebase_admin
# import numpy as np
# from firebase_admin import credentials, firestore, initialize_app, storage
# from flask import Flask, request, jsonify
#
# # Initialize Firebase
# cred = credentials.Certificate("../omnilens-d5745-firebase-adminsdk-rorof-df461ea39d.json")
# app1 = firebase_admin.initialize_app(cred, {'storageBucket': "omnilens-d5745.appspot.com"}, name='storage')
# bucket = storage.bucket(app=app1)
# db = firestore.client(app=app1)
#
# app = Flask(__name__)
#
# # Create a mapping between integer labels and string names
# id_name_map = {}
#
#
# def train_recognizer():
#     recognizer = cv2.face.LBPHFaceRecognizer_create()
#     path = "images"
#     faces, ids = get_images_with_id(path)
#
#     recognizer.train(faces, np.array(ids))
#     recognizer.write("trainer.yml")
#
#
# def preprocess_image(image):
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     resized = cv2.resize(gray, (400, 400))
#     equalized = cv2.equalizeHist(resized)
#     return equalized
#
#
# def get_images_with_id(path):
#     image_paths = [os.path.join(path, f) for f in os.listdir(path)]
#     faces = []
#     ids = []
#     for i in range(len(image_paths) + 1000):
#         for image_path in image_paths:
#             image = cv2.imread(image_path)
#             face_img = preprocess_image(image)
#             face_id_str = os.path.split(image_path)[-1].split(".")[0]
#             face_id_int = len(id_name_map)
#             id_name_map[face_id_int] = face_id_str
#
#             faces.append(face_img)
#             ids.append(face_id_int)
#
#     return faces, ids
#
#
# def recognize_face(image_path):
#     recognizer = cv2.face.LBPHFaceRecognizer_create()
#     recognizer.read("trainer.yml")
#
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     img = cv2.imread(image_path)
#     gray = preprocess_image(img)
#     faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=4, minSize=(50, 50))
#
#     for (x, y, w, h) in faces:
#         id_predicted, _ = recognizer.predict(gray[y:y + h, x:x + w])
#         print("id_predicted", id_predicted)
#         name = get_name_from_id(id_name_map[id_predicted])
#         print("Id Map", id_name_map)
#
#         return {"id": id_name_map[id_predicted], "name": name}
#     print("No face detected")
#     return {"error": "No face detected"}
#
#
# def get_name_from_id(face_id_str):
#     users_ref = db.collection("users")
#     query = users_ref.where("uid", "==", face_id_str).get()
#
#     if query:
#         for doc in query:
#             return doc.to_dict()["name"]
#
#     return "Unknown"
#
#
# if __name__ == "__main__":
#     train_recognizer()
#     result = recognize_face("images/Bob_Pierce.png")
#     print(result)
#     # app.run(host="0.0.0.0", port=8001, debug=True)

import os
import numpy as np
from deepface import DeepFace

DATABASE_FILE = 'face_database.npy'


def build_face_database(data_path):
    database = {}

    for person_name in os.listdir(data_path):
        person_dir = os.path.join(data_path, person_name)
        image_path = os.path.join(person_dir)
        if os.path.isfile(image_path):
            img_repr = DeepFace.represent(image_path, model_name='VGG-Face', enforce_detection=False)
            img_embedding = np.array(img_repr[0]["embedding"])
            if person_name not in database:
                database[person_name] = []
            database[person_name].append(img_embedding)

    return database


def save_face_database(database, file_path):
    np.save(file_path, database)


def load_face_database(file_path):
    return np.load(file_path, allow_pickle=True).item()


def find_closest_person(embedding, database):
    min_distance = float('inf')
    closest_person = None

    for person_name, embeddings in database.items():
        for person_embedding in embeddings:
            distance = np.linalg.norm(embedding - person_embedding)
            if distance < min_distance:
                min_distance = distance
                closest_person = person_name

    return closest_person


def predict_person_name(image_path, database):
    img_repr = DeepFace.represent(image_path, model_name='VGG-Face', enforce_detection=False)
    img_embedding = np.array(img_repr[0]["embedding"])
    predicted_name = find_closest_person(img_embedding, database)
    return predicted_name


# Example usage
data_path = "images"
image_path1 = "images/Benjamin_DeSollar.png"

if not os.path.exists(DATABASE_FILE):
    face_database = build_face_database(data_path)
    save_face_database(face_database, DATABASE_FILE)
else:
    face_database = load_face_database(DATABASE_FILE)

predicted_name = predict_person_name(image_path1, face_database)

print("Predicted name:", predicted_name)
