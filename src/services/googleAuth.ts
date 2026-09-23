import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import { auth } from './firebaseService';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;

// Cache the access token strictly in memory (per security guidelines, NOT localStorage)
let cachedAccessToken: string | null = null;
let tokenExpiryTimestamp: number | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If the user is logged into Firebase but token hasn't been cached in this memory cycle
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      tokenExpiryTimestamp = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google Auth credentials');
    }

    cachedAccessToken = credential.accessToken;
    // Set 55-minute cache lifespan
    tokenExpiryTimestamp = Date.now() + 55 * 60 * 1000;

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Workspace sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (tokenExpiryTimestamp && Date.now() > tokenExpiryTimestamp) {
    cachedAccessToken = null;
    tokenExpiryTimestamp = null;
    return null;
  }
  return cachedAccessToken;
};

export const setAccessTokenInMemory = (token: string | null) => {
  cachedAccessToken = token;
  tokenExpiryTimestamp = token ? Date.now() + 55 * 60 * 1000 : null;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  tokenExpiryTimestamp = null;
};
