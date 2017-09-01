var firebase = require('firebase');


var config = {
    apiKey: "AIzaSyDYZYkrZeppr0Ms2FeKs-6GQhktHURRDfQ",
    authDomain: "ssisteam2.firebaseapp.com",
    databaseURL: "https://ssisteam2.firebaseio.com",
    projectId: "ssisteam2",
    storageBucket: "ssisteam2.appspot.com",
    messagingSenderId: "671189918698"
};
firebase.initializeApp(config);

var ref= firebase.database().ref('/quotes');

/*var quote = {
    name: 'Htein',
    quote : 'be like htein lin aung'
};*/

//ref.push(quote);

// Retrieving from database
var ref = firebase.database().ref('/quotes');
ref.once('value', function (snapshot) {
    snapshot.forEach(function (data) {
        key = data.key;

        var val = firebase.database().ref('/quotes/' +
            key).once('value').then((data2) => {
            var quote = {
                name : data2.val().name,
                quote : data2.val().quote
            };
            console.log(quote);

    });
    });

});




//update data
/*ref.once('value', function (snapshot) {
    snapshot.forEach(function (data) {
        key = data.key;

        if(key = '-KsCeVVJ91nMF1fuM02u')
        {
            var val = firebase.database().ref('/quotes/' +
                key);
            val.update(quote);
            console.log("Record successfully updated!..");
        }


    });
    });*/





