  $(function(){
  $('input[name=f_emailcheck], input[name=f_mobilecheck]').change(function(){
    var form = $(this).parents('form'),
      em_ck  = form.find('input[name=f_emailcheck]'),
      mob_ck = form.find('input[name=f_mobilecheck]'),
      em_rs  = form.find('label.email span.redstar'),
      mob_rs = form.find('label.mobile span.redstar'),
      email  = form.find('input[name=f_email]'),
      mobile = form.find('input[name=f_mobile]');
    if(!em_ck.is(":checked")&&!mob_ck.is(":checked")){
      if ($(this).prop('name')=='f_emailcheck') mob_ck.prop('checked', true);
      else em_ck.prop('checked', true);
    }
    if (em_ck.is(":checked")) { em_rs.text("*"); email.prop("required"); }
    else { em_rs.text(""); email.removeProp("required"); }
    if (mob_ck.is(":checked")) { mob_rs.text("*"); mobile.prop("required"); }
    else { mob_rs.text(""); mobile.removeProp("required"); }
  });
});
    $('.regButton').on('click', function(event) {
  event.preventDefault();
  var lan = $('#landing'), log = $('#login');
  if (log) { log.hide(); }
  if (lan) { $('body').attr('style', lan.attr('data-body-style')); lan.show();}
});
$('.logButton').on('click', function(event) {
  event.preventDefault();
  var lan = $('#landing'), log = $('#login');
  if (lan) { lan.hide(); }
  if (log) { $('body').attr('style', log.attr('data-body-style')); log.show();}
});
$('.sponsorLogin').on('click', function(event) {
  event.preventDefault();
  $('#employee-registration').hide();
  $('#vendor-registration').hide();
  $('#guest-registration').hide();
  $('#login').show();
});
$('.sponsor-emp').on('click', function(event) {
  event.preventDefault();
  $('#login').hide();
  $('#vendor-registration').hide();
  $('#guest-registration').hide();
  $('#employee-registration').show();
});
$('.sponsor-vnd').on('click', function(event) {
  event.preventDefault();
  $('#login').hide();
  $('#employee-registration').hide();
  $('#guest-registration').hide();
  $('#vendor-registration').show();
});
$('.sponsor-gst').on('click', function(event) {
  event.preventDefault();
  $('#login').hide();
  $('#employee-registration').hide();
  $('#vendor-registration').hide();
  $('#guest-registration').show();
});
        $('.tryButton').on('click', function(event) {
  event.preventDefault();
  // This logic wont work for HiveAP as clientMAC will not be present in failure page redirection
  // location.replace(location.href.replace('login.html', 'landing.html')); 
  location.href = "http://1.2.3.4"; // Force AP's Captive portal redirection to kick in
});
$('.outButton').on('click', function(event) {
  event.preventDefault();
  location.replace(getLogoutURL());
});
$('.ancButton').on('click', function(event) {
  event.preventDefault();
  var form = $('<form method="POST"></form>'), urlParams = URLSearchToFormFields();
  form.prepend(urlParams.formItems);
  form.append(urlParams.hsServer); form.append(urlParams.currTime); form.append(urlParams.qv);
  form.append('<input name="f_register" type="hidden" value="Register">');
  var formAction = getFormAction('reg');
  form.attr('action', location.origin+ '/guest/register/accept_connect' + location.search);
  form.attr('method', formAction.method);
  $.ajax({
    type: form.attr('method'),
    url: form.attr('action'),
    data: form.serialize()
  }).done(function (data) {
    $('.formError, .formSubmitStatus').text(data.message).show();
    if(data.macAuthRedirect) {
      setTimeout(function(){
      var macAuthForm = $('<form></form>');
        $(document.body).append(macAuthForm);
        var clientMac = $.urlParam('clientMac').replace(/-/g, '').toLowerCase();
        macAuthForm.append(URLSearchToFormFields())
        macAuthForm.append('<input type="hidden" name="username" value="' + clientMac + '">')
        macAuthForm.append('<input type="hidden" name="password" value="' + clientMac + '">')
        macAuthForm.append('<input type="hidden" name="Submit2" value="Submit">');
        macAuthForm.append('<input type="hidden" name="autherr" value="0">');
        macAuthForm.append('<input type="hidden" name="url" value="https://extremenetworks.com">');
        macAuthForm.append('<input type="hidden" name="ssid" value="' + $.urlParam('network') + '">');
        macAuthForm.attr('action', $.urlParam('redirecturl'));
        macAuthForm.attr('method', 'POST');
        macAuthForm.submit();
      }, 500);          
    }
  }).fail(function (data) {
    $('.formError, .formSubmitStatus').text('Server Error. Please try after sometime').show();
  });
});
$('.cntButton').on('click', function(event) {
  event.preventDefault();
  var form = $('<form method="POST"></form>'), urlParams = URLSearchToFormFields();
  form.prepend(urlParams.formItems);
  $('<input name="f_agree">').val('acknowledgement').appendTo(form);
  form.append(urlParams.hsServer); form.append(urlParams.currTime); form.append(urlParams.qv);
  var formAction = getFormAction('log');
  form.attr('action', location.origin+ '/guest/register/accept_connect' + location.search);
  form.attr('method', formAction.method);
  $.ajax({
    type: form.attr('method'),
    url: form.attr('action'),
    data: form.serialize()
  }).done(function (data) {
    $('.formError, .formSubmitStatus').text(data.message).show();
    if(data.macAuthRedirect) {
      setTimeout(function(){
      var macAuthForm = $('<form></form>');
        $(document.body).append(macAuthForm);
        var clientMac = $.urlParam('clientMac').replace(/-/g, '').toLowerCase();
        macAuthForm.append(URLSearchToFormFields())
        macAuthForm.append('<input type="hidden" name="username" value="' + clientMac + '">')
        macAuthForm.append('<input type="hidden" name="password" value="' + clientMac + '">')
        macAuthForm.append('<input type="hidden" name="Submit2" value="Submit">');
        macAuthForm.append('<input type="hidden" name="autherr" value="0">');
        macAuthForm.append('<input type="hidden" name="url" value="https://extremenetworks.com">');
        macAuthForm.append('<input type="hidden" name="ssid" value="' + $.urlParam('network') + '">');
        macAuthForm.attr('action', $.urlParam('redirecturl'));
        macAuthForm.attr('method', 'POST');
        macAuthForm.submit();
      }, 500);          
    }
  }).fail(function (data) {
    $('.formError, .formSubmitStatus').text('Server Error. Please try after sometime').show();
  });
});
$.urlParam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  }
  else {
    return decodeURI(results[1]) || 0;
  }
}
$('form.registrationForm a.submit').on('click', function(event) {
  event.preventDefault();
  if (!isRegFormValid($(this).parents('form'))) return false;
  var path = location.pathname.split('/'), form = $(this).parents('form'), urlParams = URLSearchToFormFields();
  if (form.find('.select_dob_day').val()) {
    var day = form.find('.select_dob_day').val(), month = form.find('.select_dob_month').val(), year = form.find('.select_dob_year').val();
    $('form.registrationForm input[name=f_dob]').remove()
    form.append('<input name="f_dob" type="hidden" value="'+year+'-'+month+'-'+day+'">');
  }
  $('form.registrationForm input[name=cpname]').remove()
  form.prepend(urlParams.formItems + '<input type="hidden" name="cpname" value="' + path[path.length - 2] + '">');
  $('form.registrationForm input[name=owner_id]').remove()
  form.prepend(urlParams.formItems + '<input type="hidden" name="owner_id" value="' + path[path.length - 3] + '">');
  form.append(urlParams.hsServer); form.append(urlParams.currTime); form.append(urlParams.qv);
  form.append('<input name="f_register" type="hidden" value="Register">');
  var formAction = getFormAction('reg');
  form.attr('action', location.origin+ '/guest/register/register_user' + location.search);
  form.attr('method', formAction.method);

  $.ajax({
    type: form.attr('method'),
    url: form.attr('action'),
    data: form.serialize()
  }).done(function (data) {
    form.find('.formError, .formSubmitStatus').text(data.message).show();
    if(data.macAuthRedirect) {
      setTimeout(function(){
      var macAuthForm = $('<form></form>');
        $(document.body).append(macAuthForm);
        var clientMac = $.urlParam('clientMac').replace(/-/g, '').toLowerCase();
        macAuthForm.append(URLSearchToFormFields())
        macAuthForm.append('<input type="hidden" name="username" value="' + clientMac + '">')
        macAuthForm.append('<input type="hidden" name="password" value="' + clientMac + '">')
        macAuthForm.append('<input type="hidden" name="Submit2" value="Submit">');
        macAuthForm.append('<input type="hidden" name="autherr" value="0">');
        macAuthForm.append('<input type="hidden" name="url" value="https://extremenetworks.com">');
        macAuthForm.append('<input type="hidden" name="ssid" value="' + $.urlParam('network') + '">');
        macAuthForm.attr('action', $.urlParam('redirecturl'));
        macAuthForm.attr('method', 'POST');
        macAuthForm.submit();
      }, 500);          
    } else {
      if(data.success) {
        form.find('.formError, .formSubmitStatus').text(data.message || 'Successfully registered!').show();
      } else {
        form.find('.formError, .formSubmitStatus').text(data.message || 'Registration failed. Please contact administrator.').show();
      }
    }
  }).fail(function (data) {
    form.find('.formError, .formSubmitStatus').text('Server Error. Please try after sometime').show();
  });
});
$('form.loginForm a.submit').on('click', function(event) {
  event.preventDefault();
  var form = $(this).parents('form'), formError = form.find('.formError'), urlParams = URLSearchToFormFields();
  form.attr('action', location.origin+ '/guest/register/deviceFingerPrint' + location.search);
  form.attr('method', 'POST');
  $.ajax({
    type: form.attr('method'),
    url: form.attr('action'),
    data: form.serialize()
  }).done (function (data) {
      if(data.success) {
        var username = $('#f_user_id').val();
        var password = $('#f_pass_id').val();
        var authForm = $('<form></form>');
        $(document.body).append(authForm);
        authForm.append(URLSearchToFormFields())
        authForm.append('<input type="hidden" name="username" value="' + username.toLowerCase() + '">')
        authForm.append('<input type="hidden" name="password" value="' + password + '">')
        authForm.append('<input type="hidden" name="Submit2" value="Submit">');
        authForm.append('<input type="hidden" name="autherr" value="0">');
        authForm.append('<input type="hidden" name="url" value="https://extremenetworks.com">');
        authForm.append('<input type="hidden" name="ssid" value="'+ $.urlParam('network')+'">');
        authForm.attr('action', $.urlParam('redirecturl'));
        authForm.attr('method', 'POST');
        authForm.submit();
        return false;
      } else {
        formError.text(data.message).show();
      }
    });
});
$('form.loginForm a.forgot').on('click', function(event) {
  event.preventDefault();
  var form = $(this).parents('form'), formError = form.find('.formError'), urlParams = URLSearchToFormFields();
  if ($('#f_user_id').val() == "") {
    formError.text("Please enter a valid username.").show();
  } else {
    $('form.registrationForm').remove()
    var form = $('<form class="forgotPassword" method="POST"></form>'), urlParams = URLSearchToFormFields();
    form.prepend(urlParams.formItems);
    var username = $('#f_user_id').val();
    form.append('<input name="username" type="hidden" value="'+ username.toLowerCase() +'">');
    form.attr('action', location.origin+ '/guest/register/forgot' + location.search);
    form.attr('method', 'POST');
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize()
    }).done(function (data) {
      if(data.success) {
        formError.text("Your password will be reset!" + '\n' + "Please check your email/sms for new passcode.").show();
      } else {
        formError.text(data.message).show();
      }
    });
  }
});
$('form').on('reset', function(event) { $(this).find('.formError, .error').text('').hide(); });
$('.social-buttons').on('click', function(event){
  event.preventDefault();
  var social = $(this).data('connect');
  social = social=='facebook_checkin' ? 'facebook&checkin' : social;
  redirectTo(social);
});
  $('form input:reset').on('click', function(event) { $('form .formError, form .error').text('').hide(); });
