import os
import time
import cv2

# Folder where enrolled face images are saved. This stays on your computer only.
KNOWN_FACES_DIR = os.path.join(os.path.dirname(__file__), "known_faces")
TARGET_IMAGES = 6


def ensure_known_faces_dir() -> None:
    """Create the local storage folder if it does not already exist."""
    os.makedirs(KNOWN_FACES_DIR, exist_ok=True)


def load_face_cascade():
    """Load the OpenCV Haar cascade used to detect faces in each frame."""
    cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml")
    cascade = cv2.CascadeClassifier(cascade_path)
    if cascade.empty():
        raise RuntimeError(
            "Could not load the face detection model. Please check your OpenCV installation."
        )
    return cascade


def draw_centered_text(frame, text, y_position, color=(255, 255, 255), font_scale=1.0):
    """Helper for drawing a simple text message in the middle of the frame."""
    (text_width, text_height), baseline = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, 2)
    x = (frame.shape[1] - text_width) // 2
    cv2.putText(frame, text, (x, y_position), cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, 2)


def enroll_face() -> None:
    """Open the webcam and capture several images of the user's face for later matching."""
    ensure_known_faces_dir()

    capture = cv2.VideoCapture(0)
    if not capture.isOpened():
        print("No webcam was found or the camera could not be opened.")
        return

    face_cascade = load_face_cascade()
    saved_count = 0
    print(f"Face enrollment started. Press SPACE to capture a photo. Need {TARGET_IMAGES} total images.")

    while saved_count < TARGET_IMAGES:
        ok, frame = capture.read()
        if not ok:
            print("The webcam stream could not be read.")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(100, 100),
        )

        display = frame.copy()

        if len(faces) == 0:
            draw_centered_text(display, "No face detected", 60, color=(0, 0, 255), font_scale=1.0)
        elif len(faces) > 1:
            draw_centered_text(display, "Multiple faces detected", 60, color=(0, 0, 255), font_scale=0.9)
        else:
            x, y, w, h = faces[0]
            cv2.rectangle(display, (x, y), (x + w, y + h), (0, 255, 0), 2)
            draw_centered_text(
                display,
                f"Face detected. Press SPACE to capture ({saved_count + 1}/{TARGET_IMAGES})",
                60,
                color=(0, 255, 0),
                font_scale=0.8,
            )

        cv2.imshow("Face Enrollment", display)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            print("Enrollment canceled by the user.")
            break

        if key == ord(" "):
            if len(faces) != 1:
                print("Please position exactly one face in the frame before saving.")
                continue

            x, y, w, h = faces[0]
            face_crop = frame[y : y + h, x : x + w]
            face_crop = cv2.resize(face_crop, (200, 200))
            file_name = f"face_{saved_count + 1:02d}.png"
            file_path = os.path.join(KNOWN_FACES_DIR, file_name)
            cv2.imwrite(file_path, face_crop)
            saved_count += 1
            print(f"Captured {saved_count}/{TARGET_IMAGES}: {file_path}")
            time.sleep(0.3)

    capture.release()
    cv2.destroyAllWindows()

    if saved_count == TARGET_IMAGES:
        print(f"Enrollment complete. {TARGET_IMAGES} face images were saved to {KNOWN_FACES_DIR}.")
    else:
        print(f"Enrollment stopped early. {saved_count} images were saved locally.")


if __name__ == "__main__":
    enroll_face()
