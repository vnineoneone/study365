import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
// import ReactApexChart from "react-apexcharts";
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      rangeBarGroupRows: true,
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },

  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " %"
      }
    },
    x: {
      formatter: function (val) {
        return `Điểm số: ${val - 1}-${val}`
      }
    }

  }
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

export default function ChartTwo() {
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: "Phần trăm",
        data: [8, 5, 7, 6, 4, 9, 40, 10, 6, 5],
      },
    ],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Biểu đồ tỉ lệ phần trăm điểm
          </h4>
        </div>
        <div>
          <div className="x">
            <select id="courses" name="course" className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
              <option value="" defaultChecked>Chọn đề thi</option>
              <option value="all_course" >Tất cả đề thi</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};
