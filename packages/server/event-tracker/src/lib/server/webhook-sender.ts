import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Class for sending webhooks to a specified URL using axios.
 * Is really nothing special, just a wrapper around axios to make it easier to send webhooks.
 * Intended to be used for the PortalBot on slack.
 * Could also it as a dep for a sendSlackWebhook node.
 */
export class WebhookSender {
  private url: string
  private defaultHeaders: { [key: string]: string }

  /**
   * Creates an instance of WebhookSender.
   * @param url - The URL to which the webhook will be sent.
   */
  constructor(url: string) {
    this.url = url
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Sends a request to the webhook URL with the provided data.
   * @param data - The data to be sent in the webhook request.
   * @returns The axios response from the request.
   */
  private async sendRequest(data: any): Promise<AxiosResponse<any>> {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: this.url,
      headers: this.defaultHeaders,
      data,
    }

    try {
      const response = await axios(config)
      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Axios error: ${error.message}`)
      } else {
        throw new Error(`Unexpected error: ${error}`)
      }
    }
  }

  /**
   * Sends data to the configured webhook URL.
   * @param data - The data to be sent to the webhook.
   */
  public async send(data: any): Promise<void> {
    await this.sendRequest(data)
  }

  /**
   * Sets a header for the webhook request.
   * @param key - The header key.
   * @param value - The header value.
   */
  public setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value
  }

  /**
   * Removes a header from the webhook request.
   * @param key - The header key to remove.
   */
  public removeHeader(key: string): void {
    delete this.defaultHeaders[key]
  }
}

export default WebhookSender
