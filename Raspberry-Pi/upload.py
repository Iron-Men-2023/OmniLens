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


# Download operation
def upload1(user,file_path):
    # Upload operation (hard coded user)
    print("inside function")
    name="images/ml_images/{}.jpg".format(user)
    #path="/home/pi/Desktop/holder/{}".format(file_path)
    storage.child(name).put(file_path)
