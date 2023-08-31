/**
 * @name
 *      Mapbiomas User Toolkit Download
 * 
 * @description
 *      This is a support tool for mapbiomas data users.
 *  
 * @author
 *      João Siqueira
 * 
 * @contact
 *      Tasso Azevedo, Marcos Rosa and João Siqueira
 *      contato@mapbiomas.org
 *
 * @version
 *    1.0.0 - Acess and download data using user's vector
 *    1.1.0 - Updated to collection 4.0
 *    1.1.1 - Updated assets
 *    1.1.2 - Fix minor issues
 *    1.1.3 - Update transitions data
 *    1.1.4 - Update transitions data to collection 4.1
 *    1.2.0 - Loads mapbiomas-brazil collection 3.1
 *          - Loads mapbiomas-brazil collection 4.0
 *          - Loads mapbiomas-chaco collection 1.0
 *          - Loads mapbiomas-amazon collection 1.0
 *          - Updated mapbiomas-amazon collection 2.0
 *    1.3.0 - Loads mapbiomas-brazil collection 5.0
 *          - Export a csv file with areas per classe and year
 *    1.3.1 - Loads mapbiomas-chaco collection 2.0
 *    1.3.2 - Loads mapbiomas-brazil collection 5.0 quality
 *    1.4.0 - Loads mapbiomas-atlantic-forest collection 1.0
 *    1.5.0 - Loads mapbiomas-pampa collection 1.0
 *    1.6.0 - Loads mapbiomas-brazil collection 6.0
 *    1.7.0 - Loads mapbiomas-amazon collection 3.0
 *    1.8.0 - Loads mapbiomas-indonesia collection 1.0
 *    1.9.0 - New tabs and download entire Brazilian maps from storage
 *    1.10.0 - Loads mapbiomas-brazil collection 7.0
 *    1.11.0 - Loads mapbiomas-chaco collection 3.0
 *    1.12.0 - Loads mapbiomas-atlantic-forest collection 2.0
 *    1.13.0 - Loads mapbiomas-amazon collection 4.0
 *    1.14.0 - Loads mapbiomas-pampa collection 2.0
 *    1.15.0 - Loads mapbiomas-peru collection 1.0
 *    1.16.0 - Loads mapbiomas-brazil collection 7.1
 *    1.17.0 - Loads mapbiomas-chaco collection 4.0
 *    1.18.0 - Loads mapbiomas-bolivia collection 1.0
 *    1.19.0 - Loads mapbiomas-brazil collection 8.0
 * 
 * @see
 *      Get the MapBiomas exported data in your "Google Drive/MAPBIOMAS-EXPORT" folder
 *      Code and Tutorial - https://github.com/mapbiomas-brazil/user-toolkit
 */

