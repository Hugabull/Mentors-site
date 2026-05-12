document.addEventListener("DOMContentLoaded", event => { //runs code after page is loaded as firebase is not avalible until such


    const app = firebase.app(); //const with firebase credentials
    const db = firebase.firestore();
    const notes = db.collection("Notes").doc("Mentor_notes");
     
   
    

    db.collection("Notes").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        const textsContainer = document.getElementById('dataText');
        textsContainer.innerHTML = ''; // Clear the current list of texts
        snapshot.forEach(doc => {
            const data = doc.data();
            const textP = document.createElement('p');
            textP.textContent = data.text;
            textsContainer.appendChild(textP);
        });
    });

});



function googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)

        .then(result => {
            const user = result.user;
            console.log(user)
        })
        .catch(console.log)
}


function AddInput(){
    
    const db = firebase.firestore();
    const notes = db.collection("Notes");
    const getInput = document.getElementById("Notes_input").value; //gets text input when button clicked
    
    db.collection("Notes").add({
        text: getInput,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
   

    document.getElementById("Notes_input").value = ""; //clears input feild

   



}

