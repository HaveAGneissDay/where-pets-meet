$(document).ready(function() {

  // Required init for dropdowns to work.
  $('select').material_select();

  // Required init for dropdowns to work.
  $(".rotate").rotator();

  // For carousel to work.
  $('.carousel.carousel-slider').carousel({
    fullWidth: true
  });

  // For modals to work.
  $('.modal').modal();

  // -----------------------------------------------------------
  var addressPicker = new AddressPicker();

  $('#zip_code').typeahead(null, {
    displayKey: 'description',
    source: addressPicker.ttAdapter()
  });
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDWOzsO-5lWbobwqB0XodtPUEbvHaei6pU",
    authDomain: "petproject-ebbc1.firebaseapp.com",
    databaseURL: "https://petproject-ebbc1.firebaseio.com",
    projectId: "petproject-ebbc1",
    storageBucket: "petproject-ebbc1.appspot.com",
    messagingSenderId: "1068542777472"
  };
  firebase.initializeApp(config);


  var database = firebase.database();



  var zipInput;

  $("#submit").on("click", function() {


    event.preventDefault();



    $('#animalResults').html('')


    // -----------------------------------------------------------
    zipInput = $('#zip_code').val().trim()
    console.log(zipInput);

 $('#zip_code').val("");
    var soughtAnimal = $('#choiceAnimal>option:selected').val().trim();
    console.log(soughtAnimal);
    $('#choiceAnimal>option:selected').val("")
    var newSearch = {
      newPet: soughtAnimal,
      newZipInput: zipInput
    }

    database.ref().push(newSearch);

    var queryURL = 'https://api.petfinder.com/pet.find?format=json&key=dd9016ebaee01ff97c4bd3319ee97eaf&animal=' + soughtAnimal + '&location=' + zipInput + '&?count=5&callback=?';
    console.log(queryURL);

    $.ajax({
      type: 'GET',
      url: queryURL,
      processData: true,
      data: {},
      dataType: "json",
      success: function(petApiData) {
        processData(petApiData);
      }
    });

    function processData(petApiData) {

      var results = petApiData.petfinder.pets

      $('#modalTitle').html(
        'Showing ' + soughtAnimal + 's ' + 'near '+ zipInput
      )


      for (var i = 0; i < 25; i++) {

        // var breed1 = results.pet[i].breeds.breed[0].$t
        // var breed2 = results.pet[i].breeds.breed[1].$t
        var petName = results.pet[i].name.$t
        console.log(petName);

        console.log(results);

        var petGender = results.pet[i].sex.$t
        console.log(petGender);

        var petPhone = results.pet[i].contact.phone.$t
        console.log(petPhone);

        var petEmail = results.pet[i].contact.email.$t
        console.log(petEmail);

        var aboutPet = results.pet[i].description.$t
        console.log(aboutPet);

        var petAddress = results.pet[i].contact.address1.$t
        console.log(petAddress);

        var petCity = results.pet[i].contact.city.$t
        console.log(petCity);

        var petState = results.pet[i].contact.state.$t
        console.log(petState);

        var petZipcode = results.pet[i].contact.zip.$t
        console.log(petZipcode);


        console.log("--------");
        console.log(petCity + " " + petState + " " + petZipcode);

        var location = (petCity + " " + petState + " " + petZipcode);
        var petImgURL = results.pet[i].media.photos.photo[2].$t;

        console.log('Image source link:');
        console.log(petImgURL);

        // console.log(breed1);
        // console.log(breed2);
        console.log("____________________");

        var petId = results.pet[i].id.$t;

        var animalModalId = "petId" + petId
        console.log(animalModalId);

        function filterEmailResults(results) {

          if (!results.pet[i].contact.email || !('$t' in results.pet[i].contact.email)) {
            return `<span class="noEmail">Email Not Available</span>`;

          } else {
            return `<a href="mailto:${results.pet[i].contact.email.$t}" class="email">${results.pet[i].contact.email.$t}</a>`;
          };
        };

        function filterPhoneResults(results) {

          if (!('$t' in results.pet[i].contact.phone)) {
            return 'Phone Number Not Available';

          } else {
            return `${results.pet[i].contact.phone.$t}`;
          };
        };
        var email = filterEmailResults(results);
        var phone = filterPhoneResults(results);

        var animalCard = '<div class="col s12 m6 l3">' +
          '<div class="card">' +
          '<div class="card-image">' +
          '<img src="' + petImgURL + '">' +
          '<span class="card-title">' + petName + ' (' + petGender + ')' + ' | ' + petCity + '</span>' +
          '<a class="btn-floating halfway-fab waves-effect waves-light red modal-trigger" id="petInfo" href="#' + animalModalId + '"><i class="material-icons">add</i></a>' +
          '</div>' +
          '<div class="card-content">' +
          '<p>Phone: ' + phone + '</p>' +
          '<p>Email: ' + email + '</p>' +
          '<iframe ' +
          'width="100%"' +
          'height="300px"' +
          'frameborder="0" style="border:0"' +
          'src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBVnpyx6VUOqZt71-xpQox5I19np1HBjig&q=' + petCity + petState + petZipcode + '" allowfullscreen>' +
          '</iframe>' +
          '</div>' +
          '</div>' +
          '</div>'



        $('#animalResults').append(animalCard)
      }


      // '<iframe ' +
      //  'width="600"' +
      //  'height="450"' +
      //  'frameborder="0" style="border:0"' +
      //  'src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDkFbTAnh3rnlQKy21dSKNCfTYV9PRR0_U&q=Space+Needle,Seattle+WA" allowfullscreen>' +
      // '</iframe>' +

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


  var queryURL2 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipInput + "&key=AIzaSyANo9S84eZ7PVyuKP2DSVE4wOawDLvocSE";

  $.ajax({
    url: queryURL2,
    method: "GET",
    success: function(response) {
      // response goes here

      console.log(response)
      console.log("-----------------------")
      console.log(response.results[0].geometry.location.lat)
      console.log(response.results[0].geometry.location.lng)
      latitude = response.results[0].geometry.location.lat;
      longitude = response.results[0].geometry.location.lng;
    }
  });

  var map;
  var infowindow;
  var longitude;
  var latitude;

  function initMap() {
    var newArea = {
      lat: latitude,
      lng: longitude
    };

    map = new google.maps.Map(document.getElementById('map'), {
      center: newArea,
      zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: newArea,
      radius: 500,
      type: ['park']
    }, callback);
  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }

  // <div id="animalModalId" class="modal">
  //   <div class="modal-content">
  //     <h4>Pet Name</h4>
  //     <p>Pet Description</p>
  //   </div>
  //   <div class="modal-footer">
  //     <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
  //   </div>
  // </div>

  $("#petInfo").on("click", function() {

    console.log('Button has been clicked.');
    console.log(animalModalId);

    // var animalModal = '<div id="'+ animalModalId +'" class="modal">'
    //     <div class="modal-content">
    //       <h4>Pet Name</h4>
    //       <p>Pet Description</p>
    //     </div>
    //     <div class="modal-footer">
    //       <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
    //     </div>
    //   </div>

  });
  // >>>>>>> ce8e854e6879e6b4f9da27311ab0006f29ecdbb4
  //
});

//Components that we need in general terms
// What should appear when the page opens. Dynamically generated
// Install firebase
//Ajax call for PetFinder
//Ajax call for Google Places
// Match results to Google maps
