/**
 * @description
 *    calculate area
 * 
 * @author
 *    João Siqueira
 * 
 */

// Asset mapbiomas
var asset = "projects/mapbiomas-workspace/public/collection5/mapbiomas_collection50_integration_v1";

// Asset of regions for which you want to calculate statistics
var assetTerritories = "projects/mapbiomas-workspace/AUXILIAR/municipios-2016-raster";

// Change the scale if you need.
var scale = 30;

// Define a list of years to export
var years = [
    '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992',
    '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000',
    '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008',
    '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016',
    '2017', '2018', '2019'
];

// Define a Google Drive output folder 
var driverFolder = 'AREA-EXPORT';

/**
 * 
 */
// Territory image
var territory = ee.Image(assetTerritories);

// LULC mapbiomas image
var mapbiomas = ee.Image(asset).selfMask();

// Image area in km2
var pixelArea = ee.Image.pixelArea().divide(1000000);

// Geometry to export
var geometry = mapbiomas.geometry();

/**
 * Convert a complex obj to a feature collection
 * @param obj 
 */
var convert2table = function (obj) {

    obj = ee.Dictionary(obj);

    var territory = obj.get('territory');

    var classesAndAreas = ee.List(obj.get('groups'));

    var tableRows = classesAndAreas.map(
        function (classAndArea) {
            classAndArea = ee.Dictionary(classAndArea);

            var classId = classAndArea.get('class');
            var area = classAndArea.get('sum');

            var tableColumns = ee.Feature(null)
                .set('territory', territory)
                .set('class', classId)
                .set('area', area);

            return tableColumns;
        }
    );

    return ee.FeatureCollection(ee.List(tableRows));
};

/**
 * Calculate area crossing a cover map (deforestation, mapbiomas)
 * and a region map (states, biomes, municipalites)
 * @param image 
 * @param territory 
 * @param geometry
 */
var calculateArea = function (image, territory, geometry) {

    var reducer = ee.Reducer.sum().group(1, 'class').group(1, 'territory');

    var territoriesData = pixelArea.addBands(territory).addBands(image)
        .reduceRegion({
            reducer: reducer,
            geometry: geometry,
            scale: scale,
            maxPixels: 1e12
        });

    territoriesData = ee.List(territoriesData.get('groups'));

    var areas = territoriesData.map(convert2table);

    areas = ee.FeatureCollection(areas).flatten();

    return areas;
};

// Iterate over years, select the classification and calculate area
var areas = years.map(
    function (year) {
        var image = mapbiomas.select('classification_' + year);

        var areas = calculateArea(image, territory, geometry);

        // set additional properties
        areas = areas.map(
            function (feature) {
                return feature.set('year', year);
            }
        );

        return areas;
    }
);

// Convert a collection of collections into a single collection
areas = ee.FeatureCollection(areas).flatten();

// Export a csv file to Google Drive
Export.table.toDrive({
    collection: areas,
    description: 'areas-teste-toolkit',
    folder: driverFolder,
    fileNamePrefix: 'areas-teste-toolkit',
    fileFormat: 'CSV'
});
