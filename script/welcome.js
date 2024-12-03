$(function() {
    // Lógica de checkbox para email e celular
    $('input[name=f_emailcheck], input[name=f_mobilecheck]').change(function() {
        var form = $(this).parents('form'),
            em_ck = form.find('input[name=f_emailcheck]'),
            mob_ck = form.find('input[name=f_mobilecheck]'),
            em_rs = form.find('label.email span.redstar'),
            mob_rs = form.find('label.mobile span.redstar'),
            email = form.find('input[name=f_email]'),
            mobile = form.find('input[name=f_mobile]');
        
        if (!em_ck.is(":checked") && !mob_ck.is(":checked")) {
            if ($(this).prop('name') == 'f_emailcheck') mob_ck.prop('checked', true);
            else em_ck.prop('checked', true);
        }
        
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

    // Funções para alternar entre telas
    $('.regButton').on('click', function(event) {
        event.preventDefault();
        location.replace(location.href.replace('welcome.html', 'registration.html'));
    });

    $('.logButton').on('click', function(event) {
        event.preventDefault();
        location.href = "http://1.2.3.4"; // Redirecionamento para o portal do AP
    });

    $('.tryButton').on('click', function(event) {
        event.preventDefault();
        location.href = "http://1.2.3.4"; // Redirecionamento para o portal do AP
    });

    $('.outButton').on('click', function(event) {
        event.preventDefault();
        location.replace(getLogoutURL());
    });

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
            $('.formError, .formSubmitStatus').text('Server Error. Please try after sometime').show();
        });
    });

    // Funções para validação e envio de formulários
    $('form.registrationForm a.submit').on('click', function(event) {
        event.preventDefault();
        if (!isRegFormValid($(this).parents('form'))) return false;
        var path = location.pathname.split('/'),
            form = $(this).parents('form'),
            urlParams = URLSearchToFormFields();
        
        if (form.find('.select_dob_day').val()) {
            var day = form.find('.select_dob_day').val(),
                month = form.find('.select_dob_month').val(),
                year = form.find('.select_dob_year').val();
            $('form.registrationForm input[name=f_dob]').remove();
            form.append('<input name="f_dob" type="hidden" value="' + year + '-' + month + '-' + day + '">');
        }
        
        $('form.registrationForm input[name=cpname]').remove();
        form.prepend(urlParams.formItems + '<input type="hidden" name="cpname" value="' + path[path.length - 2] + '">');
        $('form.registrationForm input[name=owner_id]').remove();
        form.prepend(urlParams.formItems + '<input type="hidden" name="owner_id" value="' + path[path.length - 3] + '">');
        
        form.append(urlParams.hsServer);
        form.append(urlParams.currTime);
        form.append(urlParams.qv);
        form.append('<input name="f_register" type="hidden" value="Register">');
        
        var formAction = getFormAction('reg');
        form.attr('action', location.origin + '/guest/register/register_user' + location.search);
        form.attr('method', formAction.method);
        
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize()
        }).done(function(data) {
            form.find('.formError, .formSubmitStatus').text(data.message).show();
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
            form.find('.formError, .formSubmitStatus').text('Server Error. Please try after sometime').show();
        });
    });

    // Função de validação do formulário de login
    $('form.loginForm a.submit').on('click', function(event) {
        event.preventDefault();
        var form = $(this).parents('form'),
            formError = form.find('.formError'),
            urlParams = URLSearchToFormFields();
        
        form.attr('action', location.origin + '/guest/register/deviceFingerPrint' + location.search);
        form.attr('method', 'POST');
        
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize()
        }).done(function(data) {
            if (data.success) {
                var username = $('#f_user_id').val();
                var password = $('#f_pass_id').val();
                var authForm = $('<form></form>');
                $(document.body).append(authForm);
                authForm.append(URLSearchToFormFields());
                authForm.append('<input type="hidden" name="username" value="' + username.toLowerCase() + '">');
                authForm.append('<input type="hidden" name="password" value="' + password + '">');
                authForm.append('<input type="hidden" name="Submit2" value="Submit">');
                authForm.append('<input type="hidden" name="autherr" value="0">');
                authForm.append('<input type="hidden" name="url" value="https://extremenetworks.com">');
                authForm.append('<input type="hidden" name="ssid" value="' + $.urlParam('network') + '">');
                authForm.attr('action', $.urlParam('redirecturl'));
                authForm.attr('method', 'POST');
                authForm.submit();
                return false;
            } else {
                formError.text(data.message).show();
            }
        });
    });

    // Função para tratar o esquecimento de senha
    $('form.loginForm a.forgot').on('click', function(event) {
        event.preventDefault();
        var form = $(this).parents('form');
        form.attr('action', location.origin + '/guest/register/recover_password');
        form.attr('method', 'POST');
        form.submit();
    });
});
