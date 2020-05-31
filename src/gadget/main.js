(() => {

    const windowConsole = window.console;
    const console = _.mapValues(windowConsole, fn => {
        return (...args) => fn.call(windowConsole, 'IFRAME', ...args);
    });

    function rest(api, data, method = 'GET') {
        return AP.request({
            method,
            url: `/rest/api/2/${api}`,
            data,
        }).
            then(data => {
                return JSON.parse(data.body);
            });
    }

    function getIssues() {
        const query = {
            jql: 'project = TEST AND statusCategory = "To Do"',
        };
        return rest('search', query);
    }

    function getIssueComments(issue){
        return rest(`issue/${issue.id}/comment`, {maxResults: 1});
    }

    async function fillIssuesComments(issues){
        const issuesComments = await Promise.all(issues.map(getIssueComments));
        console.log('issuesComments', issuesComments);
        issuesComments.forEach((comments, index) => {
            issues[index].comments = comments;
        });
    }

    getIssues().
        then(async issuestResult => {

            const {issues} = issuestResult;
            await fillIssuesComments(issues);

            console.log('issuestResult', issuestResult)

        }).
        catch(error => console.error('getIssues', error));

    /**
     * ---------------------------------------
     * This demo was created using amCharts 4.
     *
     * For more information visit:
     * https://www.amcharts.com/
     *
     * Documentation is available at:
     * https://www.amcharts.com/docs/v4/
     * ---------------------------------------
     */

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

    var chart = am4core.create('chart-div', am4charts.XYChart);

    var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxisX.renderer.ticks.template.disabled = true;
    valueAxisX.renderer.axisFills.template.disabled = true;

    var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisY.renderer.ticks.template.disabled = true;
    valueAxisY.renderer.axisFills.template.disabled = true;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueX = 'x';
    series.dataFields.valueY = 'y';
    series.dataFields.value = 'z';
    series.strokeOpacity = 0;
    series.sequencedInterpolation = true;
    series.tooltip.pointerOrientation = 'vertical';

    var bullet = series.bullets.push(new am4core.Circle());
    bullet.fill = am4core.color('#ff0000');
    bullet.fillOpacity = 0.75;
    bullet.propertyFields.fill = 'color';
    // bullet.strokeOpacity = 0;
    bullet.strokeWidth = 3;
    bullet.stroke = am4core.color('#ffffff');
    bullet.hiddenState.properties.opacity = 0;
    bullet.tooltipText = '[bold]{title}:[/]\nZ: {value.value}\nX: {valueX.value}\nY:{valueY.value}';

    // var outline = chart.plotContainer.createChild(am4core.Circle);
    // outline.fillOpacity = 0;
    // outline.strokeOpacity = 0.8;
    // outline.stroke = am4core.color('#ff0000');
    // outline.strokeWidth = 2;
    // outline.hide(0);
    //
    // var blurFilter = new am4core.BlurFilter();
    // outline.filters.push(blurFilter);
    //
    // bullet.events.on('over', function(event) {
    //     var target = event.target;
    //     outline.radius = target.pixelRadius + 2;
    //     outline.x = target.pixelX;
    //     outline.y = target.pixelY;
    //     outline.show();
    // });
    //
    // bullet.events.on('out', function(event) {
    //     outline.hide();
    // });

    var hoverState = bullet.states.create('hover');
    hoverState.properties.fillOpacity = 1;
    // hoverState.properties.strokeOpacity = 1;

    series.heatRules.push(
        {target: bullet, min: 10, max: 30, property: 'radius'});

    bullet.adapter.add('tooltipY', function(tooltipY, target) {
        return -target.radius;
    });

    const colors = [
        '#CE0000',
        '#EA4444',
        '#2A8735',
        '#55A557',
    ];

    function getRandomTitle(id) {
        return `TEST-${id}`;
    }

    function getRandomColor() {
        const index = colors.index || 0;
        const color = colors[index];
        colors.index = (index + 1) % colors.length;
        return color;
    }

    function getRandomY() {
        return _.random(0, 30);
    }

    function getRandomX() {
        return _.random(0, 120);
    }

    function getRandomZ() {
        return _.random(1, 60);
    }

    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.behavior = 'zoomXY';
    // chart.cursor.snapToSeries = series;
    //
    // chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarY = new am4core.Scrollbar();

    chart.data = _.range(50).map(id => {
        return {
            'title': getRandomTitle(id),
            'color': getRandomColor(),
            'x': getRandomX(),
            'y': getRandomY(),
            'z': getRandomZ(),
        };
    });

})();
