// @ts-nocheck
import { useAddGreetingMutation, useGetGreetingsQuery } from "@/state/api/greetings";
import axios from "axios";
import { useEffect, useState } from "react";
import Greeting from "./Greeting";

const GreetingsManagerWindow = () => {
  const { data: greetings } = useGetGreetingsQuery()
  const [ addGreeting ] = useAddGreetingMutation()

  const createNew = async () => {
    try {
      await addGreeting({
        enabled: false,
        channelId: '',
        message: '',
        sendIn: ''
      })
    } catch (e) {
      console.log(e)
    }
  }
  
  return (
    <div className="agent-editor">
      {greetings && (greetings as any).map((greeting: any) => 
        <Greeting
          key={greeting.id}
          greeting={greeting}
        />
      )}
      <div className="entBtns">
        <button onClick={createNew}>Create New</button>
      </div>
    </div>
  )
}

export default GreetingsManagerWindow