// DOCUMENTED 
import World3D from './world3d';

/**
 * A class to manage users and their actions in 3D world.
 */
export class WorldManager {
  private rooms: Record<string, World3D[]> = {};

  constructor() {
    this.rooms = {};
  }

  /**
   * Adds a user to a room associated with a client.
   * @param user User to add
   * @param client Client identifier
   */
  addUser(user: string, client: string): void {
    // If client's rooms exist
    if (this.rooms[client]) {
      // Iterate through rooms and add user to a non-full room
      for (const room of this.rooms[client]) {
        if (!room.isFull()) {
          room.addUser(user);
          return;
        }
      }
      // Or create a new room if no suitable room found
      this.rooms[client].push(new World3D([user]));
    } else {
      // If client's rooms don't exist, create rooms array and add user
      this.rooms[client] = [new World3D([user])];
    }
  }

  /**
   * Removes a user from a room associated with a client.
   * @param user User to remove
   * @param client Client identifier
   */
  removeUser(user: string, client: string): void {
    // If client's rooms exist
    if (this.rooms[client]) {
      // Iterate through rooms
      for (let i = 0; i < this.rooms[client].length; i++) {
        // If user exists in a room
        if (this.rooms[client][i].userExists(user)) {
          // Remove user and remove the room if empty
          this.rooms[client][i].removeUser(user);
          if (this.rooms[client][i].isEmpty()) {
            this.rooms[client].splice(i, 1);
            // Remove client key if no rooms left
            if (this.rooms[client].length === 0) {
              delete this.rooms[client];
            }
          }
          return;
        }
      }
    }
  }

  /**
   * Gets the distance between users in a room.
   * @param user User to check distance for
   * @param client Client identifier
   * @returns Users distance or undefined
   */
  getUsersDistance(user: string, client: string): number | undefined {
    // If client's rooms exist
    if (this.rooms[client]) {
      // Iterate through rooms and get users distance if user exists
      for (const room of this.rooms[client]) {
        if (room.userExists(user)) {
          return room.getUsersDistance(user);
        }
      }
    }

    // If not found, add user and call the function again
    this.addUser(user, client);
    return this.getUsersDistance(user, client);
  }

  // Similar pattern for following functions
  userTalkedSameTopic(user: string, client: string): number | undefined {
    if (this.rooms[client]) {
      for (const room of this.rooms[client]) {
        if (room.userExists(user)) {
          room.userTalkedSameTopic(user);
          return room.getUsersDistance(user);
        }
      }
    }

    this.addUser(user, client);
    return this.userTalkedSameTopic(user, client);
  }

  userGotInConversationFromAgent(user: string, client: string): number | undefined {
    if (this.rooms[client]) {
      for (const room of this.rooms[client]) {
        if (room.userExists(user)) {
          room.userGotInConversationFromAgent(user);
          return room.getUsersDistance(user);
        }
      }
    }

    this.addUser(user, client);
    return this.userGotInConversationFromAgent(user, client);
  }

  userPingedSomeoneElse(user: string, client: string): number | undefined {
    if (this.rooms[client]) {
      for (const room of this.rooms[client]) {
        if (room.userExists(user)) {
          room.userPingedSomeoneElse(user);
          return room.getUsersDistance(user);
        }
      }
    }

    this.addUser(user, client);
    return this.userPingedSomeoneElse(user, client);
  }

  /**
   * Checks if agent can respond in a room.
   * @param user User to check
   * @param client Client identifier
   * @returns True if agent can respond, false otherwise
   */
  agentCanResponse(user: string, client: string): boolean {
    // If client's rooms exist
    if (this.rooms[client]) {
      // Iterate through rooms and return agent response status if user exists
      for (const room of this.rooms[client]) {
        if (room.userExists(user)) {
          return room.agentCanResponse(user);
        }
      }
    }

    // If not found, add user and return false
    this.addUser(user, client);
    return false;
  }

  /**
   * Prints the rooms and their states.
   */
  print(): void {
    for (const client in this.rooms) {
      console.log(`${client} rooms:`);

      if (this.rooms[client]) {
        for (const room of this.rooms[client]) {
          room.print();
        }
      } else {
        console.log('no rooms');
      }

      console.log('----------------');
    }
  }
}