// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Magick',
  tagline: 'Documentation for .',
  url: 'https://magick.ml',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Oneirocom, Inc.', // Usually your GitHub org/user name.
  projectName: 'magick', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/oneirocom/magick/tree/development/apps/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      image: 'MAGICK- banner.png',
      navbar: {
        logo: {
          alt: 'Magick',
          src: 'img/Magick-purple-logo.png',
          height: 32,
        },
        items: [
          {
            type: 'doc',
            docId: 'Getting Started',
            position: 'left',
            label: 'Getting Started',
          },
          {
            type: 'doc',
            docId: 'core-concepts/Overview',
            position: 'left',
            label: 'Core Concepts',
          },
          {
            type: 'doc',
            docId: 'nodes/Overview',
            position: 'left',
            label: 'Nodes',
          },
          {
            type: 'doc',
            docId: 'connectors/Overview',
            position: 'left',
            label: 'Connectors',
          },
          {
            type: 'doc',
            docId: 'developer-guides/Setup',
            position: 'right',
            label: 'Developer Guides',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Magick Discord',
                href: 'https://discord.gg/magickml',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/oneirocom/magick',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Oneirocom Systems Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  customFields: {
    magickLogo: 'img/magick-banner-short.png',
  },
}

module.exports = config