#!/usr/bin/env bash

echo "Script de permissão para outros shell-helpers..."

if [ "$EUID" -ne 0 ]; then
    echo "Desculpe, mas para esta ferramenta funcionar é preciso permissão de Sudo."
    exit 1
fi

shell_helpers=(
    "recuperar_github_com_divergencias.sh"
    "iniciar_sv.sh"
    "permissao_helpers.sh"
)

chmod +x "${shell_helpers[@]}"

echo "Sucesso! Permissões aplicadas para todos os helpers."
exit 0