console.log('login js hooked up');

// Handles sign up AJAX request
$('#sign-up').on('click', function (event) {
  event.preventDefault();

  var email = $('#new-email').val();
  var password = $('#new-password').val();

  if(email.length > 0) {
    console.log('sign up request made from ' + email);

    $.ajax('/users', {
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({email: email, password: password}),
      success: function () {
        alert('new user signed up!');
      }
    });
  }
});

// Handles login AJAX request
$('#login').on('click', function (event) {
  event.preventDefault();

  var email = $('#email').val();
  var password = $('#password').val();

  if(email.length > 0) {
    console.log('login request made from ' + email);

    $.ajax('/users/login', {
      type: 'POST',
      dataType: 'json',
      data: {email: email, password: password},
      success: function () {
        alert('user logged in!');
      }
    });
  }
});