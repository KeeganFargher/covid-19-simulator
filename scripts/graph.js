const ctx = document.getElementById("graph-tracker").getContext("2d");

var myChart = new Chart(ctx, {
	type: "line",
	data: {
		labels: [""],
		datasets: [
			{
				label: "# of Infected",
				backgroundColor: "rgba(255, 99, 132, 0.4)",
				borderColor: "rgb(255, 99, 132)",
				data: [],
				borderWidth: 1
			},
			{
				label: "# of Susceptible",
				backgroundColor: "rgba(52, 152, 219, 0.4)",
				borderColor: "#3498db",
				data: [],
				borderWidth: 1
			},
			{
				label: "# of Dead",
				backgroundColor: "rgba(54, 54, 54, 0.4)",
				borderColor: "#363636",
				data: [],
				borderWidth: 1
			}
		]
	},
	options: {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true
					}
				}
			]
		}
	}
});
