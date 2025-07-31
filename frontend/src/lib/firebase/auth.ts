import { auth } from './config';
import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<string | null> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user.uid;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
  }
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback);
}