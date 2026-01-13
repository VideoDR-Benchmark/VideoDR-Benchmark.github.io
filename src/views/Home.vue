<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content fade-in-up">
          <h1 class="hero-title">
            <span class="gradient-text">{{ config.heroSection.title.main }}</span>
            <br>
            {{ config.heroSection.title.subtitle }}
          </h1>
          <p class="hero-description">
            {{ config.heroSection.description }}
          </p>
          <div class="hero-buttons">
            <component 
              :is="button.type === 'external' ? 'a' : 'router-link'"
              v-for="button in config.heroSection.buttons" 
              :key="button.text"
              :href="button.type === 'external' ? button.url : null"
              :to="button.type === 'internal' ? button.url : null"
              :target="button.type === 'external' ? '_blank' : null"
              :class="['btn', button.variant === 'primary' ? 'btn-primary' : 'btn-secondary']"
            >
              <i :class="button.icon"></i>
              {{ button.text }}
            </component>
          </div>
        </div>
        <div class="hero-visual float">
          <div class="code-visualization" :class="{ 'image-mode': config.heroSection.codeVisualization && config.heroSection.codeVisualization.image_path }">
            
            <!-- Image Viewer Mode -->
            <div v-if="config.heroSection.codeVisualization && config.heroSection.codeVisualization.image_path" class="image-container">
              <img 
                :src="config.heroSection.codeVisualization.image_path" 
                alt="Hero Visualization"
                class="hero-image"
              />
            </div>

            <!-- Code Block Mode -->
            <div v-else class="code-block">
              <div class="code-header">
                <div class="dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span class="filename">{{ config.heroSection.codeVisualization.filename }}</span>
              </div>
              <div class="code-content">
                <div class="line" v-for="(line, index) in config.heroSection.codeVisualization.code" :key="index">
                  <span v-if="line.includes('def')" class="keyword">def</span>
                  <span v-if="line.includes('return')" class="keyword">return</span>
                  <span v-if="line.includes('evaluate_model')" class="function">evaluate_model</span>
                  <span v-if="line.includes('run_benchmark')" class="function">run_benchmark</span>
                  <span v-if="line.includes('model')" class="parameter">model</span>
                  <span v-if="line.includes('()')" class="punctuation">()</span>
                  <span v-if="line.includes(':')" class="punctuation">:</span>
                  <span v-if="line.startsWith('  ')" v-html="'&nbsp;&nbsp;'"></span>
                  <span v-if="!line.includes('def') && !line.includes('return') && !line.includes('evaluate_model') && !line.includes('run_benchmark') && !line.includes('model') && !line.includes('()') && !line.includes(':')">{{ line }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ config.featuresSection.title }}</h2>
          <p class="section-description">
            {{ config.featuresSection.description }}
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card card fade-in-up" v-for="feature in config.featuresSection.features" :key="feature.title">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="statistics">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item card" v-for="stat in config.statisticsSection.stats" :key="stat.label">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Getting Started Section -->
    <section class="getting-started">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ config.gettingStartedSection.title }}</h2>
          <p class="section-description">
            {{ config.gettingStartedSection.description }}
          </p>
        </div>

        <div class="steps-container">
          <div class="step-item" v-for="step in config.gettingStartedSection.steps" :key="step.step">
            <div class="step-number">{{ step.step }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <div class="code-snippet">
                <code>{{ step.code }}</code>
                <button class="copy-btn" @click="copyToClipboard(step.code)">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import homeConfig from '../../home-config.json'

export default {
  name: 'HomePage',
  data() {
    return {
      config: homeConfig
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        // You could add a toast notification here
        console.log('Copied to clipboard:', text)
      }).catch(err => {
        console.error('Failed to copy:', err)
      })
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  z-index: -1;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
  color: #333;
}


.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 32px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-visualization {
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
}

.code-visualization.image-mode {
  max-width: 800px;
  width: 150%;
  margin-right: -100px;
}

.image-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e9ecef;
  line-height: 0;
  background: #fff;
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.code-header {
  background: #e9ecef;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #dee2e6;
}

.dots {
  display: flex;
  gap: 6px;
}

.dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dots span:nth-child(1) {
  background: #ff5f56;
}

.dots span:nth-child(2) {
  background: #ffbd2e;
}

.dots span:nth-child(3) {
  background: #27ca3f;
}

.filename {
  color: #666;
  font-size: 14px;
}

.code-content {
  padding: 20px;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.line {
  margin-bottom: 8px;
}

.keyword {
  color: #d73a49;
}

.function {
  color: #6f42c1;
}

.parameter {
  color: #e36209;
}

.punctuation {
  color: #6a737d;
}

/* Features Section */
.features {
  padding: 120px 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.section-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.feature-card {
  text-align: center;
  padding: 40px 24px;
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  font-size: 32px;
  color: white;
}

.feature-card h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Statistics Section */
.statistics {
  padding: 80px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.stat-item {
  text-align: center;
  padding: 40px 24px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-weight: 500;
}

/* Getting Started Section */
.getting-started {
  padding: 120px 0;
  background: #f8f9fa;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.code-snippet {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.code-snippet code {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  color: #6f42c1;
  font-size: 14px;
}

.copy-btn {
  background: #e9ecef;
  border: none;
  border-radius: 4px;
  padding: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: #dee2e6;
  color: #333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .code-visualization.image-mode {
    width: 100%;
    max-width: 100%;
    margin-right: 0;
  }
  
  .image-container {
    height: auto;
  }

  .hero-title {
    font-size: 2.5rem;
  }


  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .step-item {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .code-snippet {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }


  .section-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
