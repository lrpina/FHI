
$.getJSON('sangwha_sleep_20160724.json', function (data) {
    //console.log(data);

	// user chooses which emoji to show
	var imgURL = "emoji.jpeg"; //currently hard coded as a string

	var minutesAsleep = data.sleep[0].minutesAsleep;
	var minutesAwake = data.sleep[0].minutesAwake;
	var data_array = new Array(minutesAsleep, minutesAwake);

	// finds out which color to show
	var color;
	if ((minutesAsleep*100)/(minutesAsleep+minutesAwake) > 95) {
		color = "rgb(0, 128, 0)"; // green
	} else {
		color = "rgb(255,0,0)"; // red
	}

	// position elements inside/around doughnut
	Chart.pluginService.register({
	  beforeDraw: function(chart) {
		var width = chart.chart.width,
			height = chart.chart.height,
			ctx = chart.chart.ctx;

		ctx.restore();
		var fontSize = "12px";
		ctx.font = fontSize + "em sans-serif";
		ctx.textBaseline = "middle";
	
		// add emoji image
		var img = new Image();
		img.src = imgURL;
		img_width = width/5;
		img_height = height/5;
		img_x = width/2 ;
		img_y = (height+img_height/2)/2;
		ctx.drawImage(img, img_x, img_y, img_width, img_height);

		// add text
		var hours = 8.0; //user set
		var target_hours;
		// if target is reached, string should read "Target Reached!" 
		// and no additional text is addeded
		if (minutesAsleep/60 < hours) {
			target_hours = "Target Hours: " + hours;
			
			var hours_slept_perc = Math.round((minutesAsleep*100)/(minutesAsleep+minutesAwake)),
				hours_slept = "Hours slept: " + Math.round((minutesAsleep/60)).toFixed(1),
				hours_slept_X,
				hours_slept_Y;
			if (hours_slept_perc >= 50) 
				hours_slept_X = 119 - ctx.measureText(hours_slept).width/2;
			else 
				hours_slept_X = width- ctx.measureText(hours_slept).width;
		
			if (hours_slept_perc > 75 || hours_slept_perc < 25) {
				hours_slept_Y = height/2;
			} else {
				hours_slept_Y = 4 * height/5;
			}
			ctx.fillText(hours_slept, hours_slept_X, hours_slept_Y);
		} else {
			target_hours = "Target Reached!";
		}
		target_hours_X = width/2,
		target_hours_Y = 140;
		ctx.fillText(target_hours, target_hours_X, target_hours_Y);
		
		ctx.save();
	  }
	});



	var config = {
		type: 'doughnut',
		data: {
			datasets: [{
				data: data_array,
				backgroundColor: [
					color,
					"rgb(255,255,255)"
				],
				label: 'Dataset 1'
			}]
		},
		options: {
			responsive: true,
			legend: {
				position: 'top',
			},
			title: {
				display: true
			},
			layout: {
			    padding: {
			    	left: 120,
			    	top: 120,
			    	right: 50,
			    	bottom: 50
			    }
		  	},
			animation: {
				//animateScale: true,
				animateRotate: true
			},
			cutoutPercentage: 80
			
		}
	};

//	window.onload = function() {
		for (var i = 1; i <= 4; i++) {
			var chart_id = "chart-area" + i;
			var ctx = document.getElementById(chart_id).getContext("2d");
			window.myDoughnut = new Chart(ctx, config);
		}
//	};

	// figure out the average % of all the family members' sleep
	var perc = 79;
	var moon_img = "moon/Slice";
	if (perc <= 10) {
		moon_img += "10.png"
	} else if (perc <= 20) {
		moon_img += "20.png"
	} else if (perc <= 30) {
		moon_img += "30.png"
	} else if (perc <= 40) {
		moon_img += "40.png"
	} else if (perc <= 50) {
		moon_img += "50.png"
	} else if (perc <= 60) {
		moon_img += "60.png"
	} else if (perc <= 70) {
		moon_img += "70.png"
	} else if (perc <= 80) {
		moon_img += "80.png"
	} else if (perc <= 90) {
		moon_img += "90.png"
	} else if (perc <= 95) {
		moon_img += "95.png"
	} else {
		moon_img += "100.png"
	}

	// add moon to page
	$('document').ready(function(){
		var elem = document.createElement("img");
		elem.src = moon_img;
		elem.setAttribute("id", "moon_img");
		document.getElementById("CrescentMoon").appendChild(elem);
		
		// add text on top of moon image
		var moon_text = document.createElement("div");
		moon_text.innerHTML = perc + "%";
		moon_text.setAttribute("style", "margin-left:150px; margin-top: -150px ");
		document.getElementById("CrescentMoon").appendChild(moon_text);
	});
});
/* 
var firstStop = document.getElementById('F1gst1');
percentage = '35%'; // average of all the family members' sleep
firstStop.setAttribute('offset',percentage);
 */
