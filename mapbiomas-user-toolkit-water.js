/**
 * @name
 *      Mapbiomas User Toolkit Download
 * 
 * @description
 *      This is a support tool for mapbiomas data users.
 *  
 * @author
 *      João Siqueira
 *      contato@mapbiomas.org
 *
 * @version
 *    1.0.0 - First release
 *    1.1.0 - Brazil Collection 1.0
 *    1.2.0 - Brazil Collection 2.0
 *    1.3.0 - Amazon Collection 1.0
 *    1.4.0 - Bolvia Collection 1.0
 *          - Colombia Collection 1.0
 *          - Ecuador Collection 1.0
 *          - Peru Collection 1.0
 *          - Venezuela Collection 1.0
 * 
 * @see
 *      Get the MapBiomas exported data in your "Google Drive/MAPBIOMAS-EXPORT" folder
 *      Code and Tutorial - https://github.com/mapbiomas-brazil/user-toolkit
 */

var palettes = require('users/mapbiomas/modules:Palettes.js');
var logos = require('users/mapbiomas/modules:Logos.js');
var mapp = require('users/joaovsiqueira1/packages:Mapp.js');

/**
 * @description
 *    calculate area for mapbiomas map
 * 
 * @author
 *    João Siqueira
 * 
 */
var Area = {

    /**
     * Convert a complex obj to feature collection
     * @param obj 
     */
    convert2table: function (obj) {

        obj = ee.Dictionary(obj);

        var classesAndAreas = ee.List(obj.get('groups'));

        var tableRows = classesAndAreas.map(
            function (classAndArea) {
                classAndArea = ee.Dictionary(classAndArea);

                var classId = classAndArea.get('class');
                var area = classAndArea.get('sum');

                var tableColumns = ee.Feature(null)
                    .set('class', classId)
                    .set('area', area);

                return tableColumns;
            }
        );

        return ee.FeatureCollection(ee.List(tableRows));
    },

    /**
     * Calculate area crossing a cover map (deforestation, mapbiomas)
     * and a region map (states, biomes, municipalites)
     * @param image 
     * @param territory 
     * @param geometry
     * @param scale
     * @param factor
     */
    calculate: function (object) {

        var reducer = ee.Reducer.sum().group(1, 'class').group(1, 'territory');
        var pixelArea = ee.Image.pixelArea().divide(object.factor);

        var territotiesData = pixelArea.addBands(object.territory).addBands(object.image)
            .reduceRegion({
                reducer: reducer,
                geometry: object.geometry,
                scale: object.scale,
                maxPixels: 1e13
            });

        territotiesData = ee.List(territotiesData.get('groups'));
        // print(territotiesData);
        var areas = territotiesData.map(Area.convert2table);

        areas = ee.FeatureCollection(areas).flatten();

        return areas;
    }

};

/**
 * 
 */
