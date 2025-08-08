<template>
    <div class="login-container">
      <!-- Elementos decorativos minimalistas -->
      <div class="decoration decoration-1"></div>
      <div class="decoration decoration-2"></div>
      <div class="decoration decoration-3"></div>
      
      <!-- Contenedor principal -->
      <div class="login-card">
        <!-- Header minimalista -->
        <div class="login-header">
          <div class="logo-container">
            <svg class="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 class="login-title">Mini SAP</h1>
          <p class="login-subtitle">Accede a tu cuenta</p>
        </div>
        
        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Campo Usuario -->
          <div class="form-group">
            <label for="username" class="form-label">USUARIO</label>
            <div class="input-container">
              <input 
                v-model="username" 
                type="text" 
                id="username" 
                name="username" 
                required
                class="form-input"
                placeholder="Ingresa tu usuario"
              >
              <div class="input-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Campo Contraseña -->
          <div class="form-group">
            <label for="password" class="form-label">CONTRASEÑA</label>
            <div class="input-container">
              <input 
                v-model="password" 
                type="password" 
                id="password" 
                name="password" 
                required
                class="form-input"
                placeholder="Ingresa tu contraseña"
              >
              <div class="input-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Botón de Login -->
          <button 
            type="submit"
            :disabled="loading"
            class="login-button"
            :class="{ 'loading': loading }"
          >
            <span v-if="!loading" class="button-content">
              <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Iniciar Sesión
            </span>
            <span v-else class="button-content">
              <div class="spinner"></div>
              Iniciando...
            </span>
          </button>
        </form>
        
        <!-- Enlace de recuperación -->
        <div class="forgot-password">
          <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
  
      <!-- Notificación Toast -->
      <div 
        v-if="notification.show" 
        :class="['notification', notification.type]"
      >
        <svg 
          v-if="notification.type === 'success'" 
          class="notification-icon"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg 
          v-else 
          class="notification-icon"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>{{ notification.message }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const username = ref('');
  const password = ref('');
  const loading = ref(false);
  const router = useRouter();
  
  const notification = ref({
    show: false,
    message: '',
    type: 'error'
  });
  
  const showNotification = (message, type = 'error') => {
    notification.value = {
      show: true,
      message,
      type
    };
    
    setTimeout(() => {
      notification.value.show = false;
    }, 4000);
  };
  
  const handleLogin = async () => {
    if (!username.value.trim() || !password.value.trim()) {
      showNotification('Por favor completa todos los campos');
      return;
    }

    loading.value = true;

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username: username.value,
        password: password.value
      }, { withCredentials: true });

      if (response.data.success) {
        showNotification('¡Inicio de sesión exitoso!', 'success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        // This case might not be reached if backend sends error codes
        showNotification(response.data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      showNotification(errorMessage);
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Reset y base */
  * {
    box-sizing: border-box;
  }
  
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
    position: relative;
    overflow: hidden;
    padding: 1rem;
  }
  
  /* Elementos decorativos */
  .decoration {
    position: absolute;
    border-radius: 50%;
    opacity: 0.15;
    filter: blur(40px);
  }
  
  .decoration-1 {
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #10b981, #06b6d4);
    top: 10%;
    left: 15%;
    animation: float 8s ease-in-out infinite;
  }
  
  .decoration-2 {
    width: 150px;
    height: 150px;
    background: linear-gradient(45deg, #059669, #0891b2);
    bottom: 20%;
    right: 10%;
    animation: float 10s ease-in-out infinite reverse;
    animation-delay: -3s;
  }
  
  .decoration-3 {
    width: 100px;
    height: 100px;
    background: linear-gradient(45deg, #047857, #0e7490);
    top: 50%;
    left: 5%;
    animation: float 12s ease-in-out infinite;
    animation-delay: -6s;
  }
  
  /* Contenedor principal */
  .login-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 1.5rem;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .login-card:hover {
    box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.2);
  }
  
  /* Header */
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .logo-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
    border-radius: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  }
  
  .logo-icon {
    width: 2rem;
    height: 2rem;
    color: white;
  }
  
  .login-title {
    font-size: 1.875rem;
    font-weight: 300;
    color: #374151;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.025em;
  }
  
  .login-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
  
  /* Formulario */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }
  
  .input-container {
    position: relative;
  }
  
  .form-input {
    width: 100%;
    padding: 1rem 3rem 1rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    font-size: 1rem;
    color: #374151;
    transition: all 0.3s ease;
    outline: none;
  }
  
  .form-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    transform: translateY(-1px);
  }
  
  .form-input::placeholder {
    color: #9ca3af;
  }
  
  .input-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
    transition: color 0.3s ease;
    pointer-events: none;
  }
  
  .form-group:hover .input-icon {
    color: #10b981;
  }
  
  /* Botón */
  .login-button {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
    color: white;
    font-weight: 500;
    font-size: 1rem;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    position: relative;
    overflow: hidden;
  }
  
  .login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
  }
  
  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .button-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  /* Spinner */
  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  /* Enlaces */
  .forgot-password {
    text-align: center;
    margin-top: 1.5rem;
  }
  
  .forgot-link {
    font-size: 0.875rem;
    color: #6b7280;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }
  
  .forgot-link:hover {
    color: #10b981;
    text-decoration: underline;
  }
  
  /* Notificaciones */
  .notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    color: white;
    font-weight: 500;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 1000;
    max-width: 300px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
  }
  
  .notification.success {
    background: #10b981;
  }
  
  .notification.error {
    background: #ef4444;
  }
  
  .notification-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
  
  /* Animaciones */
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
    }
    50% { 
      transform: translateY(-20px) rotate(5deg); 
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .login-card {
      padding: 1.5rem;
      margin: 1rem;
    }
    
    .login-title {
      font-size: 1.5rem;
    }
    
    .notification {
      top: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
      max-width: none;
    }
  }
  </style>