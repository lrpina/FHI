//1/22/2017


(function() {
	// array of available moods to choose from 
	var mood_array = ["nightmare", "okay", "rested", "tired"];
	
	// user constants
	var user_info = [{"Name": "User 0", "Age": 45, "targetHours": 7, "pic": "moods/user.png"}, 
					{"Name": "User 1", "Age": 47, "targetHours": 7, "pic": "moods/user.png"}, 
					{"Name": "User 2", "Age": 10, "targetHours": 10, "pic": "moods/user.png"}, 
					{"Name": "User 3", "Age": 7, "targetHours": 10, "pic": "moods/user.png"}];
	
	var	user_moods, // array of moods that users select
		user_data; // array of user's fitbit data

	window.onload = function() {
		
		// TODO: check for new day
		// if new day then reset arrays and retrieve data
		resetForNewDay();
		
		// set text for each user
		setTextforUser();
			
		// first populate the charts on page refresh
		//populateCharts();
		
		// listen for onclick events on each mood from menu
		for (var i = 0; i < 4; i++) {
			for (var j = 0 ; j < mood_array.length; j++) {
				// once user clicks on mood, charts get updated
				var selected_mood = document.getElementById(mood_array[j] + i);
				selected_mood.onclick = function(x,y){ 
					return function() {
						initiate(x,y);
					};
				}(i, mood_array[j]);
			}
		}
	};
	
	function resetForNewDay() {
		user_moods = [null, null, null, null];
		user_data=[null, null, null, null];
	}
	
	function setTextforUser() {
		for (var i = 0; i < 4; i++) {
			
			// user picture
			var pic = document.createElement('img');
			pic.src = user_info[i].pic;
			pic.setAttribute("class", "pic");
			pic.style.width = "75px";
			pic.style.height = "75px";
			var userpic = document.getElementById("userpic" + i);
			userpic.innerHTML = "";
			userpic.appendChild(pic);
			
			// user name and age
			var p1 = document.createElement('p');
			p1.setAttribute("id", "info" + i);
			p1.innerHTML = user_info[i].Name + ", " + user_info[i].Age + " years old";
			p1.style.marginBottom = "0";
			p1.style.padding = "20px 0 0 20px";
			var info = document.getElementById("user-info" + i);
			info.innerHTML = "";
			info.appendChild(p1);
			
			// target hours
			var p3 = document.createElement('div');
			p3.setAttribute("id", "target-hours"+i);
			p3.innerHTML = "Target:<br>" + user_info[i].targetHours + " hours";
			p3.style.marginBottom = "0";
			p3.style.position = "absolute";
			p3.style.bottom = "0";
			p3.style.right = "60px";
			info.appendChild(p3);
		}
	}
	
	// get sleep data for a user and store them in user_data 
	function getData(user) {
		$.getJSON('sangwha_sleep_20160724.json', function (data) {
			//console.log(data);
			var minutesAsleep = data.sleep[0].minutesAsleep;
			user_data[user] = {
				"minutesAsleep":minutesAsleep
			};
		})
		.error(function() { // the index of all user arrays revert back 
			$('#moods'+user).modal('hide');
			alert("Your sleep data for today is not yet ready. Please try again."); 
		});
	}

	function initiate(i, m) {
		console.log("Today, index " + i + " is " + m);
		user_moods[i] = m;
		getData(i);
		
		// draw chart for the user index i
		if (user_data[i]) {
			console.log("index " + i + " and mood " + user_moods[i] +" has been clicked");
			updateText(i);
			makeChart(i);
			updateMoon();
		}
		return false;
	}
	
	// called when page is refreshed
	function populateCharts() {
		// iterate through all indices in the array
		// if data is present, then makeChart
		for (var i = 0; i < 4; i++) {		
			if (user_data[i]) {
				console.log("index " + i + " and mood " + user_moods[i] +" has been clicked");
				updateText(i);
				makeChart(i);
				updateMoon();
			}
		}
	}
	
	// update sleep data text
	function updateText(i) {
		// add percentage slept text
		var minutesAsleep = user_data[i].minutesAsleep;
		var percentage = Math.round((minutesAsleep * 100) / (user_info[i].targetHours * 60));
		var str = "Percentage slept: " + percentage + "%";
		var info = document.getElementById("info" + i); 
		var temp = info.innerHTML + "<br>" + str;
		info.innerHTML = temp;
		
		if (percentage > 100) {
			var targetHours = document.getElementById("target-hours" + i);
			targetHours.innerHTML = "Target met!";
		}
		
		//add number of hours slept;
		var p = document.getElementById("hours_slept_text" + i);
		var hr = (minutesAsleep / 60).toFixed(1);
		var temp = p.innerHTML + hr + " hours";
		p.innerHTML = temp;
	}
	
	// make doughnut chart with given index
	function makeChart(index) {
		// first delete the img and modal in chart-section div at index
		var chart_section = document.getElementById("chart-section" + index);
		$('#moods'+index).modal('hide');
		chart_section.innerHTML = "";
		
		// create canvas to draw the chart in 
		var canv = document.createElement('canvas');
		canv.id = "chart-area" + index;
		canv.style.height = '150px';
		canv.style.width = '150px';
		chart_section.appendChild(canv);
		
		var minutesAsleep = user_data[index].minutesAsleep;
		//var	minutesAwake = user_data[index].minutesAwake;
		var targetMinutes = 60 * user_info[index].targetHours;
		var data_array = new Array(minutesAsleep, targetMinutes - minutesAsleep);
		
		var color;
		if ((minutesAsleep*100)/(targetMinutes) > 90) {
			color = "rgb(0, 128, 0)"; // green
		} else {
			color = "rgb(255,0,0)"; // red
		}

		// insert user selected mood image in the center of doughnut
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
			img.src = "moods/" + chart.options.title.text + ".png";
			img_width = img.width * 3/4;
			img_height = img.height * 3/4;
			img_x = (width - img_width) / 2;
			img_y = height/2 - img_height * 3/4;
			ctx.drawImage(img, img_x, img_y, img_width, img_height);
					
			ctx.save();
		  }
		});
		
		// config to pass to chart
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
				title: {
					display: true,
					text: user_moods[index],
					position: 'bottom'
				},
				animation: {
					//animateScale: true,
					animateRotate: true
				},
				cutoutPercentage: 75		
			}
		};
		// draw the chart
		var ctx = document.getElementById(canv.id).getContext("2d");
		window.myDoughnut = new Chart(ctx, config);
	}
	
	function updateMoon() {
		//select #moon_img and update with averaged image
		var moon_section = document.getElementById("CrescentMoon");
		var total_mins = 0,
			total_targetHours = 0;
		moon_section.innerHTML = "";
		for (var i = 0; i < 4; i++) {
			total_targetHours += user_info[i].targetHours;
			if (user_data[i])
				total_mins += user_data[i].minutesAsleep;
		}

		var perc = ((total_mins / 60.0) * 100) / total_targetHours;
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
		
		// add family sleep goal text above moon
		var family = document.getElementById("family-sleep-goal");
		family.innerHTML = "Family Sleep Goal:<br>" + Math.round(perc) + "% completed";
		
		// add moon to page
		$('document').ready(function(){
			var elem = document.createElement("img");
			elem.src = moon_img;
			elem.setAttribute("id", "moon_img");
			moon_section.appendChild(elem);
		});
	}

})();