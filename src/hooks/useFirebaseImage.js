import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useState } from "react";
export default function useFirebaseImage(setValue, getValues) {
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");
  if (!setValue || !getValues) return;
  const handleUploadImage = (file) => {
    const storage = getStorage();

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
        console.log("Upload is " + progressPercent + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Nothing at all");
        }
      },
      (error) => {
        // eslint-disable-next-line default-case
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            console.log("Error storage/unauthorized");
            break;
          case "storage/canceled":
            // User canceled the upload
            console.log("Error storage/canceled");
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
        });
      }
    );
  };
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("image_name", file.name);
    handleUploadImage(file);
  };
  const handleDeleteImage = (name) => {
    const storage = getStorage();

    // Create a reference to the file to delete
    const imageRef = ref(storage, "images/" + getValues("image_name"));

    // Delete the file
    deleteObject(imageRef)
      .then(() => {
        // File deleted successfully
        console.log("File deleted successfully");
        setImage("");
        setProgress(0);
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log("Cant not delete image");
      });
  };
  const handleResetUpload = () => {
    setImage("");
    setProgress(0);
  };
  return {
    handleChangeImage,
    progress,
    image,
    handleResetUpload,
    handleDeleteImage,
  };
}
