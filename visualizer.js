$.getScript("http://code.highcharts.com/highcharts.js", function(){
	$.getScript("http://code.highcharts.com/modules/exporting.js", function(){
		process();
	});
});

window.hive = {};
window.hive.current_level = "";

function process(){
	$("#guid").text(analysis_data.guid);
	$("#from").text(analysis_data.start_time);
	$("#to").text(analysis_data.end_time);
	$("#tot_log").text(analysis_data.logs_count);
	
	var log_level = Object.keys(analysis_data.ll_cl_msg_counter)[0];
	plotLogsPerLogLevel(analysis_data.ll_cl_msg_counter,log_level);
	plotMsgsInClassesForLogLevel(analysis_data.ll_cl_msg_counter[log_level], log_level);
	initMessageTable();
}

function plotLogsPerLogLevel(data,log_level){
	var pie_data = [];
	for(var l in data){
		if(l == log_level){
			pie_data.push({
							name: l,
		                    y: data[l]["messages"],
		                    sliced: true,
		                    selected: true
						});
		}else{
			pie_data.push([l, data[l]["messages"]]);	
		}
	}
	$('#gb_ll').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Logs percentage per Log Level'
        },
        tooltip: {
    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function(){
                    	return '<b>'+ this.point.name + '</b>: ' + this.percentage.toFixed(1) + '% - [' + this.point.y +' Logs / ' + data[this.point.name]["classes"] +' Classes]';
                    }
                }
            },
            series: {
            	point:{
	                events: {
	                    click: function() {
	                   		plotMsgsInClassesForLogLevel(analysis_data.ll_cl_msg_counter[this.name], this.name);
	                    }
	                }
               	}
            }
        },
        series: [{
            type: 'pie',
            name: 'Log Level',
            data: pie_data
        }]
    });
}

function plotMsgsInClassesForLogLevel(data, title){
	var bar_data = [];
	for(var l in data){
		if(l != "messages" && l != "classes")
			bar_data.push({name: l, y: data[l]});
	}
	$('#gb_class').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: "Number of messages per class in '" + title + "' Level"
        },
        xAxis: {
            type: 'category',
            labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
        },
        yAxis: {
            title: {
                text: '#Messages'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                       		$("#show_table").show();
                       		fillMessagesTable(analysis_data.gb_ll_cl_msg[title][this.name]);
                        }
                    }
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> <br/>'
        }, 

        series: [{
            name: 'Classes',
            colorByPoint: true,
            data: bar_data
        }]
    })

}

function fillMessagesTable(messages){
	var mydata = [];
	for(m in messages){
		mydata.push({msg: m, count: messages[m]});
	}
	jQuery("#msg_tbl").empty();
	for(var i=0;i<=mydata.length;i++){
		jQuery("#msg_tbl").jqGrid('addRowData',i+1, mydata[i]); 
	}
	
}

function initMessageTable(){
	jQuery("#msg_tbl").jqGrid({ 
		datatype: "local", 
		height: 250, 
		colNames:['Message','Count'], 
		colModel:[ {name:'msg',index:'msg', width:400}, {name:'count',index:'count', width:200, align:"right",sorttype:"int"}],
		rowNum:20,
		pager: '#msg_pager',
	});
}
