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
import { generateKey } from "../utils/string.utils";

export const getRegisters = async (assetId) => {
  try {
    const q = query(
      collection(db, "registers"),
      where("assetId", "==", assetId),
      where("isDeleted", "==", false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createRegister = async ({ assetId, name }) => {
  try {
    const register = {
      assetId: assetId,
      name: name,
      formFields: [],
      formGroups: [],
      isDeleted: false,
    };

    const docRef = await addDoc(collection(db, "registers"), register);

    return docRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRegister = async (id) => {
  try {
    const docRef = doc(db, "registers", id);
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

export const updateRegister = async (id, { name }) => {
  try {
    const register = {
      name: name,
    };

    const docRef = doc(db, "registers", id);
    return await updateDoc(docRef, register);
  } catch (error) {
    console.log(error);
  }
};

export const deleteRegister = async (id) => {
  try {
    const register = {
      isDeleted: true,
    };

    const docRef = doc(db, "registers", id);
    return await updateDoc(docRef, register);
  } catch (error) {
    console.log(error);
  }
};

export const saveFormGroups = async (registerId, { formGroups }) => {
  try {
    const register = {
      formGroups: formGroups.map((group, i) => ({
        ...group,
        key: group.key || generateKey(group.name),
        order: i,
      })),
    };

    const docRef = doc(db, "registers", registerId);
    return await updateDoc(docRef, register);
  } catch (error) {
    console.log(error);
  }
};

export const saveFormFields = async (registerId, { formFields }) => {
  try {
    const register = {
      formFields: formFields.map((field, i) => ({
        ...field,
        key: field.key || generateKey(field.name),
        order: i,
      })),
    };

    const docRef = doc(db, "registers", registerId);
    return await updateDoc(docRef, register);
  } catch (error) {
    console.log(error);
  }
};
