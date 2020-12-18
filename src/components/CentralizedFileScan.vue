<template>
  
    <v-layout class="d-flex flex-column justify-space-around mt-16">
    
        <div class="mb-10">

          <label>duration: {{duration}}</label>
        </div>

        <div>
        <label>File to scan:</label>
        </div>

        <div>
        <!-- <input v-model="url"
        type="file" placeholder="uploadFile" > -->
        
        <div>
            
            <v-btn  @click="onFileButtonClicked">Upload File</v-btn>

             <input type="file"  accept="*" style="display: none;" ref="fileInput" @change="getFileEvent">
        </div>
        
        <div v-if="fileName != ''" style="width:100px;">

        <label > {{fileName}}</label>
        </div>

        </div>

        <div v-if="!loading">
        <v-btn @click="virusApiCall"
        class="mt-10">
            submit</v-btn>
        </div>

        <div v-if="loading">
            
        <label>loading ...</label>

        </div>


        <div v-if="gotResult">

            <div>
            <label>result {{result.result}}</label>
            </div>

            <div v-if="!showDetails">
            
            <v-btn @click="showDetails=!showDetails">Details</v-btn>
            </div>
        </div>

        <div v-if="showDetails">

            <div>
            
            <v-btn @click="showDetails=!showDetails">close</v-btn>
            </div>

            <div>
                
                <label>result {{result.result2}}</label>
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
    </v-layout>
</template>

<script>

import axios from 'axios'

import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';

// import FormData from 'form-data'

export default {

    components: {
    // HelloWorld
    VueJsonPretty
    },

  methods:{

    onFileButtonClicked(){

      this.$refs.fileInput.click();
    },

    getFileEvent(event){

      // const componentsHelpers = componentsHelpers;

        const fileReader = new FileReader();
        
            fileReader.addEventListener('load', () => {

            this.loading = false;
        });


        fileReader.onerror = function(event) {
        
            this.loading = false;

            console.log(`file could not be loaded`)
        };

      if(event.target.files.length > 0){

        this.file = event.target.files[0];
      
        this.fileName = this.file.name;

        console.log(`file.size: ${this.file.size}`);

        if(this.file.size > 30000000)
        {

          this.fileIsBig = true;
          // console.log(`File is big true`);

        }else{

          this.fileIsBig = true;

          // console.log(`File is big false`);
        }
        // console.log(`fileJson: ${Object.keys(this.file)}`);
        this.loading = true;

        fileReader.onload = (e) => {
          
          // console.log(`arrayBuffer: ${e}`);

          // console.log(`json of arrayBuffer: ${JSON.stringify(e)}`);
        };

      const saveFileAsDataUrl = this.saveFileAsDataUrl;

        fileReader.onloadend = function(evt) {
          
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          // console.log(`result.length: ${evt.target.result.length}`);

          // console.log(`json of result: ${JSON.stringify(evt.target.result)}`);
          // console.log(`result: ${evt.target.result}`);

          saveFileAsDataUrl(evt.target.result);
          
            // document.getElementById('byte_content').textContent = evt.target.result;
            // document.getElementById('byte_range').textContent = 
            //     ['Read bytes: ', start + 1, ' - ', stop + 1,
            //     ' of ', file.size, ' byte file'].join('');
          }
        };

        // console.log(`typeof File: ${typeof this.file}`);  
        // fileReader.readAsArrayBuffer (this.file);
        fileReader.readAsDataURL(this.file);

        // fileReader.readAsText(this.file);


        // this.fileBuffer = Buffer.from(this.file);
      }
    },

     saveFileAsDataUrl(fileResult) {
       
       this.fileAsDataUrl = fileResult;
      //  console.log(`fileAsDataUrl: ${this.fileAsDataUrl}`);
    },
    

    async virusApiCall(){


      this.loading = true;
      this.gotResult = false;
      this.gotError = false;

      console.log(`key:${process.env.VUE_APP_VIRUSTOTAL_KEY}`)

      let data = new FormData();
      
      // console.log(`this.file:${this.file}`);
      // data.append('file', this.fileAsDataUrl);
      data.append('file', this.file);

      
      const headers= {
      'x-apikey': process.env.VUE_APP_VIRUSTOTAL_KEY,
      // 'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'application/json',

      }

      // console.log(`data: ${JSON.stringify(data)}`)
      // console.log(`headers:${JSON.stringify(headers)}`);
      // console.log(`url:${this.url}`);


      try{

      // console.log(`this.file:${this.file}`);
      // console.log(`JSON of file:${JSON.stringify(this.file)}`);
      // console.log(`objectKeys of file:${Object.keys(this.file)}`);

      //   console.log(`string of file:${this.file.toString()}`);

      // console.log(`data:${JSON.stringify(data)}`);

        if(this.fileIsBig){
        // if(true){

            console.log(`in is file big`);

            const requestUrl = await axios({method: 'get',
                    
            url: 'https://www.virustotal.com/api/v3/files/upload_url', 

            // data,
            headers,
          });

          // console.log(`url: ${JSON.stringify(requestUrl.data.data)}`);

          const uploadUrl = requestUrl.data.data;

          // console.log(`url: ${uploadUrl}`);
    
          const startTime = new Date().getTime();
          
          const result = await axios({method: 'post',
                  
            url: uploadUrl, 

            data,
            headers,
          });

          console.log(`result: ${JSON.stringify(result)}`);

           const endTime = new Date().getTime();

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

          
            this.duration = (endTime - startTime)/1000;

          console.log(`rawReponse2: ${JSON.stringify(result2)}`)          

          // console.log(`requestUrl: ${JSON.stringify(requestUrl)}`);
          
        }else{

          const startTime = new Date().getTime();

          // console.log(`startTime: ${startTime}`);
        
          const result = await axios({method: 'post',
                  
          url: 'https://www.virustotal.com/api/v3/files', 

          data,
          headers,
          });

          const endTime = new Date().getTime();

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

          
            this.duration = (endTime - startTime)/1000;

          console.log(`rawReponse2: ${JSON.stringify(result2)}`)

          this.loading = false;
          this.gotResult = true;
          this.result = result;
      
          // this.result = result.data;

          // console.log(`result: ${JSON.stringify(result.data)}`);
        } 
      }catch(error){

      this.loading = false;
      this.gotError = true;
      this.error = error;
      console.log(`error: ${JSON.stringify(error)}`)
      }
    }
  },

  data: function(){

    return{

      url: '',
      duration: 0,
      result: '',
      error: '',
      fileName:'',
      fileResult: null,
      fileBuffer: null,
      file: null,
      loading: false,
      gotResult: false,
      gotError: false,
      showDetails: false,
      fileIsBig: false,
    }
  }
}
</script>

<style>

</style>