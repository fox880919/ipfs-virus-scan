<template>

  <v-app class="d-flex flex-column justify-center align-center mt-10">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->

    <!-- <div class="mt-10">

      <v-btn @click="fromUrl=!fromUrl" class=""><label v-if="fromUrl">change to file</label> <label v-else>change to Url</label></v-btn>
    </div> -->

    <div class="mt-10">

      <!-- <v-btn @click="fromUrl=!fromUrl" class=""><label v-if="fromUrl">change to file</label> <label v-else>change to Url</label></v-btn> -->
      <v-btn @click="fromUrl=!fromUrl" class=""><label v-if="fromUrl">To Centralized Scan</label> <label v-else>To Decentralized Scan</label></v-btn>

    </div>

    <!-- <div v-if="fromUrl" class="mt-10"> -->
    <div class="mt-10">

      <url-scan/>

      <fetch-one-file-to-scan/>
      
    </div>

    <!-- <div v-else class="mt-10">

      <file-scan/>
    </div> -->

    <div class="mt-10">

      <centralized-url-scan/>
    </div>


  </v-app>
    
</template>

<script>
// @ is an alias to /src


import urlScan from '../components/UrlScan'

import centralizedUrlScan from '../components/CentralizedUrlScan'

import fileScan from '../components/FirstFileScan'

import fetchOneFileToScan from '../components/FetchOneFileToScan'
export default {
  name: 'Home',

  components:{

    urlScan,
    fileScan,
    centralizedUrlScan,
    fetchOneFileToScan
  },

  data: function(){

    return{

      fromUrl: true
    }
  }
}
</script>
