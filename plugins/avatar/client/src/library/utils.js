import * as THREE from "three";

export function getAsArray(target) {
  if (target == null) return []
  return Array.isArray(target) ? target : [target]
}

//make sure to remove this data when downloading, as this data is only required while in edit mode
export function addModelData(model, data) {
  if (model.data == null)
    model.data = data;

  else
    model.data = { ...model.data, ...data };
}
function getModelProperty(model, property) {
  if (model.data == null)
    return;

  return model.data[property];
}

export function disposeVRM(vrm) {
  const model = vrm.scene;
  const animationControl = (getModelProperty(vrm, "animationControl"));
  if (animationControl)
    animationControl.dispose();

  model.traverse((o) => {
    if (o.geometry) {
      o.geometry.dispose();
    }

    if (o.material) {
      if (o.material.length) {
        for (let i = 0; i < o.material.length; ++i) {
          o.material[i].dispose();
        }
      }
      else {
        o.material.dispose();
      }
    }
  });

  if (model.parent) {
    model.parent.remove(model);
  }
}
export const createFaceNormals = (geometry) => {
  const pos = geometry.attributes.position;
  const idx = geometry.index;

  const tri = new THREE.Triangle(); // for re-use
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(); // for re-use

  const faceNormals = [];

  //set foreach vertex
  for (let f = 0; f < (idx.array.length / 3); f++) {
    const idxBase = f * 3;
    a.fromBufferAttribute(pos, idx.getX(idxBase + 0));
    b.fromBufferAttribute(pos, idx.getX(idxBase + 1));
    c.fromBufferAttribute(pos, idx.getX(idxBase + 2));
    tri.set(a, b, c);
    faceNormals.push(tri.getNormal(new THREE.Vector3()));
  }
  geometry.userData.faceNormals = faceNormals;
};
export const createBoneDirection = (skinMesh) => {
  const geometry = skinMesh.geometry;

  const pos = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;

  // set by jumps of 4
  const bnIdx = geometry.attributes.skinIndex.array;
  const bnWeight = geometry.attributes.skinWeight.array;

  const boneDirections = [];

  const boneTargetPos = new THREE.Vector3(); // to reuse
  const vertexPosition = new THREE.Vector3(); // to reuse

  // bones arrangement:
  // 0 vertical (x,z) bone,
  // 1 horizontal (y,z) bone
  // 2 all sides (x,y,z) bone,
  const bonesArrange = [];
  for (let i = 0; i < skinMesh.skeleton.bones.length; i++) {
    if (skinMesh.skeleton.bones[i].name.includes("Shoulder")) {
      bonesArrange[i] = 3;
    }
    else if (skinMesh.skeleton.bones[i].name.includes("Arm") ||
      skinMesh.skeleton.bones[i].name.includes("Hand") ||
      skinMesh.skeleton.bones[i].name.includes("Index") ||
      skinMesh.skeleton.bones[i].name.includes("Little") ||
      skinMesh.skeleton.bones[i].name.includes("Middle") ||
      skinMesh.skeleton.bones[i].name.includes("Ring") ||
      skinMesh.skeleton.bones[i].name.includes("Thumb"))
      bonesArrange[i] = 1;

    // else if (skinMesh.skeleton.bones[i].name.includes("Foot") || 
    //       skinMesh.skeleton.bones[i].name.includes("Toes"))
    //   bonesArrange[i] = 3; 
    else if (skinMesh.skeleton.bones[i].name.includes("Foot") ||
      skinMesh.skeleton.bones[i].name.includes("Toes"))
      bonesArrange[i] = 3;

    else
      bonesArrange[i] = 0;
  }

  for (let f = 0; f < (bnIdx.length / 4); f++) {
    const idxBnBase = f * 4;
    // get the highest weight value
    let highIdx = bnIdx[idxBnBase];
    for (let i = 0; i < 4; i++) {
      if (bnWeight[highIdx] < bnWeight[idxBnBase + i]) {
        highIdx = bnIdx[idxBnBase + i];
      }
    }
    //once we have the highest value, we get the bone position to later get the direction
    // now get the vertex 
    const idxPosBase = f * 3;
    vertexPosition.set(
      pos[idxPosBase],
      pos[idxPosBase + 1],
      pos[idxPosBase + 2] //z
    );

    // get the position of the bones, but ignore y or z in some cases, as this will be dfined by the vertex positioning
    switch (bonesArrange[highIdx]) {
      case 0: // 0 vertical (x,z) bone,
        boneTargetPos.set(
          skinMesh.skeleton.bones[highIdx].getWorldPosition(new THREE.Vector3()).x,
          vertexPosition.y,
          skinMesh.skeleton.bones[highIdx].getWorldPosition(new THREE.Vector3()).z);
        break;
      case 1: // 1 horizontal (y,z) bone
        boneTargetPos.set(
          vertexPosition.x,
          //skinMesh.skeleton.bones[highIdx].getWorldPosition(new THREE.Vector3()).x,
          skinMesh.skeleton.bones[highIdx].getWorldPosition(new THREE.Vector3()).y,
          skinMesh.skeleton.bones[highIdx].getWorldPosition(new THREE.Vector3()).z);
        //vertexPosition.z);
        break;
      case 2: // 2 all sides (x,y,z) bone,
        boneTargetPos.set(
          skinMesh.skeleton.bones[highIdx].getWorldPosition(new THREE.Vector3()).x,
          skinMesh.skeleton.bones[highIdx].getWorldPosition(new THREE.Vector3()).y,
          skinMesh.skeleton.bones[highIdx].getWorldPosition(new THREE.Vector3()).z);

        break;
      case 3: //
        //nothing, the direction will be taken from vertex normals
        break;
      default:
        break;
    }

    // calculate the direction from  *boneTargetPos to *vertexPosition
    const dir = new THREE.Vector3();
    if (bonesArrange[highIdx] !== 3)
      dir.subVectors(vertexPosition, boneTargetPos).normalize();

    else
      dir.set(
        normals[idxPosBase],
        normals[idxPosBase + 1],
        normals[idxPosBase + 2]); //z

    //we have now the direction from the vertex to the bone
    boneDirections.push(dir);
  }
  geometry.userData.boneDirections = boneDirections;
};
export const renameVRMBones = (vrm) => {
  const bones = vrm.humanoid.humanBones;
  for (const boneName in bones) {
    bones[boneName].node.name = boneName;
  }
};

