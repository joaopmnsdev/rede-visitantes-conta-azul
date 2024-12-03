$(function () {
  // Atualização de campos de validação (email e telefone)
  $('input[name=f_emailcheck], input[name=f_mobilecheck]').change(function () {
    var form = $(this).parents('form'),
      em_ck = form.find('input[name=f_emailcheck]'),
      mob_ck = form.find('input[name=f_mobilecheck]'),
      em_rs = form.find('label.email span.redstar'),
      mob_rs = form.find('label.mobile span.redstar'),
      email = form.find('input[name=f_email]'),
      mobile = form.find('input[name=f_mobile]');

    // Garantir que pelo menos um checkbox esteja marcado
    if (!em_ck.is(":checked") && !mob_ck.is(":checked")) {
      if ($(this).prop('name') == 'f_emailcheck') mob_ck.prop('checked', true);
      else em_ck.prop('checked', true);
    }

    // Atualizar os campos obrigatórios
    if (em_ck.is(":checked")) {
      em_rs.text("*");
      email.prop("required", true);
    } else {
      em_rs.text("");
      email.prop("required", false);
    }

    if (mob_ck.is(":checked")) {
      mob_rs.text("*");
      mobile.prop("required", true);
    } else {
      mob_rs.text("");
      mobile.prop("required", false);
    }
  });

  // Botões de navegação
  $('.regButton').on('click', function (event) {
    event.preventDefault();
    toggleView('#landing', '#login');
  });

  $('.logButton').on('click', function (event) {
    event.preventDefault();
    toggleView('#login', '#landing');
  });

  $('.sponsorLogin').on('click', function (event) {
    event.preventDefault();
    toggleView('#login', ['#employee-registration', '#vendor-registration', '#guest-registration']);
  });

  $('.sponsor-emp').on('click', function (event) {
    event.preventDefault();
    toggleView('#employee-registration', ['#login', '#vendor-registration', '#guest-registration']);
  });

  $('.sponsor-vnd').on('click', function (event) {
    event.preventDefault();
    toggleView('#vendor-registration', ['#login', '#employee-registration', '#guest-registration']);
  });

  $('.sponsor-gst').on('click', function (event) {
    event.preventDefault();
    toggleView('#guest-registration', ['#login', '#employee-registration', '#vendor-registration']);
  });

  $('.tryButton').on('click', function (event) {
    event.preventDefault();
    location.href = "http://1.2.3.4"; // Redirecionar para o Captive Portal
  });

  $('.outButton').on('click', function (event) {
    event.preventDefault();
    location.replace(getLogoutURL());
  });

  // Função genérica para alternar visibilidade de seções
  function toggleView(showSelector, hideSelectors) {
    if (!Array.isArray(hideSelectors)) hideSelectors = [hideSelectors];
    $(showSelector).show();
    hideSelectors.forEach(selector => $(selector).hide());
  }

  // Verificação de formulários
  function isRegFormValid(form) {
    var hasError = false;
    var EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.find('.formError, .error').text('').hide();

    // Validação de campos
    form.find('.form-group').each(function () {
      var input = $(this).find('input'),
        error = $(this).find('.error'),
        value = input.val();

      if ($(this).find('.redstar').text() === '*' && value === '') {
        error.text(input.data('error-message')).show();
        hasError = true;
      } else if (input.attr('type') === 'email' && !EMAIL_REGEXP.test(value)) {
        error.text("Endereço de email inválido").show();
        hasError = true;
      }
    });

    return !hasError;
  }

  $('form.registrationForm a.submit').on('click', function (event) {
    event.preventDefault();
    var form = $(this).parents('form');

    if (!isRegFormValid(form)) return;

    // Processar submissão AJAX do formulário de registro
    var formData = form.serialize();
    $.ajax({
      type: "POST",
      url: form.attr('action'),
      data: formData
    })
      .done(function (data) {
        form.find('.formError, .formSubmitStatus').text(data.message || "Registro bem-sucedido!").show();
      })
      .fail(function () {
        form.find('.formError, .formSubmitStatus').text("Erro no servidor. Tente novamente mais tarde.").show();
      });
  });

  $('form.loginForm a.submit').on('click', function (event) {
    event.preventDefault();
    var form = $(this).parents('form'),
      formError = form.find('.formError');

    // Submissão AJAX do formulário de login
    $.ajax({
      type: "POST",
      url: form.attr('action'),
      data: form.serialize()
    })
      .done(function (data) {
        if (data.success) {
          // Redirecionar ou exibir mensagem de sucesso
          location.replace(data.redirectUrl || "/home");
        } else {
          formError.text(data.message).show();
        }
      })
      .fail(function () {
        formError.text("Erro no servidor. Tente novamente mais tarde.").show();
      });
  });

  // Resetar mensagens de erro ao resetar formulário
  $('form').on('reset', function () {
    $(this).find('.formError, .error').text('').hide();
  });
});

// Lógica para leitura de OTP (One-Time Password) se disponível
if ("OTPCredential" in window) {
  window.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector('input[id="f_pass_id"]');
    if (!input) return;

    const ac = new AbortController();

    navigator.credentials
      .get({
        otp: { transport: ["sms"] },
        signal: ac.signal,
      })
      .then(otp => {
        input.value = otp.code;
      })
      .catch(console.error);
  });
}
