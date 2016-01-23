/**
 * User: steven
 * Email:21xsj@163.com
 * Description:
 */
;(function (window, document, undefined) {
    var isGoogleLoaded = false;
    loadJs('http://www.google.com/jsapi?callback=RecommendWidgetUtil.googleLoaded');

    window.RecommendWidgetUtil = {
        googleLoaded: function () {
            google.load('search', '1', {
                'nocss': true,
                'callback': function () {
                    isGoogleLoaded = true;
                }
            });
        }
    };

    /**
     * Widget Constructor,it should be called by some other components
     * @param opts
     * @constructor
     */
    window.RecommendWidget = function (opts) {
        this.options = {
            widget_width: '400',
            widget_border_color: '#e4971e',
            title_text_color: 'green',
            title_text_size: '15',
            snippet_text_color: '#555',
            snippet_text_size: '12',
            item_space: '25',
            text_align: 'left',
            result_size: 5,
            keyword: '',
            outer_style: false
        };
        extend(this.options, opts);
    };

    /**
     * populate search result items to specified dom
     * @param id
     */
    RecommendWidget.prototype.populate = function (id) {
        this.widget_area_id = id;
        if (!this.options.keyword) {
            alert('Can not find keyword parameter when you call RecommendWidget library');
            return;
        }
        this.showLoadingTips();
        var that = this;
        var check_interval = setInterval(function () {
            if (isGoogleLoaded) {
                clearInterval(check_interval);
                that.webSearch();
            }
        }, 50);
    };

    /**
     * search with google web search API
     */
    RecommendWidget.prototype.webSearch = function () {
        var that = this;
        var startTime = +new Date();
        var webSearch = new google.search.WebSearch();
        webSearch.setResultSetSize(this.options.result_size);
        webSearch.setSearchCompleteCallback(window, function (searcher, searchNum) {
            console.log('finish search keyword:%s,cost(ms):%s', that.options.keyword, (+new Date() - startTime));
            var results = searcher.results;
            that.renderSearchResult(results);
        }, [webSearch]);
        console.log('starting search keyword:%s', this.options.keyword);
        webSearch.execute(this.options.keyword);
    };

    /**
     * render search result
     * @param results
     */
    RecommendWidget.prototype.renderSearchResult = function (results) {
        function generateHTML4DataList(dataList) {
            var array = [
                '<div class="widget-body">',
                '    <ul>',
                '        {li_list}',
                '    </ul>',
                '</div>'
            ];
            var html = array.join('');
            var rows = '';
            if (dataList && dataList.constructor == Array) {
                dataList.forEach(function (value, index) {
                    var item = '<li><a href="{href}" target="_blank" title="{title}">{title}</a><p>{snippet}</p></li>';
                    item = item.replace(new RegExp('\{href\}', "gm"), value['url']);
                    item = item.replace(new RegExp('\{title\}', "gm"), value['title']);
                    item = item.replace(new RegExp('\{snippet\}', "gm"), value['snippet']);
                    rows += item;
                });
            }
            html = html.replace(new RegExp('\{li_list\}', "gm"), rows);
            return html;
        }

        var array = [];
        results.forEach(function (value, index) {
            array.push({
                title: value['titleNoFormatting'], snippet: value['content'], url: value['url']
            });
        });
        var html = '';
        if (this.options.outer_style === false) {
            html = this.getStyleDefinition();
        }
        html += generateHTML4DataList(array);
        document.querySelector('#' + this.widget_area_id).innerHTML = html;
    };

    /**
     * show loading tips when searching
     */
    RecommendWidget.prototype.showLoadingTips = function () {
        var array = [
            '<div class="widget-body">',
            '    <ul>',
            '        <li class="widget-loading">Searching...</li>',
            '    </ul>',
            '</div>'
        ];
        var tpl = array.join('');
        var html = '';
        if (this.options.outer_style === false) {
            html = this.getStyleDefinition();
        }
        html += tpl;
        document.querySelector('#' + this.widget_area_id).innerHTML = html;
    };

    /**
     * get style tag for widget
     * @returns {string}
     */
    RecommendWidget.prototype.getStyleDefinition = function () {
        var widget_width = this.options.widget_width;
        var array = [
            '<style>',
            '    {area_id}{',
            '        display:inline-block;',
            '    }',
            '    {area_id} .widget-loading{',
            '        text-align:center;',
            '        padding:20px 0;',
            '        color:#A2A215;',
            '        font-weight:bold;',
            '    }',
            '    {area_id} .widget-body{',
            '        width:{widget_width}px;',
            '    }',
            '    {area_id} .widget-body ul{',
            '        margin:0;',
            '        padding:10px;',
            '        list-style: none;',
            '        border: 1px {border_color} solid;',
            '        text-align:{text_align};',
            '        border-radius: 5px 5px 5px 5px;',
            '    }',
            '    {area_id} .widget-body a *{',
            '        vertical-align: middle;',
            '    }',
            '    {area_id} .widget-body li{',
            '        margin-bottom:{item_space}px;',
            '    }',
            '    {area_id} .widget-body li:last-child{',
            '        margin-bottom:0px;',
            '    }',
            '    {area_id} .widget-body li p{',
            '        margin:0;',
            '        color:{snippet_text_color};',
            '        font-size:{snippet_text_size}px;',
            '    }',
            '    {area_id} .widget-body a{',
            '        display: inline-block;',
            '        text-decoration: none;',
            '        font-size: {title_text_size}px;',
            '        color: {title_text_color};',
            '        overflow:hidden;',
            '    }',
            '</style>'
        ];
        var style = array.join('\n');
        style = style.replace(new RegExp('\{widget_width\}', "gm"), this.options.widget_width);
        style = style.replace(new RegExp('\{border_color\}', "gm"), this.options.widget_border_color);
        style = style.replace(new RegExp('\{text_align\}', "gm"), this.options.text_align);
        style = style.replace(new RegExp('\{item_space\}', "gm"), this.options.item_space);
        style = style.replace(new RegExp('\{title_text_size\}', "gm"), this.options.title_text_size);
        style = style.replace(new RegExp('\{title_text_color\}', "gm"), this.options.title_text_color);
        style = style.replace(new RegExp('\{snippet_text_size\}', "gm"), this.options.snippet_text_size);
        style = style.replace(new RegExp('\{snippet_text_color\}', "gm"), this.options.snippet_text_color);
        style = style.replace(new RegExp('\{area_id\}', "gm"), '#' + this.widget_area_id);
        return style;
    };

    function loadJs(url) {
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript = document.createElement("script");
        oScript.setAttribute('type', "text/javascript");
        oScript.setAttribute('src', url);
        oHead.appendChild(oScript);
    }

    function extend(target, source) {
        if (!target) {
            console.warn('The target is null');
            return;
        }
        if (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        }
    }
})(window, document);