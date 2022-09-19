import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './index.module.css'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import ThothDemo from '../components/HomepageFeatures/ThothDemo'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        {/* <h1 className="hero__title">{siteConfig.title}</h1> */}
        <img src={siteConfig.customFields.thothLogo} />
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/creators/gettingStarted/CreatorWelcome"
            // style={{ marginRight: '2%' }}
          >
            Creators
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/developers/getting%20started/installingThoth"
          >
            Developers
          </Link>
          <div className={styles.githubButtons}>
            <iframe
              src="https://ghbtns.com/github-btn.html?user=latitudegames&repo=thoth&type=star&count=true&size=large&v=2"
              frameborder="0"
              scrolling="0"
              width="170"
              height="30"
              title="GitHub"
            ></iframe>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
        <ThothDemo />
      </main>
    </Layout>
  )
}
