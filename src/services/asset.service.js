import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { uploadFile } from "./storage.service";
import { generateKey } from "../utils/string.utils";

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

export const getAsset = async (id) => {
  try {
    const docRef = doc(db, "assets", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateAsset = async (id, { name, thumbnailFile }) => {
  try {
    const asset = {
      name: name,
    };

    if (thumbnailFile) {
      asset.thumbnailUrl = await uploadFile(thumbnailFile);
    }

    const docRef = doc(db, "assets", id);
    return await updateDoc(docRef, asset);
  } catch (error) {
    console.log(error);
  }
};

export const saveFormGroups = async (assetId, { formGroups }) => {
  try {
    const asset = {
      formGroups: formGroups.map((group, i) => ({
        ...group,
        key: group.key || generateKey(group.name),
        order: i,
      })),
    };

    const docRef = doc(db, "assets", assetId);
    return await updateDoc(docRef, asset);
  } catch (error) {
    console.log(error);
  }
};

export const saveFormFields = async (assetId, { formFields }) => {
  try {
    const asset = {
      formFields: formFields.map((field, i) => ({
        ...field,
        key: field.key || generateKey(field.name),
        order: i,
      })),
    };

    const docRef = doc(db, "assets", assetId);
    return await updateDoc(docRef, asset);
  } catch (error) {
    console.log(error);
  }
};
