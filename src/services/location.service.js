import {
  addDoc,
  arrayRemove,
  arrayUnion,
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

export const getLocations = async (assetId) => {
  try {
    const q = query(
      collection(db, "locations"),
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

export const createLocation = async (assetId, { name, backgroundMapFile }) => {
  try {
    const location = {
      assetId: assetId,
      name: name,
      overlays: [],
      isDeleted: false,
    };

    if (backgroundMapFile) {
      location.backgroundMapUrl = await uploadFile(backgroundMapFile);
    }

    const docRef = await addDoc(collection(db, "locations"), location);

    return docRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getLocation = async (id) => {
  try {
    const docRef = doc(db, "locations", id);
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

export const updateLocation = async (id, { name, backgroundMapFile }) => {
  try {
    const location = {
      name: name,
    };

    if (backgroundMapFile) {
      location.backgroundMapUrl = await uploadFile(backgroundMapFile);
    }

    const docRef = doc(db, "locations", id);
    return await updateDoc(docRef, location);
  } catch (error) {
    console.log(error);
  }
};

export const deleteLocation = async (id) => {
  try {
    const location = {
      isDeleted: true,
    };

    const docRef = doc(db, "locations", id);
    return await updateDoc(docRef, location);
  } catch (error) {
    console.log(error);
  }
};

export const updateLocationsOrder = async (locationIds) => {
  try {
    locationIds.forEach((locationId, i) => {
      const docRef = doc(db, "locations", locationId);
      updateDoc(docRef, { order: i + 1 });
    });
  } catch (error) {
    console.log(error);
  }
};

export const addOverlay = async (id, { type, coords }) => {
  try {
    const docRef = doc(db, "locations", id);
    return await updateDoc(docRef, {
      overlays: arrayUnion({ type: type, coords: JSON.stringify(coords) }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteOverlay = async (id, { type, coords }) => {
  try {
    const docRef = doc(db, "locations", id);
    return await updateDoc(docRef, {
      overlays: arrayRemove({ type: type, coords: coords }),
    });
  } catch (error) {
    console.log(error);
  }
};
