<template>
  
    <v-layout class="mt-16 d-flex">
        
        <div>

        
            <div>
            <label>URL to scan:</label>
            </div>

            <div>
            <input v-model="url"
            type="text" placeholder="Enter URL" >
            </div>

            <div v-if="!loading">
            <v-btn @click="virusApiCall"
            class="mt-10">
                submit</v-btn>
            </div>

            <div v-if="loading" class="mt-10">
                
            <label>loading ...</label>

            </div>


            <div v-else-if="gotResult" class="mt-10">

                    <div class="mt-5">

                    <label>result {{result.result}}</label>
                </div>

                <div v-if="!showDetails" class="mt-5">
                
                    <v-btn @click="showDetails=!showDetails">Details</v-btn>
                </div>
            </div>
               
            <div v-if="showDetails" class="mt-5">

                <div class="mt-5">
                
                    <v-btn @click="showDetails=!showDetails">close</v-btn>
                </div>

                <div class="mt-5" style="width: 400px;">
                    
                    <label>result {{result}}</label>
                    <!-- <vue-json-pretty
                :path="'result2'"
                :data="result.result2"
                /> -->
                </div>
            </div>
            <div>

                <div v-if="gotError">

                <label>error {{error}}</label>
                </div>
            </div>

            <!-- <div class="mt-10 mb-10">

             <v-btn @click="printToConsole" class="mt-10">Print to console</v-btn>
            </div> -->

            <div v-if="duration != 0" class="mt-10 mb-10">

             <label>Duration: {{duration}}</label>
            </div>
        </div>            
    </v-layout>
</template>

<script>

import axios from 'axios'

import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';

import FormData from 'form-data'

export default {

    components: {
    // HelloWorld
    VueJsonPretty
    },

  methods:{

       async virusApiCall(){

        this.loading = true;
        this.gotResult = false;
        this.gotError = false;

        // console.log(`key: ${process.env.VUE_APP_VIRUSTOTAL_KEY}`)
        // console.log(`url: ${this.url}`)

        // return;
        let data = new FormData();

        const url = this.url;
        
        console.log(`url: ${url}`);

        console.log(`data before: ${JSON.stringify(data)}`)
        data.append('url', url);
        console.log(`data after: ${JSON.stringify(data)}`)

        const headers= {
        'x-apikey': process.env.VUE_APP_VIRUSTOTAL_KEY,
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json',

        }

        // console.log(`data: ${JSON.stringify(data)}`)
        // console.log(`headers: ${JSON.stringify(headers)}`);
        // console.log(`url: ${this.url}`);

        // return

        try{

        this.startTime = new Date().getTime();

        const result = await axios({method: 'post',
                    
            url: 'https://www.virustotal.com/api/v3/urls', 

            data,
            headers,
        });

        // console.log(`rawReponse: ${JSON.stringify(result)}`);
        // console.log(`id: ${JSON.stringify(result.data.data.id)}`);

        const id = result.data.data.id;
        // console.log(`id: ${id}`);

        const url2 = `https://www.virustotal.com/api/v3/analyses/${id}`;

        // console.log(`url2: ${url2}`);
        const result2 = await axios({method: 'get',
                    
            url: url2, 

            headers,
        });
        
        this.endTime = new Date().getTime();

        this.duration = (this.endTime - this.startTime)/ 1000;
        // console.log(`rawReponse2: ${JSON.stringify(result2.data)}`)


        this.loading = false;
        this.gotResult = true;
        this.result = result2.data;

        // this.result = result.data;

        // console.log(`result: ${JSON.stringify(result.data)}`);
        }catch(error){

        this.loading = false;
        this.gotError = true;
        this.error = error;
        console.log(`error: ${JSON.stringify(error)}`)
        }
    },
  },

  data: function(){

    return{

      url: '',
      result: '',
      error: '',
      fileName:'',
      fileBuffer: null,
      file: null,
      loading: false,
      gotResult: false,
      gotError: false,
      showDetails: false,
      startTime: 0,
      endTime: 0,
      duration: 0,
    }
  }
}
</script>

<style>

</style>