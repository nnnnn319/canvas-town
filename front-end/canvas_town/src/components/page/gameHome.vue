<template>
    <div class="game-hoom-container">
        <div class="button-group">
            <div class="button-space">
                <b-button  variant="outline-primary" class="room-button" v-b-modal.create-room >创建房间</b-button>
            </div>
            <div class="button-space">
                <b-button variant="outline-primary" class="room-button" v-b-modal.add-room>加入房间</b-button>
            </div>
        </div>
        <div class="profile-space">
            <b-img  rounded="circle" alt="Circle image" src="https://picsum.photos/125/125/?image=58" style="width: 70px;" ></b-img>
            <p id="profile-name">{{username}}</p>
        </div>
        <b-modal
        id="create-room"
        ref="create-room-modal"
        title="Create Room"
        @show="resetModal"
        @hidden="resetModal"
        @ok="createRoom"
        >
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
            id="select-group-1"
            label="游戏模式:"
            label-for="select-1"
            description="选择游戏模式"
            >
            <b-form-select
            id="select-1"
             v-model="form.gameType" :options="gameTypes"
             style="width:80%;" class="mt-3"></b-form-select>
            </b-form-group>
            <b-form-group
            id="select-group-2"
            label="游戏人数"
            label-for="select-2"
            description="选择游戏人数"
            >
            <b-form-select
            id="select-1"
             v-model="form.playerNumber" :options="gamePlay"
             style="width:80%;"></b-form-select>
            </b-form-group>
        </form>
        </b-modal>
        <b-modal
        id="add-room"
        ref="create-room-modal"
        title="Add Room"
        @show="resetModal"
        @hidden="resetModal"
        @ok="createRoom"
        >
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
            id="select-group-1"
            label="游戏模式:"
            label-for="select-1"
            description="选择游戏模式"
            >
            
            </b-form-group>
        </form>
        </b-modal>
    </div>
</template>
<script>
export default {
    data() {
        return{
            form:{
                gameType: '猜歌挑战',
                playerNumber: 2
            },
           gameTypes:[{
               value: '猜歌挑战',
               text: '猜歌挑战'
           },
           {
               value: '倒放挑战',
               text: '倒放挑战'
           },
           {
               value: '冲关挑战',
               text: '冲关挑战'
           }],
           gamePlay:[2,3,4,5,6]
        }
    },
    methods: {
        createRoom: function(){
            console.log("你创建了房间")
            console.log("房间信息" ,this.form)
        },
        addRoom: function(){

        },
        resetModal: function(){
            this.form = {
                gameType: '猜歌挑战',
                playerNumber: 2
            }
        }
    },
    computed: {
       username: function(){return localStorage.getItem(("name"))}
    }
}
</script>
<style>
.button-group{
    width: 100%;
    height: 100%;
    margin-top: 15%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center; 
}
.button-space{
    width: 100%;
    display: flex;
    justify-content: center;
}
.room-button{
    width: 30%;
    font-size: 50px;
    border-radius: 20px;
    font-size: 50px;
    margin: 20px;
}
.profile-space{
    margin-top: 10%;
    padding-right: 10%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
}

#profile-name{
    font-size: 50px;
    padding: 20px;
}


</style>