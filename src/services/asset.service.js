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
import { createRegister } from "./register.service";

export const getAssets = async (companyId) => {
  try {
    const q = query(
      collection(db, "assets"),
      where("companyId", "==", companyId),
      where("isDeleted", "==", false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createAsset = async ({ companyId, name, thumbnailFile }) => {
  try {
    const asset = {
      companyId: companyId,
      name: name,
      isDeleted: false,
    };

    if (thumbnailFile) {
      asset.thumbnailUrl = await uploadFile(thumbnailFile);
    }

    const docRef = await addDoc(collection(db, "assets"), asset);

    await createRegister({ assetId: docRef.id, name: "Default" });

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

export const deleteAsset = async (id) => {
  try {
    const asset = {
      isDeleted: true,
    };

    const docRef = doc(db, "assets", id);
    return await updateDoc(docRef, asset);
  } catch (error) {
    console.log(error);
  }
};
