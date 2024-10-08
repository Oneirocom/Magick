// DOCUMENTED
import { Panel } from 'client/core'
import css from './templatePanel.module.css'

/**
 * A functional component that represents a single template panel.
 *
 * @param {object} props - The properties passed to the component.
 * @param {object} props.template - The template object for the panel.
 * @param {function} props.setSelectedTemplate - A function to set the selected template.
 * @param {object} props.selectedTemplate - The currently selected template.
 * @returns {React.JSX.Element} The TemplatePanel component.
 */
const TemplatePanel = ({
  template,
  setSelectedTemplate,
  selectedTemplate,
}: {
  template: any
  setSelectedTemplate: (template: any) => void
  selectedTemplate: any
}): React.JSX.Element => {
  // Determine if the current template is selected
  const isSelected =
    selectedTemplate?.name && selectedTemplate.name === template.name

  /**
   * A function to handle when the panel is clicked.
   *
   * @returns {void}
   */
  const handleClick = (): void => {
    setSelectedTemplate(template)
  }

  return (
    // Create a wrapper div and set isSelected and onClick
    <div
      className={`${css['template-container']} ${
        css[isSelected && 'selected']
      }`}
      onClick={handleClick}
    >
      {/* Create the panel with styling and the background image */}
      <Panel
        shadow
        style={{
          width: 'var(--c18)',
          height: 'var(--c18)',
          backgroundColor: 'var(--background-color)',
          backgroundImage: `url(${template.bg})`,
        }}
        className={css['template-panel']}
      ></Panel>
      {/* Display the template name as a paragraph */}
      <p>{template.name}</p>
    </div>
  )
}

export default TemplatePanel
