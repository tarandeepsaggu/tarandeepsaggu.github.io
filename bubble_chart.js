/* global d3 */

// bubble_chart.js
// source: https://medium.freecodecamp.org/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46
// source: https://bl.ocks.org/ProQuestionAsker/8382f70af7f4a7355827c6dc4ee8817d
// source: https://github.com/dmesquita/reusable_bubble_chart
var currentYear = 1985;
var currentFuelType = "Regular Gasoline";
var displayText = true;

function filterMake(row) {
    return row['Make'] == 'Honda';
}

function filterYear_FT(row)
{
    return row['Year'] == currentYear  && (row['Year'] % 5 == 0)
        && row['FuelType'] == currentFuelType 
        && (row['Make'] == 'Honda' 
            || row['Make'] == 'BMW'
            || row['Make'] == 'Ford'
            || row['Make'] == 'Chevrolet'
            || row['Make'] == 'Audi'
            || row['Make'] == 'Toyota'
            || row['Make'] == 'Nissan'
            || row['Make'] == 'Tesla'
            || row['Make'] == 'Mercedes-Benz'
            || row['Make'] == 'Volkswagen'
            || row['Make'] == 'Mitsubishi'
            || row['Make'] == 'Mazda'
            || row['Make'] == 'Suzuki'
            || row['Make'] == 'Dodge'
            || row['Make'] == 'Chrysler');
}

// return array of all unique years in data, sorted
function getAllYears(data)
{
    var years = d3.nest()
            .key(function (d) {
                // return d['Year'] - ( d['Year'] % 5); 
                return Math.ceil(d['Year']/5)*5;
            })
           .entries(data);

    years.forEach(function (d)
    {
        d.Year = d.key;
    })

    years.sort(function(x, y) {
        return d3.ascending(x.Year, y.Year);
    })
    years.pop();
    return years;
}

// return array of all unique fuel types in data
function getAllFuelTypes(data)
{
    var avgData = d3.nest()
        .key(function (d) {
            return d['FuelType']
        })
        .entries(data);
    avgData.forEach(function (d)
    {
        d.FuelType = d.key;
    })
    return avgData;

}

// average combined city/highway mpg grouped by make
function avgFuelEconomy(data)
{
    // return all 1985 avg city mpg data grouped by manufacturer
    var avgData = d3.nest()
            .key(function (d) {
                return d['Make']
            })
            .rollup(function (d) {
                return d3.mean(d, function (g) {
                    var avgCity = parseInt(g['AverageCityMPG']);
                    var avgHighway = parseInt(g['AverageHighwayMPG']);
                    return (avgCity + avgHighway)/2;
                });
            }).entries(data.filter(filterYear_FT));

    avgData.forEach(function (d) {
        d.Make = d.key;
        d.MPG = d.value;
        d.Year = currentYear;
        d.FuelType = currentFuelType;
    })
    return avgData;
}

// update annotation based on the year selected
function updateAnnotation()
{
    toggleButton();
    var text = "";
    switch(parseInt(currentYear))
    {
        case 1985:
            text = "\r\nIn 1985, Japanese Manufacturers as well as using Diesel for fuel reigned supreme" 
                + " when it came to fuel efficiency. \r\nSmall car manufacturers such as Suzuki and Honda were"
                + " outliers. German and American manufacturers averaged around 18 mpg. \r\nNo manufacturers were under pressure"
                + " from rising fuel prices. ";
            break;
        case 1990:
            text = "\r\nWithout the pressure of increasing gas prices, most manufacturers enjoyed not having to worry"
            + " about fuel efficiency.\r\n Therefore, average mpg depended on what kinds of cars the manufacturers made."
            + " Honda and Suzuki made really small cars, and so their fuel efficiency was high. "
            + " \r\nGerman and American manufacturers didn't improve at all, as they mostly produced sports and luxury cars. ";
            break;
        case 1995:
            text = "\r\nSmall improvements were being made. We can see that Ford and Audi improved, and Honda"
            + " decided to focus on motorsport and sports cars more \r\nwhich could explain their less than stellar fuel efficiency."
            + " Even though the Great Recession and the Energy Crisis of the 2000's hadn't occurred yet, \r\nmanufacturers like Chrysler" 
            + " were improving after realizing people's interest in efficient cars." ;
            break;
        case 2000:
            text = "\r\nAmerica's energy crisis began in the early 2000's and most manufacturers are hovering around 20 mpg."
            + " The energy crisis can be attributed to many factors, according to Wikipedia, \r\nsuch as Middle East tension and the falling"
            + " value of the US dollar. This data is taken from cars built around the world, however, "
            + " the trend will be noticeable over the following years regardless.";
            break;
        case 2005:
            text = "\r\nAverage gas prices start to rise exponentially after 2005, and manufacturers follow the demands of their customers."
            + "\r\nVolkswagen group, one of the largest automobile manufacturer conglomerates, has reached 24 mpg, and Honda is already"
            + " preparing itself for the future." ;
            break;
        case 2010:
            text = "\r\nIncremental gains are still being made, as these are averages of all cars produced by each manufacturer, including"
            + " sports and luxury cars. \r\nDespite that, most manufacturers are safely above 20-21 mpg,"
            + " including American manufacturers such as Chrysler and Ford. \r\nThey had to adjust in order to compete with Japanese manufacturers"
            + " in the US market.";
            break;
        case 2015:
            text = "\r\nBoth fuel prices and fuel efficiency had been increasing steadily until around 2015, when fuel prices started dropping."
            + " Despite that, consumers still loved paying less for gas, \r\nand we can see a much more even graph now. "
            + " Manufacturers were now directly challenging previous fuel economy powerhouses such as Honda, and according to my data,"
            + " \r\nChevrolet has the highest fuel efficiency for premium gasoline! ";
    }
    document.getElementById("slideAnnotation").textContent = text;
}

