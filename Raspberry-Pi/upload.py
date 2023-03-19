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
print("made it here")

# Download operation
#storage.child(name).download(file_path)
def upload1(user,file_path):
    # Upload operation (hard coded user)
    #storage.child("/images/ml_images/LfqBYBcq1BhHUvmE7803PhCFxeI2.jpg").put("C:/Users/Adnane Ezouhri/Pictures/Camera Roll/adtemp.jpg")
    print("inside function")
    name="images/ml_images/{}.jpg".format(user)
    #path="/home/pi/Desktop/holder/{}".format(file_path)
    storage.child(name).put(file_path)
