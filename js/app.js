import { auth, db, storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { push, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

window.uploadScreenshot = async function () {
  const file = document.getElementById('screenshot').files[0];
  if (!file) return alert('Please upload a screenshot');

  const storageRef = ref(storage, 'charts/' + file.name);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  // Dummy analysis logic
  const entry = (Math.random() * 100 + 100).toFixed(2);
  const stoploss = (entry - Math.random() * 5).toFixed(2);
  const avg = ((parseFloat(entry) + parseFloat(stoploss)) / 2).toFixed(2);
  const target = (parseFloat(entry) + Math.random() * 10).toFixed(2);

  // Save to DB
  const user = auth.currentUser;
  if (user) {
    const chartRef = push(dbRef(db, 'charts/' + user.uid));
    await set(chartRef, { downloadURL, entry, stoploss, avg, target });
  }

  // Show result
  document.getElementById('entry').innerText = entry;
  document.getElementById('stoploss').innerText = stoploss;
  document.getElementById('avg').innerText = avg;
  document.getElementById('target').innerText = target;
};