function toggleButton()
{
    var essay = 
        "\r\nThis presentation is comprised of a series of bubble charts that together make up an interactive slideshow."
        + "\r\nThe user navigates the different slides using the dropdowns at the top. Annotations pop up for each bubble,"
        + "\r\ndisplaying relevant information such as the manufacturer, average miles per gallon and the year the user is"
        + "\r\nlooking at. The year and fuel type are the parameters that the current visualization is based on, and therefore,"
        + "\r\nthe dropdowns that change these parameters are the triggers. Additionally, the user's mouse movement onto a bubble"
        + "\r\nand then taking the mouse off the bubble are both triggers for displaying and then removing each annotation, respectively." ;  
    var text = document.getElementById("aboutText");
    if (displayText == true && currentYear == 1985)
    {
        text.textContent = essay;
    }
    else
    {
        text.textContent = "";
    }
    displayText = !displayText;
}

function updatechart(selection) {
    var width = 600,
            height = 400,
            columnForColors = ["Make"],
            columnForRadius = ["MPG"];

    var data = selection.datum();
    var div = selection;
    var svg = div.selectAll('svg');
    svg.attr('width', width).attr('height', height);

    var oldData = data;
    data = avgFuelEconomy(data);
    selection.select("div").remove();
    var tooltip = selection
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "#626D71")
            .style("border-radius", "6px")
            .style("text-align", "center")
            .style("font-family", "monospace")
            .style("width", "250")
            .text("");


    // simulate physics of the circles
    // forceX and Y are 0 so that the circles aren't spread out
    var simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength([-50]))
            .force("x", d3.forceX(0))
            .force("y", d3.forceY(0))
            .on("tick", ticked);

    // updates the positions of the circles
    function ticked(e) {
        node.attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        });
        // 'node' is each circle of the bubble chart
    }

    // need to scale the radius to whatever variable we want
    // by defining domain and ranges and making them proportionate	
    
    var scaleRadius = d3.scaleLinear()
            .domain([d3.min(data, function (d) {
                    return +d[columnForRadius];
                }),
                d3.max(data, function (d) {
                    return +d[columnForRadius];
                })])
            .range([8, 20]);

    // now we scale the colors of the bubbles to discrete categories
    var colorCircles = d3.scaleOrdinal()
                .domain(['Honda', 'BMW', 'Ford', 'Chevrolet', 'Audi', 'Toyota', 'Nissan', 'Tesla', 'Mercedes-Benz', 'Volkswagen', 'Mitsubishi', 'Mazda', 'Suzuki', 'Dodge', 'Chrysler'])
                .range(['#001AE5', '#3F00E2', '#9600DF', '#DC00CD', '#DA0075', '#D7001F', '#D43400', '#D28600', '#C7CF00', '#74CC00', '#23C900', '#00C72B', '#00C477', '#00C0C1', '#0072BF']);
        //Remove any old data
        svg.selectAll("circle").remove();
        var node = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr('r', function (d) {
                    return scaleRadius(d[columnForRadius])
                })
                .style("fill", function (d) {
                    return colorCircles(d[columnForColors])
                })
                .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
                .on("mouseover", function (d) {
                    tooltip.html(d[columnForColors] + "<br>" + d['MPG'].toFixed(2) + "<br>" + d.Year);
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function () {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                    return tooltip.style("visibility", "hidden");
                });
}

function bubbleChart() {
    var width = 600,
        height = 600,
        maxRadius = 6,
        columnForColors = ["Make"],
        columnForRadius = ["MPG"];

    // @param {string} - The div ID that you want to render in
    function chart(selection) {
        var width = 600,
            height = 400,
            columnForColors = ["Make"],
            columnForRadius = ["MPG"];

        var data = selection.datum();
        var div = selection;
        var svg = div.selectAll('svg');
        svg.attr('width', width).attr('height', height);


        var oldData = data;
        data = avgFuelEconomy(data);
        updatechart(selection);
        updateAnnotation();

        // dropdown code for Years
        var allYears = getAllYears(oldData);
        var yearMenu = d3.select("#yearDropDown").insert("select").on("change", function () {
            currentYear = d3.select(this).property('value');
            updatechart(d3.select('#chart'));
            updateAnnotation(); 
            // console.log(d3.select(this).property('value'));
        });

        yearMenu.selectAll("option")
                .data(allYears)
                .enter()
                .append("option")
                .attr("value", function (d) {
                    return d.Year;
                })
                .text(function (d) {
                    return d.Year;
                })

        //Drop Down Code for Fuel Type
        var FuelTypes = getAllFuelTypes(oldData);
        var FTMenu = d3.select("#fuelTypeDD").insert("select").on("change", function () {
            currentFuelType = d3.select(this).property('value');
            updatechart(d3.select('#chart'));
            // console.log(d3.select(this).property('value'));
        });
        FTMenu.selectAll("option")
                .data(FuelTypes)
                .enter()
                .append("option")
                .attr("value", function (d) {
                    return d.FuelType;
                })
                .text(function (d) {
                    return d.FuelType;
                })

        FTMenu.property("value", "Regular Gasoline");
        // why don't these work?????
        // FTMenu.property("selected", function(d) { return d === "Regular Gasoline"; })
        // FTMenu.property("selected", function(d, i) { return 3; })

        console.log("Current fuel type: " + currentFuelType);
    }


    // width variable accessor
    chart.width = function (value) {
        if (!arguments.length) {
            return width;
        }
        width = value;

        return chart;
    };

    // height variable accessor
    chart.height = function (value) {
        if (!arguments.length) {
            return height;
        }
        height = value;

        return chart;
    };

    return chart;
}

