# Defina a pasta de destino
folder="projects/mapbiomas-raisg/public/collection5"

# Liste todos os assets na pasta
assets=$(earthengine ls $folder)

echo $assets

# Percorra a lista de assets e torne-os públicos
for asset in $assets
do
  earthengine acl set public $asset
done

# Confirme que todos os assets foram tornados públicos
echo "Todos os assets na pasta $folder foram tornados públicos."
