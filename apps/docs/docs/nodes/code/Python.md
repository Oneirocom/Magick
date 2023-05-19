# Python

The code component is your swiss army knife when other components won't cut it. You can define any number of inputs and outputs on it, and then write a custom worker function. You have access to the data plugged into the inputs you created on your component, and can send data out along your outputs.

Please note that the return of your function must be an object whose keys are the same value as the names given to your output sockets. The incoming inputs argument is an object whose keys are the names you defined.
