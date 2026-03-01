import { databases, account, Query } from '@/lib/appwrite';

const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main';

export interface UserTermsStatus {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  policyVersion: string;
  needsAcceptance: boolean;
}

const CURRENT_POLICY_VERSION = 'v1.0';

/**
 * Check if user's terms and privacy acceptance is up to date
 */
export async function checkTermsAcceptance(userId: string): Promise<UserTermsStatus> {
  try {
    const documents = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );

    if (documents.documents.length === 0) {
      // User document doesn't exist yet, needs to accept
      return {
        termsAccepted: false,
        privacyAccepted: false,
        policyVersion: '',
        needsAcceptance: true,
      };
    }

    const userDoc = documents.documents[0];
    const termsAccepted = userDoc.terms_accepted === true;
    const privacyAccepted = userDoc.privacy_accepted === true;
    const policyVersion = userDoc.policy_version || '';

    const needsAcceptance =
      !termsAccepted ||
      !privacyAccepted ||
      policyVersion !== CURRENT_POLICY_VERSION;

    return {
      termsAccepted,
      privacyAccepted,
      policyVersion,
      needsAcceptance,
    };
  } catch (error) {
    console.error('Error checking terms acceptance:', error);
    // If error, assume user needs to accept for safety
    return {
      termsAccepted: false,
      privacyAccepted: false,
      policyVersion: '',
      needsAcceptance: true,
    };
  }
}

/**
 * Update user's terms and privacy acceptance in database
 */
export async function acceptTermsAndPrivacy(userId: string): Promise<boolean> {
  try {
    // Get current user
    const user = await account.get();
    
    // Check if user document exists
    const documents = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );

    const now = new Date().toISOString();

    if (documents.documents.length === 0) {
      // Create new user document
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          user_id: userId,
          email: user.email,
          name: user.name,
          terms_accepted: true,
          privacy_accepted: true,
          policy_version: CURRENT_POLICY_VERSION,
          accepted_at: now,
        }
      );
    } else {
      // Update existing user document
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documents.documents[0].$id,
        {
          terms_accepted: true,
          privacy_accepted: true,
          policy_version: CURRENT_POLICY_VERSION,
          accepted_at: now,
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error accepting terms:', error);
    return false;
  }
}

/**
 * Get current policy version
 */
export function getCurrentPolicyVersion(): string {
  return CURRENT_POLICY_VERSION;
}
