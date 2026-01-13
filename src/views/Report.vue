<template>
  <div class="report">
    <!-- Report Content Section -->
    <section class="report-content-section">
      <div class="container">
        <div class="report-layout">
          <!-- 主内容区域 -->
          <div class="report-content">
            <div v-html="reportContent" class="report-body" @click="handleImageClick" ref="reportBody"></div>
          </div>
          
          <!-- 右侧目录 -->
          <div class="table-of-contents">
            <nav class="toc-nav">
              <ul class="toc-list">
                <li class="toc-item">
                  <a @click="scrollToTop" class="toc-link">Back to Top</a>
                </li>
                <li 
                  v-for="(item, index) in tocItems" 
                  :key="index"
                  :class="['toc-item', { 'active': item.active }]"
                >
                  <a 
                    :href="`#${item.id}`" 
                    @click="scrollToSection(item.id, $event)"
                    class="toc-link"
                  >
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <!-- 图片放大模态框 -->
        <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
          <div class="modal-content">
            <span class="close-btn" @click="closeImageModal">&times;</span>
            <img :src="selectedImage" alt="放大图片" class="modal-image">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ReportPage',
  data() {
    return {
      reportContent: '',
      showImageModal: false,
      selectedImage: '',
      tocItems: []
    }
  },
  async mounted() {
    await this.loadReportContent();
    this.$nextTick(() => {
      this.generateTOC();
      this.setupScrollListener();
    });
  },
  methods: {
    async loadReportContent() {
      try {
        // 动态导入报告内容
        const response = await fetch('/report-content.html');
        const html = await response.text();
        this.reportContent = html;
      } catch (error) {
        console.error('加载报告内容失败:', error);
        // 如果无法加载外部文件，使用内联内容
        this.loadInlineContent();
      }
    },
    loadInlineContent() {
      // 这里可以放置报告的核心内容
      this.reportContent = `
        <h1 style="text-align: center; font-size: 3.5rem; font-weight: 700; margin: 2em 0 1.5em 0; color: #1a202c; line-height: 1.2;">CodeAgent 2.0 Era Begins｜GitTaskBench: Redefining the Standard for Practical Delivery of Code Agents!</h1>
        <h2 style="text-align: center; font-size: 1.2rem; font-weight: 500; margin: 1em 0 2em 0; color: #666; text-transform: uppercase; letter-spacing: 2px;">Introduction</h2>
        <p>Have you ever wondered: despite models scoring high on various leaderboards, why does the real-world experience often fall short?</p>
        <p>We observed that most AI coding benchmarks remain focused on "code generation" and "closed-form questions," while neglecting the real needs of developers such as environment setup, dependency handling, and cross-repository resource utilization. Today's benchmarks, limited to problem-solving, are no longer sufficient to measure the true effectiveness of code agents.</p>
        <p>To break through these limitations, researchers from <strong>CAS, Peking University, HKUST, USTC, NUS</strong>, together with the open-source research organization <strong>QuantaAlpha</strong> and the <strong>StepStar team led by Jiang Daxin</strong>, introduced and open-sourced a <strong>repo-level benchmark paradigm — GitTaskBench</strong>.</p>
        <p>Key highlights:</p>
        <ol>
          <li>Evaluates the <strong>full-chain capability</strong> of agents: from repository understanding → environment setup → incremental development/bug fixing → project-level delivery.</li>
          <li>For the first time, incorporates the <strong>"economic value"</strong> of the framework × model combination into evaluation metrics, offering new insights for academia, industry, and entrepreneurship.</li>
        </ol>
        <p>📄 Paper: <a href="https://arxiv.org/abs/2508.18993"><em>GitTaskBench: A Benchmark for Code Agents Solving Real-World Tasks Through Code Repository Leveraging</em></a><br>
        📂 GitHub: <a href="https://github.com/QuantaAlpha/GitTaskBench" target="_blank">https://github.com/QuantaAlpha/GitTaskBench</a></p>
      `;
    },
    handleImageClick(event) {
      if (event.target.tagName === 'IMG') {
        this.selectedImage = event.target.src;
        this.showImageModal = true;
        document.body.style.overflow = 'hidden';
      }
    },
    closeImageModal() {
      this.showImageModal = false;
      this.selectedImage = '';
      document.body.style.overflow = 'auto';
    },
    generateTOC() {
      if (!this.$refs.reportBody) return;
      
      // 显示H3标题（报告中的主要章节）
      const headings = this.$refs.reportBody.querySelectorAll('h3');
      this.tocItems = [];
      
      headings.forEach((heading, index) => {
        const text = heading.textContent.trim();
        
        // 过滤掉太短的标题
        if (text.length < 3) return;
        
        const id = this.generateId(text, index);
        
        // 为标题添加ID
        heading.id = id;
        
        this.tocItems.push({
          id,
          text,
          active: false
        });
      });
    },
    generateId(text, index) {
      // 生成简单的ID，基于文本内容和索引
      return `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 20)}`;
    },
    scrollToSection(id, event) {
      event.preventDefault();
      const element = document.getElementById(id);
      
      if (element) {
        // 使用getBoundingClientRect获取相对于视口的位置
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        
        // 滚动到元素位置，考虑NavBar高度(70px)并留一些间距
        const scrollPosition = elementTop - 90;
        
        window.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // 清除所有高亮
      this.tocItems.forEach(item => {
        item.active = false;
      });
    },
    setupScrollListener() {
      window.addEventListener('scroll', this.handleScroll);
    },
    handleScroll() {
      // 高亮当前章节
      this.updateActiveSection();
    },
    updateActiveSection() {
      if (!this.$refs.reportBody) return;
      
      const headings = this.$refs.reportBody.querySelectorAll('h3');
      let currentActive = '';
      const headerHeight = 70; // NavBar高度
      
      // 特殊处理：如果页面滚动到顶部，不显示任何高亮
      if (window.scrollY <= 50) {
        this.tocItems.forEach(item => {
          item.active = false;
        });
        return;
      }
      
      // 找到当前在视口内的标题
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();
        
        // 如果标题在视口内（考虑Header高度）
        if (rect.top <= headerHeight + 50 && rect.bottom > headerHeight) {
          currentActive = heading.id;
        }
      }
      
      // 如果没有找到在视口内的标题，选择最接近视口顶部的
      if (!currentActive && headings.length > 0) {
        let closestHeading = headings[0];
        let minDistance = Math.abs(headings[0].getBoundingClientRect().top - headerHeight);
        
        for (let i = 1; i < headings.length; i++) {
          const distance = Math.abs(headings[i].getBoundingClientRect().top - headerHeight);
          if (distance < minDistance) {
            minDistance = distance;
            closestHeading = headings[i];
          }
        }
        currentActive = closestHeading.id;
      }
      
      // 更新活动状态
      this.tocItems.forEach(item => {
        item.active = item.id === currentActive;
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
.report {
  min-height: 100vh;
  background: white;
}

.report-header {
  padding: 80px 0 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.report-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.container {
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  z-index: 2;
}

.header-content {
  text-align: center;
  color: white;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-title i {
  font-size: 3rem;
  opacity: 0.9;
}

.gradient-text {
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.report-content-section {
  padding: 20px 0 60px 0;
  background: white;
  min-height: 60vh;
}

.report-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  margin: 0;
  position: relative;
  padding: 0 0 0 20px;
}

.report-content {
  flex: 1;
  padding: 0;
  overflow-x: hidden;
}

/* 目录样式 */
.table-of-contents {
  width: 300px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  position: sticky;
  top: 100px;
  max-height: 300px;
  overflow-y: auto;
  margin-right: 20px;
  flex-shrink: 0;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 3px;
}

.toc-link {
  display: block;
  padding: 5px 8px;
  color: #4a5568;
  text-decoration: none;
  border-radius: 4px;
  line-height: 1.3;
  font-size: 14px;
  font-family: 'Times New Roman', Times, serif;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.toc-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.toc-item.active .toc-link {
  background: #edf2f7;
  color: #2d3748;
  font-weight: 500;
}

/* 报告内容样式 */
.report-body {
  font-family: 'Times New Roman', Times, serif;
  line-height: 1.6;
  color: #2d3748;
  font-size: 16px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 强制限制所有图片尺寸 */
.report-body * {
  max-width: 100% !important;
  box-sizing: border-box;
}

.report-body h1,
.report-body h2,
.report-body h3,
.report-body h4,
.report-body h5,
.report-body h6 {
  color: #1a202c;
  margin-top: 2em;
  margin-bottom: 1em;
  font-weight: 600;
  line-height: 1.3;
  page-break-after: avoid;
}

.report-body h1 {
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  margin: 2em 0 1.5em 0;
  line-height: 1.2;
  color: #1a202c;
  border: none;
  padding: 0;
}

.report-body h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 2.5em 0 1em 0;
  text-align: left;
  border: none;
  padding: 0;
}

.report-body h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
  margin: 2em 0 1em 0;
  text-align: left;
}

.report-body p {
  margin-bottom: 1.5em;
  text-align: left;
  line-height: 1.6;
  text-indent: 0;
  font-size: 1rem;
  color: #2d3748;
}

.report-body p:first-of-type {
  margin-top: 0;
}

.report-body strong {
  color: #1a202c;
  font-weight: 700;
}

.report-body a {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.report-body a:hover {
  border-bottom-color: #667eea;
  color: #5a67d8;
}

.report-body ul,
.report-body ol {
  margin: 1.5em 0;
  padding-left: 0;
  line-height: 1.6;
}

.report-body li {
  margin-bottom: 0.8em;
  padding-left: 2em;
  text-indent: -1.5em;
  position: relative;
}

.report-body ul li {
  list-style-type: none;
}

.report-body ul li::before {
  content: "•";
  color: #2d3748;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.report-body ol li {
  list-style-type: none;
  counter-increment: item;
}

.report-body ol {
  counter-reset: item;
}

.report-body ol li::before {
  content: counter(item) ".";
  color: #2d3748;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.report-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 2em 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.report-body th,
.report-body td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.report-body th {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.report-body tr:hover {
  background-color: #f8fafc;
}

.report-body blockquote {
  margin: 2em 0;
  padding: 1.5em 2em;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-left: 4px solid #667eea;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  position: relative;
}

.report-body blockquote::before {
  content: '"';
  font-size: 4rem;
  color: #667eea;
  position: absolute;
  top: -10px;
  left: 20px;
  opacity: 0.3;
}

.report-body img {
  max-width: 100% !important;
  max-height: 400px !important;
  width: auto !important;
  height: auto !important;
  display: block;
  margin: 2em auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  object-fit: contain;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.report-body p img {
  margin: 1em auto;
}

.report-body img:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 25px rgba(0,0,0,0.15);
}

.report-body img::after {
  content: '点击放大';
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.report-body img:hover::after {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .report-layout {
    flex-direction: column;
    gap: 15px;
    padding: 0 10px;
  }
  
  .table-of-contents {
    width: 100%;
    position: static;
    order: -1;
    max-height: 120px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .toc-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .toc-item {
    margin-bottom: 0;
  }
  
  .toc-link {
    padding: 4px 8px;
    font-size: 12px;
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .page-title i {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1.1rem;
  }
  
  .report-body {
    font-size: 14px;
  }
  
  .report-body h1 {
    font-size: 2rem;
  }
  
  .report-body h2 {
    font-size: 1.5rem;
  }
  
  .report-body h3 {
    font-size: 1.25rem;
  }
  
  .report-body img {
    max-height: 300px !important;
    margin: 1em auto;
  }
  
  .table-of-contents {
    padding: 10px;
    margin: 0 10px;
  }
}

@media (max-width: 480px) {
  .report-body img {
    max-height: 250px !important;
    margin: 0.8em auto;
  }
}

/* 动画效果 */
.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 图片模态框样式 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
