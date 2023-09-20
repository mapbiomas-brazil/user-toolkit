/**
 * 
 */

var asset = "projects/mapbiomas-workspace/TRANSVERSAIS/COLECAO8/agua";
var assetOutput = "projects/mapbiomas-workspace/public/collection8"
var years = [
    1985, 1986, 1987, 1988, 1989, 1990,
    1991, 1992, 1993, 1994, 1995, 1996,
    1997, 1998, 1999, 2000, 2001, 2002,
    2003, 2004, 2005, 2006, 2007, 2008,
    2009, 2010, 2011, 2012, 2013, 2014,
    2015, 2016, 2017, 2018, 2019, 2020,
    2021, 2022
];

var inputVersion = '1';

var region = ee.Geometry.Polygon(
    [
        [
            [-74.89726562500002, 7.912024007342442],
            [-74.89726562500002, -34.79152285156706],
            [-33.06132812500001, -34.79152285156706],
            [-33.06132812500001, 7.912024007342442]
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
    .rename("water_frequency_1985_2022");

Map.addLayer(annualWater);
Map.addLayer(waterFrequency);

print(annualWater);
print(waterFrequency);

Export.image.toAsset({
    image: annualWater,
    description: 'mapbiomas_brazil_collection2_annual_water_coverage_v1',
    assetId: assetOutput + '/mapbiomas_brazil_collection2_annual_water_coverage_v1',
    pyramidingPolicy: {
        '.default': 'mode',
    },
    region: region,
    scale: 30,
    maxPixels: 1e13
});

Export.image.toAsset({
    image: waterFrequency,
    description: 'mapbiomas_brazil_collection2_water_frequency_v1',
    assetId: assetOutput + '/mapbiomas_brazil_collection2_water_frequency_v1',
    pyramidingPolicy: {
        '.default': 'mode',
    },
    region: region,
    scale: 30,
    maxPixels: 1e13
});