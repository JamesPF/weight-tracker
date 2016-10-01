console.log('modal js is working');

$(document).ready(function () {
  $('#modal-trigger').on('click', function () {
    $('#page-overlay').show();
    $('#myModal').show().css({'left': '50%', 'margin-left': -($('#myModal').width()/1.8)});
  });

  $('#page-overlay').on('click', function () {
    $(this).fadeOut(200);
    $('#myModal').fadeOut(200);
  });
});