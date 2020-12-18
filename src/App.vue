<template>
<v-app>
  <v-card >
    <v-app-bar
        absolute
        color="#6A76AB"
        dark>
    

      <template>
        
        <!-- <v-app-bar  dark app dense flat> -->

        <!-- <v-tabs>
          <v-spacer></v-spacer>
          <v-tab to="/">Url Scan</v-tab>
          <v-spacer></v-spacer>

          <v-tab to="/about">File Sccan</v-tab>
          <v-spacer></v-spacer>

          <v-tab to="/">centralized Url Scan</v-tab>
          <v-spacer></v-spacer>

          <v-tab to="/about">fetch One File To Scan</v-tab>
          <v-spacer></v-spacer>

        </v-tabs> -->

        <v-tabs centered center-active mobile-breakpoint>

          <v-tab to="/finalFileScan">Decentralized File Scan</v-tab>

          <v-tab to="/centralizedFileScan">Centralized File Scan</v-tab>

          <v-tab to="/urlScan">Decentralized Url Scan</v-tab>


          <v-tab to="/centralizedUrlScan">centralized Url Scan</v-tab>

          <!-- <v-tab to="/fetchOneFileToScan">fetch One File To Scan</v-tab> -->

        </v-tabs>
        <!-- </v-app-bar> -->
      </template>
    </v-app-bar>
      
      
  </v-card>

  <div class="d-flex flex-column justify-center align-center mt-16">
        
        <router-view></router-view>
  </div>

</v-app>  
  
</template>


<script>
import home from './views/Home';

// import urlScan from './components/UrlScan'

// import centralizedUrlScan from './components/CentralizedUrlScan'

// import fileScan from './components/FileScan'

// import fetchOneFileToScan from './components/FetchOneFileToScan'


export default {
  name: 'App',

  components: {
    // HelloWorld,
    // home
    // urlScan,
    // fileScan,
    // centralizedUrlScan,
    // fetchOneFileToScan

  },

  data: () => ({
    //
  }),
};
</script>
