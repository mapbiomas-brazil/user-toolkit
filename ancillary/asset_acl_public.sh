# Defina a pasta de destino
folder="projects/mapbiomas-territories/assets/TERRITORIES/LULC/BRAZIL/COLLECTION9/WORKSPACE"

# Liste todos os assets na pasta
assets=$(earthengine ls $folder)

# Percorra a lista de assets e torne-os públicos
for asset in $assets
do
  echo $asset
  earthengine acl set public $asset
done

# Confirme que todos os assets foram tornados públicos
echo "Todos os assets na pasta $folder foram tornados públicos."
