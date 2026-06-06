#!/bin/bash
echo "Aplicando rebase como padrão..."

git config pull.rebase true

echo "Puxando alterações do Github novamente..."

git pull origin main