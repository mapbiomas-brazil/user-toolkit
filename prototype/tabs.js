



var App = {

    init: function () {
        App.ui.int();
    },

    ui: {
        int: function () {
            App.ui.form.panelMain.add(App.ui.form.tabs);
            App.ui.form.panelMain.add(App.ui.form.panel1);

            App.ui.form.tab1.add(App.ui.form.checkboxTab1);
            App.ui.form.tab2.add(App.ui.form.checkboxTab2);

            App.ui.form.tabs.add(App.ui.form.tab1);
            App.ui.form.tabs.add(App.ui.form.tab2);

            ui.root.add(App.ui.form.panelMain);
        },

        form: {
            panelMain: ui.Panel(),

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
                    }

                }
            }),

            tab1: ui.Panel({
                'style': {
                    'width': '100px',
                    'backgroundColor': '#dddddd00',
                    'stretch': 'horizontal',
                    'border': '1px solid #808080'
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
                widgets: [ui.Label('Painel 1')],
                style: {
                    width: '400px'
                }
            }),

            panel2: ui.Panel({
                widgets: [
                    ui.Label('Brazil'),
                    ui.Panel({
                        widgets: [
                            ui.Label({ value: '1985', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1985.tif' }),
                            ui.Label({ value: '1986', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1986.tif' }),
                            ui.Label({ value: '1987', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1987.tif' }),
                            ui.Label({ value: '1988', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1988.tif' }),
                            ui.Label({ value: '1989', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1989.tif' }),
                            ui.Label({ value: '1990', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1990.tif' }),
                            ui.Label({ value: '1991', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1991.tif' }),
                            ui.Label({ value: '1992', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1992.tif' }),
                            ui.Label({ value: '1993', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1993.tif' }),
                            ui.Label({ value: '1994', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1994.tif' }),
                            ui.Label({ value: '1995', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1995.tif' }),
                            ui.Label({ value: '1996', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1996.tif' }),
                            ui.Label({ value: '1997', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1997.tif' }),
                            ui.Label({ value: '1998', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1998.tif' }),
                            ui.Label({ value: '1999', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_1999.tif' }),
                            ui.Label({ value: '2000', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2000.tif' }),
                            ui.Label({ value: '2001', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2001.tif' }),
                            ui.Label({ value: '2002', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2002.tif' }),
                            ui.Label({ value: '2003', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2003.tif' }),
                            ui.Label({ value: '2004', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2004.tif' }),
                            ui.Label({ value: '2005', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2005.tif' }),
                            ui.Label({ value: '2006', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2006.tif' }),
                            ui.Label({ value: '2007', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2007.tif' }),
                            ui.Label({ value: '2008', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2008.tif' }),
                            ui.Label({ value: '2009', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2009.tif' }),
                            ui.Label({ value: '2010', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2010.tif' }),
                            ui.Label({ value: '2011', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2011.tif' }),
                            ui.Label({ value: '2012', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2012.tif' }),
                            ui.Label({ value: '2013', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2013.tif' }),
                            ui.Label({ value: '2014', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2014.tif' }),
                            ui.Label({ value: '2015', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2015.tif' }),
                            ui.Label({ value: '2016', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2016.tif' }),
                            ui.Label({ value: '2017', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2017.tif' }),
                            ui.Label({ value: '2018', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2018.tif' }),
                            ui.Label({ value: '2019', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2019.tif' }),
                            ui.Label({ value: '2020', targetUrl: 'https://storage.googleapis.com/mapbiomas-public/brasil/collection-6/lclu/coverage/brasil_coverage_2020.tif' }),
                        ],
                        'layout': ui.Panel.Layout.flow('horizontal', true)
                    }),
                ],
                style: {
                    width: '400px'
                }
            }),

        }
    }
};

App.init();