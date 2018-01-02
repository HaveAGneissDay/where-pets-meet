$(document).ready(function() {

  // Required init for dropdowns to work.
  $('select').material_select();

  // Required init for dropdowns to work.
  $(".rotate").rotator();

  // For carousel to work.
  $('.carousel.carousel-slider').carousel({fullWidth: true});

  // For modals to work.
  $('.modal').modal();

  // -----------------------------------------------------------

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDWOzsO-5lWbobwqB0XodtPUEbvHaei6pU",
    authDomain: "petproject-ebbc1.firebaseapp.com",
    databaseURL: "https://petproject-ebbc1.firebaseio.com",
    projectId: "petproject-ebbc1",
    storageBucket: "",
    messagingSenderId: "1068542777472"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#submit").on("click", function() {

    // -----------------------------------------------------------
    var zipInput = $('#zip_code').val().trim()
    console.log(zipInput);

    var soughtAnimal = $('#choiceAnimal>option:selected').val().trim();
    console.log(soughtAnimal);

    var queryURL = 'https://api.petfinder.com/pet.find?format=json&key=dd9016ebaee01ff97c4bd3319ee97eaf&animal=' + soughtAnimal + '&location=94025&?count=5&callback=?';
    console.log(queryURL);

    $.ajax({
               type: 'GET',
               url: queryURL,
               processData: true,
               data: {},
               dataType: "json",
               success: function (petApiData) {
                   processData(petApiData);
               }
    });

    function processData(petApiData){

     var results = petApiData.petfinder.pets

     for (var i = 0; i < 25; i++) {

       // var breed1 = results.pet[i].breeds.breed[0].$t
       // var breed2 = results.pet[i].breeds.breed[1].$t
       var petName = results.pet[i].name.$t
       console.log(petName);

       var petGender = results.pet[i].sex.$t
       console.log(petGender);

       var petPhone = results.pet[i].contact.phone.$t
       console.log(petPhone);

       var petEmail = results.pet[i].contact.email.$t
       console.log(petEmail);

       var aboutPet = results.pet[i].description.$t
       console.log(aboutPet);

       var petCity = results.pet[i].contact.city.$t
       console.log(petCity);

       var petState = results.pet[i].contact.state.$t
       console.log(petState);

       var petZipcode = results.pet[i].contact.zip.$t
       console.log(petZipcode);

       console.log("--------");
       console.log(petCity+" "+petState+" "+petZipcode);

       console.log('Image source link:');
       console.log(results.pet[i].media.photos.photo[2].$t);

       // console.log(breed1);
       // console.log(breed2);
       console.log("____________________");


       // // Creating and storing a div tag
       // var animalPic = $("<img />");
       //
       // // Setting the src attribute of the image to a property pulled off the result item
       // animalPic.addClass('animalPic img-rounded media-middle');
       // animalPic.attr("src", results[i].images.fixed_height.url);
       // animalPic.attr("data-animate", results[i].images.fixed_height.url);
       // animalPic.attr("data-still", results[i].images.fixed_height_still.url);
       // animalPic.attr("data-still", results[i].images.fixed_height_still.url);
       // animalPic.attr("data-state", "animate");
       //
       // // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
       // $("#gifSpace").prepend(animalPic);

     }

     var animalCardBtn = $("<a />");
     animalCardBtn.addClass('btn-floating halfway-fab waves-effect waves-light red modal-trigger');
     animalCardBtn.attr("href", "#modalHeidi");
     animalCardBtn.attr("id", "describeBtn");

     var animalCardBtnIcon = $("<i />")
     animalCardBtnIcon.addClass('material-icons');
     animalCardBtnIcon.text('add');

     $("#describeBtn").append(animalCardBtnIcon);

     var animalCardImg = $("<img />");
     animalCardImg.attr("src", "http://photos.petfinder.com/photos/pets/37260331/1/?bust=1491274848&width=500&-x.jpg");

     var animalCardTxt = $("<span />");
     animalCardTxt.addClass('card-title');
     animalCardTxt.text('Heidi (F) | Menlo Park');

     var animalCardImgContain = $("<div />")
     animalCardImgContain.addClass('card-image');

     $(".card-image").append(animalCardImg);
     $(".card-image").append(animalCardTxt);
     $(".card-image").append(animalCardBtn);

     var animalCardContentContain = $("<div />")
     animalCardContentContain.addClass('card-content');

     var animalCardPhone = $("<p />")
     animalCardPhone.text('555-555-1234');

     var animalCardEmail = $("<p />")
     animalCardEmail.text('tiramisudogrescue@gmail.com');

     $(".card-content").append(animalCardPhone);
     $(".card-content").append(animalCardEmail);

     var animalCard = $("<div />")
     animalCard.addClass('card');

     $(".card").append(animalCardImgContain);
     $(".card").append(animalCardContentContain);

     var animalCardContainer = $("<div />")
     animalCardContainer.addClass('col s12 m6 l3');
     animalCardContainer.attr("id", "animalCard");

     $("#animalCard").append(animalCard);

     $("#animalResults").append(animalCardContainer);




     // <div class="col s12 m6 l3">
     //   <div class="card">
     //     <div class="card-image">
     //       <img src="http://photos.petfinder.com/photos/pets/37260331/1/?bust=1491274848&width=500&-x.jpg">
     //       <span class="card-title">Heidi (F) | Menlo Park</span>
     //       <a class="btn-floating halfway-fab waves-effect waves-light red modal-trigger" href="#modalHeidi"><i class="material-icons">add</i></a>
     //     </div>
     //     <div class="card-content">
     //       <p>Phone: 555-555-1234</p>
     //       <p>Email: tiramisudogrescue@gmail.com</p>
     //     </div>
     //   </div>
     // </div>

    }

    // -----------------------------------------------------------
  });

});

//Components that we need in general terms
// What should appear when the page opens. Dynamically generated
// Install firebase
//Ajax call for PetFinder
//Ajax call for Google Places
// Match results to Google maps
