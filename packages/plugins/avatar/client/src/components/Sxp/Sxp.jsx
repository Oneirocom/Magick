import { useEffect, useState } from 'react'
import { useZustand } from '../../store/useZustand'
import { useSpellList } from '../../hooks/useSpellList'
import { useOMIPersonality } from '../../hooks/useOMIPersonality'
import styles from '../../App.module.css'

export const Sxp = () => {

  const [name, setName] = useState('Eliza')
  const [spellName, setSpellName] = useState('')
  const [properties, setProperties] = useState(null)

  const { avatarVrm } = useZustand()
  const spellList = useSpellList()
  const newVRM = useOMIPersonality(avatarVrm)

  const traverseNodes = (object, callback) => {
    if (!object) return;
    object.traverse((child) => {
      if (child.isMesh) {
        callback(child);
      }
    });
  };

  useEffect(() => {
    if (newVRM) {
      try {
        const gltf = newVRM;
        traverseNodes(gltf.scene, (node) => {
          if (gltf.scene.userData) {
            setProperties(gltf.scene.userData.properties)
          }
        });
      } catch (error) {
        console.error('Error loading the model:', error);
      }
    }
  }, [newVRM])

  useEffect(() => {
    if (spellName) return
    if (spellList.length > 0) {
      setSpellName(spellList[0].name)
    }
  }, [spellList])

  return (
    <div className={styles.sxpContainer}>
      <div className={styles.sxpItems}>
        <span className={styles.sxpItemTitle}>Agent: </span>{properties ? properties.agent.description : ''}
      </div>
      <div className={styles.sxpItems}>
        <span className={styles.sxpItemTitle}>Personality: </span>{properties ? properties.personality.description : ''}
      </div>
    </div>
  )
}
