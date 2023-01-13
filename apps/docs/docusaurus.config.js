// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Magick',
  tagline: 'A low code IDE for building AI driven experiences and agents.',
  url: 'https://magick.ml',
  baseUrl: '/',
  onBrokenLinks: 'throw',
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
          editUrl: 'https://github.com/oneirocom/magickml/tree/main/docs',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/oneirocom/magickml/tree/main/docs',
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
        defaultMode: 'light',
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
            docId: 'intro',
            position: 'left',
            label: 'Intro',
          },
          {
            type: 'doc',
            docId: 'core-concepts/ConceptsOverview',
            position: 'left',
            label: 'Concepts',
          },
          {
            type: 'doc',
            docId: 'creators/gettingStarted/CreatorWelcome',
            position: 'left',
            label: 'Creators',
          },
          {
            type: 'doc',
            docId: 'developers/getting started/intro',
            position: 'left',
            label: 'Developers',
          },
          // { to: "/blog", label: "Blog", position: "left" },
          {
            href: 'https://github.com/oneirocom/magickml',
            label: 'GitHub',
            position: 'right',
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
                href: 'https://discord.gg/8WkayXw8a4',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: "Blog",
              //   to: "/blog",
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/oneirocom/magickml',
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
