import {
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { createUser } from "./user.service";

export const signUp = async ({ businessName, fullName, email, password }) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (!result?.user) throw 0;

    await createUser({ businessName, fullName, uid: result.user.uid });

    return result.user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signIn = async ({ email, password }) => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    const result = await signInWithEmailAndPassword(auth, email, password);

    return result.user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signOut = async () => {
  return await firebaseSignOut(auth);
};
