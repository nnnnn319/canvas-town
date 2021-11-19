<template>
  <div >
     <div class="blue"></div>
    <button @click="btn">频谱</button>
   
      <audio crossOrigin="anonymous" id="myaudio" src="../assets/kanong.mp3" ></audio>

    <canvas id="canvas"></canvas>

  </div>
</template>

<script>
export default {
  name: 'Rhythm',
  data() {
    return {
    // musicUrl:'https://wsaudiobssdlbig.yun.kugou.com/202111161352/07783080d13557b15c0defc84c79e343/bss/extname/wsaudio/23e5d6767a50bf8b6e33e86efb54ad6b.mp3'
      
    }
  },
  methods: {
    
     btn() {
            var oAudio = document.getElementById('myaudio');
            oAudio.play();
            // 创建音频上下文对象
            var oCtx = new AudioContext();
            // 创建媒体源
            var audioSrc = oCtx.createMediaElementSource(oAudio);
            // 创建分析机 
            var analyser = oCtx.createAnalyser();
            // 媒体源与分析机连接
            audioSrc.connect(analyser);
            // 输出的目标：将分析机分析出来的处理结果与目标点（耳机/扬声器）连接
            analyser.connect(oCtx.destination);
            // 利用cancas渐变进行音频绘制
            var canvas =document.getElementById('canvas')
            var ctx = canvas.getContext('2d');
            canvas.width = 500;
            canvas.height = 500;
            var oW = canvas.width;
            var oH = canvas.height;
            //线性渐变
            var color1 = ctx.createLinearGradient(oW / 2, oH / 2 - 30, oW / 2, oH / 2 - 100);
            var color2 = ctx.createLinearGradient(oW / 2, oH / 2 + 30, oW / 2, oH / 2 + 100);
            color1.addColorStop(0, '#BF93EA');
            color1.addColorStop(.5, '#10FDFD');
            color1.addColorStop(1, '#A5FE8A'); 
             color2.addColorStop(0, '#BF93EA');
             color2.addColorStop(.5, '#10FDFD');
            color2.addColorStop(1, '#A5FE8A');
            // 音频图的条数
            var count = 250;
            // 缓冲区:进行数据的缓冲处理，转换成二进制数据
            var voiceHeight = new Uint8Array(analyser.frequencyBinCount);
      function  draw() {
            // 将当前的频率数据复制到传入的无符号字节数组中，做到实时连接
            analyser.getByteFrequencyData(voiceHeight);
            // 自定义获取数组里边数据的频步
            var step = Math.round(voiceHeight.length / count);
            ctx.clearRect(0, 0, oW, oH);
            for (var i = 0; i < count; i++) {
                var audioHeight = voiceHeight[step * i];
                ctx.fillStyle = color1; 
                ctx.fillRect(oW / 2 + (i * 10), oH / 2, 3, -audioHeight);
                ctx.fillRect(oW / 2 - (i * 10), oH / 2, 3, -audioHeight);
                ctx.fillStyle = color2; 
                ctx.fillRect(oW / 2 + (i * 10), oH / 2, 3, audioHeight);
                ctx.fillRect(oW / 2 - (i * 10), oH / 2, 3, audioHeight);
            }
            window.requestAnimationFrame(draw);
        }
         draw();

        }
  
  },
   
}
</script>

<style scoped>
        #canvas {
            display: block;
            /* background: linear-gradient(135deg, rgb(40,111,207) 0%, rgb(40,188,218) 100%); */
        }
        
</style>
