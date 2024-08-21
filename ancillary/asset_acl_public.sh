# Defina a pasta de destino
folder="projects/mapbiomas-chile/assets/ANCILLARY_DATA/STATISTICS/COLLECTION1/VERSION-1"

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
