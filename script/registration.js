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
        if ($(this).prop('name') == 'f_emailcheck') mob_ck.prop('checked', true);
        else em_ck.prop('checked', true);
      }
  
      // Marca o campo como obrigatório com base no estado do checkbox
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
      social = social == 'facebook_checkin' ? 'facebook&checkin' : social;
      redirectTo(social);
    });
  
    // Função para validar o formulário de registro
    $('form.registrationForm a.submit').on('click', function (event) {
      event.preventDefault();
      if (!isRegFormValid($(this).parents('form'))) return false;
      submitRegistrationForm();
    });
  
    // Função para validar o formulário de login
    function submitForm(actionUrl, hiddenValue) {
      var form = $('<form method="POST"></form>'),
          urlParams = URLSearchToFormFields();
      form.prepend(urlParams.formItems);
      
      // Adiciona o valor oculto se necessário
      if (hiddenValue) {
        $('<input name="f_agree">').val(hiddenValue).appendTo(form);
      }
      
      form.append(urlParams.hsServer);
      form.append(urlParams.currTime);
      form.append(urlParams.qv);
      
      var formAction = getFormAction('log');
      form.attr('action', location.origin + actionUrl + location.search);
      form.attr('method', formAction.method);
      
      $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize()
      }).done(function (data) {
        handleFormSubmissionResponse(data);
      }).fail(function () {
        $('.formError, .formSubmitStatus').text('Server Error. Please try after sometime').show();
      });
    }
  
    // Função para processar a resposta do formulário
    function handleFormSubmissionResponse(data) {
      $('.formError, .formSubmitStatus').text(data.message).show();
      if (data.macAuthRedirect) {
        setTimeout(function () {
          submitMacAuthForm();
        }, 500);
      }
    }
  
    // Função para submeter o formulário de autenticação MAC
    function submitMacAuthForm() {
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
    }
  
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
      var EMAIL_REGEXP = /[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/g;
  
      form.find('.formError, .error').text('').hide();
      form.find('.email-go').each(function (i, el) {
        var input = $(el).find('input'),
            error = $(el).find('.error'),
            value = input.val();
        input.val(value.toLowerCase());
        error.hide();
        if (value.length && !EMAIL_REGEXP.test(value)) {
          error.text("Invalid e-mail address").show();
          hasError = true;
        }
      });
  
      // Validação adicional de campos
      form.find('.form-group').each(function (i, el) {
        var input = $(el).find('input'),
            error = $(el).find('.error'),
            value = input.val();
  
        if ($(el).find('.redstar').text() == '') { // Validação do patrocinador
          validateSponsorEmail(value, error, hasError);
        }
  
        if ($(el).find('.redstar').text() == '*') {
          validateInputFields(value, error, input, hasError);
        }
      });
  
      // Validação do termo de aceitação
      if (form.find('input[name=f_disclaimer]').length && !form.find('input[name=f_disclaimer]').is(':checked')) {
        form.find('.disclaimer.error').text(form.find('input[name=f_disclaimer]').data('error-message')).show();
        hasError = true;
      }
      
      return !hasError;
    }
  
    // Função para validar o email do patrocinador
    function validateSponsorEmail(value, error, hasError) {
      var regExpSponsor = /^[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[a-z0-9])?/;
      if (value && !regExpSponsor.test(value)) {
        error.text("Invalid e-mail address").show();
        hasError = true;
      }
    }
  
    // Função para validar os campos do formulário
    function validateInputFields(value, error, input, hasError) {
      if (value.length && input.attr('type') == 'password' && value.length < 8) {
        error.text("Minimum 8 characters").show();
        hasError = true;
      }
  
      if (value.length && input.attr('type') == 'text' && value.length < 3) {
        error.text("Minimum 3 characters").show();
        hasError = true;
      }
    }
  });
  