var App = {

    options: {

        version: '1.4.0',


        logo: {
            // uri: 'gs://mapbiomas-public/mapbiomas-logos/mapbiomas-logo-horizontal.b64',
            uri: 'gs://mapbiomas-public/mapbiomas-logos/mapbiomas-agua-logo.b64',
            base64: null
        },

        statesNames: {
            'None': 'None',
            'Acre': '12',
            'Alagoas': '27',
            'Amazonas': '13',
            'Amapá': '16',
            'Bahia': '29',
            'Ceará': '23',
            'Distrito Federal': '53',
            'Espírito Santo': '32',
            'Goiás': '52',
            'Maranhão': '21',
            'Minas Gerais': '31',
            'Mato Grosso do Sul': '50',
            'Mato Grosso': '51',
            'Pará': '15',
            'Paraíba': '25',
            'Pernambuco': '26',
            'Piauí': '22',
            'Paraná': '41',
            'Rio de Janeiro': '33',
            'Rio Grande do Norte': '24',
            'Rondônia': '11',
            'Roraima': '14',
            'Rio Grande do Sul': '43',
            'Santa Catarina': '42',
            'Sergipe': '28',
            'São Paulo': '35',
            'Tocantins': '17'
        },

        tables: {
            'mapbiomas-brazil': [
                {
                    'label': 'atlantic_forest_law',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/atlantic_forest_law',
                },
                {
                    'label': 'biome',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/refined_biome',
                },
                {
                    'label': 'biosphere_reserves',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/biosphere_reserves',
                },
                {
                    'label': 'city',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/city',
                },
                {
                    'label': 'country',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/country',
                },
                {
                    'label': 'federal_conservation_units_integral_protection',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/federal_protected_area_integral_protection',
                },
                {
                    'label': 'federal_conservation_units_sustainable_use',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/federal_protected_area_sustainable_use',
                },
                {
                    'label': 'indigenous_land',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/indigenous_territories',
                },
                {
                    'label': 'legal_amazon',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/legal_amazon',
                },
                {
                    'label': 'pnrh_level_1_basin',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/pnrh_level_1_basin',
                },
                {
                    'label': 'pnrh_level_2_basin',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/pnrh_level_1_basin',
                },
                {
                    'label': 'quilombo',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/quilombos',
                },
                {
                    'label': 'semiarid',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/semiarid',
                },
                {
                    'label': 'settlement',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/settlements',
                },
                {
                    'label': 'state',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/state',
                },
                {
                    'label': 'state_protected_area_integral_protection',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/state_protected_area_integral_protection',
                },
                {
                    'label': 'state_protected_area_sustainable_use',
                    'value': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/state_protected_area_sustainable_use',
                },
            ],
            'mapbiomas-amazon': [
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/biomes',
                    'label': 'biome',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/biomes_per_country',
                    'label': 'biomes_per_country',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/city',
                    'label': 'city',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/country',
                    'label': 'country',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/drainage_basin_per_country',
                    'label': 'drainage_basin_per_country',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/drainage_basin_per_state',
                    'label': 'drainage_basin_per_state',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/dranaige_basin',
                    'label': 'dranaige_basin',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/federal_protected_areas',
                    'label': 'federal_protected_areas',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/indegenous_territories',
                    'label': 'indegenous_territories',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/raisg_limit',
                    'label': 'raisg_limit',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/state',
                    'label': 'state',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION5/V1/state_protected_areas',
                    'label': 'state_protected_areas',
                },
            ],
            'mapbiomas-chaco': [
                {
                    'value': 'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/bioma',
                    'label': 'biome'
                },
                {
                    'value': 'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/area-natural-protegida',
                    'label': 'natural protected area'
                },
                {
                    'value': 'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/nivel-politico-1',
                    'label': 'political level 1'
                },
                {
                    'value': 'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/nivel-politico-2',
                    'label': 'political level 2'
                },
                {
                    'value': 'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/pais',
                    'label': 'country'
                },
                {
                    'value': 'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/sitios-ramsar',
                    'label': 'ramsar site'
                },
            ],
            'mapbiomas-atlantic-forest': [
                {
                    'value': "projects/mapbiomas_af_trinacional/ANCILLARY_DATA/STATISTICS/COLLECTION2/atlantic_forest_limit",
                    'label': 'atlantic_forest_limit'
                },
                {
                    'value': "projects/mapbiomas_af_trinacional/ANCILLARY_DATA/STATISTICS/COLLECTION2/city",
                    'label': 'city'
                },
                {
                    'value': "projects/mapbiomas_af_trinacional/ANCILLARY_DATA/STATISTICS/COLLECTION2/country",
                    'label': 'country'
                },
                {
                    'value': "projects/mapbiomas_af_trinacional/ANCILLARY_DATA/STATISTICS/COLLECTION2/indigenous_land",
                    'label': 'indigenous_land'
                },
                {
                    'value': "projects/mapbiomas_af_trinacional/ANCILLARY_DATA/STATISTICS/COLLECTION2/international_protected_areas",
                    'label': 'international_protected_areas'
                },
                {
                    'value': "projects/mapbiomas_af_trinacional/ANCILLARY_DATA/STATISTICS/COLLECTION2/national_protected_areas",
                    'label': 'national_protected_areas'
                },
                {
                    'value': "projects/mapbiomas_af_trinacional/ANCILLARY_DATA/STATISTICS/COLLECTION2/level_2_drainage_basin",
                    'label': 'level_2_drainage_basin'
                },
                {
                    'value': "projects/mapbiomas_af_trinacional/ANCILLARY_DATA/STATISTICS/COLLECTION2/state",
                    'label': 'state'
                },
            ],
            'mapbiomas-pampa': [
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/countries',
                    'label': 'countries',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/departamento_municipio_enumeration',
                    'label': 'departamento_municipio_enumeration',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/indigenous_territories',
                    'label': 'indigenous_territories',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/pampa_limit',
                    'label': 'pampa_limit',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/phytogeography',
                    'label': 'phytogeography',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/protected_areas',
                    'label': 'protected_areas',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/quilombola_territories',
                    'label': 'quilombola_territories',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/state_departamento',
                    'label': 'state_departamento',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION3/watersheds',
                    'label': 'watersheds',
                },
            ],
            'mapbiomas-indonesia': [
                {
                    'label': 'coastal_line',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION2/VERSION-2/coastal_line'
                },
                {
                    'label': 'island_group',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION2/VERSION-2/island_group'
                },
                {
                    'label': 'district',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION2/VERSION-2/district'
                },
                {
                    'label': 'province',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION2/VERSION-2/province'
                },
                {
                    'label': 'sub_district',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION2/VERSION-2/sub_district'
                },
                {
                    'label': 'village',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION2/VERSION-2/village'
                },
            ],
            'mapbiomas-peru': [
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-1",
                    "label": "nivel-politico-1"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-2",
                    "label": "nivel-politico-2"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-3",
                    "label": "nivel-politico-3"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-4",
                    "label": "nivel-politico-4"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/bioma-pais",
                    "label": "bioma-pais"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-conservacion-privada",
                    "label": "area-conservacion-privada"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-conservacion-regional",
                    "label": "area-conservacion-regional"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-natural-protegida",
                    "label": "area-natural-protegida"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/comunidad-campesina-reconocida",
                    "label": "comunidad-campesina-reconocida"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/comunidad-campesina-titulada",
                    "label": "comunidad-campesina-titulada"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/comunidad-nativa-solicitud",
                    "label": "comunidad-nativa-solicitud"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/comunidad-nativa-titulada",
                    "label": "comunidad-nativa-titulada"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/ecozona",
                    "label": "ecozona"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/region-geografica",
                    "label": "region-geografica"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/reserva-indigena",
                    "label": "reserva-indigena"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/reserva-territorial",
                    "label": "reserva-territorial"
                },
                {
                    "value": "projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/unidad-hidrografica",
                    "label": "unidad-hidrografica"
                }

            ],
            'mapbiomas-bolivia': [
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-protegida-nacional',
                    'label': 'area-protegida-nacional'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-protegida-subnacional',
                    'label': 'area-protegida-subnacional'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/bioma-pais',
                    'label': 'bioma-pais'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/cuenca-hidrografica-nivel1',
                    'label': 'cuenca-hidrografica-nivel1'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/cuenca-hidrografica-nivel2',
                    'label': 'cuenca-hidrografica-nivel2'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/departamento',
                    'label': 'departamento'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/ecorregion',
                    'label': 'ecorregion'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/municipio',
                    'label': 'municipio'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/pais',
                    'label': 'pais'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/sitios-ramsar',
                    'label': 'sitios-ramsar'
                },
                {
                    'value': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/territorio-indigena-titulado',
                    'label': 'territorio-indigena-titulado'
                }
            ],
            'mapbiomas-colombia': [
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-1',
                    'label': 'nivel-politico-1'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-2',
                    'label': 'nivel-politico-2'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-3',
                    'label': 'nivel-politico-3'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/bioma-pais',
                    'label': 'bioma-pais'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/unidad-hidrografica',
                    'label': 'unidad-hidrografica'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/regiones-biogeograficas',
                    'label': 'regiones-biogeograficas'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/resguardo-indigena',
                    'label': 'resguardo-indigena'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-natural-protegida-nacional',
                    'label': 'area-natural-protegida-nacional'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-natural-protegida-departamental',
                    'label': 'area-natural-protegida-departamental'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/consejos-comunitarios',
                    'label': 'consejos-comunitarios'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/ramsar',
                    'label': 'ramsar'
                },
                {
                    'value': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/reservas-forestales-ley-segunda',
                    'label': 'reservas-forestales-ley-segunda'
                },
            ],
            'mapbiomas-venezuela': [
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/pais',
                    'label': 'pais'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/nivel_politico_1',
                    'label': 'nivel_politico_1'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/nivel_politico_2',
                    'label': 'nivel_politico_2'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/bioma',
                    'label': 'bioma'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/cuencas',
                    'label': 'cuencas'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/parque_nacional',
                    'label': 'parque_nacional'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/monumento_natural',
                    'label': 'monumento_natural'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/reserva_fauna_silvestre',
                    'label': 'reserva_fauna_silvestre'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/refugio_fauna_silvestre',
                    'label': 'refugio_fauna_silvestre'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/santuario_fauna_silvestre',
                    'label': 'santuario_fauna_silvestre'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/reserva_biosfera',
                    'label': 'reserva_biosfera'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/reserva_forestal',
                    'label': 'reserva_forestal'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/ti_reconocido',
                    'label': 'ti_reconocido'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/ti_en_proceso',
                    'label': 'ti_en_proceso'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/ramsar',
                    'label': 'ramsar'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/ecoregion',
                    'label': 'ecoregion'
                },
                {
                    'value': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/regiones_fisiograficas',
                    'label': 'regiones_fisiograficas'
                }

            ],
            'mapbiomas-uruguay': [
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/URUGUAY/COLLECTION1/areas_protegidas',
                    'label': 'areas_protegidas',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/URUGUAY/COLLECTION1/cuencas_nivel_1',
                    'label': 'cuencas_nivel_1',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/URUGUAY/COLLECTION1/cuencas_nivel_2',
                    'label': 'cuencas_nivel_2',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/URUGUAY/COLLECTION1/limite_uruguay',
                    'label': 'limite_uruguay',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/URUGUAY/COLLECTION1/nivel_politico_1',
                    'label': 'nivel_politico_1',
                },
                {
                    'value': 'projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/URUGUAY/COLLECTION1/regiones_uruguay',
                    'label': 'regiones_uruguay',
                },
            ],
            'mapbiomas-ecuador': [
                {
                    'label': 'area-conservacion-uso-sostenible',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/area-conservacion-uso-sostenible'
                },
                {
                    'label': 'bioma-pais',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/bioma-pais'
                },
                {
                    'label': 'bosques',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/bosques'
                },
                {
                    'label': 'corredores-conservacion',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/corredores-conservacion'
                },
                {
                    'label': 'demarcacion-hidrografica',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/demarcacion-hidrografica'
                },
                {
                    'label': 'departamentales',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/departamentales'
                },
                {
                    'label': 'ecosistemas',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/ecosistemas'
                },
                {
                    'label': 'nacionales',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/nacionales'
                },
                {
                    'label': 'nivel-politico-1',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/nivel-politico-1'
                },
                {
                    'label': 'nivel-politico-2',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/nivel-politico-2'
                },
                {
                    'label': 'nivel-politico-3',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/nivel-politico-3'
                },
                {
                    'label': 'nivel-politico-4',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/nivel-politico-4'
                },
                {
                    'label': 'patrimonio-forestal',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/patrimonio-forestal'
                },
                {
                    'label': 'proteccion-hidrica',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/proteccion-hidrica'
                },
                {
                    'label': 'ramsar',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/ramsar'
                },
                {
                    'label': 'recarga-hidrica',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/recarga-hidrica'
                },
                {
                    'label': 'region-geografica',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/region-geografica'
                },
                {
                    'label': 'reserva-biosfera',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/reserva-biosfera'
                },
                {
                    'label': 'reserva-marina',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/reserva-marina'
                },
                {
                    'label': 'socio-bosque',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/socio-bosque'
                },
                {
                    'label': 'tis',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/tis'
                },
                {
                    'label': 'unidad-biogeografica',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/unidad-biogeografica'
                },
                {
                    'label': 'unidad-hidrografica-1',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/unidad-hidrografica-1'
                },
                {
                    'label': 'unidad-hidrografica-2',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/unidad-hidrografica-2'
                },
                {
                    'label': 'unidad-hidrografica-3',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/unidad-hidrografica-3'
                },
                {
                    'label': 'unidad-hidrografica-4',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/unidad-hidrografica-4'
                },
                {
                    'label': 'zonas_proteccion_amazonica',
                    'value': 'projects/earthengine-legacy/assets/projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/zonas_proteccion_amazonica'
                }
            ],
            'mapbiomas-paraguay': [
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/nivel_politico_1",
                    "label": "Nível Político 1"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/nivel_politico_2",
                    "label": "Nível Político 2"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/nivel_politico_3",
                    "label": "Nível Político 3"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/regiones",
                    "label": "Regiões"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/ecorregiones_dinerstein",
                    "label": "Ecorregiões Dinerstein"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/ecorregiones_seam",
                    "label": "Ecorregiões SEAM"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/areas_silvestres_protegidas",
                    "label": "Áreas Silvestres Protegidas"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/reserva_de_la_biosfera",
                    "label": "Reserva da Biosfera"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/sitios_ramsar",
                    "label": "Sitios Ramsar"
                },
                {
                    "value": "projects/mapbiomas-chaco/MAPBIOMAS-PARAGUAY/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-1/comunidades_indigenas",
                    "label": "Comunidades Indígenas"
                }

            ],
        },

        collections: {
            'mapbiomas-brazil': {
                'collection-1.0': {
                    'assets': {
                        'annual_water_coverage': 'projects/mapbiomas-workspace/public/collection6/mapbiomas_water_collection1_annual_water_coverage_v2',
                        'water_frequency': 'projects/mapbiomas-workspace/public/collection6/mapbiomas_water_collection1_water_frequency_v1',
                        // 'cumulated_water_coverage': '',
                        // 'monthly_water_coverage': '',
                    },

                    'periods': {
                        'annual_water_coverage': [
                            '1985', '1986', '1987', '1988', '1989', '1990',
                            '1991', '1992', '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000', '2001', '2002',
                            '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014',
                            '2015', '2016', '2017', '2018', '2019', '2020'
                        ],
                        'water_frequency': [
                            '1985_2020'
                        ]
                        // 'cumulated_water_coverage': [
                        //     '2000', '2001', '2002', '2003',
                        //     '2004', '2005', '2006', '2007',
                        //     '2008', '2009', '2010', '2011',
                        //     '2012', '2013', '2014', '2015',
                        //     '2016', '2017', '2018', '2019'
                        // ],
                        // 'monthly_water_coverage': [
                        //     '1985', '1986', '1987', '1988', '1989', '1990',
                        //     '1991', '1992', '1993', '1994', '1995', '1996',
                        //     '1997', '1998', '1999', '2000', '2001', '2002',
                        //     '2003', '2004', '2005', '2006', '2007', '2008',
                        //     '2009', '2010', '2011', '2012', '2013', '2014',
                        //     '2015', '2016', '2017', '2018', '2019', '2020'
                        // ],
                    },
                },
                'collection-2.0': {
                    'assets': {
                        'annual_water_coverage': 'projects/mapbiomas-workspace/public/collection8/mapbiomas_water_collection2_annual_water_coverage_v1',
                        'water_frequency': 'projects/mapbiomas-workspace/public/collection8/mapbiomas_water_collection1_water_frequency_v1',
                        // 'cumulated_water_coverage': '',
                        // 'monthly_water_coverage': '',
                    },

                    'periods': {
                        'annual_water_coverage': [
                            '1985', '1986', '1987', '1988', '1989', '1990',
                            '1991', '1992', '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000', '2001', '2002',
                            '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014',
                            '2015', '2016', '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'water_frequency': [
                            '1985_2022'
                        ]
                        // 'cumulated_water_coverage': [
                        //     '2000', '2001', '2002', '2003',
                        //     '2004', '2005', '2006', '2007',
                        //     '2008', '2009', '2010', '2011',
                        //     '2012', '2013', '2014', '2015',
                        //     '2016', '2017', '2018', '2019'
                        // ],
                        // 'monthly_water_coverage': [
                        //     '1985', '1986', '1987', '1988', '1989', '1990',
                        //     '1991', '1992', '1993', '1994', '1995', '1996',
                        //     '1997', '1998', '1999', '2000', '2001', '2002',
                        //     '2003', '2004', '2005', '2006', '2007', '2008',
                        //     '2009', '2010', '2011', '2012', '2013', '2014',
                        //     '2015', '2016', '2017', '2018', '2019', '2020'
                        // ],
                    },
                },
            },
            'mapbiomas-amazon': {
                'collection-1.0': {
                    'assets': {
                        'annual_water_coverage': 'projects/mapbiomas-raisg/public/collection5/mapbiomas_raisg_panamazonia_collection1_annual_water_coverage_v2',
                        'water_frequency': 'projects/mapbiomas-raisg/public/collection5/mapbiomas_raisg_panamazonia_collection1_water_frequency_v2',
                        // 'cumulated_water_coverage': '',
                        // 'monthly_water_coverage': '',
                    },

                    'periods': {
                        'annual_water_coverage': [
                            // '1985', '1986', '1987', '1988', '1989', '1990',
                            // '1991', '1992', '1993', '1994', '1995', '1996',
                            // '1997', '1998', '1999',
                            '2000', '2001', '2002',
                            '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014',
                            '2015', '2016', '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'water_frequency': [
                            // '1985_2022'
                            '2000_2022'
                        ]
                        // 'cumulated_water_coverage': [
                        // ],
                        // 'monthly_water_coverage': [
                        // ],
                    },
                },
            },
            'mapbiomas-venezuela': {
                'collection-1.0': {
                    'assets': {
                        'annual_water_coverage': 'projects/mapbiomas-public/assets/venezuela/collection1/mapbiomas_venezuela_collection1_water_v1',
                        'water_frequency': 'projects/mapbiomas-public/assets/venezuela/collection1/mapbiomas_venezuela_collection1_water_frequency_v1',
                        // 'cumulated_water_coverage': '',
                        // 'monthly_water_coverage': '',
                    },

                    'periods': {
                        'annual_water_coverage': [
                            '1985', '1986', '1987', '1988', '1989', '1990',
                            '1991', '1992', '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000', '2001', '2002',
                            '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014',
                            '2015', '2016', '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'water_frequency': [
                            '1985_2022'
                            // '2000_2022'
                        ]
                        // 'cumulated_water_coverage': [
                        // ],
                        // 'monthly_water_coverage': [
                        // ],
                    },
                },
            },
            'mapbiomas-bolivia': {
                'collection-1.0': {
                    'assets': {
                        'annual_water_coverage': 'projects/mapbiomas-public/assets/bolivia/collection1/mapbiomas_bolivia_collection1_water_v1',
                        'water_frequency': 'projects/mapbiomas-public/assets/bolivia/collection1/mapbiomas_bolivia_collection1_water_frequency_v1',
                        // 'cumulated_water_coverage': '',
                        // 'monthly_water_coverage': '',
                    },

                    'periods': {
                        'annual_water_coverage': [
                            '1985', '1986', '1987', '1988', '1989', '1990',
                            '1991', '1992', '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000', '2001', '2002',
                            '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014',
                            '2015', '2016', '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'water_frequency': [
                            '1985_2022'
                            // '2000_2022'
                        ]
                        // 'cumulated_water_coverage': [
                        // ],
                        // 'monthly_water_coverage': [
                        // ],
                    },
                },
            },
            'mapbiomas-peru': {
                'collection-1.0': {
                    'assets': {
                        'annual_water_coverage': 'projects/mapbiomas-public/assets/peru/collection1/mapbiomas_peru_collection1_water_v1',
                        'water_frequency': 'projects/mapbiomas-public/assets/peru/collection1/mapbiomas_peru_collection1_water_frequency_v1',
                        // 'cumulated_water_coverage': '',
                        // 'monthly_water_coverage': '',
                    },

                    'periods': {
                        'annual_water_coverage': [
                            '1985', '1986', '1987', '1988', '1989', '1990',
                            '1991', '1992', '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000', '2001', '2002',
                            '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014',
                            '2015', '2016', '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'water_frequency': [
                            '1985_2022'
                            // '2000_2022'
                        ]
                        // 'cumulated_water_coverage': [
                        // ],
                        // 'monthly_water_coverage': [
                        // ],
                    },
                },
            },
            'mapbiomas-colombia': {
                'collection-1.0': {
                    'assets': {
                        'annual_water_coverage': 'projects/mapbiomas-public/assets/colombia/collection1/mapbiomas_colombia_collection1_water_v1',
                        'water_frequency': 'projects/mapbiomas-public/assets/colombia/collection1/mapbiomas_colombia_collection1_water_frequency_v1',
                        // 'cumulated_water_coverage': '',
                        // 'monthly_water_coverage': '',
                    },

                    'periods': {
                        'annual_water_coverage': [
                            '1985', '1986', '1987', '1988', '1989', '1990',
                            '1991', '1992', '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000', '2001', '2002',
                            '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014',
                            '2015', '2016', '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'water_frequency': [
                            '1985_2022'
                            // '2000_2022'
                        ]
                        // 'cumulated_water_coverage': [
                        // ],
                        // 'monthly_water_coverage': [
                        // ],
                    },
                },
            },
            'mapbiomas-ecuador': {
                'collection-1.0': {
                    'assets': {
                        'annual_water_coverage': 'projects/mapbiomas-public/assets/ecuador/collection1/mapbiomas_ecuador_collection1_water_v1',
                        'water_frequency': 'projects/mapbiomas-public/assets/ecuador/collection1/mapbiomas_ecuador_collection1_water_frequency_v1',
                        // 'cumulated_water_coverage': '',
                        // 'monthly_water_coverage': '',
                    },

                    'periods': {
                        'annual_water_coverage': [
                            '1985', '1986', '1987', '1988', '1989', '1990',
                            '1991', '1992', '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000', '2001', '2002',
                            '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014',
                            '2015', '2016', '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'water_frequency': [
                            // '1985_2022'
                            '2000_2022'
                        ]
                        // 'cumulated_water_coverage': [
                        // ],
                        // 'monthly_water_coverage': [
                        // ],
                    },
                },
            },
        },

        bandsNames: {
            'annual_water_coverage': 'annual_water_coverage_',
            'water_frequency': 'water_frequency_',
            // 'cumulated_water_coverage': 'water_coverage_',
            // 'monthly_water_coverage': 'water_coverage_',
        },

        dataType: 'annual_water_coverage',

        data: {
            'annual_water_coverage': null,
            'water_frequency': null,
            // 'cumulated_water_coverage': null,
            // 'monthly_water_coverage': null,
        },

        fileDimensions: {
            'annual_water_coverage': 256 * 124,
            'water_frequency': 256 * 124,
            // 'cumulated_water_coverage': 256 * 124,
            // 'monthly_water_coverage': 256 * 124,

        },

        ranges: {
            'annual_water_coverage': {
                'min': 0,
                'max': 1
            },
            'water_frequency': {
                'min': 1,
                'max': 36
            },
            // 'cumulated_water_coverage': {
            //     'min': 0,
            //     'max': 1
            // },
            // 'monthly_water_coverage': {
            //     'min': 1,
            //     'max': 12
            // },
        },

        vector: null,
        activeFeature: null,
        activeName: '',

        palette: {
            'annual_water_coverage': [
                '#ffffff',
                '#0101c1'
            ],
            'water_frequency': [
                '#e5e5ff',
                '#ccccff',
                '#b2b2ff',
                '#9999ff',
                '#7f7fff',
                '#6666ff',
                '#4c4cff',
                '#3232ff',
                '#1919ff',
                '#0000ff',
            ],

            // 'monthly_water_coverage': [
            //     '#a900ff',
            //     '#6f02ff',
            //     '#020aff',
            //     '#0675ff',
            //     '#06ffff',
            //     '#ffee00',
            //     '#ff7700',
            //     '#ff0800',
            //     '#c20202',
            //     '#0aa602',
            //     '#0cff00'
            // ],
        },

        taskid: 1,

        bufferDistance: 0,

        className: {
            1: "Forest",
            2: "Natural Forest",
            3: "Forest Formation",
            4: "Savanna Formation",
            5: "Magrove",
            6: "Áreas Naturales Inundables - Leñosas (Bosque Inundable)",
            9: "Forest Plantation",
            10: "Non Forest Natural Formation",
            11: "Wetland",
            12: "Grassland (Pastizal, Formación Herbácea)",
            32: "Salt flat",
            29: "Rocky outcrop",
            13: "Other Non Forest Natural Formation",
            14: "Farming",
            15: "Pasture",
            18: "Agriculture",
            19: "Temporary Crops (Herbaceas - Agricultura)",
            39: "Soy Beans",
            20: "Sugar Cane",
            40: "Rice",
            41: "Mosaic of Crops",

            42: "Pastizal abierto", // Only for Chaco
            43: "Pastizal cerrado", // Only for Chaco
            44: "Pastizal disperso", // Only for Chaco
            45: "Leñosas dispersas", // Only for Chaco

            36: "Perennial Crops",
            21: "Mosaic of Agriculture and Pasture",
            22: "Non vegetated area",
            24: "Urban Infrastructure",
            30: "Mining",
            23: "Beach and Dune",
            25: "Other Non Vegetated Area",
            26: "Water",
            33: "River, Lake and Ocean",
            37: "Artificial Water Body",
            38: "Water Reservoirs",
            31: "Aquaculture",
            27: "Non Observed",
            0: "Non Observed",
        },
    },

    init: function () {

        this.ui.init();

    },

    setVersion: function () {

        App.ui.form.labelTitle.setValue('MapBiomas User Toolkit ' + App.options.version);

    },

    startMap: function (year) {

        Map.centerObject(App.options.data.annual_water_coverage, 5);

        var imageLayer = ui.Map.Layer({
            'eeObject': App.options.data.annual_water_coverage,
            'visParams': {
                'bands': [App.options.bandsNames.annual_water_coverage + year],
                'palette': App.options.palette.annual_water_coverage,
                'min': App.options.ranges.annual_water_coverage.min,
                'max': App.options.ranges.annual_water_coverage.max,
                'format': 'png'
            },
            'name': year,
            'shown': true,
            'opacity': 1.0
        });

        Map.clear();

        Map.setOptions({
            'styles': {
                'Dark': mapp.getStyle('Dark')
            }
        });

        Map.add(imageLayer);

    },

    formatName: function (name) {

        var formated = name
            .toLowerCase()
            .replace(/á/g, 'a')
            .replace(/à/g, 'a')
            .replace(/â/g, 'a')
            .replace(/ã/g, 'a')
            .replace(/ä/g, 'a')
            .replace(/ª/g, 'a')
            .replace(/é/g, 'e')
            .replace(/ê/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ô/g, 'o')
            .replace(/õ/g, 'o')
            .replace(/ú/g, 'u')
            .replace(/û/g, 'u')
            .replace(/ũ/g, 'u')
            .replace(/ç/g, 'c')
            .replace(/ñ/g, 'n')
            .replace(/&/g, '')
            .replace(/@/g, '')
            .replace(/ /g, '')
            .replace(/["'()\/]/g, '');

        return formated;
    },

    ui: {

        init: function () {

            App.ui.form.init();

            Map.setOptions({
                'styles': {
                    'Dark': mapp.getStyle('Dark')
                }
            });
        },

        setMapbiomasRegion: function (regionName) {

            App.ui.loadCollectionList(regionName);
            App.ui.loadTablesNames(regionName);

        },

        setDataType: function (dataType) {

            App.options.dataType = dataType;

        },

        loadCollectionList: function (regionName) {

            App.ui.form.selectCollection.setPlaceholder('loading collections...');

            App.ui.form.selectCollection = ui.Select({
                'items': Object.keys(App.options.collections[regionName]).reverse(),
                'placeholder': 'select collection',
                'onChange': function (collectioName) {
                    ee.Number(1).evaluate(
                        function (a) {

                            App.options.data.annual_water_coverage = ee.Image(
                                App.options.collections[regionName][collectioName].assets.annual_water_coverage);

                            App.options.data.water_frequency = ee.Image(
                                App.options.collections[regionName][collectioName].assets.water_frequency);

                            var year = App.options.collections[regionName][collectioName].periods.annual_water_coverage.slice(-1)[0];

                            App.startMap(year);

                            App.ui.loadDataType();
                        }
                    );

                    App.ui.loadingBox();
                },
                'style': {
                    'stretch': 'horizontal'
                }
            });

            App.ui.form.panelCollection.widgets()
                .set(1, App.ui.form.selectCollection);

        },

        loadTablesNames: function (regionName) {

            App.ui.form.selectRegion.setPlaceholder('loading tables names...');

            var roots = ee.data.getAssetRoots()
                .map(
                    function (obj) {
                        return obj.id;
                    });

            var allTablesNames;

            /**
             * Skip the error msg if MAPBIOMAS folder is not found
             */
            try {
                var tablesNames = ee.data.getList({
                    'id': roots[0] + '/MAPBIOMAS'
                }).map(
                    function (obj) {
                        return obj.id;
                    });
                var allTablesNames = App.options.tables[regionName].concat(tablesNames);
            }
            catch (e) {
                var allTablesNames = App.options.tables[regionName];
            }

            App.ui.form.selectFeatureCollections = ui.Select({
                'items': allTablesNames,
                'placeholder': 'select table',
                'onChange': function (tableName) {
                    if (tableName != 'None') {
                        App.options.activeName = tableName;
                        App.ui.form.panelStates.remove(App.ui.form.labelStates);
                        App.ui.form.panelStates.remove(App.ui.form.selectStates);
                        ee.Number(1).evaluate(
                            function (a) {
                                var collectioName = App.ui.form.selectCollection.getValue();

                                App.ui.loadTable(tableName);

                                App.ui.makeLayersList(
                                    tableName.split('/').slice(-1)[0],
                                    App.options.activeFeature,
                                    App.options.collections[regionName][collectioName]
                                        .periods[App.options.dataType]
                                );

                                App.ui.loadPropertiesNames();

                                App.ui.form.selectDataType.setDisabled(false);
                            }
                        );

                        App.ui.loadingBox();
                    }
                },
                'style': {
                    'stretch': 'horizontal'
                }
            });

            App.ui.form.panelFeatureCollections.widgets()
                .set(1, App.ui.form.selectFeatureCollections);

        },

        loadTableStates: function (tableName) {

            var state = App.ui.form.selectStates.getValue();

            App.options.table = ee.FeatureCollection(tableName)
                .filterMetadata('UF', 'equals', parseInt(App.options.statesNames[state], 10));

            App.options.activeFeature = App.options.table;

            Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.setOptions({
                'styles': {
                    'Dark': mapp.getStyle('Dark')
                }
            });

            Map.addLayer(App.options.activeFeature.style({
                color: '#555500',
                width: 1,
                fillColor: '#ffff0011',
            }), {},
                tableName.split('/')[3],
                true);

        },

        loadTable: function (tableName) {

            App.options.table = ee.FeatureCollection(tableName);

            App.options.activeFeature = App.options.table;

            // Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.setOptions({
                'styles': {
                    'Dark': mapp.getStyle('Dark')
                }
            });

            Map.addLayer(App.options.activeFeature.style({
                color: '#555500',
                width: 1,
                fillColor: '#ffff0011',
            }), {},
                tableName.split('/')[3],
                true);

        },

        loadPropertiesNames: function () {

            App.ui.form.selectProperties.setPlaceholder('loading tables names...');

            ee.Feature(App.options.table.first())
                .propertyNames()
                .evaluate(
                    function (propertyNames) {

                        // print(propertyNames);

                        App.ui.form.selectProperties = ui.Select({
                            'items': propertyNames,
                            'placeholder': 'select property',
                            'onChange': function (propertyName) {
                                if (propertyName != 'None') {
                                    App.options.propertyName = propertyName;

                                    ee.Number(1).evaluate(
                                        function (a) {
                                            App.ui.loadFeatureNames(propertyName);
                                            App.ui.form.selectDataType.setDisabled(false);
                                        }
                                    );

                                }
                            },
                            'style': {
                                'stretch': 'horizontal'
                            }
                        });

                        App.ui.form.panelProperties.widgets()
                            .set(1, App.ui.form.selectProperties);
                    }
                );

        },

        loadFeatureNames: function () {

            App.ui.form.selectFeature.setPlaceholder('loading feature names...');

            App.options.table.sort(App.options.propertyName)
                .reduceColumns(ee.Reducer.toList(), [App.options.propertyName])
                .get('list')
                .evaluate(
                    function (featureNameList) {

                        App.ui.form.selectFeature = ui.Select({
                            'items': featureNameList,
                            'placeholder': 'select feature',
                            'onChange': function (featureName) {
                                if (featureName != 'None') {
                                    App.options.featureName = featureName;

                                    ee.Number(1).evaluate(
                                        function (a) {
                                            var regionName = App.ui.form.selectRegion.getValue();
                                            var collectionName = App.ui.form.selectCollection.getValue();

                                            App.ui.loadFeature(featureName);
                                            App.options.activeName = featureName;

                                            App.ui.makeLayersList(
                                                App.options.activeName,
                                                App.options.activeFeature,
                                                App.options.collections[regionName][collectionName]
                                                    .periods[App.options.dataType]);
                                            App.ui.form.selectDataType.setDisabled(false);
                                        }
                                    );

                                    App.ui.loadingBox();
                                }
                            },
                            'style': {
                                'stretch': 'horizontal'
                            }
                        });

                        App.ui.form.panelFeature.widgets()
                            .set(1, App.ui.form.selectFeature);
                    }
                );

        },

        loadDataType: function () {

            App.ui.form.selectDataType.setPlaceholder('loading data type list...');

            ee.Number(1).evaluate(
                function (number) {

                    var regionName = App.ui.form.selectRegion.getValue();
                    var collectionName = App.ui.form.selectCollection.getValue();

                    App.ui.form.selectDataType = ui.Select({
                        'items': Object.keys(App.options.collections[regionName][collectionName].periods),
                        'placeholder': 'select data type',
                        'onChange': function (dataType) {

                            App.ui.setDataType(dataType);

                            App.ui.makeLayersList(
                                App.options.activeName.split('/').slice(-1)[0],
                                App.options.activeFeature,
                                App.options.collections[regionName][collectionName].periods[dataType]);

                        },
                        'style': {
                            'stretch': 'horizontal'
                        }
                    });

                    App.ui.form.panelDataType.widgets()
                        .set(1, App.ui.form.selectDataType);
                }
            );

        },

        loadFeature: function (name) {

            App.options.activeFeature = App.options.table
                .filterMetadata(App.options.propertyName, 'equals', name);

            Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.setOptions({
                'styles': {
                    'Dark': mapp.getStyle('Dark')
                }
            });

            Map.addLayer(App.options.activeFeature.style({
                color: '#555500',
                width: 1,
                fillColor: '#ffff0011',
            }), {},
                name,
                true);

        },

        addImageLayer: function (period, label, region) {

            var image = App.options.data[App.options.dataType]
                .select([App.options.bandsNames[App.options.dataType] + period])
                .clip(region);

            var imageLayer = ui.Map.Layer({
                'eeObject': image,
                'visParams': {
                    'palette': App.options.palette[App.options.dataType],
                    'min': App.options.ranges[App.options.dataType].min,
                    'max': App.options.ranges[App.options.dataType].max,
                    'format': 'png'
                },
                'name': label,
                'shown': true,
                'opacity': 1.0
            });

            Map.layers().insert(
                Map.layers().length() - 1,
                imageLayer
            );

        },

        removeImageLayer: function (label) {

            for (var i = 0; i < Map.layers().length(); i++) {

                var layer = Map.layers().get(i);

                if (label === layer.get('name')) {
                    Map.remove(layer);
                }
            }

        },

        manageLayers: function (checked, period, label, region) {

            if (checked) {
                App.ui.addImageLayer(period, label, region);
            } else {
                App.ui.removeImageLayer(label);
            }

        },

        makeLayersList: function (regionName, region, periods) {
            // print(regionName, region, periods)
            App.ui.form.panelLayersList.clear();

            periods.forEach(

                function (period, index, array) {
                    App.ui.form.panelLayersList.add(
                        ui.Checkbox({
                            "label": regionName + ' ' + period,
                            "value": false,
                            "onChange": function (checked) {

                                App.ui.manageLayers(checked, period, regionName + ' ' + period, region);

                            },
                            "disabled": false,
                            "style": {
                                'padding': '2px',
                                'stretch': 'horizontal',
                                'backgroundColor': '#dddddd',
                                'fontSize': '12px'
                            }
                        })
                    );

                }
            );

        },

        loadingBox: function () {
            App.ui.form.loadingBox = ui.Panel();
            App.ui.form.loadingBox.add(ui.Label('Loading...'));

            Map.add(App.ui.form.loadingBox);
        },

        export2Drive: function () {

            var layers = App.ui.form.panelLayersList.widgets();

            var regionName = App.ui.form.selectRegion.getValue();
            var collectionName = App.ui.form.selectCollection.getValue();

            var featureName = App.formatName(App.ui.form.selectFeature.getValue() || '');

            var bandIds = [];

            for (var i = 0; i < layers.length(); i++) {

                var selected = layers.get(i).getValue();

                if (selected) {

                    var period = App.options.collections[regionName][collectionName]
                        .periods[App.options.dataType][i];

                    var fileName = [regionName, collectionName, featureName, period].join('-');

                    fileName = fileName.replace(/--/g, '-').replace(/--/g, '-').replace('.', '');
                    fileName = App.formatName(fileName);

                    var data = App.options.data[App.options.dataType]
                        .select([App.options.bandsNames[App.options.dataType] + period]);

                    var region = App.options.activeFeature.geometry();

                    if (App.options.bufferDistance !== 0) {
                        data = data.clip(App.options.activeFeature.geometry().buffer(App.options.bufferDistance));
                        region = region.buffer(App.options.bufferDistance);
                    } else {
                        data = data.clip(App.options.activeFeature.geometry());
                    }

                    region = region.bounds();

                    Export.image.toDrive({
                        image: data,
                        description: fileName,
                        folder: 'MAPBIOMAS-EXPORT',
                        fileNamePrefix: fileName,
                        region: region,
                        scale: 30,
                        maxPixels: 1e13,
                        fileFormat: 'GeoTIFF',
                        fileDimensions: App.options.fileDimensions[App.options.dataType],
                    });

                    bandIds.push(App.options.bandsNames[App.options.dataType] + period);
                }
            }

            // Export table
            var territory = ee.Image().paint({
                'featureCollection': ee.FeatureCollection(App.options.activeFeature),
                'color': 1
            });

            var geometry = App.options.activeFeature.geometry().bounds();

            var areas = bandIds.map(
                function (band) {

                    var image = App.options.data[App.options.dataType].select(band);

                    var area = Area.calculate({
                        "image": image,
                        "territory": territory,
                        "geometry": geometry,
                        "scale": 30,
                        "factor": 1000000,
                    });

                    area = ee.FeatureCollection(area).map(
                        function (feature) {
                            var className;

                            // className = ee.Dictionary(App.options.className)
                            //     .get(ee.Number(feature.get('class')));

                            className = ee.Number(feature.get('class'));

                            return feature.set('class_name', className).set('band', band);
                        }
                    );

                    return area;
                }
            );

            areas = ee.FeatureCollection(areas).flatten();
            // print(areas);

            var tableName = [regionName, collectionName, featureName, 'area'].join('-');

            tableName = tableName.replace(/--/g, '-').replace(/--/g, '-').replace('.', '');
            tableName = App.formatName(tableName);

            Export.table.toDrive({
                'collection': areas,
                'description': tableName,
                'folder': 'MAPBIOMAS-EXPORT',
                'fileNamePrefix': tableName,
                'fileFormat': 'CSV'
            });

        },

        showDisclaimer: function () {

            App.ui.form.panelDisclaimer.widgets().reset([]);
            App.ui.form.panelDisclaimerText.widgets().reset(App.ui.form.labelDisclaimer);
            App.ui.form.panelDisclaimer.add(App.ui.form.panelDisclaimerText);
            App.ui.form.panelDisclaimer.add(App.ui.form.buttonDisclaimerOk);

            Map.add(App.ui.form.panelDisclaimer);

            App.ui.form.buttonDisclaimerShow.setDisabled(true);
        },

        form: {

            init: function () {

                var blob = ee.Blob(App.options.logo.uri);

                blob.string().evaluate(
                    function (str) {
                        str = str.replace(/\n/g, '');
                        App.options.logo.base64 = ui.Label({
                            imageUrl: str,
                            style: {
                                // width: '300px'
                                stretch: 'both'
                            }
                        });
                        App.ui.form.panelLogo.add(App.options.logo.base64);
                    }
                );

                this.panelMain.add(this.panelLogo);
                this.panelMain.add(this.labelLink);

                this.panelRegion.add(this.labelRegion);
                this.panelRegion.add(this.selectRegion);

                this.panelCollection.add(this.labelCollection);
                this.panelCollection.add(this.selectCollection);

                this.panelFeatureCollections.add(this.labelTables);
                this.panelFeatureCollections.add(this.selectFeatureCollections);

                this.panelProperties.add(this.labelProperties);
                this.panelProperties.add(this.selectProperties);

                this.panelFeature.add(this.labelFeature);
                this.panelFeature.add(this.selectFeature);

                this.panelDataType.add(this.labelDataType);
                this.panelDataType.add(this.selectDataType);

                this.panelBuffer.add(this.labelBuffer);
                this.panelBuffer.add(this.selectBuffer);

                // this.panelMain.add(this.panelType);
                this.panelMain.add(this.panelRegion);
                this.panelMain.add(this.panelCollection);
                this.panelMain.add(this.panelFeatureCollections);
                this.panelMain.add(this.panelStates);
                this.panelMain.add(this.panelProperties);
                this.panelMain.add(this.panelFeature);
                this.panelMain.add(this.panelDataType);
                this.panelMain.add(this.panelBuffer);

                this.panelMain.add(this.labelLayers);
                this.panelMain.add(this.panelLayersList);

                this.panelMain.add(this.buttonExport2Drive);
                this.panelMain.add(this.labelNotes);
                // this.panelMain.add(this.buttonDisclaimerShow);

                ui.root.add(this.panelMain);

                // App.ui.showDisclaimer();

            },

            panelMain: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'width': '360px',
                    'position': 'bottom-left',
                    'margin': '0px 0px 0px 0px',
                },
            }),

            panelLogo: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal',
                    'margin': '0px 0px 5px 0px',
                },
            }),

            panelStates: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelRegion: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelCollection: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelFeatureCollections: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelProperties: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelFeature: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelDataType: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelBuffer: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelLayersList: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'height': '200px',
                    'stretch': 'vertical',
                    'backgroundColor': '#cccccc',
                },
            }),

            panelDisclaimer: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    // 'width': '700px',
                    // 'height': '350px',
                },
            }),

            panelDisclaimerText: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'width': '700px',
                    'height': '300px',
                },
            }),

            labelRegion: ui.Label('Region', {
                // 'fontWeight': 'bold',
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelCollection: ui.Label('Collection', {
                // 'fontWeight': 'bold',
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelTitle: ui.Label('MapBiomas User Toolkit', {
                'fontWeight': 'bold',
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelSubtitle: ui.Label('Fire', {
                // 'fontWeight': 'bold',
                // 'padding': '1px',
                'fontSize': '14px'
            }),

            labelLink: ui.Label('Legend codes', {
                // 'fontWeight': 'bold',
                // 'padding': '1px',
                'fontSize': '10px'
            },
                'https://mapbiomas.org/codigos-de-legenda?cama_set_language=pt-BR'
            ),

            labelType: ui.Label('Type:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelTables: ui.Label('Tables:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelProperties: ui.Label('Properties:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelFeature: ui.Label('Features:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelDataType: ui.Label('Data Type:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelBuffer: ui.Label('Buffer:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelLayers: ui.Label('Layers:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelNotes: ui.Label('Go to TASK tab in the up-rght corner and click RUN', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelStates: ui.Label('States:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelDisclaimer: [
                ui.Label('ATENÇÃO'),
                ui.Label('Esta é a primeira coleção completa do MapBiomas Água com o mapeamento da superfície de água do Brasil de 1985 a 2020, com dados anuais e mensais para todo o período incluindo: (i) dado no ano e acumulado em um período; (ii) frequência de ocorrência; (iii)  transições(ganhos e perdas) e(iv) classificação da cobertura do tipo de corpo d’água.\
                A descrição do método de mapeamento da superfície de água e da classificação de corpos hídricos está disponível  na seção de metodologias do MapBiomas.\
                Os mapas anuais de superfície de água e as tabelas estatísticas estão disponíveis na área de download do MapBiomas.\
                Para sugestões, críticas e ideias para aprimorar o trabalho, por favor, entre em contato pelo e- mail: contato@mapbiomas.org ou acesse o Fórum MapBiomas.\
                Os dados do MapBiomas são públicos, abertos e gratuitos sob licença Creative Commons CC - CY - SA e mediante a referência da fonte observando o seguinte formato: "Projeto MapBiomas – Mapeamento da Superfície de Água do Brasil Coleção 1, acessado em [DATA] através do link: [LINK]".'),

                ui.Label(''),
                ui.Label('ATTENTION'),
                ui.Label('This is the first complete collection of MapBiomas Water with the mapping of the water surface of Brazil from 1985 to 2020, with annual and monthly data for the whole time interval including (i) data in the year and accumulated in a time interval; (ii) frequency of occurrence; (iii) transitions (gain and loss) and (iv) classification of water body type.\
                The description of the water surface mapping method and the classification of water bodies is available in the methodology section of MapBiomas.\
                Annual water surface maps and statistical tables are available in the MapBiomas download area.\
                For suggestions, feedback, and ideas to improve the work, please contact us by email: contato@mapbiomas.org or visit the MapBiomas Forum.\
                MapBiomas data is public, open, and free under a Creative Commons CC - CY - SA license and by reference to the source, observing the following format: "MapBiomas Project – Mapping of the Water Surface of Brazil Collection 1, accessed in [DATE] through from the link: [LINK]".')
            ],

            selectName: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectCollection: ui.Select({
                'items': [],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            selectRegion: ui.Select({
                'items': [
                    'mapbiomas-amazon',
                    // 'mapbiomas-atlantic-forest',
                    'mapbiomas-brazil',
                    'mapbiomas-bolivia',
                    // 'mapbiomas-chaco',
                    'mapbiomas-colombia',
                    'mapbiomas-ecuador',
                    // 'mapbiomas-indonesia',
                    // 'mapbiomas-pampa',
                    // 'mapbiomas-paraguay',
                    'mapbiomas-peru',
                    // 'mapbiomas-uruguay',
                    'mapbiomas-venezuela',
                ],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                },
                'onChange': function (region) {

                    ee.Number(1).evaluate(
                        function (a) {
                            App.ui.setMapbiomasRegion(region);
                        }
                    );

                },
            }),

            selectFeatureCollections: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectFeature: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectProperties: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectDataType: ui.Select({
                'items': [
                    'annual_water_coverage',
                    'water_frequency'
                    // 'monthly_water_coverage',
                ],
                'placeholder': 'annual_water_coverage',
                'style': {
                    'stretch': 'horizontal'
                },
                'disabled': true,
            }),

            selectBuffer: ui.Select({
                'items': [
                    'None',
                    '1km',
                    '2km',
                    '3km',
                    '4km',
                    '5km',
                ],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                },
                'onChange': function (distance) {
                    var distances = {
                        'None': 0,
                        '1km': 1000,
                        '2km': 2000,
                        '3km': 3000,
                        '4km': 4000,
                        '5km': 5000,
                    };

                    App.options.bufferDistance = distances[distance];
                },
            }),

            selectStates: ui.Select({
                'items': [
                    'None', 'Acre', 'Alagoas', 'Amazonas', 'Amapá', 'Bahia',
                    'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão',
                    'Minas Gerais', 'Mato Grosso do Sul', 'Mato Grosso', 'Pará', 'Paraíba',
                    'Pernambuco', 'Piauí', 'Paraná', 'Rio de Janeiro', 'Rio Grande do Norte',
                    'Rondônia', 'Roraima', 'Rio Grande do Sul', 'Santa Catarina', 'Sergipe',
                    'São Paulo', 'Tocantins'
                ],
                'placeholder': 'select state',
                'onChange': function (state) {
                    if (state != 'None') {

                        ee.Number(1).evaluate(
                            function (a) {
                                App.ui.loadTableStates(App.options.activeName);
                                App.ui.makeLayersList(App.options.activeName.split('/')[3], App.options.activeFeature, App.options.periods[App.options.dataType]);
                                App.ui.loadPropertiesNames();
                                App.ui.form.selectDataType.setDisabled(false);
                            }
                        );

                        App.ui.loadingBox();
                    }
                },
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            buttonExport2Drive: ui.Button({
                "label": "Export images to Google Drive",
                "onClick": function () {
                    App.ui.export2Drive();
                },
                "disabled": false,
                "style": {
                    // 'padding': '2px',
                    'stretch': 'horizontal'
                }
            }),

            buttonDisclaimerOk: ui.Button({
                "label": "Ok, I get it!",
                "onClick": function () {
                    Map.remove(App.ui.form.panelDisclaimer);
                    App.ui.form.buttonDisclaimerShow.setDisabled(false);
                },
                "disabled": false,
                "style": {
                    // 'padding': '2px',
                    'stretch': 'horizontal'
                }
            }),

            buttonDisclaimerShow: ui.Button({
                "label": "Show disclaimer",
                "onClick": function () {
                    App.ui.showDisclaimer();
                },
                "disabled": false,
                "style": {
                    // 'padding': '2px',
                    'stretch': 'horizontal'
                }
            }),

        },
    }
};

App.init();

App.setVersion();