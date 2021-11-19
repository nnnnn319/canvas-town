<template>
  <div>
     
     <button @click="btn">频谱跳动</button>
      <audio crossOrigin="anonymous" loop id="myaudio" ref="myaudio" src="../../assets/kanong.mp3">   </audio>
    <canvas ref="mycanvas" id="mycanvas" style="width:100%;heigth:100%">
       
    </canvas>
    <!-- 给子组件绑定transmit自定义事件v-on:transmit="getMusic" -->
  <div class="move">
      <Interaction  style="position:absolute; left: 50%;
   top: 50%;
  transform: translate(-50%,-50%);"></Interaction>
  </div>
 
   </div>
</template>

<script>
import Interaction from './Interaction.vue'

export default {
  name:'Visual',
  data() {
    return {
    // musicUrl:''
    
    }
  
  },
  components:{
    Interaction,
  },
  methods: {
    // 从子组件获取音乐
    // getMusic(url){
    //   let dio=this.$refs.myaudio
    //   dio.src=url;
    //   // dio.play();
    //   btn() 
    // },

      btn(){
       
        var oAudio
        var dataArray
        var oCtx
        var analyser
        var audioSrc
        var bufferLength 
        var frameID
        // 利用cancas渐变进行音频绘制
        var mycanvas =document.getElementById('mycanvas')
        var ctx = mycanvas.getContext('2d');
        mycanvas.width = window.innerWidth;
        mycanvas.height = window.innerHeight;
        ctx.save();
        let  myContainer = []; //存储 需保持的图形(会动的)
        initAudio();
        
      function initAudio() {
        oAudio = document.getElementById('myaudio')
        oAudio.crossOrigin = "anonymous";
        oAudio.play();
      
      // 创建音频上下文对象
        oCtx = new AudioContext();
              // 创建分析机 
        analyser = oCtx.createAnalyser();
           // 创建媒体源
        audioSrc = oCtx.createMediaElementSource(oAudio);
         // 媒体源与分析机连接
        audioSrc.connect(analyser);
         // 输出的目标：将分析机分析出来的处理结果与目标点（耳机/扬声器）连接
         analyser.connect(oCtx.destination);
          // 设置傅里叶变化参数
         analyser.fftSize =128;
        //根据范围得到不同音频的数量的长度
         bufferLength = analyser.frequencyBinCount;
         dataArray= new Uint8Array(bufferLength);
  }
class MusicBall {
  constructor(x, y, speedX, speedY, radius, color) {
    this.x = x;
    this.y = y;
    this.SpdX = speedX;
    this.SpdY = speedY;
    this.radius = radius;
    this.color = color;
  }
  static create(bufferLength, container, detail) {
    for (let i = 0; i < bufferLength; i++) {
      let x = Math.random() * mycanvas.width;
      let y = Math.random() * mycanvas.height;
      let speedX = (Math.random() - 0.5) * 1;
      let speedY = (Math.random() - 0.5) * 1;
      let color =
        detail.colorList[Math.floor(Math.random() * detail.colorList.length)];
      let radius = 0;
      container.push(new MusicBall(x, y, speedX, speedY, radius, color));
    }
  }

  static drawBall() {
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
    myContainer.forEach((ball, index) => ball.update(dataArray[index]));
  }
  draw() {
    ctx.beginPath(); //开始绘制

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update(frequencyVolume) {
    this.draw();
    if (this.x + this.radius > mycanvas.width || this.x - this.radius < 0) {
      this.SpdX = -this.SpdX;
      this.x = this.x + this.SpdX;
    }
    if (this.y + this.radius > mycanvas.heyight || this.y - this.radius < 0) {
      this.SpdY = -this.SpdY;
      this.y = this.y + this.SpdY;
    }
    this.x = this.x + this.SpdX;
    this.y = this.y + this.SpdY;
    this.radius = frequencyVolume - 100 > 0 ? (frequencyVolume - 100) * 0.7 : 0;
  }
}


      function rockMusic(drawFnc) {
        // requestAnimationFrame 保证与屏幕刷新率一致,在每次执行时绘制mycanvas数据
         frameID = requestAnimationFrame(rockMusic.bind(this, drawFnc));
         analyser.getByteFrequencyData(dataArray);
         drawFnc();
      }
            ctx.restore();
            ctx.save();
            MusicBall.create(bufferLength, myContainer, {
                colorList: ["#F7B2B78a", "#5FC1BF", "#DE639A8a", "#7F29828a", "#16001E8a",]
            });
            frameID ? cancelAnimationFrame(frameID) : "";
             rockMusic(MusicBall.drawBall);    
      }
  }, 
}
</script>

<style scoped>
    button{
       position:absolute;
       top: 0px;
    }
        #mycanvas {
         width: 100%;
            height: 100%;
             pointer-events:none;
            display: block;
            background: linear-gradient(135deg, rgb(40,111,207) 0%, rgb(40,188,218) 100%);
            /* background: linear-gradient(135deg, rgb(253,81,150) 0%, rgb(253,154,80) 100%); */
        }
        
</style>