export function findChild({ candidates, predicate }) {
    if (!candidates.length) {
        return null;
    }
    const candidate = candidates.shift();
    if (predicate(candidate))
        return candidate;
    candidates = candidates.concat(candidate.children);
    return findChild({ candidates, predicate });
}
export function findChildByName(root, name) {
    return findChild({
        candidates: [root],
        predicate: (o) => o.name === name,
    });
}
export function findChildByType(root, type) {
    return findChild({
        candidates: [root],
        predicate: (o) => o.type === type,
    });
}
function findChildren({ candidates, predicate, results = [] }) {
    if (!candidates.length) {
        return results;
    }
    const candidate = candidates.shift();
    if (predicate(candidate)) {
        results.push(candidate);
    }
    candidates = candidates.concat(candidate.children);
    return findChildren({ candidates, predicate, results });
}
export function findChildrenByType(root, type) {
    return findChildren({
        candidates: [root],
        predicate: (o) => o.type === type,
    });
}
export function getAvatarData (avatarModel, modelName){
  const skinnedMeshes = findChildrenByType(avatarModel, "SkinnedMesh")
  return{
    humanBones:getHumanoidByBoneNames(skinnedMeshes[0]),
    materials : [avatarModel.userData.atlasMaterial],
    meta : getVRMMeta(modelName)
  }

}


function getVRMMeta(name){
  return {
    authors:["Webaverse"],
    metaVersion:"1",
    version:"v1",
    name:name,
    licenseUrl:"https://vrm.dev/licenses/1.0/",
    commercialUssageName: "personalNonProfit",
    contactInformation: "https://webaverse.com/", 
    allowExcessivelyViolentUsage:false,
    allowExcessivelySexualUsage:false,
    allowPoliticalOrReligiousUsage:false,
    allowAntisocialOrHateUsage:false,
    creditNotation:"required",
    allowRedistribution:false,
    modification:"prohibited"
  }
}

// function getVRMDefaultLookAt(){
//   return {
//     offsetFromHeadBone:[0,0,0],
//     applier:{
//       rangeMapHorizontalInner:{
//         inputMaxValue:90,
//         inputSacle:62.1
//       },
//       rangeMapHorizontalOuter:{
//         inputMaxValue:90,
//         inputSacle:68.6
//       },
//       rangeMapVerticalDown:{
//         inputMaxValue:90,
//         inputSacle:57.9
//       },
//       rangeMapVerticalUp:{
//         inputMaxValue:90,
//         inputSacle:52.8
//       }
//     },
//     type:"bone"
//   }

// }
function getHumanoidByBoneNames(skinnedMesh){
  const humanBones = {}
  skinnedMesh.skeleton.bones.map((bone)=>{
    for (const boneName in VRMHumanBoneName) {
      if (VRMHumanBoneName[boneName] === bone.name){
        humanBones[bone.name] ={node : bone};
        break;
      }
    }
  })
  return humanBones
}
function traverseWithDepth({ object3D, depth = 0, callback, result }) {
    result.push(callback(object3D, depth));
    const children = object3D.children;
    for (let i = 0; i < children.length; i++) {
        traverseWithDepth({ object3D: children[i], depth: depth + 1, callback, result });
    }
    return result;
}
const describe = (function () {
    const prefix = "  ";
    return function describe(object3D, indentation) {
        const description = `${object3D.type} | ${object3D.name} | ${JSON.stringify(object3D.userData)}`;
        let firstBone = "";
        if (object3D.type === "SkinnedMesh") {
            firstBone = "\n"
                .concat(prefix.repeat(indentation))
                .concat("First bone id: ")
                .concat(object3D.skeleton.bones[0].uuid);
        }
        let boneId = "";
        if (object3D.type === "Bone") {
            boneId = "\n".concat(prefix.repeat(indentation)).concat("Bone id: ").concat(object3D.uuid);
        }
        return prefix.repeat(indentation).concat(description).concat(firstBone).concat(boneId);
    };
})();
export function describeObject3D(root) {
    return traverseWithDepth({ object3D: root, callback: describe, result: [] }).join("\n");
}
