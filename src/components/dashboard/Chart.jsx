import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Moment from 'moment';

const Chart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setDatalist] = useState([]);
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  useEffect(() => {
    let isMounted = true;

    axios.get(`/Sale/sale`).then((res) => {
      if (isMounted) {
        let list = [];
        if (res.status === 200) {
          res.data.data.forEach((item) => list.push(item));
          list = list.reverse();
          axios.get(`/Sale/predict`).then((res) => {
            if (isMounted)
              if (res.status === 200) {
                var date = new Date();
                var firstDate = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  1,
                );
                for (let i = 0; i < res.data.data.forecastedSales.length; i++) {
                  var date = firstDate.addDays(i);
                  var index = list.findIndex(
                    (item) =>
                      Moment(item.date).format('DD/MM/yyyy') ==
                      Moment(date).format('DD/MM/yyyy'),
                  );
                  if (index > 0) {
                    list[index].forecastedSale =
                      res.data.data.forecastedSales[i];
                    list[index].lowerBoundSale =
                      res.data.data.lowerBoundSales[i] > 0
                        ? res.data.data.lowerBoundSales[i]
                        : 0;
                    list[index].upperBoundSale =
                      res.data.data.upperBoundSales[i];
                  } else
                    list.push({
                      date,
                      year: Moment(date).format('yyyy.MM'),
                      forecastedSale: res.data.data.forecastedSales[i],
                      lowerBoundSale:
                        res.data.data.lowerBoundSales[i] > 0
                          ? res.data.data.lowerBoundSales[i]
                          : 0,
                      upperBoundSale: res.data.data.upperBoundSales[i],
                    });
                }
                list.forEach(
                  (item) =>
                    (item.date = Moment(item.date).format('DD/MM/yyyy')),
                );
                setDatalist(list);
                setLoading(false);
              }
          });
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <h4>Đang tải dữ liệu...</h4>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 40,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis xAxisId="0" dataKey="date" hide="true" />
        <XAxis xAxisId="1" dataKey="year" allowDuplicatedCategory={false} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="totals"
          fill="#8884d8"
          stroke="#8884d8"
        />
        <Line type="monotone" dataKey="forecastedSale" stroke="#82ca9d" />
        <Line type="monotone" dataKey="lowerBoundSale" stroke="red" />
        <Line type="monotone" dataKey="upperBoundSale" stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Chart;
