"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  active: boolean
}

interface Player extends GameObject {
  speed: number
  health: number
  maxHealth: number
}

interface Enemy extends GameObject {
  speed: number
  type: "basic" | "fast" | "zigzag" | "boss"
  direction: number
  lastShot: number
  health: number
  maxHealth: number
}

interface Bullet extends GameObject {
  speed: number
  isPlayerBullet: boolean
  damage: number
}

interface PowerUp extends GameObject {
  type: "health" | "rapidFire" | "multiShot" | "shield"
  duration?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface GameState {
  score: number
  lives: number
  level: number
  gameOver: boolean
  paused: boolean
  rapidFire: boolean
  multiShot: boolean
  shield: boolean
}

const GAME_CONFIG = {
  canvas: { width: 900, height: 700 },
  player: { width: 40, height: 40, speed: 6 },
  enemy: { width: 30, height: 30, speed: 2 },
  bullet: { width: 6, height: 12, speed: 8 },
  enemyBullet: { width: 5, height: 10, speed: 5 },
}

export default function EnhancedSpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | null>(null)
  const keysRef = useRef<Set<string>>(new Set())
  const shakeRef = useRef({ x: 0, y: 0, intensity: 0 })
  const audioContextRef = useRef<AudioContext | null>(null)

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    paused: false,
    rapidFire: false,
    multiShot: false,
    shield: false,
  })

  const playerRef = useRef<Player>({
    x: GAME_CONFIG.canvas.width / 2 - GAME_CONFIG.player.width / 2,
    y: GAME_CONFIG.canvas.height - 80,
    width: GAME_CONFIG.player.width,
    height: GAME_CONFIG.player.height,
    speed: GAME_CONFIG.player.speed,
    active: true,
    health: 100,
    maxHealth: 100,
  })

  const enemiesRef = useRef<Enemy[]>([])
  const bulletsRef = useRef<Bullet[]>([])
  const enemyBulletsRef = useRef<Bullet[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const particlesRef = useRef<Particle[]>([])
  const lastShotRef = useRef(0)
  const enemySpawnRef = useRef(0)
  const powerUpSpawnRef = useRef(0)

  // Sound effects
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = "square") => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }, [])

  // Screen shake
  const addScreenShake = useCallback((intensity: number) => {
    shakeRef.current.intensity = Math.max(shakeRef.current.intensity, intensity)
  }, [])

  // Particle system
  const addParticles = useCallback((x: number, y: number, count: number, color: string) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 60,
        maxLife: 60,
        color,
        size: Math.random() * 4 + 2,
      })
    }
  }, [])

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      paused: false,
      rapidFire: false,
      multiShot: false,
      shield: false,
    })

    playerRef.current = {
      x: GAME_CONFIG.canvas.width / 2 - GAME_CONFIG.player.width / 2,
      y: GAME_CONFIG.canvas.height - 80,
      width: GAME_CONFIG.player.width,
      height: GAME_CONFIG.player.height,
      speed: GAME_CONFIG.player.speed,
      active: true,
      health: 100,
      maxHealth: 100,
    }

    enemiesRef.current = []
    bulletsRef.current = []
    enemyBulletsRef.current = []
    powerUpsRef.current = []
    particlesRef.current = []
    lastShotRef.current = 0
    enemySpawnRef.current = 0
    powerUpSpawnRef.current = 0
  }, [])

  const spawnEnemy = useCallback(() => {
    const types: Enemy["type"][] = ["basic", "fast", "zigzag"]
    if (gameState.score > 500 && Math.random() < 0.1) types.push("boss")

    const type = types[Math.floor(Math.random() * types.length)]
    const isBoss = type === "boss"

    const enemy: Enemy = {
      x: Math.random() * (GAME_CONFIG.canvas.width - (isBoss ? 60 : GAME_CONFIG.enemy.width)),
      y: -GAME_CONFIG.enemy.height,
      width: isBoss ? 60 : GAME_CONFIG.enemy.width,
      height: isBoss ? 60 : GAME_CONFIG.enemy.height,
      speed: type === "fast" ? 4 : type === "zigzag" ? 2 : isBoss ? 1 : 2.5,
      type,
      direction: Math.random() > 0.5 ? 1 : -1,
      lastShot: 0,
      active: true,
      health: isBoss ? 50 : type === "fast" ? 15 : 20,
      maxHealth: isBoss ? 50 : type === "fast" ? 15 : 20,
    }

    enemiesRef.current.push(enemy)
  }, [gameState.score])

  const spawnPowerUp = useCallback(() => {
    const types: PowerUp["type"][] = ["health", "rapidFire", "multiShot", "shield"]
    const type = types[Math.floor(Math.random() * types.length)]

    const powerUp: PowerUp = {
      x: Math.random() * (GAME_CONFIG.canvas.width - 20),
      y: -20,
      width: 20,
      height: 20,
      active: true,
      type,
      duration: type !== "health" ? 300 : undefined,
    }

    powerUpsRef.current.push(powerUp)
  }, [])

  const checkCollision = useCallback((obj1: GameObject, obj2: GameObject): boolean => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    )
  }, [])

  // Enhanced drawing functions
  const drawPlayer = useCallback(
    (ctx: CanvasRenderingContext2D, player: Player) => {
      const { x, y, width, height } = player

      // Shield effect
      if (gameState.shield) {
        ctx.beginPath()
        ctx.arc(x + width / 2, y + height / 2, width / 2 + 10, 0, Math.PI * 2)
        ctx.strokeStyle = "#00ffff"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Ship body
      ctx.fillStyle = "#00ff00"
      ctx.beginPath()
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(x, y + height)
      ctx.lineTo(x + width / 4, y + height * 0.8)
      ctx.lineTo(x + width * 0.75, y + height * 0.8)
      ctx.lineTo(x + width, y + height)
      ctx.closePath()
      ctx.fill()

      // Engine glow
      ctx.fillStyle = "#0088ff"
      ctx.fillRect(x + width / 4, y + height * 0.8, width / 2, height * 0.2)

      // Cockpit
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(x + width / 2, y + height / 3, 4, 0, Math.PI * 2)
      ctx.fill()

      // Health bar
      const barWidth = width
      const barHeight = 4
      ctx.fillStyle = "#ff0000"
      ctx.fillRect(x, y - 10, barWidth, barHeight)
      ctx.fillStyle = "#00ff00"
      ctx.fillRect(x, y - 10, (player.health / player.maxHealth) * barWidth, barHeight)
    },
    [gameState.shield],
  )

  const drawEnemy = useCallback((ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    const { x, y, width, height, type } = enemy

    let color = "#ff0000"
    if (type === "fast") color = "#ff8800"
    if (type === "zigzag") color = "#ff00ff"
    if (type === "boss") color = "#ff0066"

    if (type === "boss") {
      // Boss design
      ctx.fillStyle = color
      ctx.fillRect(x, y, width, height)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + 10, y + 10, width - 20, height - 20)
      ctx.fillStyle = color
      ctx.fillRect(x + 15, y + 15, width - 30, height - 30)

      // Boss health bar
      const barWidth = width
      const barHeight = 6
      ctx.fillStyle = "#ff0000"
      ctx.fillRect(x, y - 15, barWidth, barHeight)
      ctx.fillStyle = "#ffff00"
      ctx.fillRect(x, y - 15, (enemy.health / enemy.maxHealth) * barWidth, barHeight)
    } else {
      // Regular enemy
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x + width / 2, y + height)
      ctx.lineTo(x, y)
      ctx.lineTo(x + width / 4, y + height / 3)
      ctx.lineTo(x + width * 0.75, y + height / 3)
      ctx.lineTo(x + width, y)
      ctx.closePath()
      ctx.fill()

      // Enemy details
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + width / 3, y + height / 4, 4, 4)
      ctx.fillRect(x + width * 0.6, y + height / 4, 4, 4)
    }
  }, [])

  const gameLoop = useCallback(() => {
    if (gameState.gameOver || gameState.paused) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentTime = Date.now()

    // Update screen shake
    if (shakeRef.current.intensity > 0) {
      shakeRef.current.x = (Math.random() - 0.5) * shakeRef.current.intensity
      shakeRef.current.y = (Math.random() - 0.5) * shakeRef.current.intensity
      shakeRef.current.intensity *= 0.9
      if (shakeRef.current.intensity < 0.1) shakeRef.current.intensity = 0
    }

    // Apply screen shake
    ctx.save()
    ctx.translate(shakeRef.current.x, shakeRef.current.y)

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#000033")
    gradient.addColorStop(1, "#000011")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw animated stars
    ctx.fillStyle = "#ffffff"
    for (let i = 0; i < 150; i++) {
      const x = (i * 37) % canvas.width
      const y = (i * 17 + currentTime * 0.1) % canvas.height
      const size = Math.sin(currentTime * 0.01 + i) * 0.5 + 1
      ctx.globalAlpha = Math.sin(currentTime * 0.005 + i) * 0.5 + 0.5
      ctx.fillRect(x, y, size, size)
    }
    ctx.globalAlpha = 1

    // Handle input
    const player = playerRef.current
    if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) {
      player.x = Math.max(0, player.x - player.speed)
    }
    if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed)
    }
    if (keysRef.current.has("ArrowUp") || keysRef.current.has("w")) {
      player.y = Math.max(0, player.y - player.speed)
    }
    if (keysRef.current.has("ArrowDown") || keysRef.current.has("s")) {
      player.y = Math.min(canvas.height - player.height, player.y + player.speed)
    }

    // Player shooting
    const shotCooldown = gameState.rapidFire ? 80 : 150
    if (
      (keysRef.current.has(" ") || keysRef.current.has("Space")) &&
      currentTime - lastShotRef.current > shotCooldown
    ) {
      lastShotRef.current = currentTime
      playSound(800, 0.1)

      if (gameState.multiShot) {
        // Multi-shot
        for (let i = -1; i <= 1; i++) {
          bulletsRef.current.push({
            x: player.x + player.width / 2 - 3 + i * 15,
            y: player.y,
            width: GAME_CONFIG.bullet.width,
            height: GAME_CONFIG.bullet.height,
            speed: GAME_CONFIG.bullet.speed,
            isPlayerBullet: true,
            active: true,
            damage: 20,
          })
        }
      } else {
        bulletsRef.current.push({
          x: player.x + player.width / 2 - 3,
          y: player.y,
          width: GAME_CONFIG.bullet.width,
          height: GAME_CONFIG.bullet.height,
          speed: GAME_CONFIG.bullet.speed,
          isPlayerBullet: true,
          active: true,
          damage: 20,
        })
      }
    }

    // Spawn enemies
    const spawnRate = Math.max(300, 1000 - gameState.level * 50)
    if (currentTime - enemySpawnRef.current > spawnRate) {
      enemySpawnRef.current = currentTime
      spawnEnemy()
    }

    // Spawn power-ups
    if (currentTime - powerUpSpawnRef.current > 15000) {
      powerUpSpawnRef.current = currentTime
      spawnPowerUp()
    }

    // Update enemies
    enemiesRef.current = enemiesRef.current.filter((enemy) => {
      if (!enemy.active) return false

      enemy.y += enemy.speed

      if (enemy.type === "zigzag") {
        enemy.x += enemy.direction * 3
        if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
          enemy.direction *= -1
        }
      }

      // Enhanced enemy shooting
      const shootChance = enemy.type === "boss" ? 0.02 : 0.008
      if (Math.random() < shootChance && enemy.y > 50) {
        playSound(400, 0.1, "sawtooth")
        enemyBulletsRef.current.push({
          x: enemy.x + enemy.width / 2 - 2,
          y: enemy.y + enemy.height,
          width: GAME_CONFIG.enemyBullet.width,
          height: GAME_CONFIG.enemyBullet.height,
          speed: GAME_CONFIG.enemyBullet.speed,
          isPlayerBullet: false,
          active: true,
          damage: enemy.type === "boss" ? 30 : 10,
        })
      }

      return enemy.y < canvas.height + 50
    })

    // Update power-ups
    powerUpsRef.current = powerUpsRef.current.filter((powerUp) => {
      powerUp.y += 2
      return powerUp.y < canvas.height && powerUp.active
    })

    // Update bullets
    bulletsRef.current = bulletsRef.current.filter((bullet) => {
      bullet.y -= bullet.speed
      return bullet.y > -bullet.height && bullet.active
    })

    enemyBulletsRef.current = enemyBulletsRef.current.filter((bullet) => {
      bullet.y += bullet.speed
      return bullet.y < canvas.height && bullet.active
    })

    // Update particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vx *= 0.98
      particle.vy *= 0.98
      particle.life--
      return particle.life > 0
    })

    // Collision detection - player bullets vs enemies
    bulletsRef.current.forEach((bullet) => {
      enemiesRef.current.forEach((enemy) => {
        if (bullet.active && enemy.active && checkCollision(bullet, enemy)) {
          bullet.active = false
          enemy.health -= bullet.damage

          if (enemy.health <= 0) {
            enemy.active = false
            const points = enemy.type === "boss" ? 100 : enemy.type === "fast" ? 20 : 15
            setGameState((prev) => ({ ...prev, score: prev.score + points }))
            addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15, "#ffaa00")
            addScreenShake(enemy.type === "boss" ? 15 : 5)
            playSound(200, 0.3, "sawtooth")
          } else {
            addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 5, "#ff6600")
          }
        }
      })
    })

    // Collision detection - enemy bullets vs player
    enemyBulletsRef.current.forEach((bullet) => {
      if (bullet.active && checkCollision(bullet, player)) {
        bullet.active = false
        if (!gameState.shield) {
          player.health -= bullet.damage
          addParticles(player.x + player.width / 2, player.y + player.height / 2, 8, "#ff0000")
          addScreenShake(8)
          playSound(150, 0.2)

          if (player.health <= 0) {
            setGameState((prev) => {
              const newLives = prev.lives - 1
              return {
                ...prev,
                lives: newLives,
                gameOver: newLives <= 0,
              }
            })
            player.health = player.maxHealth
          }
        }
      }
    })

    // Collision detection - power-ups vs player
    powerUpsRef.current.forEach((powerUp) => {
      if (powerUp.active && checkCollision(powerUp, player)) {
        powerUp.active = false
        playSound(600, 0.2, "sine")

        switch (powerUp.type) {
          case "health":
            player.health = Math.min(player.maxHealth, player.health + 30)
            break
          case "rapidFire":
            setGameState((prev) => ({ ...prev, rapidFire: true }))
            setTimeout(() => setGameState((prev) => ({ ...prev, rapidFire: false })), 10000)
            break
          case "multiShot":
            setGameState((prev) => ({ ...prev, multiShot: true }))
            setTimeout(() => setGameState((prev) => ({ ...prev, multiShot: false })), 8000)
            break
          case "shield":
            setGameState((prev) => ({ ...prev, shield: true }))
            setTimeout(() => setGameState((prev) => ({ ...prev, shield: false })), 5000)
            break
        }
      }
    })

    // Filter out inactive objects
    bulletsRef.current = bulletsRef.current.filter((b) => b.active)
    enemyBulletsRef.current = enemyBulletsRef.current.filter((b) => b.active)
    enemiesRef.current = enemiesRef.current.filter((e) => e.active)
    powerUpsRef.current = powerUpsRef.current.filter((p) => p.active)

    // Draw everything
    drawPlayer(ctx, player)

    enemiesRef.current.forEach((enemy) => {
      drawEnemy(ctx, enemy)
    })

    // Draw bullets with glow effect
    bulletsRef.current.forEach((bullet) => {
      ctx.shadowColor = "#00ffff"
      ctx.shadowBlur = 10
      ctx.fillStyle = "#00ffff"
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
      ctx.shadowBlur = 0
    })

    enemyBulletsRef.current.forEach((bullet) => {
      ctx.shadowColor = "#ffff00"
      ctx.shadowBlur = 8
      ctx.fillStyle = "#ffff00"
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
      ctx.shadowBlur = 0
    })

    // Draw power-ups
    powerUpsRef.current.forEach((powerUp) => {
      const colors = {
        health: "#00ff00",
        rapidFire: "#ff8800",
        multiShot: "#8800ff",
        shield: "#00ffff",
      }

      ctx.shadowColor = colors[powerUp.type]
      ctx.shadowBlur = 15
      ctx.fillStyle = colors[powerUp.type]
      ctx.beginPath()
      ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.width / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    })

    // Draw particles
    particlesRef.current.forEach((particle) => {
      const alpha = particle.life / particle.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1

    ctx.restore()
    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [
    gameState,
    spawnEnemy,
    spawnPowerUp,
    checkCollision,
    drawPlayer,
    drawEnemy,
    addParticles,
    addScreenShake,
    playSound,
  ])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key)
      if (e.key === "p" || e.key === "P") {
        setGameState((prev) => ({ ...prev, paused: !prev.paused }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!gameState.gameOver && !gameState.paused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameLoop, gameState.gameOver, gameState.paused])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white font-mono relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="absolute top-8 left-8 group inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-sm border border-purple-500 rounded-xl hover:from-purple-500 hover:to-blue-500 hover:scale-105 active:scale-95 transition-all duration-200 z-50 shadow-2xl hover:shadow-purple-500/25"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        BACK TO SPACE
      </button>

      {/* Enhanced HUD */}
      <div className="mb-6 flex gap-8 text-xl font-bold bg-black/30 backdrop-blur-sm px-8 py-4 rounded-2xl border border-purple-500/30">
        <div className="text-center">
          <div className="text-yellow-400">SCORE</div>
          <div className="text-2xl">{gameState.score.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-red-400">LIVES</div>
          <div className="text-2xl flex gap-1">
            {Array.from({ length: gameState.lives }).map((_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>
        </div>
        <div className="text-center">
          <div className="text-blue-400">LEVEL</div>
          <div className="text-2xl">{gameState.level}</div>
        </div>
      </div>

      {/* Power-up indicators */}
      <div className="mb-4 flex gap-4">
        {gameState.rapidFire && (
          <div className="px-3 py-1 bg-orange-600 rounded-full text-sm font-bold animate-pulse">🔥 RAPID FIRE</div>
        )}
        {gameState.multiShot && (
          <div className="px-3 py-1 bg-purple-600 rounded-full text-sm font-bold animate-pulse">⚡ MULTI SHOT</div>
        )}
        {gameState.shield && (
          <div className="px-3 py-1 bg-cyan-600 rounded-full text-sm font-bold animate-pulse">🛡️ SHIELD</div>
        )}
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.canvas.width}
          height={GAME_CONFIG.canvas.height}
          className="border-4 border-purple-500 bg-black rounded-lg shadow-2xl shadow-purple-500/20"
        />

        {gameState.paused && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-6xl mb-4 font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                PAUSED
              </h2>
              <p className="text-xl text-gray-300">Press P to continue</p>
            </div>
          </div>
        )}

        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-6xl mb-6 font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                GAME OVER
              </h2>
              <p className="text-2xl mb-6 text-yellow-400">Final Score: {gameState.score.toLocaleString()}</p>
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold text-xl border-2 border-green-400 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                🚀 PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced controls */}
      <div className="mt-6 text-center bg-black/30 backdrop-blur-sm px-8 py-4 rounded-2xl border border-purple-500/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <span className="text-green-400 font-bold">WASD / ARROWS</span>
            <div className="text-gray-300">Move Ship</div>
          </div>
          <div>
            <span className="text-cyan-400 font-bold">SPACE</span>
            <div className="text-gray-300">Fire Weapons</div>
          </div>
          <div>
            <span className="text-yellow-400 font-bold">P</span>
            <div className="text-gray-300">Pause Game</div>
          </div>
          <div>
            <span className="text-purple-400 font-bold">POWER-UPS</span>
            <div className="text-gray-300">Collect Orbs</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-400 text-center max-w-2xl bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl">
        <div className="grid grid-cols-2 gap-2">
          <div>🟢 Health • 🟠 Rapid Fire • 🟣 Multi Shot • 🔵 Shield</div>
          <div>🔴 Basic • 🟠 Fast • 🟣 Zigzag • 💖 Boss Enemies</div>
        </div>
      </div>
    </div>
  )
}
