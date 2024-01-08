// DOCUMENTED
/**
 * Represents a single feature item, with a title, SVG icon and description.
 */
type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: React.JSX.Element;
};

/**
 * An array of FeatureItem objects, each representing a feature of the product.
 */
const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Powered by React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can be extended while reusing the same header and footer.
      </>
    ),
  },
];

/**
 * Renders a single feature based on its properties.
 *
 * @param {FeatureItem} feature - The feature to be rendered.
 *
 * @returns {React.JSX.Element} The Feature react element.
 */
function Feature({ title, Svg, description }: FeatureItem): React.JSX.Element {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* Renders the SVG icon for the feature */}
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        {/* Renders the title and description for the feature */}
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

/**
 * Renders a section containing all features of the product, using the Feature component.
 *
 * @returns {React.JSX.Element} The HomepageFeatures react element.
 */
export default function HomepageFeatures(): React.JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {/* Renders an array of features by mapping over the FeatureList array */}
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
