import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../config/Firebase";
import { handleError } from "../utils/errorHandler";

interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  courses: string[];
  major: string;
  year: string;
  image: string;
}

interface AdditionalUserInfo {
  firstName: string;
  lastName: string;
  university: string;
  courses: string[];
  major: string;
  year: string;
  profilePic: File | null;
  profilePicUrl?: string;
  friends?: string[];
}

export const getProfilePicUrl = async (filePath: string) => {
  try {
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error getting download URL:", error);
    return 'default.jpg'; 
  }
};

export const signUp = async (email: string, password: string, additionalInfo: AdditionalUserInfo) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Default profile picture URL
    let profilePicUrl = await getProfilePicUrl('default.jpg');

    // Upload profile picture if provided
    if (additionalInfo.profilePic) {
      const profilePicRef = ref(storage, `profile_pics/${user.uid}`);
      await uploadBytes(profilePicRef, additionalInfo.profilePic);
      profilePicUrl = await getDownloadURL(profilePicRef);
    }

    console.log('Profile Pic URL:', profilePicUrl);

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
      friends: additionalInfo.friends || [],
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

export const fetchUserInfo = async (uid: string): Promise<AdditionalUserInfo | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'Users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as AdditionalUserInfo;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};


export const fetchUserDetails = async (uid: string): Promise<UserDetails | null> => {
  try {
      const userDoc = await getDoc(doc(db, 'Users', uid));
      if (userDoc.exists()) {
          const data = userDoc.data();
          return {
              id: uid,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              university: data.university,
              courses: data.courses,
              major: data.major,
              year: data.year,
              image: data.profilePicUrl || 'default.jpg'
          };
      } else {
          return null;
      }
  } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
  }
};


export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw handleError(error);
  }
};
