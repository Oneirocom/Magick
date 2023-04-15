import React, { useContext, useEffect } from "react"
import * as THREE from "three"
import { SceneContext } from "./SceneContext"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CAMERA_TO_PLANE_DISTANCE, PLANE_COLOR, PLANE_HEIGHT, raycaster, tempColor, tempVec2 } from "../library/constants"
import { getBone, getCameraFovToFitScreen } from "../library/common"

let isFirstRender = true
let prevCharacterModel = null

export default function Scene({ characterModel }) {
  const { scene, setCamera } = useContext(SceneContext)

  useEffect(() => {

    if (isFirstRender) {
      // add a camera to the scene
      const camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      )
      setCamera(camera)

      // find editor-scene canvas
      const canvasRef = document.createElement("canvas")
      canvasRef.id = "editor-scene"
      canvasRef.style.visibility = 'visible'
      canvasRef.style.position = "absolute"
      canvasRef.style.top = "0"
      canvasRef.style.left = "0"
      canvasRef.style.width = "100%"
      canvasRef.style.height = "100%"
      document.body.appendChild(canvasRef)

      // create a new renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      })

      const handleWindowResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        // TODO(Demon): Resize plane width and height
      }

      // add an eventlistener to resize the canvas when window changes
      window.addEventListener("resize", handleWindowResize)

      // set the renderer size
      renderer.setSize(window.innerWidth, window.innerHeight)

      // set the renderer pixel ratio
      renderer.setPixelRatio(window.devicePixelRatio)

      // set the renderer output encoding
      renderer.outputEncoding = THREE.sRGBEncoding

      // To test easily
      const orbitControls = new OrbitControls(camera, renderer.domElement)
      // TODO(Demon): Set plane position and rotation dynamically when enabling the following options
      camera.position.set(.4, 1.2, 2)
      orbitControls.target.set(.4, 1.2, 2)
      // orbitControls.enableZoom = false
      // orbitControls.enableRotate = false
      // orbitControls.enablePan = false

      // Add plane
      const planeWidth = camera.aspect * PLANE_HEIGHT
      const planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(planeWidth, PLANE_HEIGHT),
        new THREE.MeshStandardMaterial({
          color: tempColor.clone().set(PLANE_COLOR),
          transparent: true,
          opacity: 0,
        })
      )
      planeMesh.position.copy(camera.position.clone().setZ(camera.position.z - CAMERA_TO_PLANE_DISTANCE))
      camera.fov = getCameraFovToFitScreen(CAMERA_TO_PLANE_DISTANCE * 0.8, PLANE_HEIGHT)
      camera.updateProjectionMatrix()
      scene.add(planeMesh)

      // Ray casting
      const pointer = tempVec2.clone().set(0, 0)
      let intersection

      const updatePointer = (event) => {
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = (((event.clientX - rect.left) / rect.width) * 2) - 1
        pointer.y = ((-(event.clientY - rect.top) / rect.height) * 2) + 1
      }

      const updateIntersectPoint = () => {
        const intersections = []
        raycaster.setFromCamera(pointer, camera)
        raycaster.intersectObjects([planeMesh], true, intersections)
        if (intersections.length > 0) {
          intersection = intersections[0]
        } else {
          intersection = undefined
        }
      }

      const lookAtPointer = (bone, pointer) => {
        const direcVec = bone.position.clone().sub(pointer.clone())
        const target = bone.position.clone().add(direcVec.clone())
        target.y += 2.25
        bone.lookAt(target.clone())
      }

      const headBone = getBone(characterModel, 'head')
      const leftEyeBone = getBone(characterModel, 'leftEye')
      const rightEyeBone = getBone(characterModel, 'rightEye')

      const handleMouseMove = (event) => {
        updatePointer(event)
        updateIntersectPoint()
        if (intersection && headBone) {
          lookAtPointer(headBone, intersection.point.clone())
          lookAtPointer(leftEyeBone, intersection.point.clone())
          lookAtPointer(rightEyeBone, intersection.point.clone())
        } else {
          lookAtPointer(headBone, planeMesh.position.clone())
          lookAtPointer(leftEyeBone, planeMesh.position.clone())
          lookAtPointer(rightEyeBone, planeMesh.position.clone())
        }
      }

      // window.addEventListener("mousemove", handleMouseMove)

      // start animation frame loop to render
      const animate = () => {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        orbitControls.update()
      }

      // start the animation loop
      animate()
    }

    {
      if (prevCharacterModel && prevCharacterModel !== characterModel) {
        scene.remove(prevCharacterModel.scene)
      }

      // characterModel.scene.traverse((child) => {
      //   if (child.type === 'Bone') {
      //     if (child.name === 'neck') {
      //       child.add(new THREE.AxesHelper(10))
      //       child.parent.add(new THREE.AxesHelper(10))
      //     }
      //   }
      // })

      // characterModel.scene.rotation.y = Math.PI

      scene.add(characterModel.scene)
    }

    prevCharacterModel = characterModel
    isFirstRender = false

    return () => {
      // if there is a div with id "editor-scene", remove it
      const canvasRef = document.getElementById("editor-scene")

      //initial component when component unmount
      isFirstRender = true;
      if (canvasRef) {
        canvasRef.style.display = 'none'
        scene.remove(prevCharacterModel.scene)
      }
    }
  }, [characterModel])

  return <></>
}
