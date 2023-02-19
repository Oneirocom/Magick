import Panel from '../../../components/Panel/Panel'
import css from '../homeScreen.module.css'

const TemplatePanel = ({ template, setSelectedTemplate, selectedTemplate }) => {
  const isSelected =
    selectedTemplate?.label && selectedTemplate.label === template.label
  return (
    <div
      className={`${css['template-container']} ${
        css[isSelected && 'selected']
      }`}
      onClick={() => {
        setSelectedTemplate(template)
      }}
    >
      <Panel
        shadow
        style={{
          width: 'var(--c20)',
          height: 'var(--c12)',
          backgroundColor: 'var(--dark-3)',
          backgroundImage: `url(${template.bg})`,
        }}
        className={css['template-panel']}
      ></Panel>
      <p>{template.label}</p>
    </div>
  )
}

export default TemplatePanel
