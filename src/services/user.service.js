import { addDoc, collection } from "firebase/firestore";
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
