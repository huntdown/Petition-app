<template>
    <div>
    </div>
</template>

<script>
    export default {
        name: "Home",
      mounted() {
          this.forwardToPetitionsPage();
      },
      methods:{
          forwardToPetitionsPage: function () {
            this.$router.push({path:"/petitions"});
          }
      }
    }
</script>

<style scoped>

</style>
