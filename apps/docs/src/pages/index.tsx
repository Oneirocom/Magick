// DOCUMENTED
/**
 * Imports
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';
// import banner from '@site/static/img/wizard.png';

/**
 * Renders the header section of the homepage
 */
function HomepageHeader(): React.JSX.Element {
  // const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx(styles.heroBanner)}>
      <div className='container' style={{ padding: '5em 0' }}>
        <h1 className='hero__title'>Your Journey Is About To Begin</h1>
        <div className={styles.buttons}>
          {/* Use Link component for internal links */}
          <Link
            className='button button--secondary button--lg'
            to='/docs/Getting Started'
          >
            Start Here
          </Link>
        </div>
      </div>
    </header>
  );
}

/**
 * Home component that renders the homepage
 * @returns {React.JSX.Element}
 */
export default function Home(): React.JSX.Element {
  // const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Magick IDE Docs`}
      description='Creator and developer documentation for Magick.'
    >
      <main>
        {/* Render header section with HomepageHeader component */}
        <HomepageHeader />
        {/* <img src={banner} style={{ width: '100%' }} alt='Hero banner' /> */}
      </main>
    </Layout>
  );
}
