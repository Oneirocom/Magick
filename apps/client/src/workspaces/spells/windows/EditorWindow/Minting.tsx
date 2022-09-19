import axios from 'axios'
import { useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { getAllUserNFTs } from '@psychedelic/dab-js'
import { HttpAgent } from '@dfinity/agent'
import { useSnackbar } from 'notistack'

import css from './editorwindow.module.css'

import WindowToolbar from '@components/Window/WindowToolbar'
import { useAuth } from '@/contexts/AuthProvider'
import { useGetSpellQuery, useNewSpellMutation } from '@/state/api/spells'
import { SimpleAccordion } from '@components/Accordion'
import Input from '@components/Input/Input'
// import Panel from '@components/Panel/Panel'
// import { useModal } from '@/contexts/ModalProvider'

// import { useEditor } from '@/workspaces/contexts/EditorProvider'
import { Mint } from '../../../../components/Mint/Mint'
import { usePlugWallet } from '@/contexts/PlugProvider'
import { useNavigate } from 'react-router'
import { thothApiRootUrl } from '@/config'

const MintingView = ({ open, setOpen, spellId, close }) => {
  const [nfts, setNfts] = useState<any>(null)
  const { getUserPrincipal, connected, userPrincipal } = usePlugWallet()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  // const { serialize } = useEditor()

  const { user } = useAuth()
  const { data: spell } = useGetSpellQuery(
    {
      spellId: spellId,
      userId: user?.id as string,
    },
    {
      skip: !spellId,
    }
  )

  const buildUrl = url => {
    return `https://urltorunspellnft.com`
  }

  // @ts-ignore
  const getNFTCollections = async () => {
    const host = 'https://ic0.app'
    const agent = new HttpAgent({ host })
    const principal = await getUserPrincipal()
    const collections = await getAllUserNFTs({
      agent,
      user: principal,
    })

    return collections
  }

  const getSpellNfts = async () => {
    try {
      const nftCollections = await getNFTCollections()

      const tokens = nftCollections.filter(c => c.name === 'Cipher')[0].tokens

      const spellNfts = tokens.map(t => ({
        index: Number(t.index.toString()),
        spell: JSON.parse(t.metadata.json.value.TextContent),
        url: t.url,
      }))

      setNfts(spellNfts)
    } catch (err) {
      console.log('error getting nft collections')
    }
  }

  const onRefresh = () => {
    ;(async () => {
      await getSpellNfts()
    })()
  }

  const copy = url => {
    const el = document.createElement('textarea')
    el.value = url
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    enqueueSnackbar('Url copied')
  }

  useEffect(() => {
    console.log('userPrincipal', userPrincipal)
    if (!connected || !userPrincipal) return
    ;(async () => {
      await getSpellNfts()
    })()
  }, [connected, userPrincipal])

  const loadSpell = spell => {
    if (!user) return
    console.log('loading spell!', spell)
    ;(async () => {
      // Clean old user ID from the spell name
      const cleanedName = spell.name.split('--')[0]
      // make a new spell name for the new user
      const name = `${cleanedName}--${user.id}`
      // check if spell exists

      try {
        const url = `${thothApiRootUrl}/game/spells/${name}?userId=${user.id}`
        console.log('url', url)
        const spellResponse = await axios.get(url)

        console.log('Spell response', spellResponse)

        if (!spellResponse) {
          const savedSpell = await useNewSpellMutation({
            ...spell,
            name,
            userId: user.id,
            user: user.id,
          })

          console.log('savedSpell', savedSpell)

          // check this call for errors
        }
      } catch (err) {
        const url = `${thothApiRootUrl}/game/spells?userId=${user.id}`
        const body = {
          ...spell,
          name,
          userId: user.id,
          user: user.id,
        }
        const savedSpell = await axios.post(url, body)

        console.log('savedSpell', savedSpell)
      }

      navigate(`/thoth/${name}`)
    })()
  }

  // const { openModal, closeModal } = useModal()
  // const { enqueueSnackbar } = useSnackbar()

  return (
    <div className={`${css['deploy-shield']} ${css[!open ? 'inactive' : '']}`}>
      <div
        className={`${css['deploy-window']} ${css[!open ? 'inactive' : '']}`}
      >
        <div
          style={{
            backgroundColor: 'var(--dark-3)',
            padding: 'var(--c1)',
            paddingBottom: 0,
            borderBottom: '1px solid var(--dark-2)',
          }}
        >
          <WindowToolbar>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Your Spell NFTs
            </div>
            <Mint data={spell} onSuccess={onRefresh} />
            <button
              onClick={() => {
                onRefresh()
              }}
            >
              Refresh
            </button>
            <button
              onClick={() => {
                setOpen(false)
              }}
            >
              Cancel
            </button>
          </WindowToolbar>
        </div>
        <Scrollbars>
          {!nfts || nfts.length === 0 ? (
            <p className={css['message']}>
              You have no NFTs in your wallet. <br /> Press "Mint" to mint your
              current spwell into an NFT.
            </p>
          ) : (
            <>
              {nfts.map((nft, i) => {
                return (
                  <SimpleAccordion
                    key={nft.spell.name + i}
                    heading={`${nft.spell.name}`}
                    defaultExpanded={false}
                  >
                    <button
                      className={css['load-button'] + ' extra-small'}
                      onClick={() => {
                        loadSpell(nft.spell)
                      }}
                    >
                      Load
                    </button>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      }}
                    >
                      <p> Endpoint URL </p>
                      <div
                        style={{
                          display: 'flex',
                          flex: 1,
                          gap: 'var(--c1)',
                          width: '100%',
                        }}
                      >
                        <Input
                          style={{ flex: 1 }}
                          value={buildUrl(nft.url)}
                          readOnly
                        />
                        <button onClick={() => copy(buildUrl(nft.url))}>
                          copy
                        </button>
                      </div>
                    </div>
                  </SimpleAccordion>
                )
              })}
            </>
          )}
        </Scrollbars>
      </div>
    </div>
  )
}

export default MintingView
