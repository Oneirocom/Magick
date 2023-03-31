// DOCUMENTED 
/**
 * Returns the value if it is within the range of min and max values.
 * Otherwise, returns the respective boundary value.
 *
 * @param value the input value to be clamped
 * @param min the minimum possible value
 * @param max the maximum possible value
 * @returns the clamped value
 */
function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
}

/**
 * A class representing a 3D world where users can interact with each other.
 * Has methods to manipulate the list of users and track their distances from each other.
 */
export class World3D {
  users: { [key: string]: number } = {};
  distances = {
    default: 5,
    same_topic: 1,
    conversation: 8.5,
    talk_to_other: 2,
    someone_elses_topic: -2,
    response: 8.5,
    min: 0,
    max: 10,
  };
  maxUsersInside = 50;

  /**
   * Creates a new World3D instance with a list of provided users.
   * The default initial distance between all users is 5.
   *
   * @param users an array of user names to add to the world
   */
  constructor(users: string[]) {
    users.forEach((user) => {
      this.users[user] = this.distances['default'];
    });
  }

  /**
   * Adds a new user to the world with the default initial distance of 5.
   *
   * @param user the name of the user to be added
   */
  addUser(user: string): void {
    this.users[user] = this.distances['default'];
  }

  /**
   * Removes the user from the world.
   *
   * @param user the name of the user to be removed
   */
  removeUser(user: string): void {
    if (this.users[user] !== undefined) {
      delete this.users[user];
    }
  }

  /**
   * Checks if the user exists in the world (i.e., if it has a defined distance value).
   *
   * @param user the name of the user to check for existence
   * @returns a boolean indicating whether the user exists in the world or not
   */
  userExists(user: string): boolean {
    return Boolean(this.users[user] !== undefined);
  }

  /**
   * Checks if the world is full, i.e., if it cannot accept new users beyond a certain limit.
   *
   * @returns a boolean indicating whether the world is full or not
   */
  isFull(): boolean {
    return Object.keys(this.users).length >= this.maxUsersInside;
  }

  /**
   * Checks if the world is empty, i.e., if it has no users.
   *
   * @returns a boolean indicating whether the world is empty or not
   */
  isEmpty(): boolean {
    return Object.keys(this.users).length === 0;
  }

  /**
   * Retrieves the current distance for a specific user in the world.
   *
   * @param user the name of the user whose distance is desired
   * @returns the current distance value for the user
   */
  getUsersDistance(user: string): number {
    return this.users[user];
  }

  /**
   * Increases the distance value for a user if they talked about the same topic as another user.
   *
   * @param user the name of the user who talked about the same topic
   */
  userTalkedSameTopic(user: string): void {
    this.users[user] += this.distances['same_topic'];
  }

  /**
   * Increases the distance value for a user if they talked about a topic initiated by another user.
   * If the other user can respond to the topic, the distance value is not changed.
   *
   * @param user the name of the user who talked about someone else's topic
   * @param otherUser the name of the user who initiated the topic
   */
  userTalkedWithSomeoneElsesTopic(user: string, otherUser: string): void {
    if (this.agentCanResponse(otherUser)) {
      this.userTalkedSameTopic(user);
      return;
    }

    this.users[user] += this.distances['someone_elses_topic'];
    this.users[user] = clamp(
      this.users[user],
      this.distances['min'],
      this.distances['max']
    );
  }

  /**
   * Sets the distance value for a user to the fixed value for a conversation.
   *
   * @param user the name of the user who entered into a conversation
   */
  userGotInConversationFromAgent(user: string): void {
    this.users[user] = this.distances['conversation'];
  }

  /**
   * Sets the distance value for a user to the fixed value for pinging someone else.
   *
   * @param user the name of the user who pinged someone else
   */
  userPingedSomeoneElse(user: string): void {
    this.users[user] = this.distances['talk_to_other'];
  }

  /**
   * Checks if a user can respond (i.e., their distance value is greater than or equal to the response threshold).
   *
   * @param user the name of the user to check for response ability
   * @returns a boolean indicating whether the user can respond or not
   */
  agentCanResponse(user: string): boolean {
    return this.users[user] >= this.distances['response'];
  }

  /**
   * Logs the current state of the world to the console.
   */
  print(): void {
    for (const user in this.users) {
      console.log(`user: ${user} - distance: ${this.users[user]}`);
    }
  }
}

export default World3D;