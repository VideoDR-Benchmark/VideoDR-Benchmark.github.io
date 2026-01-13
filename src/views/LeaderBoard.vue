<template>
  <div class="leaderboard">
    <!-- Header Section -->
    <section class="leaderboard-header">
      <div class="container">
        <div class="header-content fade-in-up">
          <h1 class="page-title">
            <i class="fas fa-trophy"></i>
            <span class="gradient-text">{{ config.pageMetadata.title }}</span>
          </h1>
          <p class="page-description">
            {{ config.pageMetadata.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Blocks Section -->
    <section class="content-blocks-section" v-if="config.externalLinks">
      <div class="container">
        <div class="content-blocks-grid">
          <!-- Paper Block -->
          <a :href="config.externalLinks.researchPaper.url" class="content-block card" target="_blank"
            rel="noopener noreferrer" v-if="config.externalLinks.researchPaper">
            <div class="content-icon">
              <i :class="config.externalLinks.researchPaper.icon"></i>
            </div>
            <div class="content-text">
              <h3>{{ config.externalLinks.researchPaper.title }}</h3>
              <p>{{ config.externalLinks.researchPaper.description }}</p>
            </div>
          </a>

          <!-- HuggingFace Block -->
          <a :href="config.externalLinks.huggingFace.url" class="content-block card" target="_blank"
            rel="noopener noreferrer" v-if="config.externalLinks.huggingFace">
            <div class="content-icon">
              <i :class="config.externalLinks.huggingFace.icon"></i>
            </div>
            <div class="content-text">
              <h3>{{ config.externalLinks.huggingFace.title }}</h3>
              <p>{{ config.externalLinks.huggingFace.description }}</p>
            </div>
          </a>

          <!-- Submit Model Block -->
          <a href="#" class="content-block card" @click.prevent="scrollToSubmit" v-if="config.externalLinks.submitModel">
            <div class="content-icon">
              <i :class="config.externalLinks.submitModel.icon"></i>
            </div>
            <div class="content-text">
              <h3>{{ config.externalLinks.submitModel.title }}</h3>
              <p>{{ config.externalLinks.submitModel.description }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Chart Section -->
    <section class="chart-section">
      <div class="container">
        <div class="chart-container card">
          <div class="chart-header">
          </div>
          <div class="chart-wrapper">
            <div class="chart-toggle">
              <button v-for="metric in chartMetrics" :key="metric.key" 
                      class="toggle-btn" 
                      :class="{ active: currentChartType === metric.key }" 
                      @click="switchChart(metric.key)">
                {{ metric.label }}
              </button>
            </div>
            <div ref="chartContainer" class="chart" style="width: 100%; height: 350px;"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-container card">
          <div class="filter-group">
            <label for="framework-filter">Framework:</label>
            <div class="custom-dropdown" @click="toggleDropdown('framework')"
              :class="{ 'active': activeDropdown === 'framework' }">
              <div class="dropdown-selected">
                <span>{{ getSelectedFrameworkText() }}</span>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </div>
              <div class="dropdown-options" v-show="activeDropdown === 'framework'">
                <div class="dropdown-option" v-for="framework in frameworks" :key="framework" :value="framework"
                  @click.stop="selectFramework(framework)" :class="{ 'selected': selectedFramework === framework }">
                  {{ framework }}
                </div>
                <div class="dropdown-option" value="all" @click.stop="selectFramework('all')"
                  :class="{ 'selected': selectedFramework === 'all' }">
                  All Frameworks
                </div>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label for="model-type">Model Type:</label>
            <div class="custom-dropdown" @click="toggleDropdown('modelType')"
              :class="{ 'active': activeDropdown === 'modelType' }">
              <div class="dropdown-selected">
                <span>{{ getSelectedModelTypeText() }}</span>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </div>
              <div class="dropdown-options" v-show="activeDropdown === 'modelType'">
                <div class="dropdown-option" value="all" @click.stop="selectModelType('all')"
                  :class="{ 'selected': selectedModelType === 'all' }">
                  All Models
                </div>
                <div class="dropdown-option" value="open-source" @click.stop="selectModelType('open-source')"
                  :class="{ 'selected': selectedModelType === 'open-source' }">
                  Open Source
                </div>
                <div class="dropdown-option" value="proprietary" @click.stop="selectModelType('proprietary')"
                  :class="{ 'selected': selectedModelType === 'proprietary' }">
                  Proprietary
                </div>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label for="metric-filter">Sort By:</label>
            <div class="custom-dropdown" @click="toggleDropdown('sortColumn')"
              :class="{ 'active': activeDropdown === 'sortColumn' }">
              <div class="dropdown-selected">
                <span>{{ getSelectedSortText() }}</span>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </div>
              <div class="dropdown-options" v-show="activeDropdown === 'sortColumn'">
                <div class="dropdown-option" v-for="metric in tableMetrics" :key="metric.key" 
                     :value="metric.key" 
                     @click.stop="selectSortColumn(metric.key)"
                     :class="{ 'selected': sortColumn === metric.key }">
                  {{ metric.label }}
                </div>
              </div>
            </div>
          </div>

          <button class="btn btn-secondary reset-btn" @click="resetFilters">
            <i class="fas fa-refresh"></i>
            Reset Filters
          </button>
        </div>
      </div>
    </section>

    <!-- Leaderboard Table -->
    <section class="leaderboard-table-section">
      <div class="container">
        <div class="table-container card">
          <div class="table-header">
            <h2>Model Performance Rankings</h2>
            <div class="table-info">
              <span class="result-count">{{ filteredResults.length }} models</span>
              <span class="last-updated">Last updated: {{ lastUpdated }}</span>
            </div>
          </div>

          <div class="table-wrapper">
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th class="rank-col">Rank</th>
                  <th class="provider-col">Provider</th>
                  <th class="type-col">Type</th>
                  <th class="model-col">Framework+LLM</th>
                  
                  <!-- Dynamic Metric Columns -->
                  <th v-for="metric in tableMetrics" :key="metric.key" class="metric-col" @click="sortBy(metric.key)">
                    {{ metric.label }}
                    <i class="fas fa-sort" :class="getSortIcon(metric.key)"></i>
                  </th>

                   <!-- <th class="date-col">Commit Date</th> -->
                  <th class="site-col">Site</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(model, index) in filteredResults" :key="model.id" class="model-row">
                  <td class="rank-col">
                    <div class="rank-badge" :class="getRankClass(index + 1)">
                      <span v-if="index < 3" class="rank-icon">
                        <i :class="getRankIcon(index + 1)"></i>
                      </span>
                      {{ index + 1 }}
                    </div>
                  </td>
                  <td class="provider-col">
                    <div class="provider-icon-container">
                      <img :src="resolvedLlmLogos[model.llm]" :alt="model.llm" class="provider-icon" v-if="resolvedLlmLogos[model.llm]" />
                    </div>
                  </td>
                  <td class="type-col">
                    <div class="type-icon" :class="model.type">
                      <i :class="getTypeIcon(model.type)"></i>
                    </div>
                  </td>
                  <td class="model-col">
                    <div class="model-info">
                      <div class="model-name">
                        {{ model.name }}
                      </div>
                    </div>
                  </td>
                  
                  <!-- Dynamic Metric Cells -->
                  <td v-for="metric in tableMetrics" :key="metric.key" class="metric-col">
                    <span class="metric-value">{{ formatMetricValue(model[metric.key], metric.format) }}</span>
                  </td>

                  <!-- <td class="date-col">
                    <span class="date-value">{{ model.commitDate }}</span>
                  </td> -->
                  <td class="site-col">
                    <a :href="model.siteUrl" target="_blank" rel="noopener noreferrer"
                      class="site-link" :title="'Visit ' + model.framework + ' Site'"
                      v-if="model.siteUrl">
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="statistics-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-robot"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalModels / 2 }}</div>
              <div class="stat-label">Models Evaluated</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalTasks }}</div>
              <div class="stat-label">Benchmark Tasks</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ averageMetric.toFixed(1) }}%</div>
              <div class="stat-label">Average Score</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">
              <i class="fas fa-crown"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ topMetric.toFixed(1) }}%</div>
              <div class="stat-label">Highest Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How to Submit Section -->
    <section id="how-to-submit" class="how-to-submit-section" v-if="config.submissionGuide && Object.keys(config.submissionGuide).length > 0 && config.submissionGuide.steps && config.submissionGuide.steps.length > 0">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ config.submissionGuide.title }}
          </h2>
        </div>
        <div class="submit-steps">
          <div class="step-item" v-for="step in config.submissionGuide.steps" :key="step.step">
            <div class="step-number">{{ step.step }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p v-html="step.description"></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section" v-if="config.faqItems && config.faqItems.length > 0 && config.faqItems[0].question">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            FAQ
          </h2>
        </div>
        <div class="faq-list">
          <div class="faq-item" v-for="(item, index) in config.faqItems" :key="index" :class="{ active: item.active }">
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ item.question }}</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script>
import * as echarts from 'echarts'
import leaderboardConfig from '../../leaderboard-config.json'
import claudeLogo from '@/assets/logos/claude.svg'
import deepseekLogo from '@/assets/logos/deepseek.svg'
import geminiLogo from '@/assets/logos/gemini.svg'
import openbmbLogo from '@/assets/logos/openbmb.png'
import internaiLogo from '@/assets/logos/internai.png'
import gptLogo from '@/assets/logos/gpt.png'
// import grokLogo from '@/assets/logos/grok.svg'
import llamaLogo from '@/assets/logos/llama.svg'
// import qaLogo from '@/assets/logos/qa.png'
import qwenLogo from '@/assets/logos/qwen.png'

