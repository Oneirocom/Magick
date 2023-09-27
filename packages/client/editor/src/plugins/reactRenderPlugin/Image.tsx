// DOCUMENTED
/**
 * Props that represent the data to be passed to Image component
 */
type ImageProps = {
  /** The source URL for the image to be displayed */
  imgSRC: string
}

/**
 * Image React component. Displays an image with the provided URL.
 * @param props Component props.
 * @returns Image component.
 */
export default function Image(props: ImageProps): JSX.Element {
  const { imgSRC } = props
  return <img src={imgSRC} alt="Preview" />
}
