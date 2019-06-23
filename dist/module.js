System.register(["jquery.flot", "./lib/flot/jquery.flot.gauge", "jquery.flot.time", "jquery.flot.crosshair", "./lib/donut/simple-donut-jquery", "lodash", "jquery", "app/core/utils/kbn", "app/core/config", "app/core/time_series2", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var lodash_1, jquery_1, kbn_1, config_1, time_series2_1, sdk_1, BlendStatCtrl;
    var __moduleName = context_1 && context_1.id;
    function getColorForValue(data, value) {
        if (!lodash_1.default.isFinite(value)) {
            return null;
        }
        for (var i = data.thresholds.length; i > 0; i--) {
            if (value >= data.thresholds[i - 1]) {
                return data.colorMap[i];
            }
        }
        return lodash_1.default.first(data.colorMap);
    }
    exports_1("getColorForValue", getColorForValue);
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {
            BlendStatCtrl = (function (_super) {
                __extends(BlendStatCtrl, _super);
                function BlendStatCtrl($scope, $injector, $sanitize, $location) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$sanitize = $sanitize;
                    _this.$location = $location;
                    _this.dataType = 'timeseries';
                    _this.valueNameOptions = [
                        { value: 'min', text: 'Min' },
                        { value: 'max', text: 'Max' },
                        { value: 'avg', text: 'Average' },
                        { value: 'current', text: 'Current' },
                        { value: 'total', text: 'Total' },
                        { value: 'name', text: 'Name' },
                        { value: 'first', text: 'First' },
                        { value: 'delta', text: 'Delta' },
                        { value: 'diff', text: 'Difference' },
                        { value: 'range', text: 'Range' },
                        { value: 'last_time', text: 'Time of last point' },
                    ];
                    _this.blendNameOptions = [
                        { value: 'min', text: 'Min' },
                        { value: 'max', text: 'Max' },
                        { value: 'avg', text: 'Average' },
                        { value: 'total', text: 'Total' },
                    ];
                    _this.panelDefaults = {
                        links: [],
                        datasource: null,
                        maxDataPoints: 100,
                        interval: null,
                        targets: [{}],
                        cacheTimeout: null,
                        format: 'none',
                        prefix: '',
                        postfix: '',
                        nullText: null,
                        valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
                        mappingTypes: [{ name: 'value to text', value: 1 }, { name: 'range to text', value: 2 }],
                        rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
                        mappingType: 1,
                        nullPointMode: 'connected',
                        valueName: 'avg',
                        blendName: 'total',
                        prefixFontSize: '50%',
                        valueFontSize: '80%',
                        postfixFontSize: '50%',
                        thresholds: '',
                        colorBackground: false,
                        colorValue: false,
                        colors: ['#299c46', 'rgba(237, 129, 40, 0.89)', '#d44a3a'],
                        sparkline: {
                            show: false,
                            full: false,
                            lineColor: 'rgb(31, 120, 193)',
                            fillColor: 'rgba(31, 118, 189, 0.18)',
                        },
                        gauge: {
                            show: false,
                            minValue: 0,
                            maxValue: 100,
                            thresholdMarkers: true,
                            thresholdLabels: false,
                        },
                        tableColumn: '',
                    };
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.onSparklineColorChange = _this.onSparklineColorChange.bind(_this);
                    _this.onSparklineFillChange = _this.onSparklineFillChange.bind(_this);
                    return _this;
                }
                BlendStatCtrl.prototype.onInitEditMode = function () {
                    this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
                    this.addEditorTab('Options', 'public/plugins/farski-blendstat-panel/editor.html', 2);
                    this.addEditorTab('Value Mappings', 'public/plugins/farski-blendstat-panel/mappings.html', 3);
                    this.addEditorTab('Blending', 'public/plugins/farski-blendstat-panel/blending.html', 4);
                    this.unitFormats = kbn_1.default.getUnitFormats();
                };
                BlendStatCtrl.prototype.setUnitFormat = function (subItem) {
                    this.panel.format = subItem.value;
                    this.refresh();
                };
                BlendStatCtrl.prototype.onDataError = function (err) {
                    this.onDataReceived([]);
                };
                BlendStatCtrl.prototype.onDataReceived = function (dataList) {
                    if (dataList.length > 1) {
                        var timestamps_1 = {};
                        var counts = {};
                        for (var _i = 0, dataList_1 = dataList; _i < dataList_1.length; _i++) {
                            var series = dataList_1[_i];
                            for (var _a = 0, _b = series.datapoints; _a < _b.length; _a++) {
                                var point = _b[_a];
                                if (timestamps_1[point[1]]) {
                                    switch (this.panel.blendName) {
                                        case 'min':
                                            if (point[0] < timestamps_1[point[1]]) {
                                                timestamps_1[point[1]] = point[0];
                                            }
                                            break;
                                        case 'max':
                                            if (point[0] > timestamps_1[point[1]]) {
                                                timestamps_1[point[1]] = point[0];
                                            }
                                            break;
                                        case 'avg':
                                            timestamps_1[point[1]] = (timestamps_1[point[1]] * counts[point[1]] + point[0]) / (counts[point[1]] + 1);
                                            counts[point[1]] += 1;
                                            break;
                                        default:
                                            timestamps_1[point[1]] += point[0];
                                            break;
                                    }
                                }
                                else {
                                    timestamps_1[point[1]] = point[0];
                                    counts[point[1]] = 1;
                                }
                            }
                        }
                        var datapoints = Object.keys(timestamps_1).sort().map(function (ts) {
                            return [timestamps_1[ts], ts];
                        });
                        dataList = [{ target: 'Blended_Metrics', datapoints: datapoints }];
                    }
                    var data = {
                        scopedVars: lodash_1.default.extend({}, this.panel.scopedVars),
                    };
                    if (dataList.length > 0 && dataList[0].type === 'table') {
                        this.dataType = 'table';
                        var tableData = dataList.map(this.tableHandler.bind(this));
                        this.setTableValues(tableData, data);
                    }
                    else {
                        this.dataType = 'timeseries';
                        this.series = dataList.map(this.seriesHandler.bind(this));
                        this.setValues(data);
                    }
                    this.data = data;
                    this.render();
                };
                BlendStatCtrl.prototype.seriesHandler = function (seriesData) {
                    var series = new time_series2_1.default({
                        datapoints: seriesData.datapoints || [],
                        alias: seriesData.target,
                    });
                    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                    return series;
                };
                BlendStatCtrl.prototype.tableHandler = function (tableData) {
                    var datapoints = [];
                    var columnNames = {};
                    tableData.columns.forEach(function (column, columnIndex) {
                        columnNames[columnIndex] = column.text;
                    });
                    this.tableColumnOptions = columnNames;
                    if (!lodash_1.default.find(tableData.columns, ['text', this.panel.tableColumn])) {
                        this.setTableColumnToSensibleDefault(tableData);
                    }
                    tableData.rows.forEach(function (row) {
                        var datapoint = {};
                        row.forEach(function (value, columnIndex) {
                            var key = columnNames[columnIndex];
                            datapoint[key] = value;
                        });
                        datapoints.push(datapoint);
                    });
                    return datapoints;
                };
                BlendStatCtrl.prototype.setTableColumnToSensibleDefault = function (tableData) {
                    if (tableData.columns.length === 1) {
                        this.panel.tableColumn = tableData.columns[0].text;
                    }
                    else {
                        this.panel.tableColumn = lodash_1.default.find(tableData.columns, function (col) {
                            return col.type !== 'time';
                        }).text;
                    }
                };
                BlendStatCtrl.prototype.setTableValues = function (tableData, data) {
                    if (!tableData || tableData.length === 0) {
                        return;
                    }
                    if (tableData[0].length === 0 || tableData[0][0][this.panel.tableColumn] === undefined) {
                        return;
                    }
                    var datapoint = tableData[0][0];
                    data.value = datapoint[this.panel.tableColumn];
                    if (lodash_1.default.isString(data.value)) {
                        data.valueFormatted = lodash_1.default.escape(data.value);
                        data.value = 0;
                        data.valueRounded = 0;
                    }
                    else {
                        var decimalInfo = this.getDecimalsForValue(data.value);
                        var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                        data.valueFormatted = formatFunc(datapoint[this.panel.tableColumn], decimalInfo.decimals, decimalInfo.scaledDecimals);
                        data.valueRounded = kbn_1.default.roundValue(data.value, this.panel.decimals || 0);
                    }
                    this.setValueMapping(data);
                };
                BlendStatCtrl.prototype.canModifyText = function () {
                    return !this.panel.gauge.show;
                };
                BlendStatCtrl.prototype.setColoring = function (options) {
                    if (options.background) {
                        this.panel.colorValue = false;
                        this.panel.colors = ['rgba(71, 212, 59, 0.4)', 'rgba(245, 150, 40, 0.73)', 'rgba(225, 40, 40, 0.59)'];
                    }
                    else {
                        this.panel.colorBackground = false;
                        this.panel.colors = ['rgba(50, 172, 45, 0.97)', 'rgba(237, 129, 40, 0.89)', 'rgba(245, 54, 54, 0.9)'];
                    }
                    this.render();
                };
                BlendStatCtrl.prototype.invertColorOrder = function () {
                    var tmp = this.panel.colors[0];
                    this.panel.colors[0] = this.panel.colors[2];
                    this.panel.colors[2] = tmp;
                    this.render();
                };
                BlendStatCtrl.prototype.onColorChange = function (panelColorIndex) {
                    var _this = this;
                    return function (color) {
                        _this.panel.colors[panelColorIndex] = color;
                        _this.render();
                    };
                };
                BlendStatCtrl.prototype.onSparklineColorChange = function (newColor) {
                    this.panel.sparkline.lineColor = newColor;
                    this.render();
                };
                BlendStatCtrl.prototype.onSparklineFillChange = function (newColor) {
                    this.panel.sparkline.fillColor = newColor;
                    this.render();
                };
                BlendStatCtrl.prototype.getDecimalsForValue = function (value) {
                    if (lodash_1.default.isNumber(this.panel.decimals)) {
                        return { decimals: this.panel.decimals, scaledDecimals: null };
                    }
                    var delta = value / 2;
                    var dec = -Math.floor(Math.log(delta) / Math.LN10);
                    var magn = Math.pow(10, -dec);
                    var norm = delta / magn;
                    var size;
                    if (norm < 1.5) {
                        size = 1;
                    }
                    else if (norm < 3) {
                        size = 2;
                        if (norm > 2.25) {
                            size = 2.5;
                            ++dec;
                        }
                    }
                    else if (norm < 7.5) {
                        size = 5;
                    }
                    else {
                        size = 10;
                    }
                    size *= magn;
                    if (Math.floor(value) === value) {
                        dec = 0;
                    }
                    var result = {};
                    result.decimals = Math.max(0, dec);
                    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
                    return result;
                };
                BlendStatCtrl.prototype.setValues = function (data) {
                    data.flotpairs = [];
                    if (this.series.length > 1) {
                        var error = new Error();
                        error.message = 'Multiple Series Error';
                        error.data =
                            'Metric query returns ' +
                                this.series.length +
                                ' series. Single Stat Panel expects a single series.\n\nResponse:\n' +
                                JSON.stringify(this.series);
                        throw error;
                    }
                    if (this.series && this.series.length > 0) {
                        var lastPoint = lodash_1.default.last(this.series[0].datapoints);
                        var lastValue = lodash_1.default.isArray(lastPoint) ? lastPoint[0] : null;
                        if (this.panel.valueName === 'name') {
                            data.value = 0;
                            data.valueRounded = 0;
                            data.valueFormatted = this.series[0].alias;
                        }
                        else if (lodash_1.default.isString(lastValue)) {
                            data.value = 0;
                            data.valueFormatted = lodash_1.default.escape(lastValue);
                            data.valueRounded = 0;
                        }
                        else if (this.panel.valueName === 'last_time') {
                            var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                            data.value = lastPoint[1];
                            data.valueRounded = data.value;
                            data.valueFormatted = formatFunc(data.value, this.dashboard.isTimezoneUtc());
                        }
                        else {
                            data.value = this.series[0].stats[this.panel.valueName];
                            data.flotpairs = this.series[0].flotpairs;
                            var decimalInfo = this.getDecimalsForValue(data.value);
                            var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                            data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                            data.valueRounded = kbn_1.default.roundValue(data.value, decimalInfo.decimals);
                        }
                        data.scopedVars['__name'] = { value: this.series[0].label };
                    }
                    this.setValueMapping(data);
                };
                BlendStatCtrl.prototype.setValueMapping = function (data) {
                    if (this.panel.mappingType === 1) {
                        for (var i = 0; i < this.panel.valueMaps.length; i++) {
                            var map = this.panel.valueMaps[i];
                            if (map.value === 'null') {
                                if (data.value === null || data.value === void 0) {
                                    data.valueFormatted = map.text;
                                    return;
                                }
                                continue;
                            }
                            var value = parseFloat(map.value);
                            if (value === data.valueRounded) {
                                data.valueFormatted = map.text;
                                return;
                            }
                        }
                    }
                    else if (this.panel.mappingType === 2) {
                        for (var i = 0; i < this.panel.rangeMaps.length; i++) {
                            var map = this.panel.rangeMaps[i];
                            if (map.from === 'null' && map.to === 'null') {
                                if (data.value === null || data.value === void 0) {
                                    data.valueFormatted = map.text;
                                    return;
                                }
                                continue;
                            }
                            var from = parseFloat(map.from);
                            var to = parseFloat(map.to);
                            if (to >= data.valueRounded && from <= data.valueRounded) {
                                data.valueFormatted = map.text;
                                return;
                            }
                        }
                    }
                    if (data.value === null || data.value === void 0) {
                        data.valueFormatted = 'no value';
                    }
                };
                BlendStatCtrl.prototype.removeValueMap = function (map) {
                    var index = lodash_1.default.indexOf(this.panel.valueMaps, map);
                    this.panel.valueMaps.splice(index, 1);
                    this.render();
                };
                BlendStatCtrl.prototype.addValueMap = function () {
                    this.panel.valueMaps.push({ value: '', op: '=', text: '' });
                };
                BlendStatCtrl.prototype.removeRangeMap = function (rangeMap) {
                    var index = lodash_1.default.indexOf(this.panel.rangeMaps, rangeMap);
                    this.panel.rangeMaps.splice(index, 1);
                    this.render();
                };
                BlendStatCtrl.prototype.addRangeMap = function () {
                    this.panel.rangeMaps.push({ from: '', to: '', text: '' });
                };
                BlendStatCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
                    var $location = this.$location;
                    var $timeout = this.$timeout;
                    var $sanitize = this.$sanitize;
                    var panel = ctrl.panel;
                    var templateSrv = this.templateSrv;
                    var data, linkInfo;
                    var $panelContainer = elem.find('.panel-container');
                    elem = elem.find('.singlestat-panel');
                    function applyColoringThresholds(valueString) {
                        var color = getColorForValue(data, data.value);
                        if (color) {
                            return '<span style="color:' + color + '">' + valueString + '</span>';
                        }
                        return valueString;
                    }
                    function getSpan(className, fontSize, applyColoring, value) {
                        value = $sanitize(templateSrv.replace(value, data.scopedVars));
                        value = applyColoring ? applyColoringThresholds(value) : value;
                        return '<span class="' + className + '" style="font-size:' + fontSize + '">' + value + '</span>';
                    }
                    function getBigValueHtml() {
                        var body = '<div class="singlestat-panel-value-container">';
                        if (panel.prefix) {
                            body += getSpan('singlestat-panel-prefix', panel.prefixFontSize, panel.colorPrefix, panel.prefix);
                        }
                        body += getSpan('singlestat-panel-value', panel.valueFontSize, panel.colorValue, data.valueFormatted);
                        if (panel.postfix) {
                            body += getSpan('singlestat-panel-postfix', panel.postfixFontSize, panel.colorPostfix, panel.postfix);
                        }
                        body += '</div>';
                        return body;
                    }
                    function getValueText() {
                        var result = panel.prefix ? templateSrv.replace(panel.prefix, data.scopedVars) : '';
                        result += data.valueFormatted;
                        result += panel.postfix ? templateSrv.replace(panel.postfix, data.scopedVars) : '';
                        return result;
                    }
                    function addGauge() {
                        var width = elem.width();
                        var height = elem.height();
                        var dimension = Math.min(width, height * 1.3);
                        ctrl.invalidGaugeRange = false;
                        if (panel.gauge.minValue > panel.gauge.maxValue) {
                            ctrl.invalidGaugeRange = true;
                            return;
                        }
                        var plotCanvas = jquery_1.default('<div></div>');
                        var plotCss = {
                            top: '10px',
                            margin: 'auto',
                            position: 'relative',
                            height: height * 0.8 + 'px',
                            width: dimension + 'px',
                        };
                        plotCanvas.css(plotCss);
                        var thresholds = [];
                        for (var i = 0; i < data.thresholds.length; i++) {
                            thresholds.push({
                                value: data.thresholds[i],
                                color: data.colorMap[i],
                            });
                        }
                        thresholds.push({
                            value: panel.gauge.maxValue,
                            color: data.colorMap[data.colorMap.length - 1],
                        });
                        var bgColor = config_1.default.bootData.user.lightTheme ? 'rgb(230,230,230)' : 'rgb(38,38,38)';
                        var fontScale = parseInt(panel.valueFontSize, 10) / 100;
                        var fontSize = Math.min(dimension / 5, 100) * fontScale;
                        var gaugeWidthReduceRatio = panel.gauge.thresholdLabels ? 1.5 : 1;
                        var gaugeWidth = Math.min(dimension / 6, 60) / gaugeWidthReduceRatio;
                        var thresholdMarkersWidth = gaugeWidth / 5;
                        var thresholdLabelFontSize = fontSize / 2.5;
                        var options = {
                            series: {
                                gauges: {
                                    gauge: {
                                        min: panel.gauge.minValue,
                                        max: panel.gauge.maxValue,
                                        background: { color: bgColor },
                                        border: { color: null },
                                        shadow: { show: false },
                                        width: gaugeWidth,
                                    },
                                    frame: { show: false },
                                    label: { show: false },
                                    layout: { margin: 0, thresholdWidth: 0 },
                                    cell: { border: { width: 0 } },
                                    threshold: {
                                        values: thresholds,
                                        label: {
                                            show: panel.gauge.thresholdLabels,
                                            margin: thresholdMarkersWidth + 1,
                                            font: { size: thresholdLabelFontSize },
                                        },
                                        show: panel.gauge.thresholdMarkers,
                                        width: thresholdMarkersWidth,
                                    },
                                    value: {
                                        color: panel.colorValue ? getColorForValue(data, data.valueRounded) : null,
                                        formatter: function () {
                                            return getValueText();
                                        },
                                        font: {
                                            size: fontSize,
                                            family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                        },
                                    },
                                    show: true,
                                },
                            },
                        };
                        if (panel.bottomtitle) {
                            plotCanvas.append("<div style=\"position: absolute;bottom: 0;text-align: center;text-transform: capitalize;font-style: italic;width: 100%;\">" + panel.bottomtitle + "</div>");
                        }
                        elem.append(plotCanvas);
                        var plotSeries = {
                            data: [[0, data.value]],
                        };
                        jquery_1.default.plot(plotCanvas, [plotSeries], options);
                    }
                    function addSparkline() {
                        var width = elem.width() + 20;
                        if (width < 30) {
                            setTimeout(addSparkline, 30);
                            return;
                        }
                        var height = ctrl.height;
                        var plotCanvas = jquery_1.default('<div></div>');
                        var plotCss = {};
                        plotCss.position = 'absolute';
                        if (panel.sparkline.full) {
                            plotCss.bottom = '5px';
                            plotCss.left = '-5px';
                            plotCss.width = width - 10 + 'px';
                            var dynamicHeightMargin = height <= 100 ? 5 : Math.round(height / 100) * 15 + 5;
                            plotCss.height = height - dynamicHeightMargin + 'px';
                        }
                        else {
                            plotCss.bottom = '0px';
                            plotCss.left = '-5px';
                            plotCss.width = width - 10 + 'px';
                            plotCss.height = Math.floor(height * 0.25) + 'px';
                        }
                        plotCanvas.css(plotCss);
                        var options = {
                            legend: { show: false },
                            series: {
                                lines: {
                                    show: true,
                                    fill: 1,
                                    zero: false,
                                    lineWidth: 1,
                                    fillColor: panel.sparkline.fillColor,
                                },
                            },
                            yaxes: { show: false },
                            xaxis: {
                                show: false,
                                mode: 'time',
                                min: ctrl.range.from.valueOf(),
                                max: ctrl.range.to.valueOf(),
                            },
                            grid: { hoverable: false, show: false },
                        };
                        elem.append(plotCanvas);
                        var plotSeries = {
                            data: data.flotpairs,
                            color: panel.sparkline.lineColor,
                        };
                        jquery_1.default.plot(plotCanvas, [plotSeries], options);
                    }
                    function render() {
                        if (!ctrl.data) {
                            return;
                        }
                        data = ctrl.data;
                        data.thresholds = panel.thresholds.split(',').map(function (strVale) {
                            return Number(strVale.trim());
                        });
                        data.colorMap = panel.colors;
                        var body = panel.gauge.show ? '' : getBigValueHtml();
                        if (panel.colorBackground) {
                            var color = getColorForValue(data, data.value);
                            if (color) {
                                $panelContainer.css('background-color', color);
                                if (scope.fullscreen) {
                                    elem.css('background-color', color);
                                }
                                else {
                                    elem.css('background-color', '');
                                }
                            }
                        }
                        else {
                            $panelContainer.css('background-color', '');
                            elem.css('background-color', '');
                        }
                        elem.html(body);
                        if (panel.sparkline.show) {
                            addSparkline();
                        }
                        if (panel.gauge.show) {
                            addGauge();
                        }
                        elem.toggleClass('pointer', panel.links.length > 0);
                        if (panel.links.length > 0) {
                            linkInfo = null;
                        }
                        else {
                            linkInfo = null;
                        }
                    }
                    function hookupDrilldownLinkTooltip() {
                        var drilldownTooltip = jquery_1.default('<div id="tooltip" class="">hello</div>"');
                        elem.mouseleave(function () {
                            if (panel.links.length === 0) {
                                return;
                            }
                            $timeout(function () {
                                drilldownTooltip.detach();
                            });
                        });
                        elem.click(function (evt) {
                            if (!linkInfo) {
                                return;
                            }
                            if (jquery_1.default(evt).parents('.panel-header').length > 0) {
                                return;
                            }
                            if (linkInfo.target === '_blank') {
                                window.open(linkInfo.href, '_blank');
                                return;
                            }
                            if (linkInfo.href.indexOf('http') === 0) {
                                window.location.href = linkInfo.href;
                            }
                            else {
                                $timeout(function () {
                                    $location.url(linkInfo.href);
                                });
                            }
                            drilldownTooltip.detach();
                        });
                        elem.mousemove(function (e) {
                            if (!linkInfo) {
                                return;
                            }
                            drilldownTooltip.text('click to go to: ' + linkInfo.title);
                            drilldownTooltip.place_tt(e.pageX, e.pageY - 50);
                        });
                    }
                    hookupDrilldownLinkTooltip();
                    this.events.on('render', function () {
                        render();
                        ctrl.renderingCompleted();
                    });
                };
                BlendStatCtrl.templateUrl = 'module.html';
                return BlendStatCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("BlendStatCtrl", BlendStatCtrl);
            exports_1("PanelCtrl", BlendStatCtrl);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQTZ4QkEsMEJBQTBCLElBQUksRUFBRSxLQUFLO1FBQ2pDLElBQUksQ0FBQyxnQkFBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwQixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNqQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0I7U0FDSjtRQUVELE9BQU8sZ0JBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQWh3QjJCLGlDQUFnQjtnQkEyRXhDLHVCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQVUsU0FBUyxFQUFVLFNBQVM7b0JBQW5FLFlBRUksa0JBQU0sTUFBTSxFQUFFLFNBQVMsQ0FBQyxTQVUzQjtvQkFac0MsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkFBVSxlQUFTLEdBQVQsU0FBUyxDQUFBO29CQXhFbkUsY0FBUSxHQUFHLFlBQVksQ0FBQztvQkFReEIsc0JBQWdCLEdBQVU7d0JBQ3RCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO3dCQUM3QixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTt3QkFDN0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVB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Iiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cblxuLy8gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbi8vIENvcHlyaWdodCAoYykgMjAxNiBHcmFmYW5hXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4vLyBTT0ZUV0FSRS5cblxuaW1wb3J0ICdqcXVlcnkuZmxvdCc7XG5pbXBvcnQgJy4vbGliL2Zsb3QvanF1ZXJ5LmZsb3QuZ2F1Z2UnO1xuaW1wb3J0ICdqcXVlcnkuZmxvdC50aW1lJztcbmltcG9ydCAnanF1ZXJ5LmZsb3QuY3Jvc3NoYWlyJztcbmltcG9ydCAnLi9saWIvZG9udXQvc2ltcGxlLWRvbnV0LWpxdWVyeSc7XG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuLy8gaW1wb3J0ICd2ZW5kb3IvZmxvdC9qcXVlcnkuZmxvdCc7XG4vLyBpbXBvcnQgJ3ZlbmRvci9mbG90L2pxdWVyeS5mbG90LmdhdWdlJztcbi8vIGltcG9ydCAnYXBwL2ZlYXR1cmVzL2Rhc2hib2FyZC9wYW5lbGxpbmtzL2xpbmtfc3J2JztcblxuaW1wb3J0IGtibiBmcm9tICdhcHAvY29yZS91dGlscy9rYm4nO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdhcHAvY29yZS9jb25maWcnO1xuaW1wb3J0IFRpbWVTZXJpZXMgZnJvbSAnYXBwL2NvcmUvdGltZV9zZXJpZXMyJztcbmltcG9ydCB7IE1ldHJpY3NQYW5lbEN0cmwgfSBmcm9tICdhcHAvcGx1Z2lucy9zZGsnO1xuXG5jbGFzcyBCbGVuZFN0YXRDdHJsIGV4dGVuZHMgTWV0cmljc1BhbmVsQ3RybCB7XG4gICAgc3RhdGljIHRlbXBsYXRlVXJsID0gJ21vZHVsZS5odG1sJztcblxuICAgIGRhdGFUeXBlID0gJ3RpbWVzZXJpZXMnO1xuICAgIHNlcmllczogYW55W107XG4gICAgZGF0YTogYW55O1xuICAgIGZvbnRTaXplczogYW55W107XG4gICAgdW5pdEZvcm1hdHM6IGFueVtdO1xuICAgIGludmFsaWRHYXVnZVJhbmdlOiBib29sZWFuO1xuICAgIHBhbmVsOiBhbnk7XG4gICAgZXZlbnRzOiBhbnk7XG4gICAgdmFsdWVOYW1lT3B0aW9uczogYW55W10gPSBbXG4gICAgICAgIHsgdmFsdWU6ICdtaW4nLCB0ZXh0OiAnTWluJyB9LFxuICAgICAgICB7IHZhbHVlOiAnbWF4JywgdGV4dDogJ01heCcgfSxcbiAgICAgICAgeyB2YWx1ZTogJ2F2ZycsIHRleHQ6ICdBdmVyYWdlJyB9LFxuICAgICAgICB7IHZhbHVlOiAnY3VycmVudCcsIHRleHQ6ICdDdXJyZW50JyB9LFxuICAgICAgICB7IHZhbHVlOiAndG90YWwnLCB0ZXh0OiAnVG90YWwnIH0sXG4gICAgICAgIHsgdmFsdWU6ICduYW1lJywgdGV4dDogJ05hbWUnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdmaXJzdCcsIHRleHQ6ICdGaXJzdCcgfSxcbiAgICAgICAgeyB2YWx1ZTogJ2RlbHRhJywgdGV4dDogJ0RlbHRhJyB9LFxuICAgICAgICB7IHZhbHVlOiAnZGlmZicsIHRleHQ6ICdEaWZmZXJlbmNlJyB9LFxuICAgICAgICB7IHZhbHVlOiAncmFuZ2UnLCB0ZXh0OiAnUmFuZ2UnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdsYXN0X3RpbWUnLCB0ZXh0OiAnVGltZSBvZiBsYXN0IHBvaW50JyB9LFxuICAgIF07XG4gICAgYmxlbmROYW1lT3B0aW9uczogYW55W10gPSBbXG4gICAgICAgIHsgdmFsdWU6ICdtaW4nLCB0ZXh0OiAnTWluJyB9LFxuICAgICAgICB7IHZhbHVlOiAnbWF4JywgdGV4dDogJ01heCcgfSxcbiAgICAgICAgeyB2YWx1ZTogJ2F2ZycsIHRleHQ6ICdBdmVyYWdlJyB9LFxuICAgICAgICB7IHZhbHVlOiAndG90YWwnLCB0ZXh0OiAnVG90YWwnIH0sXG4gICAgXTtcbiAgICB0YWJsZUNvbHVtbk9wdGlvbnM6IGFueTtcblxuICAgIC8vIFNldCBhbmQgcG9wdWxhdGUgZGVmYXVsdHNcbiAgICBwYW5lbERlZmF1bHRzID0ge1xuICAgICAgICBsaW5rczogW10sXG4gICAgICAgIGRhdGFzb3VyY2U6IG51bGwsXG4gICAgICAgIG1heERhdGFQb2ludHM6IDEwMCxcbiAgICAgICAgaW50ZXJ2YWw6IG51bGwsXG4gICAgICAgIHRhcmdldHM6IFt7fV0sXG4gICAgICAgIGNhY2hlVGltZW91dDogbnVsbCxcbiAgICAgICAgZm9ybWF0OiAnbm9uZScsXG4gICAgICAgIHByZWZpeDogJycsXG4gICAgICAgIHBvc3RmaXg6ICcnLFxuICAgICAgICBudWxsVGV4dDogbnVsbCxcbiAgICAgICAgdmFsdWVNYXBzOiBbeyB2YWx1ZTogJ251bGwnLCBvcDogJz0nLCB0ZXh0OiAnTi9BJyB9XSxcbiAgICAgICAgbWFwcGluZ1R5cGVzOiBbeyBuYW1lOiAndmFsdWUgdG8gdGV4dCcsIHZhbHVlOiAxIH0sIHsgbmFtZTogJ3JhbmdlIHRvIHRleHQnLCB2YWx1ZTogMiB9XSxcbiAgICAgICAgcmFuZ2VNYXBzOiBbeyBmcm9tOiAnbnVsbCcsIHRvOiAnbnVsbCcsIHRleHQ6ICdOL0EnIH1dLFxuICAgICAgICBtYXBwaW5nVHlwZTogMSxcbiAgICAgICAgbnVsbFBvaW50TW9kZTogJ2Nvbm5lY3RlZCcsXG4gICAgICAgIHZhbHVlTmFtZTogJ2F2ZycsXG4gICAgICAgIGJsZW5kTmFtZTogJ3RvdGFsJyxcbiAgICAgICAgcHJlZml4Rm9udFNpemU6ICc1MCUnLFxuICAgICAgICB2YWx1ZUZvbnRTaXplOiAnODAlJyxcbiAgICAgICAgcG9zdGZpeEZvbnRTaXplOiAnNTAlJyxcbiAgICAgICAgdGhyZXNob2xkczogJycsXG4gICAgICAgIGNvbG9yQmFja2dyb3VuZDogZmFsc2UsXG4gICAgICAgIGNvbG9yVmFsdWU6IGZhbHNlLFxuICAgICAgICBjb2xvcnM6IFsnIzI5OWM0NicsICdyZ2JhKDIzNywgMTI5LCA0MCwgMC44OSknLCAnI2Q0NGEzYSddLFxuICAgICAgICBzcGFya2xpbmU6IHtcbiAgICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgICAgZnVsbDogZmFsc2UsXG4gICAgICAgICAgICBsaW5lQ29sb3I6ICdyZ2IoMzEsIDEyMCwgMTkzKScsXG4gICAgICAgICAgICBmaWxsQ29sb3I6ICdyZ2JhKDMxLCAxMTgsIDE4OSwgMC4xOCknLFxuICAgICAgICB9LFxuICAgICAgICBnYXVnZToge1xuICAgICAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgICAgICBtaW5WYWx1ZTogMCxcbiAgICAgICAgICAgIG1heFZhbHVlOiAxMDAsXG4gICAgICAgICAgICB0aHJlc2hvbGRNYXJrZXJzOiB0cnVlLFxuICAgICAgICAgICAgdGhyZXNob2xkTGFiZWxzOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgdGFibGVDb2x1bW46ICcnLFxuICAgIH07XG5cbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJHNjb3BlLCAkaW5qZWN0b3IsIHByaXZhdGUgJHNhbml0aXplLCBwcml2YXRlICRsb2NhdGlvbikge1xuICAgICAgICAvLyBwcml2YXRlIGxpbmtTcnYsXG4gICAgICAgIHN1cGVyKCRzY29wZSwgJGluamVjdG9yKTtcbiAgICAgICAgXy5kZWZhdWx0cyh0aGlzLnBhbmVsLCB0aGlzLnBhbmVsRGVmYXVsdHMpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRzLm9uKCdkYXRhLXJlY2VpdmVkJywgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5ldmVudHMub24oJ2RhdGEtZXJyb3InLCB0aGlzLm9uRGF0YUVycm9yLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1zbmFwc2hvdC1sb2FkJywgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5ldmVudHMub24oJ2luaXQtZWRpdC1tb2RlJywgdGhpcy5vbkluaXRFZGl0TW9kZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLm9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UgPSB0aGlzLm9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblNwYXJrbGluZUZpbGxDaGFuZ2UgPSB0aGlzLm9uU3BhcmtsaW5lRmlsbENoYW5nZS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIG9uSW5pdEVkaXRNb2RlKCkge1xuICAgICAgICB0aGlzLmZvbnRTaXplcyA9IFsnMjAlJywgJzMwJScsICc1MCUnLCAnNzAlJywgJzgwJScsICcxMDAlJywgJzExMCUnLCAnMTIwJScsICcxNTAlJywgJzE3MCUnLCAnMjAwJSddO1xuICAgICAgICB0aGlzLmFkZEVkaXRvclRhYignT3B0aW9ucycsICdwdWJsaWMvcGx1Z2lucy9mYXJza2ktYmxlbmRzdGF0LXBhbmVsL2VkaXRvci5odG1sJywgMik7XG4gICAgICAgIHRoaXMuYWRkRWRpdG9yVGFiKCdWYWx1ZSBNYXBwaW5ncycsICdwdWJsaWMvcGx1Z2lucy9mYXJza2ktYmxlbmRzdGF0LXBhbmVsL21hcHBpbmdzLmh0bWwnLCAzKTtcbiAgICAgICAgdGhpcy5hZGRFZGl0b3JUYWIoJ0JsZW5kaW5nJywgJ3B1YmxpYy9wbHVnaW5zL2ZhcnNraS1ibGVuZHN0YXQtcGFuZWwvYmxlbmRpbmcuaHRtbCcsIDQpO1xuICAgICAgICB0aGlzLnVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XG4gICAgfVxuXG4gICAgc2V0VW5pdEZvcm1hdChzdWJJdGVtKSB7XG4gICAgICAgIHRoaXMucGFuZWwuZm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgb25EYXRhRXJyb3IoZXJyKSB7XG4gICAgICAgIHRoaXMub25EYXRhUmVjZWl2ZWQoW10pO1xuICAgIH1cblxuICAgIG9uRGF0YVJlY2VpdmVkKGRhdGFMaXN0KSB7XG4gICAgICAgIGlmIChkYXRhTGlzdC5sZW5ndGggPiAxKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbWVzdGFtcHMgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cyA9IHt9XG5cbiAgICAgICAgICAgIGZvciAobGV0IHNlcmllcyBvZiBkYXRhTGlzdCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHBvaW50IG9mIHNlcmllcy5kYXRhcG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aW1lc3RhbXBzW3BvaW50WzFdXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLnBhbmVsLmJsZW5kTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21pbic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb2ludFswXSA8IHRpbWVzdGFtcHNbcG9pbnRbMV1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXBzW3BvaW50WzFdXSA9IHBvaW50WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21heCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb2ludFswXSA+IHRpbWVzdGFtcHNbcG9pbnRbMV1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXBzW3BvaW50WzFdXSA9IHBvaW50WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2F2Zyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcHNbcG9pbnRbMV1dID0gKHRpbWVzdGFtcHNbcG9pbnRbMV1dICogY291bnRzW3BvaW50WzFdXSArIHBvaW50WzBdKSAvIChjb3VudHNbcG9pbnRbMV1dICsgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRzW3BvaW50WzFdXSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IGlzIHRvdGFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcHNbcG9pbnRbMV1dICs9IHBvaW50WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcHNbcG9pbnRbMV1dID0gcG9pbnRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudHNbcG9pbnRbMV1dID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZGF0YXBvaW50cyA9IE9iamVjdC5rZXlzKHRpbWVzdGFtcHMpLnNvcnQoKS5tYXAodHMgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdGltZXN0YW1wc1t0c10sIHRzXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRhdGFMaXN0ID0gW3sgdGFyZ2V0OiAnQmxlbmRlZF9NZXRyaWNzJywgZGF0YXBvaW50cyB9XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHtcbiAgICAgICAgICAgIHNjb3BlZFZhcnM6IF8uZXh0ZW5kKHt9LCB0aGlzLnBhbmVsLnNjb3BlZFZhcnMpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChkYXRhTGlzdC5sZW5ndGggPiAwICYmIGRhdGFMaXN0WzBdLnR5cGUgPT09ICd0YWJsZScpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVR5cGUgPSAndGFibGUnO1xuICAgICAgICAgICAgY29uc3QgdGFibGVEYXRhID0gZGF0YUxpc3QubWFwKHRoaXMudGFibGVIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5zZXRUYWJsZVZhbHVlcyh0YWJsZURhdGEsIGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXRhVHlwZSA9ICd0aW1lc2VyaWVzJztcbiAgICAgICAgICAgIHRoaXMuc2VyaWVzID0gZGF0YUxpc3QubWFwKHRoaXMuc2VyaWVzSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBzZXJpZXNIYW5kbGVyKHNlcmllc0RhdGEpIHtcbiAgICAgICAgY29uc3Qgc2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoe1xuICAgICAgICAgICAgZGF0YXBvaW50czogc2VyaWVzRGF0YS5kYXRhcG9pbnRzIHx8IFtdLFxuICAgICAgICAgICAgYWxpYXM6IHNlcmllc0RhdGEudGFyZ2V0LFxuICAgICAgICB9KTtcblxuICAgICAgICBzZXJpZXMuZmxvdHBhaXJzID0gc2VyaWVzLmdldEZsb3RQYWlycyh0aGlzLnBhbmVsLm51bGxQb2ludE1vZGUpO1xuICAgICAgICByZXR1cm4gc2VyaWVzO1xuICAgIH1cblxuICAgIHRhYmxlSGFuZGxlcih0YWJsZURhdGEpIHtcbiAgICAgICAgY29uc3QgZGF0YXBvaW50cyA9IFtdO1xuICAgICAgICBjb25zdCBjb2x1bW5OYW1lcyA9IHt9O1xuXG4gICAgICAgIHRhYmxlRGF0YS5jb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbHVtbk5hbWVzW2NvbHVtbkluZGV4XSA9IGNvbHVtbi50ZXh0O1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRhYmxlQ29sdW1uT3B0aW9ucyA9IGNvbHVtbk5hbWVzO1xuICAgICAgICBpZiAoIV8uZmluZCh0YWJsZURhdGEuY29sdW1ucywgWyd0ZXh0JywgdGhpcy5wYW5lbC50YWJsZUNvbHVtbl0pKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhYmxlRGF0YS5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFwb2ludCA9IHt9O1xuXG4gICAgICAgICAgICByb3cuZm9yRWFjaCgodmFsdWUsIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gY29sdW1uTmFtZXNbY29sdW1uSW5kZXhdO1xuICAgICAgICAgICAgICAgIGRhdGFwb2ludFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGF0YXBvaW50cy5wdXNoKGRhdGFwb2ludCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkYXRhcG9pbnRzO1xuICAgIH1cblxuICAgIHNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKSB7XG4gICAgICAgIGlmICh0YWJsZURhdGEuY29sdW1ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMucGFuZWwudGFibGVDb2x1bW4gPSB0YWJsZURhdGEuY29sdW1uc1swXS50ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYW5lbC50YWJsZUNvbHVtbiA9IF8uZmluZCh0YWJsZURhdGEuY29sdW1ucywgY29sID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sLnR5cGUgIT09ICd0aW1lJztcbiAgICAgICAgICAgIH0pLnRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRUYWJsZVZhbHVlcyh0YWJsZURhdGEsIGRhdGEpIHtcbiAgICAgICAgaWYgKCF0YWJsZURhdGEgfHwgdGFibGVEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhYmxlRGF0YVswXS5sZW5ndGggPT09IDAgfHwgdGFibGVEYXRhWzBdWzBdW3RoaXMucGFuZWwudGFibGVDb2x1bW5dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGFwb2ludCA9IHRhYmxlRGF0YVswXVswXTtcbiAgICAgICAgZGF0YS52YWx1ZSA9IGRhdGFwb2ludFt0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXTtcblxuICAgICAgICBpZiAoXy5pc1N0cmluZyhkYXRhLnZhbHVlKSkge1xuICAgICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IF8uZXNjYXBlKGRhdGEudmFsdWUpO1xuICAgICAgICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkZWNpbWFsSW5mbyA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKFxuICAgICAgICAgICAgICAgIGRhdGFwb2ludFt0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXSxcbiAgICAgICAgICAgICAgICBkZWNpbWFsSW5mby5kZWNpbWFscyxcbiAgICAgICAgICAgICAgICBkZWNpbWFsSW5mby5zY2FsZWREZWNpbWFsc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoZGF0YS52YWx1ZSwgdGhpcy5wYW5lbC5kZWNpbWFscyB8fCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VmFsdWVNYXBwaW5nKGRhdGEpO1xuICAgIH1cblxuICAgIGNhbk1vZGlmeVRleHQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5wYW5lbC5nYXVnZS5zaG93O1xuICAgIH1cblxuICAgIHNldENvbG9yaW5nKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmFja2dyb3VuZCkge1xuICAgICAgICAgICAgdGhpcy5wYW5lbC5jb2xvclZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBhbmVsLmNvbG9ycyA9IFsncmdiYSg3MSwgMjEyLCA1OSwgMC40KScsICdyZ2JhKDI0NSwgMTUwLCA0MCwgMC43MyknLCAncmdiYSgyMjUsIDQwLCA0MCwgMC41OSknXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFuZWwuY29sb3JCYWNrZ3JvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBhbmVsLmNvbG9ycyA9IFsncmdiYSg1MCwgMTcyLCA0NSwgMC45NyknLCAncmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpJywgJ3JnYmEoMjQ1LCA1NCwgNTQsIDAuOSknXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIGludmVydENvbG9yT3JkZXIoKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IHRoaXMucGFuZWwuY29sb3JzWzBdO1xuICAgICAgICB0aGlzLnBhbmVsLmNvbG9yc1swXSA9IHRoaXMucGFuZWwuY29sb3JzWzJdO1xuICAgICAgICB0aGlzLnBhbmVsLmNvbG9yc1syXSA9IHRtcDtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBvbkNvbG9yQ2hhbmdlKHBhbmVsQ29sb3JJbmRleCkge1xuICAgICAgICByZXR1cm4gY29sb3IgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYW5lbC5jb2xvcnNbcGFuZWxDb2xvckluZGV4XSA9IGNvbG9yO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvblNwYXJrbGluZUNvbG9yQ2hhbmdlKG5ld0NvbG9yKSB7XG4gICAgICAgIHRoaXMucGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvciA9IG5ld0NvbG9yO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIG9uU3BhcmtsaW5lRmlsbENoYW5nZShuZXdDb2xvcikge1xuICAgICAgICB0aGlzLnBhbmVsLnNwYXJrbGluZS5maWxsQ29sb3IgPSBuZXdDb2xvcjtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBnZXREZWNpbWFsc0ZvclZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmIChfLmlzTnVtYmVyKHRoaXMucGFuZWwuZGVjaW1hbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBkZWNpbWFsczogdGhpcy5wYW5lbC5kZWNpbWFscywgc2NhbGVkRGVjaW1hbHM6IG51bGwgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRlbHRhID0gdmFsdWUgLyAyO1xuICAgICAgICBsZXQgZGVjID0gLU1hdGguZmxvb3IoTWF0aC5sb2coZGVsdGEpIC8gTWF0aC5MTjEwKTtcblxuICAgICAgICBjb25zdCBtYWduID0gTWF0aC5wb3coMTAsIC1kZWMpO1xuICAgICAgICBjb25zdCBub3JtID0gZGVsdGEgLyBtYWduOyAvLyBub3JtIGlzIGJldHdlZW4gMS4wIGFuZCAxMC4wXG4gICAgICAgIGxldCBzaXplO1xuXG4gICAgICAgIGlmIChub3JtIDwgMS41KSB7XG4gICAgICAgICAgICBzaXplID0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChub3JtIDwgMykge1xuICAgICAgICAgICAgc2l6ZSA9IDI7XG4gICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIDIuNSwgcmVxdWlyZXMgYW4gZXh0cmEgZGVjaW1hbFxuICAgICAgICAgICAgaWYgKG5vcm0gPiAyLjI1KSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IDIuNTtcbiAgICAgICAgICAgICAgICArK2RlYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChub3JtIDwgNy41KSB7XG4gICAgICAgICAgICBzaXplID0gNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNpemUgPSAxMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpemUgKj0gbWFnbjtcblxuICAgICAgICAvLyByZWR1Y2Ugc3RhcnRpbmcgZGVjaW1hbHMgaWYgbm90IG5lZWRlZFxuICAgICAgICBpZiAoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICBkZWMgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSB7fTtcbiAgICAgICAgcmVzdWx0LmRlY2ltYWxzID0gTWF0aC5tYXgoMCwgZGVjKTtcbiAgICAgICAgcmVzdWx0LnNjYWxlZERlY2ltYWxzID0gcmVzdWx0LmRlY2ltYWxzIC0gTWF0aC5mbG9vcihNYXRoLmxvZyhzaXplKSAvIE1hdGguTE4xMCkgKyAyO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgc2V0VmFsdWVzKGRhdGEpIHtcbiAgICAgICAgZGF0YS5mbG90cGFpcnMgPSBbXTtcblxuICAgICAgICBpZiAodGhpcy5zZXJpZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgY29uc3QgZXJyb3I6IGFueSA9IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9ICdNdWx0aXBsZSBTZXJpZXMgRXJyb3InO1xuICAgICAgICAgICAgZXJyb3IuZGF0YSA9XG4gICAgICAgICAgICAgICAgJ01ldHJpYyBxdWVyeSByZXR1cm5zICcgK1xuICAgICAgICAgICAgICAgIHRoaXMuc2VyaWVzLmxlbmd0aCArXG4gICAgICAgICAgICAgICAgJyBzZXJpZXMuIFNpbmdsZSBTdGF0IFBhbmVsIGV4cGVjdHMgYSBzaW5nbGUgc2VyaWVzLlxcblxcblJlc3BvbnNlOlxcbicgK1xuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuc2VyaWVzKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RQb2ludCA9IF8ubGFzdCh0aGlzLnNlcmllc1swXS5kYXRhcG9pbnRzKTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RWYWx1ZSA9IF8uaXNBcnJheShsYXN0UG9pbnQpID8gbGFzdFBvaW50WzBdIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKHRoaXMucGFuZWwudmFsdWVOYW1lID09PSAnbmFtZScpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICAgICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IHRoaXMuc2VyaWVzWzBdLmFsaWFzO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxhc3RWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUobGFzdFZhbHVlKTtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWwudmFsdWVOYW1lID09PSAnbGFzdF90aW1lJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdEZ1bmMgPSBrYm4udmFsdWVGb3JtYXRzW3RoaXMucGFuZWwuZm9ybWF0XTtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gbGFzdFBvaW50WzFdO1xuICAgICAgICAgICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gZGF0YS52YWx1ZTtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhkYXRhLnZhbHVlLCB0aGlzLmRhc2hib2FyZC5pc1RpbWV6b25lVXRjKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gdGhpcy5zZXJpZXNbMF0uc3RhdHNbdGhpcy5wYW5lbC52YWx1ZU5hbWVdO1xuICAgICAgICAgICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZGVjaW1hbEluZm8gPSB0aGlzLmdldERlY2ltYWxzRm9yVmFsdWUoZGF0YS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbdGhpcy5wYW5lbC5mb3JtYXRdO1xuICAgICAgICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGEudmFsdWUsIGRlY2ltYWxJbmZvLmRlY2ltYWxzLCBkZWNpbWFsSW5mby5zY2FsZWREZWNpbWFscyk7XG4gICAgICAgICAgICAgICAgZGF0YS52YWx1ZVJvdW5kZWQgPSBrYm4ucm91bmRWYWx1ZShkYXRhLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCAkX19uYW1lIHZhcmlhYmxlIGZvciB1c2luZyBpbiBwcmVmaXggb3IgcG9zdGZpeFxuICAgICAgICAgICAgZGF0YS5zY29wZWRWYXJzWydfX25hbWUnXSA9IHsgdmFsdWU6IHRoaXMuc2VyaWVzWzBdLmxhYmVsIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gICAgfVxuXG4gICAgc2V0VmFsdWVNYXBwaW5nKGRhdGEpIHtcbiAgICAgICAgLy8gY2hlY2sgdmFsdWUgdG8gdGV4dCBtYXBwaW5ncyBpZiBpdHMgZW5hYmxlZFxuICAgICAgICBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnZhbHVlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IHRoaXMucGFuZWwudmFsdWVNYXBzW2ldO1xuICAgICAgICAgICAgICAgIC8vIHNwZWNpYWwgbnVsbCBjYXNlXG4gICAgICAgICAgICAgICAgaWYgKG1hcC52YWx1ZSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSBudWxsIHx8IGRhdGEudmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHZhbHVlL251bWJlciB0byB0ZXh0IG1hcHBpbmdcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlRmxvYXQobWFwLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGRhdGEudmFsdWVSb3VuZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsLm1hcHBpbmdUeXBlID09PSAyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWwucmFuZ2VNYXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gdGhpcy5wYW5lbC5yYW5nZU1hcHNbaV07XG4gICAgICAgICAgICAgICAgLy8gc3BlY2lhbCBudWxsIGNhc2VcbiAgICAgICAgICAgICAgICBpZiAobWFwLmZyb20gPT09ICdudWxsJyAmJiBtYXAudG8gPT09ICdudWxsJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB2YWx1ZS9udW1iZXIgdG8gcmFuZ2UgbWFwcGluZ1xuICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSBwYXJzZUZsb2F0KG1hcC5mcm9tKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IHBhcnNlRmxvYXQobWFwLnRvKTtcbiAgICAgICAgICAgICAgICBpZiAodG8gPj0gZGF0YS52YWx1ZVJvdW5kZWQgJiYgZnJvbSA8PSBkYXRhLnZhbHVlUm91bmRlZCkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gbWFwLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSAnbm8gdmFsdWUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlVmFsdWVNYXAobWFwKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwudmFsdWVNYXBzLCBtYXApO1xuICAgICAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIGFkZFZhbHVlTWFwKCkge1xuICAgICAgICB0aGlzLnBhbmVsLnZhbHVlTWFwcy5wdXNoKHsgdmFsdWU6ICcnLCBvcDogJz0nLCB0ZXh0OiAnJyB9KTtcbiAgICB9XG5cbiAgICByZW1vdmVSYW5nZU1hcChyYW5nZU1hcCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnJhbmdlTWFwcywgcmFuZ2VNYXApO1xuICAgICAgICB0aGlzLnBhbmVsLnJhbmdlTWFwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIGFkZFJhbmdlTWFwKCkge1xuICAgICAgICB0aGlzLnBhbmVsLnJhbmdlTWFwcy5wdXNoKHsgZnJvbTogJycsIHRvOiAnJywgdGV4dDogJycgfSk7XG4gICAgfVxuXG4gICAgbGluayhzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgY29uc3QgJGxvY2F0aW9uID0gdGhpcy4kbG9jYXRpb247XG4gICAgICAgIC8vIGNvbnN0IGxpbmtTcnYgPSB0aGlzLmxpbmtTcnY7XG4gICAgICAgIGNvbnN0ICR0aW1lb3V0ID0gdGhpcy4kdGltZW91dDtcbiAgICAgICAgY29uc3QgJHNhbml0aXplID0gdGhpcy4kc2FuaXRpemU7XG4gICAgICAgIGNvbnN0IHBhbmVsID0gY3RybC5wYW5lbDtcbiAgICAgICAgY29uc3QgdGVtcGxhdGVTcnYgPSB0aGlzLnRlbXBsYXRlU3J2O1xuICAgICAgICBsZXQgZGF0YSwgbGlua0luZm87XG4gICAgICAgIGNvbnN0ICRwYW5lbENvbnRhaW5lciA9IGVsZW0uZmluZCgnLnBhbmVsLWNvbnRhaW5lcicpO1xuICAgICAgICBlbGVtID0gZWxlbS5maW5kKCcuc2luZ2xlc3RhdC1wYW5lbCcpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKHZhbHVlU3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IGdldENvbG9yRm9yVmFsdWUoZGF0YSwgZGF0YS52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIHN0eWxlPVwiY29sb3I6JyArIGNvbG9yICsgJ1wiPicgKyB2YWx1ZVN0cmluZyArICc8L3NwYW4+JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U3BhbihjbGFzc05hbWUsIGZvbnRTaXplLCBhcHBseUNvbG9yaW5nLCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSAkc2FuaXRpemUodGVtcGxhdGVTcnYucmVwbGFjZSh2YWx1ZSwgZGF0YS5zY29wZWRWYXJzKSk7XG4gICAgICAgICAgICB2YWx1ZSA9IGFwcGx5Q29sb3JpbmcgPyBhcHBseUNvbG9yaW5nVGhyZXNob2xkcyh2YWx1ZSkgOiB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgY2xhc3NOYW1lICsgJ1wiIHN0eWxlPVwiZm9udC1zaXplOicgKyBmb250U2l6ZSArICdcIj4nICsgdmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRCaWdWYWx1ZUh0bWwoKSB7XG4gICAgICAgICAgICBsZXQgYm9keSA9ICc8ZGl2IGNsYXNzPVwic2luZ2xlc3RhdC1wYW5lbC12YWx1ZS1jb250YWluZXJcIj4nO1xuXG4gICAgICAgICAgICBpZiAocGFuZWwucHJlZml4KSB7XG4gICAgICAgICAgICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0LXBhbmVsLXByZWZpeCcsIHBhbmVsLnByZWZpeEZvbnRTaXplLCBwYW5lbC5jb2xvclByZWZpeCwgcGFuZWwucHJlZml4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0LXBhbmVsLXZhbHVlJywgcGFuZWwudmFsdWVGb250U2l6ZSwgcGFuZWwuY29sb3JWYWx1ZSwgZGF0YS52YWx1ZUZvcm1hdHRlZCk7XG5cbiAgICAgICAgICAgIGlmIChwYW5lbC5wb3N0Zml4KSB7XG4gICAgICAgICAgICAgICAgYm9keSArPSBnZXRTcGFuKCdzaW5nbGVzdGF0LXBhbmVsLXBvc3RmaXgnLCBwYW5lbC5wb3N0Zml4Rm9udFNpemUsIHBhbmVsLmNvbG9yUG9zdGZpeCwgcGFuZWwucG9zdGZpeCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJvZHkgKz0gJzwvZGl2Pic7XG5cbiAgICAgICAgICAgIHJldHVybiBib2R5O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VmFsdWVUZXh0KCkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHBhbmVsLnByZWZpeCA/IHRlbXBsYXRlU3J2LnJlcGxhY2UocGFuZWwucHJlZml4LCBkYXRhLnNjb3BlZFZhcnMpIDogJyc7XG4gICAgICAgICAgICByZXN1bHQgKz0gZGF0YS52YWx1ZUZvcm1hdHRlZDtcbiAgICAgICAgICAgIHJlc3VsdCArPSBwYW5lbC5wb3N0Zml4ID8gdGVtcGxhdGVTcnYucmVwbGFjZShwYW5lbC5wb3N0Zml4LCBkYXRhLnNjb3BlZFZhcnMpIDogJyc7XG4gICAgICAgICAgICAvLyByZXN1bHQgKz0gcGFuZWwuYm90dG9tdGl0bGUgPyB0ZW1wbGF0ZVNydi5yZXBsYWNlKHBhbmVsLmJvdHRvbXRpdGxlLCBkYXRhLnNjb3BlZFZhcnMpIDogJyc7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkR2F1Z2UoKSB7XG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IGVsZW0ud2lkdGgoKTtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IGVsZW0uaGVpZ2h0KCk7XG4gICAgICAgICAgICAvLyBBbGxvdyB0byB1c2UgYSBiaXQgbW9yZSBzcGFjZSBmb3Igd2lkZSBnYXVnZXNcbiAgICAgICAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQgKiAxLjMpO1xuXG4gICAgICAgICAgICBjdHJsLmludmFsaWRHYXVnZVJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAocGFuZWwuZ2F1Z2UubWluVmFsdWUgPiBwYW5lbC5nYXVnZS5tYXhWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGN0cmwuaW52YWxpZEdhdWdlUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcGxvdENhbnZhcyA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgICAgICAgICBjb25zdCBwbG90Q3NzID0ge1xuICAgICAgICAgICAgICAgIHRvcDogJzEwcHgnLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogJ2F1dG8nLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICogMC44ICsgJ3B4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogZGltZW5zaW9uICsgJ3B4JyxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHBsb3RDYW52YXMuY3NzKHBsb3RDc3MpO1xuXG4gICAgICAgICAgICBjb25zdCB0aHJlc2hvbGRzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEudGhyZXNob2xkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRocmVzaG9sZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkYXRhLnRocmVzaG9sZHNbaV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBkYXRhLmNvbG9yTWFwW2ldLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyZXNob2xkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogcGFuZWwuZ2F1Z2UubWF4VmFsdWUsXG4gICAgICAgICAgICAgICAgY29sb3I6IGRhdGEuY29sb3JNYXBbZGF0YS5jb2xvck1hcC5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBiZ0NvbG9yID0gY29uZmlnLmJvb3REYXRhLnVzZXIubGlnaHRUaGVtZSA/ICdyZ2IoMjMwLDIzMCwyMzApJyA6ICdyZ2IoMzgsMzgsMzgpJztcblxuICAgICAgICAgICAgY29uc3QgZm9udFNjYWxlID0gcGFyc2VJbnQocGFuZWwudmFsdWVGb250U2l6ZSwgMTApIC8gMTAwO1xuICAgICAgICAgICAgY29uc3QgZm9udFNpemUgPSBNYXRoLm1pbihkaW1lbnNpb24gLyA1LCAxMDApICogZm9udFNjYWxlO1xuICAgICAgICAgICAgLy8gUmVkdWNlIGdhdWdlIHdpZHRoIGlmIHRocmVzaG9sZCBsYWJlbHMgZW5hYmxlZFxuICAgICAgICAgICAgY29uc3QgZ2F1Z2VXaWR0aFJlZHVjZVJhdGlvID0gcGFuZWwuZ2F1Z2UudGhyZXNob2xkTGFiZWxzID8gMS41IDogMTtcbiAgICAgICAgICAgIGNvbnN0IGdhdWdlV2lkdGggPSBNYXRoLm1pbihkaW1lbnNpb24gLyA2LCA2MCkgLyBnYXVnZVdpZHRoUmVkdWNlUmF0aW87XG4gICAgICAgICAgICBjb25zdCB0aHJlc2hvbGRNYXJrZXJzV2lkdGggPSBnYXVnZVdpZHRoIC8gNTtcbiAgICAgICAgICAgIGNvbnN0IHRocmVzaG9sZExhYmVsRm9udFNpemUgPSBmb250U2l6ZSAvIDIuNTtcblxuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZ2F1Z2VzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnYXVnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogcGFuZWwuZ2F1Z2UubWluVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiBwYW5lbC5nYXVnZS5tYXhWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB7IGNvbG9yOiBiZ0NvbG9yIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiB7IGNvbG9yOiBudWxsIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93OiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGdhdWdlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWU6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ6IHsgbWFyZ2luOiAwLCB0aHJlc2hvbGRXaWR0aDogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbDogeyBib3JkZXI6IHsgd2lkdGg6IDAgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyZXNob2xkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiB0aHJlc2hvbGRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHBhbmVsLmdhdWdlLnRocmVzaG9sZExhYmVscyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB0aHJlc2hvbGRNYXJrZXJzV2lkdGggKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250OiB7IHNpemU6IHRocmVzaG9sZExhYmVsRm9udFNpemUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHBhbmVsLmdhdWdlLnRocmVzaG9sZE1hcmtlcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRocmVzaG9sZE1hcmtlcnNXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBwYW5lbC5jb2xvclZhbHVlID8gZ2V0Q29sb3JGb3JWYWx1ZShkYXRhLCBkYXRhLnZhbHVlUm91bmRlZCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWVUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IGZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6ICdcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHBhbmVsLmJvdHRvbXRpdGxlKSB7XG4gICAgICAgICAgICAgIHBsb3RDYW52YXMuYXBwZW5kKGA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO2JvdHRvbTogMDt0ZXh0LWFsaWduOiBjZW50ZXI7dGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7Zm9udC1zdHlsZTogaXRhbGljO3dpZHRoOiAxMDAlO1wiPiR7cGFuZWwuYm90dG9tdGl0bGV9PC9kaXY+YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW0uYXBwZW5kKHBsb3RDYW52YXMpO1xuXG4gICAgICAgICAgICBjb25zdCBwbG90U2VyaWVzID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IFtbMCwgZGF0YS52YWx1ZV1dLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJC5wbG90KHBsb3RDYW52YXMsIFtwbG90U2VyaWVzXSwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZGRTcGFya2xpbmUoKSB7XG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IGVsZW0ud2lkdGgoKSArIDIwO1xuICAgICAgICAgICAgaWYgKHdpZHRoIDwgMzApIHtcbiAgICAgICAgICAgICAgICAvLyBlbGVtZW50IGhhcyBub3QgZ290dGVuIGl0J3Mgd2lkdGggeWV0XG4gICAgICAgICAgICAgICAgLy8gZGVsYXkgc3BhcmtsaW5lIHJlbmRlclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYWRkU3BhcmtsaW5lLCAzMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBjdHJsLmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHBsb3RDYW52YXMgPSAkKCc8ZGl2PjwvZGl2PicpO1xuICAgICAgICAgICAgY29uc3QgcGxvdENzczogYW55ID0ge307XG4gICAgICAgICAgICBwbG90Q3NzLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblxuICAgICAgICAgICAgaWYgKHBhbmVsLnNwYXJrbGluZS5mdWxsKSB7XG4gICAgICAgICAgICAgICAgcGxvdENzcy5ib3R0b20gPSAnNXB4JztcbiAgICAgICAgICAgICAgICBwbG90Q3NzLmxlZnQgPSAnLTVweCc7XG4gICAgICAgICAgICAgICAgcGxvdENzcy53aWR0aCA9IHdpZHRoIC0gMTAgKyAncHgnO1xuICAgICAgICAgICAgICAgIGNvbnN0IGR5bmFtaWNIZWlnaHRNYXJnaW4gPSBoZWlnaHQgPD0gMTAwID8gNSA6IE1hdGgucm91bmQoaGVpZ2h0IC8gMTAwKSAqIDE1ICsgNTtcbiAgICAgICAgICAgICAgICBwbG90Q3NzLmhlaWdodCA9IGhlaWdodCAtIGR5bmFtaWNIZWlnaHRNYXJnaW4gKyAncHgnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbG90Q3NzLmJvdHRvbSA9ICcwcHgnO1xuICAgICAgICAgICAgICAgIHBsb3RDc3MubGVmdCA9ICctNXB4JztcbiAgICAgICAgICAgICAgICBwbG90Q3NzLndpZHRoID0gd2lkdGggLSAxMCArICdweCc7XG4gICAgICAgICAgICAgICAgcGxvdENzcy5oZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCAqIDAuMjUpICsgJ3B4JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGxvdENhbnZhcy5jc3MocGxvdENzcyk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgbGVnZW5kOiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHplcm86IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBwYW5lbC5zcGFya2xpbmUuZmlsbENvbG9yLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeWF4ZXM6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICB4YXhpczoge1xuICAgICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogJ3RpbWUnLFxuICAgICAgICAgICAgICAgICAgICBtaW46IGN0cmwucmFuZ2UuZnJvbS52YWx1ZU9mKCksXG4gICAgICAgICAgICAgICAgICAgIG1heDogY3RybC5yYW5nZS50by52YWx1ZU9mKCksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBncmlkOiB7IGhvdmVyYWJsZTogZmFsc2UsIHNob3c6IGZhbHNlIH0sXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBlbGVtLmFwcGVuZChwbG90Q2FudmFzKTtcblxuICAgICAgICAgICAgY29uc3QgcGxvdFNlcmllcyA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmZsb3RwYWlycyxcbiAgICAgICAgICAgICAgICBjb2xvcjogcGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvcixcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICQucGxvdChwbG90Q2FudmFzLCBbcGxvdFNlcmllc10sIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgaWYgKCFjdHJsLmRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhID0gY3RybC5kYXRhO1xuXG4gICAgICAgICAgICAvLyBnZXQgdGhyZXNob2xkc1xuICAgICAgICAgICAgZGF0YS50aHJlc2hvbGRzID0gcGFuZWwudGhyZXNob2xkcy5zcGxpdCgnLCcpLm1hcChzdHJWYWxlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKHN0clZhbGUudHJpbSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF0YS5jb2xvck1hcCA9IHBhbmVsLmNvbG9ycztcblxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHBhbmVsLmdhdWdlLnNob3cgPyAnJyA6IGdldEJpZ1ZhbHVlSHRtbCgpO1xuXG4gICAgICAgICAgICBpZiAocGFuZWwuY29sb3JCYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvckZvclZhbHVlKGRhdGEsIGRhdGEudmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChjb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAkcGFuZWxDb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUuZnVsbHNjcmVlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHBhbmVsQ29udGFpbmVyLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgICAgICAgICBlbGVtLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbS5odG1sKGJvZHkpO1xuXG4gICAgICAgICAgICBpZiAocGFuZWwuc3BhcmtsaW5lLnNob3cpIHtcbiAgICAgICAgICAgICAgICBhZGRTcGFya2xpbmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBhbmVsLmdhdWdlLnNob3cpIHtcbiAgICAgICAgICAgICAgICBhZGRHYXVnZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtLnRvZ2dsZUNsYXNzKCdwb2ludGVyJywgcGFuZWwubGlua3MubGVuZ3RoID4gMCk7XG5cbiAgICAgICAgICAgIGlmIChwYW5lbC5saW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gbGlua0luZm8gPSBsaW5rU3J2LmdldFBhbmVsTGlua0FuY2hvckluZm8ocGFuZWwubGlua3NbMF0sIGRhdGEuc2NvcGVkVmFycyk7XG4gICAgICAgICAgICAgICAgbGlua0luZm8gPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5rSW5mbyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBob29rdXBEcmlsbGRvd25MaW5rVG9vbHRpcCgpIHtcbiAgICAgICAgICAgIC8vIGRyaWxsZG93biBsaW5rIHRvb2x0aXBcbiAgICAgICAgICAgIGNvbnN0IGRyaWxsZG93blRvb2x0aXAgPSAkKCc8ZGl2IGlkPVwidG9vbHRpcFwiIGNsYXNzPVwiXCI+aGVsbG88L2Rpdj5cIicpO1xuXG4gICAgICAgICAgICBlbGVtLm1vdXNlbGVhdmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwYW5lbC5saW5rcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRyaWxsZG93blRvb2x0aXAuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWxlbS5jbGljayhldnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghbGlua0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgdGl0bGUgY2xpY2tzIGluIHRpdGxlXG4gICAgICAgICAgICAgICAgaWYgKCQoZXZ0KS5wYXJlbnRzKCcucGFuZWwtaGVhZGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmtJbmZvLnRhcmdldCA9PT0gJ19ibGFuaycpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4obGlua0luZm8uaHJlZiwgJ19ibGFuaycpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmtJbmZvLmhyZWYuaW5kZXhPZignaHR0cCcpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbGlua0luZm8uaHJlZjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24udXJsKGxpbmtJbmZvLmhyZWYpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkcmlsbGRvd25Ub29sdGlwLmRldGFjaCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVsZW0ubW91c2Vtb3ZlKGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghbGlua0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRyaWxsZG93blRvb2x0aXAudGV4dCgnY2xpY2sgdG8gZ28gdG86ICcgKyBsaW5rSW5mby50aXRsZSk7XG4gICAgICAgICAgICAgICAgZHJpbGxkb3duVG9vbHRpcC5wbGFjZV90dChlLnBhZ2VYLCBlLnBhZ2VZIC0gNTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBob29rdXBEcmlsbGRvd25MaW5rVG9vbHRpcCgpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRzLm9uKCdyZW5kZXInLCAoKSA9PiB7XG4gICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICAgIGN0cmwucmVuZGVyaW5nQ29tcGxldGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JGb3JWYWx1ZShkYXRhLCB2YWx1ZSkge1xuICAgIGlmICghXy5pc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGRhdGEudGhyZXNob2xkcy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgaWYgKHZhbHVlID49IGRhdGEudGhyZXNob2xkc1tpIC0gMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmNvbG9yTWFwW2ldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uZmlyc3QoZGF0YS5jb2xvck1hcCk7XG59XG5cbmV4cG9ydCB7IEJsZW5kU3RhdEN0cmwsIEJsZW5kU3RhdEN0cmwgYXMgUGFuZWxDdHJsLCBnZXRDb2xvckZvclZhbHVlIH07XG4iXX0=