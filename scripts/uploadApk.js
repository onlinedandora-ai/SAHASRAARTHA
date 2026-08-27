import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: 'AIzaSyDVyi2wbhtgPeXmK7yLewLfnk1YqVt4dGA',
  authDomain: 'saharaartha-f867c.firebaseapp.com',
  projectId: 'saharaartha-f867c',
  storageBucket: 'saharaartha-f867c.firebasestorage.app',
  messagingSenderId: '1056041223530',
  appId: '1:1056041223530:android:64e416d930622bf37cd113'
};

async function upload() {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const apkPath = path.resolve('Sahasraartha-SFO.apk');
  
  if (!fs.existsSync(apkPath)) {
    console.error('APK file not found at:', apkPath);
    process.exit(1);
  }

  console.log('Reading APK file...', apkPath);
  const fileBuffer = fs.readFileSync(apkPath);
  const storageRef = ref(storage, 'downloads/Sahasraartha-SFO.apk');

  console.log('Uploading to Firebase Storage (size: ' + (fileBuffer.length / 1024 / 1024).toFixed(2) + ' MB)...');
  const snapshot = await uploadBytes(storageRef, fileBuffer, {
    contentType: 'application/vnd.android.package-archive'
  });

  const downloadURL = await getDownloadURL(snapshot.ref);
  console.log('UPLOAD SUCCESSFUL!');
  console.log('Public APK Download URL:', downloadURL);
  
  // Update version.json with the direct download URL
  const versionJsonPath = path.resolve('public/version.json');
  if (fs.existsSync(versionJsonPath)) {
    const versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
    versionData.apkUrl = downloadURL;
    fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));
    console.log('Updated public/version.json with direct APK URL');
  }
}

upload().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
