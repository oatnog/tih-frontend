<template>
  <v-app>
    <div id="bar-chart">
      <bar-chart
        v-if="loaded"
        :chart-data="chartdata"
        :options="options"
      />

      <v-container fluid>
        <div id="chooser">
          <v-select
            v-model="select"
            :items="dates"
            label="Choose Date"
            item-value="date"
            @change="changeDate"
          />
        </div>
      </v-container>
    </div>
  </v-app>
</template>

<script>
  import BarChart from '@/components/BarChart'
  import axios from 'axios'
  import Vuetify from 'vuetify'

  const RESTService = 'https://tih.pythonanywhere.com/'
  // const RESTService = 'https://tih-reports.onrender.com/'
  // const RESTService = 'http://localhost:5000/'

  export default {
    el: '#chooser',
    name: 'ChartContainer',
    components: { BarChart },
    vuetify: new Vuetify(),
    data: () => ({
      loaded: false,
      chartdata: null,
      dates: null,
      selectedDate: null,
    }),
    async mounted () {
      this.loaded = false
      await this.initControls()
      this.initChart()
      await this.updateChart()
    },
    methods: {
      changeDate (event) {
        console.log("I'm clicking a cow")
        console.log(event)
        this.selectedDate = event
        this.updateChart()
      },
      async initControls () {
        const res = await axios(RESTService + 'available-dates')
        const allDates = res.data.map(date => new Date(date))
        allDates.sort().reverse()
        // const newest = new Date(Math.max(...allDates));
        this.selectedDate = allDates[0].toISOString().substring(0, 10)
        this.dates = allDates.map(date => date.toISOString().substring(0, 10))
        console.log(this.selectedDate)
      },
      initChart () {
        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                min: 0,
                max: 600,
              },
            }],
          },
        }
      },
      async updateChart () {
        try {
          console.log(this.selectedDate)
          const res = await axios(RESTService + 'status/' + this.selectedDate)

          this.chartdata = {
            labels: res.data.filings.map(filing => {
              return filing.status
            }),
            datasets: [{
              label: 'Tax Returns Totals as of ' + this.selectedDate,
              backgroundColor: '#dc2b2b',
              data: res.data.filings.map(filing => {
                return filing.total
              }),
            }],
          }
          this.loaded = true
        } catch (e) {
          console.error(e)
        }
      },
    },
  }
</script>

<style scoped>

</style>
