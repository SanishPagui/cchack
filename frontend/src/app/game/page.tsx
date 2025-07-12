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
}

interface Enemy extends GameObject {
  speed: number
  type: "basic" | "fast" | "zigzag"
  direction: number
  lastShot: number
}

interface Bullet extends GameObject {
  speed: number
  isPlayerBullet: boolean
}

interface GameState {
  score: number
  lives: number
  level: number
  gameOver: boolean
  paused: boolean
}

const GAME_CONFIG = {
  canvas: { width: 800, height: 600 },
  player: { width: 30, height: 30, speed: 5 },
  enemy: { width: 25, height: 25, speed: 2 },
  bullet: { width: 4, height: 10, speed: 7 },
  enemyBullet: { width: 4, height: 8, speed: 4 },
}

export default function RetroSpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const keysRef = useRef<Set<string>>(new Set())

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    paused: false,
  })

  const playerRef = useRef<Player>({
    x: GAME_CONFIG.canvas.width / 2 - GAME_CONFIG.player.width / 2,
    y: GAME_CONFIG.canvas.height - 60,
    width: GAME_CONFIG.player.width,
    height: GAME_CONFIG.player.height,
    speed: GAME_CONFIG.player.speed,
    active: true,
  })

  const enemiesRef = useRef<Enemy[]>([])
  const bulletsRef = useRef<Bullet[]>([])
  const enemyBulletsRef = useRef<Bullet[]>([])
  const lastShotRef = useRef(0)
  const enemySpawnRef = useRef(0)

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      paused: false,
    })

    playerRef.current = {
      x: GAME_CONFIG.canvas.width / 2 - GAME_CONFIG.player.width / 2,
      y: GAME_CONFIG.canvas.height - 60,
      width: GAME_CONFIG.player.width,
      height: GAME_CONFIG.player.height,
      speed: GAME_CONFIG.player.speed,
      active: true,
    }

    enemiesRef.current = []
    bulletsRef.current = []
    enemyBulletsRef.current = []
    lastShotRef.current = 0
    enemySpawnRef.current = 0
  }, [])

  const spawnEnemy = useCallback(() => {
    const types: Enemy["type"][] = ["basic", "fast", "zigzag"]
    const type = types[Math.floor(Math.random() * types.length)]

    const enemy: Enemy = {
      x: Math.random() * (GAME_CONFIG.canvas.width - GAME_CONFIG.enemy.width),
      y: -GAME_CONFIG.enemy.height,
      width: GAME_CONFIG.enemy.width,
      height: GAME_CONFIG.enemy.height,
      speed: type === "fast" ? 3 : type === "zigzag" ? 1.5 : 2,
      type,
      direction: Math.random() > 0.5 ? 1 : -1,
      lastShot: 0,
      active: true,
    }

    enemiesRef.current.push(enemy)
  }, [])

  const checkCollision = useCallback((obj1: GameObject, obj2: GameObject): boolean => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    )
  }, [])

  const gameLoop = useCallback(() => {
    if (gameState.gameOver || gameState.paused) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentTime = Date.now()

    // Clear canvas
    ctx.fillStyle = "#000011"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw stars
    ctx.fillStyle = "#ffffff"
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % canvas.width
      const y = (i * 17 + currentTime * 0.05) % canvas.height
      ctx.fillRect(x, y, 1, 1)
    }

    // Handle input
    const player = playerRef.current
    if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) {
      player.x = Math.max(0, player.x - player.speed)
    }
    if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed)
    }
    if (keysRef.current.has("ArrowUp") || keysRef.current.has("w")) {
      player.y = Math.max(canvas.height / 2, player.y - player.speed)
    }
    if (keysRef.current.has("ArrowDown") || keysRef.current.has("s")) {
      player.y = Math.min(canvas.height - player.height, player.y + player.speed)
    }

    // Player shooting
    if ((keysRef.current.has(" ") || keysRef.current.has("Space")) && currentTime - lastShotRef.current > 150) {
      lastShotRef.current = currentTime
      bulletsRef.current.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: GAME_CONFIG.bullet.width,
        height: GAME_CONFIG.bullet.height,
        speed: GAME_CONFIG.bullet.speed,
        isPlayerBullet: true,
        active: true,
      })
    }

    // Spawn enemies
    if (currentTime - enemySpawnRef.current > 1000 - gameState.level * 50) {
      enemySpawnRef.current = currentTime
      spawnEnemy()
    }

    // Update enemies
    enemiesRef.current = enemiesRef.current.filter((enemy) => {
      if (!enemy.active) return false

      // Move enemy
      enemy.y += enemy.speed

      if (enemy.type === "zigzag") {
        enemy.x += enemy.direction * 2
        if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
          enemy.direction *= -1
        }
      }

      // Enemy shooting
      if (Math.random() < 0.005 && enemy.y > 50) {
        enemyBulletsRef.current.push({
          x: enemy.x + enemy.width / 2 - 2,
          y: enemy.y + enemy.height,
          width: GAME_CONFIG.enemyBullet.width,
          height: GAME_CONFIG.enemyBullet.height,
          speed: GAME_CONFIG.enemyBullet.speed,
          isPlayerBullet: false,
          active: true,
        })
      }

      // Remove if off screen
      if (enemy.y > canvas.height) {
        return false
      }

      return true
    })

    // Update bullets
    bulletsRef.current = bulletsRef.current.filter((bullet) => {
      bullet.y -= bullet.speed
      return bullet.y > -bullet.height
    })

    enemyBulletsRef.current = enemyBulletsRef.current.filter((bullet) => {
      bullet.y += bullet.speed
      return bullet.y < canvas.height
    })

    // Collision detection - player bullets vs enemies
    bulletsRef.current.forEach((bullet) => {
      enemiesRef.current.forEach((enemy) => {
        if (checkCollision(bullet, enemy)) {
          bullet.active = false
          enemy.active = false
          setGameState((prev) => ({ ...prev, score: prev.score + 10 }))
        }
      })
    })

    // Collision detection - enemy bullets vs player
    enemyBulletsRef.current.forEach((bullet) => {
      if (checkCollision(bullet, player)) {
        bullet.active = false
        setGameState((prev) => {
          const newLives = prev.lives - 1
          return {
            ...prev,
            lives: newLives,
            gameOver: newLives <= 0,
          }
        })
      }
    })

    // Collision detection - enemies vs player
    enemiesRef.current.forEach((enemy) => {
      if (checkCollision(enemy, player)) {
        enemy.active = false
        setGameState((prev) => {
          const newLives = prev.lives - 1
          return {
            ...prev,
            lives: newLives,
            gameOver: newLives <= 0,
          }
        })
      }
    })

    // Filter out inactive objects
    bulletsRef.current = bulletsRef.current.filter((b) => b.active)
    enemyBulletsRef.current = enemyBulletsRef.current.filter((b) => b.active)
    enemiesRef.current = enemiesRef.current.filter((e) => e.active)

    // Draw player
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(player.x, player.y, player.width, player.height)

    // Draw player details
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(player.x + 5, player.y + 5, 5, 5)
    ctx.fillRect(player.x + 20, player.y + 5, 5, 5)
    ctx.fillRect(player.x + 12, player.y - 5, 6, 8)

    // Draw enemies
    enemiesRef.current.forEach((enemy) => {
      switch (enemy.type) {
        case "basic":
          ctx.fillStyle = "#ff0000"
          break
        case "fast":
          ctx.fillStyle = "#ff8800"
          break
        case "zigzag":
          ctx.fillStyle = "#ff00ff"
          break
      }
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)

      // Enemy details
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(enemy.x + 5, enemy.y + 5, 3, 3)
      ctx.fillRect(enemy.x + 17, enemy.y + 5, 3, 3)
    })

    // Draw bullets
    ctx.fillStyle = "#00ffff"
    bulletsRef.current.forEach((bullet) => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    })

    ctx.fillStyle = "#ffff00"
    enemyBulletsRef.current.forEach((bullet) => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    })

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState.gameOver, gameState.paused, gameState.level, spawnEnemy, checkCollision])

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
      <div className="mb-4 flex gap-8 text-xl">
        <div>Score: {gameState.score}</div>
        <div>Lives: {gameState.lives}</div>
        <div>Level: {gameState.level}</div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.canvas.width}
          height={GAME_CONFIG.canvas.height}
          className="border-2 border-gray-600 bg-black"
        />

        {gameState.paused && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl mb-4">PAUSED</h2>
              <p>Press P to continue</p>
            </div>
          </div>
        )}

        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl mb-4">GAME OVER</h2>
              <p className="text-xl mb-4">Final Score: {gameState.score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold border-2 border-green-400"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm">
        <div className="mb-2">
          <span className="text-green-400">WASD</span> or <span className="text-green-400">Arrow Keys</span>: Move
        </div>
        <div className="mb-2">
          <span className="text-cyan-400">SPACE</span>: Shoot
        </div>
        <div>
          <span className="text-yellow-400">P</span>: Pause
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center max-w-md">
        <div className="mb-1">🟢 Green: Your Ship</div>
        <div className="mb-1">🔴 Red: Basic Enemy | 🟠 Orange: Fast Enemy | 🟣 Purple: Zigzag Enemy</div>
        <div>🔵 Cyan: Your Bullets | 🟡 Yellow: Enemy Bullets</div>
      </div>
    </div>
  )
}
