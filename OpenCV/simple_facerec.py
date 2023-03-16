import face_recognition
import cv2
import os
import glob
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub


class RecognitionHelper:
    def __init__(self):
        self.names = []
        self.encodings = []
        self.resizedFrame = 0.50
        self.upscale_factor = 2
        self.superres_model = self._load_superres_model()

    def load_images(self, images_path):
        images_path = glob.glob(os.path.join(images_path, "*.*"))
        print("{} encoding images11 found.".format(len(images_path)))

        for img_path in images_path:
            while True:
                img = cv2.imread(img_path)
                img_resize = cv2.resize(img, (0, 0), fx=self.resizedFrame, fy=self.resizedFrame)
                rgb_img = cv2.cvtColor(img_resize, cv2.COLOR_BGR2RGB)

                basename = os.path.basename(img_path)
                (filename, ext) = os.path.splitext(basename)

                img_encoding_list = face_recognition.face_encodings(rgb_img)
                if len(img_encoding_list) > 0:
                    img_encoding = img_encoding_list[0]
                    self.encodings.append(img_encoding)
                    self.names.append(filename)
                    print(f"Face found in {img_path}")
                    break
                else:
                    print(f"No face found in {img_path}, enhancing resolution and trying again")
                    img_path = self._enhance_resolution(img_path)

        print("Encoding images11 loaded")

    def detect_known_faces(self, frame):
        print("Detecting faces")
        if frame is None:
            print("Frame is None")
            return None, None
        print("Frame size: {}".format(frame.shape))

        # Try recognizing faces at original resolution
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        if len(face_encodings) > 0:
            face_names = []
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(self.encodings, face_encoding)
                name = "Unknown"
                face_distances = face_recognition.face_distance(self.encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = self.names[best_match_index]
                face_names.append(name)
                print("Face found: {}".format(name))

            face_locations = np.array(face_locations)
            face_locations = face_locations / self.resizedFrame
            return face_locations.astype(int), face_names
        else:
            print("No face found at original resolution")

        # Enhance resolution and try recognizing faces again
        upscaled_frame = self._enhance_resolution(frame)
        rgb_frame = cv2.cvtColor(upscaled_frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        if len(face_encodings) > 0:
            face_names = []
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(self.encodings, face_encoding)
                name = "Unknown"
                face_distances = face_recognition.face_distance(self.encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = self.names[best_match_index]
                face_names.append(name)
                print("Face found: {}".format(name))

            face_locations = np.array(face_locations)
            face_locations = face_locations / (self.resizedFrame * self.upscale_factor)
            return face_locations.astype(int), face_names
        else:
            print("No face found after enhancing resolution")
            return None, None

    def _enhance_resolution(self, img_path):
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img.astype(np.float32) / 255.0

        # Super-resolution using a pre-trained model
        img_shape = img.shape
        input_img = tf.constant(np.expand_dims(img, axis=0))
        output_img = self.superres_model(input_img)
        output_img = tf.squeeze(output_img).numpy()
        output_img = np.clip(output_img, 0, 1)
        output_img = (output_img * 255).astype(np.uint8)

        output_img = cv2.cvtColor(output_img, cv2.COLOR_RGB2BGR)
        return output_img

    def _load_superres_model(self):
        superres_module = hub.load("https://tfhub.dev/captain-pool/esrgan-tf2/1")
        superres_model = superres_module.signatures["default"]
        return superres_model