export default {
  name: 'LeaderBoard',
  data() {
    // Clone config to avoid mutating the original import and ensure reactivity
    const config = JSON.parse(JSON.stringify(leaderboardConfig))
    
    // Initialize active state for FAQ items
    if (config.faqItems) {
      config.faqItems = config.faqItems.map(item => ({
        ...item,
        active: false
      }))
    }

    return {
      config: config,
      selectedDomain: 'all',
      selectedFramework: 'all',
      selectedMetric: 'overall',
      selectedModelType: 'all',
      sortColumn: leaderboardConfig.chartConfig?.primarySortColumn || 'ACC',
      sortDirection: leaderboardConfig.chartConfig?.sortDirection || 'desc',
      lastUpdated: leaderboardConfig.pageMetadata.lastUpdated,
      chartInstance: null,
      activeDropdown: null,
      currentChartType: leaderboardConfig.chartConfig?.defaultChartType || 'ACC',

      domains: leaderboardConfig.filterOptions.domains,
      
      chartMetrics: leaderboardConfig.metrics.chart,
      tableMetrics: leaderboardConfig.metrics.table,

      // CSV数据
      csvData: leaderboardConfig.leaderboardData,

      // 从CSV数据生成表格数据
      leaderboardData: [],

      // LLM logo and metadata mapping from config
      llmMetadata: leaderboardConfig.llmMetadata,
      llmLogos: {} // Placeholder, logic moved to resolvedLlmLogos or config
    }
  },

  computed: {
    // LLM logo mapping with fallback
    resolvedLlmLogos() {
      // 1. Define available logo resources
      const logoResources = {
        'gpt': gptLogo,
        'gemini': geminiLogo,
        'openbmb': openbmbLogo,
        'internai': internaiLogo,
        'claude': claudeLogo,
        'deepseek': deepseekLogo,
        'qwen': qwenLogo,
        'llama': llamaLogo
      }

      // 2. Start with hardcoded defaults for backward compatibility
      const resolved = {
        'GPT-4o': gptLogo,
        'GPT-4.1': gptLogo,
        'o3-mini': gptLogo,
        'Claude 3.5': claudeLogo,
        'Claude 3.7': claudeLogo,
        'DeepSeekV3': deepseekLogo,
        'Gemini-2.5-pro': geminiLogo,
        'Qwen3-8b*': qwenLogo,
        'Qwen3-14b*': qwenLogo,
        'Qwen3-32b*': qwenLogo,
        'Qwen3-32b*†': qwenLogo,
        'Llama3.3-70b*': llamaLogo
      }

      // 3. Override with config metadata if available
      if (this.llmMetadata) {
        Object.keys(this.llmMetadata).forEach(llmName => {
          const meta = this.llmMetadata[llmName]
          if (meta.logo && logoResources[meta.logo]) {
            resolved[llmName] = logoResources[meta.logo]
          }
        })
      }

      return resolved
    },
    // 从CSV数据生成表格数据
    tableData() {
      return this.csvData.map((item, index) => {
        const row = {
          id: index + 1,
          name: `${item.Framework}+${item.LLM}`,
          framework: item.Framework,
          llm: item.LLM,
          commitDate: item.CommitDate,
          siteUrl: item.SiteUrl,
          type: this.getModelType(item.LLM)
        }
        
        // Dynamically add all metric values
        this.tableMetrics.forEach(metric => {
          row[metric.key] = item[metric.key]
        })
        
        // Also keep other potential keys from item if needed, but for now specific metrics are enough
        // We might need ECR/TPR for backward compatibility if used elsewhere, but moving to dynamic
        
        return row
      })
    },

    // 图表数据
    chartData() {
      const sortedData = [...this.csvData].sort((a, b) => {
        // Sort by current chart metric
        return (a[this.currentChartType] || 0) - (b[this.currentChartType] || 0)
      })

      return {
        categories: sortedData.map(item => `${item.Framework}+${item.LLM}`),
        values: sortedData.map(item => item[this.currentChartType]),
        fullData: sortedData
      }
    },

    filteredResults() {
      let results = [...this.tableData]

      // Filter by framework
      if (this.selectedFramework !== 'all') {
        results = results.filter(model => model.framework === this.selectedFramework)
      }

      // Filter by model type
      if (this.selectedModelType !== 'all') {
        results = results.filter(model => model.type === this.selectedModelType)
      }

      // Sort results
      results.sort((a, b) => {
        const primaryColumn = this.sortColumn
        
        const aVal = a[primaryColumn]
        const bVal = b[primaryColumn]

        let comparison = 0
        if (typeof aVal === 'string') {
          comparison = aVal.localeCompare(bVal)
        } else {
          comparison = (aVal || 0) - (bVal || 0)
        }
        
        if (this.sortDirection === 'desc') {
          return -comparison
        } else {
          return comparison
        }
      })

      return results
    },

    totalModels() {
      return this.tableData.length
    },

    totalTasks() {
      return this.config.pageMetadata.totalTasks
    },

    averageMetric() {
      // Calculate average for the primary sort column (usually ACC or TPR)
      const primaryMetric = this.config.chartConfig.primarySortColumn
      const validValues = this.tableData.filter(model => !isNaN(model[primaryMetric]))
      if (validValues.length === 0) return 0
      const sum = validValues.reduce((acc, model) => acc + model[primaryMetric], 0)
      return sum / validValues.length
    },

    topMetric() {
      const primaryMetric = this.config.chartConfig.primarySortColumn
      const validValues = this.tableData.filter(model => !isNaN(model[primaryMetric]))
      if (validValues.length === 0) return 0
      return Math.max(...validValues.map(model => model[primaryMetric]))
    },

    frameworks() {
      return this.config.filterOptions.frameworks
    },

    // 当前图表标题
    currentChartTitle() {
      const metric = this.chartMetrics.find(m => m.key === this.currentChartType)
      return metric ? `${metric.label} Performance Comparison` : 'Performance Comparison'
    }
  },

  methods: {
    // 格式化指标值
    formatMetricValue(value, format) {
      if (value === '-' || value === undefined || value === null) return '-'
      
      if (format === 'percent') {
        return typeof value === 'number' ? value.toFixed(2) + '%' : value
      } else if (format === 'currency') {
        return typeof value === 'number' ? '$' + value : value
      } else if (format === 'number') {
        return typeof value === 'number' ? value.toLocaleString() : value
      }
      
      return value
    },

    // 根据LLM名称判断模型类型
    getModelType(llm) {
      // 1. 优先从配置文件的 llmMetadata 中查找
      if (this.llmMetadata && this.llmMetadata[llm] && this.llmMetadata[llm].type) {
        return this.llmMetadata[llm].type
      }

      // 2. 回退逻辑：检查是否包含 '*'，如果有则视为开源
      if (llm.includes('*')) return 'open-source'
      
      // 3. 回退逻辑：基于名称的关键词匹配
      const openSourceModels = ['DeepSeek', 'Llama', 'Qwen', 'Mistral', 'Yi', 'Gemma']
      return openSourceModels.some(model => llm.includes(model)) ? 'open-source' : 'proprietary'
    },

    // 根据框架类型获取对应的基础色
    getFrameworkColor(framework) {
      const frameworkColors = {
        // 'Aider': '#4CAF50',        // 亮绿
        // 'Workflow': '#6C757D', D4A574   // 高级灰
        'Workflow': '#F1CD85',    // 高级金
        // 'Agentic': '#4A6FA5'    // 高级深蓝
        'Agentic': '#B2ADEB'    // 高级深蓝
      }
      return frameworkColors[framework] || '#8B9DC3' // 默认柔和蓝
    },

    // 初始化图表
    initChart() {
      if (!this.$refs.chartContainer) return

      this.chartInstance = echarts.init(this.$refs.chartContainer)
      this.updateChart()
    },

    // 更新图表
    updateChart() {
      if (!this.chartInstance) return

      const currentMetric = this.chartMetrics.find(m => m.key === this.currentChartType)
      const metricLabel = currentMetric ? currentMetric.label : this.currentChartType

      const option = {
        title: {
          text: this.currentChartTitle,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderColor: '#e1e5e9',
          borderWidth: 1,
          textStyle: {
            color: '#2c3e50',
            fontSize: 13
          },
          extraCssText: 'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); border-radius: 12px; backdrop-filter: blur(10px);',
          formatter: (params) => {
            const dataIndex = params.dataIndex
            const data = this.chartData.fullData[dataIndex]

            if (!data) return 'No data available'

            // Generate tooltip content dynamically based on table metrics
            let metricsHtml = ''
            this.tableMetrics.forEach(metric => {
              const value = this.formatMetricValue(data[metric.key], metric.format)
              metricsHtml += `
                <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                  <span style="color: #4a5568; font-weight: 500; font-size: 13px;">${metric.label}:</span>
                  <span style="font-weight: 600; color: #2d3748; font-size: 13px;">${value}</span>
                </div>
              `
            })

            return `
              <div style="padding: 16px; min-width: 240px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px; color: #1a202c; text-align: center; padding-bottom: 8px; border-bottom: 2px solid #f7fafc;">
                  ${data.Framework} + ${data.LLM}
                </div>
                ${metricsHtml}
              </div>
            `
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [],
        xAxis: {
          type: 'category',
          data: this.chartData.categories,
          axisLabel: {
            rotate: 45,
            fontSize: 10,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: metricLabel,
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontSize: 12,
            color: '#666'
          },
          axisLabel: {
            formatter: (value) => {
              // Simple formatting based on label, could be improved with metric config
              return metricLabel.includes('%') || metricLabel === 'ACC' || metricLabel === 'TPR' || metricLabel === 'ECR' 
                ? `${value}%` 
                : value
            },
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [{
          name: metricLabel,
          type: 'bar',
          data: this.chartData.values.map((value, index) => {
            const framework = this.chartData.fullData[index].Framework
            const baseColor = this.getFrameworkColor(framework)
            return {
              value: value,
              itemStyle: {
                color: baseColor,
                borderRadius: [4, 4, 0, 0]
              }
            }
          }),
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              color: '#764ba2'
            }
          },
        }],
        animation: false
      }

      this.chartInstance.setOption(option)

      // 添加框架图标
      this.addFrameworkIcons()
    },

    // 添加框架图标
    addFrameworkIcons() {
      if (!this.chartInstance) return

      // 延迟执行，确保图表完全渲染
      setTimeout(() => {
        const chartContainer = this.$refs.chartContainer
        if (!chartContainer) return

        // 清除之前的图标
        const existingIcons = chartContainer.querySelectorAll('.framework-icon')
        existingIcons.forEach(icon => icon.remove())

        // 确保图表容器有相对定位
        chartContainer.style.position = 'relative'

        // 获取ECharts实例的坐标转换器
        const convertToPixel = this.chartInstance.convertToPixel.bind(this.chartInstance)

        this.chartData.fullData.forEach((item, index) => {
          // Use LLM logo as provider icon
          const logo = this.resolvedLlmLogos[item.LLM]
          if (!logo) return

          // 根据当前图表类型获取正确的数值
          const value = item[this.currentChartType]

          // 使用ECharts的坐标转换获取柱子的实际位置
          const pixelPos = convertToPixel('grid', [index, value])
          if (!pixelPos) return

          // 创建图标元素
          const iconElement = document.createElement('div')
          iconElement.className = 'framework-icon'
          iconElement.style.cssText = `
            position: absolute;
            top: ${pixelPos[1] - 20}px;
            left: ${pixelPos[0] - 8}px;
            width: 16px;
            height: 16px;
            background-image: url(${logo});
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            z-index: 10;
            pointer-events: none;
          `

          chartContainer.appendChild(iconElement)
        })
      }, 100)
    },

    // 处理窗口大小变化
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
        // 重新添加图标
        this.addFrameworkIcons()
      }
    },

    filterResults() {
      // Filter logic would be implemented here
      console.log('Filtering results...')
    },

    resetFilters() {
      this.selectedDomain = 'all'
      this.selectedFramework = 'all'
      this.selectedMetric = 'overall'
      this.selectedModelType = 'all'
    },

    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'desc'
      }
    },

    getSortIcon(column) {
      if (this.sortColumn !== column) return ''
      return this.sortDirection === 'desc' ? 'fa-sort-down' : 'fa-sort-up'
    },

    getRankClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      if (rank === 3) return 'bronze'
      return ''
    },

    getRankIcon(rank) {
      if (rank === 1) return 'fas fa-crown'
      if (rank === 2) return 'fas fa-medal'
      if (rank === 3) return 'fas fa-award'
      return ''
    },

    getTypeIcon(type) {
      if (type === 'open-source') return 'fas fa-unlock'
      if (type === 'proprietary' || type === 'closed-source') return 'fas fa-lock'
      return 'fas fa-question'
    },

    viewDetails(model) {
      console.log('Viewing details for:', model.name)
      // Would open a modal or navigate to detail page
    },

    compareModel(model) {
      console.log('Comparing model:', model.name)
      // Would add to comparison list
    },

    // 自定义dropdown方法
    toggleDropdown(type) {
      this.activeDropdown = this.activeDropdown === type ? null : type
    },

    selectFramework(framework) {
      this.selectedFramework = framework
      this.activeDropdown = null
      this.filterResults()
    },

    selectModelType(type) {
      this.selectedModelType = type
      this.activeDropdown = null
      this.filterResults()
    },

    selectSortColumn(column) {
      this.sortColumn = column
      this.activeDropdown = null
      this.filterResults()
    },

    getSelectedFrameworkText() {
      return this.selectedFramework === 'all' ? 'All Frameworks' : this.selectedFramework
    },

    getSelectedModelTypeText() {
      const typeMap = {
        'all': 'All Models',
        'open-source': 'Open Source',
        'proprietary': 'Proprietary'
      }
      return typeMap[this.selectedModelType] || 'All Models'
    },

    getSelectedSortText() {
      const metric = this.tableMetrics.find(m => m.key === this.sortColumn)
      return metric ? metric.label : this.sortColumn
    },

    closeDropdowns(event) {
      // 检查点击是否在dropdown内部
      if (!event.target.closest('.custom-dropdown')) {
        this.activeDropdown = null
      }
    },

    // 切换图表类型
    switchChart(type) {
      this.currentChartType = type
      this.updateChart()
      // 延迟刷新图表以确保图标正确显示
      this.$nextTick(() => {
        // 先清除所有现有图标
        const chartContainer = this.$refs.chartContainer
        if (chartContainer) {
          const existingIcons = chartContainer.querySelectorAll('.framework-icon')
          existingIcons.forEach(icon => icon.remove())
        }
        // 然后重新添加图标
        this.addFrameworkIcons()
      })
    },

    // FAQ 交互方法
    toggleFaq(index) {
      this.config.faqItems.forEach((item, i) => {
        if (i === index) {
          item.active = !item.active
        } else {
          item.active = false
        }
      })
    },

    // 滚动到提交说明部分
    scrollToSubmit() {
      const element = document.getElementById('how-to-submit')
      if (element) {
        const elementPosition = element.offsetTop
        const offsetPosition = elementPosition - 80 // 减去80px，给导航栏留出空间

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
      window.addEventListener('resize', this.handleResize)
      document.addEventListener('click', this.closeDropdowns)
    })
  },

  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('click', this.closeDropdowns)
  },

  watch: {
    chartData: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.leaderboard {
  min-height: 100vh;
  padding-bottom: 80px;
}

/* Header Section */
.leaderboard-header {
  padding: 40px 0 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.leaderboard-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
  z-index: -1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.page-title i {
  font-size: 2.5rem;
  color: #ffd700;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.4;
}

/* Filters Section */
.filters-section {
  padding: 0 0 20px;
}

.filters-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  flex-wrap: wrap;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}


/* 自定义dropdown样式 */
.custom-dropdown {
  position: relative;
  min-width: 160px;
  cursor: pointer;
}

.dropdown-selected {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 12px;
  color: #374151;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: border-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
}

.dropdown-selected:hover {
  border-color: #9ca3af;
}

.custom-dropdown.active .dropdown-selected {
  border-color: #3b82f6;
  outline: none;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
  color: #6b7280;
  font-size: 12px;
}

.custom-dropdown.active .dropdown-arrow {
  transform: rotate(180deg);
  color: #3b82f6;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-option {
  padding: 10px 12px;
  color: #374151;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option:hover {
  background-color: #f9fafb;
}

.dropdown-option.selected {
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 500;
}

.dropdown-option.selected::after {
  content: '✓';
  position: absolute;
  right: 12px;
  color: #1d4ed8;
  font-weight: bold;
}

/* 滚动条样式 */
.dropdown-options::-webkit-scrollbar {
  width: 4px;
}

.dropdown-options::-webkit-scrollbar-track {
  background: #f9fafb;
}

.dropdown-options::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.dropdown-options::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.reset-btn {
  margin-left: auto;
}

/* Leaderboard Table */
.leaderboard-table-section {
  padding: 20px 0 40px 0;
}

.table-container {
  padding: 0;
  overflow: hidden;
}

.table-header {
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.table-header h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.table-info {
  display: flex;
  gap: 24px;
  color: #666;
  font-size: 14px;
}

.table-wrapper {
  overflow-x: auto;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th {
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
  padding: 16px 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.leaderboard-table th:hover {
  background: #e9ecef;
}

.leaderboard-table th i {
  margin-left: 4px;
  opacity: 0.5;
}

.leaderboard-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f3f4;
  color: #333;
}

.model-row:hover {
  background: #f8f9fa;
}

.rank-col {
  width: 80px;
  text-align: center;
}

.provider-col {
  width: 80px;
  text-align: center;
}

.leaderboard-table th.provider-col {
  text-align: center;
}

.provider-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.provider-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 4px;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
}

.rank-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
  color: #333;
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #deb887);
  color: #333;
}

.model-col {
  min-width: 200px;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-name {
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-col {
  min-width: 100px;
  text-align: center;
}

.leaderboard-table th.metric-col {
  text-align: center;
}

.date-col {
  min-width: 120px;
  text-align: center;
}

.leaderboard-table th.date-col {
  text-align: center;
}

.site-col {
  min-width: 80px;
  text-align: center;
}

.leaderboard-table th.site-col {
  text-align: center;
}

.date-value {
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.site-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 12px;
}

.site-link:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  color: white;
  text-decoration: none;
}

.site-link i {
  font-size: 10px;
}

.type-col {
  min-width: 80px;
  text-align: center;
}

.leaderboard-table th.type-col {
  text-align: center;
}

.type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.type-icon.open-source {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.type-icon.open-source:hover {
  background: rgba(34, 197, 94, 0.25);
  border-color: rgba(34, 197, 94, 0.5);
  transform: scale(1.1);
}

.type-icon.proprietary,
.type-icon.closed-source {
  background: rgba(156, 163, 175, 0.15);
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
}

.type-icon.proprietary:hover,
.type-icon.closed-source:hover {
  background: rgba(156, 163, 175, 0.25);
  border-color: rgba(156, 163, 175, 0.5);
  transform: scale(1.1);
}

.metric-value {
  font-weight: 500;
}

.action-col {
  width: 100px;
  text-align: center;
}

.btn-icon {
  background: #e9ecef;
  border: none;
  border-radius: 6px;
  padding: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 2px;
}

.btn-icon:hover {
  background: #dee2e6;
  color: #333;
  transform: translateY(-1px);
}

/* Chart Section */
.chart-section {
  padding: 20px 0;
}

.chart-container {
  padding: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

.chart-header h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.chart-description {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

/* 图表切换按钮样式 */
.chart-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4px;
  border: 1px solid #e9ecef;
  z-index: 10;
}

.toggle-btn {
  background: transparent;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;
  text-align: center;
}

.toggle-btn:hover {
  color: #495057;
  background: rgba(108, 117, 125, 0.1);
}

.toggle-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transform: translateY(-1px);
}

.toggle-btn.active:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.chart-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.chart {
  min-height: 350px;
  position: relative;
}

/* Content Blocks Section */
.content-blocks-section {
  padding: 20px 0;
  background: #f8f9fa;
}

.content-blocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.content-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
}

.content-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.content-block:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.content-block:hover::before {
  transform: scaleX(1);
}

.content-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.content-block:hover .content-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.content-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.content-text h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}


.content-text p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}


