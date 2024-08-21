

/**
 * 
 */
var asset = 'projects/mapbiomas-raisg/TRANSVERSALES/GTAGUA/COLECCION1/agua';

var countries = {
    'brazil': {
        'asset': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO8/VERSAO-1/country-raster',
        'output': ''
    },
    // 'bolivia': {
    //     'asset': 'projects/mapbiomas-raisg/BOLIVIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/pais-raster',
    //     'output': ''
    // },
    // 'colombia': {
    //     'asset': 'projects/mapbiomas-raisg/COLOMBIA/DATOS_AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-1-raster',
    //     'output': ''
    // },
    // 'ecuador': {
    //     'asset': 'projects/mapbiomas-raisg/MAPBIOMAS-ECUADOR/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/VERSION-2/nivel-politico-1-raster',
    //     'output': ''
    // },
    // 'peru': {
    //     'asset': 'projects/mapbiomas-raisg/MAPBIOMAS-PERU/DATOS-AUXILIARES/ESTADISTICAS/COLECCION2/nivel-politico-1-raster',
    //     'output': ''
    // },
    // 'venezuela': {
    //     'asset': 'projects/mapbiomas-raisg/MAPBIOMAS-VENEZUELA/DATOS-AUXILIARES/ESTADISTICAS/COLECCION1/nivel-politico-1-raster',
    //     'output': ''
    // },
};

var version = '1';

// var assetOutput = 'projects/mapbiomas-public/assets/{country}/collection1/mapbiomas_{country}_collection1_water_v1';
var assetOutput = 'projects/mapbiomas-public/assets/{country}/collection1/mapbiomas_{country}_collection1_water_v1';
var assetFrequencyOutput = 'projects/mapbiomas-public/assets/{country}/collection1/mapbiomas_{country}_collection1_water_frequency_v1';

var years = [
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
];

var palette = require('users/mapbiomas/modules:Palettes.js').get('classification8');

var water = years.map(
    function (year) {
        return ee.Image(asset + '/' + year + '-' + version)
            .rename('annual_water_coverage_' + year);
    }
);

water = ee.Image(water);

print(water);

var waterFrequency = water
    .gt(0)
    .reduce(ee.Reducer.sum())
    .int8()
    .rename("water_frequency_1985_2022");

Object.keys(countries).forEach(
    function (country) {
        var assetCountryOutput = assetOutput.replace(/{country}/g, country);
        var assetFrequencyCountryOutput = assetFrequencyOutput.replace(/{country}/g, country);
        
        var assetCountry = ee.Image(countries[country].asset);
        
        print(assetCountry);

        var waterCountry = water.mask(assetCountry.gt(0)).selfMask();
        var waterFrequencyCountry = waterFrequency.mask(assetCountry.gt(0)).selfMask();

        // Map.addLayer(waterCountry, {
        //     'palette': 'blue', 
        //     'bands': 'annual_water_coverage_2022',
        //     'min': 0,
        //     'max': 33
        // }, country);

        Map.addLayer(waterFrequencyCountry, {
            'palette': ['white','blue'],
            'bands': 'water_frequency_1985_2022',
            'min': 0,
            'max': 33
        }, country + ' frequency');

        // Export.image.toAsset({
        //     'image': waterCountry.byte(),
        //     'description': assetCountryOutput.split('/').reverse()[0],
        //     'assetId': assetCountryOutput,
        //     'pyramidingPolicy': { '.default': 'mode' },
        //     'region': assetCountry.geometry().buffer(300).bounds(),
        //     'scale': 30,
        //     'maxPixels': 1e13,
        // });

        Export.image.toAsset({
            'image': waterFrequencyCountry,
            'description': assetFrequencyCountryOutput.split('/').reverse()[0],
            'assetId': assetFrequencyCountryOutput,
            'pyramidingPolicy': {
                '.default': 'mode',
            },
            'region': assetCountry.geometry().buffer(300).bounds(),
            'scale': 30,
            'maxPixels': 1e13
        });
    }
)
