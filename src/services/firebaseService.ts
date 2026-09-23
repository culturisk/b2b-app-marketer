import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: The app will break without specifying firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Standardized Operation Types for Security & Error Auditing
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email || null,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on application boot as required by specification
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase notice: client is currently in offline mode.');
    }
    // Expected during first run before test doc exists
    return false;
  }
}

// Persistent Unique Visitor Identifier
export function getOrCreateVisitorId(): string {
  const STORAGE_KEY = 'b2b_app_visitor_id';
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return `vis_${Date.now()}_temp`;
  }
}

// Supported Form Types systematically stored and organized
export type FormType =
  | 'waitlist'
  | 'booking'
  | 'audit'
  | 'sequence'
  | 'payment'
  | 'roi_scenario'
  | 'partner_connect';

export interface FormSubmissionRecord {
  id: string; // Unique, formatted submission ID
  formType: FormType;
  visitorId: string;
  userId?: string | null;
  userEmail: string;
  userName?: string;
  appName?: string;
  status: 'new' | 'in_review' | 'processed' | 'confirmed';
  submittedAt: string; // ISO 8601 string
  summary: string;
  details: Record<string, any>;
}

export interface SubmissionInput {
  formType: FormType;
  userEmail: string;
  userName?: string;
  appName?: string;
  summary: string;
  details: Record<string, any>;
  customId?: string;
  status?: 'new' | 'in_review' | 'processed' | 'confirmed';
}

const LOCAL_STORAGE_BACKUP_KEY = 'b2b_submissions_backup';

function saveToLocalStorageBackup(record: FormSubmissionRecord) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    const existing: FormSubmissionRecord[] = raw ? JSON.parse(raw) : [];
    const updated = [record, ...existing.filter((item) => item.id !== record.id)];
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Local storage backup error:', e);
  }
}

export function getLocalStorageSubmissions(): FormSubmissionRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Stores and systematically organizes any form or detail submitted on the app.
 * Automatically provisions a unique structured ID and ties to the visitor or authenticated user.
 */
export async function recordFormSubmission(
  input: SubmissionInput
): Promise<FormSubmissionRecord> {
  const visitorId = getOrCreateVisitorId();
  const currentUser = auth.currentUser;
  const timestamp = new Date().toISOString();

  // Generate clean, readable, unique ID with type prefix
  const prefixMap: Record<FormType, string> = {
    waitlist: 'SUB-WL',
    booking: 'SUB-BOOK',
    audit: 'SUB-AUDIT',
    sequence: 'SUB-SEQ',
    payment: 'SUB-PAY',
    roi_scenario: 'SUB-ROI',
    partner_connect: 'SUB-PARTNER',
  };

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const generatedId =
    input.customId && input.customId.length > 0 && input.customId.length <= 128
      ? input.customId
      : `${prefixMap[input.formType]}-${Date.now().toString().slice(-6)}-${randomSuffix}`;

  const record: FormSubmissionRecord = {
    id: generatedId,
    formType: input.formType,
    visitorId,
    userId: currentUser ? currentUser.uid : null,
    userEmail: input.userEmail || (currentUser?.email ?? 'visitor@b2bappmarketer.com'),
    userName: input.userName || (currentUser?.displayName ?? 'Anonymous Visitor'),
    appName: input.appName || 'B2B Application',
    status: input.status || 'new',
    submittedAt: timestamp,
    summary: input.summary || `${input.formType} submitted`,
    details: input.details || {},
  };

  // Always keep offline/local backup so visitors can view their submissions immediately
  saveToLocalStorageBackup(record);

  const docPath = `submissions/${generatedId}`;
  try {
    await setDoc(doc(db, 'submissions', generatedId), record);
    console.log(`[Firebase] Stored form submission ${generatedId} under /submissions`);
  } catch (err) {
    // If Firestore write fails (e.g. offline, permissions), log via standardized error handler
    console.warn('Firestore submission write notice:', err);
    try {
      handleFirestoreError(err, OperationType.CREATE, docPath);
    } catch {
      // Re-throw or allow local backup to persist
    }
  }

  return record;
}

/**
 * Retrieve submissions for the current visitor or authenticated user
 */
export async function fetchUserSubmissions(): Promise<FormSubmissionRecord[]> {
  const localList = getLocalStorageSubmissions();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return localList;
  }

  const collectionPath = 'submissions';
  try {
    const q = query(
      collection(db, collectionPath),
      where('userId', '==', currentUser.uid)
    );
    const snap = await getDocs(q);
    const remoteList: FormSubmissionRecord[] = [];
    snap.forEach((docSnap) => {
      remoteList.push(docSnap.data() as FormSubmissionRecord);
    });

    // Merge remote and local (deduplicate by id)
    const map = new Map<string, FormSubmissionRecord>();
    remoteList.forEach((item) => map.set(item.id, item));
    localList.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item);
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (err) {
    console.warn('Error fetching user submissions from Firestore, returning local list:', err);
    return localList;
  }
}
