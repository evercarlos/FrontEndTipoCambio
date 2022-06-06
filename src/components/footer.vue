<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-6">
          {{ userData.names }} {{ userData.paternalSurname }} {{ userData.maternalSurname }} ({{ new Date().getFullYear() }})
        </div>
        <div class="col-sm-6">
          <div class="text-sm-end d-none d-sm-block">developed by ECR</div>
        </div>
      </div>
    </div>
  </footer>
  <!-- end footer new Date().getFullYear() - 1 }} -->
</template>

<script>
import { ref } from '@vue/composition-api'
  export default {
    setup() {
      const userData = ref(JSON.parse(localStorage.getItem('user')))

      return {
        userData,
      }
    }
  }
</script>
