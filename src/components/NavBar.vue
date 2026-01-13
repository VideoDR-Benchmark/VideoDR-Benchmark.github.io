<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-logo">
        <router-link to="/" class="logo-link">
          <img :src="config.navigation.brand.logo" :alt="config.navigation.brand.name" class="nav-logo-img">
          <span>{{ config.navigation.brand.name }}</span>
        </router-link>
      </div>

      <div class="nav-menu" :class="{ 'active': isMenuOpen }">
        <component 
          :is="item.type === 'external' ? 'a' : 'router-link'"
          v-for="item in config.navigation.menuItems" 
          :key="item.name"
          :href="item.type === 'external' ? item.link : null"
          :to="item.type === 'internal' ? item.link : null"
          :target="item.type === 'external' ? '_blank' : null"
          class="nav-link" 
          @click="closeMenu"
        >
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </component>
      </div>

      <div class="nav-toggle" @click="toggleMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
  </nav>
</template>

<script>
import globalConfig from '../../global-layout-config.json'

export default {
  name: 'NavBar',
  data() {
    return {
      isMenuOpen: false,
      config: globalConfig
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e9ecef;
  z-index: 1000;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-logo .logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  font-size: 24px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.nav-logo .logo-link:hover {
  transform: scale(1.05);
}

.nav-logo-img {
  height: 32px;
  width: auto;
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.nav-logo-img:hover {
  transform: scale(1.1);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #666;
  font-weight: 700;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #333;
  background: #f8f9fa;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: #333;
  background: #e9ecef;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.bar {
  width: 25px;
  height: 3px;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 20px;
    gap: 16px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-toggle.active .bar:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav-toggle.active .bar:nth-child(2) {
    opacity: 0;
  }

  .nav-toggle.active .bar:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  .nav-link {
    width: 100%;
    justify-content: center;
    padding: 12px 24px;
  }
}
</style>
