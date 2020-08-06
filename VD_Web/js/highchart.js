$( document ).ready(function() {
  Highcharts.chart('downbox', {

      chart: {
        scrollablePlotArea: {
          minWidth: 500
        }
      },
      
      data: {
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/analytics.csv',
        beforeParse: function(csv) {
          return csv.replace(/\n\n/g, '\n');
        }
        // rowsURL: 'https://demo-live-data.highcharts.com/time-rows.json',
        // firstRowAsNames: false,
        // enablePolling: true

      },
      
      title: {
        text: '流率與速率-時間圖',
        style: {
          fontFamily:'Microsoft JhengHei' 
        }
      },
      
      subtitle: {
        text: 'nfbVD-N1-S--0.008-M-LOOP',
        style: {
          fontFamily:'Microsoft JhengHei' 
        }
      },
      
      xAxis: {
        tickInterval: 24*60*60*1000*7  , // one day
        tickWidth: 0,
        gridLineWidth: 0,
        labels: {
          align: 'center',
          x: 0,
          y: 10
        }
      },
      
      yAxis: [{ // left y axis
        title: {
          text: null
        },
        labels: {
          align: 'left',
          x: 3,
          y: 16,
          format: '{value:.,0f}'
        },
        showFirstLabel: false
      }, { // right y axis
        linkedTo: 0,
        gridLineWidth: 0,
        opposite: true,
        title: {
          text: null
        },
        labels: {
          align: 'right',
          x: -3,
          y: 16,
          format: '{value:.,0f}'
        },
        showFirstLabel: false
      }],
      
      legend: {
        align: 'left',
        verticalAlign: 'top',
        borderWidth: 0
      },
      
      tooltip: {
        shared: true,
        crosshairs: true
      },
      
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function(e) {
                hs.htmlExpand(null, {
                  pageOrigin: {
                    x: e.pageX || e.clientX,
                    y: e.pageY || e.clientY
                  },
                  headingText: this.series.name,
                  maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                    this.y + ' sessions',
                  width: 200
                });
              }
            }
          },
          marker: {
            lineWidth: 1
          }
        }
      },
      
      series: [{
        name: 'All sessions',
        lineWidth: 4,
        marker: {
          radius: 4
        }
      }, {
        name: 'New users'
      }]
      });
})