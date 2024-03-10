<template>
  <div>
    <NavBar />
    <router-view class="container"/>
    <Footer />
  </div>
</template>

<script>
import NavBar from './components/NavBar';
import Footer from './components/Footer';

export default{
  name: "App",
  components:{
    NavBar,
    Footer
  }
}

</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family:Helvetica;
  color: #444;
}

.container{
  min-height: 300px;
}

a{
  transition: .5s;
}

a:hover{
  color: #c1b696;
}

</style>
