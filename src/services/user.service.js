import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { generateKey } from "../utils/string.utils";

export const createCompany = async ({ businessName }) => {
  try {
    const docRef = await addDoc(collection(db, "companies"), {
      company: businessName,
      code: generateKey(businessName),
      status: "active",
    });
    return docRef;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUser = async ({ uid, businessName, fullName }) => {
  try {
    const company = await createCompany({ businessName });

    if (!company?.id) return null;

    const docRef = await addDoc(collection(db, "users"), {
      uid: uid,
      fullName: fullName,
      company: company,
      companyId: company.id,
    });
    return docRef.id;
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
