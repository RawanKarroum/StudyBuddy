import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../config/Firebase";
import { handleError } from "../utils/errorHandler";

interface AdditionalUserInfo {
  firstName: string;
  lastName: string;
  university: string;
  courses: string[];
  major: string;
  year: string;
  profilePic: File | null;
}

export const signUp = async (email: string, password: string, additionalInfo: AdditionalUserInfo) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Default profile picture URL
    let profilePicUrl = 'default.jpg';

    // Upload profile picture if provided
    if (additionalInfo.profilePic) {
      const profilePicRef = ref(storage, `profile_pics/${user.uid}`);
      await uploadBytes(profilePicRef, additionalInfo.profilePic);
      profilePicUrl = await getDownloadURL(profilePicRef);
    }

    // Save user information to Firestore
    await setDoc(doc(db, 'Users', user.uid), {
      uid: user.uid,
      email: user.email,
      firstName: additionalInfo.firstName,
      lastName: additionalInfo.lastName,
      university: additionalInfo.university,
      courses: additionalInfo.courses,
      major: additionalInfo.major,
      year: additionalInfo.year,
      profilePicUrl,
    });

    return user;
  } catch (error) {
    throw handleError(error);
  }
};

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw handleError(error);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw handleError(error);
  }
};
