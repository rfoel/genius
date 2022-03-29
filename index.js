const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms))

const possibleColors = ['green', 'red', 'yellow', 'blue']

const sounds = {
  green: new Audio('green.mp3'),
  red: new Audio('red.mp3'),
  yellow: new Audio('yellow.mp3'),
  blue: new Audio('blue.mp3'),
}

const pushRandomColor = targetArray => {
  const color =
    possibleColors[Math.floor(Math.random() * possibleColors.length)]
  targetArray.push(color)
}

const playSound = color => {
  sounds[color].currentTime = 0
  return sounds[color].play()
}

const sequence = []

const playSequence = async () => {
  await delay()
  for (const color of sequence) {
    const element = document.getElementById(color)
    element.classList.add('active')
    await Promise.all([delay(), playSound(color)])
    element.classList.remove('active')
    await delay()
  }
}

let userSequence = []

const colors = document.querySelector('.colors')

const checkInput = () => sequence.join().includes(userSequence.join())

colors.addEventListener('click', async event => {
  const color = event.target.id
  await playSound(color)
  userSequence.push(event.target.id)
  const correctInput = checkInput()
  if (correctInput) {
    if (sequence.length === userSequence.length) {
      console.count('level')
      userSequence = []
      pushRandomColor(sequence)
      await delay(500)
      await playSequence()
    }
  } else {
    alert('errou')
  }
})

const hideMenu = () => {
  const menu = document.querySelector('.menu')
  menu.classList.add('hidden')
  const overlay = document.querySelector('.overlay')
  overlay.classList.add('hidden')
}

const init = () => {
  hideMenu()
  pushRandomColor(sequence)
  playSequence()
}

const start = document.getElementById('start')
start.addEventListener('click', init)
