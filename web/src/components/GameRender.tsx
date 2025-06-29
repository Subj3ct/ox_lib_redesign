import React, { useEffect, useRef, useState } from 'react'

const vertexShaderSrc = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 textureCoordinate;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  textureCoordinate = a_texcoord;
}
`

const fragmentShaderSrc = `
varying highp vec2 textureCoordinate;
uniform sampler2D external_texture;
void main()
{
  gl_FragColor = texture2D(external_texture, textureCoordinate);
}
`

// Global variables for render state
let gameRenderInstance: any = null
let visibleUICount = 0
let isRenderingActive = false

const makeShader = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  const infoLog = gl.getShaderInfoLog(shader)

  if (infoLog) {
    console.error('Shader compilation error:', infoLog)
  }

  return shader
}

const createTexture = (gl: WebGLRenderingContext) => {
  const tex = gl.createTexture()!
  const texPixels = new Uint8Array([0, 0, 255, 255])

  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, texPixels)

  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

  // Magic hook sequence for FiveM - this is critical!
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  return tex
}

const createBuffers = (gl: WebGLRenderingContext) => {
  const vertexBuff = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  const texBuff = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuff)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW)

  return { vertexBuff, texBuff }
}

const createProgram = (gl: WebGLRenderingContext) => {
  const vertexShader = makeShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fragmentShader = makeShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)

  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program))
  }

  gl.useProgram(program)

  const vloc = gl.getAttribLocation(program, 'a_position')
  const tloc = gl.getAttribLocation(program, 'a_texcoord')

  return { program, vloc, tloc }
}

const createGameView = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: false,
    desynchronized: true,
    failIfMajorPerformanceCaveat: false,
  }) as WebGLRenderingContext

  if (!gl) {
    throw new Error('WebGL not supported')
  }

  let render = () => {}
  let lastFrameTime = 0
  const targetFrameTime = 1000 / 45 // Reduced to 45 FPS for better performance

  function createStuff() {
    const tex = createTexture(gl)
    const { program, vloc, tloc } = createProgram(gl)
    const { vertexBuff, texBuff } = createBuffers(gl)

    gl.useProgram(program)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.uniform1i(gl.getUniformLocation(program, 'external_texture'), 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff)
    gl.vertexAttribPointer(vloc, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vloc)

    gl.bindBuffer(gl.ARRAY_BUFFER, texBuff)
    gl.vertexAttribPointer(tloc, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(tloc)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  }

  const gameView = {
    canvas,
    gl,
    animationFrame: undefined as number | undefined,
    isRendering: false,
    resize: (width: number, height: number) => {
      gl.viewport(0, 0, width, height)
      gl.canvas.width = width
      gl.canvas.height = height
    },
    startRendering: () => {
      if (!gameView.isRendering) {
        gameView.isRendering = true
        lastFrameTime = 0
        render()
      }
    },
    stopRendering: () => {
      gameView.isRendering = false
      
      // Cancel animation frame immediately to prevent race conditions
      if (gameView.animationFrame) {
        cancelAnimationFrame(gameView.animationFrame)
        gameView.animationFrame = undefined
      }
      
      // Add gl.finish() only when stopping to prevent screen tearing
      try {
        if (gl && !gl.isContextLost()) {
          gl.finish() // Ensures all rendering commands complete - prevents tearing
        }
      } catch (error) {
        // Silently handle stop rendering warnings
      }
    }
  }

  render = (currentTime?: number) => {
    // Critical safety check - exit immediately if not rendering
    if (!gameView.isRendering) {
      gameView.animationFrame = undefined
      return
    }

    // Frame limiting for performance
    if (currentTime && currentTime - lastFrameTime < targetFrameTime) {
      gameView.animationFrame = requestAnimationFrame(render)
      return
    }
    
    if (currentTime) {
      lastFrameTime = currentTime
    }

    try {
      // Safety check before WebGL operations
      if (gl && !gl.isContextLost() && gameView.isRendering) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        // NO gl.finish() here - only when stopping to prevent tearing
      }
    } catch (error) {
      // Silently handle render errors
      gameView.stopRendering()
      return
    }

    // Only request next frame if still rendering
    if (gameView.isRendering) {
      gameView.animationFrame = requestAnimationFrame(render)
    }
  }

  createStuff()

  return gameView
}

// Function to register/unregister UI visibility
export const registerUIVisibility = (componentName: string = 'Unknown') => {
  visibleUICount++
  
  // Start rendering when first UI becomes visible
  if (visibleUICount === 1 && gameRenderInstance && !isRenderingActive) {
    gameRenderInstance.startRendering()
    isRenderingActive = true
  }
}

export const unregisterUIVisibility = (componentName: string = 'Unknown') => {
  visibleUICount = Math.max(0, visibleUICount - 1)
  
  // Stop rendering when no UI is visible
  if (visibleUICount === 0 && gameRenderInstance && isRenderingActive) {
    gameRenderInstance.stopRendering()
    isRenderingActive = false
  }
}

// Hook for components that use glassmorphism - now with proper visibility tracking
export const useGlassmorphism = (componentName: string = 'Unknown') => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    registerUIVisibility(componentName)
    setIsVisible(true)

    return () => {
      unregisterUIVisibility(componentName)
      setIsVisible(false)
    }
  }, [componentName])

  return isVisible
}

// New conditional glassmorphism hook - only registers when condition is true
export const useConditionalGlassmorphism = (condition: boolean, componentName: string = 'Unknown') => {
  const [isVisible, setIsVisible] = useState(false)
  const registeredRef = useRef(false)

  useEffect(() => {
    if (condition && !registeredRef.current) {
      registerUIVisibility(componentName)
      registeredRef.current = true
      setIsVisible(true)
    } else if (!condition && registeredRef.current) {
      unregisterUIVisibility(componentName)
      registeredRef.current = false
      setIsVisible(false)
    }
  }, [condition, componentName])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (registeredRef.current) {
        unregisterUIVisibility(componentName)
        registeredRef.current = false
      }
    }
  }, [componentName])

  return isVisible
}

export const GameRender: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shouldShowCanvas, setShouldShowCanvas] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      try {
        gameRenderInstance = createGameView(canvasRef.current)
        
        const handleResize = () => {
          if (canvasRef.current && gameRenderInstance) {
            gameRenderInstance.resize(window.innerWidth, window.innerHeight)
          }
        }

        window.addEventListener('resize', handleResize)
        
        return () => {
          window.removeEventListener('resize', handleResize)
          if (gameRenderInstance) {
            gameRenderInstance.stopRendering()
            gameRenderInstance = null
            isRenderingActive = false
            visibleUICount = 0
          }
        }
      } catch (error) {
        // Silently handle initialization errors
      }
    }
  }, [])

  // Monitor rendering state 
  useEffect(() => {
    let animationFrameId: number
    
    const checkRenderingState = () => {
      const currentState = isRenderingActive
      if (currentState !== shouldShowCanvas) {
        setShouldShowCanvas(currentState)
        // Canvas visibility changed
      }
      
      animationFrameId = requestAnimationFrame(checkRenderingState)
    }
    
    checkRenderingState()
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [shouldShowCanvas])

  return (
    <div style={{ 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      pointerEvents: 'none',
      userSelect: 'none',
      touchAction: 'none',
      // Hide canvas when not rendering - prevents frozen game view
      display: shouldShowCanvas ? 'block' : 'none'
    }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ 
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
    </div>
  )
} 