import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const getCompany = async (code) => {
  try {
    const q = query(
      collection(db, "companies"),
      where("code", "==", code),
      where("status", "==", "active")
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0)
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