/* Statistics Section */
.statistics-section {
  padding: 40px 0;
  background: #f8f9fa;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 8px;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    min-width: auto;
  }

  .custom-dropdown {
    min-width: auto;
  }

  .dropdown-selected {
    padding: 10px 14px;
    font-size: 13px;
  }

  .dropdown-options {
    max-height: 150px;
  }

  .dropdown-option {
    padding: 10px 14px;
    font-size: 13px;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .table-info {
    justify-content: space-between;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 12px8px;
    font-size: 14px;
  }

  .date-col,
  .site-col {
    min-width: 100px;
  }

  .site-link {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }

  .site-link i {
    font-size: 8px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 20px;
    gap: 16px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .content-blocks-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .content-block {
    padding: 16px;
    flex-direction: column;
    text-align: center;
  }

  .content-icon {
    width: 45px;
    height: 45px;
    font-size: 18px;
    margin-right: 0;
    margin-bottom: 12px;
  }

  .content-text {
    align-items: center;
  }

  .content-text h3 {
    font-size: 1.2rem;
  }

  .content-text p {
    font-size: 0.85rem;
  }

  .chart-toggle {
    top: 12px;
    right: 12px;
  }

  .toggle-btn {
    padding: 5px 10px;
    font-size: 11px;
    min-width: 45px;
  }
}

/* How to Submit Section */
.how-to-submit-section {
  padding: 20px 0;
  background: #ffffff;
}

.section-header {
  text-align: left;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.submit-steps {
  margin: 0 0 15px 0;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 2px solid #667eea;
  transition: all 0.3s ease;
}

.step-item:hover {
  background: #ffffff;
}

.step-number {
  width: 20px;
  height: 20px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.7rem;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.step-content p {
  color: #666;
  line-height: 1.3;
  margin: 0;
  font-size: 0.8rem;
}

.step-content code {
  background: #e9ecef;
  padding: 1px 3px;
  border-radius: 2px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.7em;
  color: #d63384;
}

.step-content a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.step-content a:hover {
  color: #5a6fd8;
  text-decoration: underline;
  text-decoration-color: #667eea;
  text-underline-offset: 2px;
}

.note-content a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.note-content a:hover {
  color: #5a6fd8;
  text-decoration: underline;
  text-decoration-color: #667eea;
  text-underline-offset: 2px;
}

.submit-note {
  margin: 0;
  padding: 8px 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.note-icon {
  width: 14px;
  height: 14px;
  color: #6c757d;
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.note-icon i {
  font-size: 12px;
}

.note-content p {
  margin: 0;
  color: #666;
  line-height: 1.3;
  font-size: 0.8rem;
}

.note-content strong {
  color: #495057;
  font-weight: 600;
}

/* FAQ Section */
.faq-section {
  padding: 20px 0;
  background: #f8f9fa;
}

.faq-list {
  margin: 0;
}

.faq-item {
  background: #ffffff;
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.faq-question {
  padding: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: #f8f9fa;
}

.faq-question h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.faq-question i {
  color: #667eea;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.faq-item.active .faq-question i {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 12px 12px;
  color: #666;
  line-height: 1.4;
  display: none;
  font-size: 0.85rem;
  margin-top: 10px;
}

.faq-item.active .faq-answer {
  display: block;
}

.faq-answer p {
  margin: 0;
}

/* Responsive Design for New Sections */
@media (max-width: 768px) {
  .how-to-submit-section {
    padding: 15px 0;
  }

  .faq-section {
    padding: 15px 0;
  }

  .section-header {
    margin-bottom: 15px;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .step-item {
    flex-direction: column;
    text-align: center;
    gap: 6px;
    padding: 8px;
  }

  .step-number {
    align-self: center;
    width: 18px;
    height: 18px;
    font-size: 0.65rem;
  }

  .submit-note {
    flex-direction: row;
    text-align: left;
    gap: 8px;
    padding: 6px 8px;
  }

  .faq-question {
    padding: 10px;
  }

  .faq-question h3 {
    font-size: 0.85rem;
  }

  .faq-answer {
    padding: 0 10px 10px;
  }
}
</style>
