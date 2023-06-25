import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const createData = async (assetId, registerId, data) => {
  try {
    const docRef = await addDoc(collection(db, "data"), {
      assetId: assetId,
      registerId: registerId,
      ...data,
      isDeleted: false,
    });

    return docRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createDataBulk = async (assetId, registerId, data) => {
  try {
    let errors = [];

    for (const row in data) {
      try {
        delete data[row].id;
        const docRef = await addDoc(collection(db, "data"), {
          assetId: assetId,
          registerId: registerId,
          ...data[row],
          isDeleted: false,
        });

        if (!docRef?.id) throw Error();
      } catch (error) {
        errors.push(row);
      }
    }

    return errors;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateData = async (id, data) => {
  try {
    const docRef = doc(db, "data", id);
    return await updateDoc(docRef, data);
  } catch (error) {
    console.log(error);
  }
};

export const updateDataValue = async (id, field, value) => {
  try {
    const docRef = doc(db, "data", id);
    return await updateDoc(docRef, {
      [field]: value,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteData = async (id) => {
  try {
    const docRef = doc(db, "data", id);
    return await updateDoc(docRef, {
      isDeleted: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDataByRegister = async (registerId) => {
  try {
    const q = query(
      collection(db, "data"),
      where("registerId", "==", registerId),
      where("isDeleted", "==", false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addFile = async (
  dataId,
  { fileName, fileCaption, fileUrl, fileType }
) => {
  try {
    const docRef = await addDoc(collection(db, "files"), {
      dataId: dataId,
      name: fileName,
      caption: fileCaption,
      url: fileUrl,
      type: fileType,
      isDeleted: false,
    });

    return docRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getFiles = async (dataId, type) => {
  try {
    const q = query(
      collection(db, "files"),
      where("dataId", "==", dataId),
      where("type", "==", type),
      where("isDeleted", "==", false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const saveFileCaption = async (id, caption) => {
  try {
    try {
      const docRef = doc(db, "files", id);
      return await updateDoc(docRef, {
        caption: caption,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {}
};

export const deleteFile = async (id) => {
  try {
    try {
      const docRef = doc(db, "files", id);
      return await updateDoc(docRef, {
        isDeleted: true,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {}
};
