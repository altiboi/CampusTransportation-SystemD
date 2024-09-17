import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const getUserData = async (uid) => {
  const userDoc = await getDoc(doc(db, "Users", uid));
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error("User not found in Firestore");
  }
};

export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  name,
  surname,
  dateOfBirth,
  role
) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "Users", user.uid), {
    email: user.email,
    name,
    surname,
    dateOfBirth,
    role,
    userNotifications: [],

  });

  return user;
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDoc = await getDoc(doc(db, "Users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user",
    });
  }

  return user;
};

export const getUserRole = async (uid) => {
  const userDoc = await getDoc(doc(db, "Users", uid));
  if (userDoc.exists()) {
    return userDoc.data().role;
  } else {
    throw new Error("User not found");
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const role = await getUserRole(user.uid);

  return { user, role };
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
