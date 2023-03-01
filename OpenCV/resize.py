import cv2
import os

# Set the target size
target_size = (96, 96)

# Set the path to the image directory
image_dir = "imagesTest"

# Loop through each image in the directory
for filename in os.listdir(image_dir):
    # Load the image
    image_path = os.path.join(image_dir, filename)
    image = cv2.imread(image_path)

    # Get the original size of the image
    height, width, _ = image.shape

    # Calculate the aspect ratio of the image
    aspect_ratio = float(width) / float(height)

    # Calculate the new size of the image while maintaining the aspect ratio
    new_width = int(target_size[1] * aspect_ratio)
    new_height = int(target_size[0] / aspect_ratio)

    # Determine the actual new size of the image based on the aspect ratio
    if new_width > target_size[0]:
        new_size = (new_width, target_size[0])
    else:
        new_size = (target_size[1], new_height)

    # Resize the image while maintaining the aspect ratio
    resized_image = cv2.resize(image, new_size)

    # Add padding to the resized image to match the target size
    top = (target_size[0] - new_size[1]) // 2
    bottom = target_size[0] - new_size[1] - top
    left = (target_size[1] - new_size[0]) // 2
    right = target_size[1] - new_size[0] - left
    resized_image = cv2.copyMakeBorder(resized_image, top, bottom, left, right, cv2.BORDER_CONSTANT)

    # Save the resized image
    cv2.imwrite(image_path, resized_image)
