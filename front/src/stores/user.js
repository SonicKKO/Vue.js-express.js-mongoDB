import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post("http://localhost:5137/api/login", { email, password });
        this.token = response.data.token;''
        localStorage.setItem('token', this.token);
        await this.fetchUserProfile();
      } catch (error) {
        throw error;
      }
    },
    async fetchUserProfile() {
      if (!this.token) return;

      try {
        const response = await axios.get("http://localhost:5137/api/profile", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
}); 