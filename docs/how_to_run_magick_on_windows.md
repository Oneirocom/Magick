## How to install Magick on Windows 11?

## Audience

Wish to be any common person that uses Windows 11..

Currently written for Magick developers.

## Describe the solution you'd like

## Magick on Windows 11

This documentation will guide you through the process of installing and setting up Magick on Windows 11.

## Prerequisites

1. Windows 11 is installed.

## Installation Steps

### 1. Install WSL

Follow the [official guide](https://docs.microsoft.com/en-us/windows/wsl/install) to install WSL on your Windows 11 system.

### 2. Install Ubuntu

Install Ubuntu from the Microsoft Store by visiting this [link](https://www.microsoft.com/store/productId/9PN20MSR04DW).

### 3. Set up Ubuntu

- Open the Windows Terminal app.
- Type `ubuntu` and press enter.
- Follow the prompts to set up your Ubuntu user account.

### 4. Update Ubuntu

Run the following commands to update your Ubuntu installation:

```bash
sudo apt update
sudo apt upgrade
```

### 5. Install Docker

Execute the following commands to install Docker:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose
sudo gpasswd -a $USER docker
```

### 6. Clone Magick Repository

Clone the Magick repository using `git clone`.

### 7. Install Magick Dependencies

Run the following commands to install the required dependencies:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo bash /tmp/nodesource_setup.sh
sudo apt install nodejs npm
```

**Note:** Node.js versions 12 and 16 are not supported.

Verify the installed Node.js version by running:

```bash
node -v
```

### 8. Set up Magick

In separate terminal instances, execute the following commands:

- Run `sudo docker compose up`.
- Run `npm run migrate`.

### 9. Start Magick Aide

Start Magick Aide with the following commands:

```bash
npm install
npm run dev
```

### 10. Run Academy Tutorials

Now you can proceed to run the Academy tutorials as needed.

### 11. Install Eliza

```git clone https://github.com/elizathecoder/ProjectEliza.git project-eliza```

Pending work to stabilize Eliza.

## Troubleshooting

If the spell window is not working. The docker instance is not running with the databases redis and postgresql.

If there's a buffer error when doing `npm run dev` it may be that docker is not allowed to ran by your user. Do `sudo gpasswd -a $USER docker`.

Sometimes you need to remove `node_modules`.

## Describe alternatives you've considered

Use [arch, fedora, rhel8, rockylinux8, ubuntu, popos] directly on a dual boot or dedicated boot to use magick.

## Additional context

Everyone on our team should be able to run eliza and complete the magick academy.