function isRegFormValid(form) {
  var has_error = false;
  var EMAIL_REGEXP = /[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/g;
  form.find('.formError, .error').text('').hide();
  form.find('.email-go').each(function(i, el){
    var input = $(el).find('input'), error = $(el).find('.error'), value = input.val();
      input.val(value.toLowerCase());
    error.hide();
    if (value.length && !EMAIL_REGEXP.test(value)) {
      error.text("Invalid e-mail address").show();
      has_error = true;
    }
  });
  form.find('.form-group').each(function(i, el){
    var input = $(el).find('input'),
      error = $(el).find('.error'),
      value = input.val();

    if ($(el).find('.redstar').text()=='') {    //sponsor validation
      if (input.attr('type')=='sponsor_email') {
       var SPONSOR_EMAIL_REGEX = /[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/g;
        if (value.length && !SPONSOR_EMAIL_REGEX.test(value)) {
            error.text("Invalid e-mail address").show();
            has_error = true;
        }
      }
    }

    if ($(el).find('.redstar').text()=='*') {
      if (input.attr('type')=='email') {
        if (!EMAIL_REGEXP.test(value)) {
            error.text("Invalid e-mail address").show();
            has_error = true;
        }
        input.val(value.toLowerCase());
      } else if (input.attr('type')=='sponsor_email') {
        var SPONSOR_EMAIL_REGEX = /^[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/;
        if (!SPONSOR_EMAIL_REGEX.test(value)) {
            error.text("Invalid e-mail address").show();
            has_error = true;
        }
        input.val(value.toLowerCase());
      } else if (input.attr('type')=='mobile') {
        var MOBILE_REGEXP = /^([0-9]{11,13})$/;
        if (!MOBILE_REGEXP.test(value)) {
            error.text("Telefone inválido").show();
            has_error = true;
        }
      } else if ($(el).hasClass('birthday')) {
        var birthday_error = false, error_message = [];
        $(el).find('select').each(function() {
          if (!$(this).val()) {
            birthday_error = true;
            error_message.push($(this).data('error-message'));
          }
        });
        if (birthday_error) {
          error.html(error_message.join('<br>')).show();
          has_error = true;
        }
      } else if (value=='') {
        error.text(input.data('error-message')).show();
        has_error = true;
      }
    }
  });
  if (form.find('input[name=f_disclaimer]').length && !form.find('input[name=f_disclaimer]').is(':checked')) {
    form.find('.disclaimer.error').text(form.find('input[name=f_disclaimer]').data('error-message')).show();
    has_error = true;
  }
  return !has_error;
}
function isLoginFormValid(form) {
  var error = false;
  form.find('.formError, .error').text('').hide();
  form.find('.form-group').each(function(i, el) {
    if ($(el).find('input').val()=='') {
      $(el).find('.error').text( $(el).find('input').data('error-message') ).show();
      error = true;
    }
    $(el).find('input').val($(el).find('input').val().toLowerCase());
  });
  return !error;
}
</script>

<script>
if ("OTPCredential" in window) {
window.addEventListener("DOMContentLoaded", (e) => {
  const input = document.querySelector('input[id="f_pass_id"]');
   if (!input) return;
    // Set up an AbortController to use with the OTP request
   const ac = new AbortController();
   const form = input.closest("form");
   const signInButton = document.querySelectorAll(".otp-sign-in");
  if (form) {
    // Abort the OTP request if the user attempts to submit the form manually
    form.addEventListener("submit", (e) => {
      ac.abort();
    });
  }
  // Request the OTP via get()
  navigator.credentials
    .get({
      otp: { transport: ["sms"] },
      signal: ac.signal,
    })
    .then((otp) => {
      // When the OTP is received by the app client, enter it into the form
      // input and submit the form automatically
      input.value = otp.code;
      // for (let i = 0; i < signInButton.length; i++) {
      //     signInButton[i].click();
      // }
    })
    .catch((err) => {
      console.error(err);
    });
});
}
