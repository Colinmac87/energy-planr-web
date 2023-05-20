import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadFile = async (file, name) => {
  try {
    const storageRef = ref(storage, name || file.name);
    const snapshot = await uploadBytes(storageRef, file);

    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.log(error);
    return null;
  }
};
