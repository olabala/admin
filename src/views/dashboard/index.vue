<template>
  <div class="dashboard-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="dateData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :chart-data="labelsData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from './components/PieChart'
import LineChart from './components/LineChart'

export default {
  name: 'Dashboard',
  components: { PieChart, LineChart },
  data() {
    return {
      dateData: {},
      labelsData: {}
    }
  },
  computed: {
  },
  created() {
    this.getDataByDate()
    this.getDataByLabels()
  },
  methods: {
    getDataByDate() {
      this.$store.dispatch('dashboard/getDataByDate').then((res) => {
        const xAxis = []
        const data = []
        res.forEach(item => {
          xAxis.push(item.columns)
          data.push(item.counts)
        })
        this.dateData = { xAxis, data }
      })
    },
    getDataByLabels() {
      this.$store.dispatch('dashboard/getDataByLabels').then((res) => {
        const legend = []
        const data = []
        res.forEach(item => {
          legend.push(item.columns)
          data.push({
            value: item.counts,
            name: item.columns
          })
        })
        this.labelsData = { legend, data }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.chart {
  height: 500px;
}

.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
