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
 *    1.0.0 - Acess and download data using user's vector
 *    1.1.0 - Updated to collection 4.0
 *    1.1.1 - Updated assets
 *    1.1.2 - Fix minor issues
 *    1.1.3 - Update transitions data
 *    1.1.4 - Update transitions data to collection 4.1
 *    1.2.0 - Loads mapbiomas-brazil collection 3.1
 *          - Loads mapbiomas-brazil collection 4.0
 *          - Laods mapbiomas-chaco collection 1.0
 *          - Loads mapbiomas-amazon collection 1.0
 *          - Updated mapbiomas-amazon collection 2.0
 *    1.3.0 - Loads mapbiomas-brazil collection 5.0
 *          - Export a csv file with areas per classe and year
 *    1.3.1 - Loads mapbiomas-chaco collection 2.0
 *    1.3.2 - Loads mapbiomas-brazil collection 5.0 quality
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
        print(territotiesData);
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

        version: '1.3.2',

        logo: logos.mapbiomas,

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
                'projects/mapbiomas-workspace/AUXILIAR/areas-protegidas',
                'projects/mapbiomas-workspace/AUXILIAR/biomas-2019',
                'projects/mapbiomas-workspace/AUXILIAR/bacias-nivel-1',
                'projects/mapbiomas-workspace/AUXILIAR/bacias-nivel-2',
                'projects/mapbiomas-workspace/AUXILIAR/estados-2017',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-AC',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-AL',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-AM',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-AP',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-BA',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-CE',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-DF',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-ES',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-GO',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-MA',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-MG',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-MS',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-MT',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-PA',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-PB',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-PE',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-PI',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-PR',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-RJ',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-RN',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-RO',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-RR',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-RS',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-SC',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-SE',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-SP',
                'projects/mapbiomas-workspace/AUXILIAR/MUNICIPIOS/municipios-TO',
            ],
            'mapbiomas-amazon': [
                'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/limite-raisg-2',
                'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/biomas-2',
                'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/cuencas-2',
                'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/departamentos-2',
                'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-2',
                'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/anps-tis-2',
                'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/anps-nacionales-2',
                'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/anps-departamentales-2',
            ],
            'mapbiomas-chaco': [
                'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/paises',
                'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/limite-chaco',
                'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/departamentos',
                'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/provincias',
                'projects/mapbiomas-chaco/DATOS_AUXILIARES/ESTADISTICAS/biomas',

            ],
            // 'mapbiomas-indonesia': [

            // ],
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
            },

            'mapbiomas-indonesia': {
                'collection-1.0': {
                },
            },

            'mapbiomas-antlantic-forest': {
                'collection-1.0': {
                },
            },

            'mapbiomas-pampa': {
                'collection-1.0': {
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
                'max': 45
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
            'Coverage': palettes.get('classification5'),
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
            9: "Forest Plantation",
            10: "Non Forest Natural Formation",
            11: "Wetland",
            12: "Grassland",
            32: "Salt flat",
            29: "Rocky outcrop",
            13: "Other Non Forest Natural Formation",
            14: "Farming",
            15: "Pasture",
            18: "Agriculture",
            19: "Temporary Crops",
            39: "Soy Beans",
            20: "Sugar Cane",
            40: "Rice",
            41: "Mosaic of Crops",
            42: "Coffe",
            43: "Citrus",
            44: "Cashew",
            45: "Other",
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

        Map.centerObject(App.options.data.Coverage, 5);

        var imageLayer = ui.Map.Layer({
            'eeObject': App.options.data.Coverage,
            'visParams': {
                'bands': ['classification_' + year],
                'palette': App.options.palette.Coverage,
                'min': 0,
                'max': 45,
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

            Map.centerObject(App.options.activeFeature);

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
                            var className = ee.Dictionary(App.options.className)
                                .get(feature.get('class'));

                            return feature.set('class_name', className).set('band', band);
                        }
                    );

                    return area;
                }
            );

            areas = ee.FeatureCollection(areas).flatten();
            print(areas);

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

                this.panelMain.add(this.panelLogo);
                this.panelMain.add(this.labelTitle);
                this.panelMain.add(this.labelSubtitle);
                this.panelMain.add(this.labelLink);

                this.panelLogo.add(App.options.logo);

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

                ui.root.add(this.panelMain);

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
                    'margin': '0px 0px 0px 110px',
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

            labelNotes: ui.Label('Click on OK button to start the task.', {
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
                    // 'mapbiomas-atlantic-forest',
                    'mapbiomas-brazil',
                    'mapbiomas-chaco',
                    // 'mapbiomas-indonesia',
                    // 'mapbiomas-pampa',
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

        },
    }
};

App.init();

App.setVersion();