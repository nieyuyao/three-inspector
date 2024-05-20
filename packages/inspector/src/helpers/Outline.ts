import {
  EventDispatcher,
  Mesh,
  WebGLRenderer,
  PerspectiveCamera,
  OrthographicCamera,
  ShaderMaterial,
  Color,
  WebGLRenderTarget,
  Vector2,
  Float32BufferAttribute,
  BufferGeometry,
} from 'three'

type Camera = PerspectiveCamera | OrthographicCamera

interface Options {
  color: number
}

const DEFAULT_OPTIONS: Options = {
  color: 0xFFD700,
}

class FullScreen extends Mesh<BufferGeometry, ShaderMaterial> {
  constructor() {
    super()
    const geometry = new BufferGeometry()
    geometry.setAttribute(
      'position',
      new Float32BufferAttribute([1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0], 3)
    )
    geometry.setAttribute('uv', new Float32BufferAttribute([1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0], 2))
    this.geometry = geometry

    this.material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        maskTexture: { value: null },
        texSize: { value: new Vector2() },
        color: { value: new Color()}
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0., 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D maskTexture;
        uniform vec2 texSize;
        uniform vec3 color;
        void main() {
          vec4 texelColor = texture2D(maskTexture, vUv);
          vec2 invSize = 1.0 / texSize;
          vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);
          vec4 c1 = texture2D(maskTexture, vUv + uvOffset.xy);
					vec4 c2 = texture2D(maskTexture, vUv - uvOffset.xy);
					vec4 c3 = texture2D(maskTexture, vUv + uvOffset.yw);
					vec4 c4 = texture2D(maskTexture, vUv - uvOffset.yw);
          float diff1 = (c1.a - c2.a) * 0.5;
					float diff2 = (c3.a - c4.a) * 0.5;
					float d = length(vec2(diff1, diff2));
          gl_FragColor = vec4(color, smoothstep(0.001, 0.2, d));
        }
      `,
    })
  }
}

export class Outline extends EventDispatcher {
  private target: Mesh

  private object: Mesh

  private options: Options

  private rt = new WebGLRenderTarget()

  private fs = new FullScreen()

  constructor(object: Mesh, options?: Partial<Options>) {
    super()
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    }
    this.object = object
    this.target = this.copyObject(object)
  }

  private copyObject(object: Mesh) {
    const { options } = this
    const bufGeo = object.geometry.toNonIndexed()
    const mat = new ShaderMaterial({
      transparent: true,
      uniforms: {
        color: { value: new Color().setHex(options.color) },
        modelViewMat: { value: object.modelViewMatrix }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform mat4 modelViewMat;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMat * vec4(position, 1.0);
        }
        `,
      fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(0., 0., 0, 1.);
        }
      `,
    })
    const target = new Mesh(bufGeo, mat)
    target.position.copy(object.position)
    return target
  }

  render(renderer: WebGLRenderer, camera: Camera) {
    const userAutoClearSetting = renderer.autoClear
    const userClearColor = renderer.clearColor
    const userClearAlpha = renderer.getClearAlpha()
    renderer.autoClear = false
    const mat = this.target.material as ShaderMaterial
    mat.uniforms.modelViewMat.value = this.object.modelViewMatrix

    //
    const size = renderer.getSize(new Vector2())
    this.rt.setSize(size.width, size.height)
    renderer.setRenderTarget(this.rt)
    renderer.setClearAlpha(0)
    renderer.clear()
    renderer.render(this.target, camera)

    this.fs.material.uniforms.maskTexture.value = this.rt.texture
    this.fs.material.uniforms.texSize.value = new Vector2(size.width, size.height)
    this.fs.material.uniforms.color.value = new Color().setHex(this.options.color)
    renderer.setRenderTarget(null)
    renderer.render(this.fs, camera)
    //
    renderer.autoClear = userAutoClearSetting
    renderer.clearColor = userClearColor
    renderer.setClearAlpha(userClearAlpha)
  }

  dispose() {
    this.target.geometry.dispose()
    // @ts-ignore
    this.target.material.dispose()
    this.rt.dispose()
  }
}
