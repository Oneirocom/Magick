

export async function getChannelFromMessage(message: any, client: any): Promise<any> {
    let channelID = null;
    let latestTimestamp = 0;
    for (const [, channel] of client.channels.cache) {
        // Check if the channel is a text channel
        console.log("CHANNEL", channel)
        if (channel.type === 'text') {
            // Fetch the messages in the channel
            console.log("Channel name", channel.name)
            const messages = await channel.messages.fetch()
            console.log("MESSAGES", messages)
            // Sort the messages in descending order based on their timestamps
            const sortedMessages = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
            // Find the most recent message that matches the message content
            const recentMessage = sortedMessages.find(msg => msg.content === message.content);
            if (recentMessage && recentMessage.createdTimestamp > latestTimestamp) {
                console.log(`Message found in channel ${channel.name}: ${recentMessage.id}`);
                channelID = channel.id;
                latestTimestamp = recentMessage.createdTimestamp;
            }
        }
    }
    return channelID;
}