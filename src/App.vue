<template>
  <main class="wrapper" v-if="progressNum !== 0">

    <div class="playArea">

      <div class="pile">
        <div class="remainNum">
          <span>
            <strong>{{remainNum}}</strong> left
          </span>
        </div>
        <div class="card">
          <div class="card-back">
            <i class='fas fa-award'></i>
          </div>
        </div>
      </div>

      <div class="current-area">
        <div class="coinSum">
          <span >
            <strong style="font-size:85%;">{{currentCard?.balance}} coins</strong> 
          </span>
        </div>
        
        <div class="card" v-if="currentCard">
          <div class="card-front">
            <div class="half" :style="`background-color:${currentCard.color}`">
              <div class="bar" :style="`background-color:${currentCard.color}`">
                <span style="float:left; margin-left:10px">{{currentCard.num}}</span>
                <span style="float:right; margin-right:10px">{{currentCard.num}}</span>
              </div>
              <div class="mainNum" >{{currentCard.num}}</div>
            </div>
            <div class="half" style="bottom: 0; transform: rotate(180deg);" :style="`background-color:${currentCard.color}`">

              <div class="bar" :style="`background-color:${currentCard.color}`">
                <span style="float:left; margin-left:10px">{{currentCard.num}}</span>
                <span style="float:right; margin-right:10px">{{currentCard.num}}</span>
              </div>
              <div class="mainNum">{{currentCard.num}}</div>
            </div>
          </div>
        </div>

        
      </div>

      <div class="coins">
          <div class="coin-wrapper">
            <template v-for="(item,i) in currentCoinList" :key="i">
              <div class="coin-shape"></div>
              <div crlass="line-break" v-if="(i -0)% 5 == 0"></div>

            </template>
          </div>

        </div>

      <!-- <div v-if="trashPile">
        <tempalte v-for="(card,i) in trashPile" :key="i">
          <span>#{{card.num}}</span> <br>
        </tempalte>
      </div> -->
      <!-- <span v-if="trashPile">{{trashPile}}</span> -->
    </div>

    <div class="controller">
      <template v-if="winner == ''">
        <span>You have <strong >{{myPlayer?.balance}} coins</strong> </span><br>
        <div v-if="currentPlayer !== username"><strong style="color:red">{{currentPlayer}}'s</strong> turn now</div>
        <div v-else>
          <div style="font-weight:bold; color:red">It's your turn</div>
          <button class="button" :disabled="(balance<= 0)" @click="pay()" style="background-color:GoldenRod;">Pay</button> &nbsp;
          <button class="button" @click="takeCard()">take</button> <br>
          <!-- <button class="button" @click="test()">test</button> <br> -->
        </div>

      </template>
    </div>

    <div class="detail">
      <div class="detail-card-wrapper">
        <template v-for="(player,i) in reorderedList()" :key="i">
          <div class="detail-card" :style="getColor(player.name)">
            <img src="../public/pics/avatar.svg" alt="Avatar" >
            
            <div class="container">
              <h4><b>{{player.name}}</b></h4>
              <span v-if="winner !== '' ">{{player.balance}}</span>
              <hr>
              <div>
                <!-- <span>{{player}}</span> -->
                <div class="badge-wrapper">
                  <template v-for="(item,i) in theirList(player.name)" :key=i>
                  
                    <div class="badge">
                      {{item.num}}
                    </div>

                    <div crlass="line-break" v-if="(i -1)% 3 == 0"></div>
                  </template>
                </div>
              </div>
            </div>  
          </div>
          <div crlass="line-break" v-if="i % 3 == 0"></div>
        </template>

        
      </div>
    </div>

    




  </main> 

  <div class="basic-data">
    #{{roomCode}}, Welcome {{username}}!
  </div> 

  <transition name="fade" >
    <div class='modal-overlay fade-in' v-if="showModal" style="height: 100vh">
      
        <div class="modal" style=" transition : all 0.6s ease 0s;">
          
          
          <div v-if="modalStatus == 1">
            <form onsubmit="event.preventDefault()">

              <label>Username</label>
              <input type="text" placeholder="Type username.." v-model="username" >

              <span v-if="modalWarning" class="warning">{{modalWarning}}</span>
              <button @click="signUp()" class="create" >Sign Up</button>
              <button @click="generateRandomUsername()" class="join" >Random name</button>

            </form>
          </div>

          <div v-if="modalStatus == 2">
            <form onsubmit="event.preventDefault()">
              <button @click="createARoom()" class="create" >Create a Room</button>
              OR<br>
              <label>Room Code</label>
              <input type="number" placeholder="Type room code.." v-model="roomCode"  autocapitalize="none" >
              <button @click="joinARoom()" class="join">Join a Room</button>

            </form>
          </div>

          <div v-if="modalStatus == 3">
            <form onsubmit="event.preventDefault()">
              <span>Welcome {{username}} !</span><br>
              <span>Currently {{members.length}}/9</span><br>
                <span>Room Code: <strong style="font-size:175%">{{roomCode}}</strong></span><br>

                <button v-if="onlineRoll == 'host'" :style="[members.length >= 3 ? '' : 'opacity: 0.2']" @click="closeTheRoom" class="closeButton">Close the Room</button><br>

                <div v-if="onlineStatus == 'waiting'" class="loader"></div>

                <button v-if="!members?.includes(username)"  @click="joinARoom" class="closeButton">Try again</button>

                <br>

                <!-- <samp>{{members}}</samp> -->

                <template v-for="(player,index) in members" :key="index" style="text-align:left">
                  <span :style="username==player ? 'color:red' : ''">{{index+1}}. {{player}}</span><br>

                </template>

                
            </form>
          </div>

          <div v-if="modalStatus == 20 " style="color:black; text-align:left" class='summary'>
            Winner is <strong style="color: crimson; font-size: 125%">{{winner}}!</strong>
            <hr>
            <template v-for="(player,i) in reorderedList()" :key=i>
              <span>{{player.name}}: <strong>{{player.point}}pt</strong>   ({{player.balance}}pt from coins) {{player.penalty}} for the penalty</span>
              <div class="badge-wrapper">
                  <template v-for="(item,i) in theirList(player.name)" :key=i>
                  
                    <div class="badge" style="width: 19%">
                      {{item.num}}
                    </div>

                    <div crlass="line-break" v-if="(i -1)% 3 == 0"></div>
                  </template>
                </div>
               <br>
            </template>

            <button @click="(showModal = false)" class="button">Close</button>

            
            
          </div>

         

          

          


        </div>
    </div>

  </transition>

