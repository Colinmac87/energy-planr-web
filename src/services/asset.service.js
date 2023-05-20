import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { uploadFile } from "./storage.service";

export const getAssets = async () => {
  try {
    const q = query(collection(db, "assets"), where("isDeleted", "==", false));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createAsset = async ({ name, thumbnailFile }) => {
  try {
    const asset = {
      name: name,
      isDeleted: false,
    };

    if (thumbnailFile) {
      asset.thumbnailUrl = await uploadFile(thumbnailFile);
    }

    const docRef = await addDoc(collection(db, "assets"), asset);

    return docRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};
