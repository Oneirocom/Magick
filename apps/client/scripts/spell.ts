const spell = {
  id: "demo@0.1.0",
  nodes: {
    2: {
      id: 2,
      data: {
        socketKey: "02c8ac4b-c7e5-45fc-9e6e-62680bd158e5",
        name: "name",
      },
      inputs: {},
      outputs: {
        output: {
          connections: [
            {
              node: 5,
              input: "name",
              data: {},
            },
          ],
        },
      },
      position: [-704.5584311572628, -73.13445406248034],
      name: "Module Input",
    },
    3: {
      id: 3,
      data: {
        socketKey: "22628386-aa18-40cd-8b6a-4e7c03fecb81",
        name: "text",
      },
      inputs: {},
      outputs: {
        output: {
          connections: [
            {
              node: 5,
              input: "text",
              data: {},
            },
          ],
        },
      },
      position: [-705.6770417976608, -207.50874335082628],
      name: "Module Input",
    },
    4: {
      id: 4,
      data: {
        socketKey: "1a819a65-e1e2-4f77-9a42-9f99f546f7c4",
        name: "trigger",
      },
      inputs: {},
      outputs: {
        trigger: {
          connections: [
            {
              node: 5,
              input: "trigger",
              data: {},
            },
          ],
        },
      },
      position: [-703.6864534694615, -338.11887296523986],
      name: "Module Trigger In",
    },
    5: {
      id: 5,
      data: {
        fewshot:
          'Change each statement to be in the third person present tense and correct all grammar.\n\nMatt: am sleepy.\nThird Person: Matt is sleepy.\n---\nMatt: bllogha bloghs.\nThird Person: Matt makes nonsensical sounds.\n--\nJackson: tell the king that you won\'t help him.\nThird Person: Jackson tells the king that he won\'t help him.\n---\nJill: can I have a mug of ale?\nThird Person: Jill says, "Can I have a mug of ale?"\n---\nSam: say i\'d be happy to help you\nThird Person: Sam says, "I\'d be happy to help you."\n---\nCogsworth: draw my sword of light and slice myself in the forehead.\nThird Person: Cogsworth draws his sword of light and slices himself in the forehead.\n---\nJon: say but you said I could have it. Please?\nThird Person: Jon says, "But you said I could have it. Please?"\n---\nEliza: ask my friend where he\'s going\nThird Person: Eliza asks her friend where he\'s going.\n---\nAaron: am sleepy.\nThird Person: Aaron is sleepy.\n---\nRobert: say I think I can resist it if you give me potion of Mind Shield. Do u have one?\nThird Person: Robert says, "I think I can resist it if you give me a potion of Mind Shield. Do you have one?"\n---\nJack: go talk to the knight\nThird Person: Jack goes to talk to the knight\n---\nJack: say What are you doing?!\nThird Person: Jack says, "What are you doing?!"\n---\nJames: I\'m confident that I can kill the dragon!\nThird Person: James says, "I\'m confident that I can kill the dragon!"\n---\nErica: want to go to the store but trip over my own shoes.\nThird Person: Erica wants to go to the store but she trips over her own shoes.\n---\nTom: told her that it was over.\nThird Person: Tom told her that it was over.\n---\nFred: ask what time is it?\nThird Person: Fred asks, "What time is it?"\n---\nJames: okay!\nThird Person: James says, "Okay!"\n--\nFred: command the mercenaries to attack the dragon while you rescue the princess.\nThird Person: Fred commands the mercenaries to attack the dragon while he rescues the princess.\n---\n',
      },
      inputs: {
        trigger: {
          connections: [
            {
              node: 4,
              output: "trigger",
              data: {},
            },
          ],
        },
        text: {
          connections: [
            {
              node: 3,
              output: "output",
              data: {},
            },
          ],
        },
        name: {
          connections: [
            {
              node: 2,
              output: "output",
              data: {},
            },
          ],
        },
      },
      outputs: {
        action: {
          connections: [
            {
              node: 21,
              input: "input",
              data: {},
            },
          ],
        },
        trigger: {
          connections: [
            {
              node: 21,
              input: "trigger",
              data: {},
            },
            {
              node: 20,
              input: "trigger",
              data: {},
            },
          ],
        },
      },
      position: [-281.2092672559847, -302.30118353826043],
      name: "Tense Transformer",
    },
    20: {
      id: 20,
      data: {
        socketKey: "a48cfd41-46c6-4c59-8292-45483dfbfa3b",
      },
      inputs: {
        trigger: {
          connections: [
            {
              node: 5,
              output: "trigger",
              data: {},
            },
          ],
        },
      },
      outputs: {},
      position: [156.14996337890625, -321.1500244140625],
      name: "Module Trigger Out",
    },
    21: {
      id: 21,
      data: {
        socketKey: "df7ecf3e-a2f9-4637-a2df-f05d59523030",
      },
      inputs: {
        input: {
          connections: [
            {
              node: 5,
              output: "action",
              data: {},
            },
          ],
        },
        trigger: {
          connections: [
            {
              node: 5,
              output: "trigger",
              data: {},
            },
          ],
        },
      },
      outputs: {},
      position: [154.16241455078125, -196.77505493164062],
      name: "Module Output",
    },
  },
};

export default spell;
