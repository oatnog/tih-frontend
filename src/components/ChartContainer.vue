<template>
  <div class="container">
    <bar-chart
      v-if="loaded"
      :chart-data="chartdata"
      :options="options"
    />
    <div
      v-if="loaded"
      id="v-model-date-range"
    >
      <br>
      <label
        class="form-label"
        for="dateRange"
      > {{ selectedDateIndex }} of {{ dates.length - 1 }}</label>
      <input
        id="dateRange"
        v-model="selectedDateIndex"
        class="form-range"
        min="0"
        type="range"
        :max="dates.length - 1"
      >
      <button
        class="btn btn-primary"
        type="button"
        @click="cycleCharts()"
      >
        <i class="bi bi-play-circle">Play</i>
      </button>
      <br>
      <span> {{ selectedDate }}</span>
    </div>
  </div>
</template>

<script>
  import BarChart from '@/components/BarChart'
  import axios from 'axios'

  const REST_API = 'https://tih.pythonanywhere.com/'
  // const RESTService = "https://tih-reports.onrender.com/";
  // const RESTService = 'https://localhost:5000/'
  const RATE_CYCLE = 2000

  export default {
    name: 'ChartContainer',
    components: { BarChart },
    data: () => ({
      loaded: false,
      selectedDateIndex: 0,
      chartdata: null,
      dates: null,
    }),
    computed: {
      selectedDate () {
        this.updateChart(REST_API, this.dates[this.selectedDateIndex])
        return this.dates[this.selectedDateIndex]
      },
    },
    async mounted () {
      this.loaded = false
      await this.initControls(REST_API)
      this.initChart()
      await this.updateChart(REST_API, this.selectedDate)
    },
    methods: {
      cycleCharts () {
        console.log(this.timer)
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null // Is there a better way to toggle this?
        } else {
          this.play()
          // this.style.setProperty('i')
          this.timer = setInterval(this.play, RATE_CYCLE)
        }
      },
      play () {
        if (this.selectedDateIndex === this.dates.length - 1) {
          this.selectedDateIndex = 0 // back to start
        } else {
          this.selectedDateIndex++
        }
      },
      async initControls (restAPI) {
        const res = await axios(restAPI + 'available-dates')
        const allDates = res.data.map(date => new Date(date))
        allDates.sort((a, b) => a.getTime() - b.getTime())
        this.dates = allDates.map(date => date.toISOString().substring(0, 10))
        this.selectedDateIndex = this.dates.length - 1 // most recent
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
      async updateChart (restAPI, date) {
        try {
          console.log(date)
          const res = await axios(`${restAPI}status/${date}`)

          this.chartdata = {
            labels: res.data.filings.map(filing => {
              return filing.status
            }),
            datasets: [{
              label: 'Tax Returns Status as of ' + date,
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
