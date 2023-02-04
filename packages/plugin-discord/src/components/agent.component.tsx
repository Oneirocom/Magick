//@ts-nocheck
import React, {FC, useState, useEffect} from 'react'
import { KeyInput } from './utils'
type PluginProps = { 
    agentData: any
    setDiscordValue: any
    spellList: any
}
export const DiscordAgentWindow: FC<PluginProps> = (props) => {
    props = props.props
    const [discord_enabled, setDiscordEnabled] = useState(undefined)
    const [discord_api_key, setDiscordApiKey] = useState('')
    const [discord_starting_words, setDiscordStartingWords] = useState('')
    const [discord_bot_name_regex, setDiscordBotNameRegex] = useState('')
    const [discord_bot_name, setDiscordBotName] = useState('')
    const [discord_empty_responses, setDiscordEmptyResponses] = useState('')
    const [discord_spell_handler_incoming, setDiscordSpellHandlerIncoming] =
        useState('')
    const [discord_spell_handler_update, setDiscordSpellHandlerUpdate] =
        useState('')
    useEffect(() => {
        if (props.agentData !== null && props.agentData !== undefined) {
            console.log(props.agentData)
            setDiscordEnabled(props.agentData.discord_enabled)
            setDiscordApiKey(props.agentData.discord_api_key)
            setDiscordStartingWords(props.agentData.discord_starting_words)
            setDiscordBotNameRegex(props.agentData.discord_bot_name_regex)
            setDiscordBotName(props.agentData.discord_bot_name)
            setDiscordEmptyResponses(props.agentData.discord_empty_responses)
            setDiscordSpellHandlerIncoming(props.agentData &&
            props.agentData.discord_spell_handler_incoming
            )
            setDiscordSpellHandlerUpdate(props.agentData.discord_spell_handler_update)
            props.setDiscordValue({
                discord_enabled : discord_enabled,
                discord_api_key : discord_api_key,
                discord_starting_words : discord_starting_words,
                discord_bot_name : discord_bot_name,
                discord_bot_name_regex : discord_bot_name,
                discord_empty_responses : discord_empty_responses,
                discord_spell_handler_incoming : discord_spell_handler_incoming,
                discord_spell_handler_update : discord_spell_handler_update
            })
        }      
    }, [])
    useEffect(() => {
      props.setDiscordValue({
        discord_enabled : discord_enabled,
        discord_api_key : discord_api_key || props.agentData.discord_api_key,
        discord_starting_words : discord_starting_words || props.agentData.discord_starting_words,
        discord_bot_name : discord_bot_name || props.agentData.discord_bot_name,
        discord_bot_name_regex : discord_bot_name || props.agentData.discord_bot_name_regex,
        discord_empty_responses : discord_empty_responses || props.agentData.discord_empty_responses,
        discord_spell_handler_incoming : discord_spell_handler_incoming || props.agentData.discord_spell_handler_incoming,
        discord_spell_handler_update : discord_spell_handler_update || props.agentData.discord_spell_handler_update
    })
        
    }, [discord_enabled, discord_api_key,discord_starting_words, discord_bot_name, discord_bot_name_regex, discord_empty_responses,discord_empty_responses, discord_empty_responses, discord_spell_handler_incoming, discord_spell_handler_update ])
    return (
        <>
        <div className="form-item">
            <span className="form-item-label">Discord Enabled</span>
            <input
              key={Math.random()}
              type="checkbox"
              value={discord_enabled}
              defaultChecked={discord_enabled}
              onChange={e => {
                setDiscordEnabled(e.target.checked)
              }}
            />
          </div>

          {discord_enabled && (
            <>
              <div className="form-item">
                <span className="form-item-label">Discord API Key</span>
                <KeyInput value={discord_api_key} setValue={setDiscordApiKey} secret={true} />
              </div>

              <div className="form-item">
                <span className="form-item-label">
                  Discord Starting Words - Separated by ,
                </span>
                <input
                  type="text"
                  defaultValue={discord_starting_words}
                  onChange={e => {
                    setDiscordStartingWords(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Discord Bot Name Regex</span>
                <input
                  type="text"
                  defaultValue={discord_bot_name_regex}
                  onChange={e => {
                    setDiscordBotNameRegex(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">Discord Bot Name</span>
                <input
                  type="text"
                  defaultValue={discord_bot_name}
                  onChange={e => {
                    setDiscordBotName(e.target.value)
                  }}
                />
              </div>

              <div className="form-item">
                <span className="form-item-label">
                  Discord Empty Responses - Separated by |
                </span>
                <input
                  type="text"
                  defaultValue={discord_empty_responses}
                  onChange={e => {
                    setDiscordEmptyResponses(e.target.value)
                  }}
                />
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">
                  Spell Handler (Incoming Message Handler)
                </span>
                <select
                  name="spellHandlerIncoming"
                  id="spellHandlerIncoming"
                  value={discord_spell_handler_incoming}
                  onChange={event => {
                    setDiscordSpellHandlerIncoming(event.target.value)
                  }}
                >
                  <option hidden></option>
                  {props.spellList.length > 0 &&
                    props.spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-item agent-select">
                <span className="form-item-label">Interval Update Handler</span>
                <select
                  name="spellHandlerUpdate"
                  id="spellHandlerUpdate"
                  value={discord_spell_handler_update}
                  onChange={event => {
                    setDiscordSpellHandlerUpdate(event.target.value)
                  }}
                >
                  <option value="null">
                    --Disabled--
                  </option>
                  {props.spellList.length > 0 &&
                    props.spellList.map((spell, idx) => (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}
        </>
    )
}