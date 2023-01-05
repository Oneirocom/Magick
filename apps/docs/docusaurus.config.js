// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'magick',
  tagline: 'A visual node editor for building AI powered data pipelines',
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
      navbar: {
        title: 'Home',
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
                label: 'magick Discord',
                href: 'https://discord.gg/MEqNmmzrtx',
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
        copyright: `Copyright © ${new Date().getFullYear()} MagickML`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  customFields: {
    magickLogo: 'img/magick-logo.png',
  },
}

module.exports = config
