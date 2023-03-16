import pyrebase

# Configuration object referring to firebase database
config = {
    "apiKey": "AIzaSyAF9MbNcEn51_ousOv1myNZPQO4BYsVEeE",
    "authDomain": "omnilens-d5745.firebaseapp.com",
    "databaseURL": "https://omnilens-d5745-default-rtdb.firebaseio.com",
    "storageBucket": "omnilens-d5745.appspot.com",
}

# Initialize app instance
firebase = pyrebase.initialize_app(config)

# Reference to firebase storage
storage = firebase.storage()

# Upload operation (hard coded user)
#storage.child("/images/ml_images/LfqBYBcq1BhHUvmE7803PhCFxeI2.jpg").put("C:/Users/Adnane Ezouhri/Pictures/Camera Roll/adtemp.jpg")

# Download operation
storage.child("/images/ml_images/LfqBYBcq1BhHUvmE7803PhCFxeI2.jpg").download("/home/pi/Desktop/holder/adnane.jpg")
