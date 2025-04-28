import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Importar Vue Router

const app = createApp(App);
app.use(router);
app.mount("#app");
