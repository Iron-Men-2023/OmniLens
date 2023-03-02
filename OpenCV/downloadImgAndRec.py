from datetime import datetime
import cv2
from simple_facerec import RecognitionHelper
import numpy as np
import firebase_admin
from firebase_admin import credentials, storage
import os


class FirebaseImageRecognizer:
    def __init__(self, credential_path, storage_bucket):
        self.cred = credentials.Certificate(credential_path)
        self.app = firebase_admin.initialize_app(self.cred, {'storageBucket': storage_bucket}, name='storage')
        self.bucket = storage.bucket(app=self.app)

    def recognize_faces(self, image_path):
        blob = self.bucket.blob(image_path)
        # Have time stamp be 10 minutes in the future
        expiration = int(datetime.now().timestamp() + 600)
        print(blob.generate_signed_url(expiration))

        # Download the image as a bytes object
        image_bytes = blob.download_as_bytes()

        # Convert the bytes object to a numpy array
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)

        # Decode the numpy array as an image
        image = cv2.imdecode(image_array, -1)

        # Rotate the image
        # image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)

        # Save the image to directory
        save_path = os.path.join("imagesTest", "test3.jpg")
        cv2.imwrite(save_path, image)

        # Load the image from the directory
        image = cv2.imread(save_path)

        # Initialize the face recognition model and detect known faces in the image
        sfr = RecognitionHelper()
        sfr.load_images("images")
        face_locations, face_names = sfr.detect_known_faces(image)

        # Print the detected face names, or "No face found" if none were detected
        print(face_names if face_names else "No face found")
        return face_names, face_locations if face_names else "No face found"
