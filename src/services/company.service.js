import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const getCompany = async (code) => {
  try {
    const q = query(collection(db, "companies"), where("code", "==", code));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) return querySnapshot.docs[0];
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
