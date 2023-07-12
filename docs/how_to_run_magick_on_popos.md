## How to install Magick on Windows 11?

## Audience

Wish to be any common person that uses Windows 11..

Currently written for Magick developers.

## Describe the solution you'd like

## Magick on Popos

This documentation will guide you through the process of installing and setting up Magick on Windows 11.

## Installation Steps

### 1. Prerequisites

1. Popos is installed.

### 2. Install Popos

Install Popos https://pop.system76.com/.

Currently Popos 22.04 LTS.

### 4. Update Popos

Run the following commands to update your Popos installation:

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
sudo apt install nodejs 
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

## Troubleshooting

If the spell window is not working. The docker instance is not running with the databases redis and postgresql.

If there's a buffer error when doing `npm run dev` it may be that docker is not allowed to ran by your user. Do `sudo gpasswd -a $USER docker`.

Sometimes you need to remove `node_modules`.

## Describe alternatives you've considered

Use [arch, fedora, rhel8, rockylinux8, ubuntu, wsl] directly on a dual boot or dedicated boot to use magick.
