/**
 * @name
 *      Mapbiomas User Toolkit Download - User vectores
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
 * 
 * @see
 *      Get the MapBiomas exported data in your "Google Drive/MAPBIOMAS-EXPORT" folder
 *      Code and Tutorial - https://github.com/mapbiomas-brazil/user-toolkit
 */
var palettes = require('users/mapbiomas/modules:Palettes.js');
var logos = require('users/mapbiomas/modules:Logos.js');

var App = {

    options: {
        version: '1.1.1',
        logo: logos.mapbiomas,
        assets: {
            integration: 'projects/mapbiomas-workspace/public/collection4/mapbiomas_collection40_integration_v1',
            transitions: 'projects/mapbiomas-workspace/public/collection4/mapbiomas_collection40_transitions_v1',
            vectors: [
                'projects/mapbiomas-workspace/AUXILIAR/areas-protegidas',
                'projects/mapbiomas-workspace/AUXILIAR/municipios-2016',
                'projects/mapbiomas-workspace/AUXILIAR/estados-2017',
                'projects/mapbiomas-workspace/AUXILIAR/biomas',
                'projects/mapbiomas-workspace/AUXILIAR/bacias-nivel-1',
                'projects/mapbiomas-workspace/AUXILIAR/bacias-nivel-2',
            ]
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

        periods: {
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
                "1988_1989", "1989_1990", "1990_1991", "1985_2018",
                "1991_1992", "1992_1993", "1993_1994", "2010_2018",
                "2017_2018", "1994_1995", "1995_1996", "1996_1997",
                "2000_2010", "1987_1988", "1997_1998", "1998_1999",
                "1999_2000", "1990_2000", "1986_1987", "2000_2001",
                "2001_2002", "2002_2003", "2015_2018", "1985_1986",
                "2003_2004", "2004_2005", "2005_2006", "2010_2015",
                "2010_2016", "2006_2007", "2007_2008", "2008_2009",
                "2005_2010", "2002_2010", "2009_2010", "2010_2011",
                "2011_2012", "2000_2005", "1994_2002", "2012_2013",
                "2013_2014", "2014_2015", "1995_2000", "2012_2018",
                "2015_2016", "2016_2017", "1985_1990", "1990_1995",
                "2008_2018",
            ]
        },
        bandsNames: {
            'Coverage': 'classification_',
            'Transitions': 'transition_'
        },

        dataType: 'Coverage',

        data: {
            'Coverage': null,
            'Transitions': null,
        },

        fileDimensions: {
            'Coverage': 256 * 512,
            'Transitions': 256 * 124,
        },

        ranges: {
            'Coverage': {
                'min': 0,
                'max': 34
            },
            'Transitions': {
                'min': -2,
                'max': 3
            },
        },

        vector: null,
        activeFeature: null,
        activeName: '',

        palette: {
            'Coverage': palettes.get('classification2'),
            'Transitions': ['ffa500', 'ff0000', '818181', '06ff00', '4169e1', '8a2be2']
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

    },

    init: function () {

        this.ui.init();
        this.loadImages();
        this.startMap();
    },

    setVersion: function () {

        App.ui.form.labelTitle.setValue('MapBiomas User Toolkit ' + App.options.version);

    },

    loadImages: function () {

        App.options.data.Coverage = ee.Image(App.options.assets.integration);
        App.options.data.Transitions = ee.Image(App.options.assets.transitions);

    },

    startMap: function () {

        Map.centerObject(App.options.data.Coverage, 5);

        var imageLayer = ui.Map.Layer({
            'eeObject': App.options.data.Coverage,
            'visParams': {
                'bands': ['classification_2018'],
                'palette': App.options.palette.Coverage,
                'min': 0,
                'max': 34,
                'format': 'png'
            },
            'name': 'Mapbiomas 2018',
            'shown': true,
            'opacity': 1.0
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
            .replace(/["'()]/g, '');

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

        setDataType: function (dataType) {

            App.options.dataType = dataType;

        },

        loadTablesNames: function () {

            App.ui.form.selectFeatureCollections.setPlaceholder('loading tables names...');

            var roots = ee.data.getAssetRoots()
                .map(
                    function (obj) {
                        return obj.id;
                    });

            var tablesNames = ee.data.getList({
                'id': roots[0] + '/MAPBIOMAS'
            }).map(
                function (obj) {
                    return obj.id;
                });

            App.ui.form.selectFeatureCollections = ui.Select({
                'items': ['None'].concat(App.options.assets.vectors).concat(tablesNames),
                'placeholder': 'select table',
                'onChange': function (tableName) {
                    if (tableName != 'None') {
                        App.options.activeName = tableName;

                        if (tableName === App.options.assets.vectors[1]) {
                            App.ui.form.panelStates.add(App.ui.form.labelStates);
                            App.ui.form.panelStates.add(App.ui.form.selectStates);
                        } else {
                            App.ui.form.panelStates.remove(App.ui.form.labelStates);
                            App.ui.form.panelStates.remove(App.ui.form.selectStates);
                            ee.Number(1).evaluate(
                                function (a) {
                                    App.ui.loadTable(tableName);
                                    App.ui.makeLayersList(tableName.split('/')[3], App.options.activeFeature, App.options.periods[App.options.dataType]);
                                    App.ui.loadPropertiesNames();
                                    App.ui.form.selectDataType.setDisabled(false);
                                }
                            );

                            App.ui.loadingBox();
                        }
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

            ee.Feature(App.options.table.first()).propertyNames().evaluate(
                function (propertyNames) {
                    App.ui.form.selectProperties = ui.Select({
                        'items': ['None'].concat(propertyNames),
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

                        // print(featureNameList);

                        App.ui.form.selectFeature = ui.Select({
                            'items': ['None'].concat(featureNameList),
                            'placeholder': 'select feature',
                            'onChange': function (featureName) {
                                if (featureName != 'None') {
                                    App.options.featureName = featureName;

                                    ee.Number(1).evaluate(
                                        function (a) {
                                            App.ui.loadFeature(featureName);
                                            App.ui.makeLayersList(featureName, App.options.activeFeature, App.options.periods[App.options.dataType]);
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

            for (var i = 0; i < layers.length(); i++) {

                var selected = layers.get(i).getValue();

                if (selected) {

                    var period = App.options.periods[App.options.dataType][i];
                    var featureName = App.formatName(App.ui.form.selectFeature.getValue() || '');

                    var fileName = 'mapbiomas-' + featureName + '-' + period;

                    fileName = fileName.replace(/--/g, '-').replace(/--/g, '-');
                    fileName = App.formatName(fileName);
                    print(fileName)
                    var taskId = ee.data.newTaskId(1);

                    var data = App.options.data[App.options.dataType]
                        .select([App.options.bandsNames[App.options.dataType] + period]);

                    if (App.options.bufferDistance !== 0) {
                        data = data.clip(App.options.activeFeature.geometry().buffer(App.options.bufferDistance))
                    }

                    var params = {
                        type: 'EXPORT_IMAGE',
                        json: ee.Serializer.toJSON(data),
                        description: fileName,
                        driveFolder: 'MAPBIOMAS-EXPORT',
                        driveFileNamePrefix: fileName,
                        region: JSON.stringify(App.options.activeFeature.geometry().bounds().getInfo()),
                        scale: 30,
                        maxPixels: 1e13,
                        skipEmptyTiles: true,
                        fileDimensions: App.options.fileDimensions[App.options.dataType],
                    };

                    var status = ee.data.startProcessing(taskId, params);

                    if (status) {
                        if (status.started == 'OK') {
                            print("Exporting data...")
                        } else {
                            print("Exporting error!")
                        }
                    }
                }
            }
        },

        form: {

            init: function () {

                this.panelMain.add(this.panelLogo);
                this.panelMain.add(this.labelTitle);
                this.panelMain.add(this.labelCollection);

                this.panelLogo.add(App.options.logo);

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

                App.ui.loadTablesNames();
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

            labelCollection: ui.Label('Collection 4.0', {
                'fontWeight': 'bold',
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelTitle: ui.Label('MapBiomas User Toolkit', {
                'fontWeight': 'bold',
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelType: ui.Label('Type:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelTables: ui.Label('Tables:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelProperties: ui.Label('Properties:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelFeature: ui.Label('Features:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelDataType: ui.Label('Data Type:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelBuffer: ui.Label('Buffer:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelLayers: ui.Label('Layers:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelNotes: ui.Label('Click on OK button to start the task.', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelStates: ui.Label('States:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            selectName: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
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
                'onChange': function (dataType) {

                    App.ui.setDataType(dataType);
                    App.ui.makeLayersList(App.options.activeName, App.options.activeFeature, App.options.periods[dataType]);

                },
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
                    'padding': '2px',
                    'stretch': 'horizontal'
                }
            }),

        },
    }
};

App.init();

App.setVersion();