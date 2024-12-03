$(function() {
  // Quando os campos de email e telefone forem alterados
  $('input[name=f_emailcheck], input[name=f_mobilecheck]').change(function() {
    var form = $(this).parents('form'),
        em_ck  = form.find('input[name=f_emailcheck]'),
        mob_ck = form.find('input[name=f_mobilecheck]'),
        em_rs  = form.find('label.email span.redstar'),
        mob_rs = form.find('label.mobile span.redstar'),
        email  = form.find('input[name=f_email]'),
        mobile = form.find('input[name=f_mobile]');

    // Verificar se nenhum campo foi marcado
    if (!em_ck.is(":checked") && !mob_ck.is(":checked")) {
      if ($(this).prop('name') == 'f_emailcheck') mob_ck.prop('checked', true);
      else em_ck.prop('checked', true);
    }

    // Validar email e telefone
    if (em_ck.is(":checked")) {
      em_rs.text("*");
      email.prop("required");
    } else {
      em_rs.text("");
      email.removeProp("required");
    }

    if (mob_ck.is(":checked")) {
      mob_rs.text("*");
      mobile.prop("required");
    } else {
      mob_rs.text("");
      mobile.removeProp("required");
    }
  });

  // Mostrar tela de landing
  $('.regButton').on('click', function(event) {
    event.preventDefault();
    var lan = $('#landing'), log = $('#login');
    if (log) { log.hide(); }
    if (lan) { $('body').attr('style', lan.attr('data-body-style')); lan.show(); }
  });

  // Mostrar tela de login
  $('.logButton').on('click', function(event) {
    event.preventDefault();
    var lan = $('#landing'), log = $('#login');
    if (lan) { lan.hide(); }
    if (log) { $('body').attr('style', log.attr('data-body-style')); log.show(); }
  });

  // Exibir tela de login
  $('.sponsorLogin').on('click', function(event) {
    event.preventDefault();
    $('#employee-registration').hide();
    $('#vendor-registration').hide();
    $('#guest-registration').hide();
    $('#login').show();
  });

  // Exibir tela de registro de funcionário
  $('.sponsor-emp').on('click', function(event) {
    event.preventDefault();
    $('#login').hide();
    $('#vendor-registration').hide();
    $('#guest-registration').hide();
    $('#employee-registration').show();
  });

  // Exibir tela de registro de fornecedor
  $('.sponsor-vnd').on('click', function(event) {
    event.preventDefault();
    $('#login').hide();
    $('#employee-registration').hide();
    $('#guest-registration').hide();
    $('#vendor-registration').show();
  });

  // Exibir tela de registro de convidado
  $('.sponsor-gst').on('click', function(event) {
    event.preventDefault();
    $('#login').hide();
    $('#employee-registration').hide();
    $('#vendor-registration').hide();
    $('#guest-registration').show();
  });

  // Forçar redirecionamento de AP Captive Portal
  $('.tryButton').on('click', function(event) {
    event.preventDefault();
    location.href = "http://1.2.3.4"; // Força o redirecionamento
  });

  // Logout
  $('.outButton').on('click', function(event) {
    event.preventDefault();
    location.replace(getLogoutURL());
  });

  // Aceitar conexão
  $('.ancButton').on('click', function(event) {
    event.preventDefault();
    var form = $('<form method="POST"></form>'), urlParams = URLSearchToFormFields();
    form.prepend(urlParams.formItems);
    form.append(urlParams.hsServer); 
    form.append(urlParams.currTime); 
    form.append(urlParams.qv);
    form.append('<input name="f_register" type="hidden" value="Register">');
    var formAction = getFormAction('reg');
    form.attr('action', location.origin + '/guest/register/accept_connect' + location.search);
    form.attr('method', formAction.method);
    
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize()
    }).done(function(data) {
      $('.formError, .formSubmitStatus').text(data.message).show();
      if (data.macAuthRedirect) {
        setTimeout(function() {
          var macAuthForm = $('<form></form>');
          $(document.body).append(macAuthForm);
          var clientMac = $.urlParam('clientMac').replace(/-/g, '').toLowerCase();
          macAuthForm.append(URLSearchToFormFields());
          macAuthForm.append('<input type="hidden" name="username" value="' + clientMac + '">');
          macAuthForm.append('<input type="hidden" name="password" value="' + clientMac + '">');
          macAuthForm.append('<input type="hidden" name="Submit2" value="Submit">');
          macAuthForm.append('<input type="hidden" name="autherr" value="0">');
          macAuthForm.append('<input type="hidden" name="url" value="https://extremenetworks.com">');
          macAuthForm.append('<input type="hidden" name="ssid" value="' + $.urlParam('network') + '">');
          macAuthForm.attr('action', $.urlParam('redirecturl'));
          macAuthForm.attr('method', 'POST');
          macAuthForm.submit();
        }, 500);          
      }
    }).fail(function() {
      $('.formError, .formSubmitStatus').text('Erro no servidor. Tente novamente mais tarde').show();
    });
  });

  // Verificar se formulário de registro é válido
  function isRegFormValid(form) {
    var hasError = false;
    var EMAIL_REGEXP = /^[a-z0-9]+([.-_]?[a-z0-9]+)*@[a-z0-9-]+\.[a-z]{2,4}$/i;
    var MOBILE_REGEXP = /^[0-9]{6,16}$/;

    form.find('.formError, .error').text('').hide();

    form.find('.email-go').each(function(i, el) {
      var input = $(el).find('input');
      var error = $(el).find('.error');
      var value = input.val();
      error.hide();

      // Verificar se o email é válido
      if (value.length && !EMAIL_REGEXP.test(value)) {
        error.text("Endereço de e-mail inválido").show();
        hasError = true;
      }
    });

    form.find('.mobile-go').each(function(i, el) {
      var input = $(el).find('input');
      var error = $(el).find('.error');
      var value = input.val();
      error.hide();

      // Verificar se o número de telefone é válido
      if (value.length && !MOBILE_REGEXP.test(value)) {
        error.text("Número de telefone inválido").show();
        hasError = true;
      }
    });

    return !hasError;
  }

  // Função para validar o login
  function isRegFormValid(form) {
    var has_error = false;
    var EMAIL_REGEXP = /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    form.find('.formError, .error').text('').hide();
    form.find('.email-go').each(function(i, el){
      var input = $(el).find('input'), error = $(el).find('.error'), value = input.val();
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
      if ($(el).find('.redstar').text()=='*') {
        if (input.attr('type')=='email') {
          if (!EMAIL_REGEXP.test(value)) {
              error.text("Invalid e-mail address").show();
              has_error = true;
          }
        } else if (input.attr('type')=='mobile') {
          var MOBILE_REGEXP = /^([0-9]{6,14})$/;
          if (!MOBILE_REGEXP.test(value)) {
              error.text("Please enter a valid Mobile Number(only numbers).").show();
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


  // Função para obter parâmetros da URL
  $.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  }
});
