####################version 1##################
1.For a caller,it's very easily to integrate with "recommend widget" component.Please see the caller.html file.
In the html file,just include such snippet:
<script type="text/javascript" src="https://flyxsj.appspot.com/static/js/RecommendWidget.js?keyword=android" id="forWidgetScript"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        var obj = new RecommendWidget({
            result_size: '8',
            widget_width: '450',
            text_align: 'left',
            widget_border_color: 'red',
            title_text_color: 'green',
            snippet_text_color: '#555',
            title_text_size: '14',
            snippet_text_size: '12',
            item_space: '15'
        });
        obj.populate('widget-area');
    });
</script>
2.Widget options:
var obj = new RecommendWidget({
	//those are options
    result_size: '8',
    widget_width: '450',
    text_align: 'left',
    widget_border_color: 'red',
    title_text_color: 'green',
    snippet_text_color: '#555',
    title_text_size: '14',
    snippet_text_size: '12',
    item_space: '15'
});


result_size:define the list item size,depend on google web search api:from 1 to 8
widget_width:define recommend widget width.The unit is px
text_align:define text horizontal direction.Acceptable options are :left/center/right
widget_border_color:define widget border color,its value likes:red/#FFAACC/green
title_text_color:define title text color
snippet_text_color:define content snippet text color
title_text_size:define title text size,its unit is px
snippet_text_size:define content snippet text size,its unit is px
item_space:define the height of blank space between each result item.

##################version2##################
1.Please see the caller.html,there are 3 widgets.
2.Look at caller.html again,we can minimize the amount of code the caller as following:
2.1)Import libaray file within HTML head element:
<head>    
    <script type="text/javascript" src="js/RecommendWidget.js?v=1"></script>
</head>
2.2)Before </body> closed tag,populate the widget:
...
...
<script>
    new RecommendWidget({
        keyword: 'http://dealbook.nytimes.com/',
        outer_style: true
    }).populate('widget-area2');
</script>
</body>
3.Can we think if a way the caller can control the way the widget looks and styled using css?
Yes,of course.I added an option : outer_style,set its value as true.And import your own customization style file:
<link rel="stylesheet" type="text/css" href="css/widget.css" />

That is all
