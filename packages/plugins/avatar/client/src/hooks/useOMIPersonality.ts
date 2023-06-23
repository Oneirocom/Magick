import { useEffect, useState } from 'react'

export const useOMIPersonality = (oldVRM) => {

  const [newVRM, setNewVRM] = useState([])

  useEffect(() => {

    if(oldVRM) {
      oldVRM.scene.userData = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "OMI_personality",
        "description": "An extension for the glTF format that defines a personality for a node and an endpoint where additional information can be queried.",
        "type": "object",
        "properties": {
          "agent": {
            "type": "string",
            "description": oldVRM.scene.uuid,
            "maxLength": 128
          },
          "personality": {
            "type": "string",
            "description": "#agent has a cheerful personality."
          },
          "defaultMessage": {
            "type": "string",
            "description": "nya nya!"
          }
        },
        "required": ["agent", "personality"]
      }

      setNewVRM(oldVRM);
    }

  }, [oldVRM])

  return newVRM
}
