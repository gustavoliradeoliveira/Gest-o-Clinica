/* main.js — Gestão Clínica */
'use strict';

$(function () {

    /* ── Auto-dismiss flash alerts ──────────────────────── */
    setTimeout(() => {
        $('.flash-alert').each(function () {
            $(this).fadeOut(400, function () { $(this).remove(); });
        });
    }, 5000);

    /* ── Confirmação de exclusão ─────────────────────────── */
    $(document).on('submit', '.form-delete', function (e) {
        const nome = $(this).data('nome') || 'este registro';
        if (!confirm(`Tem certeza que deseja excluir "${nome}"?\nEsta ação não pode ser desfeita.`)) {
            e.preventDefault();
        }
    });

    /* ── Marcar link ativo na sidebar ───────────────────── */
    const path = window.location.pathname.split('/')[1];
    $(`.sidebar-link[href="/${path}"]`).addClass('active');

    /* ── Toggle sidebar no mobile ───────────────────────── */
    $('#sidebarToggle').on('click', function () {
        $('.sidebar').toggleClass('open');
    });

    /* ── Máscara CPF ─────────────────────────────────────── */
    $('#cpf').on('input', function () {
        let v = $(this).val().replace(/\D/g, '').substring(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        $(this).val(v);
    });

    /* ── Máscara Telefone ────────────────────────────────── */
    $('#telefone').on('input', function () {
        let v = $(this).val().replace(/\D/g, '').substring(0, 11);
        if (v.length <= 10) {
            v = v.replace(/(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            v = v.replace(/(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{5})(\d)/, '$1-$2');
        }
        $(this).val(v);
    });

    /* ── Select All permissões ───────────────────────────── */
    $(document).on('change', '.check-all-row', function () {
        const row = $(this).closest('tr');
        row.find('input[type=checkbox]').not(this).prop('checked', this.checked);
    });

    $(document).on('change', '.check-all-col', function () {
        const col = $(this).index() + 1;
        $('tbody tr').each(function () {
            $(this).find(`td:nth-child(${col}) input[type=checkbox]`).prop('checked', this.checked);
        }.bind(this));
    });

});