</template>

<script>
  import db from './firebase.js';

  import {cardDeck} from './const/cardDeck'

  let randomWords = require('random-words');
  import { copyText } from 'vue3-clipboard';

  export default {
    name: 'App',

    data(){
      return{
        // developing: true,
        developing: false,

        showModal: true,
        // showModal: false,
        modalStatus: 1,
        modalWarning: '',



        username: '',
        roomCode: '',
        isHost: '',
        warning: '',
        skipping: '',
        
        members: [],
        globalList:[],
        onlineRoll: undefined,


        skipFlag: false,

        hands: [], 

        onlineStatus: undefined,
        isAdmin: false,
        gameStatus: undefined,
        generalData: undefined,
        progressNum: 0,

        // --------
        cardDeck,
        cardDeckIndex: 0,
        currentPlayer: undefined,
        // balance: 11,

        winner:'',
      }
    },
    mounted(){
      console.clear()
      this.setup()
      this.showModal = true
      if(this.developing) this.generateRandomUsername()

      this.shuffleDeck()
    },

    methods:{
      generateRandomUsername(){
        this.username =randomWords();
      },
      setup(){
        if(this.developing) this.modalStatus++
        // let count = 0
        // let num = 3
        // let color = 'green'
        // while(count< 33){
          
        //   this.cardDeck.push({num, location: 'deck',})
        //   num++
        //   count++
        // }

        // count =0 
        // while(count < 9){
        //   num = Math.floor(Math.random() * this.cardDeck.length)
        //   if(this.cardDeck[num].location == 'deck'){

        //     this.cardDeck[num].location = 'trash'
        //     count++
        //   }
        // }


        // console.log(this.cardDeck)
      },

      generateRoomCode(){
        var randomChars = '0123456789';
        var result = '';
        var char = null;
        for ( var i = 0; i < 5; i++ ) {

          char = randomChars.charAt(Math.floor(Math.random() * randomChars.length));
          if(char === 'l' || char === 'I' || char === 'o'  || char === 'O' || char === '0'){
            // since it is really hard to distinguishj I and l
            // console.log(`I hate ${char} || ${i}`) 
            i--;
          }else{
            result += char
          }
        }
        return result
      },
      signUp(){
        if(this.username == ''){
          this.modalWarning = 'Name cannot be empty'
          return 
        }
        
        if(this.username == 'skipping'){
          this.modalWarning = 'Name cannot be skipping'
          return 
        }

        localStorage.username = this.username
        

        this.modalStatus++
      },
      createARoom(){
        this.isHost = true
        this.warning = undefined
        let result = this.generateRoomCode()
        this.skipFlag = false
        

        let r= confirm(`Are you ready to create a room "${result}"?`);
        if(!r){
          // this.movingRobber = false;
          return;
        }

        

        this.members.push(this.username)
        this.onlineRoll = 'host'
        localStorage.userName = this.userName

        // console.log('sending data')
        const ref = db.collection('rooms')
        ref.doc(`${result}`).set({
          // TotalNum: this.userNum 
          winner: this.winner,
          hostName: this.username,
          gameStatus: 'waiting',
          members: JSON.stringify([this.username]),
          detailData: JSON.stringify([{waitingList: [], players: [], gameStatus: 'waiting'}]),

        })
        this.roomCode = result
        this.modalStatus++
        this.onlineStatus = 'waiting'
        this.isAdmin = true

        copyText(`${this.roomCode}`)
        console.clear()
        this.reciveTheData()


      },
      joinARoom(){
        console.log('trying to join ' + this.roomCode )

        var docRef = db.collection(`rooms`).doc(`${this.roomCode}`);

        docRef.get().then((doc) => {
            if (doc.exists) {
              this.members = JSON.parse(doc.data().members)
              if(!this.members.includes(this.username)) this.members.push(this.username)
              this.modalStatus = 3
              this.onlineRoll = 'guest'

              docRef.update({
                members: JSON.stringify(this.members),
              })
              // this.countingToStartGame()

              this.onlineStatus = 'waiting'
              this.reciveTheData()
              return
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        this.onlineRoll = 'guest'

      },
      closeTheRoom(){
        if(this.members.length <3) return

        this.multiAssignRoles()

        let list = []
        // let count = 0
        // while(count < 10000){
        //   for(let i in this.globalList){
        //     list.push(this.globalList[i])
        //   }
        //   count++
        // }

        // sending the data for the first time
        this.detailData =[{gameStatus: 'ready'}]
        const ref = db.collection('rooms')
        ref.doc(`${this.roomCode}`).update({
          gameStatus: 'playing',
          players: this.players,
          currentPlayer: this.username,
          cardDeck: this.shuffleDeck(),
          detailData: JSON.stringify( this.detailData),
          officialLog: '',
          currentRound: 1,
          orderList: list
        })

        console.log('done closing room ----------------')

      },
      multiAssignRoles(){
        console.clear()

        // initalizing the obj
        let count = 0
        this.players = {}
        this.globalList = []
        while(count < this.members.length){
          this.globalList.push(this.members[count])
          this.players[this.members[count]] = {
            name: this.members[count], 
            hands: [],
            balance: 11,
            waiting: false,
            state: false,
            latestSituation: false,
            index: count,
          }

          // if(count == 0){
          //   this.players[this.members[count]].isSheriff = true
          // } 
            
          
          count++
        }

        
        return 

      


        
      },

      reciveTheData(){
        console.log(this.roomCode)
        
        db.collection("rooms").doc(`${this.roomCode}`)
        .onSnapshot((doc) => {
          this.generalData = doc.data()

          if(this.myPlayer?.isSheriff){
            this.progressNum = 10
          }
          
          // joining room and wait until it closes
          if(this.progressNum ==0){
            this.gameStatus = doc.data().gameStatus
            this.members = JSON.parse(doc.data()?.members)
            // this.finalRound = parseInt(doc.data().finalRound)
            this.globalList = doc.data().orderList
            
            if(!this.members.includes(this.username)){
              this.joinARoom()
              return 
            }

            if(this.gameStatus == 'playing') this.progressNum = 1

          }

          // got the inital data to start the game
          if(this.progressNum == 1){
            this.gameStatus = 'playing'
            this.modalStatus++

            this.detailData = JSON.parse(doc.data().detailData)
            this.showModal = false
            this.players = doc.data().players
            

            this.progressNum = 2

            if(this.myPlayer.isSheriff) this.progressNum = 10

          }

          if(this.progressNum == 1.5){
            // this.gameStatus = 'playing'
            this.players = doc.data().players

            if(this.myPlayer.isSheriff){
              this.progressNum = 10
            } 
            this.progressNum = 2

              

          }


          // for the one that is figuring out what to take
          if(this.progressNum ==2){
            if(this.myPlayer.state == 'being judged'){
              this.progressNum = 3
            } 
            // this.players= ''
              
            this.cardDeck = doc.data().cardDeck
            this.currentPlayer =  doc.data().currentPlayer
            // this.players= 
            // console.log(doc.data().players)
            this.players = doc.data().players 
          }


          // this is after loading, currently getting judee
          if(this.progressNum == 3){
            this.players = doc.data().players 
            if(this.myPlayer.state == 'through') this.progressNum = 4
          }

          // after you got inspected 
          if(this.progressNum == 4){
            this.players = doc.data().players
            this.showModal = true
            this.modalStatus = 10
            this.progressNum = 5 

          }

          if(this.progressNum == 5){
            this.players = doc.data().players
            this.gameState = 'done'

            // if(this.waitingList.length == this.players.length -1)

          }

          // for the sheriff
          if(this.progressNum == 10){
            this.players = doc.data().players
            // do something to change the sheriff
            if(this.waitingList?.length == this.reorderedList.length ){
              this.progressNum = 11
            }
          } 


          if(this.progressNum == 11){
            // get the next sheriff and flip the shit
            const nextSheriff = this.players[this.globalList[this.currentRound]]
            console.log(`next sheriff is ${nextSheriff.name}`)
            this.myPlayer.isSheriff = false
            nextSheriff.isSheriff = true
            for(let i in this.players){
              let player = this.players[i]
              player.waiting =  false
              player.state = false
              player.bribingCost = 0
              player.latestSituation = false
              // player.didBoxOpen = false
            }


            const ref = db.collection('rooms')
            this.progressNum = 20
            ref.doc(`${this.roomCode}`).update({
              currentRound: this.currentRound+1,
              players: this.players
            })
          }
          

          if(this.progressNum == 20){
            this.progressNum = 1.5
          }

          

        
          
        
        })
      },
      updatingWholeData(){
        console.log('updating the whole')
        const ref = db.collection('rooms')
        let updatingTarget = `players.${this.username}`
        ref.doc(`${this.roomCode}`).update({
          cardDeck: this.cardDeck,
          currentPlayer: this.currentPlayer,
          [updatingTarget]: this.myPlayer,
        })

      },
      updatingData(){
        console.log('updating')
        let updatingTarget = `players.${this.username}`
        console.log(this.username)
        const ref = db.collection('rooms')
        ref.doc(`${this.roomCode}`).update({
          [updatingTarget]: this.myPlayer,
        })

      },

      // -------------------
      test(){
        // console.log('hgey')
        // // this.cardDeckIndex++; 
        // for(let i in this.players){
        //   let player = this.players[i]
        //   player.hands.push(this.currentCard)
        //   player.hands.push(this.currentCard)
        //   player.hands.push(this.currentCard)
        //   player.hands.push(this.currentCard)
        //   player.hands.push(this.currentCard)
        //   player.hands.push(this.currentCard)
        // }

      },
      shuffleDeck() {
        let array = this.actualPile
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }

        // console.log('----------')

        // for(let i in array){
        //   // console.log(array[i].num)
        // }

        return array;

      },

      pay(){
        this.currentCard.balance++
        this.myPlayer.balance--
        this.currentPlayer = this.nextPlayer
        this.updatingWholeData()
      },
      takeCard(){
        if(confirm(`Taking this card?`) == true){

          this.myPlayer.hands.push(this.currentCard)
          this.myPlayer.balance+= this.currentCard.balance 
  
          this.currentCard.location = this.username
          this.updatingWholeData()
        }
        
      },
      theirList(name){
        let list = []
        for(let i in this.cardDeck){
          list.push(this.cardDeck[i])
        }

        list.sort((a,b) => a.num - b.num);

        let tempList =[]
        for(let i in list){
          if(list[i].location == name){
            tempList.push(list[i])
          }
        }

        return tempList

      },
      reorderedList(){
        let list = []
        for(let i in this.players){
          list.push(this.players[i])
        }

        list.sort((a,b) => a.index - b.index);

        return list
      },

      finishGame(){
        this.modalStatus = 20
        this.showModal = true
        this.showingSummary = true

        let penalty = 0
        let lastNum = 0
        for(let i in this.players){
          penalty = 0
          lastNum = 0
          let player = this.players[i]
          let list = this.theirList(player.name)
          for(let i in list){
            if(lastNum+1 !== list[i].num ){
              penalty+=  list[i].num 

            }
            lastNum = list[i].num 
          }
          player.penalty = penalty
          player.point = player.balance - penalty
        }





        let maxPoint = -1000
        for(let i in this.players){
          let player = this.players[i]
          if(player.point > maxPoint){
            this.winner = player.name
            maxPoint = player.point
          }
        }
      },

      // -----------------------
      getColor(name){
        if(name == this.currentPlayer){
          return 'background-color: gold'
        }
        return ''
      },

      sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      },
    },
    computed:{
      myPlayer(){
        if(this.gameStatus == 'playing'){
          // console.log(this.players)
          return this.players[this.username]
        }
        return undefined

      },
      currentCard(){
        if(this.remainNum <= 0) return
        return this.actualPile[0]
      },

      currentCoinList(){
        if(!this.currentCard)return
        let list =[]
        let count =0 
        while(count< this.currentCard.balance){
          list.push('nice')
          count++
        }
        return list

      },
      actualPile(){
        let list = []
        for(let i in this.cardDeck){
          if(this.cardDeck[i].location == 'deck'){
            list.push(this.cardDeck[i])
          } 
        }

        return list
      },
      remainNum(){
        let count = 0
        for(let i in this.cardDeck){
          if(this.cardDeck[i].location == 'deck'){
            count++
          }
        }

        return count 
      },
      trashPile(){
        if(this.cardDeck.length < 1) return false
        let list = []
        for(let i in this.cardDeck){
          if(this.cardDeck[i].location == 'trash'){
            list.push(this.cardDeck[i])
          }
        }

        return list
        

      },
      

      
      nextPlayer(){
        let myIndex
        let list = this.reorderedList()
        let theLength = list.length

        for(let i in list){
          if(list[i].name == this.username){
            myIndex = i
          }
        }

        console.log(myIndex)
        myIndex  = parseInt(myIndex)

        if(myIndex+1 == theLength){
          return list[0].name
        }
        return list[myIndex+1].name

      },

      
    },
    watch:{
      roomCode(){
        if(!this.developing || !this.roomCode || this.isHost) return

        console.log(this.roomCode)
        if(this.roomCode >= 1000){
          console.log('oh yeah')
          this.joinARoom()

        }
      },
      players(){
        // console.log('chanigin players')
      },

      async remainNum(){
        if(this.remainNum == 0){
          await this.sleep(2000)
          this.finishGame()
        }
      }
    },
  }
</script>

<style>
  #app {
    background-color: #D6E4E5;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    margin-top: 10px;

  }
  
  *{
    /* background-color: #D6E4E5; */
    margin: 0;
    /* padding: 0 5px; */
  }

  body{
    background-color: #D6E4E5;
  }

  .wrapper{
    width: 92.5%;
    max-width: 500px;

    margin: auto auto;
    position:relative;
  }

  /* -------------------------------------------------------- */

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    /* bottom: 0; */
    /* height: 667px; */
    z-index: 98;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .modal {
    color: black;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    
    width: 75%;
    max-width: 400px;
    background-color: #f2f2f2;
    border-radius: 16px;
    
    padding: 25px;
  }
  .modal h1 {
    color: #222;
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 15px;
  }
  .modal p {
    color: #666;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 15px;
  }
  .modal strong{
    content:"handsome";
    white-space: pre;
  }
  .fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: .4s;
  }
  @keyframes fadeInOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  input[type=text], select {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
  }
  input[type=number], select {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
  }
  .modal  .create {
    width: 100%;
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 10px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .modal  .join {
    width: 100%;
    background-color: #6495ed;
    color: white;
    padding: 14px 20px;
    margin: 5px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .modal  .cancel {
    width: 100%;
    background-color: firebrick;
    color: white;
    padding: 14px 20px;
    margin: 20px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .tab-button {
    width: 25%;
    background-color:  #363945;
    color: white;
    padding: 10px 5px;
    margin: 10px 3%;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .undo-button{
    float:right;
    margin-right:15px;
    width: auto;
    background-color: grey;
    color: white;
    padding: 4px 5px;
    /* margin: 5px 0; */
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .loader {
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #3498db;
    width: 80px;
    height: 80px;

    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;

    margin: 30px auto;

    
  }
  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* ------------------------------------------------ */
  .playArea{
    position: relative;

    background-color:#497174;
    width: 100%;
    height: 20vh;

    /* height: 180px; */
    border-radius: 15px;

    -moz-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    -webkit-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    -ms-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
  }
  
  .pile{
    position: absolute;
    top: 50%;
    left: 3%;
    transform: translateY(-50%);

    /* border: 2px solid black; */
    aspect-ratio: 65/89;
    /* height: 85%; */
    width: 25%;
    /* max-height: 100%; */


    /* background: #497174; */
    /* aspect-ratio: 65/89; */
    /* background-color: red; */
    /* width: 90px; */
    /* height: 125px; */
    border-radius: 8px;
  }

  .pile .remainNum{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    /* background: #497174; */
    top: 0px;

    width: 100%;
    border-radius: 4px;

    color: #D6E4E5;
    /* margin-top: 20px; */
  }

  .pile .card{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0%;
    background-color: #EFF5F5;
    aspect-ratio: 65/89;
    width: 75%;
    /* height: 95px; */
    border-radius: 8px;

    
  }

  .pile .card .card-back{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);


    background-color: #2B3A55;
    /* aspect-ratio: 65/89; */
    width: 90%;
    height: 92.5%;
    /* height: 100; */
    border-radius: 8px;
  }

  .card-back i{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

    /* width: 50px;
    height: auto; */
    font-size: 40px;



    background-color: inherit;
    color: #EFF5F5;
    /*  */
    /* filter: invert(98%) sepia(65%) saturate(4709%) hue-rotate(179deg) brightness(116%) contrast(92%); */
  }

  

  .current-area{
    position: absolute;
    top: 50%;
    /* right: 15px; */
    left: 30%;
    transform: translateY(-50%);

    /* border: 2px solid black; */
    aspect-ratio: 65/89;
    /* height: 85%; */
    width: 33%;
    /* max-height: 100%; */


    /* background: #497174; */
    /* background-color: red; */
    /* aspect-ratio: 65/89; */
    /* width: 90px; */
    /* height: 125px; */
    border-radius: 8px;
  }

  .coinSum{
    position: absolute;
    left: 50%;
    color: #D6E4E5;
    transform: translateX(-50%);
    /* background: #497174; */
    top: 0px;
    /* left: 0p; */

    /* width: 90px; */
    border-radius: 4px;
    /* color: #EFF5F5; */
    /* margin-top: 20px; */
  }

  .current-area .card{
    position: absolute;
    bottom:5%;
    left: 50%;
    transform: translateX(-50%); 


    background-color: #EFF5F5;
    aspect-ratio: 65/89;
    width: 80%;
    /* height: 120px; */
    border-radius: 8px;

    
  }

  

  .card-front{
    /* position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);


    width: 85px;
    height: 115px;
    border-radius: 8px; */
  }

  .card-front .half{
    border-radius: 8px 8px 0px 0px;
    position: absolute;
    /* top: 0px; */
    left: 0px;
    width: 100%;
    height: 50%;
    
    filter: saturate(50%);
    /* background-color: green; */
  }

  .half .bar{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 20px;
    /* background-color: blue; */
    color: #D6E4E5;
    border-radius: 8px 8px 0px 0px;
    filter: saturate(5);
    font-weight: bold;
    /* text-shadow:  0 0.5px 0 #000, -0.5px 0 0 #000; */
  }

  .mainNum{
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);

    color: #D6E4E5;
    font-size:28px;

  }



  .coins{
    position: absolute;
    transform: translateY(-50%);
    background: #D6E4E5;
    top: 50%;
    right:5%;

    width: 30%;
    height: 85%;
    border-radius: 5px;
    /* color: #EFF5F5; */
    /* margin-top: 20px; */
  }

  .coin-wrapper {
    width:95%;
    margin: auto auto;
    display: flex;
    justify-content: space-around;
    margin: 5px auto;
    flex-flow: row wrap;

  }

  .coin-shape{
    display:block;
    aspect-ratio: 1/1;
    width: 18%;
    /* height: 10px; */
    border-radius: 50%;
    background-color: GoldenRod;
    margin: 5px auto;

  }

  /* ---------------------------------------- */
  .controller{
    margin: 1.5vh auto;
    position:relative;
    width: 100%;
    height: 10vh;
    min-height: 90px;
    /* background-color: red; */
    border: 3px solid #497174;
    border-radius: 15px;

    -moz-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    -webkit-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    -ms-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
  }

  .button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 6px 2px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
  }

  /* ---------------------------------------- */
  .detail{
    margin: 3vh auto;
    position:relative;
    width: 100%;
    /* height: 40vh; */
    /* padding: 30px auto; */
    background-color: #497174;
    /* border: 2px solid red; */
    border-radius: 15px;

    -moz-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    -webkit-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    -ms-box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);
    box-shadow: 10px 14px 36px -2px rgba(0, 0, 0, 0.59);

    transition: all 1s;
  }

  .detail-card-wrapper {
    width:95%;
    /* margin: 10px auto; */
    display: flex;
    justify-content: space-around;
    margin: 10px auto;
    padding: 10px;
    flex-flow: row wrap;

  }
  .line-break {
    width: 100%;
  }

  

  .detail-card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 30%;
    border-radius: 8px;
    padding: 5px 0px 0px;
    border: 1px solid #497174;
    margin: 0px auto 10px;
    background-color: #D6E4E5;
  }

  

  

  /* Add some padding inside the card container */
  .detail-card .container {
    padding: 2px 5px;
    position: relative;
  }

  .detail-card  hr{
    width: 100%; 
    margin: 5px auto;
    background-color: #497174;
    height: 1.5px;
    border: none;
    
  }

  .detail-card img{
    width: 20px;
    margin: -5px auto -8px; 
    border-radius: 5px 5px 0 0;
  }

  .badge-wrapper {
    /* background: green; */
    width:100%;
    /* margin: auto auto; */
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
  }

  /* .badge{
    background: #fff;
    color: #424242;
    min-width: 50px;
    padding-right: 20px;
    height: 35px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  } */

  .badge{
    background: #EB6440;
    color: #fff;
    width: 28%;
    height: 30px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto auto 5px;
    /* margin-right: 10px;
    margin-left: 2px; */
  }

  /* ---------------------------------------- */
  .basic-data{
    position: absolute;
    left: 10px;
    bottom: 30px;

  }




</style>
