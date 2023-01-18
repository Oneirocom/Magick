/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from 'axios'
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Call a Jupyter Notebook with the given name and inputs, and return the output.'

type WorkerReturn = {
  output: any
}

const removeProtocol = (url) => {
  if (!url) {
      return '';
  }

  return url.replace(/(^\w+:|^)\/\//, '');
}

function getPromiseFromEvent(item, event) {

  return new Promise<void>((resolve) => {
    const listener = (e) => {
      e = JSON.parse(e.data)
      if (e['msg_type'] == "stream") {
        item.removeEventListener(event, listener);
        resolve();
      }
      
    }
    item.addEventListener(event, listener);
  })
}


export class JupyterNotebook extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Jupyter Notebook')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'I/O'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
    })

    //The URL of the Jupyter Server
    const url = new InputControl({
      dataKey: 'url',
      name: 'Base URL',
      icon: 'moon',
    })
    //To be Supplied if Authorization is Turned on the server
    const authorization_key = new InputControl({
      dataKey: 'Authorization',
      name: 'Authorization Header',
      icon: 'moon',
    })
    //Exact File name including the extension
    const file_name = new InputControl({
      dataKey: 'file_name',
      name: 'File Name',
      icon: 'moon',
    })

    node.inspector.add(nameControl).add(inputGenerator).add(url).add(file_name).add(authorization_key)

    return node.addInput(dataInput).addOutput(dataOutput).addOutput(outp)
  }
  

  async worker(
    node: NodeData,
    rawInputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ) {

    const name = node.data.name as string
    node.name = name

    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    //URL of the Jupyter Server Eg: http://localhost:8888 (No Slash at the end)
    let url = node?.data?.url as string
    let authorization_key = node?.data?.url as string
    authorization_key = "Token " + authorization_key
    let config = {
      headers: {
        "Authorization": authorization_key,
      },
    };
    //Gets the Active Kernel from the Jupyter Tornado Server (REST/POST)
    let kernel = await axios.post(url + '/api/kernels' + "?timestamp=" + Math.random().toString(36), config)
    let notebook_path = "/" + node?.data?.file_name as string
    
    //Gets the Cell Contents of the notebook of which the filename is specified (REST/GET)
    let file = await axios.get(url + '/api/contents' + notebook_path + "?timestamp=" + Math.random().toString(36), config)
    
    //Selects the last cell
    let code = file['data']['content']['cells']
    if (code.slice(-1)[0]['source'] == "") {
      code = code.slice(-2)
    } else {
      code = code.slice(-1)
    }

    //Create a UUID for exectuion
    let uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    //Initializing the WebSocket link with the Jupyter Server
    let ws = new WebSocket("ws://" + removeProtocol(url) + '/api/kernels/' + kernel['data']['id'] + "/channels"+"?timestamp=" + Math.random().toString(36));
    
    //Specifc Headers Required for Code Execution
    let msg_type = 'execute_request';
    let content = { 'code': code['0']['source'], 'silent': false }
    let hdr = {
      'msg_id': parseInt(uniqueId, 10).toString(16),
      'username': 'test',
      'session': parseInt(uniqueId, 10).toString(16),
      'data': Date.now(),
      'msg_type': msg_type,
      'version': '5.0'
    }
    let msg = {
      'header': hdr, 'parent_header': hdr,
      'metadata': {},
      'content': content
    }

    //Event Listner for Socket Connection open event
    ws.onopen = function (e) {
      this.send(JSON.stringify(msg))
    }

    var code_output = "Nothing"
    //Event Listener when the server responds back with the code
    ws.onmessage = async function (e) {
      e = JSON.parse(e.data)
      code_output = "Hello This is text"
      if (e['msg_type'] == "stream") {
        //Wait till the message with 'stream' status is obtained then the promise is resolved
        code_output = await e['content']["text"];
      }
    }
    await getPromiseFromEvent(ws, "message")
    return {
      output: code_output ? (code_output as any) : '',
    }
  }
}
