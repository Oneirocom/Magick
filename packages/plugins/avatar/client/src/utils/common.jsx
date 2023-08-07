import * as THREE from 'three'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import { assertDefined } from './custom.assert'


export const getRandomFromCenter = (size) => {
  assertDefined(size)
  const halfSize = size / 2
  const random = halfSize - (Math.random() * size)
  return random
}


export const getFileExtension = (path) => {
  assertDefined(path)
  const fileExtension = path.split('.').pop()?.toLowerCase()
  return fileExtension
}


export const getModelType = (path) => {
  assertDefined(path)
  const fileExtension = getFileExtension(path)

  switch (fileExtension) {
    case 'fbx':
      return 'fbx'
    case 'glb':
    case 'gltf':
      return 'gltf'
    default:
      break
  }
}


export const deepClone = (obj) => {
  assertDefined(obj)
  const clonedObj = JSON.parse(JSON.stringify(obj))
  return clonedObj
}


export const getDimensions = (threeObj) => {
  assertDefined(threeObj)
  threeObj.traverse((child) => {
    if (child.isMesh && child.geometry.isBufferGeometry) {
      child.geometry.computeBoundingBox()
    }
  })
  const box3 = new THREE.Box3().setFromObject(threeObj)
  return {
    width: box3.max.x - box3.min.x,
    height: box3.max.y - box3.min.y,
    length: box3.max.z - box3.min.z,
  }
}


export const mergeModelMeshes = (model, customMaterial) => {
  assertDefined(model)
  const bufferGeometries = []
  const materials = []
  const matrix4 = new THREE.Matrix4()

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry?.isBufferGeometry) {
        matrix4.compose(child.position, child.quaternion, child.scale)
        child.geometry.applyMatrix4(matrix4)
        bufferGeometries.push(child.geometry)
      }

      if (child.material?.isMaterial) {
        materials.push(child.material)
      }
    }
  })

  const material = customMaterial ? customMaterial : materials
  const useGroups = Array.isArray(material)
  const mergedBufferGeometry = mergeBufferGeometries(bufferGeometries, useGroups)
  mergedBufferGeometry.computeBoundingBox()
  const mergedMesh = new THREE.Mesh(mergedBufferGeometry, material)
  return mergedMesh
}
