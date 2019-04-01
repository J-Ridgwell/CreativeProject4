var app = new Vue({
  el: '#app',
  data: {
    addedDate: '',
    addedSession: '',
    sessions: {},
  },
  created() {
    this.getSessions();
  },
  methods: {
    async getSessions() {
      try {
        let response = await axios.get("/api/sessions");
        this.sessions = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addSession() {
      try {
        let response = await axios.post("/api/sessions", {
          date: this.addedDate,
          session: this.addedSession
        });
        this.addedDate = "";
        this.addedSession = "";
        this.getSessions();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteSession(session) {
      try {
        let response = axios.delete("/api/sessions/" + session.id);
        this.getSessions();
        return true;
      } catch (error) {
        console.log(error);
      }
    }
  }
});
