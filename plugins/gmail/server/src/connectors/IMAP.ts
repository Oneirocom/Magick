// Library imports.
import { ParsedMail, simpleParser } from 'mailparser';
import ImapClient from 'emailjs-imap-client';

// App imports.
import { IServerInfo } from './IServerInfo'


// Define interface to describe a mailbox and optionally a specific message
// to be supplied to various methods here.
export interface ICallOptions {
  mailbox: IMailbox,
  id?: number
}


// Define interface to describe a received message.  Note that body is optional since it isn't sent when listing
// messages.
export interface IMessage {
  id: string,
  date: string,
  from: string,
  subject: string,
  body?: string
}


// Define interface to describe a mailbox.
export interface IMailbox {
  name: string,
  path: string
}

// Disable certificate validation (less secure, but needed for some servers).
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// The worker that will perform IMAP operations.
export class Worker {
  client: ImapClient;

  // Server information.
  private static serverInfo: IServerInfo;


  /**
   * Constructor.
   */
  constructor(inServerInfo: IServerInfo) {
    Worker.serverInfo = inServerInfo;

  } /* End constructor. */


  /**
   * Connect to the SMTP server and return a client object for operations to use.
   *
   * @return An ImapClient instance.
   */
  async connectToServer(): Promise<ImapClient> {
    console.log('Worker.serverInfo', Worker.serverInfo)
    // noinspection TypeScriptValidateJSTypes
    this.client = new ImapClient(
      Worker.serverInfo.imap.host,
      Worker.serverInfo.imap.port,
      { auth : Worker.serverInfo.imap.auth }
    );

    this.client.logLevel = this.client.LOG_LEVEL_DEBUG;
    this.client.onerror = (inError: Error) => {
      console.log("IMAP.Worker.listMailboxes(): Connection error", inError);
    };
    console.log('connecting')
    try {
      await this.client.connect();
    } catch (e) {
      console.log('error', e)
    }
    console.log('connected')
    console.log("IMAP.Worker.listMailboxes(): Connected");
    
    return this.client;

  } /* End connectToServer(). */


  /**
   * Returns a list of all (top-level) mailboxes.
   *
   * @return An array of objects, on per mailbox, that describes the nmilbox.
   */
  public async listMailboxes(): Promise<IMailbox[]> {
    if(!this.client) {
      await this.connectToServer()
    }

    const mailboxes: any = await this.client.listMailboxes();
    console.log('mailboxes', mailboxes)

    // Translate from emailjs-imap-client mailbox objects to app-specific objects.  At the same time, flatten the list
    // of mailboxes via recursion.
    const finalMailboxes: IMailbox[] = [];
    const iterateChildren = (inArray: any[]): void => {
      inArray.forEach((inValue: any) => {
        finalMailboxes.push({
          name : inValue.name,
          path : inValue.path
        });
        iterateChildren(inValue.children);
      });
    };
    iterateChildren(mailboxes.children);

    return finalMailboxes;

  } /* End listMailboxes(). */


  /**
   * Lists basic information about messages in a named mailbox.
   *
   * @param inCallOptions An object implementing the ICallOptions interface.
   * @return              An array of objects, one per message.
   */
  public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {

    console.log("IMAP.Worker.listMessages()", inCallOptions);

    // We have to select the mailbox first.  This gives us the message count.
    const mailbox: any = await this.client.selectMailbox(inCallOptions.mailbox);
    console.log(`IMAP.Worker.listMessages(): Message count = ${mailbox.exists}`);

    // If there are no messages then just return an empty array.
    if (mailbox.exists === 0) {
      return [ ];
    }

    // Okay, there are messages, let's get 'em!  Note that they are returned in order by uid, so it's FIFO.
    // noinspection TypeScriptValidateJSTypes
    const messages: any[] = await this.client.listMessages(
      inCallOptions.mailbox,
      "1:*",
      [ "uid", "envelope" ]
    );

    // Translate from emailjs-imap-client message objects to app-specific objects.
    const finalMessages: IMessage[] = [];
    messages.forEach((inValue: any) => {
      finalMessages.push({
        id : inValue.uid,
        date: inValue.envelope.date,
        from: inValue.envelope.from[0].address,
        subject: inValue.envelope.subject
      });
    });

    return finalMessages;

  } /* End listMessages(). */


  /**
   * Gets the plain text body of a single message.
   *
   * @param  inCallOptions An object implementing the ICallOptions interface.
   * @return               The plain text body of the message.
   */
  public async getMessageBody(inCallOptions: ICallOptions): Promise<string|boolean> {

    console.log("IMAP.Worker.getMessageBody()", inCallOptions);

    // noinspection TypeScriptValidateJSTypes
    const messages: any[] = await this.client.listMessages(
      inCallOptions.mailbox,
      inCallOptions.id,
      [ "body[]" ],
      { byUid : true }
    );
    //console.log(messages[0]["body[]"]);
    const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);

    //return parsed.text;
    return parsed.text+"\n\n"+parsed.html;

  } /* End getMessageBody(). */


  /**
   * Deletes a single message.
   *
   * @param inCallOptions An object implementing the ICallOptions interface.
   */
  public async deleteMessage(inCallOptions: ICallOptions): Promise<any> {

    console.log("IMAP.Worker.deleteMessage()", inCallOptions);

    await this.client.deleteMessages(
      inCallOptions.mailbox,
      inCallOptions.id,
      { byUid : true }
    );

  } /* End deleteMessage(). */


} /* End class. */
