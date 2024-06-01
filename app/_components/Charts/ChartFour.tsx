import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
// import ReactApexChart from "react-apexcharts";
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const options: ApexOptions = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    stackType: '100%'
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  // title: {
  //   text: '100% Stacked Bar'
  // },
  xaxis: {
    categories: ["Khóa học 1", "Khóa học 2", "Khóa học 3", "Khóa học 4", "Khóa học 5", "Khóa học 6", "Khóa học 7"],
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "%"
      }
    }
  },
  fill: {
    opacity: 1

  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40
  },

};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

export default function ChartTwo() {
  const [state, setState] = useState<ChartTwoState>({
    series: [{
      name: 'Hoàn thành',
      data: [44, 55, 41, 37, 22, 43, 21]
    }, {
      name: 'Không hoàn thành',
      data: [53, 32, 33, 52, 13, 43, 32]
    }],
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
            Biểu đồ tiến độ học
          </h4>
        </div>
        <div>
          <div className="x">
            <select id="courses" name="course" className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
              <option value="" defaultChecked>Chọn khóa học</option>
              <option value="all_course" >Tất cả khóa học</option>
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
