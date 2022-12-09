let cardDeck = [
  {color: '#a5bdd1'},
  {color: '#8bb3cc'},
  {color: '#72accb'},
  {color: '#2da1c5'},
  {color: '#0198c8'},
  {color: '#088abc'},
  {color: '#0780be'},
  { color: '#007ec5'},

  { color: '#448b35'},
  { color: '#579539'},
  { color: '#7a913e'},
  { color: '#8ea02b'},
  { color: '#9ca72d'},
  { color: '#b4b11e'},
  { color: '#c7c001'},
  { color: '#dacf06'},
  { color: '#dfc10c'},
  { color: '#d5a422'},
  { color: '#dfa416'},
  { color: '#cc974e'},
  { color: '#db8112'},
  { color: '#ca6514'},
  { color: '#ab6347'},
  { color: '#ac3d23'},
  { color: '#a53f30'},
  { color: '#952e26'},
  { color: '#943630'},
  { color: '#921d1c'},

  { color: '#5b1a4d'},
  { color: '#4b1851'},
  { color: '#381e3c'},
  { color: '#211d37'},
  { color: '#201c46'},
]

for(let i in cardDeck){
  cardDeck[i].num = parseInt(i) + 3
  cardDeck[i].location = 'deck'
  cardDeck[i].balance= 0 
}

let count =0 
let num 
while(count < 9){
  num = Math.floor(Math.random() * cardDeck.length)
  if(cardDeck[num].location == 'deck'){

    cardDeck[num].location = 'trash'
    count++
  }
}

export {cardDeck}