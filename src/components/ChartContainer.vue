<template>
  <div class="container">
    <bar-chart
        v-if="loaded"
        :chart-data="chartdata"
        :options="options"/>

    <div id="chooser">
      <select class="form-control" @change="changeDate($event)">
        <option value="" selected disabled>Choose</option>
        <option v-for="date in dates" :key="date">{{ date }}</option>
      </select>
      <p><span>Selected Date: {{ selectedDate }}</span></p>
    </div>
  </div>
</template>

<script>
import BarChart from "@/components/BarChart";
import axios from "axios";

const RESTService = "https://165.232.147.1:5000/"
export default {
  name: 'ChartContainer',
  components: {BarChart},
  data: () => ({
    "loaded": false,
    "chartdata": null,
    "dates": null,
    "selectedDate": null,
  }),
  methods: {
    changeDate(event) {
      this.selectedDate = event.target.options[event.target.options.selectedIndex].text;
      this.updateChart();
    },
    async initControls() {
      const res = await axios(RESTService + 'available-dates');
      let allDates = res.data.map(date => new Date(date));
      allDates.sort().reverse();
      // const newest = new Date(Math.max(...allDates));
      this.selectedDate = allDates[0].toISOString().substring(0,10);
      this.dates = allDates.map(date => date.toISOString().substring(0,10));
      console.log(this.selectedDate);
    },
    initChart() {
      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 600,
            }
          }]
        },
      };
    },
    async updateChart() {
      try {
        console.log(this.selectedDate);
        const res = await axios(RESTService + 'status/' + this.selectedDate);

        this.chartdata = {
            labels: res.data.filings.map(filing => {
              return filing.status;
            }),
            datasets: [{
              label: "Tax Returns Status as of " + this.selectedDate,
              backgroundColor: "#dc2b2b",
              data: res.data.filings.map(filing => {
                return filing.total;
              }),
            },],
        };
        this.loaded = true;
      } catch (e) {
        console.error(e);
      }
    }
  },
  async mounted() {
    this.loaded = false;
    await this.initControls();
    this.initChart();
    await this.updateChart();
  }
}
</script>

<style scoped>

</style>