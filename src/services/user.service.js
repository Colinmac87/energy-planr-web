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
import { getCompany } from "./company.service";

export const createCompany = async ({ businessName }) => {
  try {
    businessName = businessName.trim();
    const code = generateKey(businessName);

    const company = await getCompany(code);
    if (company) return company;

    const docRef = await addDoc(collection(db, "companies"), {
      company: businessName,
      code: code,
      status: "active",
    });
    return docRef;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUser = async (
  companyId,
  { fullName, role, emailAddress, password }
) => {
  try {
    // User is created in firestore and not in firebase auth
    // When the user attempts to signin the first time
    // The auth is created and then linked with the firestore document
    const docRef = await addDoc(collection(db, "users"), {
      fullName: fullName,
      emailAddress: emailAddress.toLowerCase(),
      role: role,
      companyId: companyId,
      password: password, // this is set temporarily, and is removed when the user signins in the first time
    });
    return docRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const linkAuthUser = (id, uid) => {
  try {
    const docRef = doc(db, "users", id);
    updateDoc(docRef, { uid: uid, password: null });
  } catch (error) {
    console.log(error);
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const docRef = doc(db, "users", id);
    updateDoc(docRef, { role: role });
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmailAddress = async (emailAddress) => {
  try {
    const q = query(
      collection(db, "users"),
      where("emailAddress", "==", emailAddress)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }))[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUser = async ({ id, uid }) => {
  try {
    if (id) {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    }
    if (uid) {
      const q = query(collection(db, "users"), where("uid", "==", uid));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }))[0];
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUsersByCompany = async (companyId) => {
  try {
    const q = query(
      collection(db, "users"),
      where("companyId", "==", companyId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }));
  } catch (error) {
    console.log(error);
    return null;
  }
};
