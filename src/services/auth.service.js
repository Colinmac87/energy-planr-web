import {
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { getUser, getUserByEmailAddress, linkAuthUser } from "./user.service";

export const signUp = async ({ email, password }) => {
  // try {
  //   const result = await createUserWithEmailAndPassword(auth, email, password);
  //   if (!result?.user) throw 0;
  //   await createUser({ businessName, fullName, uid: result.user.uid });
  //   return result.user;
  // } catch (error) {
  //   console.log(error);
  //   return null;
  // }
};

export const signIn = async ({ companyId, email, password }) => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    const result = await signInWithEmailAndPassword(auth, email, password);

    if (result.user) {
      const user = await getUserByEmailAddress(email);
      if (!user || user.companyId != companyId) {
        await signOut();
        return null;
      }
    }

    return result.user;
  } catch (error) {
    console.log(JSON.stringify(error));

    // attempt to see if this is a user's first signin
    if (error.code == "auth/user-not-found") {
      const user = await getUserByEmailAddress(email);
      if (user && user.password == password) {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (result?.user) {
          linkAuthUser(user.id, result.user.uid);

          return result.user;
        }
      }
    }

    return null;
  }
};

export const adminSignIn = async ({ email, password }) => {
  try {
    if (email.toLowerCase() != "site-admin@eneryplanr.com") {
      return null;
    }

    await setPersistence(auth, browserLocalPersistence);

    const result = await signInWithEmailAndPassword(auth, email, password);

    return result.user;
  } catch (error) {
    console.log(JSON.stringify(error));
    return null;
  }
};

export const signOut = async () => {
  return await firebaseSignOut(auth);
};
