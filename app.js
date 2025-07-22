import { auth, db, storage } from './firebase-config.js';
import { ref as dbRef, push, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// 🔁 Placeholder Analysis Logic
function analyzeChart() {
  return {
    entry: (Math.random() * 10 + 190).toFixed(2),
    stoploss: (Math.random() * 5 + 185).toFixed(2),
    avg: (Math.random() * 10 + 188).toFixed(2),
    target: (Math.random() * 10 + 200).toFixed(2),
  };
}

window.uploadScreenshot = () => {
  const file = document.getElementById('screenshot').files[0];
  if (!file) return alert("Please upload a file!");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      const imageRef = sRef(storage, `charts/${uid}/${Date.now()}-${file.name}`);
      uploadBytes(imageRef, file).then(snapshot => {
        getDownloadURL(snapshot.ref).then(url => {
          const result = analyzeChart();
          set(push(dbRef(db, `analysis/${uid}`)), {
            url, ...result, timestamp: Date.now()
          });

          document.getElementById('entry').textContent = result.entry;
          document.getElementById('stoploss').textContent = result.stoploss;
          document.getElementById('avg').textContent = result.avg;
          document.getElementById('target').textContent = result.target;
        });
      });
    }
  });
};
