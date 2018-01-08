$(document).ready(function() {

  // Required init for dropdowns to work.
  $('select').material_select();

  // Required init for dropdowns to work.
  $(".rotate").rotator();

  // For carousel to work.
  $('.carousel.carousel-slider').carousel({fullWidth: true});

  // For modals to work.
  $('.modal').modal();

  $('.collapsible').collapsible();

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

  function submitState(el) {

    var $form = $(el),
        $requiredInputs = $form.find('input:required','div:required'),
        $submit = $form.find('input[type="submit"]');

    $submit.attr('disabled', 'disabled');

    $requiredInputs.keyup(function () {

      $form.data('empty', 'false');

      $requiredInputs.each(function() {
        if ($(this).val() === '') {
          $form.data('empty', 'true');
        }
      });

      if ($form.data('empty') === 'true') {
        $submit.attr('disabled', 'disabled').attr('title', 'fill in all required fields');
      } else {
        $submit.removeAttr('disabled').attr('title', 'click to submit');
      }
    });
  }
  // apply to each form element individually
  submitState('#choiceAnimal');
  submitState('#zip_code');

  $("#submit").on("click", function() {



    $('#animalResults').html('')

    // -----------------------------------------------------------
    var zipInput = $('#zip_code').val().trim(),
        soughtAnimal = $('#choiceAnimal>option:selected').val().trim(),
        queryURL = 'https://api.petfinder.com/pet.find?format=json&key=dd9016ebaee01ff97c4bd3319ee97eaf&animal=' + soughtAnimal + '&location=' + zipInput + '&?count=5&callback=?';

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

      $('#modalTitle').html(
        'Showing ' + soughtAnimal + 's ' + 'near '+ zipInput
      )


      for (var i = 0; i < 25; i++) {

        var petName = results.pet[i].name.$t,
            petGender = results.pet[i].sex.$t,
            petPhone = results.pet[i].contact.phone.$t,
            petEmail = results.pet[i].contact.email.$t,
            aboutPet = results.pet[i].description.$t,
            petAddress = results.pet[i].contact.address1.$t,
            petCity = results.pet[i].contact.city.$t,
            petState = results.pet[i].contact.state.$t,
            petZipcode = results.pet[i].contact.zip.$t,
            location = (petCity+" "+petState+" "+petZipcode),
            petImgURL = results.pet[i].media.photos.photo[2].$t,
            petId = results.pet[i].id.$t,
            animalModalId = "petId" + petId;

        function filterEmailResults(results) {
          if(!results.pet[i].contact.email || !('$t' in results.pet[i].contact.email)) {
            return `<span class="noEmail">None Provided</span>`;
          } else {
            return `<a href="mailto:${results.pet[i].contact.email.$t}" class="email">${results.pet[i].contact.email.$t}</a>`;
          };
        };

        function filterPhoneResults(results) {
          if(!('$t' in results.pet[i].contact.phone)) {
            return 'None Provided';
          } else {
            return `${results.pet[i].contact.phone.$t}`;
          };
        };
        var email = filterEmailResults(results);
        var phone = filterPhoneResults(results);

        var animalCard =  '<div class="col s12 m6 l3">' +
        '<div class="card medium sticky-action">' +
        '<div class="card-image" id="imgCustom" >' +
        '<img class="activator" src="' + petImgURL + '">' +
        '<span class="card-title" id="txtCustom">'+ petName + ' (' + petGender + ')' + '<br>' + petCity + '</span>' +
        // '<a class="btn-floating halfway-fab waves-effect waves-light red modal-trigger" id="petInfo" href="#' + animalModalId + '"><i class="material-icons">add</i></a>' +
        '<a class="btn-floating btn-large waves-effect halfway-fab waves-light red petFav"><i class="material-icons">add</i></a>' +
        '</div>' +
          '<div class="card-content">' +
          '<p>Phone: ' + phone + '</p>' +
          '<p>Email: ' + email + '</p>' +
          // '<iframe ' +
          // 'width="100%"' +
          // 'height="300px"' +
          // 'frameborder="0" style="border:0"' +
          // 'src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBVnpyx6VUOqZt71-xpQox5I19np1HBjig&q=' + petCity + petState + petZipcode + '" allowfullscreen>' +
          // '</iframe>' +
          '</div>' +
          '<div class="card-action">' +
            '<a class="activator" href="#">Read more...</a>' +
          '</div>' +
          '<div class="card-reveal">' +
          '<span class="card-title grey-text text-darken-4">' + petName + '<i class="material-icons right">close</i></span>' +
          '<p>' + aboutPet + '</p>' +
            '<iframe ' +
            'width="100%"' +
            'height="300px"' +
            'frameborder="0" style="border:0"' +
            'src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBVnpyx6VUOqZt71-xpQox5I19np1HBjig&q=' + petCity + petState + petZipcode + '" allowfullscreen>' +
            '</iframe>' +
          '</div>' +
        '</div>' +
        '</div>'

        $('#animalResults').append(animalCard);
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

  // <div id="animalModalId" class="modal">
  //   <div class="modal-content">
  //     <h4>Pet Name</h4>
  //     <p>Pet Description</p>
  //   </div>
  //   <div class="modal-footer">
  //     <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
  //   </div>
  // </div>




  $(document).on("click",".petFav", function() {

    console.log('Button has been clicked.');

  });

});

//Components that we need in general terms
// What should appear when the page opens. Dynamically generated
// Install firebase
//Ajax call for PetFinder
//Ajax call for Google Places
// Match results to Google maps
