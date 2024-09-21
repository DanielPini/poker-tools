const heroCard1 = document.querySelector("#hero-card1")
const heroCard2 = document.querySelector("#hero-card2")

const hand = "4c 2s"

function parseHand(hand) {
  const order = "23456789TJQKA"

  const cards = hand.split(" ") // Split into cards
  const faces = cards.map(a => String.fromCharCode([77 - order.indexOf(a[0])])).sort() 
  const suits = cards.map(a => a[1]).sort()
  
}

// Hero has 2 cards showing
// Villain can have 0, 1, or 2 cards showing
// Community cards can have 0, 3, 4, of 5 cards showing.
// Add Hero cards to Community cards and sort
// Apply hand ranking function
// If Villian, add Villain cards to Community cards, sort, and apply hand ranking function
// Compare Hero to Villain or give percentage

