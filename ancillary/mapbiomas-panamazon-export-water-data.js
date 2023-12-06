/**
 * 
 */

var asset = "projects/mapbiomas-raisg/TRANSVERSALES/GTAGUA/COLECCION1/agua";
var assetOutput = "projects/mapbiomas-raisg/public/collection5"
var years = [
    /* 1985, 1986, 1987, 1988, 1989, 1990,
    1991, 1992, 1993, 1994, 1995, 1996,
    1997, 1998, 1999,  */2000, 2001, 2002,
    2003, 2004, 2005, 2006, 2007, 2008,
    2009, 2010, 2011, 2012, 2013, 2014,
    2015, 2016, 2017, 2018, 2019, 2020,
    2021, 2022
];

var inputVersion = '1';

var region = ee.Geometry.Polygon(
    [
        [
            [-81.23703132331441, 10.371866133558363],
            [-81.23703132331441, -21.23542723801477],
            [-43.18039069831440, -21.23542723801477],
            [-43.18039069831440, 10.371866133558363]
        ]
    ],
    null, false
);

var annualWater = ee.Image(
    years.map(
        function (year) {
            var assetName = year.toString() + '-' + inputVersion;

            return ee.Image(asset + '/' + assetName).rename('annual_water_coverage_' + year.toString());
        }
    )
).int8();

var waterFrequency = annualWater
    .gt(0)
    .reduce(ee.Reducer.sum())
    .int8()
    .rename("water_frequency_2000_2022");

Map.addLayer(annualWater);
Map.addLayer(waterFrequency);

print(annualWater);
print(waterFrequency);

Export.image.toAsset({
    image: annualWater,
    description: 'mapbiomas_raisg_panamazonia_collection1_annual_water_coverage_v2',
    assetId: assetOutput + '/mapbiomas_raisg_panamazonia_collection1_annual_water_coverage_v2',
    pyramidingPolicy: {
        '.default': 'mode',
    },
    region: region,
    scale: 30,
    maxPixels: 1e13
});

Export.image.toAsset({
    image: waterFrequency,
    description: 'mapbiomas_raisg_panamazonia_collection1_water_frequency_v2',
    assetId: assetOutput + '/mapbiomas_raisg_panamazonia_collection1_water_frequency_v2',
    pyramidingPolicy: {
        '.default': 'mode',
    },
    region: region,
    scale: 30,
    maxPixels: 1e13
});