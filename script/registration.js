$(function () {
  // Função para alterar o estado dos campos de email e mobile
  $('input[name=f_emailcheck], input[name=f_mobilecheck]').change(function () {
    var form = $(this).parents('form'),
      em_ck = form.find('input[name=f_emailcheck]'),
      mob_ck = form.find('input[name=f_mobilecheck]'),
      em_rs = form.find('label.email span.redstar'),
      mob_rs = form.find('label.mobile span.redstar'),
      email = form.find('input[name=f_email]'),
      mobile = form.find('input[name=f_mobile]');

    // Verifica se nenhum dos campos está marcado e marca o outro
    if (!em_ck.is(":checked") && !mob_ck.is(":checked")) {
      if ($(this).prop('name') === 'f_emailcheck') mob_ck.prop('checked', true);
      else em_ck.prop('checked', true);
    }

    // Marca o campo como obrigatório com base no estado do checkbox
    if (em_ck.is(":checked")) {
      em_rs.text("*");
      email.prop("required", true);
    } else {
      em_rs.text("");
      email.removeProp("required");
    }

    if (mob_ck.is(":checked")) {
      mob_rs.text("*");
      mobile.prop("required", true);
    } else {
      mob_rs.text("");
      mobile.removeProp("required");
    }
  });

  // Função para alternar entre as telas de login e cadastro
  $('.regButton').on('click', function (event) {
    event.preventDefault();
    toggleVisibility('landing', 'login');
  });

  $('.logButton').on('click', function (event) {
    event.preventDefault();
    toggleVisibility('login', 'landing');
  });

  // Funções para alternar entre os formulários de tipo de registro
  $('.sponsorLogin').on('click', function (event) {
    event.preventDefault();
    toggleVisibility('login');
  });

  $('.sponsor-emp').on('click', function (event) {
    event.preventDefault();
    toggleVisibility('employee-registration');
  });

  $('.sponsor-vnd').on('click', function (event) {
    event.preventDefault();
    toggleVisibility('vendor-registration');
  });

  $('.sponsor-gst').on('click', function (event) {
    event.preventDefault();
    toggleVisibility('guest-registration');
  });

  // Função para a tentativa de conexão
  $('.tryButton').on('click', function (event) {
    event.preventDefault();
    location.href = "http://1.2.3.4"; // Força a redireção do portal cativo
  });

  // Função para logout
  $('.outButton').on('click', function (event) {
    event.preventDefault();
    location.replace(getLogoutURL());
  });

  // Função para enviar o formulário de conexão
  $('.ancButton').on('click', function (event) {
    event.preventDefault();
    submitForm('/guest/register/accept_connect');
  });

  // Função para aceitar o termo e fazer a conexão
  $('.cntButton').on('click', function (event) {
    event.preventDefault();
    submitForm('/guest/register/accept_connect', 'acknowledgement');
  });

  // Função para submeter o formulário de login
  $('form.loginForm a.submit').on('click', function (event) {
    event.preventDefault();
    submitLoginForm();
  });

  // Função para lidar com o "Esqueci a senha"
  $('form.loginForm a.forgot').on('click', function (event) {
    event.preventDefault();
    handleForgotPassword();
  });

  // Função para resetar o formulário
  $('form').on('reset', function () {
    $(this).find('.formError, .error').text('').hide();
  });

  // Função para redirecionar para as redes sociais
  $('.social-buttons').on('click', function (event) {
    event.preventDefault();
    var social = $(this).data('connect');
    social = social === 'facebook_checkin' ? 'facebook&checkin' : social;
    redirectTo(social);
  });

  // Função para validar o formulário de registro
  $('form.registrationForm a.submit').on('click', function (event) {
    event.preventDefault();
    if (!isRegFormValid($(this).parents('form'))) return false;
    submitRegistrationForm();
  });

  // Função para alternar a visibilidade dos elementos
  function toggleVisibility(visibleElement, hiddenElement) {
    var visible = $('#' + visibleElement),
      hidden = $('#' + hiddenElement);

    if (hidden) {
      hidden.hide();
    }
    if (visible) {
      $('body').attr('style', visible.attr('data-body-style'));
      visible.show();
    }
  }

  // Função para validar o formulário de registro
  function isRegFormValid(form) {
    var hasError = false;
    var EMAIL_REGEXP = /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    form.find('.formError, .error').text('').hide();
    form.find('.email-go').each(function (i, el) {
      var input = $(el).find('input'),
        error = $(el).find('.error'),
        value = input.val();
      error.hide();
      if (value.length && !EMAIL_REGEXP.test(value)) {
        error.text("Invalid e-mail address").show();
        hasError = true;
      }
    });

    form.find('.form-group').each(function (i, el) {
      var input = $(el).find('input'),
        error = $(el).find('.error'),
        value = input.val();

      if ($(el).find('.redstar').text() === '*') {
        if (input.attr('type') === 'email' && !EMAIL_REGEXP.test(value)) {
          error.text("Invalid e-mail address").show();
          hasError = true;
        }
      }
    });

    return !hasError;
  }
});
