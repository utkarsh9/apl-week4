var fs= require('fs');

function extractWords(filePath){
    var contents=fs.readFileSync(filePath, 'utf8');
        var dirtyArray=contents.split(/[\W_]+/g);
        this.data=dirtyArray.map(str=>{
            return str.toLowerCase();
        });
        return this.data;
}

function loadStopwords(filePath){
    var contents=fs.readFileSync(filePath, 'utf8');
        var dirtyArray=contents.split(",");
        this.stopWordsData=dirtyArray.map(str=>{
            return str.toLowerCase();
        });
        return this.stopWordsData;
}

function incrementCount(wordMap,word){
    if(wordMap.hasOwnProperty(word)){
        wordMap[word]+=1;
    }else{
        wordMap[word]=1;
    }
}

var DataStorageObject={
    data:[],
    init:function(filePath){
        data=extractWords.call(this, filePath);
    },
    words:function(){
        return data;
    }
};

var StopWordsObject={
    stopWords:[],
    init:function(filePath){
        stopWords=loadStopwords.call(this, filePath);
    },
    isStopWord:function(word){
        if(stopWords.includes(word)){
            return false;
        }
        return true;
    }
};

var WordFreqenciesObject={
    frequencies:[],
    increaseWordCount:function(wordMap,word){
        incrementCount.call(this,wordMap, word);
    },
    sort:function(wordsMap){
        var wordCountArray=[];
        wordCountArray=Object.keys(wordsMap).map(function(key){
            return{
                word:key,
                total:wordsMap[key]
            };
        });
        wordCountArray.sort(function(a,b){
            return b.total-a.total;
        });
        return wordCountArray;
    }
};

function top25(wordCountObject){
    for(j=0;j<25;j++){
        console.log(wordCountObject[j].word+"-"+wordCountObject[j].total);
    }
}
//this function creates context that holds references to all objects
function getObjectContext(){
    var dso=DataStorageObject;
    var swo=StopWordsObject;
    var wfo=WordFreqenciesObject;
    return{
        dso,swo,wfo
    };
}

var me=getObjectContext();
me.dso.init.call(me.dso, process.argv[2]);
me.swo.init.call(me.swo, "stop-words.txt");
for(i=0;i<me.dso.data.length;i++){
    if(me.swo.isStopWord.call(me.swo,me.dso.data[i]) && "s".localeCompare(me.dso.data[i])){
        me.wfo.increaseWordCount.apply(me.wfo,[me.wfo.frequencies,me.dso.data[i]]);
    }
}
top25(me.wfo.sort.call(me.wfo,me.wfo.frequencies));





