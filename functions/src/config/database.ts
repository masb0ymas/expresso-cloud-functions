import * as admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from './env'

const serviceAccountKey = path.resolve(
  `${__dirname}/../../serviceAccountKey.json`
)

if (!fs.existsSync(serviceAccountKey)) {
  throw new Error('Missing serviceAccountKey.json!!!')
}

console.log({ serviceAccountKey })

admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) })
const dbAdmin = admin.firestore()

const dbConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
}

export { dbConfig, dbAdmin }
