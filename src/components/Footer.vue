<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section" v-for="section in config.footer.sections" :key="section.title">
          <h3 v-if="section.title !== 'Project'">{{ section.title }}</h3>
          
          <!-- Project Description Section -->
          <div v-if="section.type === 'description'" class="footer-logo-section">
            <div class="footer-logo">
              <img :src="section.logo" :alt="section.logoAlt" class="footer-logo-img">
              <span>{{ config.projectInfo.name }}</span>
            </div>
            <p class="footer-description">
              {{ section.description }}
            </p>
          </div>

          <!-- Links Section -->
          <ul v-if="section.type === 'links'" class="footer-links">
            <li v-for="link in section.links" :key="link.name">
              <a v-if="link.type === 'external'" :href="link.link" target="_blank" rel="noopener noreferrer">
                {{ link.name }}
              </a>
              <router-link v-else :to="link.link">
                {{ link.name }}
              </router-link>
            </li>
          </ul>

          <!-- Social Links Section -->
          <div v-if="section.type === 'social'" class="social-links">
            <a v-for="social in section.socialLinks" :key="social.name" 
               :href="social.link" 
               :title="social.title" 
               target="_blank" 
               rel="noopener noreferrer">
              <i v-if="!social.isImage" :class="social.icon"></i>
              <img v-else :src="social.icon" :alt="social.title" style="width: 20px; height: 20px;">
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>{{ config.footer.copyright }}</p>
          <p>{{ config.footer.tagline }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import globalConfig from '../../global-layout-config.json'

export default {
  name: 'AppFooter',
  data() {
    return {
      config: globalConfig
    }
  }
}
</script>

<style scoped>
.footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  color: #333;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  padding: 60px 0 40px;
}

.footer-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.footer-logo-img {
  height: 32px;
  width: auto;
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.footer-logo-img:hover {
  transform: scale(1.1);
}

.footer-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 12px;
}

.footer-section ul li a {
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.footer-section ul li a:hover {
  color: #333;
  transform: translateX(4px);
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #e9ecef;
  border-radius: 50%;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background: #dee2e6;
  color: #333;
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid #e9ecef;
  padding: 20px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-bottom-content p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 0 30px;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
