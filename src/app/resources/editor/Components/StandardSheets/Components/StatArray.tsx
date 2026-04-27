import {Radar} from "react-chartjs-2";

export default function StatArray({stats}: {stats: Record<string, number>}) {
  
  return (
    <Radar
      className="max-h-full aspect-square"
      data={{
        labels: Object.keys(stats),
        datasets: [
          {
            data: Object.values(stats),
            fill: true,
            backgroundColor: "rgba(255, 0, 0, 0.3)",
            borderColor: "rgba(255, 0, 0, 0.7)",
            pointBackgroundColor: "rgba(255, 0, 0, 0.7)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 0, 0, 0.7)",
            pointRadius: 4,
          },
        ],
      }}
      options={{
        aspectRatio: 1,
        scales: {
          r: {
            min: 0,
            suggestedMax: 120,
            ticks: {
              stepSize: 20,
              font: {
                size: 8,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}
