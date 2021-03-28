if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("service worker installed");
    }).catch(error =>{
        console.error(`error: ${error}`);
    })
}

// let deferredPrompt;
// const addBtn = document.getElementById('add-button');
// // addBtn.style.display = 'none';

// window.addEventListener('beforeinstallprompt', (e) => {
//     console.log(e);
//   // Prevent Chrome 67 and earlier from automatically showing the prompt
//   e.preventDefault();
//   // Stash the event so it can be triggered later.
//   deferredPrompt = e;
//   // Update UI to notify the user they can add to home screen
//   addBtn.style.display = 'block';

//   addBtn.addEventListener('click', () => {
//       console.log(000);
//     // hide our user interface that shows our A2HS button
//     addBtn.style.display = 'none';
//     // Show the prompt
//     deferredPrompt.prompt();
//     // Wait for the user to respond to the prompt
//     deferredPrompt.userChoice.then((choiceResult) => {
//       if (choiceResult.outcome === 'accepted') {
//         console.log('User accepted the A2HS prompt');
//       } else {
//         console.log('User dismissed the A2HS prompt');
//       }
//       deferredPrompt = null;
//     });
//   });
// });