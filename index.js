const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms))

const possibleColors = ['green', 'red', 'yellow', 'blue']

const sounds = {
  green: new Audio('green.mp3'),
  red: new Audio('red.mp3'),
  yellow: new Audio('yellow.mp3'),
  blue: new Audio('blue.mp3'),
}

const sendEvent = (event, data) => {
  try {
    window.splitbee?.track(event, data)
  } catch {}
}

const setUser = username => {
  try {
    window.splitbee?.user.set({ username })
  } catch {}
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

let sequence = []

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
  sendEvent('Clicked color sequence', {
    color,
  })
  await playSound(color)
  userSequence.push(event.target.id)
  const correctInput = checkInput()
  if (correctInput) {
    if (sequence.length === userSequence.length) {
      userSequence = []
      pushRandomColor(sequence)
      await delay(500)
      await playSequence()
    }
  } else {
    const level = sequence.length - 1
    sendEvent('End game', {
      sequence,
      userSequence,
      level,
    })
    toggleEndMenu(level)
    toggleOverlay()
  }
})

const toggleStartMenu = () => {
  const menu = document.querySelector('.start-menu')
  menu.classList.toggle('hidden')
}

const toggleEndMenu = (level = 0) => {
  const menu = document.querySelector('.end-menu')
  menu.classList.toggle('hidden')
  const score = document.getElementById('score')
  score.innerText = level
}

const toggleOverlay = () => {
  const overlay = document.querySelector('.overlay')
  overlay.classList.toggle('hidden')
}

const init = () => {
  userSequence = []
  sequence = []
  sendEvent('Start game')
  toggleStartMenu()
  toggleOverlay()
  pushRandomColor(sequence)
  playSequence()
}

const finish = event => {
  event.preventDefault()
  const input = document.getElementById('username')
  if (input.value.length >= 3) {
    setUser(input.value)
    toggleEndMenu()
    toggleStartMenu()
  }
}

const start = document.getElementById('start')
start.addEventListener('click', init)

const end = document.getElementById('end')
end.addEventListener('click', finish)
