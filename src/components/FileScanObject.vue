<template>
  
  <v-layout>
    
    <div>
      <!-- <div class="mt-2">
                        
            <label>#{{index}} cid: {{result.cid}}</label>
        </div> -->

        <div class="mt-2 mb-2">
            
            <label>#{{index}} name: {{result.name}}</label>
        </div>
        
        <div class="mb-4">

            <v-btn @click="localShowResult=!localShowResult">

                <label v-if="localShowResult  == true">Close</label> 
                <label v-else> Show Result </label>
                </v-btn>

        </div>
        <div style="width: 200px;" v-if="localShowResult" class="mt-2">

            <label>result: {{result.rawResponses}}</label>
        </div>

        <div class="ml-5" v-if="typeof result.results != 'undefined'">

            <div v-if="result.results.length>0">

                <div v-for="(newResult, i) in result.results" :key="i">
                    
                    <!-- <label>{{newCidObject}}</label> -->
                    <file-scan-object :newResult="newResult" :index="`${index}-${i+1}`"/>
                </div> 
            </div>    
        </div>

    </div>
  </v-layout>
</template>

<script>

// import urlScanObject from './tempComponent'

export default {

    name: "fileScanObject",

    mounted(){


        // console.log(`rawResponses: ${JSON.stringify(this.rawResponses)}`)
    },
    
    props:{

        index: '',

        result: {
            
            type: Object
        }
    },

    methods:{

    },

    data: function(){

        return{

            localShowResult: false,
        }
    }

}
</script>

<style>

</style>