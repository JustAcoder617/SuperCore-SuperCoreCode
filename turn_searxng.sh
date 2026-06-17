#!/bin/bash

CONTAINER_NAME="sp_searxng"

if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "[Status] O buscador está LIGADO. Desligando..."
    docker stop $CONTAINER_NAME
    echo "[Sucesso] Buscador desligado com sucesso."

elif [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    echo "[Status] O buscador está DESLIGADO. Ligando..."
    docker start $CONTAINER_NAME
    echo "[Sucesso] Buscador iniciado em http://localhost:8080"

else
    echo "[Status] Primeira execução. Baixando e criando o contêiner..."
    docker run -d \
    --name $CONTAINER_NAME \
    -p 8080:8080 \
    -e SEARXNG_SETTINGS="{\"search\":{\"formats\":[\"json\"]}}" \
    searxng/searxng
fi