var palettes = require('users/mapbiomas/modules:Palettes.js');
var logos = require('users/mapbiomas/modules:Logos.js');

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

        version: '1.19.0',

        logo: {
            uri: 'gs://mapbiomas-public/mapbiomas-logos/mapbiomas-logo-horizontal.b64',
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
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/biome',
                    'label': 'biome',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/city',
                    'label': 'city',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/country',
                    'label': 'country',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/country_per_biome',
                    'label': 'country_per_biome',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/drainage_basin',
                    'label': 'drainage_basin',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/federal_conservation_units',
                    'label': 'federal_conservation_units',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/indigenous_land',
                    'label': 'indigenous_land',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/raisg_limit',
                    'label': 'raisg_limit',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/state',
                    'label': 'state',
                },
                {
                    'value': 'projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/state_conservation_units',
                    'label': 'state_conservation_units',
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
                    'label': 'political level 1'
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
                    'value': "projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION1/biome",
                    'label': 'biome'
                },
                {
                    'value': "projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION1/city",
                    'label': 'city'
                },
                {
                    'value': "projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION1/conservation_units",
                    'label': 'conservation_units'
                },
                {
                    'value': "projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION1/country",
                    'label': 'country'
                },
                {
                    'value': "projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION1/indigenous_land",
                    'label': 'indigenous_land'
                },
                {
                    'value': "projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION1/level_1_drainage_basin",
                    'label': 'level_1_drainage_basin'
                },
                {
                    'value': "projects/earthengine-legacy/assets/projects/MapBiomas_Pampa/ANCILLARY_DATA/STATISTICS/COLLECTION1/state",
                    'label': 'state'
                },
            ],
            'mapbiomas-indonesia': [
                {
                    'label': 'city',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION1/city'
                },
                {
                    'label': 'country',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION1/country'
                },
                {
                    'label': 'regions',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION1/regions'
                },
                {
                    'label': 'state',
                    'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION1/state'
                },
                // {
                //     'label': 'category',
                //     'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION1/category'
                // },
                // {
                //     'label': 'land-tenure',
                //     'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION1/land-tenure'
                // },
                // {
                //     'label': 'level-1-subcategory',
                //     'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION1/level-1-subcategory'
                // },
                // {
                //     'label': 'level-2-subcategory',
                //     'value': 'projects/mapbiomas-indonesia/ANCILLARY_DATA/STATISTICS/COLLECTION1/level-2-subcategory'
                // },
            ],
            'mapbiomas-peru': [
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-1',
                    'label': 'nivel-politico-1'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-2',
                    'label': 'nivel-politico-2'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-3',
                    'label': 'nivel-politico-3'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-4',
                    'label': 'nivel-politico-4'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/bioma-pais',
                    'label': 'bioma-pais'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/unidad-hidrografica',
                    'label': 'unidad-hidrografica'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/comunidad-nativa-solicitud',
                    'label': 'comunidad-nativa-solicitud'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/comunidad-nativa-titulada',
                    'label': 'comunidad-nativa-titulada'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/reserva-indigena',
                    'label': 'reserva-indigena'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/reserva-territorial',
                    'label': 'reserva-territorial'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/comunidad-campesina-reconocida',
                    'label': 'comunidad-campesina-reconocida'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/comunidad-campesina-titulada',
                    'label': 'comunidad-campesina-titulada'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-natural-protegida',
                    'label': 'area-natural-protegida'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-conservacion-regional',
                    'label': 'area-conservacion-regional'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/area-conservacion-privada',
                    'label': 'area-conservacion-privada'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/ecosistema-fragil',
                    'label': 'ecosistema-fragil'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/ecozona',
                    'label': 'ecozona'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/ecorregion',
                    'label': 'ecorregion'
                },
                {
                    'value': 'projects/mapbiomas-raisg/PERU/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/region-geografica',
                    'label': 'region-geografica'
                },
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
        },

        collections: {
            'mapbiomas-brazil': {
                'collection-3.1': {
                    'assets': {
                        'integration': 'projects/mapbiomas-workspace/public/collection3_1/mapbiomas_collection31_integration_v1',
                        'transitions': 'projects/mapbiomas-workspace/public/collection3_1/mapbiomas_collection31_transitions_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "1985_1990", "1990_1995", "1995_2000", "2000_2005",
                            "2005_2010", "2010_2015", "2015_2017", "1990_2000",
                            "2000_2010", "2010_2017", "1985_2017", "2008_2017",
                            "2012_2017", "1994_2002", "2002_2010", "2010_2016"
                        ]
                    },
                },
                'collection-4.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-workspace/public/collection4/mapbiomas_collection40_integration_v1',
                        'transitions': 'projects/mapbiomas-workspace/public/collection4/mapbiomas_collection40_transitions_v3',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "1985_1990", "1990_1995", "1995_2000",
                            "2000_2005", "2005_2010", "2010_2015", "2015_2018",
                            "1990_2000", "2000_2010", "2010_2018", "1985_2018",
                            "2008_2017", "2012_2018", "1994_2002", "2002_2010",
                            "2010_2016", "2008_2018", "1986_2015", "2001_2016"
                        ]
                    },
                },
                'collection-4.1': {
                    'assets': {
                        'integration': 'projects/mapbiomas-workspace/public/collection4_1/mapbiomas_collection41_integration_v1',
                        'transitions': 'projects/mapbiomas-workspace/public/collection4_1/mapbiomas_collection41_transitions_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "1985_1990", "1990_1995", "1995_2000",
                            "2000_2005", "2005_2010", "2010_2015", "2015_2018",
                            "1990_2000", "2000_2010", "2010_2018", "1985_2018",
                            "2008_2017", "2012_2018", "1994_2002", "2002_2010",
                            "2010_2016", "2008_2018", "1986_2015", "2001_2016"
                        ]
                    },
                },
                'collection-5.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-workspace/public/collection5/mapbiomas_collection50_integration_v1',
                        'transitions': 'projects/mapbiomas-workspace/public/collection5/mapbiomas_collection50_transitions_v1',
                        'quality': 'projects/mapbiomas-workspace/public/collection5/mapbiomas_collection50_quality_v1',
                    },

                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "2018_2019", "1985_1990", "1990_1995",
                            "1995_2000", "2000_2005", "2005_2010", "2010_2015",
                            "2015_2019", "1990_2000", "2000_2010", "2010_2019",
                            "1985_2019", "2008_2019", "2012_2019", "1994_2002",
                            "2002_2010", "2010_2016", "1990_2008", "1990_2019",
                            "2000_2019", "2008_2018", "1986_2015", "2001_2016",
                            "1996_2015"
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019'
                        ]
                    },
                },
                'collection-6.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-workspace/public/collection6/mapbiomas_collection60_integration_v1',
                        'transitions': 'projects/mapbiomas-workspace/public/collection6/mapbiomas_collection60_transitions_v1',
                        'quality': 'projects/mapbiomas-workspace/public/collection5/mapbiomas_collection50_quality_v1', // the same collection 5
                    },

                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "2018_2019", "2019_2020", "1985_1990",
                            "1990_1995", "1995_2000", "2000_2005", "2005_2010",
                            "2010_2015", "2015_2020", "1990_2000", "2000_2010",
                            "2010_2020", "1985_2020", "2008_2020", "2012_2020",
                            "1994_2002", "2002_2010", "2010_2016", "1990_2008",
                            "1990_2020", "2000_2020", "2008_2018", "1986_2015",
                            "2001_2016", "1996_2015",
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020'
                        ]
                    },
                },
                'collection-7.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-workspace/public/collection7/mapbiomas_collection70_integration_v2',
                        'transitions': 'projects/mapbiomas-workspace/public/collection7/mapbiomas_collection70_transitions_v3',
                        'quality': 'projects/mapbiomas-workspace/public/collection6/mapbiomas_collection60_quality_v1', // the same collection 5
                    },

                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "2018_2019", "2019_2020", "2020_2021",
                            "1985_1990", "1990_1995", "1995_2000", "2000_2005",
                            "2005_2010", "2010_2015", "2015_2020", "1990_2000",
                            "2000_2010", "2010_2020", "1985_2021", "2008_2021",
                            "2012_2021", "1994_2002", "2002_2010", "2010_2016",
                            "2016_2021", "1993_2008", "1990_2008", "1990_2021",
                            "2000_2021", "2008_2018", "1986_2015", "2001_2016",
                            "1996_2015",
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020'
                        ]
                    },
                },
                'collection-7.1': {
                    'assets': {
                        'integration': 'projects/mapbiomas-workspace/public/collection7_1/mapbiomas_collection71_integration_v1',
                        'transitions': 'projects/mapbiomas-workspace/public/collection7_1/mapbiomas_collection71_transitions_v1',
                        'quality': 'projects/mapbiomas-workspace/public/collection6/mapbiomas_collection60_quality_v1', // the same collection 7
                    },

                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "2018_2019", "2019_2020", "2020_2021",
                            "1985_1990", "1990_1995", "1995_2000", "2000_2005",
                            "2005_2010", "2010_2015", "2015_2020", "1990_2000",
                            "2000_2010", "2010_2020", "1985_2021", "2008_2021",
                            "2012_2021", "1994_2002", "2002_2010", "2010_2016",
                            "2016_2021", "1993_2008", "1990_2008", "1990_2021",
                            "2000_2021", "2008_2018", "1986_2015", "2001_2016",
                            "1996_2015",
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020'
                        ]
                    },
                },
                'collection-8.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-workspace/public/collection8/mapbiomas_collection80_integration_v1',
                        'transitions': 'projects/mapbiomas-workspace/public/collection8/mapbiomas_collection80_transitions_v1',
                        'quality': 'projects/mapbiomas-workspace/public/collection6/mapbiomas_collection80_quality_v1',
                    },

                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "2018_2019", "2019_2020", "2020_2021",
                            "2021_2022", "1985_1990", "1990_1995", "1995_2000",
                            "2000_2005", "2005_2010", "2010_2015", "2015_2020",
                            "1990_2000", "2000_2010", "2010_2020", "1985_2022",
                            "2008_2022", "2012_2022", "1994_2002", "2002_2010",
                            "2010_2016", "2016_2022", "2000_2019", "2002_2022",
                            "2018_2022", "1993_2008", "1990_2008", "1990_2022",
                            "2000_2022", "2008_2018", "1986_2015", "2001_2016",
                            "1996_2015", "1992_2002", "2002_2012"
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ]
                    },
                },
            },
            'mapbiomas-amazon': {
                'collection-1.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-raisg/public/collection1/mapbiomas_raisg_panamazonia_collection1_integration_v1',
                        'transitions': 'projects/mapbiomas-raisg/public/collection1/mapbiomas_raisg_panamazonia_collection1_transitions_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017'
                        ],
                        'Transitions': [
                            "2000_2001", "2001_2002", "2002_2003", "2003_2004",
                            "2004_2005", "2005_2006", "2006_2007", "2007_2008",
                            "2008_2009", "2009_2010", "2010_2011", "2011_2012",
                            "2012_2013", "2013_2014", "2014_2015", "2015_2016",
                            "2016_2017", "2000_2005", "2005_2010", "2010_2015",
                            "2015_2017", "2000_2010", "2010_2017", "2000_2017"
                        ]
                    },
                },
                'collection-2.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-raisg/public/collection2/mapbiomas_raisg_panamazonia_collection2_integration_v2',
                        'transitions': 'projects/mapbiomas-raisg/public/collection2/mapbiomas_raisg_panamazonia_collection2_transitions_v2',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "1985_1990", "1990_1995", "1995_2000",
                            "2000_2005", "2005_2010", "2010_2015", "2015_2018",
                            "1990_2000", "2000_2010", "2010_2018", "1985_2018",
                            "2008_2017", "2012_2018", "1994_2002", "2002_2010",
                            "2010_2016", "2008_2018", "1986_2015", "2000_2018"
                        ]
                    },
                },
                'collection-3.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-raisg/public/collection3/mapbiomas_raisg_panamazonia_collection3_integration_v2',
                        'transitions': 'projects/mapbiomas-raisg/public/collection3/mapbiomas_raisg_panamazonia_collection3_transitions_v2',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020'
                        ],
                        'Transitions': [
                            '1985_1986', '1986_1987', '1987_1988', '1988_1989',
                            '1989_1990', '1990_1991', '1991_1992', '1992_1993',
                            '1993_1994', '1994_1995', '1995_1996', '1996_1997',
                            '1997_1998', '1998_1999', '1999_2000', '2000_2001',
                            '2001_2002', '2002_2003', '2003_2004', '2004_2005',
                            '2005_2006', '2006_2007', '2007_2008', '2008_2009',
                            '2009_2010', '2010_2011', '2011_2012', '2012_2013',
                            '2013_2014', '2014_2015', '2015_2016', '2016_2017',
                            '2017_2018', '2018_2019', '2019_2020', '1985_1990',
                            '1990_1995', '1995_2000', '2000_2005', '2005_2010',
                            '2010_2015', '2015_2020', '1990_2000', '2000_2010',
                            '2010_2020', '1985_2020', '2008_2017', '1994_2002',
                            '2002_2010', '2010_2016', '1986_2015', '1990_2020',
                            '2000_2020', '2008_2020', '2012_2020',
                        ]
                    },
                },
                'collection-4.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-raisg/public/collection4/mapbiomas_raisg_panamazonia_collection4_integration_v1',
                        'transitions': 'projects/mapbiomas-raisg/public/collection4/mapbiomas_raisg_panamazonia_collection4_transitions_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ],
                        'Transitions': [
                            '1985_1986', '1986_1987', '1987_1988', '1988_1989',
                            '1989_1990', '1990_1991', '1991_1992', '1992_1993',
                            '1993_1994', '1994_1995', '1995_1996', '1996_1997',
                            '1997_1998', '1998_1999', '1999_2000', '2000_2001',
                            '2001_2002', '2002_2003', '2003_2004', '2004_2005',
                            '2005_2006', '2006_2007', '2007_2008', '2008_2009',
                            '2009_2010', '2010_2011', '2011_2012', '2012_2013',
                            '2013_2014', '2014_2015', '2015_2016', '2016_2017',
                            '2017_2018', '2018_2019', '2019_2020', '2020_2021',
                            '1985_1990', '1990_1995', '1995_2000', '2000_2005',
                            '2005_2010', '2010_2015', '2015_2020', '1990_2000',
                            '2000_2010', '2010_2020', '1985_2021', '2008_2017',
                            '1994_2002', '2002_2010', '2010_2016', '1986_2015',
                            '1990_2021', '2000_2021', '2008_2021', '2010_2021',
                            '2012_2021',
                        ]
                    },
                },
            },
            'mapbiomas-chaco': {
                'collection-1.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-chaco/public/collection1/mapbiomas_chaco_collection1_integration_v1',
                        'transitions': 'projects/mapbiomas-chaco/public/collection1/mapbiomas_chaco_collection1_transitions_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '2010', '2011', '2012', '2013',
                            '2014', '2015', '2016', '2017',
                        ],
                        'Transitions': [
                            "2010_2011", "2011_2012", "2012_2013", "2013_2014",
                            "2014_2015", "2015_2016", "2016_2017", "2010_2017",
                            "2013_2017"
                        ]
                    },
                },
                'collection-2.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-chaco/public/collection2/mapbiomas_chaco_collection2_integration_v1',
                        'transitions': 'projects/mapbiomas-chaco/public/collection2/mapbiomas_chaco_collection2_transitions_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017', '2018', '2019',
                        ],
                        'Transitions': [
                            "2000_2001", "2001_2002", "2002_2003", "2003_2004",
                            "2004_2005", "2005_2006", "2006_2007", "2007_2008",
                            "2008_2009", "2009_2010", "2010_2011", "2011_2012",
                            "2012_2013", "2013_2014", "2014_2015", "2015_2016",
                            "2016_2017", "2017_2018", "2018_2019", "2000_2005",
                            "2005_2010", "2010_2015", "2015_2019", "2000_2010",
                            "2010_2019", "2000_2019",
                        ]
                    },
                },
                'collection-3.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-chaco/public/collection3/mapbiomas_chaco_collection3_integration_v2',
                        'transitions': 'projects/mapbiomas-chaco/public/collection3/mapbiomas_chaco_collection3_transitions_v2',
                    },
                    'periods': {
                        'Coverage': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017', '2018', '2019',
                            '2020', '2021'
                        ],
                        'Transitions': [
                            "2000_2001", "2001_2002", "2002_2003", "2003_2004",
                            "2004_2005", "2005_2006", "2006_2007", "2007_2008",
                            "2008_2009", "2009_2010", "2010_2011", "2011_2012",
                            "2012_2013", "2013_2014", "2014_2015", "2015_2016",
                            "2016_2017", "2017_2018", "2018_2019", "2019_2020",
                            "2020_2021", "2000_2005", "2005_2010", "2010_2015",
                            "2015_2020", "2000_2010", "2010_2020", //"2000_2021",
                        ]
                    },
                },
                'collection-4.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-chaco/public/collection4/mapbiomas_chaco_collection4_integration_v1',
                        'transitions': 'projects/mapbiomas-chaco/public/collection4/mapbiomas_chaco_collection4_transitions_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021', '2022'
                        ],
                        'Transitions': [
                            '1985_1986', '1986_1987', '1987_1988', '1988_1989',
                            '1989_1990', '1990_1991', '1991_1992', '1992_1993',
                            '1993_1994', '1994_1995', '1995_1996', '1996_1997',
                            '1997_1998', '1998_1999', '1999_2000', '2000_2001',
                            '2001_2002', '2002_2003', '2003_2004', '2004_2005',
                            '2005_2006', '2006_2007', '2007_2008', '2008_2009',
                            '2009_2010', '2010_2011', '2011_2012', '2012_2013',
                            '2013_2014', '2014_2015', '2015_2016', '2016_2017',
                            '2017_2018', '2018_2019', '2019_2020', '2020_2021',
                            '2021_2022', '1985_1990', '1990_1995', '1995_2000',
                            '2000_2005', '2005_2010', '2010_2015', '2015_2020',
                            '1990_2000', '2000_2010', '2010_2020', '1985_2022',
                            '2000_2022',
                        ]
                    },
                },
            },
            'mapbiomas-atlantic-forest': {
                'collection-1.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas_af_trinacional/public/collection1/mapbiomas_atlantic_forest_collection1_integration_v1',
                        'transitions': 'projects/mapbiomas_af_trinacional/public/collection1/mapbiomas_atlantic_forest_collection1_transitions_v1',
                        'quality': 'projects/mapbiomas_af_trinacional/public/collection1/mapbiomas_atlantic_forest_collection1_quality_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017', '2018', '2019',
                        ],
                        'Transitions': [
                            "2000_2001", "2001_2002", "2002_2003", "2003_2004",
                            "2004_2005", "2005_2006", "2006_2007", "2007_2008",
                            "2008_2009", "2009_2010", "2010_2011", "2011_2012",
                            "2012_2013", "2013_2014", "2014_2015", "2015_2016",
                            "2016_2017", "2017_2018", "2018_2019", "2000_2005",
                            "2005_2010", "2010_2015", "2015_2019", "2000_2010",
                            "2010_2019", "2008_2019", "2012_2019", "2002_2010",
                            "2010_2016", "2000_2019"
                        ],
                        'Quality': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017', '2018', '2019',
                        ]
                    },
                },
                'collection-2.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas_af_trinacional/public/collection2/mapbiomas_atlantic_forest_collection20_integration_v1',
                        'transitions': 'projects/mapbiomas_af_trinacional/public/collection2/mapbiomas_atlantic_forest_collection20_transitions_v1',
                        'quality': 'projects/mapbiomas_af_trinacional/public/collection2/mapbiomas_atlantic_forest_collection20_quality_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ],
                        'Transitions': [
                            "1985_1986", "1986_1987", "1987_1988", "1988_1989",
                            "1989_1990", "1990_1991", "1991_1992", "1992_1993",
                            "1993_1994", "1994_1995", "1995_1996", "1996_1997",
                            "1997_1998", "1998_1999", "1999_2000", "2000_2001",
                            "2001_2002", "2002_2003", "2003_2004", "2004_2005",
                            "2005_2006", "2006_2007", "2007_2008", "2008_2009",
                            "2009_2010", "2010_2011", "2011_2012", "2012_2013",
                            "2013_2014", "2014_2015", "2015_2016", "2016_2017",
                            "2017_2018", "2018_2019", "2019_2020", "2020_2021",
                            "1985_1990", "1990_1995", "1995_2000", "2000_2005",
                            "2005_2010", "2010_2015", "2015_2020", "1990_2000",
                            "2000_2010", "2010_2020", "1985_2021", "2008_2021",
                            "2012_2021", "1994_2002", "2002_2010", "2010_2016",
                            "2016_2021", "1993_2008"
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ]
                    },
                },
            },
            'mapbiomas-pampa': {
                'collection-1.0': {
                    'assets': {
                        'integration': 'projects/MapBiomas_Pampa/public/collection1/mapbiomas_pampa_collection1_integration_v1',
                        'transitions': 'projects/MapBiomas_Pampa/public/collection1/mapbiomas_pampa_collection1_transitions_v1',
                        'quality': 'projects/MapBiomas_Pampa/public/collection1/mapbiomas_pampa_collection1_quality_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017', '2018', '2019',
                        ],
                        'Transitions': [
                            "2000_2001", "2001_2002", "2002_2003", "2003_2004",
                            "2004_2005", "2005_2006", "2006_2007", "2007_2008",
                            "2008_2009", "2009_2010", "2010_2011", "2011_2012",
                            "2012_2013", "2013_2014", "2014_2015", "2015_2016",
                            "2016_2017", "2017_2018", "2018_2019", "2000_2005",
                            "2005_2010", "2010_2015", "2015_2019", "2000_2010",
                            "2010_2019", "2008_2019", "2012_2019", "2002_2010",
                            "2000_2019"
                        ],
                        'Quality': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017', '2018', '2019',
                        ]
                    },
                },
                'collection-2.0': {
                    'assets': {
                        'integration': 'projects/MapBiomas_Pampa/public/collection2/mapbiomas_pampa_collection2_integration_v1',
                        'transitions': 'projects/MapBiomas_Pampa/public/collection2/mapbiomas_pampa_collection2_transitions_v1',
                        'quality': 'projects/MapBiomas_Pampa/public/collection2/mapbiomas_pampa_collection2_quality_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ],
                        'Transitions': [
                            '1985_1986', '1986_1987', '1987_1988', '1988_1989',
                            '1989_1990', '1990_1991', '1991_1992', '1992_1993',
                            '1993_1994', '1994_1995', '1995_1996', '1996_1997',
                            '1997_1998', '1998_1999', '1999_2000', '2000_2001',
                            '2001_2002', '2002_2003', '2003_2004', '2004_2005',
                            '2005_2006', '2006_2007', '2007_2008', '2008_2009',
                            '2009_2010', '2010_2011', '2011_2012', '2012_2013',
                            '2013_2014', '2014_2015', '2015_2016', '2016_2017',
                            '2017_2018', '2018_2019', '2019_2020', '2020_2021',
                            '1985_1990', '1990_1995', '1995_2000', '2000_2005',
                            '2005_2010', '2010_2015', '2015_2020', '1990_2000',
                            '2000_2010', '2010_2020', '1985_2021', '2008_2017',
                            '1994_2002', '2002_2010', '2010_2016', '1986_2015',
                            '1990_2021', '2000_2021', '2008_2021', '2010_2021',
                            '2012_2021',
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ]
                    },
                },
            },
            'mapbiomas-indonesia': {
                'collection-1.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-indonesia/public/collection1/mapbiomas_indonesia_collection1_integration_v1',
                        'transitions': 'projects/mapbiomas-indonesia/public/collection1/mapbiomas_indonesia_collection1_transitions_v2',
                        'quality': 'projects/mapbiomas-indonesia/public/collection1/mapbiomas_indonesia_collection1_quality_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017', '2018', '2019',
                        ],
                        'Transitions': [
                            "2000_2001", "2001_2002", "2002_2003", "2003_2004",
                            "2004_2005", "2005_2006", "2006_2007", "2007_2008",
                            "2008_2009", "2009_2010", "2010_2011", "2011_2012",
                            "2012_2013", "2013_2014", "2014_2015", "2015_2016",
                            "2016_2017", "2017_2018", "2018_2019", "2000_2005",
                            "2005_2010", "2010_2015", "2015_2019", "2000_2010",
                            "2010_2019", "2000_2019", "2011_2019", "2013_2019",
                            "2014_2019", "2004_2019",
                        ],
                        'Quality': [
                            '2000', '2001', '2002', '2003',
                            '2004', '2005', '2006', '2007',
                            '2008', '2009', '2010', '2011',
                            '2012', '2013', '2014', '2015',
                            '2016', '2017', '2018', '2019',
                        ]
                    },
                },
            },
            'mapbiomas-peru': {
                'collection-1.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-public/assets/peru/collection1/mapbiomas_peru_collection1_integration_v1',
                        'transitions': 'projects/mapbiomas-public/assets/peru/collection1/mapbiomas_peru_collection1_transitions_v1',
                        'quality': 'projects/mapbiomas-public/assets/peru/collection1/mapbiomas_peru_collection1_quality_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ],
                        'Transitions': [
                            '1985_1986', '1986_1987', '1987_1988', '1988_1989',
                            '1989_1990', '1990_1991', '1991_1992', '1992_1993',
                            '1993_1994', '1994_1995', '1995_1996', '1996_1997',
                            '1997_1998', '1998_1999', '1999_2000', '2000_2001',
                            '2001_2002', '2002_2003', '2003_2004', '2004_2005',
                            '2005_2006', '2006_2007', '2007_2008', '2008_2009',
                            '2009_2010', '2010_2011', '2011_2012', '2012_2013',
                            '2013_2014', '2014_2015', '2015_2016', '2016_2017',
                            '2017_2018', '2018_2019', '2019_2020', '2020_2021',
                            '1985_1990', '1990_1995', '1995_2000', '2000_2005',
                            '2005_2010', '2010_2015', '2015_2020', '1990_2000',
                            '2000_2010', '2010_2020', '1985_2021', '2008_2017',
                            '1994_2002', '2002_2010', '2010_2016', '1986_2015',
                            '1990_2021', '2000_2021', '2008_2021', '2010_2021',
                            '2012_2021',
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ]
                    },
                },
            },
            'mapbiomas-bolivia': {
                'collection-1.0': {
                    'assets': {
                        'integration': 'projects/mapbiomas-public/assets/bolivia/collection1/mapbiomas_bolivia_collection1_integration_v1',
                        'transitions': 'projects/mapbiomas-public/assets/bolivia/collection1/mapbiomas_bolivia_collection1_transitions_v1',
                        'quality': 'projects/mapbiomas-public/assets/peru/collection1/mapbiomas_bolivia_collection1_quality_v1',
                    },
                    'periods': {
                        'Coverage': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ],
                        'Transitions': [
                            '1985_1986', '1986_1987', '1987_1988', '1988_1989',
                            '1989_1990', '1990_1991', '1991_1992', '1992_1993',
                            '1993_1994', '1994_1995', '1995_1996', '1996_1997',
                            '1997_1998', '1998_1999', '1999_2000', '2000_2001',
                            '2001_2002', '2002_2003', '2003_2004', '2004_2005',
                            '2005_2006', '2006_2007', '2007_2008', '2008_2009',
                            '2009_2010', '2010_2011', '2011_2012', '2012_2013',
                            '2013_2014', '2014_2015', '2015_2016', '2016_2017',
                            '2017_2018', '2018_2019', '2019_2020', '2020_2021',
                            '1985_1990', '1990_1995', '1995_2000', '2000_2005',
                            '2005_2010', '2010_2015', '2015_2020', '1990_2000',
                            '2000_2010', '2010_2020', '1985_2021', '2008_2017',
                            '1994_2002', '2002_2010', '2010_2016', '1986_2015',
                            '1990_2021', '2000_2021', '2008_2021', '2010_2021',
                            '2012_2021',
                        ],
                        'Quality': [
                            '1985', '1986', '1987', '1988',
                            '1989', '1990', '1991', '1992',
                            '1993', '1994', '1995', '1996',
                            '1997', '1998', '1999', '2000',
                            '2001', '2002', '2003', '2004',
                            '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012',
                            '2013', '2014', '2015', '2016',
                            '2017', '2018', '2019', '2020',
                            '2021'
                        ]
                    },
                },
            },
        },

        bandsNames: {
            'Coverage': 'classification_',
            'Transitions': 'transition_',
            'Quality': 'quality_'
        },

        dataType: 'Coverage',

        data: {
            'Coverage': null,
            'Transitions': null,
            'Quality': null
        },

        fileDimensions: {
            'Coverage': 256 * 512,
            'Transitions': 256 * 124,
            'Quality': 256 * 512,
        },

        ranges: {
            'Coverage': {
                'min': 0,
                'max': 62
            },
            'Transitions': {
                'min': -2,
                'max': 3
            },
            'Quality': {
                'min': 1,
                'max': 23
            },
        },

        vector: null,
        activeFeature: null,
        activeName: '',

        palette: {
            'Coverage': palettes.get('classification8'),
            'Transitions': ['ffa500', 'ff0000', '818181', '06ff00', '4169e1', '8a2be2'],
            'Quality': ['d73027', 'fef9b6', '1d6a37']
        },

        taskid: 1,

        bufferDistance: 0,

        transitionsCodes: [{
            name: "1. Floresta",
            noChange: [1, 2, 3, 4, 5, 6, 7, 8],
            upVeg: [],
            downVeg: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 28, 22, 23, 24, 25, 29, 30],
            downWater: [],
            upWater: [26, 33, 31],
            upPlantacao: [9],
            ignored: [27]
        },
        {
            name: "2. Formações Naturais não Florestais",
            noChange: [10, 11, 12, 13],
            upVeg: [],
            downVeg: [14, 15, 16, 17, 18, 19, 20, 21, 28, 22, 23, 24, 25, 29, 30],
            downWater: [],
            upWater: [26, 33, 31],
            upPlantacao: [9],
            ignored: [27, 1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
            name: "3. Uso Agropecuário",
            noChange: [14, 15, 16, 17, 18, 19, 20, 21, 28],
            upVeg: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 32],
            downVeg: [],
            downWater: [],
            upWater: [26, 31, 33],
            upPlantacao: [9],
            ignored: [27, 22, 23, 24, 25, 29, 30]
        },
        {
            name: "4.Áreas não vegetadas",
            noChange: [22, 23, 24, 25, 29, 30],
            upVeg: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 32],
            downVeg: [],
            downWater: [],
            upWater: [26, 31, 33],
            upPlantacao: [9],
            ignored: [27, 14, 15, 18, 19, 20, 21, 28],
        },
        {
            name: "5. Corpos Dágua",
            noChange: [26, 31, 33],
            upVeg: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 32],
            downVeg: [],
            downWater: [14, 15, 16, 17, 18, 19, 20, 21, 28, 22, 23, 24, 25, 29, 30],
            upWater: [],
            upPlantacao: [9],
            ignored: [27]
        },
        {
            name: "Plantacao Florestal",
            noChange: [9],
            upVeg: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 32],
            downVeg: [],
            downWater: [14, 15, 18, 19, 20, 21, 28, 22, 23, 24, 25, 29, 30],
            upWater: [26, 31, 33],
            upPlantacao: [],
            ignored: [27]
        },
        {
            name: "6. Não observado",
            noChange: [27],
            upVeg: [],
            downVeg: [],
            downWater: [],
            upWater: [],
            upPlantacao: [],
            ignored: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 28, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33]
        }
        ],

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
            13: "Other Non Forest Natural Formation",
            14: "Farming",
            15: "Pasture",
            18: "Agriculture",
            19: "Temporary Crops (Herbaceas - Agricultura)",
            20: "Sugar Cane",
            21: "Mosaic of Agriculture and Pasture",
            22: "Non vegetated area",
            23: "Beach and Dune",
            24: "Urban Infrastructure",
            25: "Other Non Vegetated Area",
            26: "Water",
            27: "Non Observed",
            29: "Rocky outcrop",
            30: "Mining",
            31: "Aquaculture",
            32: "Salt flat",
            33: "River, Lake and Ocean",
            34: "Glacier",
            35: "Oil Palm",
            36: "Perennial Crops",
            37: "Artificial Water Body",
            38: "Water Reservoirs",
            39: "Soy Beans",
            40: "Rice",
            41: "Mosaic of Crops",
            42: "Pastizal abierto", // Only for Chaco
            43: "Pastizal cerrado", // Only for Chaco
            44: "Pastizal disperso", // Only for Chaco
            45: "Leñosas dispersas", // Only for Chaco
            46: 'Coffe',
            47: 'Citrus',
            48: 'Other Perennial Crops',
            49: 'Wooded Sandbank Vegetation',
            50: 'Herbaceous Sandbank Vegetation',
            57: 'Cultivo Simples', // Only for Chaco
            58: 'Cultivo Múltiple', // Only for Chaco
            62: "Cotton",
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

        Map.centerObject(App.options.data.Coverage, 5);

        var imageLayer = ui.Map.Layer({
            'eeObject': App.options.data.Coverage,
            'visParams': {
                'bands': ['classification_' + year],
                'palette': App.options.palette.Coverage,
                'min': App.options.ranges.Coverage.min,
                'max': App.options.ranges.Coverage.max,
                'format': 'png'
            },
            'name': year,
            'shown': true,
            'opacity': 1.0
        });

        Map.clear();

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

    remapTransitions: function (image) {
        var oldValues = [];
        var newValues = [];

        App.options.transitionsCodes.forEach(function (c1) {
            c1.noChange.forEach(function (noChange1) {
                c1.noChange.forEach(function (noChange2) {
                    var oldValue = (noChange1 * 100) + noChange2;
                    oldValues.push(oldValue);
                    newValues.push(0);
                });
                c1.upVeg.forEach(function (upVeg2) {
                    var oldValue = (noChange1 * 100) + upVeg2;
                    oldValues.push(oldValue);
                    newValues.push(1);
                });
                c1.downVeg.forEach(function (downVeg2) {
                    var oldValue = (noChange1 * 100) + downVeg2;
                    oldValues.push(oldValue);
                    newValues.push(-1);
                });
                c1.downWater.forEach(function (downWater2) {
                    var oldValue = (noChange1 * 100) + downWater2;
                    oldValues.push(oldValue);
                    newValues.push(-2);
                });
                c1.upWater.forEach(function (upWater2) {
                    var oldValue = (noChange1 * 100) + upWater2;
                    oldValues.push(oldValue);
                    newValues.push(2);
                });
                c1.upPlantacao.forEach(function (upPlantacao2) {
                    var oldValue = (noChange1 * 100) + upPlantacao2;
                    oldValues.push(oldValue);
                    newValues.push(3);
                });
                c1.ignored.forEach(function (ignored2) {
                    var oldValue = (noChange1 * 100) + ignored2;
                    oldValues.push(oldValue);
                    newValues.push(0);
                });
            });
        });

        return image.remap(oldValues, newValues).rename(image.bandNames());
    },

    ui: {

        init: function () {

            this.form.init();

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


                            App.options.data.Coverage = ee.Image(
                                App.options.collections[regionName][collectioName].assets.integration);

                            App.options.data.Transitions = ee.Image(
                                App.options.collections[regionName][collectioName].assets.transitions);

                            if (regionName == 'mapbiomas-brazil' & collectioName == 'collection-5.0') {

                                App.options.data.Quality = ee.Image(
                                    App.options.collections[regionName][collectioName].assets.quality);

                            }
                            if (regionName == 'mapbiomas-brazil' & collectioName == 'collection-6.0') {

                                App.options.data.Quality = ee.Image(
                                    App.options.collections[regionName][collectioName].assets.quality);

                            }
                            if (regionName == 'mapbiomas-brazil' & collectioName == 'collection-7.0') {

                                App.options.data.Quality = ee.Image(
                                    App.options.collections[regionName][collectioName].assets.quality);

                            }
                            if (regionName == 'mapbiomas-brazil' & collectioName == 'collection-8.0') {

                                App.options.data.Quality = ee.Image(
                                    App.options.collections[regionName][collectioName].assets.quality);

                            }
                            // TODO: improve this logic
                            if (regionName == 'mapbiomas-atlantic-forest' & collectioName == 'collection-1.0') {

                                App.options.data.Quality = ee.Image(
                                    App.options.collections[regionName][collectioName].assets.quality);

                            }
                            if (regionName == 'mapbiomas-atlantic-forest' & collectioName == 'collection-2.0') {

                                App.options.data.Quality = ee.Image(
                                    App.options.collections[regionName][collectioName].assets.quality);

                            }
                            if (regionName == 'mapbiomas-pampa' & collectioName == 'collection-1.0') {

                                App.options.data.Quality = ee.Image(
                                    App.options.collections[regionName][collectioName].assets.quality);

                            }

                            var year = App.options.collections[regionName][collectioName].periods.Coverage.slice(-1)[0];

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

            Map.addLayer(App.options.activeFeature.style({
                color: 'ff0000',
                width: 1,
                fillColor: 'ff000033',
            }), {},
                tableName.split('/')[3],
                true);

        },

        loadTable: function (tableName) {

            App.options.table = ee.FeatureCollection(tableName);

            App.options.activeFeature = App.options.table;

            Map.clear();

            Map.addLayer(App.options.activeFeature.style({
                color: 'ff0000',
                width: 1,
                fillColor: 'ff000033',
            }), {},
                tableName.split('/').reverse()[0],
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
                                    App.options.activeName = featureName;
                                    App.options.featureName = featureName;

                                    ee.Number(1).evaluate(
                                        function (a) {
                                            var regionName = App.ui.form.selectRegion.getValue();
                                            var collectionName = App.ui.form.selectCollection.getValue();

                                            App.ui.loadFeature(featureName);

                                            App.ui.makeLayersList(
                                                featureName,
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

            // Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.addLayer(App.options.activeFeature.style({
                color: 'ff0000',
                width: 1,
                fillColor: 'ff000033',
            }), {},
                name,
                true);

        },

        addImageLayer: function (period, label, region) {


            var image = App.options.data[App.options.dataType]
                .select([App.options.bandsNames[App.options.dataType] + period])
                .clip(region);

            if (App.options.dataType == 'Transitions') {
                image = App.remapTransitions(image);
            }

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

                            if (App.options.dataType == 'Coverage') {

                                className = ee.Dictionary(App.options.className)
                                    .get(feature.get('class'));

                                feature = feature.set('class_name', className).set('band', band);

                            } else if (App.options.dataType == 'Transitions') {

                                var classNamet0 = ee.Dictionary(App.options.className)
                                    .get(ee.Number(feature.get('class')).divide(100).int());
                                var classNamet1 = ee.Dictionary(App.options.className)
                                    .get(ee.Number(feature.get('class')).mod(100).int());

                                feature = feature.set('from_class', classNamet0).set('to_class', classNamet1).set('band', band);
                            } else {

                                className = ee.String(feature.get('class')).cat(' observations');
                                feature = feature.set('class_name', className).set('band', band);
                            }

                            return feature;
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

        form: {

            init: function () {

                var blob = ee.Blob(App.options.logo.uri);

                blob.string().evaluate(
                    function (str) {
                        str = str.replace(/\n/g, '');
                        App.options.logo.base64 = ui.Label({
                            imageUrl: str,
                        });
                        App.ui.form.panelLogo.add(App.options.logo.base64);
                    }
                );

                App.ui.form.panelMain.add(App.ui.form.panelLogo);
                App.ui.form.panelMain.add(App.ui.form.labelTitle);
                App.ui.form.panelMain.add(App.ui.form.labelSubtitle);
                App.ui.form.panelMain.add(App.ui.form.labelLink);
                App.ui.form.panelMain.add(App.ui.form.panelLink1);
                App.ui.form.panelMain.add(App.ui.form.panelLink2);

                App.ui.form.panelMain.add(App.ui.form.tabs);
                App.ui.form.panelMain.add(App.ui.form.panel1);

                App.ui.form.tab1.add(App.ui.form.checkboxTab1);
                App.ui.form.tab2.add(App.ui.form.checkboxTab2);

                App.ui.form.tabs.add(App.ui.form.tab1);
                App.ui.form.tabs.add(App.ui.form.tab2);

                App.ui.form.panelLink1.add(App.ui.form.labelLink1);
                App.ui.form.panelLink1.add(App.ui.form.labelLink2);
                App.ui.form.panelLink1.add(App.ui.form.labelLink3);
                App.ui.form.panelLink1.add(App.ui.form.labelLink4);
                App.ui.form.panelLink1.add(App.ui.form.labelLink5);
                App.ui.form.panelLink1.add(App.ui.form.labelLink6);
                App.ui.form.panelLink2.add(App.ui.form.labelLink7);

                App.ui.form.panelRegion.add(App.ui.form.labelRegion);
                App.ui.form.panelRegion.add(App.ui.form.selectRegion);

                App.ui.form.panelCollection.add(App.ui.form.labelCollection);
                App.ui.form.panelCollection.add(App.ui.form.selectCollection);

                App.ui.form.panelFeatureCollections.add(App.ui.form.labelTables);
                App.ui.form.panelFeatureCollections.add(App.ui.form.selectFeatureCollections);

                App.ui.form.panelProperties.add(App.ui.form.labelProperties);
                App.ui.form.panelProperties.add(App.ui.form.selectProperties);

                App.ui.form.panelFeature.add(App.ui.form.labelFeature);
                App.ui.form.panelFeature.add(App.ui.form.selectFeature);

                App.ui.form.panelDataType.add(App.ui.form.labelDataType);
                App.ui.form.panelDataType.add(App.ui.form.selectDataType);

                App.ui.form.panelBuffer.add(App.ui.form.labelBuffer);
                App.ui.form.panelBuffer.add(App.ui.form.selectBuffer);

                App.ui.form.panel1.add(App.ui.form.panelRegion);
                App.ui.form.panel1.add(App.ui.form.panelCollection);
                App.ui.form.panel1.add(App.ui.form.panelFeatureCollections);
                App.ui.form.panel1.add(App.ui.form.panelStates);
                App.ui.form.panel1.add(App.ui.form.panelProperties);
                App.ui.form.panel1.add(App.ui.form.panelFeature);
                App.ui.form.panel1.add(App.ui.form.panelDataType);
                App.ui.form.panel1.add(App.ui.form.panelBuffer);

                App.ui.form.panel1.add(App.ui.form.labelLayers);
                App.ui.form.panel1.add(App.ui.form.panelLayersList);

                App.ui.form.panel1.add(App.ui.form.buttonExport2Drive);
                App.ui.form.panel1.add(App.ui.form.labelNotes);

                ui.root.add(App.ui.form.panelMain);

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
                    'margin': '10px 0px 5px 15px',
                },
            }),

            panelLink1: ui.Panel({
                'layout': ui.Panel.Layout.flow('horizontal'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelLink2: ui.Panel({
                'layout': ui.Panel.Layout.flow('horizontal'),
                'style': {
                    'stretch': 'horizontal'
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

            labelSubtitle: ui.Label('Land Use and Land Cover', {
                // 'fontWeight': 'bold',
                // 'padding': '1px',
                'fontSize': '14px'
            }),

            labelLink: ui.Label('Legend codes:', {
                'fontSize': '10px'
            }
            ),

            labelLink1: ui.Label('Amazon', {
                'fontSize': '10px',
            },
                'http://amazonia.mapbiomas.org/codigos-de-la-leyenda'
            ),

            labelLink2: ui.Label('Atlantic Forest', {
                'fontSize': '10px'
            },
                'http://bosqueatlantico.mapbiomas.org/codigos-de-la-leyenda'
            ),

            labelLink3: ui.Label('Brazil', {
                'fontSize': '10px'
            },
                'https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2023/08/Legenda-Colecao-8-LEGEND-CODE.pdf'
            ),

            labelLink4: ui.Label('Chaco', {
                'fontSize': '10px'
            },
                'http://chaco.mapbiomas.org/codigos-de-la-leyenda-1'
            ),

            labelLink5: ui.Label('Indonesia', {
                'fontSize': '10px',
            },
                'https://mapbiomas.nusantara.earth/assets/files/Kode%20Legenda%20-%20Legend%20Code.pdf'
            ),

            labelLink6: ui.Label('Pampa', {
                'fontSize': '10px'
            },
                'http://pampa.mapbiomas.org/codigos-de-la-leyenda-1'
            ),


            labelLink7: ui.Label('Peru', {
                'fontSize': '10px',
            },
                'https://mapbiomas-peru.s3.amazonaws.com/DESCARGAS/LEYENDA/C%C3%B3digo_de_la_Leyenda_-_MB_Peru_C1.pdf'
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
                    'mapbiomas-atlantic-forest',
                    'mapbiomas-brazil',
                    'mapbiomas-chaco',
                    'mapbiomas-indonesia',
                    'mapbiomas-pampa',
                    'mapbiomas-peru',
                    'mapbiomas-bolivia',
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
                'items': ['Coverage', 'Transitions'],
                'placeholder': 'Coverage',
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
                    '10km',
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
                        '10km': 10000,
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
                                App.ui.makeLayersList(
                                    App.options.activeName.split('/')[3],
                                    App.options.activeFeature,
                                    App.options.periods[App.options.dataType]
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

            // panels and tabs
            tabs: ui.Panel({
                layout: ui.Panel.Layout.flow('horizontal')
            }),

            checkboxTab1: ui.Checkbox({
                'label': '  Toolkit ',
                'style': {
                    'margin': '5px 0px 5px -16px',
                    'stretch': 'horizontal',
                    'backgroundColor': '#00000000',
                },
                'onChange': function (checked) {
                    if (checked) {
                        App.ui.form.checkboxTab2.setValue(false);
                        App.ui.form.tab1.style().set('border', '1px solid #808080');
                        App.ui.form.tab2.style().set('border', '1px solid #80808033');

                        App.ui.form.panelMain.remove(App.ui.form.panel2);
                        App.ui.form.panelMain.remove(App.ui.form.panel3);
                        App.ui.form.panelMain.add(App.ui.form.panel1);
                    }
                }
            }),

            checkboxTab2: ui.Checkbox({
                'label': '  Direct Link',
                'style': {
                    'margin': '5px 20px 5px -16px',
                    'stretch': 'horizontal',
                    'backgroundColor': '#00000000',
                },
                'onChange': function (checked) {
                    if (checked) {
                        App.ui.form.checkboxTab1.setValue(false);
                        App.ui.form.tab1.style().set('border', '1px solid #80808033');
                        App.ui.form.tab2.style().set('border', '1px solid #808080');

                        App.ui.form.panelMain.remove(App.ui.form.panel1);
                        App.ui.form.panelMain.add(App.ui.form.panel2);
                        App.ui.form.panelMain.add(App.ui.form.panel3);
                    }

                }
            }),

            tab1: ui.Panel({
                'style': {
                    'width': '100px',
                    'backgroundColor': '#dddddd00',
                    'stretch': 'horizontal',
                    'border': '1px solid #808080',
                    'margin': '0px 0px 0px 6px'
                },
            }),

            tab2: ui.Panel({
                'style': {
                    'width': '100px',
                    'backgroundColor': '#dddddd00',
                    'stretch': 'horizontal',
                    'border': '1px solid #80808033',
                }
            }),

            panel1: ui.Panel({
                style: {
                    'stretch': 'both'
                }
            }),

            panel2: ui.Panel({
                widgets: [
                    ui.Label('Brazil'),
                    ui.Panel({
                        widgets: [
                            ui.Label({ value: '1985', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1985.tif' }),
                            ui.Label({ value: '1986', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1986.tif' }),
                            ui.Label({ value: '1987', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1987.tif' }),
                            ui.Label({ value: '1988', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1988.tif' }),
                            ui.Label({ value: '1989', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1989.tif' }),
                            ui.Label({ value: '1990', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1990.tif' }),
                            ui.Label({ value: '1991', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1991.tif' }),
                            ui.Label({ value: '1992', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1992.tif' }),
                            ui.Label({ value: '1993', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1993.tif' }),
                            ui.Label({ value: '1994', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1994.tif' }),
                            ui.Label({ value: '1995', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1995.tif' }),
                            ui.Label({ value: '1996', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1996.tif' }),
                            ui.Label({ value: '1997', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1997.tif' }),
                            ui.Label({ value: '1998', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1998.tif' }),
                            ui.Label({ value: '1999', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_1999.tif' }),
                            ui.Label({ value: '2000', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2000.tif' }),
                            ui.Label({ value: '2001', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2001.tif' }),
                            ui.Label({ value: '2002', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2002.tif' }),
                            ui.Label({ value: '2003', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2003.tif' }),
                            ui.Label({ value: '2004', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2004.tif' }),
                            ui.Label({ value: '2005', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2005.tif' }),
                            ui.Label({ value: '2006', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2006.tif' }),
                            ui.Label({ value: '2007', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2007.tif' }),
                            ui.Label({ value: '2008', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2008.tif' }),
                            ui.Label({ value: '2009', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2009.tif' }),
                            ui.Label({ value: '2010', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2010.tif' }),
                            ui.Label({ value: '2011', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2011.tif' }),
                            ui.Label({ value: '2012', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2012.tif' }),
                            ui.Label({ value: '2013', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2013.tif' }),
                            ui.Label({ value: '2014', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2014.tif' }),
                            ui.Label({ value: '2015', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2015.tif' }),
                            ui.Label({ value: '2016', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2016.tif' }),
                            ui.Label({ value: '2017', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2017.tif' }),
                            ui.Label({ value: '2018', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2018.tif' }),
                            ui.Label({ value: '2019', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2019.tif' }),
                            ui.Label({ value: '2020', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2020.tif' }),
                            ui.Label({ value: '2021', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2021.tif' }),
                            ui.Label({ value: '2022', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/brasil/collection_8/lclu/coverage/brasil_coverage_2022.tif' }),
                        ],
                        'layout': ui.Panel.Layout.flow('horizontal', true),
                        style: {
                            'border': '1px grey solid',
                            'margin': '0px 6px 0px 6px'
                        }
                    }),
                ],
                style: {
                    'stretch': 'both'
                }
            }),

            panel3: ui.Panel({
                widgets: [
                    ui.Label('Pampa'),
                    ui.Panel({
                        widgets: [
                            ui.Label({ value: '1985', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1985.tif' }),
                            ui.Label({ value: '1986', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1986.tif' }),
                            ui.Label({ value: '1987', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1987.tif' }),
                            ui.Label({ value: '1988', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1988.tif' }),
                            ui.Label({ value: '1989', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1989.tif' }),
                            ui.Label({ value: '1990', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1990.tif' }),
                            ui.Label({ value: '1991', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1991.tif' }),
                            ui.Label({ value: '1992', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1992.tif' }),
                            ui.Label({ value: '1993', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1993.tif' }),
                            ui.Label({ value: '1994', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1994.tif' }),
                            ui.Label({ value: '1995', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1995.tif' }),
                            ui.Label({ value: '1996', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1996.tif' }),
                            ui.Label({ value: '1997', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1997.tif' }),
                            ui.Label({ value: '1998', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1998.tif' }),
                            ui.Label({ value: '1999', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_1999.tif' }),
                            ui.Label({ value: '2000', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2000.tif' }),
                            ui.Label({ value: '2001', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2001.tif' }),
                            ui.Label({ value: '2002', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2002.tif' }),
                            ui.Label({ value: '2003', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2003.tif' }),
                            ui.Label({ value: '2004', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2004.tif' }),
                            ui.Label({ value: '2005', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2005.tif' }),
                            ui.Label({ value: '2006', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2006.tif' }),
                            ui.Label({ value: '2007', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2007.tif' }),
                            ui.Label({ value: '2008', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2008.tif' }),
                            ui.Label({ value: '2009', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2009.tif' }),
                            ui.Label({ value: '2010', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2010.tif' }),
                            ui.Label({ value: '2011', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2011.tif' }),
                            ui.Label({ value: '2012', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2012.tif' }),
                            ui.Label({ value: '2013', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2013.tif' }),
                            ui.Label({ value: '2014', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2014.tif' }),
                            ui.Label({ value: '2015', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2015.tif' }),
                            ui.Label({ value: '2016', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2016.tif' }),
                            ui.Label({ value: '2017', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2017.tif' }),
                            ui.Label({ value: '2018', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2018.tif' }),
                            ui.Label({ value: '2019', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2019.tif' }),
                            ui.Label({ value: '2020', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2020.tif' }),
                            ui.Label({ value: '2021', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/initiatives/pampa/images_tiff/coverage/pampa_coverage_2021.tif' }),
                        ],
                        'layout': ui.Panel.Layout.flow('horizontal', true),
                        style: {
                            'border': '1px grey solid',
                            'margin': '0px 6px 0px 6px'
                        }
                    }),
                ],
                style: {
                    'stretch': 'both'
                }
            }),
        },
    }
};

App.init();

App.setVersion();