
(function () {
    "use strict";

    function jsonAll(arr, done) {
        function jsonPart(arr, part, done) {
            if (arr.length === 0) {
                done(undefined, part);
                return;
            }
            var head = arr.shift();
            d3.json(head, function (error, data) {
                if (error) {
                    done(error, part);
                    return;
                }
                part.push(data);
                jsonPart(arr, part, done);
            });
        }
        jsonPart(arr, [], done);
    }

    function barScale(d, index) {
        return d / attributes[index].maxCount * 100;
    }

    function appendValues(index) {
        var valueDiv = attributes[index].element.selectAll("div.value")
            .data(attributes[index].data)
            .enter().append("div")
            .attr("class", "value")
            .style("padding", "5px 5px")
            .style("line-height", "15px")
            .on("mousedown", function () { d3.event.preventDefault(); d3.event.stopPropagation(); })
            .on("click", function (d) {
                var queries = attributes.map(function (dd) {
                    return "count?attribute=" + dd.name + "&filter_attribute=" + attributes[index].name + "&filter_value=" + JSON.stringify(d._id);
                });
                var append = d3.event.shiftKey;
                jsonAll(queries, function (error, queryData) {
                    // Zero out query counts if it is not a shift-selection
                    // NOTE: This is not exactly right, there is double-counting
                    if (!append) {
                        attributes.forEach(function (attrib) {
                            attrib.data.forEach(function (value) {
                                value.queryCount = 0;
                            });
                        });
                    }

                    // Merge queryData into data
                    queryData.forEach(function (attrib, attribIndex) {
                        attrib.result.forEach(function (value) {
                            attributes[attribIndex].map[value._id].queryCount += value.count;
                        });
                    });

                    // Resort if sorting by query count
                    attributes.forEach(function (d, i) {
                        if (d.sort.field === "queryCount") {
                            changeSort(i, d.sort.field, d.sort.direction);
                        }
                    });

                    // Highlight the data
                    d3.select("#list-view").selectAll("div.column")
                        .each(function (attr, attrIndex) {
                            d3.select(this).selectAll("span.query")
                                .style("width", function (d) { return Math.round(barScale(d.queryCount, attrIndex)) + "%"; });
                        });
                });
            });

        valueDiv.append("span")
            .style("display", "block")
            .style("height", "5px")
            .style("position", "relative")
            .style("top", "5px")
            .style("background-color", "steelblue")
            .style("width", function (d) { return Math.round(barScale(d.count, index)) + "%"; })
            .html("&nbsp;")
        valueDiv.append("span")
            .style("display", "block")
            .style("height", "5px")
            .style("position", "relative")
            .style("background-color", "red")
            .attr("class", "query")
            .style("width", function (d) { return Math.round(barScale(d.queryCount, index)) + "%"; })
            .html("&nbsp;")
        valueDiv.append("small")
            .attr("class", "value")
            .text(function (d) { return d._id; });
    }

    function changeSort(index, field, direction) {
        attributes[index].element.selectAll("div.value").sort(function (a, b) {
            return direction * d3.ascending(a[field], b[field]);
        });
        attributes[index].sort = {field: field, direction: direction};
    }

    var attributes = [];

    function addAttribute(name) {
        d3.json("count?attribute=" + name, function (error, data) {
            var attribute = {
                name: name,
                sort: {field: "count", direction: -1},
                maxCount: data.result[0].count,
                map: {},
                index: attributes.length,
                data: data.result
            };
            data.result.forEach(function (value) {
                attribute.map[value._id] = value;
                value.queryCount = 0;
            });
            attributes.push(attribute);

            attribute.element = d3.select("#list-view").append("div")
                .attr("class", "column col-sm-2");

            attribute.element.append("h4")
                .text(name);

            var sortTypes = [
                {name: "abc", field: "_id", direction: 1},
                {name: "count", field: "count", direction: -1},
                {name: "select", field: "queryCount", direction: -1},
            ];

            var group = attribute.element.append("div")
                .attr("class", "btn-group")
                .attr("data-toggle", "buttons")
                .selectAll("div.btn")
                .data(sortTypes)
                .enter().append("div")
                .attr("class", "btn btn-xs btn-primary")
                .classed("active", function (d) { return d.name === "count"; })
                .html(function (d) { return '<input type=radio name=mode> ' + d.name; })
                .on("click", function (d) {
                    changeSort(attribute.index, d.field, d.direction);
                });
            appendValues(attribute.index);
        });
    }

    d3.json("attributes", function (error, names) {
        d3.select("#select-attribute").selectAll("option")
            .data(names.result)
            .enter().append("option")
            .text(function (d) { return d; });

        // Preload some attributes.
        addAttribute('year');
        addAttribute('authors');
        addAttribute('concepts');
    });

    d3.select("#add").on("click", function () {
        addAttribute($("#select-attribute").val());
    });


}());
