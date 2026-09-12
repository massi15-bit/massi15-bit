import cv2
import os
import numpy as np

# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KNOWN_FACES_DIR = os.path.join(BASE_DIR, "known_faces")

# --------------------------------------------------
# LOAD FACE DETECTOR
# --------------------------------------------------

cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

face_detector = cv2.CascadeClassifier(cascade_path)

if face_detector.empty():
    print("Could not load OpenCV face detector.")
    raise SystemExit


# --------------------------------------------------
# LOAD ENROLLED FACES
# --------------------------------------------------

known_faces = []

for filename in os.listdir(KNOWN_FACES_DIR):

    if not filename.lower().endswith((".png", ".jpg", ".jpeg")):
        continue

    path = os.path.join(KNOWN_FACES_DIR, filename)

    image = cv2.imread(path, cv2.IMREAD_GRAYSCALE)

    if image is None:
        continue

    # Normalize the enrolled image
    image = cv2.resize(image, (200, 200))

    known_faces.append(image)

print(f"Loaded {len(known_faces)} enrolled face images.")

if len(known_faces) == 0:
    print("No enrolled face images found.")
    raise SystemExit


# --------------------------------------------------
# CREATE FACE RECOGNIZER
# --------------------------------------------------

recognizer = cv2.face.LBPHFaceRecognizer_create()

labels = np.zeros(len(known_faces), dtype=np.int32)

recognizer.train(known_faces, labels)


# --------------------------------------------------
# OPEN WEBCAM
# --------------------------------------------------

camera = cv2.VideoCapture(0)

if not camera.isOpened():
    print("Could not open webcam.")
    raise SystemExit


# --------------------------------------------------
# FACELOCK WINDOW
# --------------------------------------------------

cv2.namedWindow("FaceLock", cv2.WINDOW_NORMAL)

cv2.setWindowProperty(
    "FaceLock",
    cv2.WND_PROP_FULLSCREEN,
    cv2.WINDOW_FULLSCREEN
)


# --------------------------------------------------
# MAIN LOOP
# --------------------------------------------------

while True:

    success, frame = camera.read()

    if not success:
        break

    # Mirror webcam
    frame = cv2.flip(frame, 1)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80)
    )

    authentication_matched = False

    # --------------------------------------------------
    # CHECK EACH DETECTED FACE
    # --------------------------------------------------

    for (x, y, w, h) in faces:

        face = gray[y:y+h, x:x+w]

        if face.size == 0:
            continue

        face = cv2.resize(face, (200, 200))

        label, confidence = recognizer.predict(face)

        # LBPH confidence:
        # LOWER = better match
        #
        # Adjust this value if necessary.
        if confidence < 70:
            authentication_matched = True

            cv2.rectangle(
                frame,
                (x, y),
                (x+w, y+h),
                (0, 255, 0),
                3
            )

            cv2.putText(
                frame,
                "AUTHENTICATION MATCHED",
                (x, y - 15),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2
            )

        else:

            cv2.rectangle(
                frame,
                (x, y),
                (x+w, y+h),
                (0, 0, 255),
                3
            )

            cv2.putText(
                frame,
                "AUTHENTICATION FAILED",
                (x, y - 15),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 0, 255),
                2
            )

    # --------------------------------------------------
    # STATUS MESSAGE
    # --------------------------------------------------

    if len(faces) == 0:

        status = "SCANNING FOR FACE..."

        cv2.putText(
            frame,
            status,
            (40, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,
            (255, 255, 255),
            2
        )

    elif authentication_matched:

        status = "ACCESS GRANTED"

        cv2.putText(
            frame,
            status,
            (40, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 255, 0),
            3
        )

    else:

        status = "FACE NOT RECOGNIZED"

        cv2.putText(
            frame,
            status,
            (40, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,
            (0, 0, 255),
            2
        )

    # --------------------------------------------------
    # DISPLAY
    # --------------------------------------------------

    cv2.imshow("FaceLock", frame)

    key = cv2.waitKey(1) & 0xFF

    # Press ESC or Q to exit
    if key == 27 or key == ord("q"):
        break


# --------------------------------------------------
# CLEANUP
# --------------------------------------------------

camera.release()
cv2.destroyAllWindows()