import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    height: 350,
    type: 'line',
  },
  stroke: {
    width: [0, 4]
  },
  // title: {
  //   text: 'Traffic Sources'
  // },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1]
  },
  labels: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  yaxis: [{
    title: {
      text: 'Tổng lượt mua',
    },

  }, {
    opposite: true,
    title: {
      text: 'Doanh thu'
    }
  }]
};

export default function ChartThree() {
  const [state, setState] = useState<any>({
    series: [{
      name: 'Tổng lượt mua',
      type: 'column',
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
    }, {
      name: 'Doanh thu',
      type: 'line',
      data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
    }]
  });

  const handleReset = () => {
    setState((prevState: any) => ({
      ...prevState,
      series: [65, 35],
    }));
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 py-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Biểu đồ tổng lượt mùa và doanh thu
          </h5>
        </div>
        <div>
          <select id="courses" name="course" className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
            <option value="" defaultChecked>Chọn khóa học</option>
            <option value="all_course" >Tất cả khóa học</option>
          </select>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mt-5">
          <ReactApexChart
            options={options}
            series={state.series}
          />
        </div>
      </div>
    </div>
  );
};

