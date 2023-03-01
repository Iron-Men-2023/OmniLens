import cv2
import os

# Create directory for storing images
if not os.path.exists('imagesTest'):
    os.makedirs('imagesTest')

# Initialize video capture device
cap = cv2.VideoCapture(0)

# Set the resolution of the video capture device
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
count = 0
for filename in os.listdir('imagesTest'):
    count += 1
# Counter for keeping track of number of images captured
test = 0
while test < 50:
    # Capture a frame from the video capture device
    if test == 0:
        print('Press c to capture an image')
        while True:
            ret, frame = cap.read()
            cv2.imshow('frame', frame)
            key = cv2.waitKey(1)
            if key == ord('c'):
                break
    ret, frame = cap.read()

    # Display the captured frame
    cv2.imshow('frame', frame)

    # Wait for user to press 'q' to quit or 'c' to capture an image
    key = cv2.waitKey(1)
    if key == ord('q'):
        break
    # Increment the counter
    count += 1

    # Save the captured image to a file
    file_name = f"{count}_Kelly.jpg"
    file_path = os.path.join('imagesTest', file_name)
    cv2.imwrite(file_path, frame)
    test += 1

# Release the video capture device and close all windows
cap.release()
cv2.destroyAllWindows()
