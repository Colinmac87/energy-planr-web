import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { uploadFile } from "../../services/storage.service";
import { createUser } from "../../services/user.service";
import { USER_ROLE_ADMIN } from "../../constants/account.constants";

export const createCompany = async ({ company, user, licence }) => {
  try {
    const _company = {
      name: company.name,
      code: company.code,
      licence: {
        assetsLimit: licence.assetsLimit,
        usersLimit: licence.usersLimit,
        expiryDate: licence.expiryDate,
      },
      status: "active",
    };

    if (company.logoFile) {
      _company.logoUrl = await uploadFile(company.logoFile);
    }

    const docRef = await addDoc(collection(db, "companies"), _company);

    await createUser(docRef.id, {
      fullName: user.adminFullName,
      emailAddress: user.adminEmailAddress,
      password: user.adminPassword,
      role: USER_ROLE_ADMIN,
    });

    return docRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateCompany = async (
  id,
  { name, logoFile, licence: { assetsLimit, usersLimit, expiryDate } }
) => {
  try {
    const company = {
      name: name,
      licence: {
        assetsLimit: assetsLimit,
        usersLimit: usersLimit,
        expiryDate: expiryDate,
      },
    };
    const docRef = doc(db, "companies", id);

    if (logoFile) {
      company.logoUrl = await uploadFile(logoFile);
    }

    await updateDoc(docRef, company);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const disableCompany = async (id) => {
  try {
    const docRef = doc(db, "companies", id);
    await updateDoc(docRef, { status: "inactive" });
  } catch (error) {
    console.log(error);
  }
};

export const activateCompany = async (id) => {
  try {
    const docRef = doc(db, "companies", id);
    await updateDoc(docRef, { status: "active" });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanies = async () => {
  try {
    const q = query(collection(db, "companies"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((qs) => ({ id: qs.id, ...qs.data() }));
  } catch (error) {
    console.log(error);
    return null;
  }
};
