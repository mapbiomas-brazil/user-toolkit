#!/bin/bash

# Autenticação
# earthengine authenticate

# Caminho da pasta
folder_path="projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1"

# Lista de ativos na pasta
asset_list=$(earthengine ls $folder_path)
echo $asset_list
# Torna cada ativo público
while read -r asset; do
  echo "Tornando público: $asset"
  earthengine acl set public $asset
done <<< "$asset_list"

echo "Todos os ativos em $folder_path foram tornados públicos."
