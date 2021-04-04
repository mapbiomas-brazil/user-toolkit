<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis minScale="1e+08" styleCategories="AllStyleCategories" hasScaleBasedVisibilityFlag="0" maxScale="0" version="3.6.2-Noosa">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
  </flags>
  <customproperties>
    <property value="false" key="WMSBackgroundLayer"/>
    <property value="false" key="WMSPublishDataSourceUrl"/>
    <property value="0" key="embeddedWidgets/count"/>
    <property value="Value" key="identify/format"/>
  </customproperties>
  <pipe>
    <rasterrenderer band="1" alphaBand="-1" opacity="1" type="paletted">
      <rasterTransparency/>
      <minMaxOrigin>
        <limits>None</limits>
        <extent>WholeRaster</extent>
        <statAccuracy>Estimated</statAccuracy>
        <cumulativeCutLower>0.02</cumulativeCutLower>
        <cumulativeCutUpper>0.98</cumulativeCutUpper>
        <stdDevFactor>2</stdDevFactor>
      </minMaxOrigin>
      <colorPalette>
        <paletteEntry label="3 - Formação Florestal" color="#274e13" value="3" alpha="255"/>
        <paletteEntry label="4 - Formação Savânica" color="#32cd32" value="4" alpha="255"/>
        <paletteEntry label="5 - Mangue" color="#687537" value="5" alpha="255"/>
        <paletteEntry label="9 - Floresta Plantada" color="#935132" value="9" alpha="255"/>
        <paletteEntry label="11 - Área Úmida não Florestal" color="#45c2a5" value="11" alpha="255"/>
        <paletteEntry label="12 - Formação Campestre" color="#b8af4f" value="12" alpha="255"/>
        <paletteEntry label="13 - Outra Formação Natural não Florestal" color="#bdb76b" value="13" alpha="255"/>
        <paletteEntry label="15 - Pastagem" color="#ffd966" value="15" alpha="255"/>
        <paletteEntry label="18 - Agricultura" color="#e974ed" value="18" alpha="255"/>
        <paletteEntry label="19 - Cultura Anual e Perene" color="#d5a6bd" value="19" alpha="255"/>
        <paletteEntry label="20 - Cultura Semi-Perene" color="#c27ba0" value="20" alpha="255"/>
        <paletteEntry label="21 - Mosaico de Agricultura e Pastagem" color="#ffefc3" value="21" alpha="255"/>
        <paletteEntry label="23 - Praia e Duna" color="#dd7e6b" value="23" alpha="255"/>
        <paletteEntry label="24 - Infraestrutura Urbana" color="#af2a2a" value="24" alpha="255"/>
        <paletteEntry label="25 - Outra Área não Vegetada" color="#ff99ff" value="25" alpha="255"/>
        <paletteEntry label="27 - Não observado" color="#d5d5e5" value="27" alpha="255"/>
        <paletteEntry label="29 - Afloramento Rochoso" color="#ff8c00" value="29" alpha="255"/>
        <paletteEntry label="30 - Mineração" color="#8a2be2" value="30" alpha="255"/>
        <paletteEntry label="31 - Aquicultura" color="#29eee4" value="31" alpha="255"/>
        <paletteEntry label="33 - Rio, Lago e Oceano" color="#0000ff" value="33" alpha="255"/>
        <paletteEntry label="32 - Apicum" color="#968c46" value="32" alpha="255"/>
        <paletteEntry label="34 - Glacias" color="#968c46" value="34" alpha="255"/>
      </colorPalette>
      <colorramp name="[source]" type="randomcolors"/>
    </rasterrenderer>
    <brightnesscontrast contrast="0" brightness="0"/>
    <huesaturation saturation="0" colorizeStrength="100" colorizeOn="0" colorizeGreen="128" colorizeRed="255" grayscaleMode="0" colorizeBlue="128"/>
    <rasterresampler maxOversampling="2"/>
  </pipe>
  <blendMode>0</blendMode>
</qgis>
