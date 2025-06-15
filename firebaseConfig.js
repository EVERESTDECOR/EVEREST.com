
  const firebaseConfig = {
    apiKey: "AIzaSyCKFpi5AjdcPL8e0OJc1CQaR8CpqjSy9wg",
    authDomain: "everest-hardware.firebaseapp.com",
    projectId: "everest-hardware",
    storageBucket: "everest-hardware.firebasestorage.app",
    messagingSenderId: "715966014525",
    appId: "1:715966014525:web:c8ca671ad0983c95bfb654",
    measurementId: "G-0ZGRQRQ9Z4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);